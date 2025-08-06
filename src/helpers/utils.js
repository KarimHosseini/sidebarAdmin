
/**
 * Smart link handler that opens in new tab on right-click or middle-click,
 * otherwise navigates in current tab
 * @param {string} url - The URL to navigate to
 * @param {MouseEvent} event - The mouse event (optional)
 * @param {Function} navigate - The navigate function from useNavigate hook (optional)
 * @returns {void}
 */
export const handleSmartLink = (url, event = null, navigate = null) => {
  // Check if it's a right-click (button 2) or middle-click (button 1) or Ctrl/Cmd + click
  if (
    event && 
    (event.button === 2 || 
     event.button === 1 || 
     event.ctrlKey || 
     event.metaKey)
  ) {
    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
    if (event.preventDefault) {
      event.preventDefault();
    }
  } else if (navigate) {
    // Use React Router navigation for internal links
    navigate(url);
  } else {
    // Fallback to window.location for navigation
    window.location.href = url;
  }
};

/**
 * Enhanced link click handler for use with onClick events
 * @param {string} url - The URL to navigate to
 * @param {Function} navigate - The navigate function from useNavigate hook
 * @returns {Function} Event handler function
 */
export const createSmartLinkHandler = (url, navigate) => {
  return (event) => {
    // Prevent default behavior for all mouse buttons
    event.preventDefault();
    
    // Handle the smart link navigation
    handleSmartLink(url, event, navigate);
  };
};

/**
 * Component wrapper for smart links
 * Usage: <div onClick={createSmartLinkHandler('/path', navigate)} onAuxClick={createSmartLinkHandler('/path', navigate)}>
 * Note: onAuxClick handles middle mouse button clicks
 */