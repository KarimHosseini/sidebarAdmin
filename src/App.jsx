/* eslint-disable react-hooks/exhaustive-deps */
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useLayoutEffect, useMemo } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./styles/sidebarGradients.css";
import axiosInstance from "./components/dataFetch/axiosInstance";
import { CreateShowCaseModal } from "./components/modals";
import { baseUrl, getStaticsData } from "./helpers/api-routes";
import Layout from "./Layout";
import {
  AttributeGroups,
  Attributes,
  AttributeValues,
  Brands,
  Categories,
  CreateProduct,
  Gallery,
  Home,
  InfoGroups,
  Notification,
  Orders,
  ProductCardex,
  ProductProperties,
  Products,
  PublicAttributes,
  SEO,
  ShippingComapanies,
  ShippingPricing,
  ShowCases,
  SingleOrder,
  SingleProduct,
  Sliders,
  Synonyms,
  User,
  Users,
} from "./pages";
import Comments from "./pages/comments";
import CompanyInfo from "./pages/companyInfo";
import CreateDiscount from "./pages/createDiscount";
import CreateSynonyms from "./pages/createSynonims";
import Discounts from "./pages/discount";

import AccountingPage from "./pages/accounting";
import AccountingLogs from "./pages/accountingProductLogs";
import AccountingSetting from "./pages/accountingSetting";
import AgentWalletRequest from "./pages/agentWalletRequest";
import ReportAgentWalletDetails from "./pages/agentWalletRequestDetails";
import Banks from "./pages/bank";
import BankBranch from "./pages/bankBranch";
import Banner from "./pages/Banner";
import BetaLoan from "./pages/beraloan";
import ChargeBluBank from "./pages/beraloan/chargeBluBank";
import CreateBeta from "./pages/beraloan/createBeta";
import EditBeta from "./pages/beraloan/editBeta";
import ShareBluBank from "./pages/beraloan/shareBlue";
import Blogs from "./pages/blog";
import CreateBlogs from "./pages/blog/createblog";
import SingleBlog from "./pages/blog/editBlog";
import BlogCategories from "./pages/blogCategory";
import BlogsLiked from "./pages/blogLike";
import BlogsPoint from "./pages/blogPoint";
import BlogsRedirect from "./pages/blogRedirect";
import BlogTag from "./pages/blogTag";
import Branches from "./pages/branches";
import Calender from "./pages/calender";
import CategoryForm from "./pages/categories/modal";
import CategoryInsurance from "./pages/categoryInsurance";
import Citiies from "./pages/city";
import CommentParameter from "./pages/commentParamter";
import Companies from "./pages/company";
import CreateCompany from "./pages/company/create";
import EditCompany from "./pages/company/edit";
import UsersCompany from "./pages/company/users";
import Configs from "./pages/configs";
import ReportCooperation from "./pages/CooperationRequest";
import CooperationDetail from "./pages/CooperationRequest/detail";
import CreateOrder from "./pages/createOrder";
import CustomeStyle from "./pages/customeStyle";
import Department from "./pages/department";
import DiscountsPlan from "./pages/discountCode";
import EmailSended from "./pages/emails";
import Enums from "./pages/enum";
import Facilities from "./pages/facilities";
import FacilityWallet from "./pages/facilityWallet";
import FacilityWalletCharging from "./pages/FacilityWalletCharging";
import FacilityWalletDetails from "./pages/facilityWalletDetails";
import FacilityWalletPayment from "./pages/facilityWalletPayment";
import WalletFacilityWithraw from "./pages/facilityWalletWithraw";
import FacilityParent from "./pages/faciltiesParent";
import FacilitySetting from "./pages/faciltiesSetting";
import FaciltyModal from "./pages/faciltiesSetting/model";
import Financier from "./pages/financier";
import GateWaySetting from "./pages/gatewaySetting";
import GroupUsers from "./pages/groupUser";
import Guarantor from "./pages/guarantor";
import Headers from "./pages/header";
import Help from "./pages/help";
import ImportSetting from "./pages/importSetting";
import Inbox from "./pages/inbox";
import Insurance from "./pages/insurance";
import InsurancePurchaseRecord from "./pages/InsurancePurchaseRecord";
import Invoices from "./pages/invoices";
import CreateInvoice from "./pages/invoices/create";
import OrderLabel from "./pages/invoices/label";
import Leasing from "./pages/leasing";
import LendTech from "./pages/lendTech";
import LandTechFeild from "./pages/lendTechFeild";
import LendTechRequest from "./pages/lendTechRequest";
import CreatePlanLendTech from "./pages/lendTechRequest/create";
import LandTechStep from "./pages/lendTechStep";
import PlanLoadSetting from "./pages/loanSetting";
import Login from "./pages/Login";
import Menu from "./pages/menu";
import MenuItem from "./pages/menu/menuItems";
import MenuPanel from "./pages/menuPanel";
import NotFound from "./pages/notFound";
import AdminNotifications from "./pages/NotificationAdmin";
import Packaging from "./pages/packaging";
import PaymentResult from "./pages/paymentResualt";
import Payment from "./pages/paymentResult";
import Permisions from "./pages/permisions";
import Access from "./pages/permisions/access";
import PermissionsAdmin from "./pages/permissionAdmin";
import PersonalDetailMatch from "./pages/personalDetailMatch";
import Plans from "./pages/plan";
import CreatePlan from "./pages/plan/create";
import EditPlan from "./pages/plan/edit";
import PlanDocument from "./pages/planDocument";
import PlanLoan from "./pages/planLoan";
import CreatePlanLoan from "./pages/planLoan/create";
import PreFactor from "./pages/preInvoice";
import CreatePreFactor from "./pages/preInvoice/create";
import PreInvoiceDetails from "./pages/preInvoice/details";
import ProductsGroup from "./pages/productGroup";
import CreateProductGroup from "./pages/productGroup/create";
import EditProductBundle from "./pages/productGroup/edit";
import RedirectUrl from "./pages/redirects";
import RefahInstallment from "./pages/refahInstallment";
import ReportOverdueInstallmentsSummary from "./pages/refahInstallmentsSummary";
import Refund from "./pages/refund";
import SingleLoanAgentTurnover from "./pages/reportAgentSingle";
import ReportAgentTurnover from "./pages/reportAgentTurnover";
import ReportDaily from "./pages/reportDaily";
import ReportDiscount from "./pages/reportDiscount";
import ReportFinancierInstallment from "./pages/reportFinancierInstallment";
import ReportInvoice from "./pages/reportInvoice";
import ReportLoanDetailByAgent from "./pages/reportLoanDetailByAgent";
import ReportLoanDetailByUser from "./pages/reportLoanDetailByUser";
import ReportLoanLanding from "./pages/reportLoanLanding";
import ReportLog from "./pages/reportLog";
import ReportOverdueInstallmentsBasedOnFinancierExport from "./pages/reportOverdueInstallmentsBasedOnFinancierExport/details";
import ReportPaymentLog from "./pages/reportPaymentLog";
import ReportPlan from "./pages/reportPlan";
import ReportProductDepot from "./pages/reportProductDepot";
import ReportReferralOrders from "./pages/reportReferralOrders";
import ReportReserve from "./pages/reportReserved";
import ReportShipment from "./pages/reportShipment";
import ReportSumGateway from "./pages/reportSumGateway";
import ReportSumGatewayByUser from "./pages/reportSumGatewayByUser";
import ReportTransactions from "./pages/reportTransactions";
import ReportUserTurnover from "./pages/reportUserTurnover";
import ReportUserTurnoverFacility from "./pages/reportUserTurnoverFacility";
import ReportWalletBalance from "./pages/reportWalletBalance";
import ReporFacilityWalletBalance from "./pages/reportWalletBalanceFacility";
import FacilityUserWalletLockHistories from "./pages/reportWalletBalanceFacilityHistory";
import Scripts from "./pages/scripts";
import CreateSeo from "./pages/SEO/modal";
import SeoGenrator from "./pages/seoGenrator";
import SEOTag from "./pages/seoTag";
import ServiceType from "./pages/serviceType";
import ShippingClass from "./pages/shippingClass";
import ShippingCompanyPeriod from "./pages/ShippingCompaniesPeriod";
import ShippingCompanyHoliday from "./pages/ShippingCompanyHoliday";
import ShippingCostReport from "./pages/ShippingCostReport";
import ShippingCostReportSummery from "./pages/ShippingCostReportSummery";
import ShippingSetting from "./pages/shippingSetting";
import ShowCaseEdit from "./pages/showcases/edit";
import SingleLoan from "./pages/singleLoan";
import Sms from "./pages/sms";
import SmsAccess from "./pages/smsAccess";
import SmsContent from "./pages/smsContent";
import SmsLog from "./pages/smsLog";
import SMSProvider from "./pages/SMSProvider";
import StaticPage from "./pages/staticPages";
import States from "./pages/Stats";
import Suppliers from "./pages/suppliers";
import TelegramGroup from "./pages/telegramGroup";
import TestAllApis from "./pages/testAllApis";
import Tipax from "./pages/tipax";
import ReportUserAgent from "./pages/userAgentReport";
import ReportUserAgentSingle from "./pages/userAgentReportSingle";
import UserLoanRequest from "./pages/userLoanRequest";
import UserNotifaction from "./pages/userNotficatoin";
import UserNOtifactionTarget from "./pages/userNotificationType";
import CreateUser from "./pages/Users/modal";
import Wallet from "./pages/wallet";
import WalletCharging from "./pages/walletCharging";
import WalletRequest from "./pages/walletRequests";
import WalletWithraw from "./pages/walletWithraw";
import WebsiteSettings from "./pages/webSiteSetting";
import WhiteListHistory from "./pages/whitelistHistory";
import WhiteListUser from "./pages/whiteListUser";
import CreateOrEditWhiteListUser from "./pages/whiteListUser/createOrEditWhiteListUser";
import WhiteListDocumnt from "./pages/whiteListUser/document";
import Work from "./pages/works";
import { setCompanyInfo } from "./redux/slices/relationals";
import EditShippingCompanyModal from "./pages/ShippingCompanies/modal";

