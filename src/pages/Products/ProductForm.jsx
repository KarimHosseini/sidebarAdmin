import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  useMediaQuery,
  CircularProgress,
  Alert
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PageTitle } from '../../components/common';
import axiosInstance from '../../components/dataFetch/axiosInstance';
import {
  baseUrl,
  SINGLE_PRODUCT,
  CREATE_PRODUCT,
  EDIT_PRODUCT,
  GET_PTODUCT_PUBLIC,
  GET_PRODUCT_ATTR,
  GET_CROSS_SELL,
  GET_BULK_SELL,
  suppliers,
} from '../../helpers/api-routes';
import { configReq } from '../../helpers/functions';
import { toast } from 'react-toastify';

// Import step/tab components
import BasicInfo from '../../components/single-product/BasicInfo';
import PublicAttributes from '../../components/single-product/PublicAttributes';
import SingleProductAttrs from '../../components/single-product/Attributes';
import Pricing from '../../components/single-product/Pricing';
import CrossSells from '../../components/single-product/CrossSells';
import ForceSell from '../../components/single-product/forceSell';

// Validation schema for step 1
const stepOneSchema = yup.object({
  title: yup.string().required('عنوان محصول الزامی است'),
  slug: yup.string().required('نامک الزامی است'),
  categoryId: yup.number().required('دسته بندی الزامی است').positive(),
  brandId: yup.number().nullable(),
  description: yup.string().nullable(),
  shortDescription: yup.string().nullable(),
  active: yup.boolean().default(true),
  showInMainPage: yup.boolean().default(false),
  isSpecial: yup.boolean().default(false),
  weight: yup.number().min(0, 'وزن نمی‌تواند منفی باشد').nullable(),
  length: yup.number().min(0, 'طول نمی‌تواند منفی باشد').nullable(),
  width: yup.number().min(0, 'عرض نمی‌تواند منفی باشد').nullable(),
  height: yup.number().min(0, 'ارتفاع نمی‌تواند منفی باشد').nullable(),
});

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const isMd = useMediaQuery('(min-width:900px)');
  
  // Mode: 'create' or 'edit'
  const mode = id ? 'edit' : 'create';
  
  // State management
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(null);
  const [currentStep, setCurrentStep] = useState(mode === 'create' ? 0 : -1);
  const [currentTab, setCurrentTab] = useState(0);
  const [createdId, setCreatedId] = useState(null);
  const [steps, setSteps] = useState([]);
  const [refresh, setRefresh] = useState(0);
  
  // Form data states
  const [publicAttributes, setPublicAttributes] = useState([]);
  const [productAttributes, setProductAttributes] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [crossSells, setCrossSells] = useState([]);
  const [forceCrossSells, setForceCrossSells] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  
  // React Hook Form
  const methods = useForm({
    resolver: yupResolver(stepOneSchema),
    defaultValues: {
      active: true,
      showInMainPage: false,
      isSpecial: false,
    }
  });
  
  const { handleSubmit, reset, watch } = methods;
  const productTitle = watch('title');
  
  // Setup steps/tabs based on permissions
  useEffect(() => {
    const availableSteps = [
      { 
        name: 'basic', 
        title: 'اطلاعات پایه',
        permission: true // Always available
      },
      {
        name: 'publicAttributes',
        title: 'ویژگی‌های عمومی',
        permission: userPermissions?.productPublicAttribute?.view
      },
      {
        name: 'productAttributes',
        title: 'ویژگی‌های مشخصاتی',
        permission: userPermissions?.productAttribute?.view
      },
      {
        name: 'pricing',
        title: 'قیمت‌گذاری ویژگی‌ها',
        permission: userPermissions?.productProperties?.view
      },
      {
        name: 'crossSells',
        title: 'فروش جانبی',
        permission: userPermissions?.crossCells?.view
      },
      {
        name: 'forceCrossSells',
        title: 'فروش اجباری جانبی',
        permission: userPermissions?.productCrossForcedSell?.view
      }
    ];
    
    setSteps(availableSteps.filter(step => step.permission));
  }, [userPermissions]);
  
  // Load product data in edit mode
  useEffect(() => {
    if (mode === 'edit' && id) {
      loadProductData();
      loadRelatedData();
    }
    loadSuppliers();
  }, [id, mode, refresh]);
  
  // Load product basic data
  const loadProductData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance(
        `${baseUrl}/${SINGLE_PRODUCT}?id=${id}`,
        configReq(token)
      );
      if (res.data.code === 200) {
        setProductData(res.data.data);
        reset(res.data.data); // Reset form with loaded data
      }
    } catch (error) {
      toast.error('خطا در بارگذاری اطلاعات محصول');
    } finally {
      setLoading(false);
    }
  };
  
  // Load related data (attributes, pricing, etc.)
  const loadRelatedData = async () => {
    try {
      // Load public attributes
      const publicRes = await axiosInstance(
        `${baseUrl}/${GET_PTODUCT_PUBLIC}?productId=${id}`,
        configReq(token)
      );
      if (publicRes.data.code === 200) {
        setPublicAttributes(publicRes.data.data);
      }
      
      // Load product attributes
      const attrRes = await axiosInstance(
        `${baseUrl}/${GET_PRODUCT_ATTR}?productId=${id}`,
        configReq(token)
      );
      if (attrRes.data.code === 200) {
        setProductAttributes(attrRes.data.data);
      }
      
      // Load pricing
      // ... (similar API calls for pricing, cross-sells, etc.)
      
    } catch (error) {
      console.error('Error loading related data:', error);
    }
  };
  
  // Load suppliers
  const loadSuppliers = async () => {
    try {
      const res = await axiosInstance(
        `${baseUrl}/${suppliers}?Page=1&Limit=100000`,
        configReq(token)
      );
      if (res.data.code === 200) {
        setSupplierData(res.data.data);
      }
    } catch (error) {
      console.error('Error loading suppliers:', error);
    }
  };
  
  // Handle form submission for step 1
  const onSubmitStepOne = async (data) => {
    setLoading(true);
    try {
      if (mode === 'create') {
        const res = await axiosInstance.post(
          `${baseUrl}/${CREATE_PRODUCT}`,
          data,
          configReq(token)
        );
        if (res.data.code === 200) {
          toast.success('محصول با موفقیت ایجاد شد');
          setCreatedId(res.data.data.id);
          setProductData(res.data.data);
          setCurrentStep(1);
        }
      } else {
        const res = await axiosInstance.put(
          `${baseUrl}/${EDIT_PRODUCT}`,
          { ...data, id },
          configReq(token)
        );
        if (res.data.code === 200) {
          toast.success('محصول با موفقیت ویرایش شد');
          setRefresh(prev => prev + 1);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'خطا در ذخیره اطلاعات');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle step navigation
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleFinish = () => {
    navigate('/products');
  };
  
  // Render step content
  const renderStepContent = () => {
    const stepName = steps[currentStep]?.name;
    const productId = createdId || id;
    
    switch (stepName) {
      case 'basic':
        return (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitStepOne)}>
              <BasicInfo
                mode={mode}
                loading={loading}
                supplierData={supplierData}
                productData={productData}
                onNext={mode === 'create' ? handleNext : undefined}
              />
            </form>
          </FormProvider>
        );
      
      case 'publicAttributes':
        return (
          <PublicAttributes
            productId={productId}
            data={publicAttributes}
            onRefresh={() => setRefresh(prev => prev + 1)}
            onNext={handleNext}
            onBack={handleBack}
            isLastStep={currentStep === steps.length - 1}
            onFinish={handleFinish}
          />
        );
      
      case 'productAttributes':
        return (
          <SingleProductAttrs
            productId={productId}
            data={productAttributes}
            onRefresh={() => setRefresh(prev => prev + 1)}
            onNext={handleNext}
            onBack={handleBack}
            isLastStep={currentStep === steps.length - 1}
            onFinish={handleFinish}
          />
        );
      
      case 'pricing':
        return (
          <Pricing
            productId={productId}
            productTitle={productTitle || productData?.title}
            data={pricing}
            onRefresh={() => setRefresh(prev => prev + 1)}
            onNext={handleNext}
            onBack={handleBack}
            isLastStep={currentStep === steps.length - 1}
            onFinish={handleFinish}
          />
        );
      
      case 'crossSells':
        return (
          <CrossSells
            productId={productId}
            data={crossSells}
            onRefresh={() => setRefresh(prev => prev + 1)}
            onNext={handleNext}
            onBack={handleBack}
            isLastStep={currentStep === steps.length - 1}
            onFinish={handleFinish}
          />
        );
      
      case 'forceCrossSells':
        return (
          <ForceSell
            productId={productId}
            data={forceCrossSells}
            onRefresh={() => setRefresh(prev => prev + 1)}
            onNext={handleNext}
            onBack={handleBack}
            isLastStep={currentStep === steps.length - 1}
            onFinish={handleFinish}
          />
        );
      
      default:
        return null;
    }
  };
  
  // Render tab content (for edit mode)
  const renderTabContent = () => {
    const tabName = steps[currentTab]?.name;
    
    switch (tabName) {
      case 'basic':
        return (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitStepOne)}>
              <BasicInfo
                mode={mode}
                loading={loading}
                supplierData={supplierData}
                productData={productData}
              />
            </form>
          </FormProvider>
        );
      
      // ... (similar cases for other tabs)
      
      default:
        return null;
    }
  };
  
  if (loading && !productData && mode === 'edit') {
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
          mode === 'create'
            ? currentStep === 0
              ? 'افزودن محصول'
              : `ثبت ${steps[currentStep]?.title} ${productTitle || ''}`
            : `ویرایش محصول: ${productData?.title || ''}`
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
      
      <Box sx={{ px: 3 }}>
        {mode === 'create' ? (
          // Stepper for create mode
          <>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Stepper activeStep={currentStep} alternativeLabel>
                {steps.map((step, index) => (
                  <Step key={step.name}>
                    <StepLabel>{step.title}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
              {renderStepContent()}
            </Paper>
          </>
        ) : (
          // Tabs for edit mode
          <>
            <Paper sx={{ mb: 2 }}>
              <Tabs
                value={currentTab}
                onChange={(e, newValue) => setCurrentTab(newValue)}
                variant={isMd ? 'standard' : 'scrollable'}
                scrollButtons="auto"
              >
                {steps.map((step, index) => (
                  <Tab key={step.name} label={step.title} />
                ))}
              </Tabs>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
              {renderTabContent()}
            </Paper>
          </>
        )}
      </Box>
    </>
  );
};

export default ProductForm;