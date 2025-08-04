import { TextField } from "@mui/material";
import momentJalaali from "moment-jalaali";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker2";
import { toast } from "react-toastify";
import { NumberInput, TextInput } from "../common";

const Promotion = ({
  data,
  setPromotionPrice,
  setPromotionStock,
  setPromotionTo,
  setPromotionFrom,
  rerender,
  setRerender,
}) => {
  const [valueStatDate, setValueStatDate] = useState(0);
  const [valueEndDate, setValueEndDate] = useState(0);
  const [startTime, setstartTime] = useState();
  const [endTime, setendTime] = useState();
  const startTimeCalender = useRef();
  const endTimeCalender = useRef();
  const initialRender = useRef(true);

  useEffect(() => {
    if (!initialRender.current && rerender) {
      initialRender.current = false;
      return;
    }

    if (data?.promotionFrom) {
      let string = new Date(data?.promotionFrom).toLocaleDateString(
        "en-US-u-ca-persian"
      );

      string =
        string.split("/")[2] +
        "/" +
        string.split("/")[0] +
        "/" +
        string.split("/")[1] +
        ` ${String(new Date(data?.promotionFrom).getHours()).padStart(
          2,
          "0"
        )}:${String(new Date(data?.promotionFrom).getMinutes()).padStart(
          2,
          "0"
        )}`;
      setstartTime(momentJalaali(string, "jYYYY/jM/jD HH:mm"));
    }
    if (data?.promotionTo) {
      let string2 = new Date(data?.promotionTo).toLocaleDateString(
        "en-US-u-ca-persian"
      );
      string2 =
        string2.split("/")[2] +
        "/" +
        string2.split("/")[0] +
        "/" +
        string2.split("/")[1] +
        ` ${String(new Date(data?.promotionTo).getHours()).padStart(
          2,
          "0"
        )}:${String(new Date(data?.promotionTo).getMinutes()).padStart(
          2,
          "0"
        )}`;
      setendTime(momentJalaali(string2, "jYYYY/jM/jD HH:mm"));
    }
  }, [data]);

  return (
    <div className="md:grid md:grid-cols-4 flex flex-col gap-4 col-span-4 hour">
      {" "}
      <NumberInput
        label="موجودی پروموشن"
        value={data?.promotionStock}
        change={(e) => {
          if (e > data?.stock) {
            toast.error("موجودی  پروموشن نباید از موجودی محصول بیشتر باشد");
          } else {
            setPromotionStock(e);
          }
        }}
      />
      <TextInput
        label="قیمت پروموشن"
        currentValue={data?.promotionPrice}
        change={(e) => {
          if (e > data?.price) {
            toast.error("قیمت  پروموشن نباید از قیمت محصول بیشتر باشد");
          } else {
            setPromotionPrice(e);
          }
        }}
        price
        number
      />
      <>
        <div className="relative  w-full">
          <DatePicker
            value={startTime}
            isGregorian={false}
            timePicker={true}
            ref={startTimeCalender}
            /*      styles="timee" */
            min={momentJalaali().add(-1, "days")}
            onChange={(value) => {
              if (value) {
                setstartTime(value);
                const newDateValue = toIsoString2(new Date(value._d));
                setPromotionFrom(newDateValue);
                setValueStatDate(
                  `${String(new Date(value._d).getMinutes()).padStart(
                    2,
                    "0"
                  )} : ${String(new Date(value._d).getHours()).padStart(
                    2,
                    "0"
                  )}   -   ${value._d.toLocaleDateString("fa")}   `
                );
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
            value={endTime}
            isGregorian={false}
            ref={endTimeCalender}
            min={startTimeCalender}
            onChange={(value) => {
              if (value) {
                setendTime(value);
                const newDateValue = toIsoString2(new Date(value._d));
                setPromotionTo(newDateValue);
                setValueEndDate(
                  `${String(new Date(value._d).getMinutes()).padStart(
                    2,
                    "0"
                  )} : ${String(new Date(value._d).getHours()).padStart(
                    2,
                    "0"
                  )}   -   ${value._d.toLocaleDateString("fa")}   `
                );
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
    </div>
  );
};

export default React.memo(Promotion);
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
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    "00"
  );
}
