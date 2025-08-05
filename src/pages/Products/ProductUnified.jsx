import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Tabs,
  Tab,
  Button,
  CircularProgress,
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PageTitle } from '../../components/common';
import ProductForm from './components/ProductForm';
import PublicAttributes from './components/PublicAttributes';
import Attributes from './components/Attributes';
import Pricing from './components/Pricing';
import CrossSell from './components/CrossSell';
import ForceCrossSell from './components/ForceCrossSell';
import axiosInstance from '../../components/dataFetch/axiosInstance';
import { baseUrl, SINGLE_PRODUCT } from '../../helpers/api-routes';
import { configReq } from '../../helpers/functions';

const ProductUnified = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  
  const isEditMode = Boolean(id);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [createdId, setCreatedId] = useState(null);
  const [createdName, setCreatedName] = useState('');
  const [refresh, setRefresh] = useState(0);

  // Define steps/tabs based on permissions
  const stepsConfig = useMemo(() => {
    const config = [
      { name: 'basic', title: 'تعریف محصول', component: ProductForm, permission: true }
    ];

    if (userPermissions?.productPublicAttribute?.view) {
      config.push({
        name: 'publicAttributes',
        title: 'ویژگیهای عمومی',
        component: PublicAttributes,
        permission: userPermissions?.productPublicAttribute?.insert || userPermissions?.productPublicAttribute?.update
      });
    }

    if (userPermissions?.productAttribute?.view) {
      config.push({
        name: 'attributes',
        title: 'ویژگی های مشخصاتی',
        component: Attributes,
        permission: userPermissions?.productAttribute?.update
      });
    }

    if (userPermissions?.productProperties?.view) {
      config.push({
        name: 'pricing',
        title: 'قیمت گذاری ویژگی ها',
        component: Pricing,
        permission: userPermissions?.productProperties?.update
      });
    }

    if (userPermissions?.crossCells?.view) {
      config.push({
        name: 'crossSell',
        title: 'فروش جانبی',
        component: CrossSell,
        permission: userPermissions?.crossCells?.update
      });
    }

    if (userPermissions?.productCrossForcedSell?.view) {
      config.push({
        name: 'forceCrossSell',
        title: 'فروش اجباری جانبی',
        component: ForceCrossSell,
        permission: userPermissions?.productCrossForcedSell?.update
      });
    }

    return config;
  }, [userPermissions]);

  // Load product data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true);
      axiosInstance(`${baseUrl}/${SINGLE_PRODUCT}?id=${id}`, configReq(token))
        .then((res) => {
          if (res.data.code === 200) {
            setProductData(res.data.data);
            setCreatedId(id);
            setCreatedName(res.data.data.title);
          }
        })
        .catch((err) => {
          console.error('Error loading product:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, token, isEditMode, refresh]);

  // Handle URL hash for tabs in edit mode
  useEffect(() => {
    if (isEditMode && location.hash) {
      const hashMap = {
        '#step2': 1,
        '#step3': 2,
        '#step4': 3,
        '#step5': 4,
        '#step6': 5,
      };
      const tabIndex = hashMap[location.hash] || 0;
      setCurrentTab(tabIndex);
    }
  }, [location.hash, isEditMode]);

  const handleStepComplete = (productId, productName) => {
    if (!isEditMode && currentStep === 0) {
      // First step completed in create mode
      setCreatedId(productId);
      setCreatedName(productName);
      setProductData({ id: productId, title: productName });
    }
    
    // Move to next step
    if (currentStep < stepsConfig.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // All steps completed, navigate to products list
      navigate('/products');
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSkipStep = () => {
    if (currentStep < stepsConfig.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/products');
    }
  };

  const renderStepContent = () => {
    const stepConfig = stepsConfig[currentStep];
    if (!stepConfig) return null;

    const StepComponent = stepConfig.component;
    
    return (
      <StepComponent
        productId={createdId || id}
        productData={productData}
        onComplete={handleStepComplete}
        onRefresh={() => setRefresh(prev => prev + 1)}
        isEditMode={isEditMode}
      />
    );
  };

  const renderTabContent = () => {
    const tabConfig = stepsConfig[currentTab];
    if (!tabConfig) return null;

    const TabComponent = tabConfig.component;
    
    return (
      <TabComponent
        productId={id}
        productData={productData}
        onComplete={() => {}}
        onRefresh={() => setRefresh(prev => prev + 1)}
        isEditMode={true}
      />
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <PageTitle
        title={
          isEditMode
            ? `ویرایش محصول: ${productData?.title || ''}`
            : currentStep === 0
            ? 'افزودن محصول'
            : `ثبت ${stepsConfig[currentStep]?.title} ${createdName}`
        }
        broadCrumb={[
          {
            title: 'مدیریت محصولات',
            path: '/products',
          },
          {
            title: 'محصولات',
            path: '/products',
          },
        ]}
      />
      
      <div className="px-3 biggerButton">
        {!isEditMode ? (
          // Create Mode - Stepper
          <Box sx={{ width: '100%', my: 2 }}>
            <Stepper activeStep={currentStep} alternativeLabel>
              {stepsConfig.map((step, index) => (
                <Step key={step.name}>
                  <StepLabel>{step.title}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            <Paper sx={{ mt: 3, p: 3 }}>
              {renderStepContent()}
              
              {currentStep > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleSkipStep}
                  >
                    رد کردن این مرحله
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>
        ) : (
          // Edit Mode - Tabs
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                {stepsConfig.map((tab, index) => (
                  <Tab key={tab.name} label={tab.title} />
                ))}
              </Tabs>
            </Paper>
            
            <Box sx={{ mt: 3 }}>
              {renderTabContent()}
            </Box>
          </Box>
        )}
      </div>
    </>
  );
};

export default ProductUnified;