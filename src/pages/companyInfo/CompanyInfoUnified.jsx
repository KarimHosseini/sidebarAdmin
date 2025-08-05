import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Divider,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { PageTitle } from '../../components/common';
import NoAccess from '../../components/noAccess';

// Import tab components
import CompanyBasicInfo from './tabs/CompanyBasicInfo';
import CompanyAddressesTab from './tabs/CompanyAddressesTab';
import CompanyLogosTab from './tabs/CompanyLogosTab';
import CompanyLinksTab from './tabs/CompanyLinksTab';
import CompanyLoginImagesTab from './tabs/CompanyLoginImagesTab';
import CompanySocialTab from './tabs/CompanySocialTab';
import CompanySettingsTab from './tabs/CompanySettingsTab';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`company-tabpanel-${index}`}
      aria-labelledby={`company-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const CompanyInfoUnified = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [value, setValue] = useState(0);

  // Check if user has any company info permissions
  const hasAnyPermission = userPermissions?.companyInfo?.view ||
    userPermissions?.brand?.view ||
    userPermissions?.companyInfo?.insert ||
    userPermissions?.companyInfo?.update;

  if (!hasAnyPermission) {
    return <NoAccess />;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Define tab configurations with improved organization
  const tabConfigs = [
    {
      label: 'اطلاعات پایه',
      component: CompanyBasicInfo,
      permission: userPermissions?.companyInfo?.view,
    },
    {
      label: 'آدرس‌ها',
      component: CompanyAddressesTab,
      permission: userPermissions?.companyInfo?.view,
    },
    {
      label: 'لوگوها و تصاویر',
      component: CompanyLogosTab,
      permission: userPermissions?.brand?.view,
    },
    {
      label: 'لینک‌ها',
      component: CompanyLinksTab,
      permission: userPermissions?.companyInfo?.view,
    },
    {
      label: 'تصاویر ورود',
      component: CompanyLoginImagesTab,
      permission: userPermissions?.companyInfo?.view,
    },
    {
      label: 'شبکه‌های اجتماعی',
      component: CompanySocialTab,
      permission: userPermissions?.companyInfo?.view,
    },
    {
      label: 'تنظیمات',
      component: CompanySettingsTab,
      permission: userPermissions?.companyInfo?.view,
    },
  ];

  // Filter tabs based on permissions
  const availableTabs = tabConfigs.filter(tab => tab.permission);

  return (
    <>
      <PageTitle
        title="اطلاعات شرکت"
        broadCrumb={[
          {
            title: 'تنظیمات',
            path: '/settings',
          },
        ]}
      />

      <Box sx={{ width: '100%', px: 3 }}>
        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '0.95rem',
              },
            }}
          >
            {availableTabs.map((tab, index) => (
              <Tab
                key={index}
                label={tab.label}
                id={`company-tab-${index}`}
                aria-controls={`company-tabpanel-${index}`}
              />
            ))}
          </Tabs>

          {availableTabs.map((tab, index) => {
            const TabComponent = tab.component;
            return (
              <TabPanel key={index} value={value} index={index}>
                <TabComponent />
              </TabPanel>
            );
          })}
        </Paper>
      </Box>
    </>
  );
};

export default CompanyInfoUnified;