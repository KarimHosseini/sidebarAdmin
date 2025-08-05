import React, { useState, useEffect, useCallback, lazy, Suspense, useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Box, IconButton, Menu, MenuItem, Paper, Typography, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { PageTitle } from '../../components/common';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Lazy load all widgets
const widgets = {
  ordersSummary: lazy(() => import('./WidgetOrdersSummary')),
  facilityWallet: lazy(() => import('./widgetFacility')),
  walletCharge: lazy(() => import('./widgetWalletCharge')),
  dailyGateway: lazy(() => import('./widgetDailyGateWay')),
  dailySale: lazy(() => import('./widgetDailySale')),
  todaySaleRatio: lazy(() => import('./WidgetTodaySaleRatio')),
  notSentOrders: lazy(() => import('./WidgetNotSentOrders')),
  dailySaleByBrand: lazy(() => import('./WidgetDailySaleByBrand')),
  saleByRegion: lazy(() => import('./WidgetSaleByRegion')),
  topProducts: lazy(() => import('./WidgetTopProducts')),
  recentOrders: lazy(() => import('./WidgetRecentOrders')),
  monthlyRegistration: lazy(() => import('./WidgetMonthlyRegistrationByDay')),
  monthlySale: lazy(() => import('./WidgetMonthlySaleByDay')),
  planLoan: lazy(() => import('./widgetPlan'))
};

// Widget configuration
const WIDGET_CONFIGS = {
  ordersSummary: {
    permission: 'widgetOrdersSummary',
    defaultSize: { w: 12, h: 4 },
    minSize: { minW: 6, minH: 3 },
    title: 'خلاصه سفارشات'
  },
  facilityWallet: {
    permission: 'widgetFacilityWallet',
    defaultSize: { w: 12, h: 4 },
    minSize: { minW: 6, minH: 3 },
    title: 'کیف پول تسهیلات'
  },
  walletCharge: {
    permission: 'widgetWalletCharge',
    defaultSize: { w: 6, h: 6 },
    minSize: { minW: 4, minH: 4 },
    title: 'شارژ کیف پول'
  },
  dailyGateway: {
    permission: 'widgetDisaggregatedDailySales',
    defaultSize: { w: 6, h: 6 },
    minSize: { minW: 4, minH: 4 },
    title: 'فروش روزانه درگاه'
  },
  dailySale: {
    permission: 'widgetDailySale',
    defaultSize: { w: 3, h: 4 },
    minSize: { minW: 2, minH: 3 },
    title: 'فروش روزانه'
  },
  todaySaleRatio: {
    permission: 'widgetTodaySaleRatio',
    defaultSize: { w: 3, h: 4 },
    minSize: { minW: 2, minH: 3 },
    title: 'نسبت فروش امروز'
  },
  notSentOrders: {
    permission: 'widgetNotSentOrders',
    defaultSize: { w: 3, h: 4 },
    minSize: { minW: 2, minH: 3 },
    title: 'سفارشات ارسال نشده'
  },
  dailySaleByBrand: {
    permission: 'widgetDailySaleByBrand',
    defaultSize: { w: 3, h: 4 },
    minSize: { minW: 2, minH: 3 },
    title: 'فروش روزانه برند'
  },
  saleByRegion: {
    permission: 'widgetSaleByRegion',
    defaultSize: { w: 6, h: 6 },
    minSize: { minW: 4, minH: 4 },
    title: 'فروش بر اساس منطقه'
  },
  topProducts: {
    permission: 'widgetTopProducts',
    defaultSize: { w: 7, h: 6 },
    minSize: { minW: 4, minH: 4 },
    title: 'محصولات برتر'
  },
  recentOrders: {
    permission: 'widgetRecentOrders',
    defaultSize: { w: 5, h: 6 },
    minSize: { minW: 3, minH: 4 },
    title: 'سفارشات اخیر'
  },
  monthlyRegistration: {
    permission: 'widgetMonthlyRegistrationByDay',
    defaultSize: { w: 6, h: 6 },
    minSize: { minW: 4, minH: 4 },
    title: 'ثبت نام ماهانه'
  },
  monthlySale: {
    permission: 'widgetMonthlySaleByDay',
    defaultSize: { w: 6, h: 6 },
    minSize: { minW: 4, minH: 4 },
    title: 'فروش ماهانه'
  },
  planLoan: {
    permission: 'widgetPlanLoanReguest',
    defaultSize: { w: 12, h: 6 },
    minSize: { minW: 6, minH: 4 },
    title: 'درخواست وام'
  }
};

// Optimized default layouts
const getDefaultLayouts = () => ({
  lg: Object.entries(WIDGET_CONFIGS).map(([key], index) => ({
    i: key,
    x: (index % 2) * 6,
    y: Math.floor(index / 2) * 6,
    ...WIDGET_CONFIGS[key].defaultSize
  })),
  md: Object.entries(WIDGET_CONFIGS).map(([key], index) => ({
    i: key,
    x: (index % 2) * 5,
    y: Math.floor(index / 2) * 6,
    w: Math.min(WIDGET_CONFIGS[key].defaultSize.w, 5),
    h: WIDGET_CONFIGS[key].defaultSize.h
  })),
  sm: Object.entries(WIDGET_CONFIGS).map(([key], index) => ({
    i: key,
    x: 0,
    y: index * 6,
    w: 6,
    h: WIDGET_CONFIGS[key].defaultSize.h
  })),
  xs: Object.entries(WIDGET_CONFIGS).map(([key], index) => ({
    i: key,
    x: 0,
    y: index * 6,
    w: 4,
    h: WIDGET_CONFIGS[key].defaultSize.h
  }))
});

// Widget wrapper component for lazy loading
const WidgetWrapper = React.memo(({ widgetKey, config }) => {
  const WidgetComponent = widgets[widgetKey];
  
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            minHeight: 200
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <WidgetComponent />
    </Suspense>
  );
});

