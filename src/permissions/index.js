import { Collections, Devices } from "@mui/icons-material";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import DesignServicesOutlinedIcon from "@mui/icons-material/DesignServicesOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import Groups3OutlinedIcon from "@mui/icons-material/Groups3Outlined";
import LanguageIcon from "@mui/icons-material/Language";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const UsePermissons = () => {
  const { userPermissions: userPermissionsSelector } = useSelector(
    (state) => state.relationals
  );

  // Memoize the entire menu structure to prevent recalculation on every render
  const headerMenu = useMemo(() => {
    const temp = [];
    
    // Helper function to check permissions more efficiently
    const hasPermission = (path) => {
      const parts = path.split('.');
      let current = userPermissionsSelector;
      for (const part of parts) {
        if (!current || !current[part]) return false;
        current = current[part];
      }
      return current;
    };

    // Helper function to add menu items conditionally
    const addMenuItem = (condition, menuItem) => {
      if (condition) {
        temp.push(menuItem);
      }
    };

    // Product Management Section
    const productConditions = [
      'product.view',
      'productProperties.view',
      'attributeGroup.view',
      'attributes.view',
      'publicAttributes.view',
      'brand.view',
      'categories.view',
      'productCardex.view',
      'bundle.view',
      'categoryAbilities.view'
    ];

    if (productConditions.some(hasPermission)) {
      var subroutes3 = [];
      var accordian = [];
      if (hasPermission('product.view')) {
        subroutes3.push({
          name: "محصولات",
          path: "/products",
        });
      }
      if (hasPermission('productProperties.view')) {
        subroutes3.push({
          name: "لیست کالاها",
          path: "/properties",
        });
      }
      if (hasPermission('bundle.view')) {
        subroutes3.push({
          name: "محصولات تجمیعی",
          path: "/groupProduct",
        });
      }
      if (hasPermission('attributeGroup.view')) {
        accordian.push({
          name: "گروه ویژگی ها",
          path: "/attribute-groups",
        });
      }
      if (hasPermission('attributes.view')) {
        accordian.push({
          name: "ویژگی ها",
          path: "/attributes",
        });
      }
      if (hasPermission('publicAttributes.view')) {
        accordian.push({
          name: "ویژگی های عمومی",
          path: "/public-attributes",
        });
      }
      if (hasPermission('brand.view')) {
        subroutes3.push({
          name: "برند ها",
          path: "/brands",
        });
      }
      if (hasPermission('categories.view')) {
        subroutes3.push({
          name: "دسته بندی ها",
          path: "/categories",
        });
      }

      if (hasPermission('categoryAbilities.view')) {
        subroutes3.push({
          name: "توضیحات وندور",
          path: "/info-groups",
        });
      }
      /*      if (userPermissionsSelector?.productCardex?.view) {
        subroutes3.push({
          name: "کاردکس کالا",
          path: "/productCardex",
        });
      } */
      if (accordian.length > 0) {
        temp.push({
          title: "مدیریت محصولات",
          icon: <Devices fontSize="inherit" />,
          subroutes: subroutes3,
          accordian: [
            {
              title: "ویژگی ها",
              childs: accordian,
            },
          ],
        });
      } else {
        temp.push({
          title: "مدیریت محصولات",
          icon: <Devices fontSize="inherit" />,
          subroutes: subroutes3,
        });
      }
    }
    if (
      hasPermission('shippingSetting.view') ||
      hasPermission('shippingCompany.view') ||
      hasPermission('packaging.view') ||
      hasPermission('shippingClass.view') ||
      hasPermission('city.view')
    ) {
      var subroutesSending = [];
      if (hasPermission('shippingCompany.view')) {
        subroutesSending.push({
          name: "شرکتهای حمل",
          path: "/shipping-companies",
        });
      }
      if (hasPermission('shippingClass.view')) {
        subroutesSending.push({
          name: "کلاس های حمل و نقل ",
          path: "/shippingClass",
        });
      }
      if (hasPermission('packaging.view')) {
        subroutesSending.push({
          name: "کلاس بسته بندی حمل و نقل ",
          path: "/packaging",
        });
      }
      if (hasPermission('shippingSetting.view')) {
        subroutesSending.push({
          name: "  تنظیمات ارسال کالا ",
          path: "/shippingSetting",
        });
      }
      if (hasPermission('city.view')) {
        subroutesSending.push({
          name: "  شهر ها",
          path: "/citiies",
        });
      }

      temp.push({
        title: " ارسال کالا",
        icon: <LocalShippingOutlinedIcon fontSize="inherit" />,
        subroutes: subroutesSending,
      });
    }
    if (hasPermission('insurance.view')) {
      temp.push({
        title: "خدمات ",
        subroutes: false,
        path: "/insurance",
        icon: <AddBusinessIcon fontSize="inherit" />,
      });
    }
    if (
      hasPermission('user.view') ||
      hasPermission('accessProfile.view') ||
      hasPermission('groupUser.view')
    ) {
      var subroutesU = [];
      if (hasPermission('user.view')) {
        subroutesU.push({
          name: "کاربران",
          path: "/users",
        });
      }
      if (hasPermission('accessProfile.view')) {
        subroutesU.push({
          name: "نقش ها",
          path: "/permisions",
        });
      }
      if (hasPermission('groupUser.view')) {
        subroutesU.push({
          name: "  گروه های کاربران",
          path: "/userGroup",
        });
      }
      temp.push({
        title: " کاربران و نقش ها",
        icon: <GroupOutlinedIcon fontSize="inherit" />,
        subroutes: subroutesU,
      });
    }
    if (
      hasPermission('wallet.view') ||
      hasPermission('walletPaymentAdminCredit.insert') ||
      hasPermission('walletPaymentRefund.insert') ||
      hasPermission('walletPayment.view') ||
      hasPermission('ReportWalletBalance.view')
    ) {
      var subroutesW = [];
      if (hasPermission('wallet.view')) {
        subroutesW.push({
          name: " گزارش کیف پول سایت",
          path: "/wallet",
        });
      }
      if (hasPermission('walletPaymentAdminCredit.insert')) {
        subroutesW.push({
          name: " درخواست های شارژ  کیف",
          path: "/ChargingWallet",
        });
      }
      if (hasPermission('walletPaymentRefund.insert')) {
        subroutesW.push({
          name: " در خواست های عودت از کیف",
          path: "/withdrawWallet",
        });
      }
      if (hasPermission('walletPayment.view')) {
        subroutesW.push({
          name: "تایید در خواست های کیف  پول  سایت",
          path: "/requestWallet",
        });
      }
      if (hasPermission('ReportWalletBalance.view')) {
        subroutesW.push({
          name: " گزارش مانده کيف پول ",
          path: "/reportWalletBalance",
        });
      }
      temp.push({
        title: " کیف پول سایت",
        icon: <AccountBalanceWalletOutlinedIcon fontSize="inherit" />,
        subroutes: subroutesW,
      });
    }
    if (
      hasPermission('facilityWallet.view') ||
      hasPermission('facilityWalletPaymentAdminCredit.insert') ||
      hasPermission('facilityWalletPaymentRefund.insert') ||
      hasPermission('facilityWalletPayment.view') ||
      hasPermission('reportfacilitywalletballance.view')
    ) {
      var subroutesWF = [];
      if (hasPermission('facilityWallet.view')) {
        subroutesWF.push({
          name: " گزارش کیف پول تسهیلاتی",
          path: "/facilityWallet",
        });
      }
      if (hasPermission('facilityWalletPaymentAdminCredit.insert')) {
        subroutesWF.push({
          name: " درخواست شارژ  کیف تسهیلاتی",
          path: "/ChargingFacilityWWallet",
        });
      }
      if (hasPermission('facilityWalletPaymentRefund.insert')) {
        subroutesWF.push({
          name: " در خواست عودت  کیف تسهیلاتی",
          path: "/withdrawFacilityWallet",
        });
      }
      if (hasPermission('facilityWalletPayment.view')) {
        subroutesWF.push({
          name: " در خواست های کیف  پول  تسهیلاتی",
          path: "/requestFacilityWallet",
        });
      }
      if (hasPermission('reportfacilitywalletballance.view')) {
        subroutesWF.push({
          name: " گزارش مانده کيف پول  تسهیلاتی",
          path: "/reportFacilityWalletBalance",
        });
      }
      temp.push({
        title: " کیف پول تسهیلاتی",
        icon: <AccountBalanceWalletOutlinedIcon fontSize="inherit" />,
        subroutes: subroutesWF,
      });
    }
    if (hasPermission('orders.view')) {
      temp.push({
        title: "سفارشات",
        subroutes: false,
        path: "/orders",
        icon: <ReceiptOutlinedIcon fontSize="inherit" />,
      });
    }
    /*     if (userPermissionsSelector?.PreFactor?.GetAllPreFactor) {
      temp.push({
        title: "سفارشات نماینده",
        subroutes: false,
        path: "/preFactor",
        icon: <SupportAgentIcon fontSize="inherit" />,
      });
    } */
    if (hasPermission('refundBank.view')) {
      var accordians = [];
      if (hasPermission('refundBank.view')) {
        accordians.push({
          name: " برگشت پول ",
          path: "/refund",
        });
      }
      if (hasPermission('paymentResult.view')) {
        accordians.push({
          name: " تراکنش های بانکی",
          path: "/paymentResult",
        });
      }
      temp.push({
        title: " عملیات بانکی",
        subroutes: accordians,
        icon: <ReceiptOutlinedIcon fontSize="inherit" />,
      });
    }
    if (
      hasPermission('productCardex.view') ||
      hasPermission('Chart1.view') ||
      hasPermission('ReportSumGateway.view') ||
      hasPermission('discountTransaction.view') ||
      hasPermission('ReportTransactions.view') ||
      hasPermission('ReportReserved.view') ||
      hasPermission('ReportInvoice.view') ||
      hasPermission('ReportDisaggregatedDailySales.view')
    ) {
      var accordian1 = [];

      if (hasPermission('productCardex.view')) {
        accordian1.push({
          name: " گزارش کاردکس کالا ",
          path: "/productCardex",
        });
      }

      if (hasPermission('ReportTransactions.view')) {
        accordian1.push({
          name: "گزارش تراکنش",
          path: "/reportTransaction",
        });
      }
      if (hasPermission('discountTransaction.view')) {
        accordian1.push({
          name: " گزارشات تخفیف",
          path: "/reportDiscount",
        });
      }

      if (hasPermission('ReportSumGateway.view')) {
        accordian1.push({
          name: " گزارش تجمیعی درگاه  ",
          path: "/reportSumGateway",
        });
      }
      if (hasPermission('ReportInvoice.view')) {
        accordian1.push({
          name: " گزارش ریز فاکتور فروش ",
          path: "/reportInvoice",
        });
      }
      if (hasPermission('Chart1.view')) {
        accordian1.push({
          name: " گزارش سفارش بصورت چارت          ",
          path: "/reports",
        });
      }
      if (hasPermission('ReportDisaggregatedDailySales.view')) {
        accordian1.push({
          name: " گزارشات فروش روزانه تفکیک شده",
          path: "/reportDaily",
        });
      }
      if (hasPermission('ReportSumGatewayByUser.view')) {
        accordian1.push({
          name: " گزارشات درگاه به تفکيک کاربر",
          path: "/reportSumGatewayByUser",
        });
      }
      if (hasPermission('ReportReserved.view')) {
        accordian1.push({
          name: " گزارش رزرو محصول ",
          path: "/reportReserved",
        });
      }

      temp.push({
        title: "گزارشات سفارشات ",
        icon: <AssessmentOutlinedIcon fontSize="inherit" />,
        subroutes: accordian1,
      });
    }
    if (
      hasPermission('ReportShipment.view') ||
      hasPermission('shippingCostReportSummery.view') ||
      hasPermission('shippingCostReport.view') ||
      hasPermission('tipax.view')
    ) {
      var accordian2 = [];

      if (hasPermission('ReportShipment.view')) {
        accordian2.push({
          name: " گزارش وضعیت ارسالی ",
          path: "/reportShipment",
        });
      }

      if (hasPermission('shippingCostReport.view')) {
        accordian2.push({
          name: "گزارشات هزینه های حمل و نقل          ",
          path: "/shippingCostReport",
        });
      }
      if (hasPermission('shippingCostReportSummery.view')) {
        accordian2.push({
          name: " گزارش تجمیعی شرکت های حمل",
          path: "/shippingCostReportSummery",
        });
      }
      if (hasPermission('tipax.view')) {
        accordian2.push({
          name: " مشاهده سفارشات به تیپاکس",
          path: "/tipax",
        });
      }
      temp.push({
        title: "گزارشات حمل و نقل  ",
        icon: <AssessmentOutlinedIcon fontSize="inherit" />,
        subroutes: accordian2,
      });
    }

    if (hasPermission('planTransaction.view')) {
      var accordian4 = [];

      if (hasPermission('planTransaction.view')) {
        accordian4.push({
          name: "  گزارشات طرح بانک آینده ",
          path: "/reportPlan",
        });
      }

      temp.push({
        title: "گزارشات طرح بانک آینده  ",
        icon: <AssessmentOutlinedIcon fontSize="inherit" />,
        subroutes: accordian4,
      });
    }
    if (hasPermission('ReportLoan.view')) {
      var accordian3 = [];

      if (hasPermission('ReportLoan.view')) {
        accordian3.push({
          name: " گزارشات بازدید تسهیلات لندینگ",
          path: "/reportLoan",
        });
      }

      temp.push({
        title: " گزارشات تسهیلات لندینگ",
        icon: <AssessmentOutlinedIcon fontSize="inherit" />,
        subroutes: accordian3,
      });
    }
    if (hasPermission('insurancePurchaseRecords.view')) {
      var accordian5 = [];

      if (hasPermission('insurancePurchaseRecords.view')) {
        accordian5.push({
          name: " گزارش سوابق بیمه ",
          path: "/insurancePurchaseRecord",
        });
      }

      temp.push({
        title: " گزارشات خدمات ",
        icon: <AssessmentOutlinedIcon fontSize="inherit" />,
        subroutes: accordian5,
      });
    }
    if (
      hasPermission('CooperationRequest.view') ||
      hasPermission('AgentRefahLoanSummery.view') ||
      hasPermission('singleLoanAgentSummery.view') ||
      hasPermission('RefahInstallment.view') ||
      hasPermission('ReportFinancierInstallment.view') ||
      hasPermission('ReportOverdueInstallmentsSummary.view') ||
      hasPermission('UserLoanRequest.view') ||
      hasPermission('ReportProductDepot.view') ||
      hasPermission('reportLoanDetailByAgent.view') ||
      hasPermission('reportLoanDetailByUser.view') ||
      hasPermission('reportReferralOrders.view') ||
      hasPermission('agentWalletRequest.view')
    ) {
      var subroutes5 = [];
      if (hasPermission('CooperationRequest.view')) {
        subroutes5.push({
          name: " گزارش درخواست نمايندگي ",
          path: "/CooperationRequest",
        });
      }
      if (hasPermission('AgentRefahLoanSummery.view')) {
        subroutes5.push({
          name: " گزارش تسویه نماینده ",
          path: "/AgentSummary",
        });
      }
      if (hasPermission('singleLoanAgentSummery.view')) {
        subroutes5.push({
          name: "گزارش تسویه تسهیلات تکی   نماینده ها ",
          path: "/singleLoanAgentTurnover",
        });
      }
      if (hasPermission('RefahInstallment.view')) {
        subroutes5.push({
          name: " گزارش اقساط رفاه ",
          path: "/refahInstallment",
        });
      }
      if (hasPermission('ReportFinancierInstallment.view')) {
        subroutes5.push({
          name: " گزارش تامین کننده مالی",
          path: "/reportFinancierInstallment",
        });
      }
      if (hasPermission('ReportOverdueInstallmentsSummary.view')) {
        subroutes5.push({
          name: " گزارش تجمیعی اقساط رفاه ",
          path: "/reportOverdueInstallmentsSummary",
        });
      }
      if (hasPermission('UserLoanRequest.view')) {
        subroutes5.push({
          name: "گزارش درخواست وام",
          path: "/userLoanRequest",
        });
      }
      if (hasPermission('ReportProductDepot.view')) {
        subroutes5.push({
          name: " گزارش موجودی انبار",
          path: "/reportProductDepot",
        });
      }
      if (hasPermission('reportReferralOrders.view')) {
        subroutes5.push({
          name: "  گزارش نماینده فروش",
          path: "/reportReferralOrders",
        });
      }

      if (hasPermission('reportLoanDetailByAgent.view')) {
        subroutes5.push({
          name: "  گزارش تسهیلات بر اساس نماینده",
          path: "/reportLoanDetailByAgent",
        });
      }
      if (hasPermission('reportLoanDetailByUser.view')) {
        subroutes5.push({
          name: "   گزارش تسهیلات بر اساس کاربر  ",
          path: "/reportLoanDetailByUser",
        });
      }
      if (hasPermission('agentWalletRequest.view')) {
        subroutes5.push({
          name: "  گزارش عودت نماینده",
          path: "/agentWalletRequest",
        });
      }
      temp.push({
        title: " دیگر گزارشات",
        icon: <AssessmentOutlinedIcon fontSize="inherit" />,
        subroutes: subroutes5,
      });
    }

    if (
      hasPermission('LoanSettings.view') ||
      hasPermission('RefahLoans.view') ||
      hasPermission('singleLoan.view') ||
      hasPermission('Financier.view') ||
      hasPermission('guarantor.view')
    ) {
      var subroutes7 = [];
      if (hasPermission('LoanSettings.view')) {
        subroutes7.push({
          name: "تنظیمات تسهیلات ",
          path: "/facilitySetting",
        });
      }
      if (hasPermission('RefahLoans.view')) {
        subroutes7.push({
          name: "تسهیلات دارای تضمین کننده          ",
          path: "/betaloan",
        });
      }
      if (hasPermission('singleLoan.view')) {
        subroutes7.push({
          name: " تسهیلات فاقد تضمین کننده         ",
          path: "/singleLoan",
        });
      }
      if (hasPermission('Financier.view')) {
        subroutes7.push({
          name: "تامین کننده مالی",
          path: "/financier",
        });
      }
      if (hasPermission('guarantor.view')) {
        subroutes7.push({
          name: "  تضمین کننده",
          path: "/guarantor",
        });
      }
      temp.push({
        title: " تسهیلات",
        icon: <AccountBalanceOutlinedIcon fontSize="inherit" />,
        subroutes: subroutes7,
      });
    }
    if (
      hasPermission('planLoanDocument.view') ||
      hasPermission('LoanSettings.view') ||
      hasPermission('planLoanRequest.view')
    ) {
      var subroutes7 = [];

      if (hasPermission('planLoanRequest.view')) {
        subroutes7.push({
          name: "تسهیلات طرح بانک آینده          ",
          path: "/plan-loan",
        });
      }

      if (hasPermission('planLoanDocument.view')) {
        subroutes7.push({
          name: "گزارش سابقه تسهیلات طرح بانک آینده ",
          path: "/planDocument",
        });
      }
      if (hasPermission('planLoanSetting.view')) {
        subroutes7.push({
          name: "تنظیمات تسهیلات طرح بانک آینده ",
          path: "/loan-setting",
        });
      }

      temp.push({
        title: " تسهیلات طرح بانک آینده",
        icon: <AccountBalanceOutlinedIcon fontSize="inherit" />,
        subroutes: subroutes7,
      });
    }
    if (
      hasPermission('loanRequest.view') ||
      hasPermission('leasing.view')
    ) {
      var subroutes7 = [];

      if (hasPermission('loanRequest.view')) {
        subroutes7.push({
          name: " درخواست تسهیلات لیزینگ ",
          path: "/facilites",
        });
      }

      if (hasPermission('leasing.view')) {
        subroutes7.push({
          name: "  لیزینگ ها   ",
          path: "/leasing",
        });
      }

      temp.push({
        title: " لیزینگ",
        icon: <AccountBalanceOutlinedIcon fontSize="inherit" />,
        subroutes: subroutes7,
      });
    }

    if (
      hasPermission('smsCenter.view') ||
      hasPermission('sms.view') ||
      hasPermission('smslog.view') ||
      hasPermission('smsLogAccess.view') ||
      hasPermission('emailLog.view') ||
      hasPermission('inbox.view') ||
      hasPermission('userNotification.view') ||
      hasPermission('adminNotification.view') ||
      hasPermission('department.view') ||
      hasPermission('smsProvider.view')
    ) {
      var subroutesSms = [];
      if (hasPermission('smslog.view')) {
        subroutesSms.push({
          name: " پیامک های ارسال شده",
          path: "/smslog",
        });
      }
      if (hasPermission('adminNotification.view')) {
        subroutesSms.push({
          name: "نوتيفيکيشن های ارسال شده در پنل ادمین",
          path: "/adminNotifications",
        });
      }
      if (hasPermission('userNotification.view')) {
        subroutesSms.push({
          name: "  اطلاع رسانی های ارسال شده از ادمین",
          path: "/userNotification",
        });
      }
      if (hasPermission('emailLog.view')) {
        subroutesSms.push({
          name: "    ایمیل های ارسال شده",
          path: "/emails",
        });
      }

      if (hasPermission('inbox.view')) {
        subroutesSms.push({
          name: "   صندوق پیام های دریافتی          ",
          path: "/inbox",
        });
      }
      if (hasPermission('smsCenter.view')) {
        subroutesSms.push({
          name: "تنظیمات ارسال پیام ها به ادمین",
          path: "/sms",
        });
      }
      if (hasPermission('sms.view')) {
        subroutesSms.push({
          name: " مدیریت متون پیام ها",
          path: "/smsContent",
        });
      }
      if (hasPermission('smsLogAccess.view')) {
        subroutesSms.push({
          name: "  دسترسی نمایش پیام های ادمین",
          path: "/smsAccess",
        });
      }
      if (hasPermission('department.view')) {
        subroutesSms.push({
          name: " دپارتمان",
          path: "/department",
        });
      }
      if (hasPermission('smsProvider.view')) {
        subroutesSms.push({
          name: "سرویس دهنده های اس ام اس ",
          path: "/smsProvider",
        });
      }
      /*       if (userPermissionsSelector?.userNotification?.view) {
        subroutesSms.push(
       
          {
            name: "  متن   نوتيفيکيشن ها",
            path: "/userNotificationTarget",
          }
        );
      } */

      temp.push({
        title: "  پیام ها",
        icon: <SmsOutlinedIcon fontSize="inherit" />,
        subroutes: subroutesSms,
      });
    }
    if (
      hasPermission('discountCode.view') ||
      hasPermission('company.view') ||
      hasPermission('plan.view') ||
      hasPermission('discount.view')
    ) {
      var subroutes9 = [];
      if (hasPermission('discountCode.view')) {
        subroutes9.push({
          name: "  کد تخفیف محصول",
          path: "/discounts",
        });
      }
      if (hasPermission('company.view')) {
        subroutes9.push({
          name: "  شرکت / سازمان",
          path: "/company",
        });
      }

      if (hasPermission('plan.view')) {
        subroutes9.push({
          name: "  طرح فروش و تخفیفات",
          path: "/plan",
        });
      }
      if (hasPermission('discount.view')) {
        subroutes9.push({
          name: "لیست تخفیف",
          path: "/discount-plan",
        });
      }

      temp.push({
        title: " باشگاه مشتریان",
        icon: <Groups3OutlinedIcon fontSize="inherit" />,
        subroutes: subroutes9,
      });
    }
    if (
      hasPermission('productScores.view') ||
      hasPermission('scoreParams.view')
    ) {
      var subroutes12 = [];
      if (hasPermission('productScores.view')) {
        subroutes12.push({
          name: " نظرات محصول",
          path: "/comments",
        });
      }
      if (hasPermission('scoreParams.view')) {
        subroutes12.push({
          name: " تنظیمات امتیاز",
          path: "/commentParameter",
        });
      }
      temp.push({
        title: " نظرات محصول",
        subroutes: subroutes12,
        path: "/comments",
        icon: <CommentOutlinedIcon fontSize="inherit" />,
      });
    }

    if (hasPermission('supplier.view')) {
      var subroutes6 = [];
      if (hasPermission('supplier.view')) {
        subroutes6.push({
          name: "تامین کنندگان ",
          path: "/suppliers",
        });
      }

      temp.push({
        title: " B2B",
        icon: <StorefrontOutlinedIcon fontSize="inherit" />,
        subroutes: subroutes6,
      });
    }
    if (
      hasPermission('blog.view') ||
      hasPermission('blogTag.view') ||
      hasPermission('blogCategory.view') ||
      hasPermission('blogPoint.view') ||
      hasPermission('blogRedirect.view')
    ) {
      var subroutesB = [];
      if (hasPermission('blog.view')) {
        subroutesB.push({
          name: "بلاگ",
          path: "/blog",
        });
      }

      if (hasPermission('blogCategory.view')) {
        subroutesB.push({
          name: "  دسته بندی بلاگ  ",
          path: "/blog-categroy",
        });
      }
      if (hasPermission('blogTag.view')) {
        subroutesB.push({
          name: "   تگ های بلاگ  ",
          path: "/blog-tag",
        });
      }
      if (hasPermission('blogPoint.view')) {
        subroutesB.push({
          name: "  نظرات بلاگ ",
          path: "/blog-point",
        });
      }

      temp.push({
        title: "مدیریت بلاگ",
        icon: <LanguageIcon fontSize="inherit" />,
        subroutes: subroutesB,
      });
    }
    if (hasPermission('gallery.view')) {
      temp.push({
        title: "گالری تصاویر",
        subroutes: false,
        path: "/gallery",
        icon: <Collections fontSize="inherit" />,
      });
    }
    if (
      hasPermission('showcases.view') ||
      hasPermission('menu.view') ||
      hasPermission('siteNotification.view')
    ) {
      var accordian2 = [];
      if (hasPermission('menu.view')) {
        accordian2.push({
          name: "منو های ناوبری          ",
          path: "/menu",
        });
      }
      if (hasPermission('showcases.view')) {
        accordian2.push({
          name: "شوکیس ها ( ویترین ها )          ",
          path: "/showcases",
        });
      }
      /*       if (userPermissionsSelector?.sliders?.view) {
        accordian2.push({
          name: "اسلایدر ها",
          path: "/sliders",
        });
      } */

      if (hasPermission('siteNotification.view')) {
        accordian2.push({
          name: "نوتيفيکيشن های هدر سایت          ",
          path: "/notification",
        });
      }

      temp.push({
        title: "مدیریت فرانت ",
        icon: <DesignServicesOutlinedIcon fontSize="inherit" />,
        subroutes: accordian2,
      });
    }
    if (
      hasPermission('seo.view') ||
      hasPermission('seoTag.view') ||
      hasPermission('redirect.view')
    ) {
      var accordian2 = [];

      if (hasPermission('seoTag.view')) {
        accordian2.push({
          name: "تگ سئو ",
          path: "/seoTag",
        });
      }

      if (hasPermission('seo.view')) {
        accordian2.push({
          name: "سئو شوکیس و استاتیک",
          path: "/seo",
        });
      }
      if (hasPermission('redirect.view')) {
        accordian2.push({
          name: "ریدایرکت ها",
          path: "/redirectUrl",
        });
      }
      if (hasPermission('staticPages.view')) {
        accordian2.push({
          name: "صفحه های استاتیک",
          path: "/staticPage",
        });
      }
      temp.push({
        title: " تنظیمات سئو ",
        icon: <GoogleIcon fontSize="inherit" />,
        subroutes: accordian2,
      });
    }
    if (
      hasPermission('accountingArpaCategroty.view') ||
      hasPermission('accountingArpaSetting.view')
    ) {
      var accordian21 = [];

      if (hasPermission('accountingArpaCategroty.view')) {
        accordian21.push({
          name: "تنظیمات دسته بندی ارپا",
          path: "/accountingArpaCategroty",
        });
      }
      if (hasPermission('accountingArpaSetting.view')) {
        accordian21.push({
          name: "تنظیمات حسابداری",
          path: "/accountingSetting",
        });
      }
      if (hasPermission('accountingProductSyncLogError.view')) {
        accordian21.push({
          name: "لاگ خطای سینک حسابداری",
          path: "/accountingProductSyncLogError",
        });
      }
      temp.push({
        title: " تنظیمات حسابداری ",
        icon: <PointOfSaleIcon fontSize="inherit" />,
        subroutes: accordian21,
      });
    }
    if (
      hasPermission('companyInfo.view') ||
      hasPermission('menu.view') ||
      hasPermission('showcases.view') ||
      hasPermission('sliders.view') ||
      hasPermission('seo.view') ||
      hasPermission('siteNotification.view') ||
      hasPermission('importSetting.update') ||
      hasPermission('synonim.import') ||
      true
    ) {
      var subroutes = [];
      var accordian2 = [];
      var accordian3 = [];
      if (hasPermission('companyInfo.view')) {
        subroutes.push({
          name: " تنظیمات  اصلی",
          path: "/companyInfo",
        });
      }
      if (hasPermission('websitekeySetting.view')) {
        subroutes.push({
          name: " تنظیمات کلید های سایت",
          path: "/websitekeySetting",
        });
      }
      if (hasPermission('gatewaySetting.view')) {
        subroutes.push({
          name: " تنظیمات درگاه",
          path: "/gatewaySetting",
        });
      }
      if (hasPermission('importSetting.view')) {
        subroutes.push({
          name: " تنظیمات ورود قیمت از اکسل",
          path: "/csvPrice",
        });
      }
      if (hasPermission('calendar.view')) {
        subroutes.push({
          name: " تقویم",
          path: "/calender",
        });
      }
      if (hasPermission('permissionAdmin.view')) {
        subroutes.push({
          name: " پرمیژن های ادمین",
          path: "/permissionsAdmin",
        });
      }
      if (hasPermission('header.view')) {
        subroutes.push({
          name: " هدر های دیتابیس",
          path: "/headers",
        });
      }
      if (hasPermission('enum.view')) {
        subroutes.push({
          name: " اینام های دیتابیس",
          path: "/enum",
        });
      }

      if (hasPermission('synonim.view')) {
        subroutes.push({
          name: "مترادف ها",
          path: "/synonyms",
        });
      }
      if (hasPermission('customeCss.view')) {
        subroutes.push({
          name: "سی اس اس های سفارشی",
          path: "/customeStyle",
        });
      }
      if (hasPermission('PersonalDetailMatch.view')) {
        subroutes.push({
          name: "اعتبار سنجی ها",
          path: "/personalDetailMatch",
        });
      }
      if (hasPermission('branch.view')) {
        subroutes.push({
          name: "شعب فروشگاه",
          path: "/branches",
        });
      }
      if (hasPermission('work.view')) {
        subroutes.push({
          name: " شغل ها ",
          path: "/work",
        });
      }
      if (hasPermission('banner.view')) {
        subroutes.push({
          name: " بنر ها ",
          path: "/banner",
        });
      }
      if (hasPermission('scripts.view')) {
        subroutes.push({
          name: "اسکریپت ها",
          path: "/scripts",
        });
      }
      if (hasPermission('bank.view')) {
        subroutes.push({
          name: " بانک ها ",
          path: "/banks",
        });
      }
      if (hasPermission('menuPanel.view')) {
        subroutes.push({
          name: " منو  پنل کاربری",
          path: "/menuPanel",
        });
      }
      if (hasPermission('telegramGroup.view')) {
        subroutes.push({
          name: "گروه های تلگرام",
          path: "/telegramGroup",
        });
      }
      if (hasPermission('serviceType.view')) {
        subroutes.push({
          name: "تنظیمات خدمات",
          path: "/serviceType",
        });
      }
      subroutes.push({
        name: "تنظیمات پنل ادمین",
        path: "/configs",
      });
      subroutes.push({
        name: "  راهنما ",
        path: "/help",
      });
      if (accordian2.length > 0) {
        temp.push({
          title: " تنظیمات",
          path: "/discounts",
          subroutes: subroutes,
          icon: <SettingsOutlinedIcon fontSize="inherit" />,
          accordian: [
            {
              title: "تنظیمات صفحات",
              childs: accordian2,
            },
          ],
        });
      } else {
        temp.push({
          title: " تنظیمات کلی",
          path: "/discounts",
          subroutes: subroutes,
          icon: <SettingsOutlinedIcon fontSize="inherit" />,
        });
      }
    }

    if (
      hasPermission('OnlinePaymentLog.view') ||
      hasPermission('apiTest.view')
    ) {
      var subroutes12 = [];
      if (hasPermission('OnlinePaymentLog.view')) {
        subroutes12.push({
          name: " لاگ درگاه",
          path: "/reportpayment",
        });
      }
      if (hasPermission('log.view')) {
        subroutes12.push({
          name: "  لاگ سیستم",
          path: "/log",
        });
      }
      if (hasPermission('apiTest.view')) {
        subroutes12.push({
          name: " سلامت سرویس ها",
          path: "/api-test",
        });
      }
      temp.push({
        title: " لاگ سیستم",
        subroutes: subroutes12,
        path: "/log",
        icon: <SyncAltOutlinedIcon fontSize="inherit" />,
      });
    }

    return temp;
  }, [userPermissionsSelector]);
  return { headerMenu };
};

export default UsePermissons;
