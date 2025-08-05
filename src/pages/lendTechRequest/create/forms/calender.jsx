import { Paper } from "@mui/material";
import momentJalaali from "moment-jalaali";
import React, { useEffect, useState } from "react";
import { Calendar } from "react-datepicker2";
import { toIsoString } from "../../../../helpers/functions";

const Calender = ({ item, data, setData }) => {
  const [startTime, setstartTime] = useState();

  const [valueStatDate, setValueStatDate] = useState(0);
  useEffect(() => {
    if (data[item.id] && !startTime) {
      setstartTime(
        momentJalaali(reFormatDate(new Date(data[item.id])), "jYYYY/jM/jD")
      );
    }
  }, [data[item.id]]);
  const reFormatDate = (dates) => {
    let string2 = new Date(dates).toLocaleDateString("en-US-u-ca-persian");
    string2 =
      string2.split("/")[2] +
      "/" +
      string2.split("/")[0] +
      "/" +
      string2.split("/")[1];
    return string2;
  };
  return (
    <Paper
      elevation={0}
      sx={{
        ".calendarContainer": {
          margin: "0px !important",
          boxShadow: "none !important",
          width: { md: "370px  !important", xs: "100%  !important" },
        },
      }}
      className="rounded-lg re  border-[#dbdfea] border w-fit col-span-2 py-6 md:px-5 px-2 flex flex-col gap-6 mt-2 "
    >
      <div className="flex justify-between">
        <span className="text-sm text-blue-600 ">انتخاب زمان </span>
        <span className="text-sm text-green-600 font-bold">
          زمان انتخاب شده : {valueStatDate}
        </span>
      </div>{" "}
      <Calendar
        value={startTime}
        isGregorian={false}
        onChange={(value) => {
          setstartTime(value);
          setValueStatDate(value._d.toLocaleDateString("fa"));
          setData({ ...data, [item.id]: toIsoString(new Date(startTime._d)) });
          /*      setNum(
            allTime?.find(
              (item) => item?.dateTime === toIsoString(new Date(value._d))
            )?.capacity
          ); */
        }}
      />
      {/*   <div className="flex justify-center items-center gap-2">
            {" "}
            <span className="text-xs font-bold"> ظرفیت آزاد</span>
            <span className="text-xs font-bold">: {num} نفر</span>
          </div> */}
    </Paper>
  );
};

export default Calender;
