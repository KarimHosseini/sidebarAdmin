import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import { PageTitle } from "../../components/common";
import { baseUrl, DOWNLOAD_FILE } from "../../helpers/api-routes";
import WidgetDailyGateWay from "./widgetDailyGateWay";

import WidgetDailySales from "./widgetDailySale";
import WidgetDailySaleByBrands from "./WidgetDailySaleByBrand";
import WidgetFacility from "./widgetFacility";
import WidgetMonthlyRegistrationByDays from "./WidgetMonthlyRegistrationByDay";
import WidgetMonthlySaleByDays from "./WidgetMonthlySaleByDay";
import WidgetNotSentOrder from "./WidgetNotSentOrders";
import WidgetOrdersSummary from "./WidgetOrdersSummary";
import WidgetPlan from "./widgetPlan";
import WidgetRecentOrder from "./WidgetRecentOrders";
import WidgetSaleByRegions from "./WidgetSaleByRegion";
import WidgetTodaySaleRatios from "./WidgetTodaySaleRatio";
import WidgetTopProduct from "./WidgetTopProducts";
import WidgetWalletCharges from "./widgetWalletCharge";

const Home = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { themeColor } = useSelector((state) => state.themeColor);
  const { companyInfo } = useSelector((state) => state.relationals);
  var dark = themeColor === "dark";
  return (
    <>
      <PageTitle />
      {!userPermissions?.widgetDailySale?.view &&
      !userPermissions?.widgetTodaySaleRatio?.view &&
      !userPermissions?.widgetWalletCharge?.view &&
      !userPermissions?.widgetDailySaleByBrand?.view &&
      !userPermissions?.widgetSaleByRegion?.view &&
      !userPermissions?.widgetTopProducts?.view &&
      !userPermissions?.widgetMonthlyRegistrationByDay?.view &&
      !userPermissions?.widgetOrdersSummary?.view &&
      !userPermissions?.widgetMonthlySaleByDay?.view &&
      !userPermissions?.widgetPlanLoanReguest?.view &&
      !userPermissions?.widgetNotSentOrders?.view &&
      !userPermissions?.widgetRecentOrders?.view ? (
        <div className="relative h-[90vh]">
          {" "}
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {dark ? (
              <img
                src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyDarkLogo}?size=thumbnail`}
                alt="logo"
                style={{ width: "130px" }}
              />
            ) : (
              <img
                src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}?size=thumbnail`}
                alt="logo"
                style={{ width: "130px" }}
              />
            )}
          </Box>
          <div className="absolute bottom-4 left-0 w-full  flex items-center flex-col justify-center gap-2">
            <Box
              sx={{
                color: (theme) =>
                  theme.palette.mode === "light" ? "#000" : "#fff ",
              }}
              className="text-sm"
            >
              ورژن 3
            </Box>{" "}
            <Box
              component={"a"}
              sx={{
                color: (theme) =>
                  theme.palette.mode === "light" ? "#000" : "#fff ",
              }}
              className="duration-200 text-sm font-light ease-in-out hover:text-orange-500"
              href={process.env.REACT_APP_DOMAIN_URL}
              target="_blank"
              rel="noreferrer"
            >
              به داشبورد مدیریتی {companyInfo?.companyName}خوش آمدید
            </Box>
            <Box
              component={"a"}
              sx={{
                color: (theme) =>
                  theme.palette.mode === "light" ? "#000" : "#fff ",
              }}
              className="duration-200 text-xs font-light ease-in-out hover:text-orange-500 cursor-pointer"
              href={process.env.REACT_APP_COPY_RIGHT}
              target="_blank"
              rel="noreferrer"
            >
              طراحی و پیاده سازی سامانه های فروشگاهی{" "}
              {process.env.REACT_APP_SITE_TITLE}
            </Box>
          </div>
        </div>
      ) : (
        <div className="lg:grid flex flex-col lg:grid-cols-4 px-4 gap-5 pb-28 relative">
          <div className="col-span-4 ">
            {userPermissions?.widgetOrdersSummary?.view && (
              <WidgetOrdersSummary />
            )}
          </div>{" "}
          <div className="col-span-4">
            {userPermissions?.widgetFacilityWallet?.view && <WidgetFacility />}
          </div>
          {userPermissions?.widgetWalletCharge?.view && (
            <div className="col-span-2">
              {" "}
              <WidgetWalletCharges />{" "}
            </div>
          )}
          {userPermissions?.widgetDisaggregatedDailySales?.view && (
            <div className="col-span-2">
              {" "}
              <WidgetDailyGateWay />{" "}
            </div>
          )}
          <div className="col-span-2 flex flex-col gap-2">
            <div className="md:grid flex flex-col md:grid-cols-2  gap-5">
              {userPermissions?.widgetDailySale?.view && <WidgetDailySales />}
              {userPermissions?.widgetTodaySaleRatio?.view && (
                <WidgetTodaySaleRatios />
              )}
            </div>

            <div className="md::grid flex flex-col md:grid-cols-2  gap-5">
              {userPermissions?.widgetNotSentOrders?.view && (
                <WidgetNotSentOrder />
              )}
              {userPermissions?.widgetDailySaleByBrand?.view && (
                <WidgetDailySaleByBrands />
              )}
            </div>
          </div>
          <div className="col-span-2">
            {userPermissions?.widgetSaleByRegion?.view && (
              <WidgetSaleByRegions />
            )}
          </div>
          <div className="lg:grid col-span-4 flex flex-col lg:grid-cols-5 gap-5">
            {" "}
            <div className="col-span-3">
              {userPermissions?.widgetTopProducts?.view && <WidgetTopProduct />}
            </div>
            <div className="col-span-2">
              {userPermissions?.widgetRecentOrders?.view && (
                <WidgetRecentOrder />
              )}
            </div>
          </div>
          <div className="col-span-2">
            {userPermissions?.widgetMonthlyRegistrationByDay?.view && (
              <WidgetMonthlyRegistrationByDays />
            )}
          </div>
          <div className="col-span-2">
            {userPermissions?.widgetMonthlySaleByDay?.view && (
              <WidgetMonthlySaleByDays />
            )}
          </div>
          {userPermissions?.widgetPlanLoanReguest?.view && (
            <div className="col-span-4">
              <WidgetPlan />{" "}
            </div>
          )}
          <div className="absolute bottom-4 left-0 w-full  flex items-center flex-col justify-center gap-2">
            <Box
              sx={{
                color: (theme) =>
                  theme.palette.mode === "light" ? "#000" : "#fff ",
              }}
              className="text-sm"
            >
              ورژن 3{" "}
            </Box>{" "}
            <Box
              component={"a"}
              sx={{
                color: (theme) =>
                  theme.palette.mode === "light" ? "#000" : "#fff ",
                fontSize: { lg: "1rem !important", xs: "0.7rem !important" },
              }}
              className="duration-200 lg:text-base text-xs font-light ease-in-out hover:text-orange-500"
              href={process.env.REACT_APP_DOMAIN_URL}
              target="_blank"
              rel="noreferrer"
            >
              به داشبورد مدیریتی {companyInfo?.companyName}خوش آمدید
            </Box>{" "}
            <Box
              component={"a"}
              sx={{
                color: (theme) =>
                  theme.palette.mode === "light" ? "#000" : "#fff ",
              }}
              className="duration-200 text-xs font-light ease-in-out hover:text-orange-500 cursor-pointer"
              href={process.env.REACT_APP_COPY_RIGHT}
              target="_blank"
              rel="noreferrer"
            >
              طراحی و پیاده سازی سامانه های فروشگاهی{" "}
              {process.env.REACT_APP_SITE_TITLE}
            </Box>
            {/*        <Box
              component={"a"}
              sx={{
                color: (theme) =>
                  theme.palette.mode === "light" ? "#000" : "#fff ",
                fontSize: { lg: "0.8rem !important", xs: "0.7rem !important" },
              }}
              className="duration-200 lg:text-xs text-[9px] font-light ease-in-out hover:text-orange-500"
              href="https://rahkarpooyesh.ir"
              target="_blank"
              rel="noreferrer"
            >
              طراحی و پیاده سازی سامانه های فروشگاهی
            </Box> */}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
