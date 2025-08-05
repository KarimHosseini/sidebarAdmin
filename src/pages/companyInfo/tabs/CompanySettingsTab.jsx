import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axiosInstance from '../../../components/dataFetch/axiosInstance';
import {
  baseUrl,
  GET_SETTINGS,
  EDIT_SETTINGS,
  GET_SETTING_MAINTEIN,
  GET_SETTING_SYNC_PRODUCT,
  GET_SETTING_TELEGRAM,
  GET_SETTING_WALLET,
  SHOW_MAP_SETTING,
  SHOW_ROBOTS_SETTING,
  CHANGE_SHOW_UNAVILABLE_PRODUCTS,
  CHANGE_CATELOGE_WEBSITE,
} from '../../../helpers/api-routes';
import { configReq } from '../../../helpers/functions';
import { TextInput } from '../../../components/common';

const CompanySettingsTab = () => {
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    showUnavailableProducts: false,
    catalogWebsite: false,
    showMap: false,
    noRobots: false,
    walletSettings: {},
    telegramSettings: {},
    syncSettings: {},
    maintenanceSettings: {},
  });

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        // Load main settings
        const mainRes = await axiosInstance(
          `${baseUrl}/${GET_SETTINGS}`,
          configReq(token)
        );
        
        // Load specific settings
        const [walletRes, telegramRes, syncRes, maintenanceRes, mapRes, robotsRes] = await Promise.all([
          axiosInstance(`${baseUrl}/${GET_SETTING_WALLET}`, configReq(token)),
          axiosInstance(`${baseUrl}/${GET_SETTING_TELEGRAM}`, configReq(token)),
          axiosInstance(`${baseUrl}/${GET_SETTING_SYNC_PRODUCT}`, configReq(token)),
          axiosInstance(`${baseUrl}/${GET_SETTING_MAINTEIN}`, configReq(token)),
          axiosInstance(`${baseUrl}/${SHOW_MAP_SETTING}`, configReq(token)),
          axiosInstance(`${baseUrl}/${SHOW_ROBOTS_SETTING}`, configReq(token)),
        ]);

        setSettings({
          ...mainRes.data.data,
          walletSettings: walletRes.data.data || {},
          telegramSettings: telegramRes.data.data || {},
          syncSettings: syncRes.data.data || {},
          maintenanceSettings: maintenanceRes.data.data || {},
          showMap: mapRes.data.data?.showMap || false,
          noRobots: robotsRes.data.data?.noRobots || false,
        });
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('خطا در بارگذاری تنظیمات');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [token]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Save main settings
      await axiosInstance.put(
        `${baseUrl}/${EDIT_SETTINGS}`,
        settings,
        configReq(token)
      );
      
      toast.success('تنظیمات با موفقیت ذخیره شد');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('خطا در ذخیره تنظیمات');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSwitch = async (settingName, apiEndpoint) => {
    try {
      const newValue = !settings[settingName];
      setSettings(prev => ({ ...prev, [settingName]: newValue }));
      
      await axiosInstance.put(
        `${baseUrl}/${apiEndpoint}`,
        { [settingName]: newValue },
        configReq(token)
      );
      
      toast.success('تنظیمات بروزرسانی شد');
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('خطا در بروزرسانی تنظیمات');
      // Revert on error
      setSettings(prev => ({ ...prev, [settingName]: !newValue }));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const canEdit = userPermissions?.companyInfo?.update;

  return (
    <Box>
      {/* General Settings */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">تنظیمات عمومی</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showUnavailableProducts}
                    onChange={() => handleToggleSwitch('showUnavailableProducts', CHANGE_SHOW_UNAVILABLE_PRODUCTS)}
                    disabled={!canEdit}
                  />
                }
                label="نمایش محصولات ناموجود"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.catalogWebsite}
                    onChange={() => handleToggleSwitch('catalogWebsite', CHANGE_CATELOGE_WEBSITE)}
                    disabled={!canEdit}
                  />
                }
                label="سایت کاتالوگ"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showMap}
                    onChange={() => handleToggleSwitch('showMap', SHOW_MAP_SETTING)}
                    disabled={!canEdit}
                  />
                }
                label="نمایش نقشه"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.noRobots}
                    onChange={() => handleToggleSwitch('noRobots', SHOW_ROBOTS_SETTING)}
                    disabled={!canEdit}
                  />
                }
                label="عدم ایندکس توسط موتورهای جستجو"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Maintenance Settings */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">تنظیمات حالت تعمیر</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.maintenanceSettings.active || false}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      maintenanceSettings: {
                        ...prev.maintenanceSettings,
                        active: e.target.checked
                      }
                    }))}
                    disabled={!canEdit}
                  />
                }
                label="فعال کردن حالت تعمیر"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="پیام حالت تعمیر"
                multiline
                rows={3}
                value={settings.maintenanceSettings.message || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  maintenanceSettings: {
                    ...prev.maintenanceSettings,
                    message: e.target.value
                  }
                }))}
                disabled={!canEdit}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Wallet Settings */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">تنظیمات کیف پول</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="حداقل مبلغ شارژ"
                type="number"
                value={settings.walletSettings.minCharge || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  walletSettings: {
                    ...prev.walletSettings,
                    minCharge: e.target.value
                  }
                }))}
                disabled={!canEdit}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="حداکثر مبلغ شارژ"
                type="number"
                value={settings.walletSettings.maxCharge || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  walletSettings: {
                    ...prev.walletSettings,
                    maxCharge: e.target.value
                  }
                }))}
                disabled={!canEdit}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Telegram Settings */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">تنظیمات تلگرام</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="توکن ربات"
                value={settings.telegramSettings.botToken || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  telegramSettings: {
                    ...prev.telegramSettings,
                    botToken: e.target.value
                  }
                }))}
                disabled={!canEdit}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="چت آی‌دی"
                value={settings.telegramSettings.chatId || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  telegramSettings: {
                    ...prev.telegramSettings,
                    chatId: e.target.value
                  }
                }))}
                disabled={!canEdit}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Sync Settings */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">تنظیمات همگام‌سازی</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.syncSettings.autoSync || false}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      syncSettings: {
                        ...prev.syncSettings,
                        autoSync: e.target.checked
                      }
                    }))}
                    disabled={!canEdit}
                  />
                }
                label="همگام‌سازی خودکار"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="بازه زمانی همگام‌سازی (دقیقه)"
                type="number"
                value={settings.syncSettings.syncInterval || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  syncSettings: {
                    ...prev.syncSettings,
                    syncInterval: e.target.value
                  }
                }))}
                disabled={!canEdit}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Save Button */}
      {canEdit && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSaveSettings}
            disabled={saving}
            startIcon={saving && <CircularProgress size={20} />}
          >
            ذخیره تنظیمات
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CompanySettingsTab;