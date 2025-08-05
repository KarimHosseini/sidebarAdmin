/* eslint-disable react-hooks/exhaustive-deps */
import {
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Slider,
} from "@mui/material";
import { useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PageTitle } from "../../components/common";
import { themeColor } from "../../redux/slices/theme";
const Configs = () => {
  const [value, setValue] = useState(13);
  const [pageType, setpageType] = useState(2);
  const [redirectType, setRedirectType] = useState(1);

  const dispatch = useDispatch();
  const handleChange = (event, newValue) => {
    localStorage.setItem("fontSize", newValue);
    document.documentElement.style.fontSize = `${Number(newValue)}px`;
    setValue(newValue);
  };
  useLayoutEffect(() => {
    if (localStorage.getItem("fontSize")) {
      setValue(Number(localStorage.getItem("fontSize")));
    }
    if (localStorage.getItem("pageType")) {
      setpageType(Number(localStorage.getItem("pageType")));
    }
    if (localStorage.getItem("redirectType")) {
      setRedirectType(Number(localStorage.getItem("redirectType")));
    }
  }, []);
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "   تنظیمات",
            path: "/companyInfo",
          },
        ]}
        title="  تنظیمات پنل ادمین"
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          <div className="flex  flex-col gap-4">
            <div className="flex gap-6 items-center flex-wrap">
              <span className="text-sm font-bold">سایز فونت : </span>
              <div className="w-full md:w-[400px]">
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
              </div>
            </div>
            <div className="flex gap-6 items-center flex-wrap">
              <span className="text-sm font-bold">
                {" "}
                نوع ریداریکت صفحات ویرایش :{" "}
              </span>
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
                        setRedirectType(1);
                        localStorage.setItem("redirectType", 1);
                      }}
                      control={<Radio checked={redirectType === 1} />}
                      label="باز شدن در تب جدید"
                    />
                    <FormControlLabel
                      onChange={(e) => {
                        setRedirectType(2);
                        localStorage.setItem("redirectType", 2);
                      }}
                      control={<Radio checked={redirectType === 2} />}
                      label="باز شدن در همان تب"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>{" "}
            <div className="flex gap-6 items-center flex-wrap">
              <span className="text-sm font-bold">
                {" "}
                نمایش صفحه بندی table :{" "}
              </span>
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
            <div className="flex gap-6 items-center flex-wrap">
              <span className="text-sm font-bold"> تم : </span>
              <div className="flex flex-wrap gap-2">
                <div
                  onClick={() => dispatch(themeColor("light"))}
                  className="w-36 h-[3.07rem] rounded-md flex justify-center items-center cursor-pointer text-[#0d0c0c] bg-[#fff] border"
                >
                  تم لایت
                </div>
                <div
                  onClick={() => dispatch(themeColor("dark"))}
                  className="w-36 h-[3.07rem] rounded-md flex justify-center items-center cursor-pointer bg-[#1d1b20] text-white border border-white"
                >
                  تم دارک
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default Configs;
