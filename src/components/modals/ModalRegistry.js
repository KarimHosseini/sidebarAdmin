/**
 * Modal Registry for Dynamic Modal Loading
 * 
 * This registry allows dynamic loading of modal components based on configuration
 * instead of importing all modals in every page.
 */

// Products Section Modals - Lazy loaded for better performance
export const MODAL_REGISTRY = {
  // Brands
  BrandModal: () => import('../../pages/Brands/modal'),
  
  // Categories
  CategoryModal: () => import('../../pages/categories/modal'),
  
  // Attributes
  AttributeModal: () => import('../../pages/Attributes/modal'),
  
  // Public Attributes  
  PublicAttributeModal: () => import('../../pages/PublicAttributes/modal'),
  
  // Attribute Groups
  AttributeGroupModal: () => import('../../pages/AttributeGroups/modal'),
  
  // Info Groups (Category Abilities)
  InfoGroupModal: () => import('../../pages/InfoGroups/modal'),
};

/**
 * Get modal component dynamically
 * @param {string} modalName - Name of the modal component
 * @returns {Promise<React.Component>} Modal component
 */
export const getModalComponent = async (modalName) => {
  if (!MODAL_REGISTRY[modalName]) {
    console.error(`Modal component '${modalName}' not found in registry`);
    return null;
  }
  
  try {
    const module = await MODAL_REGISTRY[modalName]();
    return module.default;
  } catch (error) {
    console.error(`Failed to load modal component '${modalName}':`, error);
    return null;
  }
};

/**
 * Check if modal exists in registry
 * @param {string} modalName - Name of the modal component
 * @returns {boolean} True if modal exists
 */
export const hasModalComponent = (modalName) => {
  return !!MODAL_REGISTRY[modalName];
}; 