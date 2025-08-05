import { Box, IconButton, Paper, Skeleton } from "@mui/material";
import momentJalaali from "moment-jalaali";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, WidgetDailySale } from "../../helpers/api-routes";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { configReq, toIsoString } from "../../helpers/functions";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/user";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
const WidgetDailySales = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [time, setTime] = useState(momentJalaali());
  const [number, setNumber] = useState(0);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    axiosInstance(
      `${baseUrl}/${WidgetDailySale}?date=${toIsoString(new Date(time))}`,
      configReq(token)
    )
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
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
    <>
      <Paper
        elevation={0}
        className="border rounded px-4 py-6 flex flex-col  items-center gap-3 relative w-full"
        sx={{ 
          ":hover": {
            ".refreshButton": {
              opacity: "100 !important",
            },
            boxShadow: "0px 0px 11px #8b8b8b4f",
          },
        }}
       
      >
        <span className="text-sm">فروش روزانه</span>
        <span className="text-xs">
          {new Date(time).toLocaleDateString("fa")}
        </span>
        {loading ? (
          <>
            <Skeleton width={50} />
          </>
        ) : (
          <>
            <Paper
              elevation={0}
              sx={{
                padding: "3px 10px",
                borderRadius: "5px",
                border: "1px solid #d6d6d6",
                
              }}
            >
              <Box
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "light" ? "#1a63c5" : "#ff9999",
                }}
                className="text-lg font-bold"
              >
                {data?.dailySale?.toLocaleString("fa-IR")} تومان
              </Box>
            </Paper>
          </>
        )}

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
            transition:"opacity 400ms"
          }}
          className="refreshButton "
          onClick={() => {
            setNumber(0);
            setTime(momentJalaali());
          }}
        >
          <RefreshIcon />
        </IconButton>
        <SellOutlinedIcon
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
    </>
  );
};

export default WidgetDailySales;
