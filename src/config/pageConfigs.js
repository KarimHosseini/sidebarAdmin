/**
 * Main Page Configuration System for Dynamic Page Generation
 * 
 * This file centralizes all page configurations from organized sub-files
 * to eliminate repetitive code and enable dynamic page generation.
 */

import { productConfigs } from './pageConfigs/productConfigs';
import { reportConfigs } from './pageConfigs/reportConfigs';

/**
 * All Page Configurations
 * Organized by category for better maintainability
 */
const pageConfigs = {
  // Product Management Configurations
  ...productConfigs,
  
  // Report Configurations (Simple + Complex)
  ...reportConfigs,
  
  // Additional configurations can be added here from other organized files
  // ...userConfigs,
  // ...settingsConfigs,
  // ...orderConfigs,
  // etc.
};

/**
 * Get all page configurations
 * @returns {Object} All page configurations
 */
export const getAllPageConfigs = () => pageConfigs;

/**
 * Get configuration for a specific page
 * @param {string} pageName - The page name key
 * @returns {Object|null} Page configuration or null if not found
 */
export const getPageConfig = (pageName) => {
  const config = pageConfigs[pageName];
  if (!config) {
    console.warn(`Page configuration not found for: ${pageName}`);
    return null;
  }
  return config;
};

/**
 * Check if a page uses the dynamic system
 * @param {string} pageName - The page name key
 * @returns {boolean} True if page is dynamic
 */
export const isDynamicPage = (pageName) => {
  return pageConfigs.hasOwnProperty(pageName);
};

/**
 * Get all dynamic page names
 * @returns {string[]} Array of dynamic page names
 */
export const getDynamicPageNames = () => {
  return Object.keys(pageConfigs);
};

export default pageConfigs; 