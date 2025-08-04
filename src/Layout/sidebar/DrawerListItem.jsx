/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronLeft } from "@mui/icons-material";
import {
  Collapse,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { openDrawer } from "../../redux/slices/menu";

const DrawerListItem = ({ item, viewALl, isOpen, setIsOpen, searchTerm }) => {
  const location = useLocation();
  const [allChildPath, setAllChildPath] = useState([]);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    var temp = [];
    item.subroutes?.map((items) => {
      temp.push(items.path);
    });
    item.accordian?.map((acc) => {
      acc?.childs.map((ch) => {
        temp.push(ch.path);
      });
    });
    if (temp.find((tmp) => tmp === `/${location.pathname.split("/")[1]}`)) {
      setIsOpen(item.title);
    }

    // Auto-expand when searching
    if (searchTerm && searchTerm.trim()) {
      setIsOpen(item.title);
    }

    setAllChildPath(temp);
  }, [item, searchTerm]);
  const isMd = useMediaQuery("(min-width:900px)");

  return (
    <>
      <ListItem
        key={item.title}
        sx={{
          ...styles.listItem,
          height: "45.61px !important",
          backgroundColor: (theme) =>
            allChildPath?.find(
              (tmp) => tmp === `/${location.pathname.split("/")[1]}`
            )
              ? theme.palette.mode === "light"
                ? "rgba(0, 30, 228, 0.08)"
                : "transparent"
              : "transparent",
          className: (theme) =>
            allChildPath?.find(
              (tmp) => tmp === `/${location.pathname.split("/")[1]}`
            ) && theme.palette.mode === "dark"
              ? "accordion-item-selected-gradient"
              : "",
          borderRadius: allChildPath?.find(
            (tmp) => tmp === `/${location.pathname.split("/")[1]}`
          )
            ? "8px"
            : "0px",
          margin: allChildPath?.find(
            (tmp) => tmp === `/${location.pathname.split("/")[1]}`
          )
            ? "2px 8px"
            : "0px",

          "&:hover": {
                        backgroundColor: (theme) =>
              allChildPath?.find(
                (tmp) => tmp === `/${location.pathname.split("/")[1]}`
              )
                ? theme.palette.mode === "light"
                  ? "rgba(0, 30, 228, 0.12)"
                  : "transparent"
                : theme.palette.mode === "light"
                  ? "rgba(0, 30, 228, 0.05)"
                  : "transparent",
            className: (theme) => {
              if (theme.palette.mode === "dark") {
                return allChildPath?.find(
                  (tmp) => tmp === `/${location.pathname.split("/")[1]}`
                )
                  ? "accordion-item-hover-gradient"
                  : "";
              }
              return "";
            },
            ".MuiListItemIcon-root": {
              color: (theme) =>
                theme.palette.mode === "light" ? "#001ee4" : "#64b5f6",
            },
            ".MuiListItemText-root": {
              color: (theme) =>
                theme.palette.mode === "light" ? "#001ee4" : "#64b5f6",
            },
          },
        }}
        onClick={() => setIsOpen(isOpen === item.title ? null : item.title)}
      >
        {" "}
        <Box
          sx={{
            opacity: item.subroutes?.find(
              (item) => item.path === `/${location.pathname.split("/")[1]}`
            )
              ? 1
              : 0,
          }}
          className="sideBarActive transition"
        ></Box>
        <ListItemIcon
          sx={{
            ...styles.listItemIcon,
            color: (theme) =>
              allChildPath?.find(
                (tmp) => tmp === `/${location.pathname.split("/")[1]}`
              )
                ? theme.palette.mode === "light"
                  ? "#001ee4"
                  : "#64b5f6"
                : theme.palette.mode === "light"
                ? "rgba(162, 162, 168, 0.81)"
                : "rgba(255, 255, 255, 0.8)",
            fontWeight: allChildPath?.find(
              (tmp) => tmp === `/${location.pathname.split("/")[1]}`
            )
              ? 500
              : 400,
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.title}
          sx={{
            ...styles.listItemText,
            color: (theme) =>
              allChildPath?.find(
                (tmp) => tmp === `/${location.pathname.split("/")[1]}`
              )
                ? theme.palette.mode === "light"
                  ? "#001ee4"
                  : "#64b5f6"
                : theme.palette.mode === "light"
                ? "rgba(0, 0, 0)"
                : "rgba(255, 255, 255, 0.9)",
            opacity: viewALl ? 1 : 0,
            ".MuiTypography-root": {
              fontSize: { md: "0.9rem !important" },
              fontWeight: 500,
            },
            transition: "all 450ms ease",
            position: "relative",
          }}
        ></ListItemText>
        <ChevronLeft
          sx={{
            color: (theme) =>
              theme.palette.mode === "light"
                ? "rgba(0, 0, 0)"
                : "rgba(255, 255, 255, 0.8)",
            transform:
              isOpen === item.title && viewALl
                ? "rotate(90deg)"
                : "rotate(0deg)",
            transition: "300ms all ease",
            mr: 2,
            fontSize: "1rem",
          }}
        />
      </ListItem>

      <Collapse
        in={
          Boolean(isOpen === item.title && viewALl) ||
          Boolean(searchTerm && searchTerm.trim() && viewALl)
        }
      >
        {item.subroutes.map((item, i) => (
          <Link key={i + "c;ewcm"} to={item.path}>
            <ListItem
              onClick={() => {
                if (!isMd) {
                  dispatch(openDrawer(false));
                }
              }}
              key={i}
              sx={{
                ...styles.listItem,
                backgroundColor: (theme) =>
                  `/${location.pathname.split("/")[1]}` === item.path
                    ? theme.palette.mode === "light"
                      ? "rgba(0, 30, 228, 0.08)"
                      : "transparent"
                    : "transparent",
                className: (theme) =>
                  `/${location.pathname.split("/")[1]}` === item.path && theme.palette.mode === "dark"
                    ? "submenu-item-selected-gradient"
                    : "",
                borderRadius:
                  `/${location.pathname.split("/")[1]}` === item.path
                    ? "6px"
                    : "0px",
                margin:
                  `/${location.pathname.split("/")[1]}` === item.path
                    ? "1px 12px 1px 16px"
                    : "0px",

                "&:hover": {
                  backgroundColor: (theme) =>
                    `/${location.pathname.split("/")[1]}` === item.path
                      ? theme.palette.mode === "light"
                        ? "rgba(0, 30, 228, 0.12)"
                        : "transparent"
                      : theme.palette.mode === "light"
                      ? "rgba(0, 30, 228, 0.05)"
                      : "transparent",
                  className: (theme) => {
                    if (theme.palette.mode === "dark") {
                      return `/${location.pathname.split("/")[1]}` === item.path
                        ? "submenu-item-hover-gradient"
                        : "";
                    }
                    return "";
                  },
                  ".MuiListItemIcon-root": {
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#001ee4" : "#64b5f6",
                  },
                  ".MuiListItemText-root": {
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#001ee4" : "#64b5f6",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  ...styles.listItemIcon,
                  paddingLeft: "5px !important",
                  color: (theme) =>
                    `/${location.pathname.split("/")[1]}` === item.path
                      ? theme.palette.mode === "light"
                        ? "#001ee4"
                        : "#64b5f6"
                      : theme.palette.mode === "light"
                      ? "rgba(162, 162, 168, 0.81)"
                      : "rgba(255, 255, 255, 0.7)",
                }}
              >
                -
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                sx={{
                  ...styles.listItemText,
                  opacity: viewALl ? 1 : 0,
                  transition: "all 450ms ease",
                  color: (theme) =>
                    `/${location.pathname.split("/")[1]}` === item.path
                      ? theme.palette.mode === "light"
                        ? "#001ee4"
                        : "#64b5f6"
                      : theme.palette.mode === "light"
                      ? "rgba(0, 0, 0)"
                      : "rgba(255, 255, 255, 0.8)",
                  ".MuiTypography-root": {
                    fontSize: { md: "0.8rem !important" },
                  },
                }}
              />
            </ListItem>
          </Link>
        ))}
        {item?.accordian && <DrawerListItem2 item={item} />}
      </Collapse>
    </>
  );
};
const DrawerListItem2 = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    item.accordian.map((accr, index) => {
      if (
        accr.childs?.find(
          (child) => child.path === `/${location.pathname.split("/")[1]}`
        )
      ) {
        setIsOpen({ [index]: isOpen[index] ? false : true });
      }
    });
  }, []);
  const isMd = useMediaQuery("(min-width:900px)");
  const dispatch = useDispatch();

  return (
    <>
      {item?.accordian.map((items, index) => (
        <Fragment key={index + "acc"}>
          <ListItem
            key={items.title}
            sx={{
              ...styles.listItem,
              backgroundColor: (theme) =>
                items.childs?.find(
                  (item) => item.path === `/${location.pathname.split("/")[1]}`
                )
                  ? theme.palette.mode === "light"
                    ? "rgba(0, 30, 228, 0.06)"
                    : "transparent"
                  : "transparent",
              borderRadius: items.childs?.find(
                (item) => item.path === `/${location.pathname.split("/")[1]}`
              )
                ? "6px"
                : "0px",
              margin: items.childs?.find(
                (item) => item.path === `/${location.pathname.split("/")[1]}`
              )
                ? "1px 12px 1px 20px"
                : "0px",
              boxShadow: (theme) =>
                items.childs?.find(
                  (item) => item.path === `/${location.pathname.split("/")[1]}`
                ) && theme.palette.mode === "dark"
                  ? "0 1px 4px rgba(100, 181, 246, 0.1)"
                  : "none",
              "&:hover": {
                backgroundColor: (theme) =>
                  items.childs?.find(
                    (item) =>
                      item.path === `/${location.pathname.split("/")[1]}`
                  )
                    ? theme.palette.mode === "light"
                      ? "rgba(0, 30, 228, 0.1)"
                      : "transparent"
                    : theme.palette.mode === "light"
                    ? "rgba(0, 30, 228, 0.05)"
                    : "transparent",
                ".MuiListItemIcon-root": {
                  color: (theme) =>
                    theme.palette.mode === "light" ? "#001ee4" : "#64b5f6",
                },
                ".MuiListItemText-root": {
                  color: (theme) =>
                    theme.palette.mode === "light" ? "#001ee4" : "#64b5f6",
                },
              },
            }}
            onClick={() => setIsOpen({ [index]: isOpen[index] ? false : true })}
          >
            <ListItemIcon sx={styles.listItemIcon}>{items.icon}</ListItemIcon>
            <ListItemText
              primary={items.title}
              sx={{
                ...styles.listItemText,
                ".MuiTypography-root": {
                  fontSize: { md: "0.8rem !important" },
                },
                color: (theme) =>
                  items.childs?.find(
                    (item) =>
                      item.path === `/${location.pathname.split("/")[1]}`
                  )
                    ? theme.palette.mode === "light"
                      ? "#001ee4"
                      : "#64b5f6"
                    : theme.palette.mode === "light"
                    ? "rgba(0, 0, 0)"
                    : "rgba(255, 255, 255, 0.9)",
              }}
            />

            <ChevronLeft
              sx={{
                color: (theme) =>
                  theme.palette.mode === "light"
                    ? "rgba(0, 0, 0)"
                    : "rgba(255, 255, 255, 0.8)",
                transform: isOpen[index] ? "rotate(90deg)" : "rotate(0deg)",
                transition: "300ms all ease",
                mr: 2,
                fontSize: "1rem",
              }}
            />
          </ListItem>
          <Collapse in={isOpen[index]}>
            {items.childs.map((item, i) => (
              <Link key={i + "c;ewcdm"} to={item.path}>
                <ListItem
                  onClick={() => {
                    if (!isMd) {
                      dispatch(openDrawer(false));
                    }
                  }}
                  key={i}
                  sx={{
                    ...styles.listItem,
                    backgroundColor: (theme) =>
                      `/${location.pathname.split("/")[1]}` === item.path
                        ? theme.palette.mode === "light"
                          ? "rgba(0, 30, 228, 0.08)"
                          : "transparent"
                        : "transparent",
                    borderRadius:
                      `/${location.pathname.split("/")[1]}` === item.path
                        ? "4px"
                        : "0px",
                    margin:
                      `/${location.pathname.split("/")[1]}` === item.path
                        ? "1px 16px 1px 24px"
                        : "0px",

                    "&:hover": {
                      backgroundColor: (theme) =>
                        `/${location.pathname.split("/")[1]}` === item.path
                          ? theme.palette.mode === "light"
                            ? "rgba(0, 30, 228, 0.12)"
                            : "transparent"
                          : theme.palette.mode === "light"
                          ? "rgba(0, 30, 228, 0.05)"
                          : "transparent",
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
                >
                  <ListItemIcon
                    sx={{
                      ...styles.listItemIcon,
                      paddingLeft: "5px !important",
                      color: (theme) =>
                        `/${location.pathname.split("/")[1]}` === item.path
                          ? theme.palette.mode === "light"
                            ? "#001ee4"
                            : "#64b5f6"
                          : theme.palette.mode === "light"
                          ? "rgba(0, 0, 0)"
                          : "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    -
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={{
                      ...styles.listItemText,
                      color: (theme) =>
                        `/${location.pathname.split("/")[1]}` === item.path
                          ? theme.palette.mode === "light"
                            ? "#001ee4"
                            : "#64b5f6"
                          : theme.palette.mode === "light"
                          ? "rgba(0, 0, 0)"
                          : "rgba(255, 255, 255, 0.8)",

                      ".MuiTypography-root": {
                        fontSize: { md: "0.8rem !important" },
                      },
                    }}
                  />
                </ListItem>
              </Link>
            ))}
          </Collapse>
        </Fragment>
      ))}
    </>
  );
};
const styles = {
  innerBox: {
    py: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    height: "70px",
    marginBottom: "40px",
    color: (theme) =>
      theme.palette.mode === "light" ? "rgba(0, 0, 0)" : "#fff",
  },
  listItem: {
    cursor: "pointer",
    position: "relative",
    width: { md: "14.1875rem" },
    px: "0px",
  },
  listItemIcon: {
    fontSize: "1.25rem",
    color: (theme) =>
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0)"
        : "rgba(255, 255, 255, 0.8)",
  },
  listItemText: {
    textAlign: "left",
    color: (theme) =>
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0)"
        : "rgba(255, 255, 255, 0.9)",
  },
  sublistItem: {
    direction: "rtl",
    cursor: "pointer",
    color: (theme) =>
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0)"
        : "rgba(255, 255, 255, 0.9)",
  },
};

export default DrawerListItem;
