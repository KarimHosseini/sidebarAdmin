import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
  Grid,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../../components/dataFetch/axiosInstance';
import {
  baseUrl,
  ALL_PRODUCTS,
  GET_CROSS_SELL,
  EDIT_CROSS_SELL,
} from '../../../helpers/api-routes';
import { configReq } from '../../../helpers/functions';
import SelectFromTables from '../../../components/common/SelectFromTables';
import NoAccess from '../../../components/noAccess';

const CrossSell = ({ productId, productData, onComplete, onRefresh, isEditMode }) => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [openSelectDialog, setOpenSelectDialog] = useState(false);

  // Check permissions
  if (!userPermissions?.crossCells?.view) {
    return <NoAccess />;
  }

  // Load existing cross sell products
  useEffect(() => {
    if (productId) {
      setLoading(true);
      axiosInstance(
        `${baseUrl}/${GET_CROSS_SELL}?productId=${productId}`,
        configReq(token)
      )
        .then((res) => {
          if (res.data.code === 200) {
            setSelectedProducts(res.data.data || []);
          }
        })
        .catch((err) => {
          console.error('Error loading cross sell products:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [productId, token]);

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const items = selectedProducts.map((item) => ({
        crossProductId: item.id
      }));

      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('crossIds', JSON.stringify(items));

      const response = await axiosInstance.put(
        `${baseUrl}/${EDIT_CROSS_SELL}`,
        formData,
        configReq(token)
      );

      if (response.data.code === 200) {
        toast.success('فروش جانبی با موفقیت ذخیره شد');
        
        if (onComplete) {
          onComplete();
        } else if (onRefresh) {
          onRefresh();
        }
      }
    } catch (error) {
      console.error('Error saving cross sell:', error);
      toast.error(error.response?.data?.message || 'خطا در ذخیره فروش جانبی');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveProduct = (productToRemove) => {
    setSelectedProducts(prev => 
      prev.filter(product => product.id !== productToRemove.id)
    );
  };

  const handleSkip = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigate('/products');
    }
  };

  // Define fields for product table
  const productFields = [
    {
      name: 'title',
      label: 'نام محصول',
      type: 'textInput'
    },
    {
      name: 'code',
      label: 'کد محصول',
      type: 'textInput'
    },
    {
      name: 'brand.title',
      label: 'برند',
      type: 'textInput'
    },
    {
      name: 'category.title',
      label: 'دسته بندی',
      type: 'textInput'
    },
    {
      name: 'active',
      label: 'وضعیت',
      type: 'switch'
    }
  ];

  const productApis = {
    GET_DATA: ALL_PRODUCTS,
  };

  const canEdit = userPermissions?.crossCells?.insert || userPermissions?.crossCells?.update;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h6" gutterBottom>
            فروش جانبی
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedProducts.length} محصول انتخاب شده
          </Typography>
        </div>
        
        {canEdit && (
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setOpenSelectDialog(true)}
          >
            افزودن محصول
          </Button>
        )}
      </Box>

      {/* Selected Products Grid */}
      {selectedProducts.length > 0 ? (
        <Grid container spacing={2}>
          {selectedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card>
                {product.avatar && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.avatar}
                    alt={product.title}
                  />
                )}
                <CardContent>
                  <Typography variant="subtitle2" noWrap>
                    {product.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    کد: {product.code}
                  </Typography>
                </CardContent>
                {canEdit && (
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveProduct(product)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            bgcolor: 'background.default',
            borderRadius: 1,
          }}
        >
          <Typography color="text.secondary">
            هیچ محصولی برای فروش جانبی انتخاب نشده است
          </Typography>
        </Box>
      )}

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {!isEditMode && (
          <Button variant="outlined" onClick={handleSkip}>
            رد کردن این مرحله
          </Button>
        )}
        {canEdit && (
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving && <CircularProgress size={20} />}
          >
            ذخیره و ادامه
          </Button>
        )}
      </Box>

      {/* Select Products Dialog */}
      <SelectFromTables
        open={openSelectDialog}
        onClose={() => setOpenSelectDialog(false)}
        apis={productApis}
        tableName="محصولات"
        selected={selectedProducts}
        setSelected={setSelectedProducts}
        fields={productFields}
        permissionsTag="products"
        multiple={true}
        defaultFilter={[
          {
            key: 'id',
            operator: 'neq',
            value: productId
          }
        ]}
      />
    </Paper>
  );
};

export default CrossSell;