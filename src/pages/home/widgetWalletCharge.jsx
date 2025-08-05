import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
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
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, WidgetWalletCharge } from "../../helpers/api-routes";
import { configReq, toIsoString } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
const WidgetWalletCharges = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [time, setTime] = useState(momentJalaali());
  const [number, setNumber] = useState(0);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    axiosInstance(
      `${baseUrl}/${WidgetWalletCharge}?date=${toIsoString(new Date(time))}`,
      configReq(token)
    )
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
        setLoading(false);
      });
  }, [time]);
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
  return (
    <Paper
      elevation={0}
      className="border rounded px-4 py-6 flex flex-col  gap-3 relative"
      sx={{
        ":hover": {
          ".refreshButton": {
            opacity: "100 !important",
          },
          boxShadow: "0px 0px 11px #8b8b8b4f",
        },
      }}
    >
      <div className="overflow-x-auto w-full">
        <div className="mb-4">
          <div className="text-sm text-center">شارژ کيف پول از درگاه</div>
        </div>
        <div className="min-w-[300px] mt-14 w-full ">
          <TableContainer>
            <Table
              sx={{ minWidth: 300, width: "100%", tableLayout: "fixed" }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  {[
                    "نام ",
                    " امروز",
                    `${new Date(time).toLocaleDateString("fa")}`,
                  ].map((item) => (
                    <TableCell key={item}>{item}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading ? (
                  <>
                    {data?.map((orderItem, i) => {
                      const { title, today, total } = orderItem;

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
                            {today.toLocaleString("fa-IR")}
                            <small className="mx-1">تومان</small>
                          </TableCell>{" "}
                          <TableCell
                            sx={{
                              color: (theme) =>
                                theme.palette.mode === "light"
                                  ? "#1a63c5"
                                  : "#ff9999",
                            }}
                          >
                            {total.toLocaleString("fa-IR")}
                            <small className="mx-1">تومان</small>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {" "}
                    {Array.from(Array(13).keys()).map((item, i) => (
                      <Fragment key={i + "TableCellLoading"}>
                        <TableRow>
                          <TableCell>
                            <Skeleton />
                          </TableCell>
                          <TableCell>
                            <Skeleton />
                          </TableCell>
                          <TableCell>
                            <Skeleton />
                          </TableCell>{" "}
                        </TableRow>
                      </Fragment>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
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
      <AccountBalanceWalletOutlinedIcon
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
  );
};

export default WidgetWalletCharges;
