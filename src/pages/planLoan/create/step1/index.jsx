/* eslint-disable eqeqeq */
import {
  Autocomplete,
  Button,
  CircularProgress,
  FormControlLabel,
  Paper,
  Radio,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, TextInput } from "../../../../components/common";
import SearchInput2 from "../../../../components/common/searchInput2";
import axiosInstance from "../../../../components/dataFetch/axiosInstance";
import {
  ADD_USER_ADDRESS,
  ALL_USERS,
  baseUrl,
  CHECK_FINNOTECH_ACTIVE,
  CREATE_USER,
  GET_FINNOTECH_COMPANYINFO,
} from "../../../../helpers/api-routes";
import { configReq, toIsoString } from "../../../../helpers/functions";
import UserInfo from "./userInfos";

const Step1 = ({
  step,
  setStep,
  province,
  userData,
  setUserData,
  value,
  setValue,
  setvalueChanges,
  valueChanges,
  disabledAll,
  createdUser,
  setCreatedUser,
  isOrder,
}) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [cities, setCities] = useState();
  const [startTime, setstartTime] = useState();
  const [valueStatDate, setValueStatDate] = useState(0);
  const { token } = useSelector((state) => state.user);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const [isFinnoTechAlive, setIsFinnoTechAlive] = useState(false);
  const [loading3, setLoading3] = useState(false);

  useEffect(() => {
    if (userData?.userType === "0") {
      if (value?.id) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } else {
      if (!userData?.mobile && !userData?.password) {
        setDisabled(true);
      } else {
        if (!userData?.isLegal) {
          if (
            !userData?.fname ||
            !userData?.lname ||
            !userData?.nationalCode ||
            !userData?.provinceId ||
            !userData?.cityId ||
            !userData?.postalCode ||
            !userData?.plaque ||
            !userData?.floorNo ||
            !userData?.unit ||
            !userData?.address ||
            userData?.knowType === undefined ||
            /*   !userData?.email || */
            /*   !userData?.companyId || */
            !startTime
          ) {
            setDisabled(true);
          } else {
            if (
              userData?.mobile === createdUser?.mobile ||
              /*  userData?.email === createdUser?.email || */
              userData?.nationalCode === createdUser?.nationalCode ||
              (userData?.fname === createdUser?.fname &&
                userData?.lname === createdUser?.lname &&
                userData?.provinceId === createdUser?.provinceId &&
                userData?.cityId === createdUser?.cityId &&
                userData?.postalCode === createdUser?.postalCode &&
                userData?.plaque === createdUser?.plaque &&
                userData?.floorNo === createdUser?.floorNo &&
                userData?.unit === createdUser?.unit &&
                userData?.address === createdUser?.address &&
                /*   userData?.companyId === createdUser?.companyId && */
                startTime === createdUser?.startTime)
            ) {
              setDisabled(true);
            } else {
              setDisabled(false);
            }
          }
        } else {
          if (
            !userData?.companyName ||
            !userData?.tel ||
            !userData?.economicCode ||
            !userData?.regNumber
          ) {
            setDisabled(true);
          } else {
            if (
              userData?.mobile === createdUser?.mobile ||
              userData?.email === createdUser?.email ||
              userData?.nationalCode === createdUser?.nationalCode ||
              (userData?.companyName === createdUser?.companyName &&
                userData?.tel === createdUser?.tel &&
                userData?.economicCode === createdUser?.economicCode &&
                userData?.regNumber === createdUser?.regNumber)
            ) {
              setDisabled(true);
            } else {
              setDisabled(false);
            }
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, value, createdUser]);
  useEffect(() => {
    checkFinnoTech();
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
  const sumbitData = () => {
    if (userData?.userType === "0") {
      setUserData({ ...userData, id: value?.id });
    } else {
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
          sD = { ...sD, birthDate: toIsoString(startTime?._d) };
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
                    receptorMobile: d.mobile,
                    receptorNationalCode: d.nationalCode,
                  },
                  configReq(token)
                )
                .then((res) => {
                  setLoading(false);
                  setLoading2(false);
                  setCreatedUser({ ...d, startTime: startTime });
                  toast.success("با موفقیت اضافه شد");
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
            }
            if (d?.isLegal) {
              setLoading(false);
              setLoading2(false);
              setCreatedUser({ ...d, startTime: startTime });
              setUserData({ ...userData, id: id });
            }
          })
          .catch((err) => {
            toast.error(err.response?.data?.message);
            setLoading2(false);
            setLoading(false);
          });
      }
    }
  };
  const checkFinnoTech = () => {
    axiosInstance(`${baseUrl}/${CHECK_FINNOTECH_ACTIVE}`, configReq(token))
      .then((res) => {
        setIsFinnoTechAlive(res.data.data);
      })
      .catch((err) => {
        setChecked(true);
      });
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
    <div className="w-full">
      {isOrder ? (
        <h3 className="font-bold text-xl">ثبت سفارش بدون وابستگی نماینده</h3>
      ) : (
        <h3 className="font-bold text-xl">ثبت نام متقاضی تسهیلات</h3>
      )}
      <div className="relative md:w-fit w-full">
        {" "}
        {userData?.userType !== "0" || disabledAll ? (
          <Box
            sx={{
              zIndex: userData?.userType !== "0" || disabledAll ? 999 : 0,
            }}
            className="absolute z-20 cursor-not-allowed bg-gray-100 opacity-40 w-full h-full top-0 right-0"
          ></Box>
        ) : (
          <></>
        )}
        <Paper
          elevation={0}
          className="rounded-lg re  border-[#dbdfea] border md:w-fit py-6 md:px-5 px-2 flex md:flex-row flex-col w-full flex-wrap gap-6 mt-2 mb-4"
        >
          <FormControlLabel
            onClick={() => {
              setUserData({ userType: "0" });
              setValueStatDate("");
            }}
            value="male"
            control={
              <Radio size="small" checked={userData?.userType === "0"} />
            }
            label="انتخاب کاربر"
            sx={{ zIndex: 2001 }}
          />
          <Box
            sx={{
              ".MuiInputBase-root": {
                width: { md: "15rem !important", xs: "100% !important" },
              },
            }}
          >
            {userData?.userType === "0" ? (
              <SearchInput2
                url={ALL_USERS}
                value={value}
                setValue={(e) => {
                  setValue(e);
                  setvalueChanges(true);
                }}
                label={"جست و جو کاربر"}
              />
            ) : (
              <>
                {" "}
                <Autocomplete
                  sx={{
                    ".MuiOutlinedInput-root": {
                      padding: "7px !important",
                    },
                  }}
                  options={[]}
                  renderInput={(params) => (
                    <TextField {...params} label={"جست و جو کاربر"} />
                  )}
                />
              </>
            )}
          </Box>

          {valueChanges && value?.mobile ? (
            <>
              <TextField
                InputLabelProps={{ shrink: true }}
                value={value?.nationalCode || ""}
                label="  کدملی"
                disabled
              />
              <TextField
                InputLabelProps={{ shrink: true }}
                value={value?.mobile || ""}
                label=" شماره همراه"
                disabled
              />
              {value && (
                <Button
                  onClick={() => {
                    if (localStorage.getItem("redirectType") === "2") {
                      navigate(`/users/${value?.id}`);
                    } else {
                      window.open(`/users/${value?.id}`, "_blank");
                    }
                  }}
                  variant="contained"
                  color="warning"
                >
                  ویرایش
                </Button>
              )}
            </>
          ) : (
            <>
              {" "}
              <TextField
                /* value={value?.nationalCode} */ value=""
                label="  کدملی"
                disabled
              />
              <TextInput
                /*  currentValue={prevData?.mobile} */
                label=" شماره همراه"
                disabled
              />{" "}
            </>
          )}
        </Paper>
      </div>
      {!disabledAll && (
        <div className="relative flex flex-wrap w-full gap-2 justify-between mt-2 mb-10">
          <div className="relative flex flex-wrap w-fit gap-2 ">
            {" "}
            {userData?.userType !== "1" || disabledAll ? (
              <Box
                sx={{
                  zIndex: userData?.userType !== "1" || disabledAll ? 20 : 0,
                }}
                className="absolute z-20 cursor-not-allowed bg-gray-100 opacity-40 w-full h-full top-0 right-0"
              ></Box>
            ) : (
              <></>
            )}
            <Paper
              elevation={0}
              className="rounded-lg re  border-[#dbdfea] border w-fit py-6 md:px-5 px-2 flex flex-wrap gap-6 "
            >
              <FormControlLabel
                onClick={() => {
                  setUserData({ userType: "1" });
                  setValue();
                }}
                value="male"
                control={
                  <Radio size="small" checked={userData?.userType === "1"} />
                }
                label=" ثبت کاربر جدید"
                sx={{ zIndex: 200 }}
              />
              <div className="md:max-w-xl">
                {" "}
                <UserInfo
                  userData={userData}
                  setUserData={(e) => {
                    setUserData(e);
                  }}
                  create={true}
                  province={province}
                  cities={cities}
                  setCities={setCities}
                  startTime={startTime}
                  setstartTime={setstartTime}
                  setValueStatDate={setValueStatDate}
                  valueStatDate={valueStatDate}
                />
              </div>
            </Paper>{" "}
            <Paper
              elevation={0}
              className="rounded-lg re  border-[#dbdfea] border w-fit py-6 md:px-5 px-2 flex flex-wrap gap-6"
            >
              {" "}
              <div className="md:max-w-[250px] w-full flex flex-col gap-3">
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
                        userData?.isLegal === false || userData?.companyName
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
                        userData?.economicCode || userData?.economicCode
                      }
                      disabled={userData?.isLegal === false}
                      change={(e) =>
                        setUserData({ ...userData, economicCode: e })
                      }
                    />{" "}
                    <TextInput
                      label="شناسه ثبت"
                      currentValue={userData?.regNumber || userData?.regNumber}
                      disabled={userData?.isLegal === false}
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
              </div>{" "}
            </Paper>
          </div>

          <div className="h-auto flex items-end" style={{ zIndex: 300 }}>
            <Button
              disabled={disabled || loading || disabledAll || loading2}
              fullWidth
              variant="contained"
              color="primary"
              onClick={sumbitData}
              sx={{ width: "150px !important" }}
            >
              {loading ? <CircularProgress /> : "  ثبت اطلاعات"}
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={openEdit}
        close={() => setOpenEdit(false)}
        title={" ویرایش کاربر"}
      >
        <div className="grid md:grid-cols-2">
          <UserInfo
            userData={/* data?.userType === "0" ? value : */ userData}
            setUserData={(e) => {
              if (userData?.userType === "0") {
                setValue(e);
              } else {
                setUserData(e);
              }
            }}
            province={province}
            cities={cities}
            setCities={setCities}
            startTime={startTime}
            setstartTime={setstartTime}
            setValueStatDate={setValueStatDate}
            valueStatDate={valueStatDate}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Step1;
