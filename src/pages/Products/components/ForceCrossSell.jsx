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
  CardContent,
  CardActions,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../../components/dataFetch/axiosInstance';
import {
  baseUrl,
  ALL_PRICES,
  GET_BULK_SELL,
  EDIT_BULK_SELL,
} from '../../../helpers/api-routes';
import { configReq } from '../../../helpers/functions';
import SelectFromTables from '../../../components/common/SelectFromTables';
import NoAccess from '../../../components/noAccess';

const ForceCrossSell = ({ productId, productData, onComplete, onRefresh, isEditMode }) => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [openSelectDialog, setOpenSelectDialog] = useState(false);
  const [currentProductPrices, setCurrentProductPrices] = useState([]);

  // Check permissions
  if (!userPermissions?.productCrossForcedSell?.view) {
    return <NoAccess />;
  }

  // Load existing force sell products
  useEffect(() => {
    if (productId) {
      setLoading(true);
      
      // Load force sell items
      axiosInstance(
        `${baseUrl}/${GET_BULK_SELL}?productId=${productId}`,
        configReq(token)
      )
        .then((res) => {
          if (res.data.code === 200) {
            setSelectedPrices(res.data.data || []);
          }
        })
        .catch((err) => {
          console.error('Error loading force sell products:', err);
        });

      // Load current product prices to exclude them
      axiosInstance(
        `${baseUrl}/${ALL_PRICES}?Page=1&Limit=20&filter[0][key]=productId&filter[0][value]=${productId}&filter[0][operator]=eq`,
        configReq(token)
      )
        .then((res) => {
          if (res.data.code === 200) {
            setCurrentProductPrices(res.data.data || []);
          }
        })
        .catch((err) => {
          console.error('Error loading product prices:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [productId, token]);

  const handleSave = async () => {
    if (!isEditMode && selectedPrices.length === 0) {
      navigate('/products');
      return;
    }

    setSaving(true);
    
    try {
      const items = selectedPrices.map((item) => ({
        forcedProductPropertyId: item.id,
        activeSellIfZero: item.activeSellIfZero || false,
        productId: productId,
      }));

      const response = await axiosInstance.put(
        `${baseUrl}/${EDIT_BULK_SELL}?productId=${productId}`,
        items,
        configReq(token)
      );

      if (response.data.code === 200) {
        toast.success('فروش اجباری جانبی با موفقیت ذخیره شد');
        
        if (onComplete) {
          onComplete();
        } else {
          navigate('/products');
        }
      }
    } catch (error) {
      console.error('Error saving force cross sell:', error);
      toast.error(error.response?.data?.message || 'خطا در ذخیره فروش اجباری جانبی');
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePrice = (priceToRemove) => {
    setSelectedPrices(prev => 
      prev.filter(price => price.id !== priceToRemove.id)
    );
  };

  const handleToggleActiveSellIfZero = (priceId) => {
    setSelectedPrices(prev => 
      prev.map(price => 
        price.id === priceId 
          ? { ...price, activeSellIfZero: !price.activeSellIfZero }
          : price
      )
    );
  };

  const handleSkip = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigate('/products');
    }
  };

  // Define fields for price table
  const priceFields = [
    {
      name: 'product.title',
      label: 'نام محصول',
      type: 'textInput'
    },
    {
      name: 'product.code',
      label: 'کد محصول',
      type: 'textInput'
    },
    {
      name: 'inventory',
      label: 'موجودی',
      type: 'numberInput'
    },
    {
      name: 'price',
      label: 'قیمت',
      type: 'numberInput'
    },
    {
      name: 'active',
      label: 'وضعیت',
      type: 'switch'
    }
  ];

  const priceApis = {
    GET_DATA: ALL_PRICES,
  };

  // Filter to exclude current product prices
  const defaultFilter = currentProductPrices.length > 0 ? [
    {
      key: 'id',
      operator: 'nin',
      value: currentProductPrices.map(p => p.id)
    }
  ] : [];

  const canEdit = userPermissions?.productCrossForcedSell?.update;

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
            فروش اجباری جانبی
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedPrices.length} کالا انتخاب شده
          </Typography>
        </div>
        
        {canEdit && (
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setOpenSelectDialog(true)}
          >
            افزودن کالا
          </Button>
        )}
      </Box>

      {/* Selected Prices Grid */}
      {selectedPrices.length > 0 ? (
        <Grid container spacing={2}>
          {selectedPrices.map((price) => (
            <Grid item xs={12} sm={6} md={4} key={price.id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" noWrap gutterBottom>
                    {price.product?.title || price.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={`کد: ${price.product?.code || price.code || '-'}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`قیمت: ${price.price?.toLocaleString() || 0} تومان`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  {price.properties && price.properties.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {price.properties.map((prop, index) => (
                        <Chip
                          key={index}
                          label={`${prop.title}: ${prop.value}`}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  )}

                  {canEdit && (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={price.activeSellIfZero || false}
                          onChange={() => handleToggleActiveSellIfZero(price.id)}
                          size="small"
                        />
                      }
                      label="فروش در صورت عدم موجودی"
                      sx={{ mt: 1 }}
                    />
                  )}
                </CardContent>
                
                {canEdit && (
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemovePrice(price)}
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
            هیچ کالایی برای فروش اجباری جانبی انتخاب نشده است
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
            disabled={saving || (!isEditMode && selectedPrices.length === 0)}
            startIcon={saving && <CircularProgress size={20} />}
          >
            ذخیره و ادامه
          </Button>
        )}
      </Box>

      {/* Select Prices Dialog */}
      <SelectFromTables
        open={openSelectDialog}
        onClose={() => setOpenSelectDialog(false)}
        apis={priceApis}
        tableName="کالاها"
        selected={selectedPrices}
        setSelected={setSelectedPrices}
        fields={priceFields}
        permissionsTag="products"
        multiple={true}
        defaultFilter={defaultFilter}
      />
    </Paper>
  );
};

export default ForceCrossSell;