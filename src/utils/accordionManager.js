/**
 * Accordion Manager - Zero-render accordion system using DOM manipulation
 * 
 * This utility creates an accordion manager that directly manipulates the DOM
 * to open and close accordions without triggering React renders.
 */

/**
 * Creates an accordion manager
 * @param {Object} options Configuration options
 * @param {boolean} options.debug Enable debug logging
 * @returns {Object} Accordion manager methods
 */
export const createAccordionManager = (options = {}) => {
  const { debug = false } = options;
  
  // Track open accordion states by row ID
  const openAccordions = new Set();
  
  /**
   * Logs a debug message if debug mode is enabled
   * @param {string} message The message to log
   * @param {any} data Additional data to log
   */
  const log = (message, data) => {
    if (debug) {
      console.log(`🪗 AccordionManager: ${message}`, data || '');
    }
  };
  
  /**
   * Toggles an accordion
   * @param {Event} e Click event from the accordion button
   */
  const handleAccordionToggle = (e) => {
    e.stopPropagation();
    
    // Get the button element that was clicked
    const button = e.currentTarget;
    const rowId = button.getAttribute('data-row-id');
    const index = button.getAttribute('data-index');
    
    if (!rowId) {
      log('No row ID found on accordion button');
      return;
    }
    
    log(`Toggle accordion for row ${rowId}`);
    
    // Find the content element
    const accordionContent = document.getElementById(`accordion-content-${rowId}`);
    const accordionRow = document.getElementById(`accordion-row-${rowId}`);
    const iconContainer = button.querySelector('.accordion-icon');
    
    if (!accordionContent || !accordionRow) {
      log('Accordion content or row not found', { rowId });
      return;
    }
    
    // Toggle the accordion state
    const isOpen = openAccordions.has(rowId);
    
    if (isOpen) {
      // Close the accordion
      openAccordions.delete(rowId);
      accordionContent.style.display = 'none';
      
      // Update the icon if it exists
      if (iconContainer) {
        iconContainer.innerHTML = `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowDownIcon"><path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path></svg>`;
      }
    } else {
      // Open the accordion
      openAccordions.add(rowId);
      accordionContent.style.display = 'block';
      
      // Update the icon if it exists
      if (iconContainer) {
        iconContainer.innerHTML = `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowUpIcon"><path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>`;
      }
    }
    
    // Animate the content
    if (accordionContent.animate) {
      if (!isOpen) {
        // Opening animation
        accordionContent.animate(
          [
            { opacity: 0, height: '0px' },
            { opacity: 1, height: accordionContent.scrollHeight + 'px' }
          ],
          { duration: 200, easing: 'ease-out' }
        );
      }
    }
    
    log(`Accordion ${rowId} is now ${isOpen ? 'closed' : 'open'}`);
  };
  
  /**
   * Initializes accordion elements in the DOM
   */
  const initializeAccordions = () => {
    log('Initializing accordions');
    
    // Find all accordion buttons
    document.querySelectorAll('.accordion-toggle-btn:not([data-am-initialized="true"])').forEach(button => {
      // Mark as initialized to avoid duplicate listeners
      button.setAttribute('data-am-initialized', 'true');
      
      // Add click listener
      button.addEventListener('click', handleAccordionToggle);
      
      // Check if this accordion should be open initially
      const rowId = button.getAttribute('data-row-id');
      if (openAccordions.has(rowId)) {
        const accordionContent = document.getElementById(`accordion-content-${rowId}`);
        if (accordionContent) {
          accordionContent.style.display = 'block';
          
          // Update icon
          const iconContainer = button.querySelector('.accordion-icon');
          if (iconContainer) {
            iconContainer.innerHTML = `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowUpIcon"><path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>`;
          }
        }
      }
    });
  };
  
  /**
   * Checks if an accordion is open
   * @param {string} rowId The row ID
   * @returns {boolean} True if the accordion is open
   */
  const isOpen = (rowId) => {
    return openAccordions.has(rowId);
  };
  
  /**
   * Opens an accordion
   * @param {string} rowId The row ID
   */
  const open = (rowId) => {
    if (!openAccordions.has(rowId)) {
      openAccordions.add(rowId);
      
      // Find and update the DOM
      const accordionContent = document.getElementById(`accordion-content-${rowId}`);
      const button = document.querySelector(`.accordion-toggle-btn[data-row-id="${rowId}"]`);
      
      if (accordionContent) {
        accordionContent.style.display = 'block';
        
        // Update the icon if it exists
        if (button) {
          const iconContainer = button.querySelector('.accordion-icon');
          if (iconContainer) {
            iconContainer.innerHTML = `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowUpIcon"><path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>`;
          }
        }
      }
      
      log(`Opened accordion ${rowId}`);
    }
  };
  
  /**
   * Closes an accordion
   * @param {string} rowId The row ID
   */
  const close = (rowId) => {
    if (openAccordions.has(rowId)) {
      openAccordions.delete(rowId);
      
      // Find and update the DOM
      const accordionContent = document.getElementById(`accordion-content-${rowId}`);
      const button = document.querySelector(`.accordion-toggle-btn[data-row-id="${rowId}"]`);
      
      if (accordionContent) {
        accordionContent.style.display = 'none';
        
        // Update the icon if it exists
        if (button) {
          const iconContainer = button.querySelector('.accordion-icon');
          if (iconContainer) {
            iconContainer.innerHTML = `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowDownIcon"><path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path></svg>`;
          }
        }
      }
      
      log(`Closed accordion ${rowId}`);
    }
  };
  
  /**
   * Closes all accordions
   */
  const closeAll = () => {
    log('Closing all accordions');
    
    openAccordions.forEach(rowId => {
      close(rowId);
    });
    
    openAccordions.clear();
  };
  
  /**
   * Setup MutationObserver to watch for new accordion elements
   */
  const setupObserver = () => {
    log('Setting up MutationObserver for accordions');
    
    // Create an observer instance
    const observer = new MutationObserver((mutations) => {
      let hasNewAccordions = false;
      
      // Check if any accordions were added that need initialization
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          Array.from(mutation.addedNodes).forEach(node => {
            if (node.querySelectorAll) {
              const newAccordions = node.querySelectorAll('.accordion-toggle-btn:not([data-am-initialized="true"])');
              if (newAccordions.length > 0) {
                hasNewAccordions = true;
              }
            }
          });
        }
      });
      
      // Only call initialize if we found new accordions
      if (hasNewAccordions) {
        setTimeout(initializeAccordions, 50);
      }
    });
    
    // Start observing the document body
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return observer;
  };
  
  // Initialize the observer
  const observer = setupObserver();
  
  // Public API
  return {
    initializeAccordions,
    handleAccordionToggle,
    isOpen,
    open,
    close,
    closeAll,
    destroy: () => {
      observer.disconnect();
      log('Accordion manager destroyed');
    }
  };
}; 