const HomeWithDragDropOptimized = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { themeColor } = useSelector((state) => state.themeColor);
  
  // Memoize layouts initialization
  const [layouts, setLayouts] = useState(() => {
    const savedLayouts = localStorage.getItem('dashboardLayouts');
    try {
      return savedLayouts ? JSON.parse(savedLayouts) : getDefaultLayouts();
    } catch {
      return getDefaultLayouts();
    }
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentWidget, setCurrentWidget] = useState(null);

  // Memoize visible widgets
  const visibleWidgets = useMemo(
    () => Object.entries(WIDGET_CONFIGS).filter(
      ([key, config]) => userPermissions?.[config.permission]?.view
    ),
    [userPermissions]
  );

  const handleMenuOpen = useCallback((event, widgetId) => {
    setAnchorEl(event.currentTarget);
    setCurrentWidget(widgetId);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setCurrentWidget(null);
  }, []);

  const handleResetLayout = useCallback(() => {
    const newLayouts = getDefaultLayouts();
    setLayouts(newLayouts);
    localStorage.setItem('dashboardLayouts', JSON.stringify(newLayouts));
    handleMenuClose();
  }, [handleMenuClose]);

  const handleExportWidget = useCallback(() => {
    console.log('Exporting widget:', currentWidget);
    handleMenuClose();
  }, [currentWidget, handleMenuClose]);

  const handleRefreshWidget = useCallback(() => {
    window.location.reload();
    handleMenuClose();
  }, [handleMenuClose]);

  // Debounced layout change handler
  const onLayoutChange = useCallback((currentLayout, allLayouts) => {
    setLayouts(allLayouts);
    // Debounce localStorage writes
    clearTimeout(window.layoutSaveTimeout);
    window.layoutSaveTimeout = setTimeout(() => {
      localStorage.setItem('dashboardLayouts', JSON.stringify(allLayouts));
    }, 500);
  }, []);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (window.layoutSaveTimeout) {
        clearTimeout(window.layoutSaveTimeout);
      }
    };
  }, []);

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
          margin={[16, 16]}
          containerPadding={[0, 0]}
        >
          {visibleWidgets.map(([key, config]) => (
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
                <WidgetWrapper widgetKey={key} config={config} />
              </Box>
            </Paper>
          ))}
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

export default HomeWithDragDropOptimized;