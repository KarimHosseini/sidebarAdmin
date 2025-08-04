/* eslint-disable react-hooks/exhaustive-deps */
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import {
  Button,
  Drawer,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import moment from "jalali-moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  baseUrl,
  GET_ACCESS_PROFILE,
  REMOVE_STATIC_DATA_CACHE,
} from "../../helpers/api-routes";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import { configReq } from "../../helpers/functions";
import { openDrawer } from "../../redux/slices/menu";
import axiosInstance from "../dataFetch/axiosInstance";
import BroadCrumb from "./BroadCrumb";
import DarkModeSwitch from "./darkModeSwitch";
import SearchPage from "./searchPage";
import Settings from "./setting";
const PageTitle = ({
  title,
  backBtn = false,
  broadCrumb = [],
  buttonInfo = false,
  hideTitle = true,
  buttonInfo2 = false,
  buttonInfo3 = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userInfo, setuserInfo] = useState({});
  const [userAccess, setUserAccess] = useState("");
  const { token } = useSelector((state) => state.user);
  const { companyInfo } = useSelector((state) => state.relationals);
  const isTablet = useMediaQuery("(min-width:668px)");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("s")) {
      setuserInfo(JSON.parse(localStorage.getItem("s")));
    }
  }, [localStorage.getItem("s")]);
  const isDesktop = useMediaQuery("(min-width:900px)");
  useEffect(() => {
    if (userInfo && !userAccess) {
      axiosInstance
        .get(
          `${baseUrl}/${GET_ACCESS_PROFILE}?Page=1&Limit=2000`,
          configReq(token)
        )
        .then((res) => {
          setUserAccess(
            res?.data?.data?.find((item) => item?.id === userInfo?.accessId)
              .title
          );
        })
        .catch((err) => {});
    }
  }, [userInfo]);

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        /*      flexDirection: { xs: "column", sm: "row" }, */
        py: 2,
        alignItems: "center",
        gap: { xs: 0.5, sm: 2.5 },
        height: { md: "50px" },
        borderBottom: (theme) =>
          theme.palette.mode === "light"
            ? "1px solid #dbdfea"
            : "1px solid rgba(255, 255, 255, 0.1)",
        mb: "10px",
        background: (theme) =>
          theme.palette.mode === "light"
            ? "#fff"
            : "transparent",
        className: (theme) =>
          theme.palette.mode === "dark" ? "page-title-dark-gradient" : "",

      }}
      className="md:px-8 p-1 pr-5 pl-1"
    >
      {!isDesktop && (
        <MenuIcon
          sx={{
            color: (theme) =>
              theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.81)" : "#fff",
            fontSize: "2em",
            mr: 1,
            cursor: "pointer",
          }}
          onClick={() => {
            dispatch(openDrawer(true));
          }}
        />
      )}
      {hideTitle && (
        <div
          className="overflow-x-auto overflow-y-hidden pl-3"
          style={{ maxWidth: "300px", width: "100%" }}
        >
          <div className="w-full min-w-max">
            <BroadCrumb
              current={title}
              links={[
                {
                  title: "داشبورد",
                  path: "/",
                },
                ...broadCrumb,
              ]}
            />
          </div>
        </div>
      )}
      <div style={{ flexGrow: 1 }} />
      <div className="md:flex hidden items-center gap-2">
        {companyInfo?.maintenanceMode && (
          <div className="bg-red-600 rounded-2xl py-2 px-3 text-white">
            حالت تعمیر فعال است
          </div>
        )}
  
        <Box
          sx={{
            background: (theme) =>
              theme.palette.mode === "light" ? "#f0f2f5" : "#1a2935",
          }}
          className="flex mx-5 gap-2 rounded-3xl py-3 px-7"
        >
          <span className="text-xs">امروز :‌ </span>
          <span className="text-xs">
            {moment(new Date(), "YYYY-MM-DD HH:mm:ss").format("dddd")}
          </span>
          <span className="text-xs">
            {new Intl.DateTimeFormat("fa-IR", {
              month: "short",
              day: "numeric",
            }).format(new Date())}
          </span>
        </Box>
        <div className="flex items-center justify-center md:w-[30px] md:h-[30px] w-[25px] h-[25px] rounded-full border-2 border-[#f0f2f5]">
          <PersonOutlineIcon
            sx={{ color: "#cfcfcf", fontSize: { md: "25px", xs: "15px" } }}
          />
        </div>

        <div className="md:flex flex-col hidden">
          <Typography
            sx={{
              fontSize: { md: "0.8rem !important", xs: "1rem !important" },
              color: (theme) =>
                theme.palette.mode === "light" ? "#001ee4" : "#90caf9",
              fontWeight: 900,
            }}
          >
            {userAccess || "ادمین"}
          </Typography>
          <div className="flex items-center gap-2">
            <Typography
              sx={{
                fontSize: { md: "0.75rem !important", xs: "1rem !important" },
              }}
            >
              {userInfo?.fname} {userInfo?.lname}
            </Typography>
            {/*   <KeyboardArrowDownIcon sx={{ fontSize: "0.8rem !important" }} /> */}
          </div>
        </div>
        <SettingsOutlinedIcon
          sx={{
            color: (theme) =>
              theme.palette.mode === "dark" ? "#aeb5c8" : "#555b6d",
          }}
          onClick={() => setOpen(true)}
          className="cursor-pointer"
        />
      </div>{" "}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        className="leftDrawwer"
        sx={{
          ".MuiPaper-root": {
            borderRadius: "10px 0px 0px 10px!important",
          },
        }}
      >
        <Settings onClose={() => setOpen(false)} />
      </Drawer>
    </Paper>
  );
};

export default PageTitle;