const App = () => {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useMemo(() => {
    document.body.setAttribute("dir", "rtl");
  }, []);
  const { themeColor } = useSelector((state) => state.themeColor);
  var dark = themeColor === "dark";
  const Theme = createTheme({
    palette: {
      mode: dark ? "dark" : "light",
      background: {
        default: !dark ? "#f0f2f5" : "#0a0a0f",
        paper: !dark ? "#fff" : "#1a1a2e",
      },
      success: {
        main: dark ? "#10c819" : "#10c819",
      },
      warning: {
        main: dark ? "#ff8800" : "#ff8800",
      },
      error: {
        main: "#f50000",
      },
      primary: {
        main: "#6366f1",
      },
      secondary: {
        main: "#8b5cf6",
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1570,
        xxl: 1637,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            fontWeight: 600,
            textTransform: "none",
            transition: "all 0.3s ease",
            boxShadow: "none",
            padding: "10px 24px",
            "&:hover": {
              boxShadow: "none",
              transform: "translateY(-2px)",
            },
          },
          contained: ({ theme, ownerState }) => {
            const getGradientByColor = (color) => {
              switch (color) {
                case "primary":
                  return "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)";
                case "secondary":
                  return "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)";
                case "success":
                  return "linear-gradient(135deg, #10b981 0%, #059669 100%)";
                case "warning":
                  return "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
                case "error":
                  return "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
                case "info":
                  return "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
                default:
                  return "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)";
              }
            };

            return {
              background: getGradientByColor(ownerState.color || "primary"),
              color: "#fff",
              boxShadow: `0 4px 20px ${
                ownerState.color === "primary" 
                  ? "rgba(99, 102, 241, 0.3)" 
                  : ownerState.color === "secondary"
                  ? "rgba(139, 92, 246, 0.3)"
                  : ownerState.color === "success"
                  ? "rgba(16, 185, 129, 0.3)"
                  : ownerState.color === "warning"
                  ? "rgba(245, 158, 11, 0.3)"
                  : ownerState.color === "error"
                  ? "rgba(239, 68, 68, 0.3)"
                  : "rgba(107, 114, 128, 0.3)"
              }`,
              "&:hover": {
                background: getGradientByColor(ownerState.color || "primary"),
                filter: "brightness(1.1)",
                boxShadow: `0 8px 30px ${
                  ownerState.color === "primary" 
                    ? "rgba(99, 102, 241, 0.5)" 
                    : ownerState.color === "secondary"
                    ? "rgba(139, 92, 246, 0.5)"
                    : ownerState.color === "success"
                    ? "rgba(16, 185, 129, 0.5)"
                    : ownerState.color === "warning"
                    ? "rgba(245, 158, 11, 0.5)"
                    : ownerState.color === "error"
                    ? "rgba(239, 68, 68, 0.5)"
                    : "rgba(107, 114, 128, 0.5)"
                }`,
              },
            };
          },
          outlined: ({ theme, ownerState }) => {
            const getBorderGradientByColor = (color) => {
              switch (color) {
                case "primary":
                  return "#6366f1";
                case "secondary":
                  return "#8b5cf6";
                case "success":
                  return "#10b981";
                case "warning":
                  return "#f59e0b";
                case "error":
                  return "#ef4444";
                case "info":
                  return "#3b82f6";
                default:
                  return "#6b7280";
              }
            };

            const color = getBorderGradientByColor(ownerState.color);
            return {
              borderColor: color,
              color: color,
              background: "transparent",
              borderWidth: "2px",
              "&:hover": {
                backgroundColor: `${color}10`,
                borderColor: color,
                boxShadow: `0 0 0 3px ${color}30`,
                transform: "translateY(-2px)",
              },
            };
          },
          text: ({ theme, ownerState }) => {
            const getTextColorByColor = (color) => {
              switch (color) {
                case "primary":
                  return "#6366f1";
                case "secondary":
                  return "#8b5cf6";
                case "success":
                  return "#10b981";
                case "warning":
                  return "#f59e0b";
                case "error":
                  return "#ef4444";
                case "info":
                  return "#3b82f6";
                default:
                  return "#6b7280";
              }
            };

            const color = getTextColorByColor(ownerState.color);
            return {
              color: color,
              "&:hover": {
                backgroundColor: `${color}10`,
                color: color,
              },
            };
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            backgroundImage: "none",
            boxShadow: dark 
              ? "0 8px 32px 0 rgba(31, 38, 135, 0.15)" 
              : "0 4px 20px 0 rgba(0, 0, 0, 0.08)",
            border: dark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.05)",
            backdropFilter: dark ? "blur(10px)" : "none",
            backgroundColor: dark ? "rgba(26, 26, 46, 0.8)" : "#fff",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: dark 
                ? "0 16px 48px 0 rgba(31, 38, 135, 0.25)" 
                : "0 8px 30px 0 rgba(0, 0, 0, 0.12)",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              transition: "all 0.3s ease",
              backgroundColor: dark ? "rgba(255, 255, 255, 0.03)" : "#f7f7f7",
              "& fieldset": {
                borderColor: dark ? "rgba(255, 255, 255, 0.1)" : "#e0e0e0",
                transition: "all 0.3s ease",
              },
              "&:hover fieldset": {
                borderColor: dark ? "rgba(255, 255, 255, 0.2)" : "#ccc",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#6366f1",
                borderWidth: "2px",
              },
              "&.Mui-focused": {
                backgroundColor: dark ? "rgba(255, 255, 255, 0.05)" : "#fff",
                boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
              },
            },
            "& .MuiInputLabel-root": {
              color: dark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
              "&.Mui-focused": {
                color: "#6366f1",
              },
            },
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: dark ? "rgba(255, 255, 255, 0.03)" : "#fff",
            border: dark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.05)",
            backdropFilter: dark ? "blur(10px)" : "none",
            boxShadow: dark 
              ? "0 8px 32px 0 rgba(31, 38, 135, 0.15)" 
              : "0 4px 20px 0 rgba(0, 0, 0, 0.08)",
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: dark 
              ? "rgba(99, 102, 241, 0.08)" 
              : "rgba(99, 102, 241, 0.05)",
            "& .MuiTableCell-head": {
              backgroundColor: "transparent",
              color: dark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.8)",
              fontWeight: 600,
              borderBottom: dark 
                ? "1px solid rgba(255, 255, 255, 0.1)" 
                : "1px solid rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
      MuiTableBody: {
        styleOverrides: {
          root: {
            "& .MuiTableRow-root": {
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: dark 
                  ? "rgba(99, 102, 241, 0.05)" 
                  : "rgba(99, 102, 241, 0.02)",
                transform: "translateX(4px)",
              },
              "& .MuiTableCell-root": {
                borderBottom: dark 
                  ? "1px solid rgba(255, 255, 255, 0.05)" 
                  : "1px solid rgba(0, 0, 0, 0.05)",
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            fontWeight: 500,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
          },
          filled: {
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "#fff",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: dark 
                ? "rgba(99, 102, 241, 0.1)" 
                : "rgba(99, 102, 241, 0.08)",
              transform: "scale(1.1)",
            },
          },
        },
      },
    },
  });
  useEffect(() => {
    if (themeColor === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [themeColor]);
  useLayoutEffect(() => {
    if (localStorage.getItem("fontSize")) {
      document.documentElement.style.fontSize = `${Number(
        localStorage.getItem("fontSize")
      )}px`;
    } else {
      document.documentElement.style.fontSize = `13px`;
    }
  }, [localStorage.getItem("fontSize")]);
  useEffect(() => {
    axiosInstance(`${baseUrl}/${getStaticsData}`)
      .then((res) => {
        const { data } = res;
        dispatch(setCompanyInfo(data?.data?.company));
      })
      .catch((err) => {});
  }, []);
  /*   useEffect(() => {
      if (!localStorage.getItem("loginTime")) {
        return;
      } else {
        const interval = setInterval(() => {
          var t = moment(new Date(JSON.parse(localStorage.getItem("loginTime"))));
          var d = moment(new Date());
          var loadingR = false;
          if (
            parseInt((d - t) / (1000 * 60), 10) > 180 &&
            loadingR === false &&
            loading === false
          ) {
            setLoading(true);
            loadingR = true;
            const formData = new FormData();
            formData.append(
              "accessToken",
              JSON.parse(localStorage.getItem("auth"))?.token
            );
            formData.append(
              "refreshToken",
              localStorage.getItem("auth")
                ? JSON.parse(localStorage.getItem("auth"))?.refreshToken
                : null
            );
            if (loadingR === false)
              try {
                const response = axios.post(
                  `${baseUrl}/v1/refreshToken`,
                  formData
                );
                dispatch(login(response.data));
                setLoading(false);
                loadingR = false;
              } catch (e) {
                localStorage.clear();
                document.location.href = "/";
              }
          }
        }, 60000);
  
        return () => clearInterval(interval);
      }
    }, []); */
  return (
    <ThemeProvider theme={Theme}>
      <BrowserRouter>
        {!token ? (
          <>
            {" "}
            <Login />
          </>
        ) : (
          <>
            {/*      <h1 style={{textAlign:"center"}}>{sessionStorage.getItem("loaded")}</h1> */}
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/banks" element={<Banks />} />
                <Route path="/banks/branch/:id" element={<BankBranch />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<SingleProduct />} />
                <Route path="/properties" element={<ProductProperties />} />
                <Route path="/products/create" element={<CreateProduct />} />
                <Route path="/companyInfo" element={<CompanyInfo />} />
                <Route path="/comments" element={<Comments />} />
                <Route path="/reports" element={<States />} />
                <Route path="/discounts/create" element={<CreateDiscount />} />
                <Route path="/permisions/:id" element={<Access />} />
                <Route
                  path="/commentParameter"
                  element={<CommentParameter />}
                />
                <Route path="/configs" element={<Configs />} />
                <Route
                  path="/reportSumGateway"
                  element={<ReportSumGateway />}
                />
                <Route
                  path="/reportSumGatewayByUser"
                  element={<ReportSumGatewayByUser />}
                />
                <Route
                  path="/reportFacilityWalletBalance"
                  element={<ReporFacilityWalletBalance />}
                />
                <Route path="/emails" element={<EmailSended />} />
                <Route path="/smsContent" element={<SmsContent />} />
                <Route path="/smsAccess" element={<SmsAccess />} />
                <Route path="/smslog" element={<SmsLog />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/financier" element={<Financier />} />
                <Route
                  path="/refahInstallment"
                  element={<RefahInstallment />}
                />
                <Route path="/menu/:id" element={<MenuItem />} />
                <Route path="/productCardex" element={<ProductCardex />} />
                <Route path="/facilites" element={<Facilities />} />
                <Route path="/leasing" element={<Leasing />} />
                <Route path="/work" element={<Work />} />
                <Route path="/reportPlan" element={<ReportPlan />} />
                <Route path="/reportDiscount" element={<ReportDiscount />} />
                <Route path="/userNotification" element={<UserNotifaction />} />
                <Route
                  path="/userNotificationTarget"
                  element={<UserNOtifactionTarget />}
                />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/attribute-groups" element={<AttributeGroups />} />
                <Route path="/attributes" element={<Attributes />} />
                <Route
                  path="/attributes/values/:id"
                  element={<AttributeValues />}
                />
                <Route path="/log" element={<ReportLog />} />
                <Route path="/permisions" element={<Permisions />} />
                <Route path="/csvPrice" element={<ImportSetting />} />
                <Route path="/reportReserved" element={<ReportReserve />} />
                <Route
                  path="/reportUserTurnover/:id"
                  element={<ReportUserTurnover />}
                />
                <Route
                  path="/permissionsAdmin"
                  element={<PermissionsAdmin />}
                />
                <Route path="/discounts" element={<Discounts />} />
                <Route path="/sms" element={<Sms />} />
                <Route path="/createSynonyms" element={<CreateSynonyms />} />
                <Route path="/shippingSetting" element={<ShippingSetting />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/ChargingWallet" element={<WalletCharging />} />
                <Route path="/withdrawWallet" element={<WalletWithraw />} />
                <Route path="/requestWallet" element={<WalletRequest />} />
                <Route path="/facilityWallet" element={<FacilityWallet />} />
                <Route
                  path="/facilitySetting/:id/form/:childId"
                  element={<FaciltyModal />}
                />{" "}
                <Route
                  path="/facilitySetting/:id/form"
                  element={<FaciltyModal />}
                />{" "}
                <Route path="/menuPanel" element={<MenuPanel />} />
                <Route
                  path="/facilityWallet/:id"
                  element={<FacilityWalletDetails />}
                />
                <Route
                  path="/ChargingFacilityWWallet"
                  element={<FacilityWalletCharging />}
                />
                <Route
                  path="/withdrawFacilityWallet"
                  element={<WalletFacilityWithraw />}
                />
                <Route
                  path="/requestFacilityWallet"
                  element={<FacilityWalletPayment />}
                />{" "}
                <Route
                  path="/shippingCostReportSummery"
                  element={<ShippingCostReportSummery />}
                />{" "}
                <Route
                  path="/shippingCostReport"
                  element={<ShippingCostReport />}
                />
                <Route path="/reportShipment" element={<ReportShipment />} />
                <Route path="/reportLoan" element={<ReportLoanLanding />} />
                <Route path="/reportInvoice" element={<ReportInvoice />} />
                <Route
                  path="/reportWalletBalance"
                  element={<ReportWalletBalance />}
                />
                <Route
                  path="/reportOverdueInstallmentsSummary"
                  element={<ReportOverdueInstallmentsSummary />}
                />
                <Route path="/betaloan" element={<BetaLoan />} />
                <Route path="/betaloan/:id" element={<EditBeta />} />
                <Route path="/betaloan/create" element={<CreateBeta />} />
                <Route
                  path="/CooperationRequest"
                  element={<ReportCooperation />}
                />
                <Route
                  path="/reportFinancierInstallment"
                  element={<ReportFinancierInstallment />}
                />{" "}
                <Route
                  path="/reportFinancierInstallment/:id"
                  element={<ReportOverdueInstallmentsBasedOnFinancierExport />}
                />
                <Route
                  path="/CooperationRequest/:id"
                  element={<CooperationDetail />}
                />
                <Route path="/planDocument" element={<PlanDocument />} />
                <Route
                  path="/reportTransaction"
                  element={<ReportTransactions />}
                />
                <Route
                  path="/public-attributes"
                  element={<PublicAttributes />}
                />
                <Route path="/brands" element={<Brands />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/:id" element={<CategoryForm />} />
                <Route path="/categories/create" element={<CategoryForm />} />
                <Route path="/showcases" element={<ShowCases />} />
                <Route path="/sliders" element={<Sliders />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order/:id" element={<SingleOrder />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<User />} />
                <Route path="/synonyms" element={<Synonyms />} />
                <Route path="/seo" element={<SEO />} />
                <Route
                  path="/shipping-companies"
                  element={<ShippingComapanies />}
                />
                <Route
                  path="/shipping-companies-items/:id"
                  element={<EditShippingCompanyModal />}
                />
                <Route
                  path="/getUserWalletLockHistories/:id"
                  element={<FacilityUserWalletLockHistories />}
                />
                <Route
                  path="/shipping-companies/:id"
                  element={<ShippingPricing />}
                />
                <Route path="/info-groups" element={<InfoGroups />} />
                <Route path="/notification" element={<Notification />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/blog-categroy" element={<BlogCategories />} />
                <Route path="/blog" element={<Blogs />} />
                <Route path="/blog/create" element={<CreateBlogs />} />
                <Route path="/blog-tag" element={<BlogTag />} />
                <Route path="/blog-liked" element={<BlogsLiked />} />
                <Route path="/blog/:id" element={<SingleBlog />} />
                <Route path="/blog-point" element={<BlogsPoint />} />
                <Route path="/blog-redirect" element={<BlogsRedirect />} />
                <Route
                  path="/showcases/create"
                  element={<CreateShowCaseModal />}
                />
                <Route
                  path="/groupProduct/:id"
                  element={<EditProductBundle />}
                />
                <Route path="/showcases/:id" element={<ShowCaseEdit />} />
                <Route path="/groupProduct" element={<ProductsGroup />} />
                <Route
                  path="/groupProduct/create"
                  element={<CreateProductGroup />}
                />
                <Route path="/telegramGroup" element={<TelegramGroup />} />
                <Route path="/company" element={<Companies />} />
                <Route path="/branches" element={<Branches />} />
                <Route path="/company/create" element={<CreateCompany />} />
                <Route path="/company/:id" element={<EditCompany />} />
                <Route path="/company/users/:id" element={<UsersCompany />} />
                <Route path="/plan" element={<Plans />} />
                <Route
                  path="/personalDetailMatch"
                  element={<PersonalDetailMatch />}
                />
                <Route path="/plan/:id" element={<EditPlan />} />
                <Route path="/plan/create" element={<CreatePlan />} />
                <Route path="/discount-plan" element={<DiscountsPlan />} />
                <Route path="/plan-loan/create" element={<CreatePlanLoan />} />
                <Route path="/plan-loan/:id" element={<CreatePlanLoan />} />
                <Route path="/plan-loan" element={<PlanLoan />} />
                <Route path="/loan-setting" element={<PlanLoadSetting />} />
                <Route path="/lendTech" element={<LendTech />} />
                <Route path="/lendTech/:id" element={<LandTechStep />} />
                <Route path="/lendTech/:id/:id" element={<LandTechFeild />} />
                <Route path="/lendTechRequest" element={<LendTechRequest />} />
                <Route path="/reportpayment" element={<ReportPaymentLog />} />
                <Route path="/reportDaily" element={<ReportDaily />} />
                <Route path="/createInvoice" element={<CreateInvoice />} />
                <Route path="/createOrder" element={<CreateOrder />} />
                <Route path="/packaging" element={<Packaging />} />
                <Route path="/shippingClass" element={<ShippingClass />} />
                <Route path="/orderLabel" element={<OrderLabel />} />
                <Route path="/calender" element={<Calender />} />
                <Route path="/chargeBlueBank" element={<ChargeBluBank />} />
                <Route path="/shareBlueBank" element={<ShareBluBank />} />
                <Route path="/refund" element={<Refund />} />
                <Route
                  path="/shipping-companies/period/:id"
                  element={<ShippingCompanyPeriod />}
                />
                <Route path="/facilitySetting" element={<FacilityParent />} />
                <Route
                  path="/facilitySetting/:id"
                  element={<FacilitySetting />}
                />
                <Route path="/seo/create" element={<CreateSeo />} />
                <Route path="/seo/edit/:id" element={<CreateSeo />} />
                <Route path="/gatewaySetting" element={<GateWaySetting />} />
                <Route path="/preFactor" element={<PreFactor />} />
                <Route path="/preFactor/create" element={<CreatePreFactor />} />
                <Route
                  path="/preFactor/edit/:id"
                  element={<CreatePreFactor />}
                />
                <Route path="/tipax" element={<Tipax />} />
                <Route path="/preFactor/:id" element={<PreInvoiceDetails />} />
                <Route path="/AgentSummary" element={<ReportUserAgent />} />
                <Route
                  path="/singleLoanAgentTurnover"
                  element={<ReportUserAgentSingle />}
                />
                <Route
                  path="/reportAgentTurnover/:id"
                  element={<ReportAgentTurnover />}
                />
                <Route
                  path="/singleLoanAgentTurnover/:id"
                  element={<SingleLoanAgentTurnover />}
                />
                <Route
                  path="/adminNotifications"
                  element={<AdminNotifications />}
                />
                <Route
                  path="/shippingCompanyHoliday/:id"
                  element={<ShippingCompanyHoliday />}
                />{" "}
                <Route path="/headers" element={<Headers />} />
                <Route
                  path="/lendTechRequest/create"
                  element={<CreatePlanLendTech />}
                />
                <Route path="/enum" element={<Enums />} />
                <Route path="/department" element={<Department />} />
                <Route path="/createUser" element={<CreateUser />} />
                <Route path="/redirectUrl" element={<RedirectUrl />} />
                <Route path="/insurance" element={<Insurance />} />
                <Route path="/seoGenrator" element={<SeoGenrator />} />
                <Route
                  path="/categoriesInsurance/:id"
                  element={<CategoryInsurance />}
                />{" "}
                <Route path="/paymentResult" element={<Payment />} />
                <Route
                  path="/insurancePurchaseRecord"
                  element={<InsurancePurchaseRecord />}
                />{" "}
                <Route path="/seoTag" element={<SEOTag />} />
                <Route
                  path="/reportUserTurnoverFacility/:id"
                  element={<ReportUserTurnoverFacility />}
                />
                <Route path="/citiies" element={<Citiies />} />
                <Route path="/customeStyle" element={<CustomeStyle />} />
                <Route path="/singleLoan" element={<SingleLoan />} />
                <Route
                  path="/reportProductDepot"
                  element={<ReportProductDepot />}
                />
                <Route path="/userLoanRequest" element={<UserLoanRequest />} />
                <Route path="/banner" element={<Banner />} />
                <Route path="/scripts" element={<Scripts />} />
                <Route path="/guarantor" element={<Guarantor />} />
                <Route path="/whiteListUser" element={<WhiteListUser />} />
                <Route
                  path="/whiteListHistory"
                  element={<WhiteListHistory />}
                />{" "}
                <Route
                  path="/whiteListDocument/:id"
                  element={<WhiteListDocumnt />}
                />
                <Route
                  path="/whiteListUser/create"
                  element={<CreateOrEditWhiteListUser />}
                />
                <Route
                  path="/whiteListUser/:id"
                  element={<CreateOrEditWhiteListUser />}
                />
                <Route path="/staticPage" element={<StaticPage />} />
                <Route path="/help" element={<Help />} />
                <Route path="/smsProvider" element={<SMSProvider />} />
                <Route
                  path="/accountingArpaCategroty"
                  element={<AccountingPage />}
                />
                <Route
                  path="/accountingSetting"
                  element={<AccountingSetting />}
                />
                <Route
                  path="/reportLoanDetailByUser"
                  element={<ReportLoanDetailByUser />}
                />
                <Route
                  path="/reportLoanDetailByAgent"
                  element={<ReportLoanDetailByAgent />}
                />
                <Route path="/userGroup" element={<GroupUsers />} />
                <Route
                  path="/accountingProductSyncLogError"
                  element={<AccountingLogs />}
                />
                <Route
                  path="/reportReferralOrders"
                  element={<ReportReferralOrders />}
                />
                <Route
                  path="/websitekeySetting"
                  element={<WebsiteSettings />}
                />
                <Route path="/paymentResualt" element={<PaymentResult />} />
                <Route
                  path="/agentWalletRequest"
                  element={<AgentWalletRequest />}
                />
                <Route
                  path="/agentWalletRequest/:id"
                  element={<ReportAgentWalletDetails />}
                />
                <Route path="/serviceType" element={<ServiceType />} />
                <Route path="/api-test" element={<TestAllApis />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </>
        )}
        <ToastContainer
          position="top-right"
          hideProgressBar={false}
          closeOnClick={true}
          rtl={true}
          pauseOnFocusLoss={true}
          draggable={true}
          pauseOnHover={true}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
