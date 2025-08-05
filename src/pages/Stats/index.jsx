/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Paper,
} from "@mui/material";
import TextField from "@mui/material/TextField";
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
import momentJalaali from "moment-jalaali";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker2";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dropdown, PageTitle } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import NoAccess from "../../components/noAccess";
import { baseUrl, BRANDS, Chart1 } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { setBrands } from "../../redux/slices/relationals";
import { logout } from "../../redux/slices/user";
import Charts from "./charts";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

defaults.font.family = "IRANSansfa";
const States = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const { brands } = useSelector((state) => state.relationals);

  const { userPermissions } = useSelector((state) => state.relationals);
  const [search, setsearch] = useState("");

  const [applySearch, setApplySearch] = useState("");
  const [reset, setreset] = useState(false);
  const [label, setLabels] = useState([]);
  const [valueStatDate, setValueStatDate] = useState(0);
  const [valueEndDate, setValueEndDate] = useState(0);
  const [startTime, setstartTime] = useState();
  const [endTime, setendTime] = useState(momentJalaali());
  const startTimeCalender = useRef();
  const endTimeCalender = useRef();
  const [brandFilter, setBrandFilter] = useState("");

  useEffect(() => {
    axiosInstance(
      `${baseUrl}/${BRANDS}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        if (data.code === 200) {
          dispatch(setBrands(data.data));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  }, []);
  useEffect(() => {
    getReports("");
  }, [token]);
  const getReports = (urls) => {
    setLoading(true);

    axiosInstance(`${baseUrl}/${Chart1}?${urls}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);

        setNotifications(data.data);
        var temp = [];
        data.data.map((item) => {
          temp.push(item.title);
        });
        setLabels(temp);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
    setreset(false);
  };
  useEffect(() => {
    const params = new URLSearchParams();
    brandFilter !== "" &&
      brandFilter.id &&
      brandFilter.id &&
      params.append("brand", brandFilter.id);

    endTime && params.append("toDate", new Date(endTime._d).toISOString());
    startTime &&
      params.append("fromDate", new Date(startTime._d).toISOString());
    applySearch && params.append("search", applySearch);
    getReports(params);
  }, [applySearch, brandFilter, endTime, startTime]);
  const resetFilter = () => {
    setValueStatDate();
    setValueEndDate();
    setBrandFilter("");
    setsearch("");
    setApplySearch("");
    setendTime(momentJalaali());
    setstartTime();
  };
  if (!userPermissions?.Chart1?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: " گزارشات",
            path: "/reports",
          },
        ]}
        title="  گزارش سفارش بصورت چارت          "
      />
      <div className="px-3  ">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          <Box
            sx={{ label: { marginTop: "0 !important" } }}
            className="grid md:grid-cols-5 py-2  px-9 gap-x-4 gap-y-4 "
          >
            {" "}
            <FormControl variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                جستجو
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                value={search}
                onChange={(e) => setsearch(e.target.value)}
                endAdornment={
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setApplySearch(search)}
                    >
                      جستجو
                    </Button>
                  </>
                }
                label="Password"
              />
            </FormControl>
            <div className="relative">
              <DatePicker
                value={startTime}
                timePicker={false}
                isGregorian={false}
                ref={startTimeCalender}
                onChange={(value) => {
                  if (value) {
                    setstartTime(value);

                    setValueStatDate(value._d.toLocaleDateString("fa"));
                  }
                }}
              />
              <TextField
                onMouseUp={() => startTimeCalender.current?.setOpen(true)}
                InputProps={{
                  inputProps: {
                    style: { textAlign: "right", width: "100%" },
                  },
                }}
                variant="outlined"
                value={valueStatDate ? valueStatDate : ""}
                label={"از تاریخ "}
                autoComplete="off"
                fullWidth
              />
            </div>
            <div className="relative">
              <DatePicker
                value={endTime}
                isGregorian={false}
                timePicker={false}
                ref={endTimeCalender}
                onChange={(value) => {
                  setendTime(value);
                  /*    handleOnchange(
                props.item.name,
                value._d.toLocaleDateString("fa")
              ); */
                  setValueEndDate(value._d.toLocaleDateString("fa"));
                }}
              />
              <TextField
                onMouseUp={() => endTimeCalender.current?.setOpen(true)}
                InputProps={{
                  inputProps: {
                    style: { textAlign: "right", width: "100%" },
                  },
                }}
                variant="outlined"
                value={valueEndDate ? valueEndDate : ""}
                label={"تا تاریخ "}
                autoComplete="off"
                fullWidth
              />
            </div>
            <Dropdown
              title="انتخاب برند"
              data={[{ id: 0, title: "هیچکدام" }, ...brands]}
              value={brandFilter}
              change={setBrandFilter}
            />
            <Button onClick={resetFilter} variant="contained" color="success">
              <RestartAltIcon />
              ریست فیلتر
            </Button>
          </Box>{" "}
        </Paper>
        <div className="">
          {!loading && <Charts labels={label} notifications={notifications} />}
        </div>
      </div>
    </>
  );
};

export default States;
