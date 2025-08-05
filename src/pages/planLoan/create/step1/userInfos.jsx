/* eslint-disable react-hooks/exhaustive-deps */
import { FormControlLabel, Radio, TextField } from "@mui/material";
import { Box } from "@mui/system";
import momentJalaali from "moment-jalaali";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker2";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dropdown, TextInput } from "../../../../components/common";
import axiosInstance from "../../../../components/dataFetch/axiosInstance";
import { baseUrl, GET_COMPANY } from "../../../../helpers/api-routes";
import { genderData } from "../../../../helpers/constants";
import { configReq, toIsoString } from "../../../../helpers/functions";

const UserInfo = ({
  create,
  userData,
  setUserData,
  province,
  cities,
  setCities,
  startTime,
  setstartTime,
  setValueStatDate,
  valueStatDate,
}) => {
  const startTimeCalender = useRef();
  const [companies, setCompanies] = useState([]);
  const { token } = useSelector((state) => state.user);
  useEffect(() => {
    getFactory();
  }, []);
  const getFactory = () => {
    axiosInstance(
      `${baseUrl}/${GET_COMPANY}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        /*    setLoading(false); */

        setCompanies(data?.data);
      })
      .catch((err) => {
        /*    setLoading(false); */
      });
  };
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
    <div>
      {create ? (
        <div className="grid md:grid-cols-3 gap-3 border-b mb-3 pb-3">
          <FormControlLabel
            onClick={() => setUserData({ ...userData, isLegal: false })}
            value="male"
            control={<Radio size="small" checked={!userData?.isLegal} />}
            label="حقیقی"
          />{" "}
          <TextInput
            label="شماره موبایل"
            currentValue={userData?.mobile || ""}
            number
            noSepreate
            change={(e) => setUserData({ ...userData, mobile: e })}
          />{" "}
          <TextInput
            label=" پسورد"
            currentValue={userData?.password || ""}
            change={(e) => setUserData({ ...userData, password: e })}
          />
        </div>
      ) : (
        <>
          {" "}
          <TextInput
            label="شماره موبایل"
            number
            noSepreate
            currentValue={userData?.mobile}
            change={(e) => setUserData({ ...userData, mobile: e })}
          />
        </>
      )}
      <div className="grid md:grid-cols-3 gap-3">
        <>
          <TextInput
            label="نام"
            currentValue={userData?.fname || ""}
            change={(e) => setUserData({ ...userData, fname: e })}
          />
        </>
        <>
          <TextInput
            label="نام خانوادگی"
            currentValue={userData?.lname || ""}
            change={(e) => setUserData({ ...userData, lname: e })}
          />
        </>{" "}
        <TextInput
          label="کد ملی"
          number
          noSepreate
          currentValue={userData?.nationalCode || ""}
          change={(e) => setUserData({ ...userData, nationalCode: e })}
        />{" "}
        <Dropdown
          title=" استان"
          data={province}
          value={province?.find((item) => item.id === userData.provinceId)}
          change={(e) => {
            setCities(e?.cities);
            setUserData({ ...userData, provinceId: e?.id });
          }}
        />
        <Dropdown
          title="شهر "
          data={cities}
          value={cities?.find((item) => item.id === userData.cityId)}
          change={(e) => setUserData({ ...userData, cityId: e?.id })}
        />
        <TextInput
          label="کد پستی  "
          change={(e) => setUserData({ ...userData, postalCode: e })}
          currentValue={userData.postalCode || ""}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-3 my-3">
        <div className="grid md:grid-cols-3 gap-3">
          {" "}
          <TextInput
            label="پلاک  "
            change={(e) => setUserData({ ...userData, plaque: e })}
            currentValue={userData.plaque || ""}
          />
          <TextInput
            label="طبقه  "
            change={(e) => setUserData({ ...userData, floorNo: e })}
            currentValue={userData.floorNo || ""}
          />
          <TextInput
            label="واحد  "
            change={(e) => setUserData({ ...userData, unit: e })}
            currentValue={userData.unit || ""}
          />
        </div>
        <TextInput
          label="نشانی  "
          change={(e) => setUserData({ ...userData, address: e })}
          currentValue={userData.address || ""}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="leftInput">
          <TextInput
            label="ایمیل"
            currentValue={userData?.email || ""}
            change={(e) => setUserData({ ...userData, email: e })}
          />
        </div>
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
            timePicker={false}
            ref={startTimeCalender}
            min={momentJalaali().add(-70, "year")}
            max={momentJalaali().add(-17, "year")}
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
        <Dropdown
          value={
            userData?.isMale ? "مرد" : userData?.isMale === false ? "زن" : ""
          }
          change={(e) => setUserData({ ...userData, isMale: e === "مرد" })}
          data={genderData}
          title="جنسیت"
        />{" "}
        <Dropdown
          title=" عضویت سازمان   "
          data={companies}
          value={companies?.find((item) => item.id === userData?.companyId)}
          change={(e) => setUserData({ ...userData, companyId: e?.id })}
        />{" "}
        <div>
          <Dropdown
            value={KNOW.find((item) => item.id === userData?.knowType)}
            change={(e) => setUserData({ ...userData, knowType: e.id })}
            data={KNOW}
            title="نوع آشنایی"
          />
        </div>
      </div>
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
