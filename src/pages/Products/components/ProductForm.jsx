import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Switch,
  TextField,
  Typography,
  FormControlLabel,
  Grid,
  Alert,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../../components/dataFetch/axiosInstance';
import {
  baseUrl,
  BRANDS,
  CATEGORIES,
  CREATE_PRODUCT,
  EDIT_PRODUCTS,
  suppliers,
} from '../../../helpers/api-routes';
import { configReq } from '../../../helpers/functions';
import {
  Dropdown,
  TextEditor,
  MultipleImages,
  TextInput,
} from '../../../components/common';
import CategoryBrands from '../../../components/common/CategoryBrands';
import Resizer from 'react-image-file-resizer';

// Validation schema
const productSchema = yup.object().shape({
  title: yup.string().required('نام محصول الزامی است').min(3, 'نام محصول باید حداقل 3 کاراکتر باشد'),
  code: yup.string().required('کد محصول الزامی است'),
  categoryId: yup.object().required('دسته بندی الزامی است').nullable(),
  brandId: yup.object().required('برند الزامی است').nullable(),
  supplierId: yup.object().nullable(),
  description: yup.string(),
  weight: yup.number().positive('وزن باید عدد مثبت باشد').nullable(),
  slug: yup.string().required('نامک الزامی است'),
  active: yup.boolean(),
  comingSoon: yup.boolean(),
  length: yup.number().positive('طول باید عدد مثبت باشد').nullable(),
  width: yup.number().positive('عرض باید عدد مثبت باشد').nullable(),
  height: yup.number().positive('ارتفاع باید عدد مثبت باشد').nullable(),
  weightWithPackage: yup.number().positive('وزن با بسته بندی باید عدد مثبت باشد').nullable(),
  isFake: yup.boolean(),
  shortDescription: yup.string(),
});

