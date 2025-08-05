import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LocationSearchingOutlinedIcon from "@mui/icons-material/LocationSearchingOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import momentJalaali from "moment-jalaali";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  ALL_PROVINCES,
  baseUrl,
  WidgetSaleByRegion,
} from "../../helpers/api-routes";
import { configReq, toIsoString, toIsoString2 } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
import InteractiveIranMap from "./map";
import { iransStatesProperties } from "./map/constants/iransStates";
const WidgetSaleByRegions = () => {
  const [data, setData] = useState();
  const [province, setProvince] = useState([]);
  const [loading, setLoading] = useState();
  const [time, setTime] = useState(momentJalaali());
  const [number, setNumber] = useState(0);
  const [selected, setSelected] = useState("tehran");
  const [selectedname, setSelectedname] = useState("تهران");
  const [provinceId, setProvinceId] = useState(1);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [regions, setRegions] = useState([]);
  useEffect(() => {
    setLoading(true);

    axiosInstance(
      `${baseUrl}/${WidgetSaleByRegion}?fromDate=${toIsoString(
        new Date(time)
      )}&toDate=${toIsoString2(new Date(time))}&provinceId=${provinceId}`,
      configReq(token)
    )
      .then((res) => {
        setRegions(res.data.data?.regions);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
        setLoading(false);
      });
  }, [time, provinceId]);
  useEffect(() => {
    axiosInstance(`${baseUrl}/${ALL_PROVINCES}`)
      .then((res) => {
        setProvince(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);
  const changeData = (data) => {
    if (data === "up") {
      if (number === -1) {
        setTime(momentJalaali());
      } else {
        setTime(momentJalaali().add(number + 1, "days"));
      }
      setNumber((number) => number + 1);
    } else {
      if (number === 1) {
        setTime(momentJalaali());
      } else {
        setTime(momentJalaali().add(number - 1, "days"));
      }
      setNumber((number) => number - 1);
    }
  };
  useEffect(() => {
    var sp = iransStatesProperties.find(
      (item) => item.name === selected?.selectedArea
    );
    if (sp) {
      var pi = province?.find((i) => i.title === sp.persianName);
      if (pi) {
        setProvinceId(pi.id);
        setSelectedname(pi.title);
      }
    } else if (selected.selectedArea === "khalijefars") {
      var pi1 = province?.find((i) => i.title === "هرمزگان");
      if (pi1) {
        setProvinceId(pi1.id);
        setSelectedname(pi1.title);
      }
    }
  }, [selected]);
  return (
    <>
      <Paper
        elevation={0}
        className="border rounded px-4 py-6 flex flex-col  gap-3 relative w-full h-full"
        sx={{
          ":hover": {
            ".refreshButton": {
              opacity: "100 !important",
            },
            boxShadow: "0px 0px 11px #8b8b8b4f",
          },
        }}
      >
        <div className="text-sm text-center"> فروش منطقه اي</div>
        <div className="text-xs text-center mt-1">
          {new Date(time).toLocaleDateString("fa")}
        </div>
        <InteractiveIranMap reg={regions} setSelected={setSelected} />
        {/*    <div className="flex w-full gap-8 py-4">
          <span className="text-sm smalllerText"> استان {selectedname}</span>
          <div className="flex  gap-8">
            <div className="flex items-center gap-2">
              <span className="text-sm smalllerText">تعداد سفارش : </span>
              <Box
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "light" ? "#1a63c5" : "#ff9999",
                }}
                className="text-sm smalllerText"
              >
                {loading ? <Skeleton width={30} /> : <> {regions?.count || 0}</>}
              </Box>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm smalllerText"> مبلغ فروش کل : </span>
              <Box
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "light" ? "#1a63c5" : "#ff9999",
                }}
                className="text-sm smalllerText"
              >
                {loading ? (
                  <Skeleton width={30} />
                ) : (
                  <>
                    {" "}
                    {regions?.sale ? (
                      <> {regions?.sale?.toLocaleString("fa-IR")} تومان</>
                    ) : (
                      <>0</>
                    )}
                  </>
                )}
              </Box>
            </div>
          </div>
        </div> */}
        <div className="md:overflow-y-auto md:overflow-x-hidden overflow-x-scroll w-full">
          <TableContainer
            sx={{
              maxHeight: { md: "250px" },
              overflowX: { md: "hidden", xs: "scroll" },
            }}
          >
            <Table
              sx={{ minWidth: 580, width: "100%" }}
              aria-label="simple table"
              className="md:overflow-x-hidden "
            >
              <TableHead>
                <TableRow>
                  {["استان  ", "تعداد فروش ", " مبلغ "].map((item, index) => (
                    <TableCell key={item + index + "n"}>{item}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading ? (
                  <>
                    {regions?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9}>
                          <div className="text-xs text-center">
                            رکوردی یافت نشد
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {regions?.map((orderItem, i) => {
                          const {
                            title,

                            count,
                            sale,
                          } = orderItem;
                          return (
                            <TableRow key={i}>
                              <TableCell
                                sx={{
                                  color: (theme) =>
                                    theme.palette.mode === "light"
                                      ? "#1a63c5"
                                      : "#ff9999",
                                }}
                              >
                                {title}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: (theme) =>
                                    theme.palette.mode === "light"
                                      ? "#1a63c5"
                                      : "#ff9999",
                                }}
                              >
                                {count}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: (theme) =>
                                    theme.palette.mode === "light"
                                      ? "#1a63c5"
                                      : "#ff9999",
                                }}
                              >
                                {sale && (
                                  <> {sale?.toLocaleString("fa-IR")} تومان</>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </>
                    )}
                  </>
                ) : (
                  <TableRow>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <IconButton
          sx={{
            position: "absolute",
            top: "30px",
            left: "5px",
            transform: "translateY(-50%)",
          }}
          onClick={() => changeData("down")}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
        <IconButton
          sx={{
            position: "absolute",
            top: "30px",
            right: "5px",
            transform: "translateY(-50%)",
          }}
          onClick={() => changeData("up")}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <IconButton
          sx={{
            position: "absolute",
            top: "30px",
            right: "35px",
            transform: "translateY(-50%)",
            color: "#b9b9b9",
            opacity: { md: "0", xs: "100" },
            transition: "opacity 400ms",
          }}
          className="refreshButton "
          onClick={() => {
            setNumber(0);
            setTime(momentJalaali());
          }}
        >
          <RefreshIcon />
        </IconButton>
        <LocationSearchingOutlinedIcon
          sx={{
            position: "absolute",
            top: "30px",
            left: "45px",
            transform: "translateY(-50%)",
            color: "#d0d0ff",
            /*      background: "#fff", */
            borderRadius: "3px",
            fontSize: "2rem",
            padding: "1px",
          }}
        />
      </Paper>
    </>
  );
};

export default WidgetSaleByRegions;
