/**
 * Cell Manager - Zero-render table cell width management using DOM manipulation
 * 
 * This utility creates a cell manager that allows right-clicking on table headers
 * to resize or hide columns without triggering React renders.
 */

/**
 * Creates a cell manager
 * @param {Object} options Configuration options
 * @param {boolean} options.debug Enable debug logging
 * @param {string} options.tableSelector CSS selector for the table to manage
 * @param {number} options.minWidth Minimum column width in pixels (default: 50)
 * @param {number} options.maxWidth Maximum column width in pixels (default: 500)
 * @param {boolean} options.rtl Whether the table is in RTL mode (default: true)
 * @returns {Object} Cell manager methods
 */
export const createCellManager = (options = {}) => {
  const { 
    debug = false, 
    tableSelector = '.MuiTable-root',
    minWidth = 50,
    maxWidth = 500,
    rtl = true // Default to RTL for Persian/Arabic interfaces
  } = options;
  
  // Track column widths
  const columnWidths = new Map();
  
  // Keep track of hidden columns
  const hiddenColumns = new Set();
  
  // Reference to the context menu element
  let contextMenu = null;
  
  // Reference to the resize handle
  let resizeHandle = null;
  
  // State for the current resize operation
  let resizing = {
    active: false,
    column: null,
    startX: 0,
    startWidth: 0
  };
  
  /**
   * Logs a debug message if debug mode is enabled
   * @param {string} message The message to log
   * @param {any} data Additional data to log
   */
  const log = (message, data) => {
    if (debug) {
      console.log(`📏 CellManager: ${message}`, data || '');
    }
  };
  
  /**
   * Creates and adds the context menu to the DOM
   */
  const createContextMenu = () => {
    // Check if the context menu already exists
    if (document.getElementById('table-header-context-menu')) {
      return;
    }
    
    // Create the context menu element
    contextMenu = document.createElement('div');
    contextMenu.id = 'table-header-context-menu';
    contextMenu.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      padding: 5px 0;
      min-width: 150px;
      z-index: 9999;
      display: none;
      direction: rtl;
    `;
    
    // Create the menu items
    const resizeOption = document.createElement('div');
    resizeOption.className = 'context-menu-item';
    resizeOption.textContent = 'تغییر اندازه ستون';
    resizeOption.style.cssText = `
      padding: 8px 12px;
      cursor: pointer;
      font-size: 14px;
    `;
    resizeOption.onmouseover = () => { resizeOption.style.backgroundColor = '#f0f0f0'; };
    resizeOption.onmouseout = () => { resizeOption.style.backgroundColor = 'transparent'; };
    
    const hideOption = document.createElement('div');
    hideOption.className = 'context-menu-item';
    hideOption.textContent = 'پنهان کردن ستون';
    hideOption.style.cssText = `
      padding: 8px 12px;
      cursor: pointer;
      font-size: 14px;
    `;
    hideOption.onmouseover = () => { hideOption.style.backgroundColor = '#f0f0f0'; };
    hideOption.onmouseout = () => { hideOption.style.backgroundColor = 'transparent'; };
    
    // Add menu items to the context menu
    contextMenu.appendChild(resizeOption);
    contextMenu.appendChild(hideOption);
    
    // Add the context menu to the body
    document.body.appendChild(contextMenu);
    
    log('Context menu created');
  };
  
  /**
   * Creates and adds the resize handle to the DOM
   */
  const createResizeHandle = () => {
    // Check if the resize handle already exists
    if (document.getElementById('table-column-resize-handle')) {
      return;
    }
    
    // Create the resize handle element
    resizeHandle = document.createElement('div');
    resizeHandle.id = 'table-column-resize-handle';
    resizeHandle.style.cssText = `
      position: absolute;
      width: 5px;
      background: #1976d2;
      cursor: col-resize;
      opacity: 0.5;
      z-index: 1000;
      display: none;
    `;
    
    // Add the resize handle to the body
    document.body.appendChild(resizeHandle);
    
    log('Resize handle created');
  };
  
  /**
   * Shows the context menu at the specified coordinates
   * @param {number} x X coordinate
   * @param {number} y Y coordinate
   * @param {HTMLElement} target The cell element that was right-clicked
   */
  const showContextMenu = (x, y, target) => {
    if (!contextMenu) {
      createContextMenu();
    }
    
    // Store reference to target cell
    contextMenu.targetCell = target;
    
    // Position the menu
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.display = 'block';
    
    // Set up click events for menu items
    const resizeOption = contextMenu.querySelector('.context-menu-item:first-child');
    const hideOption = contextMenu.querySelector('.context-menu-item:last-child');
    
    // Clear previous event listeners
    const newResizeOption = resizeOption.cloneNode(true);
    const newHideOption = hideOption.cloneNode(true);
    
    resizeOption.parentNode.replaceChild(newResizeOption, resizeOption);
    hideOption.parentNode.replaceChild(newHideOption, hideOption);
    
    // Add event listeners to new elements
    newResizeOption.addEventListener('click', () => {
      startColumnResize(contextMenu.targetCell);
      hideContextMenu();
    });
    
    newHideOption.addEventListener('click', () => {
      hideColumn(contextMenu.targetCell);
      hideContextMenu();
    });
    
    // Add mouseover/mouseout effects
    newResizeOption.onmouseover = () => { newResizeOption.style.backgroundColor = '#f0f0f0'; };
    newResizeOption.onmouseout = () => { newResizeOption.style.backgroundColor = 'transparent'; };
    newHideOption.onmouseover = () => { newHideOption.style.backgroundColor = '#f0f0f0'; };
    newHideOption.onmouseout = () => { newHideOption.style.backgroundColor = 'transparent'; };
    
    log('Context menu shown', { x, y, target });
  };
  
  /**
   * Hides the context menu
   */
  const hideContextMenu = () => {
    if (contextMenu) {
      contextMenu.style.display = 'none';
    }
  };
  
  /**
   * Shows the resize handle for a specific column
   * @param {HTMLElement} cell The header cell element
   */
  const startColumnResize = (cell) => {
    if (!resizeHandle) {
      createResizeHandle();
    }
    
    // Get cell position and dimensions
    const cellRect = cell.getBoundingClientRect();
    const tableRect = cell.closest(tableSelector).getBoundingClientRect();
    
    // Calculate the height of the entire table
    const tableHeight = tableRect.height;
    
    // Position the resize handle at the left edge of the cell for RTL layout
    // or at the right edge for LTR layout
    if (rtl) {
      resizeHandle.style.left = `${cellRect.left}px`;
    } else {
      resizeHandle.style.left = `${cellRect.right}px`;
    }
    
    resizeHandle.style.top = `${cellRect.top}px`;
    resizeHandle.style.height = `${tableHeight}px`;
    resizeHandle.style.display = 'block';
    
    // Store the column index
    resizeHandle.columnIndex = getColumnIndex(cell);
    
    // Set up resize state
    resizing = {
      active: true,
      column: cell,
      startX: rtl ? cellRect.left : cellRect.right,
      startWidth: cellRect.width
    };
    
    // Add mouse move and mouse up event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    log('Column resize started', { column: resizeHandle.columnIndex, width: resizing.startWidth });
  };
  
  /**
   * Handles mouse movement during column resize
   * @param {MouseEvent} e Mouse event
   */
  const handleMouseMove = (e) => {
    if (!resizing.active) return;
    
    // Calculate the delta from the start position
    // In RTL mode, dragging left (negative delta) should increase the width
    const deltaX = e.clientX - resizing.startX;
    
    // For RTL, the calculation is reversed
    let newWidth;
    if (rtl) {
      // In RTL, dragging left (negative deltaX) makes the column wider
      newWidth = Math.max(minWidth, Math.min(maxWidth, resizing.startWidth - deltaX));
      
      // Update the resize handle to follow the cursor directly
      resizeHandle.style.left = `${e.clientX}px`;
    } else {
      newWidth = Math.max(minWidth, Math.min(maxWidth, resizing.startWidth + deltaX));
      resizeHandle.style.left = `${resizing.startX + (newWidth - resizing.startWidth)}px`;
    }
    
    log('Resizing', { deltaX, newWidth });
  };
  
  /**
   * Handles mouse up to complete a resize operation
   */
  const handleMouseUp = () => {
    if (!resizing.active) return;
    
    // Get the final width from the position of the resize handle
    const finalPosition = parseInt(resizeHandle.style.left, 10);
    
    // Calculate final width based on direction
    let finalWidth;
    if (rtl) {
      // In RTL mode, we use the mouse position directly to calculate the width
      finalWidth = resizing.startWidth - (finalPosition - resizing.startX);
      
      // Make sure we have a valid width (handle may have moved past the column)
      finalWidth = Math.max(minWidth, Math.min(maxWidth, finalWidth));
    } else {
      finalWidth = resizing.startWidth + (finalPosition - resizing.startX);
    }
    
    // Apply the new width to the column
    resizeColumn(resizeHandle.columnIndex, finalWidth);
    
    // Hide the resize handle
    resizeHandle.style.display = 'none';
    
    // Reset resizing state
    resizing = {
      active: false,
      column: null,
      startX: 0,
      startWidth: 0
    };
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    log('Column resize completed', { column: resizeHandle.columnIndex, width: finalWidth });
  };
  
  /**
   * Resizes a column to the specified width
   * @param {number} columnIndex Index of the column to resize
   * @param {number} width New width in pixels
   */
  const resizeColumn = (columnIndex, width) => {
    // Store the new width
    columnWidths.set(columnIndex, width);
    
    // Get all tables that match the selector
    const tables = document.querySelectorAll(tableSelector);
    
    tables.forEach(table => {
      // Apply width to header cells
      const headerCells = table.querySelectorAll('th');
      if (headerCells[columnIndex]) {
        headerCells[columnIndex].style.width = `${width}px`;
        headerCells[columnIndex].style.minWidth = `${width}px`;
        headerCells[columnIndex].style.maxWidth = `${width}px`;
      }
      
      // Apply width to body cells in the same column
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells[columnIndex]) {
          cells[columnIndex].style.width = `${width}px`;
          cells[columnIndex].style.minWidth = `${width}px`;
          cells[columnIndex].style.maxWidth = `${width}px`;
        }
      });
      
      // Adjust the table width if necessary
      adjustTableWidth(table);
    });
  };
  
  /**
   * Adjusts the total table width based on column widths
   * @param {HTMLElement} table The table element
   */
  const adjustTableWidth = (table) => {
    // Calculate total width of all visible columns
    let totalWidth = 0;
    
    // Use columnWidths values for columns that have been explicitly resized
    for (const [index, width] of columnWidths.entries()) {
      if (!hiddenColumns.has(index)) {
        totalWidth += width;
      }
    }
    
    // Add default width for columns that haven't been resized
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach((cell, index) => {
      if (!columnWidths.has(index) && !hiddenColumns.has(index)) {
        const cellWidth = cell.offsetWidth;
        totalWidth += cellWidth;
      }
    });
    
    // Set the table width
    if (totalWidth > table.offsetWidth) {
      table.style.width = `${totalWidth}px`;
      table.style.minWidth = `${totalWidth}px`;
      
      // Also adjust container width if needed
      const container = table.closest('.MuiTableContainer-root');
      if (container) {
        container.style.overflowX = 'auto';
      }
    }
    
    log('Table width adjusted', { totalWidth });
  };
  
  /**
   * Hides a specific column
   * @param {HTMLElement} cell The header cell of the column to hide
   */
  const hideColumn = (cell) => {
    const columnIndex = getColumnIndex(cell);
    hiddenColumns.add(columnIndex);
    
    // Get all tables that match the selector
    const tables = document.querySelectorAll(tableSelector);
    
    tables.forEach(table => {
      // Hide header cell
      const headerCells = table.querySelectorAll('th');
      if (headerCells[columnIndex]) {
        headerCells[columnIndex].style.display = 'none';
      }
      
      // Hide body cells in the same column
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells[columnIndex]) {
          cells[columnIndex].style.display = 'none';
        }
      });
    });
    
    log('Column hidden', { columnIndex });
  };
  
  /**
   * Shows a previously hidden column
   * @param {number} columnIndex Index of the column to show
   */
  const showColumn = (columnIndex) => {
    if (!hiddenColumns.has(columnIndex)) return;
    
    hiddenColumns.delete(columnIndex);
    
    // Get all tables that match the selector
    const tables = document.querySelectorAll(tableSelector);
    
    tables.forEach(table => {
      // Show header cell
      const headerCells = table.querySelectorAll('th');
      if (headerCells[columnIndex]) {
        headerCells[columnIndex].style.display = '';
      }
      
      // Show body cells in the same column
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells[columnIndex]) {
          cells[columnIndex].style.display = '';
        }
      });
    });
    
    log('Column shown', { columnIndex });
  };
  
  /**
   * Gets the column index of a cell
   * @param {HTMLElement} cell The cell element
   * @returns {number} Zero-based column index
   */
  const getColumnIndex = (cell) => {
    const row = cell.closest('tr');
    return Array.from(row.cells).indexOf(cell);
  };
  
  /**
   * Creates the column manager settings panel for showing hidden columns
   */
  const createSettingsPanel = () => {
    // Check if the panel already exists
    if (document.getElementById('column-manager-settings')) {
      return;
    }
    
    // No longer create a button here - it's now in tableSearch component
    // Instead look for the existing button
    const settingsButton = document.querySelector('#column-settings-button');
    
    // Create the settings panel
    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'column-manager-settings';
    settingsPanel.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      padding: 10px;
      z-index: 9999;
      width: 250px;
      display: none;
      direction: rtl;
    `;
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = 'مدیریت ستون‌ها';
    title.style.cssText = `
      margin: 0 0 10px 0;
      font-size: 16px;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
    `;
    
    settingsPanel.appendChild(title);
    
    // Add hidden columns list (will be populated when shown)
    const columnsList = document.createElement('div');
    columnsList.id = 'hidden-columns-list';
    settingsPanel.appendChild(columnsList);
    
    // Listen for custom event from the settings button in tableSearch
    document.addEventListener('toggleColumnSettings', () => {
      if (settingsPanel.style.display === 'none') {
        // Get the button position to place panel beneath it
        const settingsButton = document.getElementById('column-settings-button');
        if (settingsButton) {
          const buttonRect = settingsButton.getBoundingClientRect();
          
          // Position the panel directly under the button
          settingsPanel.style.top = `${buttonRect.bottom + window.scrollY + 5}px`;
          settingsPanel.style.left = `${buttonRect.left + window.scrollX - settingsPanel.offsetWidth + buttonRect.width}px`;
          
          // Update hidden columns list before showing
          updateHiddenColumnsList();
          settingsPanel.style.display = 'block';
        }
      } else {
        settingsPanel.style.display = 'none';
      }
    });
    
    // Add click outside to close
    document.addEventListener('click', (e) => {
      const settingsButtonEl = document.getElementById('column-settings-button');
      if (settingsPanel.style.display === 'block' && 
          !settingsPanel.contains(e.target) && 
          e.target !== settingsButtonEl &&
          !settingsButtonEl?.contains(e.target)) {
        settingsPanel.style.display = 'none';
      }
    });
    
    // Add the panel to the document body for proper positioning
    document.body.appendChild(settingsPanel);
    
    log('Settings panel created');
  };
  
  /**
   * Updates the list of hidden columns in the settings panel
   */
  const updateHiddenColumnsList = () => {
    const columnsList = document.getElementById('hidden-columns-list');
    if (!columnsList) return;
    
    // Clear the current list
    columnsList.innerHTML = '';
    
    // If no hidden columns, show a message
    if (hiddenColumns.size === 0) {
      const message = document.createElement('p');
      message.textContent = 'هیچ ستونی پنهان نشده است.';
      message.style.fontStyle = 'italic';
      columnsList.appendChild(message);
      return;
    }
    
    // Get all tables that match the selector
    const table = document.querySelector(tableSelector);
    if (!table) return;
    
    // Get header cells to get column names
    const headerCells = table.querySelectorAll('th');
    
    // Create a list item for each hidden column
    hiddenColumns.forEach(columnIndex => {
      const columnName = headerCells[columnIndex]?.textContent || `ستون ${columnIndex + 1}`;
      
      const listItem = document.createElement('div');
      listItem.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
        border-bottom: 1px solid #eee;
      `;
      
      const label = document.createElement('span');
      label.textContent = columnName;
      
      const showButton = document.createElement('button');
      showButton.textContent = 'نمایش';
      showButton.style.cssText = `
        background: #1976d2;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 3px 8px;
        cursor: pointer;
        font-size: 12px;
      `;
      
      showButton.addEventListener('click', () => {
        showColumn(columnIndex);
        updateHiddenColumnsList();
      });
      
      listItem.appendChild(label);
      listItem.appendChild(showButton);
      columnsList.appendChild(listItem);
    });
  };
  
  /**
   * Initialize cell event listeners
   */
  const initialize = () => {
    // Create context menu
    createContextMenu();
    
    // Create resize handle
    createResizeHandle();
    
    // Create settings panel
    createSettingsPanel();
    
    // Add global event listener for right-clicks on header cells
    document.addEventListener('contextmenu', (e) => {
      // Check if the target is a table header cell
      if (e.target.closest('th')) {
        e.preventDefault();
        const cell = e.target.closest('th');
        
        // Show context menu
        showContextMenu(e.clientX, e.clientY, cell);
      }
    });
    
    // Add click listener to hide context menu when clicking elsewhere
    document.addEventListener('click', (e) => {
      // Only hide if clicking outside of context menu
      if (!e.target.closest('#table-header-context-menu')) {
        hideContextMenu();
      }
    });
    
    // Add escape key handler to hide context menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideContextMenu();
        
        // If resizing, cancel the resize
        if (resizing.active) {
          resizeHandle.style.display = 'none';
          
          // Reset resizing state
          resizing = {
            active: false,
            column: null,
            startX: 0,
            startWidth: 0
          };
          
          // Remove event listeners
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        }
      }
    });
    
    log('Cell manager initialized');
  };
  
  /**
   * Reset all column widths to default
   */
  const resetColumnWidths = () => {
    columnWidths.clear();
    
    // Get all tables that match the selector
    const tables = document.querySelectorAll(tableSelector);
    
    tables.forEach(table => {
      // Reset header cells
      const headerCells = table.querySelectorAll('th');
      headerCells.forEach(cell => {
        cell.style.width = '';
        cell.style.minWidth = '';
        cell.style.maxWidth = '';
      });
      
      // Reset body cells
      const bodyCells = table.querySelectorAll('td');
      bodyCells.forEach(cell => {
        cell.style.width = '';
        cell.style.minWidth = '';
        cell.style.maxWidth = '';
      });
      
      // Reset table width
      table.style.width = '';
      table.style.minWidth = '';
    });
    
    log('Column widths reset');
  };
  
  /**
   * Show all hidden columns
   */
  const showAllColumns = () => {
    // Get a copy of hidden columns before clearing
    const hiddenIndices = Array.from(hiddenColumns);
    
    // Clear the set
    hiddenColumns.clear();
    
    // Show each previously hidden column
    hiddenIndices.forEach(columnIndex => {
      // Get all tables that match the selector
      const tables = document.querySelectorAll(tableSelector);
      
      tables.forEach(table => {
        // Show header cell
        const headerCells = table.querySelectorAll('th');
        if (headerCells[columnIndex]) {
          headerCells[columnIndex].style.display = '';
        }
        
        // Show body cells in the same column
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells[columnIndex]) {
            cells[columnIndex].style.display = '';
          }
        });
      });
    });
    
    // Update the settings panel
    updateHiddenColumnsList();
    
    log('All columns shown');
  };
  
  // Public API
  return {
    initialize,
    resizeColumn,
    hideColumn,
    showColumn,
    resetColumnWidths,
    showAllColumns,
    updateHiddenColumnsList
  };
}; 