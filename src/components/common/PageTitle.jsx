/* eslint-disable react-hooks/exhaustive-deps */
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  Button,
  Drawer,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import moment from "jalali-moment";
import { useEffect, useState, memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  baseUrl,
  GET_ACCESS_PROFILE,
  REMOVE_STATIC_DATA_CACHE,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { openDrawer } from "../../redux/slices/menu";
import axiosInstance from "../dataFetch/axiosInstance";
import BroadCrumb from "./BroadCrumb";
import DarkModeSwitch from "./darkModeSwitch";
import SearchPage from "./searchPage";
import Settings from "./setting";

// Memoized date component for better performance
const DateDisplay = memo(() => {
  const { themeColor: themes } = useSelector((state) => state.themeColor);
  const dark = themes === "dark";
  
  return (
    <Box
      sx={{
        background: dark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
        display: "flex",
        mx: 2,
        gap: 1.5,
        borderRadius: "8px",
        py: 1.5,
        px: 3,
        transition: "all 0.5s ease",
        border: dark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <Typography 
        sx={{ 
          fontSize: "0.75rem",
          color: dark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.7)",
        }}
      >
        امروز :‌
      </Typography>
      <Typography 
        sx={{ 
          fontSize: "0.75rem",
          color: dark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.7)",
        }}
      >
        {moment(new Date(), "YYYY-MM-DD HH:mm:ss").format("dddd")}
      </Typography>
      <Typography 
        sx={{ 
          fontSize: "0.75rem",
          color: dark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.7)",
        }}
      >
        {new Intl.DateTimeFormat("fa-IR", {
          month: "short",
          day: "numeric",
        }).format(new Date())}
      </Typography>
    </Box>
  );
});

DateDisplay.displayName = 'DateDisplay';

const PageTitle = memo(({
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
  const { themeColor: themes } = useSelector((state) => state.themeColor);
  const dark = themes === "dark";
  const isDesktop = useMediaQuery("(min-width:900px)");

  useEffect(() => {
    const storedUser = localStorage.getItem("s");
    if (storedUser) {
      try {
        setuserInfo(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user info:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userInfo?.accessId && !userAccess && token) {
      axiosInstance
        .get(
          `${baseUrl}/${GET_ACCESS_PROFILE}?Page=1&Limit=2000`,
          configReq(token)
        )
        .then((res) => {
          const accessData = res?.data?.data?.find((item) => item?.id === userInfo?.accessId);
          if (accessData) {
            setUserAccess(accessData.title);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch access profile:", err);
        });
    }
  }, [userInfo?.accessId, userAccess, token]);

  const handleOpenDrawer = useCallback(() => {
    dispatch(openDrawer(true));
  }, [dispatch]);

  const handleSettingsOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleSettingsClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Paper
      elevation={0}
      className="page-title-container"
      sx={{
        mb: 3,
        p: 2.5,
        borderRadius: "8px",
        background: dark 
          ? "rgba(255, 255, 255, 0.02)"
          : "rgba(0, 0, 0, 0.01)",
        border: dark 
          ? "1px solid rgba(255, 255, 255, 0.06)" 
          : "1px solid rgba(0, 0, 0, 0.04)",
        backdropFilter: "blur(8px)",
        boxShadow: dark
          ? "0 2px 8px rgba(0, 0, 0, 0.1)"
          : "0 2px 8px rgba(0, 0, 0, 0.03)",
        transition: "all 0.5s ease",
        display: "flex",
        alignItems: "center",
        gap: 2,
        "&:hover": {
          boxShadow: dark
            ? "0 4px 12px rgba(0, 0, 0, 0.15)"
            : "0 4px 12px rgba(0, 0, 0, 0.05)",
        },
      }}
    >
      {!isDesktop && (
        <MenuIcon
          sx={{
            color: dark ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 0, 0, 0.7)",
            fontSize: "1.75rem",
            cursor: "pointer",
            transition: "all 0.5s ease",
            "&:hover": {
              color: dark ? "#fff" : "#000",
              transform: "scale(1.05)",
            },
          }}
          onClick={handleOpenDrawer}
        />
      )}
      
      {hideTitle && (
        <Box
          sx={{
            overflow: "hidden",
            maxWidth: "350px",
            flexShrink: 0,
          }}
        >
          <Box sx={{ minWidth: "max-content" }}>
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
          </Box>
        </Box>
      )}
      
      <Box sx={{ flexGrow: 1 }} />
      
      <Box 
        sx={{ 
          display: { xs: "none", md: "flex" }, 
          alignItems: "center", 
          gap: 2,
        }}
      >
        {companyInfo?.maintenanceMode && (
          <Box 
            sx={{
              backgroundColor: "#ef4444",
              borderRadius: "8px",
              py: 1,
              px: 2,
              color: "#fff",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            حالت تعمیر فعال است
          </Box>
        )}
  
        <DateDisplay />
        
        <Box 
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              border: dark 
                ? "2px solid rgba(255, 255, 255, 0.1)"
                : "2px solid rgba(0, 0, 0, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.5s ease",
              "&:hover": {
                borderColor: dark 
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <PersonOutlineIcon
              sx={{ 
                color: dark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)", 
                fontSize: "1.25rem",
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: dark ? "rgba(255, 255, 255, 0.9)" : "#1e40af",
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              {userAccess || "ادمین"}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: dark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                lineHeight: 1.2,
              }}
            >
              {userInfo?.fname} {userInfo?.lname}
            </Typography>
          </Box>
          
          <SettingsOutlinedIcon
            sx={{
              color: dark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
              fontSize: "1.25rem",
              cursor: "pointer",
              transition: "all 0.5s ease",
              "&:hover": {
                color: dark ? "#fff" : "#000",
                transform: "rotate(90deg)",
              },
            }}
            onClick={handleSettingsOpen}
          />
        </Box>
      </Box>
      
      <Drawer
        anchor="left"
        open={open}
        onClose={handleSettingsClose}
        className="leftDrawer"
        sx={{
          ".MuiPaper-root": {
            borderRadius: "0 8px 8px 0",
            transition: "transform 0.5s ease",
          },
        }}
      >
        <Settings onClose={handleSettingsClose} />
      </Drawer>
    </Paper>
  );
});

PageTitle.displayName = 'PageTitle';

export default PageTitle;