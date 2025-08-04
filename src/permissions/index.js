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
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const UsePermissons = () => {
  const [headerMenu, setHeaderMenu] = useState([]);

  const { userPermissions: userPermissionsSelector } = useSelector(
    (state) => state.relationals
  );
  useEffect(() => {
    var temp = [];
    if (
      userPermissionsSelector?.product?.view ||
      userPermissionsSelector?.productProperties?.view ||
      userPermissionsSelector?.attributeGroup?.view ||
      userPermissionsSelector?.attributes?.view ||
      userPermissionsSelector?.publicAttributes?.view ||
      userPermissionsSelector?.brand?.view ||
      userPermissionsSelector?.categories?.view ||
      userPermissionsSelector?.productCardex?.view ||
      userPermissionsSelector?.bundle?.view ||
      userPermissionsSelector?.categoryAbilities?.view
    ) {
      var subroutes3 = [];
      var accordian = [];
      if (userPermissionsSelector?.product?.view) {
        subroutes3.push({
          name: "محصولات",
          path: "/products",
        });
      }
      if (userPermissionsSelector?.productProperties?.view) {
        subroutes3.push({
          name: "لیست کالاها",
          path: "/properties",
        });
      }
      if (userPermissionsSelector?.bundle?.view) {
        subroutes3.push({
          name: "محصولات تجمیعی",
          path: "/groupProduct",
        });
      }
      if (userPermissionsSelector?.attributeGroup?.view) {
        accordian.push({
          name: "گروه ویژگی ها",
          path: "/attribute-groups",
        });
      }
      if (userPermissionsSelector?.attributes?.view) {
        accordian.push({
          name: "ویژگی ها",
          path: "/attributes",
        });
      }
      if (userPermissionsSelector?.publicAttributes?.view) {
        accordian.push({
          name: "ویژگی های عمومی",
          path: "/public-attributes",
        });
      }
      if (userPermissionsSelector?.brand?.view) {
        subroutes3.push({
          name: "برند ها",
          path: "/brands",
        });
      }
      if (userPermissionsSelector?.categories?.view) {
        subroutes3.push({
          name: "دسته بندی ها",
          path: "/categories",
        });
      }

      if (userPermissionsSelector?.categoryAbilities?.view) {
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
      userPermissionsSelector?.shippingSetting?.view ||
      userPermissionsSelector?.shippingCompany?.view ||
      userPermissionsSelector?.packaging?.view ||
      userPermissionsSelector?.shippingClass?.view ||
      userPermissionsSelector?.city?.view
    ) {
      var subroutesSending = [];
      if (userPermissionsSelector?.shippingCompany?.view) {
        subroutesSending.push({
          name: "شرکتهای حمل",
          path: "/shipping-companies",
        });
      }
      if (userPermissionsSelector?.shippingClass?.view) {
        subroutesSending.push({
          name: "کلاس های حمل و نقل ",
          path: "/shippingClass",
        });
      }
      if (userPermissionsSelector?.packaging?.view) {
        subroutesSending.push({
          name: "کلاس بسته بندی حمل و نقل ",
          path: "/packaging",
        });
      }
      if (userPermissionsSelector?.shippingSetting?.view) {
        subroutesSending.push({
          name: "  تنظیمات ارسال کالا ",
          path: "/shippingSetting",
        });
      }
      if (userPermissionsSelector?.city?.view) {
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
    if (userPermissionsSelector?.insurance?.view) {
      temp.push({
        title: "خدمات ",
        subroutes: false,
        path: "/insurance",
        icon: <AddBusinessIcon fontSize="inherit" />,
      });
    }
    if (
      userPermissionsSelector?.user?.view ||
      userPermissionsSelector?.accessProfile?.view ||
      userPermissionsSelector?.groupUser?.view
    ) {
      var subroutesU = [];
      if (userPermissionsSelector?.user?.view) {
        subroutesU.push({
          name: "کاربران",
          path: "/users",
        });
      }
      if (userPermissionsSelector?.accessProfile?.view) {
        subroutesU.push({
          name: "نقش ها",
          path: "/permisions",
        });
      }
      if (userPermissionsSelector?.groupUser?.view) {
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
      userPermissionsSelector?.wallet?.view ||
      userPermissionsSelector?.walletPaymentAdminCredit?.insert ||
      userPermissionsSelector?.walletPaymentRefund?.insert ||
      userPermissionsSelector?.walletPayment?.view ||
      userPermissionsSelector?.ReportWalletBalance?.view
    ) {
      var subroutesW = [];
      if (userPermissionsSelector?.wallet?.view) {
        subroutesW.push({
          name: " گزارش کیف پول سایت",
          path: "/wallet",
        });
      }
      if (userPermissionsSelector?.walletPaymentAdminCredit?.insert) {
        subroutesW.push({
          name: " درخواست های شارژ  کیف",
          path: "/ChargingWallet",
        });
      }
      if (userPermissionsSelector?.walletPaymentRefund?.insert) {
        subroutesW.push({
          name: " در خواست های عودت از کیف",
          path: "/withdrawWallet",
        });
      }
      if (userPermissionsSelector?.walletPayment?.view) {
        subroutesW.push({
          name: "تایید در خواست های کیف  پول  سایت",
          path: "/requestWallet",
        });
      }
      if (userPermissionsSelector?.ReportWalletBalance?.view) {
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
      userPermissionsSelector?.facilityWallet?.view ||
      userPermissionsSelector?.facilityWalletPaymentAdminCredit?.insert ||
      userPermissionsSelector?.facilityWalletPaymentRefund?.insert ||
      userPermissionsSelector?.facilityWalletPayment?.view ||
      userPermissionsSelector?.reportfacilitywalletballance?.view
    ) {
      var subroutesWF = [];
      if (userPermissionsSelector?.facilityWallet?.view) {
        subroutesWF.push({
          name: " گزارش کیف پول تسهیلاتی",
          path: "/facilityWallet",
        });
      }
      if (userPermissionsSelector?.facilityWalletPaymentAdminCredit?.insert) {
        subroutesWF.push({
          name: " درخواست شارژ  کیف تسهیلاتی",
          path: "/ChargingFacilityWWallet",
        });
      }
      if (userPermissionsSelector?.facilityWalletPaymentRefund?.insert) {
        subroutesWF.push({
          name: " در خواست عودت  کیف تسهیلاتی",
          path: "/withdrawFacilityWallet",
        });
      }
      if (userPermissionsSelector?.facilityWalletPayment?.view) {
        subroutesWF.push({
          name: " در خواست های کیف  پول  تسهیلاتی",
          path: "/requestFacilityWallet",
        });
      }
      if (userPermissionsSelector?.reportfacilitywalletballance?.view) {
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
    if (userPermissionsSelector?.orders?.view) {
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
    if (userPermissionsSelector?.refundBank?.view) {
      var accordians = [];
      if (userPermissionsSelector?.refundBank?.view) {
        accordians.push({
          name: " برگشت پول ",
          path: "/refund",
        });
      }
      if (userPermissionsSelector?.paymentResult?.view) {
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
      userPermissionsSelector?.productCardex?.view ||
      userPermissionsSelector?.Chart1?.view ||
      userPermissionsSelector?.ReportSumGateway?.view ||
      userPermissionsSelector?.discountTransaction?.view ||
      userPermissionsSelector?.ReportTransactions?.view ||
      userPermissionsSelector?.ReportReserved?.view ||
      userPermissionsSelector?.ReportInvoice?.view ||
      userPermissionsSelector?.ReportDisaggregatedDailySales?.view
    ) {
      var accordian1 = [];

      if (userPermissionsSelector?.productCardex?.view) {
        accordian1.push({
          name: " گزارش کاردکس کالا ",
          path: "/productCardex",
        });
      }

      if (userPermissionsSelector?.ReportTransactions?.view) {
        accordian1.push({
          name: "گزارش تراکنش",
          path: "/reportTransaction",
        });
      }
      if (userPermissionsSelector?.discountTransaction?.view) {
        accordian1.push({
          name: " گزارشات تخفیف",
          path: "/reportDiscount",
        });
      }

      if (userPermissionsSelector?.ReportSumGateway?.view) {
        accordian1.push({
          name: " گزارش تجمیعی درگاه  ",
          path: "/reportSumGateway",
        });
      }
      if (userPermissionsSelector?.ReportInvoice?.view) {
        accordian1.push({
          name: " گزارش ریز فاکتور فروش ",
          path: "/reportInvoice",
        });
      }
      if (userPermissionsSelector?.Chart1?.view) {
        accordian1.push({
          name: " گزارش سفارش بصورت چارت          ",
          path: "/reports",
        });
      }
      if (userPermissionsSelector?.ReportDisaggregatedDailySales?.view) {
        accordian1.push({
          name: " گزارشات فروش روزانه تفکیک شده",
          path: "/reportDaily",
        });
      }
      if (userPermissionsSelector?.ReportSumGatewayByUser?.view) {
        accordian1.push({
          name: " گزارشات درگاه به تفکيک کاربر",
          path: "/reportSumGatewayByUser",
        });
      }
      if (userPermissionsSelector?.ReportReserved?.view) {
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
      userPermissionsSelector?.ReportShipment?.view ||
      userPermissionsSelector?.shippingCostReportSummery?.view ||
      userPermissionsSelector?.shippingCostReport?.view ||
      userPermissionsSelector?.tipax?.view
    ) {
      var accordian2 = [];

      if (userPermissionsSelector?.ReportShipment?.view) {
        accordian2.push({
          name: " گزارش وضعیت ارسالی ",
          path: "/reportShipment",
        });
      }

      if (userPermissionsSelector?.shippingCostReport?.view) {
        accordian2.push({
          name: "گزارشات هزینه های حمل و نقل          ",
          path: "/shippingCostReport",
        });
      }
      if (userPermissionsSelector?.shippingCostReportSummery?.view) {
        accordian2.push({
          name: " گزارش تجمیعی شرکت های حمل",
          path: "/shippingCostReportSummery",
        });
      }
      if (userPermissionsSelector?.tipax?.view) {
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

    if (userPermissionsSelector?.planTransaction?.view) {
      var accordian4 = [];

      if (userPermissionsSelector?.planTransaction?.view) {
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
    if (userPermissionsSelector?.ReportLoan?.view) {
      var accordian3 = [];

      if (userPermissionsSelector?.ReportLoan?.view) {
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
    if (userPermissionsSelector?.insurancePurchaseRecords?.view) {
      var accordian5 = [];

      if (userPermissionsSelector?.insurancePurchaseRecords?.view) {
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
      userPermissionsSelector?.CooperationRequest?.view ||
      userPermissionsSelector?.AgentRefahLoanSummery?.view ||
      userPermissionsSelector?.singleLoanAgentSummery?.view ||
      userPermissionsSelector?.RefahInstallment?.view ||
      userPermissionsSelector?.ReportFinancierInstallment?.view ||
      userPermissionsSelector?.ReportOverdueInstallmentsSummary?.view ||
      userPermissionsSelector?.UserLoanRequest?.view ||
      userPermissionsSelector?.ReportProductDepot?.view ||
      userPermissionsSelector?.reportLoanDetailByAgent?.view ||
      userPermissionsSelector?.reportLoanDetailByUser?.view ||
      userPermissionsSelector?.reportReferralOrders?.view ||
      userPermissionsSelector?.agentWalletRequest?.view
    ) {
      var subroutes5 = [];
      if (userPermissionsSelector?.CooperationRequest?.view) {
        subroutes5.push({
          name: " گزارش درخواست نمايندگي ",
          path: "/CooperationRequest",
        });
      }
      if (userPermissionsSelector?.AgentRefahLoanSummery?.view) {
        subroutes5.push({
          name: " گزارش تسویه نماینده ",
          path: "/AgentSummary",
        });
      }
      if (userPermissionsSelector?.singleLoanAgentSummery?.view) {
        subroutes5.push({
          name: "گزارش تسویه تسهیلات تکی   نماینده ها ",
          path: "/singleLoanAgentTurnover",
        });
      }
      if (userPermissionsSelector?.RefahInstallment?.view) {
        subroutes5.push({
          name: " گزارش اقساط رفاه ",
          path: "/refahInstallment",
        });
      }
      if (userPermissionsSelector?.ReportFinancierInstallment?.view) {
        subroutes5.push({
          name: " گزارش تامین کننده مالی",
          path: "/reportFinancierInstallment",
        });
      }
      if (userPermissionsSelector?.ReportOverdueInstallmentsSummary?.view) {
        subroutes5.push({
          name: " گزارش تجمیعی اقساط رفاه ",
          path: "/reportOverdueInstallmentsSummary",
        });
      }
      if (userPermissionsSelector?.UserLoanRequest?.view) {
        subroutes5.push({
          name: "گزارش درخواست وام",
          path: "/userLoanRequest",
        });
      }
      if (userPermissionsSelector?.ReportProductDepot?.view) {
        subroutes5.push({
          name: " گزارش موجودی انبار",
          path: "/reportProductDepot",
        });
      }
      if (userPermissionsSelector?.reportReferralOrders?.view) {
        subroutes5.push({
          name: "  گزارش نماینده فروش",
          path: "/reportReferralOrders",
        });
      }

      if (userPermissionsSelector?.reportLoanDetailByAgent?.view) {
        subroutes5.push({
          name: "  گزارش تسهیلات بر اساس نماینده",
          path: "/reportLoanDetailByAgent",
        });
      }
      if (userPermissionsSelector?.reportLoanDetailByUser?.view) {
        subroutes5.push({
          name: "   گزارش تسهیلات بر اساس کاربر  ",
          path: "/reportLoanDetailByUser",
        });
      }
      if (userPermissionsSelector?.agentWalletRequest?.view) {
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
      userPermissionsSelector?.LoanSettings?.view ||
      userPermissionsSelector?.RefahLoans?.view ||
      userPermissionsSelector?.singleLoan?.view ||
      userPermissionsSelector?.Financier?.view ||
      userPermissionsSelector?.guarantor?.view
    ) {
      var subroutes7 = [];
      if (userPermissionsSelector?.LoanSettings?.view) {
        subroutes7.push({
          name: "تنظیمات تسهیلات ",
          path: "/facilitySetting",
        });
      }
      if (userPermissionsSelector?.RefahLoans?.view) {
        subroutes7.push({
          name: "تسهیلات دارای تضمین کننده          ",
          path: "/betaloan",
        });
      }
      if (userPermissionsSelector?.singleLoan?.view) {
        subroutes7.push({
          name: " تسهیلات فاقد تضمین کننده         ",
          path: "/singleLoan",
        });
      }
      if (userPermissionsSelector?.Financier?.view) {
        subroutes7.push({
          name: "تامین کننده مالی",
          path: "/financier",
        });
      }
      if (userPermissionsSelector?.guarantor?.view) {
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
      userPermissionsSelector?.planLoanDocument?.view ||
      userPermissionsSelector?.LoanSettings?.view ||
      userPermissionsSelector?.planLoanRequest?.view
    ) {
      var subroutes7 = [];

      if (userPermissionsSelector?.planLoanRequest?.view) {
        subroutes7.push({
          name: "تسهیلات طرح بانک آینده          ",
          path: "/plan-loan",
        });
      }

      if (userPermissionsSelector?.planLoanDocument?.view) {
        subroutes7.push({
          name: "گزارش سابقه تسهیلات طرح بانک آینده ",
          path: "/planDocument",
        });
      }
      if (userPermissionsSelector?.planLoanSetting?.view) {
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
      userPermissionsSelector?.loanRequest?.view ||
      userPermissionsSelector?.leasing?.view
    ) {
      var subroutes7 = [];

      if (userPermissionsSelector?.loanRequest?.view) {
        subroutes7.push({
          name: " درخواست تسهیلات لیزینگ ",
          path: "/facilites",
        });
      }

      if (userPermissionsSelector?.leasing?.view) {
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
      userPermissionsSelector?.smsCenter?.view ||
      userPermissionsSelector?.sms?.view ||
      userPermissionsSelector?.smslog?.view ||
      userPermissionsSelector?.smsLogAccess?.view ||
      userPermissionsSelector?.emailLog?.view ||
      userPermissionsSelector?.inbox?.view ||
      userPermissionsSelector?.userNotification?.view ||
      userPermissionsSelector?.adminNotification?.view ||
      userPermissionsSelector?.department?.view ||
      userPermissionsSelector?.smsProvider?.view
    ) {
      var subroutesSms = [];
      if (userPermissionsSelector?.smslog?.view) {
        subroutesSms.push({
          name: " پیامک های ارسال شده",
          path: "/smslog",
        });
      }
      if (userPermissionsSelector?.adminNotification?.view) {
        subroutesSms.push({
          name: "نوتيفيکيشن های ارسال شده در پنل ادمین",
          path: "/adminNotifications",
        });
      }
      if (userPermissionsSelector?.userNotification?.view) {
        subroutesSms.push({
          name: "  اطلاع رسانی های ارسال شده از ادمین",
          path: "/userNotification",
        });
      }
      if (userPermissionsSelector?.emailLog?.view) {
        subroutesSms.push({
          name: "    ایمیل های ارسال شده",
          path: "/emails",
        });
      }

      if (userPermissionsSelector?.inbox?.view) {
        subroutesSms.push({
          name: "   صندوق پیام های دریافتی          ",
          path: "/inbox",
        });
      }
      if (userPermissionsSelector?.smsCenter?.view) {
        subroutesSms.push({
          name: "تنظیمات ارسال پیام ها به ادمین",
          path: "/sms",
        });
      }
      if (userPermissionsSelector?.sms?.view) {
        subroutesSms.push({
          name: " مدیریت متون پیام ها",
          path: "/smsContent",
        });
      }
      if (userPermissionsSelector?.smsLogAccess?.view) {
        subroutesSms.push({
          name: "  دسترسی نمایش پیام های ادمین",
          path: "/smsAccess",
        });
      }
      if (userPermissionsSelector?.department?.view) {
        subroutesSms.push({
          name: " دپارتمان",
          path: "/department",
        });
      }
      if (userPermissionsSelector?.smsProvider?.view) {
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
      userPermissionsSelector?.discountCode?.view ||
      userPermissionsSelector?.company?.view ||
      userPermissionsSelector?.plan?.view ||
      userPermissionsSelector?.discount?.view
    ) {
      var subroutes9 = [];
      if (userPermissionsSelector?.discountCode?.view) {
        subroutes9.push({
          name: "  کد تخفیف محصول",
          path: "/discounts",
        });
      }
      if (userPermissionsSelector?.company?.view) {
        subroutes9.push({
          name: "  شرکت / سازمان",
          path: "/company",
        });
      }

      if (userPermissionsSelector?.plan?.view) {
        subroutes9.push({
          name: "  طرح فروش و تخفیفات",
          path: "/plan",
        });
      }
      if (userPermissionsSelector?.discount?.view) {
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
      userPermissionsSelector?.productScores?.view ||
      userPermissionsSelector?.scoreParams?.view
    ) {
      var subroutes12 = [];
      if (userPermissionsSelector?.productScores?.view) {
        subroutes12.push({
          name: " نظرات محصول",
          path: "/comments",
        });
      }
      if (userPermissionsSelector?.scoreParams?.view) {
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

    if (userPermissionsSelector?.supplier?.view) {
      var subroutes6 = [];
      if (userPermissionsSelector?.supplier?.view) {
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
      userPermissionsSelector?.blog?.view ||
      userPermissionsSelector?.blogTag?.view ||
      userPermissionsSelector?.blogCategory?.view ||
      userPermissionsSelector?.blogPoint?.view ||
      userPermissionsSelector?.blogRedirect?.view
    ) {
      var subroutesB = [];
      if (userPermissionsSelector?.blog?.view) {
        subroutesB.push({
          name: "بلاگ",
          path: "/blog",
        });
      }

      if (userPermissionsSelector?.blogCategory?.view) {
        subroutesB.push({
          name: "  دسته بندی بلاگ  ",
          path: "/blog-categroy",
        });
      }
      if (userPermissionsSelector?.blogTag?.view) {
        subroutesB.push({
          name: "   تگ های بلاگ  ",
          path: "/blog-tag",
        });
      }
      if (userPermissionsSelector?.blogPoint?.view) {
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
    if (userPermissionsSelector?.gallery?.view) {
      temp.push({
        title: "گالری تصاویر",
        subroutes: false,
        path: "/gallery",
        icon: <Collections fontSize="inherit" />,
      });
    }
    if (
      userPermissionsSelector?.showcases?.view ||
      userPermissionsSelector?.menu?.view ||
      userPermissionsSelector?.siteNotification?.view
    ) {
      var accordian2 = [];
      if (userPermissionsSelector?.menu?.view) {
        accordian2.push({
          name: "منو های ناوبری          ",
          path: "/menu",
        });
      }
      if (userPermissionsSelector?.showcases?.view) {
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

      if (userPermissionsSelector?.siteNotification?.view) {
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
      userPermissionsSelector?.seo?.view ||
      userPermissionsSelector?.seoTag?.view ||
      userPermissionsSelector?.redirect?.view
    ) {
      var accordian2 = [];

      if (userPermissionsSelector?.seoTag?.view) {
        accordian2.push({
          name: "تگ سئو ",
          path: "/seoTag",
        });
      }

      if (userPermissionsSelector?.seo?.view) {
        accordian2.push({
          name: "سئو شوکیس و استاتیک",
          path: "/seo",
        });
      }
      if (userPermissionsSelector?.redirect?.view) {
        accordian2.push({
          name: "ریدایرکت ها",
          path: "/redirectUrl",
        });
      }
      if (userPermissionsSelector?.staticPages?.view) {
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
      userPermissionsSelector?.accountingArpaCategroty?.view ||
      userPermissionsSelector?.accountingArpaSetting?.view
    ) {
      var accordian21 = [];

      if (userPermissionsSelector?.accountingArpaCategroty?.view) {
        accordian21.push({
          name: "تنظیمات دسته بندی ارپا",
          path: "/accountingArpaCategroty",
        });
      }
      if (userPermissionsSelector?.accountingArpaSetting?.view) {
        accordian21.push({
          name: "تنظیمات حسابداری",
          path: "/accountingSetting",
        });
      }
      if (userPermissionsSelector?.accountingProductSyncLogError?.view) {
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
      userPermissionsSelector?.companyInfo?.view ||
      userPermissionsSelector?.menu?.view ||
      userPermissionsSelector?.showcases?.view ||
      userPermissionsSelector?.sliders?.view ||
      userPermissionsSelector?.seo?.view ||
      userPermissionsSelector?.siteNotification?.view ||
      userPermissionsSelector?.importSetting?.update ||
      userPermissionsSelector?.synonim?.import ||
      true
    ) {
      var subroutes = [];
      var accordian2 = [];
      var accordian3 = [];
      if (userPermissionsSelector?.companyInfo?.view) {
        subroutes.push({
          name: " تنظیمات  اصلی",
          path: "/companyInfo",
        });
      }
      if (userPermissionsSelector?.websitekeySetting?.view) {
        subroutes.push({
          name: " تنظیمات کلید های سایت",
          path: "/websitekeySetting",
        });
      }
      if (userPermissionsSelector?.gatewaySetting?.view) {
        subroutes.push({
          name: " تنظیمات درگاه",
          path: "/gatewaySetting",
        });
      }
      if (userPermissionsSelector?.importSetting?.view) {
        subroutes.push({
          name: " تنظیمات ورود قیمت از اکسل",
          path: "/csvPrice",
        });
      }
      if (userPermissionsSelector?.calendar?.view) {
        subroutes.push({
          name: " تقویم",
          path: "/calender",
        });
      }
      if (userPermissionsSelector?.permissionAdmin?.view) {
        subroutes.push({
          name: " پرمیژن های ادمین",
          path: "/permissionsAdmin",
        });
      }
      if (userPermissionsSelector?.header?.view) {
        subroutes.push({
          name: " هدر های دیتابیس",
          path: "/headers",
        });
      }
      if (userPermissionsSelector?.enum?.view) {
        subroutes.push({
          name: " اینام های دیتابیس",
          path: "/enum",
        });
      }

      if (userPermissionsSelector?.synonim?.view) {
        subroutes.push({
          name: "مترادف ها",
          path: "/synonyms",
        });
      }
      if (userPermissionsSelector?.customeCss?.view) {
        subroutes.push({
          name: "سی اس اس های سفارشی",
          path: "/customeStyle",
        });
      }
      if (userPermissionsSelector?.PersonalDetailMatch?.view) {
        subroutes.push({
          name: "اعتبار سنجی ها",
          path: "/personalDetailMatch",
        });
      }
      if (userPermissionsSelector?.branch?.view) {
        subroutes.push({
          name: "شعب فروشگاه",
          path: "/branches",
        });
      }
      if (userPermissionsSelector?.work?.view) {
        subroutes.push({
          name: " شغل ها ",
          path: "/work",
        });
      }
      if (userPermissionsSelector?.banner?.view) {
        subroutes.push({
          name: " بنر ها ",
          path: "/banner",
        });
      }
      if (userPermissionsSelector?.scripts?.view) {
        subroutes.push({
          name: "اسکریپت ها",
          path: "/scripts",
        });
      }
      if (userPermissionsSelector?.bank?.view) {
        subroutes.push({
          name: " بانک ها ",
          path: "/banks",
        });
      }
      if (userPermissionsSelector?.menuPanel?.view) {
        subroutes.push({
          name: " منو  پنل کاربری",
          path: "/menuPanel",
        });
      }
      if (userPermissionsSelector?.telegramGroup?.view) {
        subroutes.push({
          name: "گروه های تلگرام",
          path: "/telegramGroup",
        });
      }
      if (userPermissionsSelector?.serviceType?.view) {
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
      userPermissionsSelector?.OnlinePaymentLog?.view ||
      userPermissionsSelector?.apiTest?.view
    ) {
      var subroutes12 = [];
      if (userPermissionsSelector?.OnlinePaymentLog?.view) {
        subroutes12.push({
          name: " لاگ درگاه",
          path: "/reportpayment",
        });
      }
      if (userPermissionsSelector?.log?.view) {
        subroutes12.push({
          name: "  لاگ سیستم",
          path: "/log",
        });
      }
      if (userPermissionsSelector?.apiTest?.view) {
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

    setHeaderMenu(temp);
  }, [userPermissionsSelector]);
  return { headerMenu };
};

export default UsePermissons;
