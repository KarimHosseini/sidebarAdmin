import { TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import DatePicker from "react-datepicker2";
import { getFilterValueFromUrl } from "../../utils/filterUtils";

const DateFilter = ({ changeFilter, item, refresh }) => {
  const [valueStatDate, setValueStatDate] = useState(0);
  const [valueEndDate, setValueEndDate] = useState(0);
  const [startTime, setstartTime] = useState();
  const [endTime, setendTime] = useState();
  const startTimeCalender = useRef();
  const endTimeCalender = useRef();

  useEffect(() => {
    if (refresh > 0) {
      setendTime();
      setstartTime();
      setValueEndDate(0);
      setValueStatDate(0);
    }
  }, [refresh]);

  // Load existing filter values from URL
  useEffect(() => {
    if (!item?.name) return;
    
    // Check for both from and to date values
    const fromDateValue = getFilterValueFromUrl(`${item.name}From`);
    const toDateValue = getFilterValueFromUrl(`${item.name}To`);
    
    if (fromDateValue && fromDateValue !== 'null' && fromDateValue !== 'undefined') {
      try {
        const dateValue = new Date(fromDateValue.replace(/"/g, ''));
        if (!isNaN(dateValue.getTime())) {
          setValueStatDate(dateValue.toLocaleDateString("fa"));
          // You might need to set the picker value here too
        }
      } catch (error) {
        console.warn('Failed to parse from date from URL:', fromDateValue, error);
      }
    }
    
    if (toDateValue && toDateValue !== 'null' && toDateValue !== 'undefined') {
      try {
        const dateValue = new Date(toDateValue.replace(/"/g, ''));
        if (!isNaN(dateValue.getTime())) {
          setValueEndDate(dateValue.toLocaleDateString("fa"));
          // You might need to set the picker value here too
        }
      } catch (error) {
        console.warn('Failed to parse to date from URL:', toDateValue, error);
      }
    }
  }, [item?.name]);

  return (
    <>
      <div className="relative  w-full">
        <DatePicker
          timePicker={false}
          value={startTime}
          isGregorian={false}
          ref={startTimeCalender}
          onChange={(value) => {
            if (value) {
              setstartTime(value);
              changeFilter({
                name: `${item.name}From`,
                value: `"${toIsoString(new Date(value._d))}"`,
                type: "ge",
                isDate: true,
                date: value._d,
              });

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
      <div className="relative  w-full">
        <DatePicker
          timePicker={false}
          value={endTime}
          isGregorian={false}
          ref={endTimeCalender}
          onChange={(value) => {
            if (value) {
              setendTime(value);
              changeFilter({
                name: `${item.name}To`,
                value: `"${toIsoString2(new Date(value._d))}"`,
                type: "le",
                isDate: true,
                date: value._d,
              });
              setValueEndDate(value._d.toLocaleDateString("fa"));
            }
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
    </>
  );
};

export default React.memo(DateFilter);

function toIsoString(date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      return (num < 10 ? "0" : "") + num;
    };
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    "00" +
    ":" +
    "00" +
    ":" +
    "00"
  );
}

function toIsoString2(date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      return (num < 10 ? "0" : "") + num;
    };
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    "23" +
    ":" +
    "59" +
    ":" +
    "59"
  );
}
