import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Paper,
  Radio,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
import momentJalaali from "moment-jalaali";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker2";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PageTitle } from "../../components/common";
import Dropdown from "../../components/common/Dropdown";
import Map from "../../components/common/map";
import TextInput from "../../components/common/TextInput";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  ADD_USER_ADDRESS,
  baseUrl,
  CHECK_FINNOTECH_ACTIVE,
  CREATE_USER,
  GET_COMPANY,
  GET_FINNOTECH_COMPANYINFO,
  GET_PROVINCE,
} from "../../helpers/api-routes";
import { genderData } from "../../helpers/constants";
import { configReq, toIsoString } from "../../helpers/functions";

const CreateUser = () => {
  const { companyInfo } = useSelector((state) => state.relationals);
  const [isFinnoTechAlive, setIsFinnoTechAlive] = useState(false);
  const [userData, setUserData] = useState({});
  const [cities, setCities] = useState();
  const [startTime, setstartTime] = useState();
  const [valueStatDate, setValueStatDate] = useState(0);
  const startTimeCalender = useRef();
  const [province, setProvince] = useState([]);
  const [currentStep, setcurrentStep] = useState(1);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const { token } = useSelector((state) => state.user);
  useEffect(() => {
    getFactory();
    checkFinnoTech();
  }, []);
  const getFactory = () => {
    axiosInstance(
      `${baseUrl}/${GET_COMPANY}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;

        setCompanies(data?.data);
      })
      .catch((err) => {});
  };
  const checkFinnoTech = () => {
    axiosInstance(`${baseUrl}/${CHECK_FINNOTECH_ACTIVE}`, configReq(token))
      .then((res) => {
        if (res.data.data) {
          setIsFinnoTechAlive(res.data.data);
        } else {
          setChecked(true);
        }
      })
      .catch((err) => {
        setChecked(true);
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
  useEffect(() => {
    axiosInstance(`${baseUrl}/${GET_PROVINCE}`, configReq(token))
      .then((res) => {
        const { data } = res;
        if (data && data.code === 200 && data.data) {
          setProvince(data.data);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  }, []);
  const isValid = (value) => {
    if (!value) return false;
    var L = value.length;

    if (L < 8 || parseInt(value, 10) == 0) return false;
    value = ("0000" + value).substr(L + 4 - 10);
    if (parseInt(value.substr(3, 6), 10) == 0) return false;
    var c = parseInt(value.substr(9, 1), 10);
    var s = 0;
    for (var i = 0; i < 9; i++)
      s += parseInt(value.substr(i, 1), 10) * (10 - i);
    s = s % 11;
    return (s < 2 && c === s) || (s >= 2 && c === 11 - s);
  };
  const handleSave = () => {
    if (userData?.nationalCode && !isValid(userData?.nationalCode)) {
      toast.error("کد ملی وارد شده معتبر نمی باشد");
    } else {
      var temp = { ...userData };
      for (var prop in temp) {
        if (temp[prop] === "") {
          delete temp[prop];
        }
      }
      var d = { ...userData };
      delete d.userType;
      var sD = { ...d, active: true, legalInvoice: false };
      if (startTime) {
        sD = {
          ...sD,
          birthDate: toIsoString(startTime?._d),
          address: d.addressFin,
        };
      }
      setLoading2(true);
      axiosInstance
        .post(
          `${baseUrl}/${CREATE_USER}`,
          {
            ...sD,
          },
          configReq(token)
        )
        .then((res) => {
          const { data } = res;
          var id = data?.data?.id;
          if (data?.data?.id && d) {
            axiosInstance
              .post(
                `${baseUrl}/${ADD_USER_ADDRESS}`,
                {
                  plaque: d.plaque,
                  floorNo: d.floorNo,
                  unit: d.unit,
                  address: d.address,
                  cityId: d.cityId,
                  provinceId: d.provinceId,
                  userId: data?.data?.id,
                  isDefault: true,
                  title: "-",
                  postalCode: d.postalCode,
                  receptorFname: d.fname,
                  receptorLname: d.lname,
                  latitiude: d.latitiude,
                  longtitude: d.longtitude,
                  receptorMobile: d.mobile,
                  receptorNationalCode: d.nationalCode,
                },
                configReq(token)
              )
              .then((res) => {
                setLoading(false);
                setLoading2(false);
                toast.success("با موفقیت اضافه شد");
                navigate("/users");
                setUserData({ ...userData, id: id });
              })
              .catch((err) => {
                setLoading(false);
                setLoading2(false);
                toast.error(err.response?.data?.message);
              });
          } else {
            setLoading(false);
            setLoading2(false);
            toast.success("با موفقیت ساخته شد");
            navigate("/users");
          }
          if (d?.isLegal) {
            setLoading(false);
            setLoading2(false);
            setUserData({ ...userData, id: id });
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading2(false);
          setLoading(false);
        });
    }
  };
  const validateFinnotech = () => {
    setLoading3(true);
    axiosInstance(
      `${baseUrl}/${GET_FINNOTECH_COMPANYINFO}?companyId=${userData?.nationalId}`,
      configReq(token)
    )
      .then((res) => {
        setLoading3(false);
        setChecked(true);
        setUserData({
          ...userData,
          companyName: res.data.data.title,
          tel: res.data.data.tel,
          economicCode: res.data.data.taxNumber,
          regNumber: res.data.data.registrationNo,

          addressFin: res.data.data.address,
        });
      })
      .catch((err) => {
        setLoading3(false);
        toast.error(err.response?.data);
      });
  };
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "  کاربران و نقش ها",
            path: "/users",
          },
        ]}
        title="کاربران"
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          {" "}
          <Stepper
            activeStep={currentStep - 1}
            alternativeLabel
            sx={{
              direction: "ltr",

              width: "100%",
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? "#fff"
                  : theme.palette.background.paper,
            }}
          >
            {companyInfo.showMapInFront && (
              <Step>
                <StepLabel
                  sx={{
                    ".MuiStepLabel-label": {
                      fontSize: {
                        md: "0.9rem !important",
                        xs: "1rem !important",
                      },
                    },
                  }}
                >
                  اطلاعات مکان
                </StepLabel>
              </Step>
            )}
            <Step>
              <StepLabel
                sx={{
                  ".MuiStepLabel-label": {
                    fontSize: {
                      md: "0.9rem !important",
                      xs: "1rem !important",
                    },
                  },
                }}
              >
                اطلاعات کاربر{" "}
              </StepLabel>
            </Step>
          </Stepper>
        </Paper>
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          {currentStep === 1 && companyInfo.showMapInFront ? (
            <Map
              onLocationSelect={(e) => {
                setUserData({
                  ...userData,
                  latitiude: e.latitude,
                  longtitude: e.longitude,
                  address: e.address,
                });

                setcurrentStep(2);
              }}
              longitude={userData.longtitude}
              latitude={userData.latitiude}
            />
          ) : (
            <>
              {" "}
              <div>
                <div className="grid md:grid-cols-3 gap-3 border-b mb-3 pb-3">
                  <FormControlLabel
                    onClick={() => setUserData({ ...userData, isLegal: false })}
                    value="male"
                    control={
                      <Radio size="small" checked={!userData?.isLegal} />
                    }
                    label="حقیقی"
                  />{" "}
                  <TextInput
                    label="شماره موبایل"
                    number
                    noSepreate
                    currentValue={userData?.mobile || ""}
                    change={(e) => setUserData({ ...userData, mobile: e })}
                  />{" "}
                  <TextInput
                    label=" پسورد"
                    currentValue={userData?.password || ""}
                    change={(e) => setUserData({ ...userData, password: e })}
                  />
                </div>

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
                    change={(e) =>
                      setUserData({ ...userData, nationalCode: e })
                    }
                  />{" "}
                  <Dropdown
                    title=" استان"
                    data={province}
                    value={province?.find(
                      (item) => item.id === userData.provinceId
                    )}
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
                      userData?.isMale
                        ? "مرد"
                        : userData?.isMale === false
                        ? "زن"
                        : ""
                    }
                    change={(e) =>
                      setUserData({ ...userData, isMale: e === "مرد" })
                    }
                    data={genderData}
                    title="جنسیت"
                  />{" "}
                  <Dropdown
                    title=" عضویت سازمان   "
                    data={companies}
                    value={companies?.find(
                      (item) => item.id === userData?.companyId
                    )}
                    change={(e) =>
                      setUserData({ ...userData, companyId: e?.id })
                    }
                  />{" "}
                  <div>
                    <Dropdown
                      value={KNOW.find(
                        (item) => item.id === userData?.knowType
                      )}
                      change={(e) =>
                        setUserData({ ...userData, knowType: e.id })
                      }
                      data={KNOW}
                      title="نوع آشنایی"
                    />
                  </div>
                </div>
              </div>{" "}
              <div className=" mt-8 border-t pt-8 md:grid grid-cols-5  w-full  gap-3">
                {userData?.isLegal ? (
                  <FormControlLabel
                    onClick={() => setUserData({ ...userData, isLegal: true })}
                    value="male"
                    control={
                      <Radio
                        size="small"
                        checked={userData?.isLegal === true}
                      />
                    }
                    label="حقوقی"
                  />
                ) : (
                  <FormControlLabel
                    onClick={() => setUserData({ ...userData, isLegal: true })}
                    value="male"
                    control={<Radio size="small" checked={false} />}
                    label="حقوقی"
                  />
                )}{" "}
                {isFinnoTechAlive ? (
                  <>
                    <TextInput
                      label=" شناسه ملی "
                      currentValue={userData?.nationalId || ""}
                      disabled={userData?.isLegal === false}
                      change={(e) =>
                        setUserData({ ...userData, nationalId: e })
                      }
                    />
                    <Button
                      disabled={
                        !userData?.nationalId ||
                        userData?.nationalId.length < 10 ||
                        loading3
                      }
                      variant="contained"
                      onClick={validateFinnotech}
                    >
                      {loading3 ? <CircularProgress /> : " استعلام"}
                    </Button>{" "}
                    <div className="col-span-2"></div>
                  </>
                ) : (
                  <></>
                )}
                {checked && (
                  <>
                    {" "}
                    <TextInput
                      label="نام شرکت "
                      currentValue={userData?.companyName || ""}
                      disabled={
                        userData?.isLegal === false ||
                        (userData?.companyName && isFinnoTechAlive)
                      }
                      change={(e) =>
                        setUserData({ ...userData, companyName: e })
                      }
                    />{" "}
                    <TextInput
                      label=" تلفن "
                      currentValue={userData?.tel || ""}
                      disabled={userData?.isLegal === false}
                      change={(e) => setUserData({ ...userData, tel: e })}
                    />{" "}
                    <TextInput
                      label="کد اقتصادی"
                      currentValue={
                        userData?.economicCode ||
                        (userData?.economicCode && isFinnoTechAlive)
                      }
                      disabled={userData?.isLegal === false}
                      change={(e) =>
                        setUserData({ ...userData, economicCode: e })
                      }
                    />{" "}
                    <TextInput
                      label="شناسه ثبت"
                      currentValue={userData?.regNumber}
                      disabled={
                        userData?.isLegal === false ||
                        (userData?.regNumber && isFinnoTechAlive)
                      }
                      change={(e) => setUserData({ ...userData, regNumber: e })}
                    />
                    <div className="col-span-5">
                      <TextInput
                        label=" نشانی"
                        currentValue={userData?.addressFin || ""}
                        disabled={userData?.isLegal === false}
                        change={(e) =>
                          setUserData({ ...userData, addressFin: e })
                        }
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center mt-10 border-t pt-10 justify-between gap-4">
                {companyInfo.showMapInFront && (
                  <Button
                    onClick={() => {
                      setcurrentStep(1);
                    }}
                    disabled={currentStep === 1}
                    variant="contained"
                  >
                    مرحله قبل
                  </Button>
                )}{" "}
                <Button
                  disabled={loading}
                  onClick={() => {
                    if (currentStep === 2) {
                      handleSave();
                    } else {
                      setcurrentStep(2);
                    }
                  }}
                  variant="contained"
                >
                  {currentStep === 2 ? (
                    <> {!loading ? " ثبت اطلاعات" : <CircularProgress />}</>
                  ) : (
                    "مرحله بعد"
                  )}
                </Button>{" "}
              </div>
            </>
          )}
        </Paper>
      </div>
    </>
  );
};

export default CreateUser;
const KNOW = [
  { id: 0, title: "گوگل" },
  { id: 1, title: "اینستاگرام" },
  { id: 2, title: "شبکه های پیام رسان" },
  { id: 3, title: "معرفی از دوستان" },
  { id: 4, title: " موارد دیگر" },
  { id: 5, title: "مشتریان حضوری" },
];
