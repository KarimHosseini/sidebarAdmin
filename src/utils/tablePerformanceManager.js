/**
 * Table Performance Manager
 * Optimizes table rendering by managing updates through pure JavaScript DOM manipulation
 * Reduces React re-renders to achieve near-zero render performance
 */

export class TablePerformanceManager {
  constructor(config = {}) {
    this.config = {
      batchSize: 50, // Number of rows to update in each batch
      batchDelay: 16, // Delay between batches (roughly 1 frame at 60fps)
      enableVirtualScrolling: true,
      rowHeight: 53, // Default row height for virtual scrolling
      overscan: 5, // Number of rows to render outside visible area
      ...config
    };
    
    this.tableRef = null;
    this.visibleRange = { start: 0, end: 0 };
    this.rowCache = new Map();
    this.pendingUpdates = new Map();
    this.updateQueue = [];
    this.isProcessing = false;
    this.observers = new Map();
    
    // Performance metrics
    this.metrics = {
      renders: 0,
      domUpdates: 0,
      batchesProcessed: 0
    };
  }

  /**
   * Initialize the performance manager with a table element
   */
  initialize(tableElement) {
    if (!tableElement) return;
    
    this.tableRef = tableElement;
    this.setupVirtualScrolling();
    this.setupIntersectionObserver();
    
    console.log('TablePerformanceManager initialized');
  }

