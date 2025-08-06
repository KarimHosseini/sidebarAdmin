/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { PageTitle } from "../../components/common";
import NoAccess from "../../components/noAccess";

// Import new tab components
import CompanyBasicInfo from "./tabs/CompanyBasicInfo";
import CompanyAddressesTab from "./tabs/CompanyAddressesTab";
import CompanyLogosTab from "./tabs/CompanyLogosTab";
import FooterLogos from "./footer";
import CompanySocialTab from "./tabs/CompanySocialTab";
import CompanyLinksTab from "./tabs/CompanyLinksTab";
import CompanyPaymentSettings from "./tabs/CompanyPaymentSettings";
import CompanyCampaignSettings from "./tabs/CompanyCampaignSettings";
import CompanyLoginImagesTab from "./tabs/CompanyLoginImagesTab";
import CompanySiteSettings from "./tabs/CompanySiteSettings";
import CompanyWalletSettings from "./tabs/CompanyWalletSettings";
import CompanyMapSettings from "./tabs/CompanyMapSettings";
import CompanyRobotSettings from "./tabs/CompanyRobotSettings";
import CompanyProductPageSettings from "./tabs/CompanyProductPageSettings";
import CompanyProductSettings from "./tabs/CompanyProductSettings";
import CompanyTelegramSettings from "./tabs/CompanyTelegramSettings";
import CompanySyncSettings from "./tabs/CompanySyncSettings";

const CompanyInfo = () => {
  const [value, setValue] = useState(0);
  const location = useLocation();
  const { userPermissions } = useSelector((state) => state.relationals);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (location.hash) {
      setValue(Number(location.hash.slice(1)));
    }
  }, [location.hash]);

  if (!userPermissions?.companyInfo?.view) {
    return <NoAccess />;
  }

  const tabs = [
    { label: "مشخصات شرکت / مجموعه", component: <CompanyBasicInfo /> },
    { label: "آدرس های شرکت / مجموعه", component: <CompanyAddressesTab /> },
    { label: "لوگو", component: <CompanyLogosTab /> },
    { label: "لوگو فوتر", component: <FooterLogos /> },
    { label: "شبکه های اجتماعی", component: <CompanySocialTab /> },
    { label: "لینک ها", component: <CompanyLinksTab /> },
    { label: "تنظیمات صفحه پرداخت", component: <CompanyPaymentSettings /> },
    { label: "تنظیمات کمپین", component: <CompanyCampaignSettings /> },
    { label: "عکس های لاگین", component: <CompanyLoginImagesTab /> },
    { label: "تنظیمات سایت", component: <CompanySiteSettings /> },
    { label: "تنظیمات شارژ از کیف پول", component: <CompanyWalletSettings /> },
    { label: "تنظیمات نقشه", component: <CompanyMapSettings /> },
    { label: "تنظیمات ربات", component: <CompanyRobotSettings /> },
    { label: "تنظیمات صفحه محصول", component: <CompanyProductPageSettings /> },
    { label: "تنظیمات محصول", component: <CompanyProductSettings /> },
    { label: "تنظیمات تلگرام", component: <CompanyTelegramSettings /> },
    { label: "تنظیمات سینک با سایت دوم", component: <CompanySyncSettings /> },
  ];

  return (
    <>
      <PageTitle title="تنظیمات" />
      <div className="md:mx-3 mx-1">
        <Paper sx={{ border: "1px solid #dbdfea", mb: 1 }} elevation={0}>
          <Box
            sx={{ borderBottom: 1, borderColor: "divider" }}
            className="relative z-10"
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="company settings tabs"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                flexGrow: 1,
                height: "3.07rem",
                minHeight: "40px !important",
                ".MuiTab-root": {
                  minHeight: "40px !important",
                },
                background: (theme) =>
                  theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.04) !important"
                    : "rgba(0,0,0,0.7) !important",
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  id={`company-tab-${index}`}
                  aria-controls={`company-tabpanel-${index}`}
                />
              ))}
            </Tabs>
          </Box>
          <Box>
            {tabs.map((tab, index) => (
              <TabPanel key={index} value={value} index={index}>
                {tab.component}
              </TabPanel>
            ))}
          </Box>
        </Paper>
      </div>
    </>
  );
};

export default CompanyInfo;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`company-tabpanel-${index}`}
      aria-labelledby={`company-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}
