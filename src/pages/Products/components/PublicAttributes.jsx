import React from 'react';
import PublicAttributesOriginal from '../../../components/single-product/PublicAttributes';

const PublicAttributes = ({ productId, productData, onComplete, onRefresh, isEditMode }) => {
  // Wrapper component to adapt the original PublicAttributes component
  // to the new unified interface
  return (
    <PublicAttributesOriginal 
      data={productData}
      refresh={onRefresh}
    />
  );
};

export default PublicAttributes;