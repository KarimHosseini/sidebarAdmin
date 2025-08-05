/* eslint-disable no-unused-vars */
/* eslint-disable no-lone-blocks */
import { Box, TextField } from "@mui/material";
import momentJalaali from "moment-jalaali";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker2";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dropdown, TextInput } from "../../../components/common";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import { baseUrl, USER_ROLES } from "../../../helpers/api-routes";
import { genderData, legalData } from "../../../helpers/constants";
import { configReq } from "../../../helpers/functions";
const UserInfo = ({ userData, setUserData, id, access }) => {
  const [startTime, setstartTime] = useState();
  const startTimeCalender = useRef();
  const [valueStatDate, setValueStatDate] = useState(0);
  const [roleData, setRoleData] = useState([]);
  const { token } = useSelector((state) => state.user);

  useLayoutEffect(() => {
    let string = new Date(userData.birthDate).toLocaleDateString(
      "en-US-u-ca-persian"
    );
    string =
      string.split("/")[2] +
      "/" +
      string.split("/")[0] +
      "/" +
      string.split("/")[1];
    setstartTime(momentJalaali(string, "jYYYY/jM/jD"));
  }, [userData]);
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
  useEffect(() => {
    axiosInstance(`${baseUrl}/${USER_ROLES}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setRoleData(data?.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  }, []);
  const handleDateChange = (value) => {
    const selectedDate = momentJalaali(value._d);
    const seventyYearsAgo = momentJalaali().add(-70, "year");
    const sixYearsAgo = momentJalaali().subtract(6, "year");

    if (selectedDate.isBefore(seventyYearsAgo)) {
      toast.error("حداکثر سن مورد مجاز برای ثبت نام ۷۰ سال می باشد", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (selectedDate.isAfter(sixYearsAgo)) {
      toast.error("حداقل سن مجاز برای ثبت نام ۶ سال می باشد", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    setstartTime(value);
    setUserData({
      ...userData,
      birthDate: toIsoString(new Date(value._d)),
    });
    setValueStatDate(value._d.toLocaleDateString("fa"));
  };
  return (
    <div className="flex flex-col md:grid lg:grid-cols-4 md:grid-cols-3   gap-4 relative z-10">
      <>
        <TextInput
          label="نام"
          currentValue={userData?.fname}
          change={(e) => setUserData({ ...userData, fname: e })}
        />
      </>
      <>
        <TextInput
          label="نام خانوادگی"
          currentValue={userData?.lname}
          change={(e) => setUserData({ ...userData, lname: e })}
        />
      </>
      <>
        <TextInput
          label="شماره موبایل"
          currentValue={userData?.mobile}
          number
          noSepreate
          change={(e) => setUserData({ ...userData, mobile: e })}
        />
      </>

      <div>
        <TextInput
          label="ایمیل"
          currentValue={userData?.email}
          change={(e) => setUserData({ ...userData, email: e })}
        />
      </div>
      <div>
        <TextInput
          label="کد ملی"
          number
          noSepreate
          currentValue={userData?.nationalCode}
          change={(e) => setUserData({ ...userData, nationalCode: e })}
        />
      </div>

      <div>
        <Dropdown
          value={!userData?.isLegal ? "حقیقی" : "حقوقی"}
          change={(e) => setUserData({ ...userData, isLegal: e === "حقوقی" })}
          data={legalData}
          title="نوع مالکیت"
        />
      </div>

      <div>
        <Dropdown
          value={userData?.isMale ? "مرد" : "زن"}
          change={(e) => setUserData({ ...userData, isMale: e === "مرد" })}
          data={genderData}
          title="جنسیت"
        />
      </div>

      <div>
        {localStorage.getItem("s") &&
          JSON.parse(localStorage.getItem("s"))?.role !== undefined && (
            <Dropdown
              value={roleData.find(
                (item) => Number(item.id) === Number(userData.role)
              )}
              change={(e) => setUserData({ ...userData, role: e?.id })}
              data={roleData}
              title="  سطح دسترسی"
              /*     readOnly={
                JSON.parse(localStorage.getItem("s"))?.role !== 2 ||
                JSON.parse(localStorage.getItem("s")).id === Number(id)
              } */
            />
          )}
      </div>

      {Number(userData.role) !== 0 ? (
        <div>
          <Dropdown
            value={access.find((item) => item.id === userData.accessId)}
            change={(e) => setUserData({ ...userData, accessId: e.id })}
            data={access}
            title="نقش کاربر"
            readOnly={JSON.parse(localStorage.getItem("s")).id === Number(id)}
          />
        </div>
      ) : (
        <></>
      )}
      <Box
        sx={{
          position: "relative",

          ".tether-target": {
            visibility: "hidden",
          },
          ".datepicker-input ": {
            visibility: "hidden",
          },
        }}
      >
        <DatePicker
          value={startTime}
          isGregorian={false}
          ref={startTimeCalender}
          timePicker={false}
          onChange={(value) => {
            handleDateChange(value);
          }}
        />
        <TextField
          /*           error={errors.startTime} */
          onMouseUp={() => startTimeCalender.current?.setOpen(true)}
          InputProps={{
            inputProps: {
              style: { textAlign: "right", width: "100%" },
            },
          }}
          variant="outlined"
          value={valueStatDate ? valueStatDate : ""}
          label={" تاریخ  تولد "}
          autoComplete="off"
          fullWidth
        />
      </Box>
      <div>
        <Dropdown
          value={KNOW.find((item) => item.id === userData?.knowType)}
          change={(e) => setUserData({ ...userData, knowType: e.id })}
          data={KNOW}
          title="نوع آشنایی"
        />
      </div>
      <div className="flex items-end gap-5 col-span-3 userInput"></div>
    </div>
  );
};

export default UserInfo;
const KNOW = [
  { id: 0, title: "گوگل" },
  { id: 1, title: "اینستاگرام" },
  { id: 2, title: "شبکه های پیام رسان" },
  { id: 3, title: "معرفی از دوستان" },
  { id: 4, title: " موارد دیگر" },
  { id: 5, title: "مشتریان حضوری" },
];
