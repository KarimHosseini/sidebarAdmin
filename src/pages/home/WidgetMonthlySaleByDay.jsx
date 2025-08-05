import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, IconButton, Paper, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, WidgetMonthlySaleByDay } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);
const WidgetTopProduct = () => {
  var d = new Intl.DateTimeFormat("en-US-u-ca-persian").format(new Date());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();
  const [labels, setLabels] = useState([]);
  const [years, setyears] = useState(Number(d.split("/")[2].slice(0, 4)));
  const [time, setTime] = useState(Number(d.split("/")[0]));
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { themeColor } = useSelector((state) => state.themeColor);
  var dark = themeColor === "dark";
  useEffect(() => {
    setLoading(true);
    axiosInstance(
      `${baseUrl}/${WidgetMonthlySaleByDay}?year=${years}&month=${time}`,
      configReq(token)
    )
      .then((res) => {
        setLoading(false);
        var temp = [];
        res.data.data.map((item, index) => {
          temp.push(item.day);
        });
        setData(res.data.data);
        setLabels(temp);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
        setLoading(false);
      });
  }, [time]);
  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: dark ? "#fff" : "#000",
        },
      },
      title: {
        display: true,
        text: `   ${months[time - 1]} ماه ${years}`,
        color: dark ? "#fff" : "#000",
      },
    },
    scales: {
      x: {
        ticks: {
          color: dark ? "#fff" : "#000",
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        ticks: {
          beginAtZero: true,
          precision: 0,
          color: dark ? "#fff" : "#000",
        },
      },
      y1: {
        type: "linear",
        display: false,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };
  const datas = {
    labels,
    datasets: [
      {
        fill: true,
        label: "تعداد فروش",
        data: data.map((item) => item.count),
        borderColor: "rgb(153 21 217)",
        backgroundColor: "rgb(188 86 238)",
        yAxisID: "y",
      },
    ],
  };

  const changeData = (data) => {
    if (time === 12) {
      if (data === "up") {
        setTime(1);
        setyears((years) => years + 1);
      } else {
        setTime((time) => time - 1);
      }
    } else if (time === 1) {
      if (data === "up") {
        setTime((time) => time + 1);
      } else {
        setTime(12);
        setyears((years) => years - 1);
      }
    } else {
      if (data === "up") {
        setTime((time) => time + 1);
      } else {
        setTime((time) => time - 1);
      }
    }
  };
  return (
    <Box
      className="overflow-x-auto  h-full"
      sx={{
        ":hover": {
          boxShadow: "0px 0px 11px #8b8b8b4f",
        },
      }}
    >
      <Paper
        className="border rounded px-4 py-6 flex flex-col justify-center items-center gap-3 relative w-full   h-full"
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
        <span className="text-sm"> گزارش فروش ماهانه </span>
        {loading ? (
          <Skeleton width={"100%"} height={200} />
        ) : (
          <>
            {data?.length > 0 ? (
              <>
                <div className=" w-full">
                  <Line options={options} data={datas} />
                </div>
              </>
            ) : (
              <div className=" flex flex-col justify pt-3 gap-4 items-center ">
                <span className="text-sm font-semibold">
                  ماه {months[time - 1]} {years}
                </span>
                <span className="text-xs">رکوردی یافت نشد</span>
              </div>
            )}
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
            transition: "opacity 400ms",
          }}
          className="refreshButton "
          onClick={() => {
            setyears(Number(d.split("/")[2].slice(0, 4)));
            setTime(Number(d.split("/")[0]));
          }}
        >
          <RefreshIcon />
        </IconButton>
        <AssessmentOutlinedIcon
          sx={{
            position: "absolute",
            top: "30px",
            left: "45px",
            transform: "translateY(-50%)",
            color: "#d0d0ff",
            /*   background: "#fff", */
            borderRadius: "3px",
            fontSize: "2rem",
            padding: "1px",
          }}
        />
      </Paper>
    </Box>
  );
};

export default WidgetTopProduct;
const months = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];