  /**
   * Setup virtual scrolling for large datasets
   */
  setupVirtualScrolling() {
    if (!this.config.enableVirtualScrolling || !this.tableRef) return;
    
    const scrollContainer = this.tableRef.closest('.MuiTableContainer-root');
    if (!scrollContainer) return;
    
    let scrollTimeout;
    scrollContainer.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.updateVisibleRange();
      }, 50);
    }, { passive: true });
    
    // Initial visible range calculation
    this.updateVisibleRange();
  }

  /**
   * Setup intersection observer for lazy rendering
   */
  setupIntersectionObserver() {
    if (!this.tableRef) return;
    
    const options = {
      root: this.tableRef.closest('.MuiTableContainer-root'),
      rootMargin: `${this.config.overscan * this.config.rowHeight}px`,
      threshold: 0
    };
    
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const rowId = entry.target.getAttribute('data-row-id');
        if (rowId) {
          this.observers.set(rowId, entry.isIntersecting);
          if (entry.isIntersecting) {
            this.renderRowContent(rowId);
          }
        }
      });
    }, options);
  }

  /**
   * Calculate visible range for virtual scrolling
   */
  updateVisibleRange() {
    const scrollContainer = this.tableRef?.closest('.MuiTableContainer-root');
    if (!scrollContainer) return;
    
    const scrollTop = scrollContainer.scrollTop;
    const containerHeight = scrollContainer.clientHeight;
    
    const start = Math.max(0, Math.floor(scrollTop / this.config.rowHeight) - this.config.overscan);
    const end = Math.ceil((scrollTop + containerHeight) / this.config.rowHeight) + this.config.overscan;
    
    this.visibleRange = { start, end };
    this.processVisibleRows();
  }

  /**
   * Process only visible rows
   */
  processVisibleRows() {
    const rows = this.tableRef?.querySelectorAll('tbody tr');
    if (!rows) return;
    
    rows.forEach((row, index) => {
      if (index >= this.visibleRange.start && index <= this.visibleRange.end) {
        row.style.display = '';
        this.observeRow(row);
      } else {
        row.style.display = 'none';
        this.unobserveRow(row);
      }
    });
  }

  /**
   * Observe a row for intersection
   */
  observeRow(rowElement) {
    if (this.intersectionObserver && rowElement) {
      this.intersectionObserver.observe(rowElement);
    }
  }

  /**
   * Unobserve a row
   */
  unobserveRow(rowElement) {
    if (this.intersectionObserver && rowElement) {
      this.intersectionObserver.unobserve(rowElement);
    }
  }

  /**
   * Queue a cell update for batch processing
   */
  queueCellUpdate(rowId, cellIndex, content, immediate = false) {
    const updateKey = `${rowId}-${cellIndex}`;
    
    this.pendingUpdates.set(updateKey, {
      rowId,
      cellIndex,
      content,
      timestamp: Date.now()
    });
    
    if (immediate) {
      this.processBatch();
    } else {
      this.scheduleProcessing();
    }
  }

  /**
   * Schedule batch processing
   */
  scheduleProcessing() {
    if (this.isProcessing) return;
    
    requestAnimationFrame(() => {
      this.processBatch();
    });
  }

  /**
   * Process pending updates in batches
   */
  async processBatch() {
    if (this.isProcessing || this.pendingUpdates.size === 0) return;
    
    this.isProcessing = true;
    const updates = Array.from(this.pendingUpdates.entries()).slice(0, this.config.batchSize);
    
    // Clear processed updates
    updates.forEach(([key]) => this.pendingUpdates.delete(key));
    
    // Apply updates
    await this.applyUpdates(updates);
    
    this.metrics.batchesProcessed++;
    this.isProcessing = false;
    
    // Continue processing if more updates are pending
    if (this.pendingUpdates.size > 0) {
      setTimeout(() => this.processBatch(), this.config.batchDelay);
    }
  }

  /**
   * Apply updates to DOM
   */
  async applyUpdates(updates) {
    const fragment = document.createDocumentFragment();
    
    updates.forEach(([key, update]) => {
      const cell = this.getCellElement(update.rowId, update.cellIndex);
      if (cell) {
        this.updateCellContent(cell, update.content);
        this.metrics.domUpdates++;
      }
    });
  }

  /**
   * Get cell element by row ID and cell index
   */
  getCellElement(rowId, cellIndex) {
    if (!this.tableRef) return null;
    
    const row = this.tableRef.querySelector(`tr[data-row-id="${rowId}"]`);
    if (!row) return null;
    
    return row.cells[cellIndex];
  }

  /**
   * Update cell content efficiently
   */
  updateCellContent(cell, content) {
    if (!cell) return;
    
    // Check if content has actually changed
    const currentContent = cell.textContent;
    if (currentContent === content && typeof content === 'string') return;
    
    // Use textContent for simple strings (fastest)
    if (typeof content === 'string') {
      cell.textContent = content;
    } else if (content instanceof HTMLElement) {
      // Replace content with element
      cell.innerHTML = '';
      cell.appendChild(content);
    } else {
      // For complex content, use innerHTML
      cell.innerHTML = content;
    }
  }

  /**
   * Render row content lazily
   */
  renderRowContent(rowId) {
    const cachedRow = this.rowCache.get(rowId);
    if (!cachedRow || !cachedRow.needsRender) return;
    
    // Apply cached content
    Object.entries(cachedRow.cells).forEach(([cellIndex, content]) => {
      this.queueCellUpdate(rowId, cellIndex, content, true);
    });
    
    cachedRow.needsRender = false;
  }

  /**
   * Cache row data for lazy rendering
   */
  cacheRowData(rowId, rowData) {
    this.rowCache.set(rowId, {
      data: rowData,
      cells: {},
      needsRender: true
    });
  }

  /**
   * Update single cell without re-rendering entire row
   */
  updateCell(rowId, cellIndex, value) {
    // Direct DOM update
    const cell = this.getCellElement(rowId, cellIndex);
    if (cell) {
      this.updateCellContent(cell, value);
    }
    
    // Update cache
    const cachedRow = this.rowCache.get(rowId);
    if (cachedRow) {
      cachedRow.cells[cellIndex] = value;
    }
  }

  /**
   * Batch update multiple cells
   */
  batchUpdateCells(updates) {
    updates.forEach(({ rowId, cellIndex, value }) => {
      this.queueCellUpdate(rowId, cellIndex, value);
    });
  }

  /**
   * Update row selection state without re-rendering
   */
  updateRowSelection(rowId, isSelected) {
    const row = this.tableRef?.querySelector(`tr[data-row-id="${rowId}"]`);
    if (!row) return;
    
    if (isSelected) {
      row.classList.add('Mui-selected');
    } else {
      row.classList.remove('Mui-selected');
    }
    
    // Update checkbox if exists
    const checkbox = row.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.checked = isSelected;
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      cacheSize: this.rowCache.size,
      pendingUpdates: this.pendingUpdates.size
    };
  }

  /**
   * Clear cache and reset
   */
  clear() {
    this.rowCache.clear();
    this.pendingUpdates.clear();
    this.updateQueue = [];
    this.observers.clear();
    
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  /**
   * Destroy the manager and clean up
   */
  destroy() {
    this.clear();
    this.tableRef = null;
    this.intersectionObserver = null;
  }
}

// Factory function for creating performance manager
export function createTablePerformanceManager(config) {
  return new TablePerformanceManager(config);
}