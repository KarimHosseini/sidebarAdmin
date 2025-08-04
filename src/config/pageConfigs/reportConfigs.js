/**
 * Report-related Page Configurations
 * Including simple reports and complex reports with extra actions
 */

import {
  GET_RESERVE_REPORT, EXPORT_RESERVE_REPORT,
  GET_INVOICE_REPORT, EXPORT_INVOICE_REPORT,
  GET_LOG_REPORT, EXPORT_LOG_REPORT,
  GET_PLAN_REPORT, EXPORT_PLAN_REPORT,
  GET_REPORT_TRANSACTION, EXPORT_REPORT_TRANSACTION,
  GET_SHIPMENT_REPORT, EXPORT_SHIPMENT_REPORT,
  GET_DISCOUNT_REPORT, EXPORT_DISCOUNT_REPORT,
  GET_REFERRAL_REPORT, EXPORT_REFERRAL_REPORT,
  GET_REPORT_LOAN_USER, EXPORT_REPORT_LOAN_USER,
  GET_REPORT_LOAN_AGENT, EXPORT_REPORT_LOAN_AGENT,
  GET_REPORT_DEPOT, EXPORT_REPORT_DEPOT,
  GET_ReportFinancierInstallment, EXPORT_ReportFinancierInstallment,
  GET_REPORT_SINGLE_LOAN, EXPORT_REPORT_SINGLE_LOAN,
  GET_SUM_GATEWAY_BY_USER, EXPORT_SUM_GATEWAY_BY_USER,
  ALL_REPORT_SHIPPING_COST, EXPORT_REPORT_SHIPPING_COST,
  // Complex Report APIs
  GET_DAILY_REPORT, EXPORT_DAILY_REPORT, GET_SUM_INVOICE_DAILY,
  GET_SUM_GATEWAY, EXPORT_SUM_GATEWAY, GET_SUM_GATEWAY_ALL,
  GET_PAYMENT_LOG, EXPORT_PAYMENT_LOG, DELETE_PAYMENT_LOG, DELETE_ALL_PAYMENT_LOG, DELETE_MONTH_PAYMENT_LOG,
  GET_REPORT_WALLET_BALANCE, EXPORT_REPORT_WALLET_BALANCE, TOGGLE_WALLET_BALANCE,
  GET_PLAN_LANDING_REPORT, EXPORT_PLAN_LANDING_REPORT, REJECT_PLAN_LANDING_REPORT, APPROVED_PLAN_LANDING_REPORT,
  GET_FACILITY_REPORT_WALLET_BALANCE, EXPORT_FACILITY_REPORT_WALLET_BALANCE,
  GET_ReportOverdueInstallmentsBasedOnFinancier, EXPORT_ReportOverdueInstallmentsBasedOnFinancier,
} from './apiRoutes';