const ProductForm = ({ productId, productData, onComplete, onRefresh, isEditMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions, brands, categories } = useSelector((state) => state.relationals);
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [resizing, setResizing] = useState(false);
  const [supplierData, setSupplierData] = useState([]);
  const [brandsData, setBrandsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [files, setFiles] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      title: '',
      code: '',
      categoryId: null,
      brandId: null,
      supplierId: null,
      description: '',
      weight: '',
      slug: '',
      active: false,
      comingSoon: false,
      length: '',
      width: '',
      height: '',
      weightWithPackage: '',
      isFake: false,
      shortDescription: '',
    },
  });

  const titleValue = watch('title');

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        // Load suppliers
        const suppliersRes = await axiosInstance(
          `${baseUrl}/${suppliers}?Page=1&Limit=2000`,
          configReq(token)
        );
        setSupplierData(suppliersRes.data?.data || []);

        // Load brands if not in store
        if (!brands || brands.length === 0) {
          const brandsRes = await axiosInstance(
            `${baseUrl}/${BRANDS}?Page=1&Limit=2000`,
            configReq(token)
          );
          setBrandsData(brandsRes.data?.data || []);
        } else {
          setBrandsData(brands);
        }

        // Load categories if not in store
        if (!categories || categories.length === 0) {
          const categoriesRes = await axiosInstance(
            `${baseUrl}/${CATEGORIES}?Page=1&Limit=2000`,
            configReq(token)
          );
          setCategoriesData(categoriesRes.data?.data || []);
        } else {
          setCategoriesData(categories);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('خطا در بارگذاری اطلاعات');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [token, brands, categories]);

  // Load product data in edit mode
  useEffect(() => {
    if (isEditMode && productData) {
      reset({
        title: productData.title || '',
        code: productData.code || '',
        categoryId: categoriesData.find(cat => cat.id === productData.categoryiId) || null,
        brandId: brandsData.find(brand => brand.id === productData.brandId) || null,
        supplierId: supplierData.find(s => s.id === productData.supplierId) || null,
        description: productData.description || '',
        weight: productData.weight || '',
        slug: productData.slug || '',
        active: productData.active || false,
        comingSoon: productData.comingSoon || false,
        length: productData.length || '',
        width: productData.width || '',
        height: productData.height || '',
        weightWithPackage: productData.weightWithPackage || '',
        isFake: productData.isFake || false,
        shortDescription: productData.shortDescription || '',
      });
      
      // Set images if available
      if (productData.images) {
        setSelectedImages(productData.images);
      }
    }
  }, [isEditMode, productData, categoriesData, brandsData, supplierData, reset]);

  // Auto-generate slug from title
  useEffect(() => {
    if (titleValue && !isEditMode) {
      const slug = titleValue
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-\u0600-\u06FF]+/g, '');
      setValue('slug', slug);
    }
  }, [titleValue, setValue, isEditMode]);

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Prepare form data
      formData.append('title', data.title);
      formData.append('code', data.code);
      formData.append('categoryId', data.categoryId.id);
      formData.append('brandId', data.brandId.id);
      formData.append('slug', data.slug);
      formData.append('active', data.active);
      formData.append('comingSoon', data.comingSoon);
      
      if (data.supplierId?.id) {
        formData.append('supplierId', data.supplierId.id);
      }
      
      if (data.description) {
        formData.append('description', data.description);
      }
      
      if (data.weight) {
        formData.append('weight', data.weight);
      }
      
      if (data.length) {
        formData.append('length', data.length);
      }
      
      if (data.width) {
        formData.append('width', data.width);
      }
      
      if (data.height) {
        formData.append('height', data.height);
      }
      
      if (data.weightWithPackage) {
        formData.append('weightWithPackage', data.weightWithPackage);
      }
      
      formData.append('isFake', data.isFake);
      
      if (data.shortDescription) {
        formData.append('shortDescription', data.shortDescription);
      }

      // Add images
      files.forEach((file, index) => {
        formData.append(`img[${index}]`, file);
      });

      if (isEditMode) {
        formData.append('id', productId);
      }

      const apiUrl = isEditMode 
        ? `${baseUrl}/${EDIT_PRODUCTS}` 
        : `${baseUrl}/${CREATE_PRODUCT}`;

      const response = await axiosInstance[isEditMode ? 'put' : 'post'](
        apiUrl,
        formData,
        configReq(token)
      );

      if (response.data.code === 200) {
        toast.success(isEditMode ? 'محصول با موفقیت ویرایش شد' : 'محصول با موفقیت ایجاد شد');
        
        if (onComplete) {
          const productId = isEditMode ? productId : response.data.data.id;
          const productName = data.title;
          onComplete(productId, productName);
        } else if (isEditMode && onRefresh) {
          onRefresh();
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'خطا در ذخیره محصول');
    } finally {
      setLoading(false);
    }
  };

  const handleImageResize = async (files) => {
    setResizing(true);
    const resizedFiles = [];

    for (const file of files) {
      try {
        await new Promise((resolve) => {
          Resizer.imageFileResizer(
            file,
            800,
            800,
            'JPEG',
            90,
            0,
            (uri) => {
              resizedFiles.push(uri);
              resolve();
            },
            'file'
          );
        });
      } catch (error) {
        console.error('Error resizing image:', error);
        resizedFiles.push(file);
      }
    }

    setFiles(resizedFiles);
    setSelectedImages(resizedFiles.map(file => URL.createObjectURL(file)));
    setResizing(false);
  };

  if (loadingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Title */}
          <Grid item xs={12} md={6}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="نام محصول"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  required
                />
              )}
            />
          </Grid>

          {/* Code */}
          <Grid item xs={12} md={6}>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="کد محصول"
                  fullWidth
                  error={!!errors.code}
                  helperText={errors.code?.message}
                  required
                />
              )}
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12} md={6}>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  label="دسته بندی"
                  options={categoriesData}
                  textField="title"
                  valueField="id"
                  error={!!errors.categoryId}
                  helperText={errors.categoryId?.message}
                  required
                />
              )}
            />
          </Grid>

          {/* Brand */}
          <Grid item xs={12} md={6}>
            <Controller
              name="brandId"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  label="برند"
                  options={brandsData}
                  textField="title"
                  valueField="id"
                  error={!!errors.brandId}
                  helperText={errors.brandId?.message}
                  required
                />
              )}
            />
          </Grid>

          {/* Supplier */}
          <Grid item xs={12} md={6}>
            <Controller
              name="supplierId"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  label="تامین کننده"
                  options={supplierData}
                  textField="name"
                  valueField="id"
                  error={!!errors.supplierId}
                  helperText={errors.supplierId?.message}
                />
              )}
            />
          </Grid>

          {/* Slug */}
          <Grid item xs={12} md={6}>
            <Controller
              name="slug"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="نامک (URL)"
                  fullWidth
                  error={!!errors.slug}
                  helperText={errors.slug?.message}
                  required
                  dir="ltr"
                />
              )}
            />
          </Grid>

          {/* Weight */}
          <Grid item xs={12} md={3}>
            <Controller
              name="weight"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="وزن (گرم)"
                  fullWidth
                  type="number"
                  error={!!errors.weight}
                  helperText={errors.weight?.message}
                />
              )}
            />
          </Grid>

          {/* Dimensions */}
          <Grid item xs={12} md={3}>
            <Controller
              name="length"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="طول (سانتی‌متر)"
                  fullWidth
                  type="number"
                  error={!!errors.length}
                  helperText={errors.length?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Controller
              name="width"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="عرض (سانتی‌متر)"
                  fullWidth
                  type="number"
                  error={!!errors.width}
                  helperText={errors.width?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Controller
              name="height"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ارتفاع (سانتی‌متر)"
                  fullWidth
                  type="number"
                  error={!!errors.height}
                  helperText={errors.height?.message}
                />
              )}
            />
          </Grid>

          {/* Weight with package */}
          <Grid item xs={12} md={6}>
            <Controller
              name="weightWithPackage"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="وزن با بسته بندی (گرم)"
                  fullWidth
                  type="number"
                  error={!!errors.weightWithPackage}
                  helperText={errors.weightWithPackage?.message}
                />
              )}
            />
          </Grid>

          {/* Short Description */}
          <Grid item xs={12} md={6}>
            <Controller
              name="shortDescription"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="توضیحات کوتاه"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.shortDescription}
                  helperText={errors.shortDescription?.message}
                />
              )}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextEditor
                  {...field}
                  label="توضیحات"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Grid>

          {/* Images */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              تصاویر محصول
            </Typography>
            <MultipleImages
              selectedProductImage={selectedImages}
              setselectedProductImage={handleImageResize}
              resizing={resizing}
            />
          </Grid>

          {/* Switches */}
          <Grid item xs={12} md={4}>
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label="فعال"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="comingSoon"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label="به زودی"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="isFake"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label="محصول تقلبی"
                />
              )}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outlined"
                onClick={() => navigate('/products')}
                disabled={loading}
              >
                انصراف
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || resizing}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {isEditMode ? 'ویرایش محصول' : 'ایجاد محصول'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ProductForm;