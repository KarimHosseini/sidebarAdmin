import React from 'react';
import PricingOriginal from '../../../components/single-product/Pricing';

const Pricing = ({ productId, productData, onComplete, onRefresh, isEditMode }) => {
  // Wrapper component to adapt the original Pricing component
  // to the new unified interface
  return (
    <PricingOriginal 
      data={productData}
      refresh={onRefresh}
    />
  );
};

export default Pricing;