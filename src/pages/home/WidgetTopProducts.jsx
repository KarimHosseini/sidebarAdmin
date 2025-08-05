import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, IconButton, Paper, Skeleton, useMediaQuery } from "@mui/material";
import WidgetMenu from './components/WidgetMenu';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  defaults,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";

import SwitchAccessShortcutAddOutlinedIcon from "@mui/icons-material/SwitchAccessShortcutAddOutlined";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, WidgetTopProducts } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

defaults.font.family = "IRANSansfa";
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
  const isMd = useMediaQuery("(min-width:780px)");
  var dark = themeColor === "dark";
  useEffect(() => {
    setLoading(true);
    axiosInstance(
      `${baseUrl}/${WidgetTopProducts}?year=${years}&month=${time}`,
      configReq(token)
    )
      .then((res) => {
        setLoading(false);
        var temp = [];
        var temp2 = [];
        res.data.data.map((item, index) => {
          temp.push(item.title);
          temp2.push(item.count);
        });
        setData(temp2);
        setLabels(temp);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
        setLoading(false);
      });
  }, [time]);
  const datas = {
    labels,

    datasets: [
      {
        fill: false,
        label: " تعداد سفارش ها",
        data: data.map((i, index) => i),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        color: dark ? "#fff" : "#000",
        FontFace: "IRANSansfa",
        axis: "y",
        borderWidth: 2,
        fontSize: 10,
        space: 3,
      },
    ],
  };
  const options = {
    indexAxis: "y",
    scale: {
      ticks: {
        precision: 0,
        barPercentage: 0.5,
        color: dark ? "#fff" : "#000",
        font: {
          size: 8,
        },
      },
    },
    aspectRatio: data.length > 3 || !isMd ? 2 : 4,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: dark ? "#fff" : "#000",
        },
      },
      title: {
        display: true,
        color: dark ? "#fff" : "#000",
        text: `   ${months[time - 1]} ماه ${years}`,
      },

      titleSpacing: 0,
    },
    scales: {
      xAxes: [
        {
          barThickness: 6, // number (pixels) or 'flex'
          maxBarThickness: 2, // number (pixels)
          barPercentage: 0.5,
        },
      ],
      x: {
        barThickness: 1,
        maxBarThickness: 2,
        ticks: {
          color: dark ? "#fff" : "#000",
          barThickness: 1,
          maxBarThickness: 2,
        },
      },
      y: {
        barThickness: 1,
        maxBarThickness: 2,
        ticks: {
          color: dark ? "#fff" : "#000",
          maxBarThickness: 2,
        },
      },
    },
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
        className="border rounded px-4 py-6  flex flex-col min-w-[500px] md:min-w-[200px] gap-3 relative w-full h-full "
        elevation={0}
        sx={{
          ":hover": {
            ".refreshButton": {
              opacity: "100 !important",
            },
            boxShadow: "0px 0px 11px #8b8b8b4f !important",
          },
        }}
        /*   sx={{background:theme => theme.palette.mode === "light" ? "#ecfaff" : ""}} */
      >
        <div className="text-sm text-center"> محصولات برتر </div>
        {loading ? (
          <Skeleton width={"100%"} height={200} />
        ) : (
          <>
            {data?.length > 0 ? (
              <>
                <div className="md: w-full">
                  <Chart type="bar" options={options} data={datas} />
                </div>
              </>
            ) : (
              <div className="md: flex flex-col justify pt-3 gap-4 items-center ">
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
        <WidgetMenu
          onRefresh={() => {
            setyears(Number(d.split("/")[2].slice(0, 4)));
            setTime(Number(d.split("/")[0]));
          }}
          onExport={() => {
            // Implement export functionality
            console.log('Export top products data');
          }}
          customMenuItems={[
            {
              label: 'نمایش جدول',
              onClick: () => {
                // Toggle between chart and table view
                console.log('Toggle view');
              }
            }
          ]}
        />
        <SwitchAccessShortcutAddOutlinedIcon
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
