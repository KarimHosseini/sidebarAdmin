import Cookies from "js-cookie";

export const DEFAULT_WIDGET_LAYOUT = [
  {
    id: "ordersSummary",
    cols: 4,
    order: 1,
    visible: true,
    component: "WidgetOrdersSummary",
  },
  {
    id: "facility",
    cols: 4,
    order: 2,
    visible: true,
    component: "WidgetFacility",
  },
  {
    id: "walletCharges",
    cols: 2,
    order: 3,
    visible: true,
    component: "WidgetWalletCharges",
  },
  {
    id: "dailyGateWay",
    cols: 2,
    order: 4,
    visible: true,
    component: "WidgetDailyGateWay",
  },
  {
    id: "dailySalesGroup",
    cols: 2,
    order: 5,
    visible: true,
    component: "groupContainer",
    children: [
      {
        id: "dailySales",
        cols: 1,
        order: 1,
        visible: true,
        component: "WidgetDailySales",
      },
      {
        id: "todaySaleRatios",
        cols: 1,
        order: 2,
        visible: true,
        component: "WidgetTodaySaleRatios",
      },
      {
        id: "notSentOrder",
        cols: 1,
        order: 3,
        visible: true,
        component: "WidgetNotSentOrder",
      },
      {
        id: "dailySaleByBrands",
        cols: 1,
        order: 4,
        visible: true,
        component: "WidgetDailySaleByBrands",
      },
    ],
  },
  {
    id: "saleByRegions",
    cols: 2,
    order: 6,
    visible: true,
    component: "WidgetSaleByRegions",
  },
  {
    id: "topProductGroup",
    cols: 4,
    order: 7,
    visible: true,
    component: "topProductGroup",
    children: [
      {
        id: "topProduct",
        cols: 3,
        order: 1,
        visible: true,
        component: "WidgetTopProduct",
      },
      {
        id: "recentOrder",
        cols: 2,
        order: 2,
        visible: true,
        component: "WidgetRecentOrder",
      },
    ],
  },
  {
    id: "monthlyRegistrationByDays",
    cols: 2,
    order: 8,
    visible: true,
    component: "WidgetMonthlyRegistrationByDays",
  },
  {
    id: "monthlySaleByDays",
    cols: 2,
    order: 9,
    visible: true,
    component: "WidgetMonthlySaleByDays",
  },
  {
    id: "plan",
    cols: 4,
    order: 10,
    visible: true,
    component: "WidgetPlan",
  },
];

export const getFlatWidgetLayout = () => {
  const flatLayout = [];
  DEFAULT_WIDGET_LAYOUT.forEach((widget) => {
    if (widget.children) {
      widget.children.forEach((child) => {
        flatLayout.push({
          ...child,
          parentId: widget.id,
        });
      });
    } else {
      flatLayout.push(widget);
    }
  });
  return flatLayout;
};

const COOKIE_NAME = "zitro_dashboard_layout";
const COOKIE_EXPIRY = 365; // days

export const loadWidgetLayout = (userPermissions) => {
  try {
    const savedLayout = Cookies.get(COOKIE_NAME);

    if (savedLayout) {
      const parsedLayout = JSON.parse(savedLayout);

      return parsedLayout.filter((widget) => {
        const permissionKey = getPermissionKey(widget.id);
        return permissionKey ? userPermissions?.[permissionKey]?.view : true;
      });
    }
  } catch (error) {
    console.error("Error loading widget layout from cookies:", error);
  }

  return filterLayoutByPermissions(getFlatWidgetLayout(), userPermissions);
};

const getPermissionKey = (widgetId) => {
  const permissionMap = {
    ordersSummary: "widgetOrdersSummary",
    facility: "widgetFacilityWallet",
    walletCharges: "widgetWalletCharge",
    dailyGateWay: "widgetDisaggregatedDailySales",
    dailySales: "widgetDailySale",
    todaySaleRatios: "widgetTodaySaleRatio",
    notSentOrder: "widgetNotSentOrders",
    dailySaleByBrands: "widgetDailySaleByBrand",
    saleByRegions: "widgetSaleByRegion",
    topProduct: "widgetTopProducts",
    recentOrder: "widgetRecentOrders",
    monthlyRegistrationByDays: "widgetMonthlyRegistrationByDay",
    monthlySaleByDays: "widgetMonthlySaleByDay",
    plan: "widgetPlanLoanReguest",
  };

  return permissionMap[widgetId];
};

export const filterLayoutByPermissions = (layout, userPermissions) => {
  return layout.filter((widget) => {
    const permissionKey = getPermissionKey(widget.id);
    return permissionKey ? userPermissions?.[permissionKey]?.view : true;
  });
};

export const saveWidgetLayout = (layout) => {
  try {
    Cookies.set(COOKIE_NAME, JSON.stringify(layout), {
      expires: COOKIE_EXPIRY,
    });
    return true;
  } catch (error) {
    console.error("Error saving widget layout to cookies:", error);
    return false;
  }
};

export const reorderWidgets = (layout, startIndex, endIndex) => {
  const result = Array.from(layout);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  // Update order property for each widget
  return result.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
};

export const getColSpanClass = (cols) => {
  switch (cols) {
    case 1:
      return "col-span-1";
    case 2:
      return "col-span-2";
    case 3:
      return "col-span-3";
    case 4:
      return "col-span-4";
    case 5:
      return "col-span-5";
    default:
      return "col-span-2";
  }
};

export const getRowSpanClass = (rows) => {
  switch (rows) {
    case 1:
      return "row-span-1";
    case 2:
      return "row-span-2";
    case 3:
      return "row-span-3";
    case 4:
      return "row-span-4";
    default:
      return "row-span-1";
  }
};

export const getGridPositionStyle = (widget) => {
  const style = {};

  if (widget.gridColumn) {
    style.gridColumn = widget.gridColumn;
  }

  if (widget.gridRow) {
    style.gridRow = widget.gridRow;
  }

  return style;
};

export const resizeWidget = (layout, widgetId, newSize) => {
  return layout.map((widget) =>
    widget.id === widgetId ? { ...widget, cols: newSize } : widget
  );
};

export const updateWidgetPosition = (layout, widgetId, gridColumn, gridRow) => {
  return layout.map((widget) =>
    widget.id === widgetId ? { ...widget, gridColumn, gridRow } : widget
  );
};
