import React from 'react';
import AttributesOriginal from '../../../components/single-product/Attributes';

const Attributes = ({ productId, productData, onComplete, onRefresh, isEditMode }) => {
  // Wrapper component to adapt the original Attributes component
  // to the new unified interface
  return (
    <AttributesOriginal 
      data={productData}
      refresh={onRefresh}
    />
  );
};

export default Attributes;