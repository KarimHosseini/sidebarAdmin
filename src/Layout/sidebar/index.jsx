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

    return headerMenu
      .map((item) => {
        // Check if main item title matches
        const titleMatches = item.title.toLowerCase().includes(term);

        // Filter subroutes that match
        const matchingSubroutes =
          item.subroutes?.filter((subroute) =>
            subroute.name.toLowerCase().includes(term)
          ) || [];

        // Filter accordion items and their children
        const matchingAccordion =
          item.accordian
            ?.map((accItem) => {
              const accTitleMatches = accItem.title
                .toLowerCase()
                .includes(term);
              const matchingChildren =
                accItem.childs?.filter((child) =>
                  child.name.toLowerCase().includes(term)
                ) || [];

              // Include accordion if title matches OR it has matching children
              if (accTitleMatches || matchingChildren.length > 0) {
                return {
                  ...accItem,
                  childs:
                    matchingChildren.length > 0
                      ? matchingChildren
                      : accItem.childs,
                };
              }
              return null;
            })
            .filter(Boolean) || [];

        // Include item if:
        // 1. Title matches
        // 2. Has matching subroutes
        // 3. Has matching accordion items
        if (
          titleMatches ||
          matchingSubroutes.length > 0 ||
          matchingAccordion.length > 0
        ) {
          return {
            ...item,
            subroutes:
              matchingSubroutes.length > 0 ? matchingSubroutes : item.subroutes,
            accordian:
              matchingAccordion.length > 0 ? matchingAccordion : item.accordian,
          };
        }

        return null;
      })
      .filter(Boolean);
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
      className={`modern-sidebar overflow-hidden border-l ${
        dark ? "dark" : ""
      }`}
      sx={{
        width: viewALl || hover ? { md: "15.75rem", xs: "80%" } : "4rem",
        position: "fixed",
        left: 0,
        top: 0,
        height: "100%",
        zIndex: 100,
        transition: "transform 450ms ease, width 450ms ease",
        transform: "translateX(0)",
        overflow: "hidden !important",
      }}
    >
      <Box
        className="glass-card overflow-hidden"
        sx={{
          borderRadius: 0,
          borderBottom: "1px solid var(--glass-border)",
          padding: "14px 22px",
        }}
      >
        <Box className="flex h-[50px] items-center justify-between">
          {isMd ? (
            <MenuIcon
              sx={{
                color: "var(--sidebar-dark-text)",
                fontSize: "1.625rem",
                mr: 3,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "var(--gradient-primary-start)",
                  filter: "drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))",
                },
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
                color: "var(--sidebar-dark-text)",
                fontSize: "2em",
                mr: 1,
                cursor: "pointer",
                "&:hover": {
                  color: "var(--gradient-primary-start)",
                },
              }}
              onClick={() => {
                dispatch(openDrawer(false));
              }}
            />
          )}
          <Box
            className="glass-card"
            sx={{
              display: { md: "none", xs: "flex" },
              gap: 1,
              borderRadius: "24px",
              py: 1,
              px: 2,
              mx: 2,
            }}
          >
            <span className="text-xs gradient-text">
              {moment(new Date(), "YYYY-MM-DD HH:mm:ss").format("dddd")}
            </span>
            <span className="text-xs gradient-text">
              {" "}
              {new Intl.DateTimeFormat("fa-IR", {
                month: "short",
                day: "numeric",
              }).format(new Date())}
            </span>
          </Box>
          <a
            target={"_blank"}
            rel="noreferrer"
            href={`${process.env.REACT_APP_DOMAIN_URL}`}
          >
            <div className="flex items-center gap-3">
              <img
                src={`${baseUrl}/${DOWNLOAD_FILE}/${
                  dark ? companyInfo?.companyDarkLogo : companyInfo?.companyLogo
                }?size=tiny`}
                alt="logo"
                className="sidebar-logo"
                style={{ height: "20px" }}
              />
            </div>
          </a>
        </Box>
      </Box>
      {isMd && (
        <Box
          sx={{
            padding: "16px",
            borderBottom: "1px solid var(--glass-border)",
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="جستجوی امکانات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="fancy-search-input"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ManageSearchIcon
                    sx={{
                      color: "var(--sidebar-dark-text-secondary)",
                      fontSize: "1.25rem",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "var(--glass-bg)",
                borderRadius: "12px",
                backdropFilter: "var(--glass-blur)",
                border: "1px solid var(--glass-border)",
                transition: "all 0.3s ease",

                "& fieldset": {
                  border: "none",
                },
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                },
                "&.Mui-focused": {
                  borderColor: "rgba(99, 102, 241, 0.5)",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
                },
              },
              "& .MuiInputBase-input": {
                color: "white",
                fontSize: "0.9rem",
              },
           
            }}
          />
        </Box>
      )}

      {!isMd && (
        <div className="user-profile-card mx-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center md:w-[35px] md:h-[35px] w-[30px] h-[30px] rounded-full glass-card border border-[var(--glass-border)]">
              <PersonOutlineIcon
                sx={{
                  fontSize: "20px",
                  color: "var(--gradient-primary-start)",
                }}
              />
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <Typography
                sx={{
                  fontSize: { xs: "14px !important" },
                  color: "var(--sidebar-dark-text)",
                  fontWeight: 600,
                }}
              >
                {userInfo?.fname} {userInfo?.lname}
              </Typography>
              <Typography
                className="gradient-text"
                sx={{
                  fontSize: {
                    md: "0.8rem !important",
                    xs: "0.85rem !important",
                  },
                  fontWeight: 700,
                }}
              >
                {userInfo?.access || "ادمین"}
              </Typography>
            </div>
            <DarkModeSwitch />
          </div>
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
        <List sx={{ width: "100%", mt: 2 }}>
          {filteredMenu.map((item, i) =>
            !item.subroutes ? (
              <Link key={i} to={item.path}>
                <ListItem
                  className={`sidebar-menu-item ${
                    `/${location.pathname.split("/")[1]}` === item.path
                      ? "active"
                      : ""
                  }`}
                  sx={{
                    ...styles.listItem,
                  }}
                  onClick={() => {
                    if (!isMd) {
                      dispatch(openDrawer(false));
                    }
                  }}
                >
                  <ListItemIcon
                    className="sidebar-icon"
                    sx={{
                      ...styles.listItemIcon,
                      color:
                        `/${location.pathname.split("/")[1]}` === item.path
                          ? "var(--gradient-primary-start)"
                          : "var(--sidebar-dark-text-secondary)",
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
                        fontWeight:
                          `/${location.pathname.split("/")[1]}` === item.path
                            ? 600
                            : 500,
                      },
                      color:
                        `/${location.pathname.split("/")[1]}` === item.path
                          ? "var(--sidebar-dark-text)"
                          : "var(--sidebar-dark-text-secondary)",
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
          <ListItem
            onClick={() => logout()}
            className="sidebar-menu-item"
            sx={{
              ...styles.listItem,
              mt: 2,
              "&:hover": {
                ".MuiListItemIcon-root": {
                  color: "#ef4444",
                },
                ".MuiListItemText-root": {
                  color: "#ef4444",
                },
              },
            }}
          >
            <ListItemIcon
              className="sidebar-icon"
              sx={{
                ...styles.listItemIcon,
                transition: "all 0.3s ease",
              }}
            >
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
