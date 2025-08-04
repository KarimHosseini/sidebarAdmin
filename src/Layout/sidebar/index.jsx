import { MeetingRoom } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  TextField,
  InputAdornment,
} from "@mui/material";
import moment from "jalali-moment";

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import DarkModeSwitch from "../../components/common/darkModeSwitch";
import { baseUrl, DOWNLOAD_FILE } from "../../helpers/api-routes";
import { openDrawer } from "../../redux/slices/menu";
import DrawerListItem from "./DrawerListItem";
const Sidebar = ({ headerMenu, viewALl, setViewALl }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [hover, setHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setuserInfo] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const { themeColor } = useSelector((state) => state.themeColor);
  const { companyInfo } = useSelector((state) => state.relationals);

  var dark = themeColor === "dark";
  
  // Filter headerMenu based on search term
  const filteredMenu = useMemo(() => {
    if (!searchTerm.trim()) {
      return headerMenu;
    }
    
    const term = searchTerm.toLowerCase().trim();
    
    return headerMenu.map(item => {
      // Check if main item title matches
      const titleMatches = item.title.toLowerCase().includes(term);
      
      // Filter subroutes that match
      const matchingSubroutes = item.subroutes?.filter(subroute =>
        subroute.name.toLowerCase().includes(term)
      ) || [];
      
      // Filter accordion items and their children
      const matchingAccordion = item.accordian?.map(accItem => {
        const accTitleMatches = accItem.title.toLowerCase().includes(term);
        const matchingChildren = accItem.childs?.filter(child =>
          child.name.toLowerCase().includes(term)
        ) || [];
        
        // Include accordion if title matches OR it has matching children
        if (accTitleMatches || matchingChildren.length > 0) {
          return {
            ...accItem,
            childs: matchingChildren.length > 0 ? matchingChildren : accItem.childs
          };
        }
        return null;
      }).filter(Boolean) || [];
      
      // Include item if:
      // 1. Title matches
      // 2. Has matching subroutes
      // 3. Has matching accordion items
      if (titleMatches || matchingSubroutes.length > 0 || matchingAccordion.length > 0) {
        return {
          ...item,
          subroutes: matchingSubroutes.length > 0 ? matchingSubroutes : item.subroutes,
          accordian: matchingAccordion.length > 0 ? matchingAccordion : item.accordian
        };
      }
      
      return null;
    }).filter(Boolean);
  }, [headerMenu, searchTerm]);

  useEffect(() => {
    const storedUser = localStorage.getItem("s");
    if (storedUser) {
      setuserInfo(JSON.parse(storedUser));
    }
  }, []);
  const styles = {
    innerBox: {
      padding: "0px 0px 14px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxHeight: "calc(100vh - 100px)",
      overflowY: "overlay",
      height: "100%",
    },
    logo: {
      height: "1.25rem",
      fill: (theme) =>
        theme.palette.mode === "light" ? "rgba(179, 179, 184, 1)" : "#fff",
    },
    listItem: {
      cursor: "pointer",
      width: { md: "14.1875rem" },
      paddingRight: "0",
      paddingLeft: "0",
    },
    listItemIcon: {
      fontSize: "1.25rem",
      color: (theme) =>
        theme.palette.mode === "light" 
          ? "rgba(162, 162, 168, 0.81)" 
          : "rgba(255, 255, 255, 0.8)",
    },
    listItemText: {
      textAlign: "left",
      color: (theme) =>
        theme.palette.mode === "light" 
          ? "rgba(0, 0, 0)" 
          : "rgba(255, 255, 255, 0.9)",
      opacity: viewALl || hover ? 1 : 0,
      transition: "all 450ms ease",
    },
  };
  const isMd = useMediaQuery("(min-width:900px)");
  const logout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("s");
    localStorage.removeItem("userId");
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    document.location.href = "/";
  };
  return (
          <Box
        component="aside"
        sx={{
          width: viewALl || hover ? { md: "15.75rem", xs: "80%" } : "4rem",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "#fff"
              : "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
          position: "fixed",
          left: 0,
          top: 0,
          height: "100%",
          zIndex: 100,
          borderLeft: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid #EEEEEE"
              : "1px solid rgba(255, 255, 255, 0.1)",
          transition: "transform 450ms ease, width 450ms ease",
          overflowY: "auto",
          overflowX: "hidden",
          transform: "translateX(0)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "4px 0 20px rgba(0, 0, 0, 0.3)"
              : "none",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme => theme.palette.mode === "dark" 
              ? "linear-gradient(180deg, rgba(100, 181, 246, 0.05) 0%, transparent 100%)"
              : "transparent",
            pointerEvents: "none",
          },
        }}
        className="overflow-hidden border-l"
      >
              <Box
          sx={{ 
            borderBottom: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid #e5e9f2"
                : "1px solid rgba(255, 255, 255, 0.1)",
            padding: "14px 22px",
            background: (theme) =>
              theme.palette.mode === "light"
                ? "transparent"
                : "linear-gradient(90deg, rgba(100, 181, 246, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)",
            backdropFilter: theme => theme.palette.mode === "dark" ? "blur(10px)" : "none",
          }}
          className="flex h-[50px] items-center justify-between"
        >
        {isMd ? (
          <MenuIcon
            sx={{
              color: (theme) =>
                theme.palette.mode === "light"
                  ? "rgba(179, 179, 184, 1)"
                  : "#fff",
              fontSize: "1.625rem",
              mr: 3,
              cursor: "pointer",
            }}
            onClick={() => {
              if (isMd) {
                setViewALl(!viewALl);
              } else {
                dispatch(openDrawer(false));
              }
            }}
          />
        ) : (
          <MenuIcon
            sx={{
              color: (theme) =>
                theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.81)" : "#fff",
              fontSize: "2em",
              mr: 1,
              cursor: "pointer",
            }}
            onClick={() => {
              dispatch(openDrawer(false));
            }}
          />
        )}
        <Box
          sx={{
            background: (theme) =>
              theme.palette.mode === "light" ? "#f0f2f5" : "#1a2935",
          }}
          className="flex md:hidden mx-5 gap-2 rounded-3xl py-2 px-3"
        >
          <span className="text-xs">
            {moment(new Date(), "YYYY-MM-DD HH:mm:ss").format("dddd")}
          </span>
          <span className="text-xs">
            {" "}
            {new Intl.DateTimeFormat("fa-IR", {
              month: "short",
              day: "numeric",
            }).format(new Date())}
          </span>
        </Box>
        <a target={"_blank"} rel="noreferrer" href={`${process.env.REACT_APP_DOMAIN_URL}`}>
          <div className="flex items-center gap-3">
            {dark ? (
              <img
                src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyDarkLogo}?size=tiny`}
                alt="logo"
                style={styles.logo}
                height={20}
              />
            ) : (
              <img
                src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}?size=tiny`}
                alt="logo"
                style={styles.logo}
                height={20}
              />
            )}
          </div>
        </a>
      </Box>
      {isMd && (
        <Box sx={{ 
          borderBottom: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid #e5e9f2"
              : "1px solid rgba(255, 255, 255, 0.1)",
          padding: "8px 16px",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "transparent"
              : "linear-gradient(90deg, rgba(255, 255, 255, 0.02) 0%, rgba(100, 181, 246, 0.05) 100%)",
        }}>
          <TextField
            fullWidth
            size="small"
            placeholder="جستجوی امکانات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ManageSearchIcon 
                    sx={{ 
                      color: (theme) =>
                        theme.palette.mode === "light" 
                          ? "rgba(162, 162, 168, 0.81)" 
                          : "rgba(255, 255, 255, 0.7)",
                      fontSize: "1.25rem"
                    }} 
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: (theme) =>
                  theme.palette.mode === "light" 
                    ? "#f7f7f7" 
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(100, 181, 246, 0.05) 100%)",
                borderRadius: "12px",
                backdropFilter: theme => theme.palette.mode === "dark" ? "blur(10px)" : "none",
                border: theme => theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "none",

                '& fieldset': {
                  borderColor: (theme) =>
                    theme.palette.mode === "light" 
                      ? "#e0e0e0" 
                      : "transparent",
                },
                '&:hover fieldset': {
                  borderColor: (theme) =>
                    theme.palette.mode === "light" 
                      ? "#ccc" 
                      : "rgba(100, 181, 246, 0.3)",
                },
                '&.Mui-focused fieldset': {
                  borderColor: (theme) =>
                    theme.palette.mode === "light" 
                      ? "#001ee4" 
                      : "#64b5f6",
                  boxShadow: theme => 
                    theme.palette.mode === "dark" 
                      ? "0 0 20px rgba(100, 181, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)" 
                      : "0 0 10px rgba(0, 30, 228, 0.2)",
                },
              },
              '& .MuiInputBase-input': {
                color: (theme) =>
                  theme.palette.mode === "light" ? "rgba(0, 0, 0)" : "#fff",
                fontSize: "0.9rem",
              },
              '& .MuiInputBase-input::placeholder': {
                color: (theme) =>
                  theme.palette.mode === "light" 
                    ? "rgba(162, 162, 168, 0.81)" 
                    : "rgba(255, 255, 255, 0.6)",
                opacity: 1,
              },
            }}
          />
        </Box>
      )}

      {!isMd && (
        <div className="flex justify-between  items-center gap-2 pr-6 pt-2 border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center md:w-[30px] md:h-[30px] w-[25px] h-[25px] rounded-full border-2 border-[#a1a3a8]">
              <PersonOutlineIcon sx={{ fontSize: "20px" }} />
            </div>

            <div className="flex flex-col gap-1 w-full pl-7 pr-3 ">
              <div className="flex items-center gap-2">
                <Typography
                  sx={{
                    fontSize: { xs: "14px !important" },
                  }}
                >
                  {userInfo?.fname} {userInfo?.lname}
                </Typography>
              </div>{" "}
              <Typography
                sx={{
                  fontSize: { md: "0.8rem !important", xs: "1rem !important" },
                  color: (theme) =>
                    theme.palette.mode === "light" ? "#001ee4" : "#90caf9",
                  fontWeight: 900,
                }}
              >
                {userInfo?.access || "ادمین"}
              </Typography>
            </div>
          </div>
          <DarkModeSwitch />
        </div>
      )}
      <Box
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
        sx={styles.innerBox}
        className="sidebar overflow-x-hidden"
      >
        <List sx={{ width: "100%" }}>
          {filteredMenu.map((item, i) =>
            !item.subroutes ? (
              <Link key={i} to={item.path}>
                <ListItem
                  sx={{
                    ...styles.listItem,
                    background: (theme) =>
                      `/${location.pathname.split("/")[1]}` === item.path
                        ? theme.palette.mode === "light"
                          ? "rgba(0, 30, 228, 0.08)"
                          : "linear-gradient(135deg, rgba(100, 181, 246, 0.15) 0%, rgba(63, 81, 181, 0.1) 100%)"
                        : "transparent",
                    borderRadius: `/${location.pathname.split("/")[1]}` === item.path ? "12px" : "0px",
                    margin: `/${location.pathname.split("/")[1]}` === item.path ? "4px 12px" : "2px 8px",
                    boxShadow: (theme) =>
                      `/${location.pathname.split("/")[1]}` === item.path && theme.palette.mode === "dark"
                        ? "0 4px 15px rgba(100, 181, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                        : "none",
                    border: (theme) =>
                      `/${location.pathname.split("/")[1]}` === item.path && theme.palette.mode === "dark"
                        ? "1px solid rgba(100, 181, 246, 0.2)"
                        : "none",
                    "&:hover": {
                      background: (theme) =>
                        `/${location.pathname.split("/")[1]}` === item.path
                          ? theme.palette.mode === "light"
                            ? "rgba(0, 30, 228, 0.12)"
                            : "linear-gradient(135deg, rgba(100, 181, 246, 0.2) 0%, rgba(63, 81, 181, 0.15) 100%)"
                          : theme.palette.mode === "light"
                            ? "rgba(0, 30, 228, 0.05)"
                            : "linear-gradient(135deg, rgba(100, 181, 246, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
                      borderRadius: "12px",
                      margin: "4px 12px",
                      transform: "translateY(-1px)",
                      transition: "all 0.3s ease",
                      ".MuiListItemIcon-root": {
                        color: (theme) =>
                          theme.palette.mode === "light"
                            ? "#001ee4"
                            : "#64b5f6",
                      },
                      ".MuiListItemText-root": {
                        color: (theme) =>
                          theme.palette.mode === "light"
                            ? "#001ee4"
                            : "#64b5f6",
                      },
                    },
                  }}
                  onClick={() => {
                    if (!isMd) {
                      dispatch(openDrawer(false));
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      ...styles.listItemIcon,
                      color: (theme) =>
                        `/${location.pathname.split("/")[1]}` === item.path
                          ? theme.palette.mode === "light"
                            ? "#001ee4"
                            : "#64b5f6"
                          : theme.palette.mode === "light"
                            ? "rgba(162, 162, 168, 0.81)"
                            : "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    sx={{
                      ...styles.listItemText,
                      ".MuiTypography-root": {
                        fontSize: { md: "0.9rem !important" },
                        fontWeight: 500,
                      },

                      color: (theme) =>
                        `/${location.pathname.split("/")[1]}` === item.path
                          ? theme.palette.mode === "light"
                            ? "#001ee4"
                            : "#64b5f6"
                          : theme.palette.mode === "light"
                            ? "rgba(0, 0, 0)"
                            : "rgba(255, 255, 255, 0.9)",
                    }}
                  />
                </ListItem>
              </Link>
            ) : (
              <DrawerListItem
                item={item}
                key={i}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                viewALl={hover ? hover : viewALl}
                searchTerm={searchTerm}
              />
            )
          )}
          <ListItem onClick={() => logout()} sx={styles.listItem}>
            <ListItemIcon sx={styles.listItemIcon}>
              <MeetingRoom />
            </ListItemIcon>
            <ListItemText
              primary="خروج"
              sx={{
                ...styles.listItemText,
                ".MuiTypography-root": {
                  fontSize: { md: "0.9rem !important" },
                  fontWeight: 500,
                },
              }}
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