export const reportConfigs = {
  // =====================================================
  // 📊 SIMPLE REPORTS - Read-only with export
  // =====================================================
  
  "report-reserved": {
    title: "گزارش رزرو محصول",
    apis: {
      GET_DATA: GET_RESERVE_REPORT,
      EXPORT_DATA: EXPORT_RESERVE_REPORT,
    },
    permissionsTag: "ReportReserved",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: true,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارش رزرو محصول" }
    ],
  },

  "report-invoice": {
    title: "گزارش ریز فاکتور فروش",
    apis: {
      GET_DATA: GET_INVOICE_REPORT,
      EXPORT_DATA: EXPORT_INVOICE_REPORT,
    },
    permissionsTag: "ReportInvoice",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: true,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارش ریز فاکتور فروش" }
    ],
  },

  "report-log": {
    title: "لاگ ها",
    apis: {
      GET_DATA: GET_LOG_REPORT,
      EXPORT_DATA: EXPORT_LOG_REPORT,
    },
    permissionsTag: "log",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: true,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "لاگ ها" }
    ],
  },

  "report-plan": {
    title: "گزارشات طرح بانک آینده",
    apis: {
      GET_DATA: GET_PLAN_REPORT,
      EXPORT_DATA: EXPORT_PLAN_REPORT,
    },
    permissionsTag: "planTransaction",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: true,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارشات طرح بانک آینده" }
    ],
  },

  "report-transactions": {
    title: "گزارش تراکنش",
    apis: {
      GET_DATA: GET_REPORT_TRANSACTION,
      EXPORT_DATA: EXPORT_REPORT_TRANSACTION,
    },
    permissionsTag: "ReportTransactions",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: true,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارش تراکنش" }
    ],
  },

  "report-shipment": {
    title: "گزارش وضعیت ارسالی",
    apis: {
      GET_DATA: GET_SHIPMENT_REPORT,
      EXPORT_DATA: EXPORT_SHIPMENT_REPORT,
    },
    permissionsTag: "ReportShipment",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: true,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارش وضعیت ارسالی" }
    ],
  },

  "report-discount": {
    title: "گزارشات تخفیف",
    apis: {
      GET_DATA: GET_DISCOUNT_REPORT,
      EXPORT_DATA: EXPORT_DISCOUNT_REPORT,
    },
    permissionsTag: "discountTransaction",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: true,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارشات تخفیف" }
    ],
  },

  "report-referral-orders": {
    title: "گزارش نماینده فروش",
    apis: {
      GET_DATA: GET_REFERRAL_REPORT,
      EXPORT_DATA: EXPORT_REFERRAL_REPORT,
    },
    permissionsTag: "reportReferralOrders",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: true,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارش نماینده فروش" }
    ],
  },

  "report-loan-detail-by-user": {
    title: "گزارش تسهیلات به تفکیک کاربر",
    apis: {
      GET_DATA: GET_REPORT_LOAN_USER,
      EXPORT_DATA: EXPORT_REPORT_LOAN_USER,
    },
    permissionsTag: "reportLoanDetailByUser",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: true,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارش تسهیلات به تفکیک کاربر" }
    ],
  },

  "report-loan-detail-by-agent": {
    title: "گزارش تسهیلات به تفکیک نماینده",
    apis: {
      GET_DATA: GET_REPORT_LOAN_AGENT,
      EXPORT_DATA: EXPORT_REPORT_LOAN_AGENT,
    },
    permissionsTag: "reportLoanDetailByAgent",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: true,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارش تسهیلات به تفکیک نماینده" }
    ],
  },

  "report-product-depot": {
    title: "گزارش موجودی انبار",
    apis: {
      GET_DATA: GET_REPORT_DEPOT,
      EXPORT_DATA: EXPORT_REPORT_DEPOT,
    },
    permissionsTag: "ReportProductDepot",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: true,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارش موجودی انبار" }
    ],
  },

  "report-financier-installment": {
    title: "گزارش اقساط تأمین‌کننده مالی",
    apis: {
      GET_DATA: GET_ReportFinancierInstallment,
      EXPORT_DATA: EXPORT_ReportFinancierInstallment,
    },
    permissionsTag: "ReportFinancierInstallment",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: true,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارش اقساط تأمین‌کننده مالی" }
    ],
  },

  "single-loan": {
    title: "گزارش تسهیلات تکی",
    apis: {
      GET_DATA: GET_REPORT_SINGLE_LOAN,
      EXPORT_DATA: EXPORT_REPORT_SINGLE_LOAN,
    },
    permissionsTag: "singleLoan",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: true,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارش تسهیلات تکی" }
    ],
  },

  "report-sum-gateway-by-user": {
    title: "گزارشات درگاه به تفکیک کاربر",
    apis: {
      GET_DATA: GET_SUM_GATEWAY_BY_USER,
      EXPORT_DATA: EXPORT_SUM_GATEWAY_BY_USER,
    },
    permissionsTag: "ReportSumGatewayByUser",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: true,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارشات درگاه به تفکیک کاربر" }
    ],
  },

  "shipping-cost-report": {
    title: "گزارشات هزینه های حمل و نقل",
    apis: {
      GET_DATA: ALL_REPORT_SHIPPING_COST,
      EXPORT_DATA: EXPORT_REPORT_SHIPPING_COST,
    },
    permissionsTag: "shippingCostReport",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: true,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارشات هزینه های حمل و نقل" }
    ],
  },

  // =====================================================
  // 🔧 COMPLEX REPORTS - With extra actions and functionality
  // =====================================================

  "report-payment-log": {
    title: "لاگ درگاه",
    apis: {
      GET_DATA: GET_PAYMENT_LOG,
      EXPORT_DATA: EXPORT_PAYMENT_LOG,
      DELETE_DATA: DELETE_PAYMENT_LOG,
      DELETE_ALL_DATA: DELETE_ALL_PAYMENT_LOG,
      DELETE_MONTH_DATA: DELETE_MONTH_PAYMENT_LOG,
    },
    permissionsTag: "OnlinePaymentLog",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: true,
    isReadOnly: false,
    neededFields: ["id"],
    breadcrumb: [
      { title: "لاگ سیستم" },
      { title: "لاگ درگاه" }
    ],
    // Extra buttons in filter area
    extraButtons: [
      {
        id: "delete-all",
        title: "حذف همه",
        icon: null,
        variant: "contained",
        color: "error",
        permissions: ["OnlinePaymentLog.deleteAll"],
        onClick: "openDeleteAllConfirm",
        confirmModal: {
          message: "آیا از حذف تمام لاگ های پرداخت اطمینان دارید؟",
          action: "deleteAll"
        }
      },
      {
        id: "delete-month",
        title: "حذف ماه خاص",
        icon: null,
        variant: "outlined",
        color: "warning",
        permissions: ["OnlinePaymentLog.deleteAll"],
        onClick: "openDeleteMonthModal",
        customModal: {
          title: "سال و ماه مورد نظر را وارد کنید",
          fields: [
            { name: "year", label: "سال", type: "number", defaultValue: 1403 },
            { name: "month", label: "ماه", type: "number", defaultValue: 1 }
          ],
          action: "deleteMonth"
        }
      }
    ],
    // Row actions
    rowActions: [
      {
        id: "delete-single",
        title: "حذف",
        icon: null,
        variant: "outlined",
        color: "error",
        permissions: ["OnlinePaymentLog.delete"],
        confirmModal: {
          message: "آیا از حذف این لاگ پرداخت اطمینان دارید؟",
          action: "deleteSingle"
        }
      }
    ]
  },

  "report-daily": {
    title: "گزارشات فروش روزانه تفکیک شده",
    apis: {
      GET_DATA: GET_DAILY_REPORT,
      EXPORT_DATA: EXPORT_DAILY_REPORT,
      GET_SUM_DATA: GET_SUM_INVOICE_DAILY,
    },
    permissionsTag: "ReportDisaggregatedDailySales",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: true,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارشات فروش روزانه" }
    ],
    // Extra summary data
    extraData: {
      type: "summary",
      api: GET_SUM_INVOICE_DAILY,
      displayType: "cards"
    }
  },

  "report-sum-gateway": {
    title: "گزارش تجمیعی درگاه",
    apis: {
      GET_DATA: GET_SUM_GATEWAY,
      EXPORT_DATA: EXPORT_SUM_GATEWAY,
      GET_SUM_DATA: GET_SUM_GATEWAY_ALL,
    },
    permissionsTag: "ReportSumGateway",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: true,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارش تجمیعی درگاه" }
    ],
    // Extra summary data
    extraData: {
      type: "summary",
      api: GET_SUM_GATEWAY_ALL,
      displayType: "cards"
    }
  },

  "report-wallet-balance": {
    title: "گزارش موجودی کیف پول",
    apis: {
      GET_DATA: GET_REPORT_WALLET_BALANCE,
      EXPORT_DATA: EXPORT_REPORT_WALLET_BALANCE,
      TOGGLE_DATA: TOGGLE_WALLET_BALANCE,
    },
    permissionsTag: "ReportWalletBalance",
    hasModal: true,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: false,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارش موجودی کیف پول" }
    ],
    rowActions: [
      {
        id: "view-history",
        title: "مشاهده تاریخچه",
        icon: null,
        variant: "contained",
        color: "primary",
        permissions: ["ReportWalletBalance.view"],
        onClick: "openHistoryModal"
      }
    ]
  },

  "report-loan-landing": {
    title: "گزارشات بازدید تسهیلات لندینگ",
    apis: {
      GET_DATA: GET_PLAN_LANDING_REPORT,
      EXPORT_DATA: EXPORT_PLAN_LANDING_REPORT,
      APPROVE_DATA: APPROVED_PLAN_LANDING_REPORT,
      REJECT_DATA: REJECT_PLAN_LANDING_REPORT,
    },
    permissionsTag: "ReportLoan",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: false,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارشات بازدید تسهیلات لندینگ" }
    ],
    rowActions: [
      {
        id: "approve",
        title: "تایید",
        icon: null,
        variant: "contained",
        color: "success",
        permissions: ["ReportLoan.approve"],
        confirmModal: {
          message: "آیا از تایید این درخواست اطمینان دارید؟",
          action: "approve"
        }
      },
      {
        id: "reject",
        title: "رد",
        icon: null,
        variant: "contained",
        color: "error",
        permissions: ["ReportLoan.reject"],
        confirmModal: {
          message: "آیا از رد این درخواست اطمینان دارید؟",
          action: "reject"
        }
      }
    ]
  },

  "report-wallet-balance-facility": {
    title: "گزارش موجودی کیف پول تسهیلات",
    apis: {
      GET_DATA: GET_FACILITY_REPORT_WALLET_BALANCE,
      EXPORT_DATA: EXPORT_FACILITY_REPORT_WALLET_BALANCE,
    },
    permissionsTag: "ReportFacilityWalletBalance",
    hasModal: true,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: false,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارش موجودی کیف پول تسهیلات" }
    ],
    rowActions: [
      {
        id: "view-history",
        title: "مشاهده تاریخچه",
        icon: null,
        variant: "contained",
        color: "primary",
        permissions: ["ReportFacilityWalletBalance.view"],
        onClick: "openHistoryModal"
      },
      {
        id: "lock-unlock",
        title: "قفل/باز کردن",
        icon: null,
        variant: "outlined",
        color: "warning",
        permissions: ["ReportFacilityWalletBalance.lock"],
        onClick: "toggleLock"
      }
    ]
  },

  "report-overdue-installments": {
    title: "گزارش اقساط معوق بر اساس تأمین‌کننده",
    apis: {
      GET_DATA: GET_ReportOverdueInstallmentsBasedOnFinancier,
      EXPORT_DATA: EXPORT_ReportOverdueInstallmentsBasedOnFinancier,
    },
    permissionsTag: "ReportOverdueInstallmentsBasedOnFinancier",
    hasModal: false,
    hasExport: true,
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    isReadOnly: true,
    neededFields: ["id"],
    breadcrumb: [
      { title: "گزارشات" },
      { title: "گزارش اقساط معوق" }
    ],
    rowActions: [
      {
        id: "view-details",
        title: "مشاهده جزییات",
        icon: null,
        variant: "contained",
        color: "primary",
        permissions: ["ReportOverdueInstallmentsBasedOnFinancier.view"],
        onClick: "viewDetails"
      }
    ]
  },
}; 