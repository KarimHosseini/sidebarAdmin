import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { PageTitle } from '../../components/common';
import CompanyBasicInfo from './tabs/CompanyBasicInfo';
import CompanyAddresses from './tabs/CompanyAddresses';
import CompanyLogos from './tabs/CompanyLogos';
import CompanySocial from './tabs/CompanySocial';
import CompanyLinks from './tabs/CompanyLinks';
import CompanyPaymentSettings from './tabs/CompanyPaymentSettings';
import CompanyCampaignSettings from './tabs/CompanyCampaignSettings';
import CompanyLoginImages from './tabs/CompanyLoginImages';
import CompanySiteSettings from './tabs/CompanySiteSettings';
import CompanyWalletSettings from './tabs/CompanyWalletSettings';
import CompanyMapSettings from './tabs/CompanyMapSettings';
import CompanyRobotSettings from './tabs/CompanyRobotSettings';
import CompanyProductPageSettings from './tabs/CompanyProductPageSettings';
import CompanyProductSettings from './tabs/CompanyProductSettings';
import CompanyTelegramSettings from './tabs/CompanyTelegramSettings';
import CompanySyncSettings from './tabs/CompanySyncSettings';

const CompanyInfoRefactored = () => {
  const sections = [
    {
      title: 'اطلاعات پایه',
      description: 'اطلاعات اصلی شرکت شامل نام، کد اقتصادی و اطلاعات تماس',
      component: <CompanyBasicInfo />,
      icon: '🏢',
    },
    {
      title: 'آدرس‌ها',
      description: 'مدیریت آدرس‌های شرکت و شعبات',
      component: <CompanyAddresses />,
      icon: '📍',
    },
    {
      title: 'لوگو و تصاویر',
      description: 'مدیریت لوگوها و تصاویر برند',
      component: <CompanyLogos />,
      icon: '🎨',
    },
    {
      title: 'شبکه‌های اجتماعی',
      description: 'لینک‌های شبکه‌های اجتماعی',
      component: <CompanySocial />,
      icon: '📱',
    },
    {
      title: 'پیوندها',
      description: 'مدیریت لینک‌های مفید',
      component: <CompanyLinks />,
      icon: '🔗',
    },
    {
      title: 'تنظیمات پرداخت',
      description: 'پیکربندی درگاه‌های پرداخت',
      component: <CompanyPaymentSettings />,
      icon: '💳',
    },
    {
      title: 'تنظیمات کمپین',
      description: 'مدیریت کمپین‌های تبلیغاتی',
      component: <CompanyCampaignSettings />,
      icon: '📢',
    },
    {
      title: 'تصاویر صفحه ورود',
      description: 'تصاویر صفحه لاگین',
      component: <CompanyLoginImages />,
      icon: '🖼️',
    },
    {
      title: 'تنظیمات سایت',
      description: 'تنظیمات عمومی وب‌سایت',
      component: <CompanySiteSettings />,
      icon: '⚙️',
    },
    {
      title: 'تنظیمات کیف پول',
      description: 'پیکربندی کیف پول و شارژ',
      component: <CompanyWalletSettings />,
      icon: '👛',
    },
    {
      title: 'تنظیمات نقشه',
      description: 'تنظیمات نمایش نقشه',
      component: <CompanyMapSettings />,
      icon: '🗺️',
    },
    {
      title: 'تنظیمات ربات',
      description: 'پیکربندی robots.txt',
      component: <CompanyRobotSettings />,
      icon: '🤖',
    },
    {
      title: 'صفحه محصول',
      description: 'تنظیمات صفحه نمایش محصول',
      component: <CompanyProductPageSettings />,
      icon: '📦',
    },
    {
      title: 'تنظیمات محصول',
      description: 'تنظیمات عمومی محصولات',
      component: <CompanyProductSettings />,
      icon: '📋',
    },
    {
      title: 'تنظیمات تلگرام',
      description: 'پیکربندی ارتباط با تلگرام',
      component: <CompanyTelegramSettings />,
      icon: '✈️',
    },
    {
      title: 'همگام‌سازی',
      description: 'تنظیمات سینک با سایت دوم',
      component: <CompanySyncSettings />,
      icon: '🔄',
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <PageTitle title="اطلاعات شرکت" />
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {sections.map((section, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => 
                    theme.palette.mode === 'light' 
                      ? '0 8px 24px rgba(0,0,0,0.12)' 
                      : '0 8px 24px rgba(255,255,255,0.08)',
                }
              }}
              onClick={() => {
                // Navigate to section or open modal
                window.location.hash = `#${section.title.replace(/\s+/g, '-')}`;
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="h2" component="span" mr={2}>
                    {section.icon}
                  </Typography>
                  <Typography variant="h6" component="h3">
                    {section.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {section.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sections Content */}
      <Box sx={{ mt: 6 }}>
        {sections.map((section, index) => (
          <Box 
            key={index} 
            id={section.title.replace(/\s+/g, '-')}
            sx={{ mb: 6, pt: 2 }}
          >
            <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px', fontSize: '1.5em' }}>{section.icon}</span>
              {section.title}
            </Typography>
            <Box sx={{ mt: 3 }}>
              {section.component}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CompanyInfoRefactored;