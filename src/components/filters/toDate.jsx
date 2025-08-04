import { TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker2";
import momentJalaali from "moment-jalaali";
import { getFilterValueFromUrl } from "../../utils/filterUtils";

const ToDateFilter = ({ changeFilter, item, refresh }) => {
  // Fixed: Use null instead of 0 for empty date values
  const [valueEndDate, setValueEndDate] = useState(null);
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (refresh > 0) {
      setValueEndDate(null);
    }
  }, [refresh]);

  // Load existing filter value from URL
  useEffect(() => {
    const urlValue = getFilterValueFromUrl(item?.name);
    if (urlValue && urlValue !== 'null' && urlValue !== 'undefined') {
      try {
        const dateValue = new Date(urlValue);
        if (!isNaN(dateValue.getTime())) {
          // Convert to moment object for DatePicker
          const momentValue = momentJalaali(dateValue);
          setValueEndDate(momentValue);
        }
      } catch (error) {
        console.warn('Failed to parse date from URL:', urlValue, error);
      }
    }
  }, [item?.name, refresh]); // Added refresh dependency

  const handleDateChange = (momentDate) => {
    // Fixed: Ensure we handle null/undefined values properly
    setValueEndDate(momentDate || null);

    if (momentDate && momentDate !== 0) {
      // Get JavaScript Date from moment object
      const jsDate = momentDate._d || new Date(momentDate);
      // Format date for API
      const formattedDate = formatDateForAPI(jsDate);
      
      changeFilter({
        name: item.name,
        value: formattedDate,
        type: "lte", // Less than or equal for to date
      });
    }
  };

  const formatDateForAPI = (date) => {
    // Fixed: Better null/undefined checking
    if (!date || date === 0 || date === null) return "";
    
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
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds()) +
      dif +
      pad(Math.floor(Math.abs(tzo) / 60)) +
      ":" +
      pad(Math.abs(tzo) % 60)
    );
  };

  return (
    <>
      <DatePicker
        ref={datePickerRef}
        value={valueEndDate || undefined} // Pass undefined instead of null/0 to DatePicker
        onChange={handleDateChange}
        placeholder={item.title || "تا تاریخ"}
        renderInput={(params) => (
          <TextField
            {...params}
            label={item.title || "تا تاریخ"}
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{
              ".MuiFormControl-root": {
                margin: "0px !important",
              },
              ".MuiInputBase-root": {
                padding: "7px 9px !important",
              },
            }}
          />
        )}
        timePicker={false}
        isGregorian={false}
      />
    </>
  );
};

export default React.memo(ToDateFilter);
