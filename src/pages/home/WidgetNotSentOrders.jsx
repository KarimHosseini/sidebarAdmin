import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Button,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import momentJalaali from "moment-jalaali";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, WidgetNotSentOrders } from "../../helpers/api-routes";
import { configReq, toIsoString } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

const WidgetNotSentOrder = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [time, setTime] = useState(momentJalaali());
  const [number, setNumber] = useState(0);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    axiosInstance(
      `${baseUrl}/${WidgetNotSentOrders}?date=${toIsoString(new Date(time))}`,
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
      className="border rounded px-4 py-6 flex flex-col justify- items- gap-3 relative"
      sx={{
        ":hover": {
          ".refreshButton": {
            opacity: "100 !important",
          },
          boxShadow: "0px 0px 11px #8b8b8b4f",
        },
      }}
      /*      sx={{background:theme => theme.palette.mode === "light" ? "#fff9d9" : ""}} */
    >
      <div className="overflow-x-auto w-full">
        <div className="mb-7">
          <div className="text-sm text-center"> سفارشات ارسال نشده</div>
          <div className="text-xs text-center mt-3">
            {new Date(time).toLocaleDateString("fa")}
          </div>
        </div>
        <div className=" overflow-auto">
          <TableContainer sx={{ maxHeight: "235px" }}>
            <Table
              className="overflow-hidden"
              sx={{ width: "100%" }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  {["شماره سفارش ", "نوع حمل و نقل ", "  تعداد"].map((item) => (
                    <TableCell key={item}>{item}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading ? (
                  <>
                    {data?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <div className="text-xs text-center ">
                            رکوردی یافت نشد
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {data?.map((orderItem, i) => {
                          const { id, title, count } = orderItem;

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
                                <Link target={"_blank"} to={`/order/${id}`}>
                                  <Typography
                                    sx={{
                                      textAlign: "center",

                                      background: (theme) =>
                                        theme.palette.mode === "light"
                                          ? "#fdf2f2"
                                          : "#47402b",
                                      width: "80%",

                                      cursor: "pointer",
                                      fontSize: "0.77rem",
                                      fontWeight: "400 !important",
                                      "&:hover": {
                                        background: (theme) =>
                                          theme.palette.mode === "light"
                                            ? "rgb(253 224 71)"
                                            : "#A75707",
                                      },
                                    }}
                                    /*    component="mark" */
                                    variant="body2"
                                    className=" rounded-md"
                                  >
                                    {id}
                                  </Typography>
                                </Link>
                              </TableCell>
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
                            </TableRow>
                          );
                        })}
                        <TableRow>
                          {data?.length > 3 ? (
                            <TableCell colSpan={3}>
                              <Link to="/reportShipment">
                                <Button
                                  fullWidth
                                  sx={{ my: "2px" }}
                                  variant="outlined"
                                >
                                  مشاهده همه
                                </Button>
                              </Link>
                            </TableCell>
                          ) : (
                            <></>
                          )}
                        </TableRow>
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
      <LocalShippingOutlinedIcon
        sx={{
          position: "absolute",
          top: "30px",
          left: "45px",
          transform: "translateY(-50%)",
          color: "#d0d0ff",
          /*    background: "#fff", */
          borderRadius: "3px",
          fontSize: "2rem",
          padding: "1px",
        }}
      />
    </Paper>
  );
};

export default WidgetNotSentOrder;
