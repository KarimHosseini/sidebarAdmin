import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton, Paper } from "@mui/material";
import momentJalaali from "moment-jalaali";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, WidgetFacilityWalletsAmount } from "../../helpers/api-routes";
import { configReq, toIsoString } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
const WidgetFacility = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();
  const [time, setTime] = useState(momentJalaali());
  const [number, setNumber] = useState(0);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [noData, setnoData] = useState(false);
  useEffect(() => {
    setLoading(true);
    axiosInstance(
      `${baseUrl}/${WidgetFacilityWalletsAmount}?date=${toIsoString(
        new Date(time)
      )}`,
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
      <div className=" w-full">
        <div className="mb-7">
          <div className="text-sm text-center">
            {" "}
            گزارش کیف پول تهسیلاتی کلی{" "}
          </div>
          <div className="text-xs text-center mt-3">
            {new Date(time).toLocaleDateString("fa")}
          </div>
        </div>
        <div className=" w-full ">
          <div className="grid md:grid-cols-5 gap-3 grid-cols-2">
            {data.map((item, index) => (
              <div
                className={`flex flex-col gap-2 items-center justify-center ${
                  index < 5 ? "" : "md:border-t pt-3"
                }  ${index % 5 === 0 ? "" : "border-r"} `}
                key={index}
              >
                <span className="text-base font-bold">
                  {item.facilityParentName}
                </span>
                <span className="text-xs ">({item.facilityName})</span>

                <span className="text-lg font-bold">
                  {item.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
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

export default WidgetFacility;
