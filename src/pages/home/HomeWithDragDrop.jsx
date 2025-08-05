import React, { useState, useEffect, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Box, IconButton, Menu, MenuItem, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { PageTitle } from '../../components/common';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Import all widgets
import WidgetDailyGateWay from './widgetDailyGateWay';
import WidgetDailySales from './widgetDailySale';
import WidgetDailySaleByBrands from './WidgetDailySaleByBrand';
import WidgetFacility from './widgetFacility';
import WidgetMonthlyRegistrationByDays from './WidgetMonthlyRegistrationByDay';
import WidgetMonthlySaleByDays from './WidgetMonthlySaleByDay';
import WidgetNotSentOrder from './WidgetNotSentOrders';
import WidgetOrdersSummary from './WidgetOrdersSummary';
import WidgetPlan from './widgetPlan';
import WidgetRecentOrder from './WidgetRecentOrders';
import WidgetSaleByRegions from './WidgetSaleByRegion';
import WidgetTodaySaleRatios from './WidgetTodaySaleRatio';
import WidgetTopProduct from './WidgetTopProducts';
import WidgetWalletCharges from './widgetWalletCharge';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Widget configuration
const WIDGET_CONFIGS = {
  ordersSummary: {
    component: WidgetOrdersSummary,
    permission: 'widgetOrdersSummary',
    defaultSize: { w: 12, h: 4 },
    minSize: { minW: 6, minH: 3 },
    title: 'خلاصه سفارشات'
  },
  facilityWallet: {
    component: WidgetFacility,
    permission: 'widgetFacilityWallet',
    defaultSize: { w: 12, h: 4 },
    minSize: { minW: 6, minH: 3 },
    title: 'کیف پول تسهیلات'
  },
  walletCharge: {
    component: WidgetWalletCharges,
    permission: 'widgetWalletCharge',
    defaultSize: { w: 6, h: 6 },
    minSize: { minW: 4, minH: 4 },
    title: 'شارژ کیف پول'
  },
  dailyGateway: {
    component: WidgetDailyGateWay,
    permission: 'widgetDisaggregatedDailySales',
    defaultSize: { w: 6, h: 6 },
    minSize: { minW: 4, minH: 4 },
    title: 'فروش روزانه درگاه'
  },
  dailySale: {
    component: WidgetDailySales,
    permission: 'widgetDailySale',
    defaultSize: { w: 3, h: 4 },
    minSize: { minW: 2, minH: 3 },
    title: 'فروش روزانه'
  },
  todaySaleRatio: {
    component: WidgetTodaySaleRatios,
    permission: 'widgetTodaySaleRatio',
    defaultSize: { w: 3, h: 4 },
    minSize: { minW: 2, minH: 3 },
    title: 'نسبت فروش امروز'
  },
  notSentOrders: {
    component: WidgetNotSentOrder,
    permission: 'widgetNotSentOrders',
    defaultSize: { w: 3, h: 4 },
    minSize: { minW: 2, minH: 3 },
    title: 'سفارشات ارسال نشده'
  },
  dailySaleByBrand: {
    component: WidgetDailySaleByBrands,
    permission: 'widgetDailySaleByBrand',
    defaultSize: { w: 3, h: 4 },
    minSize: { minW: 2, minH: 3 },
    title: 'فروش روزانه برند'
  },
  saleByRegion: {
    component: WidgetSaleByRegions,
    permission: 'widgetSaleByRegion',
    defaultSize: { w: 6, h: 6 },
    minSize: { minW: 4, minH: 4 },
    title: 'فروش بر اساس منطقه'
  },
  topProducts: {
    component: WidgetTopProduct,
    permission: 'widgetTopProducts',
    defaultSize: { w: 7, h: 6 },
    minSize: { minW: 4, minH: 4 },
    title: 'محصولات برتر'
  },
  recentOrders: {
    component: WidgetRecentOrder,
    permission: 'widgetRecentOrders',
    defaultSize: { w: 5, h: 6 },
    minSize: { minW: 3, minH: 4 },
    title: 'سفارشات اخیر'
  },
  monthlyRegistration: {
    component: WidgetMonthlyRegistrationByDays,
    permission: 'widgetMonthlyRegistrationByDay',
    defaultSize: { w: 6, h: 6 },
    minSize: { minW: 4, minH: 4 },
    title: 'ثبت نام ماهانه'
  },
  monthlySale: {
    component: WidgetMonthlySaleByDays,
    permission: 'widgetMonthlySaleByDay',
    defaultSize: { w: 6, h: 6 },
    minSize: { minW: 4, minH: 4 },
    title: 'فروش ماهانه'
  },
  planLoan: {
    component: WidgetPlan,
    permission: 'widgetPlanLoanReguest',
    defaultSize: { w: 12, h: 6 },
    minSize: { minW: 6, minH: 4 },
    title: 'درخواست وام'
  }
};

// Default layouts for different breakpoints
const DEFAULT_LAYOUTS = {
  lg: [
    { i: 'ordersSummary', x: 0, y: 0, w: 12, h: 4 },
    { i: 'facilityWallet', x: 0, y: 4, w: 12, h: 4 },
    { i: 'walletCharge', x: 0, y: 8, w: 6, h: 6 },
    { i: 'dailyGateway', x: 6, y: 8, w: 6, h: 6 },
    { i: 'dailySale', x: 0, y: 14, w: 3, h: 4 },
    { i: 'todaySaleRatio', x: 3, y: 14, w: 3, h: 4 },
    { i: 'notSentOrders', x: 0, y: 18, w: 3, h: 4 },
    { i: 'dailySaleByBrand', x: 3, y: 18, w: 3, h: 4 },
    { i: 'saleByRegion', x: 6, y: 14, w: 6, h: 6 },
    { i: 'topProducts', x: 0, y: 22, w: 7, h: 6 },
    { i: 'recentOrders', x: 7, y: 22, w: 5, h: 6 },
    { i: 'monthlyRegistration', x: 0, y: 28, w: 6, h: 6 },
    { i: 'monthlySale', x: 6, y: 28, w: 6, h: 6 },
    { i: 'planLoan', x: 0, y: 34, w: 12, h: 6 }
  ],
  md: [
    { i: 'ordersSummary', x: 0, y: 0, w: 10, h: 4 },
    { i: 'facilityWallet', x: 0, y: 4, w: 10, h: 4 },
    { i: 'walletCharge', x: 0, y: 8, w: 5, h: 6 },
    { i: 'dailyGateway', x: 5, y: 8, w: 5, h: 6 },
    { i: 'dailySale', x: 0, y: 14, w: 5, h: 4 },
    { i: 'todaySaleRatio', x: 5, y: 14, w: 5, h: 4 },
    { i: 'notSentOrders', x: 0, y: 18, w: 5, h: 4 },
    { i: 'dailySaleByBrand', x: 5, y: 18, w: 5, h: 4 },
    { i: 'saleByRegion', x: 0, y: 22, w: 10, h: 6 },
    { i: 'topProducts', x: 0, y: 28, w: 6, h: 6 },
    { i: 'recentOrders', x: 6, y: 28, w: 4, h: 6 },
    { i: 'monthlyRegistration', x: 0, y: 34, w: 5, h: 6 },
    { i: 'monthlySale', x: 5, y: 34, w: 5, h: 6 },
    { i: 'planLoan', x: 0, y: 40, w: 10, h: 6 }
  ],
  sm: [
    { i: 'ordersSummary', x: 0, y: 0, w: 6, h: 4 },
    { i: 'facilityWallet', x: 0, y: 4, w: 6, h: 4 },
    { i: 'walletCharge', x: 0, y: 8, w: 6, h: 6 },
    { i: 'dailyGateway', x: 0, y: 14, w: 6, h: 6 },
    { i: 'dailySale', x: 0, y: 20, w: 3, h: 4 },
    { i: 'todaySaleRatio', x: 3, y: 20, w: 3, h: 4 },
    { i: 'notSentOrders', x: 0, y: 24, w: 3, h: 4 },
    { i: 'dailySaleByBrand', x: 3, y: 24, w: 3, h: 4 },
    { i: 'saleByRegion', x: 0, y: 28, w: 6, h: 6 },
    { i: 'topProducts', x: 0, y: 34, w: 6, h: 6 },
    { i: 'recentOrders', x: 0, y: 40, w: 6, h: 6 },
    { i: 'monthlyRegistration', x: 0, y: 46, w: 6, h: 6 },
    { i: 'monthlySale', x: 0, y: 52, w: 6, h: 6 },
    { i: 'planLoan', x: 0, y: 58, w: 6, h: 6 }
  ],
  xs: [
    { i: 'ordersSummary', x: 0, y: 0, w: 4, h: 4 },
    { i: 'facilityWallet', x: 0, y: 4, w: 4, h: 4 },
    { i: 'walletCharge', x: 0, y: 8, w: 4, h: 6 },
    { i: 'dailyGateway', x: 0, y: 14, w: 4, h: 6 },
    { i: 'dailySale', x: 0, y: 20, w: 4, h: 4 },
    { i: 'todaySaleRatio', x: 0, y: 24, w: 4, h: 4 },
    { i: 'notSentOrders', x: 0, y: 28, w: 4, h: 4 },
    { i: 'dailySaleByBrand', x: 0, y: 32, w: 4, h: 4 },
    { i: 'saleByRegion', x: 0, y: 36, w: 4, h: 6 },
    { i: 'topProducts', x: 0, y: 42, w: 4, h: 6 },
    { i: 'recentOrders', x: 0, y: 48, w: 4, h: 6 },
    { i: 'monthlyRegistration', x: 0, y: 54, w: 4, h: 6 },
    { i: 'monthlySale', x: 0, y: 60, w: 4, h: 6 },
    { i: 'planLoan', x: 0, y: 66, w: 4, h: 6 }
  ]
};

const HomeWithDragDrop = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { themeColor } = useSelector((state) => state.themeColor);
  const [layouts, setLayouts] = useState(() => {
    // Load saved layouts from localStorage
    const savedLayouts = localStorage.getItem('dashboardLayouts');
    return savedLayouts ? JSON.parse(savedLayouts) : DEFAULT_LAYOUTS;
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentWidget, setCurrentWidget] = useState(null);

  const handleMenuOpen = (event, widgetId) => {
    setAnchorEl(event.currentTarget);
    setCurrentWidget(widgetId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentWidget(null);
  };

  const handleResetLayout = () => {
    setLayouts(DEFAULT_LAYOUTS);
    localStorage.setItem('dashboardLayouts', JSON.stringify(DEFAULT_LAYOUTS));
    handleMenuClose();
  };

  const handleExportWidget = () => {
    // Implement export functionality for the current widget
    console.log('Exporting widget:', currentWidget);
    handleMenuClose();
  };

  const handleRefreshWidget = () => {
    // Implement refresh functionality
    window.location.reload();
    handleMenuClose();
  };

  const onLayoutChange = useCallback((currentLayout, allLayouts) => {
    setLayouts(allLayouts);
    localStorage.setItem('dashboardLayouts', JSON.stringify(allLayouts));
  }, []);

  // Filter widgets based on permissions
  const visibleWidgets = Object.entries(WIDGET_CONFIGS).filter(
    ([key, config]) => userPermissions?.[config.permission]?.view
  );

  if (visibleWidgets.length === 0) {
    return (
      <Box
        sx={{
          height: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h5">به داشبورد مدیریتی خوش آمدید</Typography>
        <Typography variant="body2" color="text.secondary">
          هیچ ویجتی برای نمایش وجود ندارد
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <PageTitle />
      <Box sx={{ p: 2 }}>
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          onLayoutChange={onLayoutChange}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
          rowHeight={60}
          draggableHandle=".drag-handle"
          compactType="vertical"
          preventCollision={false}
        >
          {visibleWidgets.map(([key, config]) => {
            const WidgetComponent = config.component;
            return (
              <Paper
                key={key}
                sx={{
                  height: '100%',
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover .widget-controls': {
                    opacity: 1
                  }
                }}
              >
                <Box
                  className="widget-controls"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 10,
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    display: 'flex',
                    gap: 1,
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                    padding: '4px'
                  }}
                >
                  <IconButton
                    size="small"
                    className="drag-handle"
                    sx={{ cursor: 'move' }}
                  >
                    <DragIndicatorIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, key)}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box sx={{ height: '100%', overflow: 'auto' }}>
                  <WidgetComponent />
                </Box>
              </Paper>
            );
          })}
        </ResponsiveGridLayout>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleRefreshWidget}>بازخوانی</MenuItem>
        <MenuItem onClick={handleExportWidget}>خروجی اکسل</MenuItem>
        <MenuItem onClick={handleResetLayout}>بازنشانی چیدمان</MenuItem>
      </Menu>
    </>
  );
};

export default HomeWithDragDrop;