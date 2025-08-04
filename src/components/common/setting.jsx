import CancelIcon from "@mui/icons-material/Cancel";
import React from "react";
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Slider,
} from "@mui/material";
import { Box } from "@mui/system";
import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { themeColor } from "../../redux/slices/theme";
import axiosInstance from "../dataFetch/axiosInstance";
import { baseUrl, REMOVE_STATIC_DATA_CACHE } from "../../helpers/api-routes";
import { toast } from "react-toastify";
import { configReq } from "../../helpers/functions";

const Settings = ({ onClose }) => {
  const [value, setValue] = useState(13);
  const [pageType, setpageType] = useState(2);
  const dispatch = useDispatch();
  const { themeColor: themes } = useSelector((state) => state.themeColor);
  var dark = themes === "dark";
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSelector((state) => state.user);

  const handleChange = (event, newValue) => {
    localStorage.setItem("fontSize", newValue);
    document.documentElement.style.fontSize = `${Number(newValue)}px`;
    setValue(newValue);
  };
  const handleChange2 = (value) => {
    localStorage.setItem("fontSize", value);
    document.documentElement.style.fontSize = `${Number(value)}px`;
    setValue(value);
  };
  useLayoutEffect(() => {
    if (localStorage.getItem("fontSize")) {
      setValue(Number(localStorage.getItem("fontSize")));
    }
    if (localStorage.getItem("pageType")) {
      setpageType(Number(localStorage.getItem("pageType")));
    }
  }, []);
  const handleClearCache = () => {
    setIsLoading(true);
    axiosInstance
      .get(`${baseUrl}/${REMOVE_STATIC_DATA_CACHE}`, configReq(token))
      .then((res) => {
        setIsLoading(false);
        toast.success("کش پاک شد");
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };
  return (
    <Box
      sx={{
        background: (theme) =>
          theme.palette.mode === "dark" ? "#626262" : "rgb(248 250 252)",
      }}
      className={`flex flex-col md:w-[22rem] min-h-full justify-between `}
    >
      <div className="h-[5rem] flex justify-between items-center border-b pr-8 pl-6 ">
        <Box
          component={"h5"}
          sx={{
            color: (theme) =>
              theme.palette.mode === "dark" ? "#ccc" : "#495057",
          }}
          className=" text-[1.01563rem] font-bold"
        >
          تنظیمات
        </Box>{" "}
        <IconButton onClick={() => onClose()}>
          <CancelIcon
            sx={{
              color: (theme) =>
                theme.palette.mode === "dark" ? "#ccc" : "#495057",
              fontSize: "1.5rem !important ",
            }}
          />
        </IconButton>
      </div>
      <div className="flex flex-col px-8 mt-9 h-full ">
        <div className="flex gap-2 items-center flex-col">
          <span className="text-sm font-bold">سایز کلی نوشته ها </span>
          <div className="w-full">
            <Slider
              sx={{
                mt: 2,
                ".MuiSlider-thumb": {
                  background: "#fff !important",
                  border: "4px solid currentColor !important",
                  width: "25px  !important",
                  height: "25px  !important",
                  transform: "translate(0%, -50%) !important",
                },
              }}
              aria-label="Temperature"
              value={value}
              onChange={handleChange}
              valueLabelDisplay="auto"
              step={1}
              min={10}
              max={20}
            />
            {/*  <NumberInput value={value} onChange={handleChange2} min={10} max={20} /> */}
          </div>
        </div>
        <div className="flex gap-6 items-center flex-col border-t mt-5 pt-5">
          <span className="text-sm font-bold"> نمایش صفحه بندی table : </span>
          <div>
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
                row
              >
                <FormControlLabel
                  onChange={(e) => {
                    setpageType(1);
                    localStorage.setItem("pageType", 1);
                  }}
                  control={<Radio checked={pageType === 1} />}
                  label="اسکرول بینهایت"
                />
                <FormControlLabel
                  onChange={(e) => {
                    setpageType(2);
                    localStorage.setItem("pageType", 2);
                  }}
                  control={<Radio checked={pageType === 2} />}
                  label="پیجینیشن دار"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <div className="flex gap-6 items-center flex-col border-t mt-5 pt-5">
          <span className="text-sm font-bold"> تم داشبورد </span>
          <div className="flex  gap-2">
            <div
              onClick={() => dispatch(themeColor("light"))}
              className="w-36 h-[3.07rem] rounded-[50px] flex justify-center items-center cursor-pointer text-[#0d0c0c] bg-[#fff] border"
            >
              تم لایت
            </div>
            <div
              onClick={() => dispatch(themeColor("dark"))}
              className="w-36 h-[3.07rem] rounded-[50px] flex justify-center items-center cursor-pointer bg-[#1b1c30] text-white border border-white"
            >
              تم دارک
            </div>
          </div>
        </div>
        <Button
          size="small"
          variant="outlined"
          color="info"
          className="!rounded-xl"
          onClick={handleClearCache}
          disabled={isLoading}
          sx={{mt:3}}
        >
          {isLoading ? "پاکسازی کش..." : "پاکسازی کش"}
        </Button>
    
      </div>
  
    </Box>
  );
};

export default Settings;
