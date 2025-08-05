import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton, Paper, Skeleton } from "@mui/material";
import {
  ArcElement,
  Chart as ChartJS,
  defaults,
  Legend,
  Tooltip,
} from "chart.js";
import momentJalaali from "moment-jalaali";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, WidgetDailySaleByBrand } from "../../helpers/api-routes";
import { configReq, toIsoString } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
ChartJS.register(ArcElement, Tooltip, Legend);

defaults.font.family = "IRANSansfa";

const WidgetDailySaleByBrands = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();
  const [time, setTime] = useState(momentJalaali());
  const [number, setNumber] = useState(0);
  const [label, setLabels] = useState([]);
  const [numberOfSale, setnumberOfSales] = useState([1]);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { themeColor } = useSelector((state) => state.themeColor);
  var dark = themeColor === "dark";
  useEffect(() => {
    setLoading(true);
    axiosInstance(
      `${baseUrl}/${WidgetDailySaleByBrand}?date=${toIsoString(
        new Date(time)
      )}`,
      configReq(token)
    )
      .then((res) => {
        setData(res.data.data);
        var temp = [];
        var temp2 = [];
        res.data.data.map((item) => {
          temp.push(item.brand);
          temp2.push(item.sale);
        });
        setLabels(temp);
        setnumberOfSales(temp2);
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
  var donutOptions = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          boxWidth: 10,
        },
      },
    },
  };
  const dataChart = {
    labels: label,
    datasets: [
      {
        label: " مبلغ فروش ",
        data: numberOfSale,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Paper
      className="border rounded px-4 py-6 flex flex-col items-center gap-3 relative h-full"
      elevation={0}
      sx={{
        ":hover": {
          ".refreshButton": {
            opacity: "100 !important",
          },
          boxShadow: "0px 0px 11px #8b8b8b4f",
        },
      }}
    >
      <span className="text-sm"> فروش روزانه به تفکيک برند </span>
      <span className="text-xs">{new Date(time).toLocaleDateString("fa")}</span>
  {/*     {loading ? (
        <Skeleton variant="circular" width={250} height={250} />
      ) : (
        <>
          {data?.length > 0 ? (
            <div className="max-h-[250px]">
              <Pie options={donutOptions} data={dataChart} />
            </div>
          ) : (
            <div className="h-[250px] flex flex-col justify pt-7 items-center ">
              {dark ? (
                <img
                  style={{ width: "100%", maxWidth: "250px" }}
                  src="/images/brand-no-record-dark.svg"
                  alt=""
                />
              ) : (
                <img
                  style={{ width: "100%", maxWidth: "250px" }}
                  src="/images/brand-no-record.svg"
                  alt=""
                />
              )}
            </div>
          )}
        </>
      )} */}
     <>
          {data?.length > 0 ? (
            <div className="max-h-[250px]">
              <Pie options={donutOptions} data={dataChart} />
            </div>
          ) : (
            <div className="h-[250px] flex flex-col justify pt-7 items-center ">
              {dark ? (
                <img
                  style={{ width: "100%", maxWidth: "250px" }}
                  src="/images/brand-no-record-dark.svg"
                  alt=""
                />
              ) : (
                <img
                  style={{ width: "100%", maxWidth: "250px" }}
                  src="/images/brand-no-record.svg"
                  alt=""
                />
              )}
            </div>
          )}
        </>
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
      <CategoryOutlinedIcon
        sx={{
          position: "absolute",
          top: "30px",
          left: "45px",
          transform: "translateY(-50%)",
          color: "#d0d0ff",
          /*  background: "#fff", */
          borderRadius: "3px",
          fontSize: "2rem",
          padding: "1px",
        }}
      />
    </Paper>
  );
};

export default WidgetDailySaleByBrands;
