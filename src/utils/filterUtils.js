import { isEqual, uniqWith, remove } from 'lodash';

/**
 * Get filters from URL parameters
 * @returns {Array} Array of filter objects
 */
export const getFiltersFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const filters = [];
  
  // Get all param keys
  Array.from(urlParams.keys()).forEach(key => {
    // Look for filter_ prefix
    if (key.startsWith('filter_') && !key.startsWith('filter_op_')) {
      const name = key.replace('filter_', '');
      const value = urlParams.get(key);
      // Get operator if exists, default to "eq"
      const type = urlParams.get(`filter_op_${name}`) || 'eq';
      
      filters.push({
        name,
        value,
        type
      });
    }
  });
  
  return filters;
};

/**
 * Set a filter in the URL
 * @param {Object} filter Filter object {name, value, type}
 * @param {Function} onFilterChange Optional callback after URL update
 */
export const setFilterInUrl = (filter, onFilterChange = null) => {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Remove any existing filter with this name
  urlParams.delete(`filter_${filter.name}`);
  urlParams.delete(`filter_op_${filter.name}`);
  
  // Add the new filter
  urlParams.set(`filter_${filter.name}`, filter.value);
  urlParams.set(`filter_op_${filter.name}`, filter.type || 'eq');
  
  // Update URL without causing a navigation/reload
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState({}, '', newUrl);
  
  // Call the optional callback with the current filters
  if (onFilterChange) {
    onFilterChange(getFiltersFromUrl());
  }
};

/**
 * Remove a filter from the URL
 * @param {Object} filter Filter object with at least {name}
 * @param {Function} onFilterChange Optional callback after URL update
 */
export const removeFilterFromUrl = (filter, onFilterChange = null) => {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Remove the filter
  urlParams.delete(`filter_${filter.name}`);
  urlParams.delete(`filter_op_${filter.name}`);
  
  // Update URL without causing a navigation/reload
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState({}, '', newUrl);
  
  // Call the optional callback with the current filters
  if (onFilterChange) {
    onFilterChange(getFiltersFromUrl());
  }
};

/**
 * Reset all filters in the URL
 * @param {Function} onFilterChange Optional callback after URL update
 * @param {Array} resetFilters Optional array of filters to set after reset (e.g. defaultFilter=false)
 */
export const resetFiltersInUrl = (onFilterChange = null, resetFilters = []) => {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Get all param keys
  const keysToRemove = [];
  Array.from(urlParams.keys()).forEach(key => {
    if (key.startsWith('filter_')) {
      keysToRemove.push(key);
    }
  });
  
  // Remove all filter params
  keysToRemove.forEach(key => {
    urlParams.delete(key);
  });
  
  // Add resetFilters if provided (e.g., defaultFilter=false)
  if (resetFilters && resetFilters.length > 0) {
    resetFilters.forEach(filter => {
      urlParams.set(`filter_${filter.name}`, filter.value);
      urlParams.set(`filter_op_${filter.name}`, filter.type || 'eq');
    });
  }
  
  // Update URL without causing a navigation/reload
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState({}, '', newUrl);
  
  // Call the optional callback with resetFilters or empty array
  if (onFilterChange) {
    onFilterChange(resetFilters || []);
  }
};

/**
 * Add multiple filters to URL at once
 * @param {Array} filters Array of filter objects
 * @param {Function} onFilterChange Optional callback after URL update
 */
export const addFiltersToUrl = (filters, onFilterChange = null) => {
  if (!filters || !Array.isArray(filters) || filters.length === 0) return;
  
  const urlParams = new URLSearchParams(window.location.search);
  
  filters.forEach(filter => {
    urlParams.set(`filter_${filter.name}`, filter.value);
    urlParams.set(`filter_op_${filter.name}`, filter.type || 'eq');
  });
  
  // Update URL without causing a navigation/reload
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState({}, '', newUrl);
  
  // Call the optional callback with the current filters
  if (onFilterChange) {
    onFilterChange(getFiltersFromUrl());
  }
};

/**
 * Check if a filter exists in the URL
 * @param {String} name Filter name
 * @returns {Boolean} True if filter exists
 */
export const filterExistsInUrl = (name) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has(`filter_${name}`);
};

/**
 * Get a filter value from the URL
 * @param {String} name Filter name
 * @returns {String|null} Filter value or null if not found
 */
export const getFilterValueFromUrl = (name) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(`filter_${name}`);
}; 