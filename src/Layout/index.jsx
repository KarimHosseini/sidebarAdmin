/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Drawer, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Modal } from "../components/common";
import axiosInstance from "../components/dataFetch/axiosInstance";
import {
  baseUrl,
  DOWNLOAD_FILE,
  GET_BYROLE_ADMIN_NOTIFICATION,
  SINGLE_USER,
  userPermissions,
} from "../helpers/api-routes";
import { configReq, toIsoString, toIsoString2 } from "../helpers/functions";
import UsePermissons from "../permissions";
import { openDrawer } from "../redux/slices/menu";
import { setPermissoins } from "../redux/slices/relationals";
import { logout } from "../redux/slices/user";
import Sidebar from "./sidebar";

const Layout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [open, setopen] = useState(false);
  const [notif, setNotif] = useState({});

  const [userInfo, setuserInfo] = useState({});
  const [viewALl, setViewALl] = useState(true);
  const { headerMenu } = UsePermissons();

  const [noPermisions, setNoPermisions] = useState(false);
  const dispatch = useDispatch();
  const { userPermissions: userPermissionsSelector } = useSelector(
    (state) => state.relationals
  );
  const { openDrawer: openDrawerSelector } = useSelector(
    (state) => state.openDrawer
  );
  const { themeColor } = useSelector((state) => state.themeColor);
  const { companyInfo } = useSelector((state) => state.relationals);

  var dark = themeColor === "dark";
  const user = useSelector((state) => state.user);
  useEffect(() => {
    setLoading(true);
    if (user?.userId) {
      axiosInstance(
        `${baseUrl}/${SINGLE_USER}?id=${user.userId}`,
        configReq(user?.token)
      )
        .then((res) => {
          const { data } = res;

          if (data && data.code === 200 && data.data) {
            setuserInfo(data.data);
            axiosInstance
              .post(
                `${baseUrl}/${GET_BYROLE_ADMIN_NOTIFICATION}`,
                {
                  roleId: data.data.accessId,
                  endDate: toIsoString2(new Date()),
                  startDate: toIsoString(new Date()),
                },
                configReq(user?.token)
              )
              .then((res) => {
                if (
                  res.data.data &&
                  res.data.data[0] &&
                  res.data.data[0].showCount > 0
                ) {
                  var finded = localStorage.getItem("lastNotif")
                    ? JSON.parse(localStorage.getItem("lastNotif")).id ===
                      res.data.data[0].id
                    : null;
                  const lastNotif = JSON.parse(
                    localStorage.getItem("lastNotif")
                  );
                  if (finded) {
                    if (lastNotif.showCount > 0) {
                      setNotif({ ...res.data.data[0] });
                      localStorage.setItem(
                        "lastNotif",
                        JSON.stringify({
                          ...res.data.data[0],
                          showCount: lastNotif.showCount - 1,
                        })
                      );
                      setopen(true);
                    }
                  } else {
                    setNotif({ ...res.data.data[0] });
                    localStorage.setItem(
                      "lastNotif",
                      JSON.stringify({
                        ...res.data.data[0],
                        showCount: res.data.data[0].showCount - 1,
                      })
                    );
                    setopen(true);
                  }
                }
              })
              .catch((err) => {});
            localStorage.setItem("s", JSON.stringify(data.data));
          }
        })
        .catch((err) => {});

      var allPermissions = {};

      axiosInstance(
        `${baseUrl}/${userPermissions}?id=${user.userId}`,
        configReq(user?.token)
      )
        .then((res) => {
          const { data } = res;

          if (data && data.code === 200 && data.data) {
            setLoading(false);
            if (data.data.length > 0) {
              data.data.map((item) => {
                allPermissions = {
                  ...allPermissions,
                  [item.split("@")[0]]: {
                    ...allPermissions[item.split("@")[0]],
                    [item.split("@")[1]]: true,
                  },
                };
              });

              dispatch(setPermissoins(allPermissions));
            } else {
              setNoPermisions(true);
            }
          }
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [user?.token]);
  const location = useLocation();

  const isMd = useMediaQuery("(min-width:900px)");

  if (
    location?.pathname === "/invoices" ||
    location?.pathname === "/createInvoice" ||
    location?.pathname === "/orderLabel"
  ) {
    return <> {children}</>;
  }
  return (
    <Box className="main">
      {loading ? (
        <div className="all">
          <div className="loader">
            <span className="loader__element"></span>
            <span className="loader__element"></span>
            <span className="loader__element"></span>
            <span className="loader__element"></span>
            <span className="loader__element"></span>
          </div>
        </div>
      ) : (
        <>
          {noPermisions ? (
            <div className="flex flex-col justify-center items-center h-[100vh] gap-4">
              <img
                src="/images/ERROR-403-forbidden.svg"
                alt=""
                className="md:w-96 w-44"
              />
              <span className="text-lg font-bold">
                کاربر گرامی دسترسی به محیط پنل را ندارید . لطفا با مدریت سایت
                تماس حاصل فرمایید.
              </span>
              <Button onClick={() => dispatch(logout())} variant="outlined">
                خروج
              </Button>
            </div>
          ) : (
            <>
              {" "}
              {isMd ? (
                <Sidebar
                  headerMenu={headerMenu}
                  setViewALl={setViewALl}
                  viewALl={viewALl}
                />
              ) : (
                <Drawer
                  anchor="right"
                  open={openDrawerSelector}
                  onClose={() => dispatch(openDrawer(false))}
                >
                  <Sidebar
                    headerMenu={headerMenu}
                    setViewALl={setViewALl}
                    viewALl={viewALl}
                  />
                </Drawer>
              )}
              <Box
                className={`transition-all min-h-[100vh] ${
                  themeColor === "dark" ? "darkMode" : ""
                }`}
                sx={{
                  pl: isMd ? (viewALl ? "15.75rem" : "4rem") : 0,
                  bgcolor: "background.default",
                }}
              >
                {children}
              </Box>
            </>
          )}
        </>
      )}
      <Modal
        open={open}
        close={() => {
          setopen(false);
        }}
        title={`${notif.title}`}
      >
        <div className="flex flex-col justify-center items-center gap-4">
          {" "}
          {notif.galleryId && (
            <img
              src={`${baseUrl}/${DOWNLOAD_FILE}/${notif.galleryId}?size=tiny`}
              width={150}
              height={150}
            />
          )}
          <p>{notif.description}</p>
          <Button
            variant="contained"
            onClick={() => setopen(false)}
            className="mt-5"
          >
            متوجه شدم
          </Button>
        </div>
      </Modal>
    </Box>
  );
};

export default Layout;
