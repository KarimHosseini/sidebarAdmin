/**
 * Pure DOM-based Selection Manager
 * 
 * A utility that provides checkbox selection management with zero React re-renders.
 * Directly manipulates DOM elements for optimal performance.
 * 
 * @author Cursor AI
 * @version 2.0.0
 */

/**
 * Creates a selection manager instance for handling table row selections
 * without causing React renders
 * 
 * @param {Object} options - Configuration options
 * @param {Array<string|number>} [options.defaultSelected] - Array of initially selected IDs
 * @param {boolean} [options.debug] - Enable debug logging
 * @param {boolean} [options.persistSelection] - Keep selection when navigating pages
 * @returns {SelectionManager} A selection manager instance
 */
export const createSelectionManager = (options = {}) => {
  // Private state - only accessible within this closure
  const _selectedItems = new Set(options.defaultSelected || []);
  let _isUpdating = false;
  let _debugMode = options.debug || false;
  let _listenerAdded = false;
  let _mutationObserver = null;
  
  // Selection change event emitter
  const _eventTarget = new EventTarget();
  
  // Initialize default options
  const _options = {
    persistSelection: true,
    ...options
  };
  
  // Performance optimization - use requestAnimationFrame for batched UI updates
  const scheduleDOMUpdate = (callback) => {
    window.requestAnimationFrame(callback);
  };
  
  /**
   * Logs debug messages if debug mode is enabled
   * @param {string} message - The debug message
   * @param {any} data - Optional data to log
   */
  const _log = (message, data) => {
    if (_debugMode) {
      if (data) {
        console.log(`[SelectionManager] ${message}`, data);
      } else {
        console.log(`[SelectionManager] ${message}`);
      }
    }
  };

  /**
   * Updates the DOM checkbox state and associated row styling
   * @param {string|number} id - Row ID
   * @param {boolean} isChecked - Whether the checkbox should be checked
   * @returns {HTMLElement|null} - The checkbox element or null if not found
   */
  const _updateCheckboxState = (id, isChecked) => {
    const checkbox = document.getElementById(`checkbox-${id}`);
    if (!checkbox) return null;
    
    // Update checkbox state - use direct property assignment for immediate effect
    checkbox.checked = isChecked;
    
    // Find and update row styling
    const row = checkbox.closest('tr');
    if (row) {
      if (isChecked) {
        row.classList.add('Mui-selected');
      } else {
        row.classList.remove('Mui-selected');
      }
    }
    
    return checkbox;
  };

  /**
   * Updates the selection counter in the DOM
   */
  const _updateSelectionCounter = () => {
    scheduleDOMUpdate(() => {
      const counter = document.getElementById('selection-counter');
      if (!counter) return;
      
      const count = _selectedItems.size;
      
      if (count > 0) {
        counter.textContent = `${count} مورد انتخاب شده`;
        counter.style.display = 'block';
      } else {
        counter.style.display = 'none';
      }
    });
  };

  /**
   * Updates the "select all" checkbox state based on current selections
   * @param {Array<string|number>} visibleIds - IDs of currently visible rows (optional)
   */
  const _updateSelectAllCheckbox = (visibleIds) => {
    if (_isUpdating) return;
    
    scheduleDOMUpdate(() => {
      const selectAllCheckbox = document.getElementById('select-all-checkbox');
      if (!selectAllCheckbox) return;
      
      // If visibleIds are provided, use them; otherwise, find all visible checkboxes
      const allVisibleIds = visibleIds || _getVisibleRowIds();
      
      if (!allVisibleIds || allVisibleIds.length === 0) {
        // No visible rows
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
        return;
      }
      
      // Count visible rows that are selected
      const visibleSelectedCount = allVisibleIds.filter(id => 
        _selectedItems.has(id)
      ).length;
      
      // Update select-all checkbox state
      if (visibleSelectedCount === 0) {
        // None selected
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
      } else if (visibleSelectedCount === allVisibleIds.length) {
        // All selected
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
      } else {
        // Some selected
        selectAllCheckbox.indeterminate = true;
        selectAllCheckbox.checked = false;
      }
    });
  };

  /**
   * Gets the IDs of all currently visible row checkboxes
   * @returns {Array<string>} Array of visible row IDs
   */
  const _getVisibleRowIds = () => {
    const checkboxes = document.querySelectorAll('input[id^="checkbox-"]:not(#select-all-checkbox)');
    return Array.from(checkboxes).map(checkbox => 
      checkbox.id.replace('checkbox-', '')
    );
  };
  
  /**
   * Sets up a mutation observer to watch for new checkboxes and sync them
   */
  const _setupMutationObserver = () => {
    if (_mutationObserver) return;
    
    _log('Setting up mutation observer for checkbox changes');
    
    // Watch for changes to the table body to catch new checkboxes
    _mutationObserver = new MutationObserver((mutations) => {
      let needsSync = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          // Look for added checkboxes
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if this node or its children contain checkboxes
              const hasCheckboxes = node.querySelectorAll 
                ? node.querySelectorAll('input[id^="checkbox-"]:not([data-sm-initialized])').length > 0
                : false;
                
              if (hasCheckboxes) {
                needsSync = true;
                break;
              }
            }
          }
          
          if (needsSync) break;
        }
      }
      
      if (needsSync) {
        _log('New checkboxes detected, syncing UI');
        // Delay sync to ensure DOM is fully updated
        setTimeout(() => syncUI(), 10);
      }
    });
    
    // Start observing the entire document
    const tableContainer = document.querySelector('.MuiTableContainer-root');
    if (tableContainer) {
      _mutationObserver.observe(tableContainer, {
        childList: true,
        subtree: true
      });
    } else {
      // Fallback to body if table container not found
      _mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  };
  
  /**
   * Wraps a function with mutex protection to prevent concurrent execution
   * @param {Function} fn - The function to protect
   * @returns {Function} The protected function
   */
  const _protectFromConcurrency = (fn) => {
    return (...args) => {
      if (_isUpdating) return;
      _isUpdating = true;
      
      try {
        return fn(...args);
      } finally {
        _isUpdating = false;
      }
    };
  };
  
  /**
   * Syncs the UI with the current selection state
   * Makes sure all visible checkboxes reflect the current selection
   */
  const syncUI = _protectFromConcurrency(() => {
    _log('Syncing UI with selection state');
    
    // Initialize all checkboxes with event listeners
    _initializeCheckboxes();
    
    // Get IDs of all visible checkboxes
    const currentVisible = _getVisibleRowIds();
    
    // Update visible checkbox states
    currentVisible.forEach(id => {
      const isSelected = _selectedItems.has(id);
      _updateCheckboxState(id, isSelected);
    });
    
    // Directly update select-all checkbox with more precise logic
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    if (selectAllCheckbox && currentVisible.length > 0) {
      // Count how many visible rows are selected
      const selectedVisibleCount = currentVisible.filter(id => _selectedItems.has(id)).length;
      
      if (selectedVisibleCount === 0) {
        // None selected
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
      } else if (selectedVisibleCount === currentVisible.length) {
        // All selected
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
      } else {
        // Some selected - set indeterminate state
        selectAllCheckbox.indeterminate = true;
        selectAllCheckbox.checked = false;
      }
    }
    
    // Update selection counter
    _updateSelectionCounter();
  });
  
  /**
   * Attaches event listeners to all checkboxes and initializes their states
   */
  const _initializeCheckboxes = () => {
    // Find all row checkboxes that don't have listeners yet
    const rowCheckboxes = document.querySelectorAll('input[id^="checkbox-"]:not([data-sm-initialized]):not(#select-all-checkbox)');
    
    // Attach listeners to each checkbox
    rowCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('click', handleCheckboxClick);
      checkbox.setAttribute('data-sm-initialized', 'true');
      
      // Set initial state from selection manager
      const id = checkbox.id.replace('checkbox-', '');
      checkbox.checked = _selectedItems.has(id);
      
      // Update row styling
      const row = checkbox.closest('tr');
      if (row) {
        if (checkbox.checked) {
          row.classList.add('Mui-selected');
        } else {
          row.classList.remove('Mui-selected');
        }
      }
    });
    
    // Initialize select-all checkbox if not done yet
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    if (selectAllCheckbox && !selectAllCheckbox.getAttribute('data-sm-initialized')) {
      selectAllCheckbox.addEventListener('click', handleSelectAllClick);
      selectAllCheckbox.setAttribute('data-sm-initialized', 'true');
      
      // Update select-all checkbox state
      _updateSelectAllCheckbox();
    }
  };
  
  /**
   * Renders a checkbox element for tables
   * @param {Object} props - Props for checkbox
   * @param {string|number} props.id - Row ID
   * @param {boolean} [props.disabled] - Whether checkbox is disabled
   * @param {boolean} [props.initiallySelected] - Whether checkbox is initially selected
   * @returns {string} HTML string for rendering
   */
  const renderCheckbox = ({ id, disabled = false, initiallySelected = false }) => {
    // If this ID is in our selection, make sure it's marked as initially selected
    const isSelected = _selectedItems.has(id) || initiallySelected;
    if (initiallySelected && !_selectedItems.has(id)) {
      _selectedItems.add(id);
      _updateSelectionCounter();
    }
    
    return `
      <input
        type="checkbox"
        id="checkbox-${id}"
        ${isSelected ? 'checked' : ''}
        ${disabled ? 'disabled' : ''}
        data-sm-initialized="true"
        style="width: 18px; height: 18px; cursor: pointer; accent-color: #1976d2;"
      />
    `;
  };
  
  /**
   * Renders a select-all checkbox element
   * @returns {string} HTML string for rendering
   */
  const renderSelectAllCheckbox = () => {
    return `
      <input
        type="checkbox"
        id="select-all-checkbox"
        data-sm-initialized="true"
        style="width: 18px; height: 18px; border: 1px solid #bdbdbd; border-radius: 2px; cursor: pointer; accent-color: #1976d2;"
      />
    `;
  };
  
  /**
   * Handles checkbox clicks - public method to be used as event handler
   * @param {Event} event - The click event
   */
  const handleCheckboxClick = (event) => {
    if (_isUpdating) {
      event.stopPropagation();
      return;
    }
    
    _isUpdating = true;
    
    try {
      const checkbox = event.target;
      const id = checkbox.id.replace('checkbox-', '');
      const isChecked = checkbox.checked;
      
      _log(`Checkbox clicked: id=${id}, checked=${isChecked}`);
      
      if (isChecked) {
        _selectedItems.add(id);
        
        // Update row styling
        const row = checkbox.closest('tr');
        if (row) row.classList.add('Mui-selected');
      } else {
        _selectedItems.delete(id);
        
        // Update row styling
        const row = checkbox.closest('tr');
        if (row) row.classList.remove('Mui-selected');
      }
      
      // Always update select-all checkbox immediately
      // This ensures it shows the indeterminate state right away
      const selectAllCheckbox = document.getElementById('select-all-checkbox');
      if (selectAllCheckbox) {
        // Get all visible checkboxes
        const visibleCheckboxes = document.querySelectorAll('input[id^="checkbox-"]:not(#select-all-checkbox)');
        const visibleIds = Array.from(visibleCheckboxes).map(cb => cb.id.replace('checkbox-', ''));
        
        // Count selected visible checkboxes
        const selectedVisibleCount = visibleIds.filter(id => _selectedItems.has(id)).length;
        
        // Update select-all checkbox state
        if (selectedVisibleCount === 0) {
          // None selected
          selectAllCheckbox.checked = false;
          selectAllCheckbox.indeterminate = false;
        } else if (selectedVisibleCount === visibleIds.length) {
          // All selected
          selectAllCheckbox.checked = true;
          selectAllCheckbox.indeterminate = false;
        } else {
          // Some selected - this is the critical part for the dash "-" state
          selectAllCheckbox.indeterminate = true;
          selectAllCheckbox.checked = false;
        }
      }
      
      _updateSelectionCounter();
      _emitSelectionChange(); // Emit event after checkbox click
    } finally {
      _isUpdating = false;
    }
    
    // Prevent React event handling
    event.stopPropagation();
  };
  
  /**
   * Handles select-all checkbox clicks - public method to be used as event handler
   * @param {Event} event - The click event
   */
  const handleSelectAllClick = (event) => {
    if (_isUpdating) {
      event.stopPropagation();
      return;
    }
    
    _isUpdating = true;
    
    try {
      const selectAllCheckbox = event.target;
      const isChecked = selectAllCheckbox.checked;
      
      // Reset indeterminate state when clicked
      selectAllCheckbox.indeterminate = false;
      
      // Get all visible row IDs and checkboxes
      const visibleCheckboxes = document.querySelectorAll('input[id^="checkbox-"]:not(#select-all-checkbox)');
      const visibleIds = Array.from(visibleCheckboxes).map(checkbox => 
        checkbox.id.replace('checkbox-', '')
      );
      
      _log(`Select all clicked: checked=${isChecked}, visible rows=${visibleIds.length}`);
      
      if (isChecked) {
        // CRITICAL FIX: Remove all currently visible IDs before adding them again
        // This ensures we don't have stale items in the set
        visibleIds.forEach(id => _selectedItems.delete(id));
        
        // Now add all visible IDs and update their checkbox state
        visibleCheckboxes.forEach(checkbox => {
          const id = checkbox.id.replace('checkbox-', '');
          checkbox.checked = true;
          _selectedItems.add(id);
          
          // Update row styling
          const row = checkbox.closest('tr');
          if (row) row.classList.add('Mui-selected');
        });
      } else {
        // When deselecting all, remove all visible IDs from selection
        visibleCheckboxes.forEach(checkbox => {
          const id = checkbox.id.replace('checkbox-', '');
          checkbox.checked = false;
          _selectedItems.delete(id);
          
          // Update row styling
          const row = checkbox.closest('tr');
          if (row) row.classList.remove('Mui-selected');
        });
      }
      
      _updateSelectionCounter();
      _emitSelectionChange(); // Emit event after select all
    } finally {
      _isUpdating = false;
    }
    
    // Prevent this event from causing a React render
    event.stopPropagation();
  };
  
  /**
   * Emit a selection change event
   */
  const _emitSelectionChange = () => {
    const event = new CustomEvent('selectionChange', {
      detail: {
        selected: Array.from(_selectedItems),
        count: _selectedItems.size
      }
    });
    _eventTarget.dispatchEvent(event);
    _log('Selection change event emitted', event.detail);
  };
  
  // Initialize the manager
  const init = () => {
    // Set up mutation observer if enabled
    if (_options.persistSelection) {
      _setupMutationObserver();
    }
    
    // Sync the UI if we have default selections
    if (_selectedItems.size > 0) {
      // Wait for DOM to be ready
      setTimeout(() => {
        syncUI();
        _log('Initialized with default selections', Array.from(_selectedItems));
      }, 100);
    }
  };
  
  // The public API
  const manager = {
    /**
     * Gets all selected item IDs
     * @returns {Array<string|number>} Array of selected IDs
     */
    getSelected: () => Array.from(_selectedItems),
    
    /**
     * Checks if a specific item is selected
     * @param {string|number} id - The item ID to check
     * @returns {boolean} True if the item is selected
     */
    isSelected: (id) => _selectedItems.has(id),
    
    /**
     * Select a specific item by ID
     * @param {string|number} id - The item ID to select
     * @returns {Array<string|number>} Current selection after operation
     */
    select: _protectFromConcurrency((id) => {
      if (_selectedItems.has(id)) {
        _log('Item already selected', id);
        return Array.from(_selectedItems);
      }
      
      _selectedItems.add(id);
      _log('Selected item', id);
      
      _updateCheckboxState(id, true);
      _updateSelectionCounter();
      _updateSelectAllCheckbox();
      _emitSelectionChange(); // Emit event after selection
      
      return Array.from(_selectedItems);
    }),
    
    /**
     * Deselect a specific item by ID
     * @param {string|number} id - The item ID to deselect
     * @returns {Array<string|number>} Current selection after operation
     */
    deselect: _protectFromConcurrency((id) => {
      if (!_selectedItems.has(id)) {
        _log('Item was not selected', id);
        return Array.from(_selectedItems);
      }
      
      _selectedItems.delete(id);
      _log('Deselected item', id);
      
      _updateCheckboxState(id, false);
      _updateSelectionCounter();
      _updateSelectAllCheckbox();
      _emitSelectionChange(); // Emit event after deselection
      
      return Array.from(_selectedItems);
    }),
    
    /**
     * Toggle selection state for a specific item
     * @param {string|number} id - The item ID to toggle
     * @returns {Array<string|number>} Current selection after operation
     */
    toggle: _protectFromConcurrency((id) => {
      const isCurrentlySelected = _selectedItems.has(id);
      
      if (isCurrentlySelected) {
        _selectedItems.delete(id);
        _log('Toggled off', id);
        
        const checkbox = _updateCheckboxState(id, false);
        // Force state if needed
        if (checkbox && checkbox.checked) {
          _log('Forcing unchecked state', id);
          checkbox.checked = false;
        }
      } else {
        _selectedItems.add(id);
        _log('Toggled on', id);
        
        const checkbox = _updateCheckboxState(id, true);
        // Force state if needed
        if (checkbox && !checkbox.checked) {
          _log('Forcing checked state', id);
          checkbox.checked = true;
        }
      }
      
      _updateSelectionCounter();
      _updateSelectAllCheckbox();
      _emitSelectionChange(); // Emit event after toggle
      
      return Array.from(_selectedItems);
    }),
    
    /**
     * Handle click on checkbox - reads directly from DOM
     * @param {Event} event - The click event
     */
    handleCheckboxClick,
    
    /**
     * Handle click on the "select all" checkbox
     * @param {Event} event - The click event
     */
    handleSelectAllClick,
    
    /**
     * Select multiple items at once
     * @param {Array<string|number>} ids - Array of IDs to select
     * @returns {Array<string|number>} Current selection after operation
     */
    selectAll: _protectFromConcurrency((ids) => {
      if (!ids || ids.length === 0) return Array.from(_selectedItems);
      
      _log('Selecting multiple items', ids);
      
      // Add all new IDs to the selection set
      ids.forEach(id => {
        if (!_selectedItems.has(id)) {
          _selectedItems.add(id);
          _updateCheckboxState(id, true);
        }
      });
      
      _updateSelectionCounter();
      _updateSelectAllCheckbox(ids); // Pass the IDs as visible IDs
      _emitSelectionChange(); // Emit event after selecting multiple
      
      return Array.from(_selectedItems);
    }),
    
    /**
     * Deselect all items
     * @returns {Array<string|number>} Empty array
     */
    deselectAll: _protectFromConcurrency(() => {
      if (_selectedItems.size === 0) return [];
      
      _log('Deselecting all items');
      
      // Get all currently selected items
      const itemsToRemove = Array.from(_selectedItems);
      
      // Clear the selection set
      _selectedItems.clear();
      
      // Update all checkbox states in the DOM
      itemsToRemove.forEach(id => {
        _updateCheckboxState(id, false);
      });
      
      // Update select-all checkbox state
      const selectAllCheckbox = document.getElementById('select-all-checkbox');
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
      }
      
      _updateSelectionCounter();
      _emitSelectionChange(); // Emit event after deselecting all
      
      return [];
    }),
    
    /**
     * Get the count of selected items
     * @returns {number} Count of selected items
     */
    count: () => _selectedItems.size,
    
    /**
     * Force update UI to match internal state - useful after page changes
     * @param {Array<string|number>} visibleIds - Optional array of currently visible row IDs
     */
    syncUI,
    
    /**
     * Clear internal selection for specific IDs - useful for handling deleted rows
     * @param {Array<string|number>} ids - Array of IDs to remove from selection
     */
    removeFromSelection: _protectFromConcurrency((ids) => {
      if (!ids || ids.length === 0) return;
      
      _log('Removing IDs from selection', ids);
      
      ids.forEach(id => _selectedItems.delete(id));
      _updateSelectionCounter();
      _updateSelectAllCheckbox();
      _emitSelectionChange(); // Emit event after removing
    }),
    
    /**
     * Enable or disable debug mode
     * @param {boolean} enabled - Whether debug mode should be enabled
     */
    setDebug: (enabled) => {
      _debugMode = Boolean(enabled);
    },
    
    /**
     * Render a checkbox directly
     * @param {Object} props - Checkbox props
     * @returns {string} HTML string
     */
    renderCheckbox,
    
    /**
     * Render a select-all checkbox directly
     * @returns {string} HTML string
     */
    renderSelectAllCheckbox,
    
    /**
     * Initialize checkboxes with event listeners
     */
    initializeCheckboxes: _initializeCheckboxes,
    
    /**
     * DEBUGGING: Dump internal selection state to console
     */
    _dumpState: () => {
      console.log('[SelectionManager] Current Selection:', Array.from(_selectedItems));
    },
    
    /**
     * Updates the selection counter in the DOM
     */
    updateSelectionCounter: _updateSelectionCounter,

    /**
     * Add a listener for selection changes
     * @param {string} eventType - The event type to listen for ('selectionChange')
     * @param {Function} listener - The callback function to call
     */
    addEventListener: (eventType, listener) => {
      _eventTarget.addEventListener(eventType, listener);
    },

    /**
     * Remove a listener for selection changes
     * @param {string} eventType - The event type to remove ('selectionChange')
     * @param {Function} listener - The callback function to remove
     */
    removeEventListener: (eventType, listener) => {
      _eventTarget.removeEventListener(eventType, listener);
    }
  };
  
  // Initialize the manager
  init();
  
  return manager;
}; 