import { Paper } from "@mui/material";
import { Box } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import dayjs from "dayjs";
import momentJalaali from "moment-jalaali";
import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "react-datepicker2";

const Step3 = ({
  data,
  durations,
  startTime,
  setstartTime,
  handleChange,
  endTime,
  setendTime,
  handleChangeEnd,
  duration2,
}) => {
  return (
    <>
      <Paper elevation={0} className="p-4 border border-[#dbdfea] w-full mb-4">
        <div className="grid md:grid-cols-4">
          <div className="flex flex-wrap gap-4">
            <span className="text-sm text-[#4960FF]">تاریخ آغاز</span>
            <span>
              {new Intl.DateTimeFormat("fa-IR", {
                dateStyle: "full",
                timeStyle: "medium",
              }).format(data?.fromDate ? new Date(data?.fromDate) : new Date())}
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            <span className="text-sm text-[#4960FF]"> تاریخ پایان </span>
            <span>
              {new Intl.DateTimeFormat("fa-IR", {
                dateStyle: "full",
                timeStyle: "medium",
              }).format(data?.toDate ? new Date(data?.toDate) : new Date())}
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            <span className="text-sm text-[#4960FF]">مدت زمان اجرا</span>
            <span>{durations}</span>
          </div>
          {duration2 && (
            <div className="flex flex-wrap gap-4">
              <span className="text-sm text-[#4960FF]">
                {" "}
                زمان باقی مانده تا پایان{" "}
              </span>
              <span>{duration2}</span>
            </div>
          )}
        </div>
      </Paper>
      <Paper
        elevation={0}
        className="p-4 border border-[#dbdfea] w-full"
        sx={{
          ".calendarContainer": {
            margin: "0px !important",
            boxShadow: "none !important",
          },
        }}
      >
        <div className="grid md:grid-cols-2">
          <div className="ml-2 border-l-2 pl-2 border-dashed  gap-3">
            <div className="w-full mb-3">
              <span className="text-sm font-semibold">
                شروع تاریخ اعمال تخفیف
              </span>
            </div>
            <div className="flex">
              {" "}
              <Calendar
                value={startTime}
                isGregorian={false}
                min={momentJalaali().add(-1, "days")}
                onChange={(value) => {
                  setstartTime(value);
                }}
              />{" "}
              <Box sx={style}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoItem label="">
                    <StaticTimePicker
                      localeText={{ toolbarTitle: "انتخاب ساعت" }}
                      defaultValue={dayjs("2022-04-00T00:00")}
                      value={dayjs(data?.fromDate)}
                      ampm={false}
                      ampmInClock={true}
                      onChange={handleChange}
                    />
                  </DemoItem>
                </LocalizationProvider>
              </Box>
            </div>
          </div>{" "}
          <div className="ml-2 pl-2 border-dashed  gap-3">
            <div className="w-full mb-3">
              <span className="text-sm font-semibold">
                پایان تاریخ اعمال تخفیف
              </span>
            </div>
            <div className="flex">
              <Calendar
                value={endTime}
                isGregorian={false}
                min={momentJalaali().add(-1, "days")}
                onChange={(value) => {
                  setendTime(value);
                }}
              />{" "}
              <Box sx={style}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoItem label="">
                    <StaticTimePicker
                      localeText={{ toolbarTitle: "انتخاب ساعت" }}
                      defaultValue={dayjs("2022-04-00T00:00")}
                      value={dayjs(data?.toDate)}
                      ampm={false}
                      ampmInClock={true}
                      onChange={handleChangeEnd}
                    />
                  </DemoItem>
                </LocalizationProvider>
              </Box>{" "}
            </div>
          </div>
        </div>
      </Paper>
    </>
  );
};

export default Step3;
const style = {
  ".MuiPickersToolbar-root ": {
    display: "flex !important",
    flexDirection: "row !important",
    alignItems: "flex-end",
    gap: "10px !important",
  },
  ".MuiTimePickerToolbar-hourMinuteLabel": {
    flexDirection: "row-reverse !important",
    fontSize: "13px !important",
  },
  ".MuiTimePickerToolbar-hourMinuteLabel .MuiTypography-root ": {
    fontSize: "15px !important",
  },
  ".MuiPickersArrowSwitcher-root": {
    flexDirection: "row-reverse !important",
    right: "44% !important",
    transform: "translateX(-50%)",
  },
  ".MuiPickersArrowSwitcher-root svg": {
    width: "1.5rem !important",
    height: "1.5rem !important",
  },
  ".MuiDialogActions-root ": {
    display: "none !important",
  },
  ".MuiClock-root": {
    margin: "50px 0px 10px 0px !important",
    justifyContent: "start !important",
    width: "fit-content !important",
  },
  ".MuiTimeClock-root": {
    width: "fit-content !important",
  },
  ".MuiPickersLayout-root ": {
    minWidth: "auto !important",
  },
};
