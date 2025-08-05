import { Checkbox, Paper, Radio, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker2";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dropdown, NumberInput, TextInput } from "../../../components/common";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import {
  ALL_SHIPPING_COMPANIES,
  baseUrl,
  GET_PROVINCE,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";

const Step4 = ({
  conditions,
  setConditions,
  type,
  setstartTime,
  setendTime,
  startTime,
  endTime,
  planStarted,
}) => {
  const { token } = useSelector((state) => state.user);
  const [province, setProvince] = useState([]);
  const [shipping, setShipping] = useState([]);
  const [cities, setCities] = useState();
  const startTimeCalender = useRef();
  const endTimeCalender = useRef();
  useEffect(() => {
    axiosInstance(`${baseUrl}/${GET_PROVINCE}`, configReq(token))
      .then((res) => {
        const { data } = res;

        if (data && data.code === 200 && data.data) {
          setProvince(data.data);
          var finded = data.data?.find(
            (item) => item.id === conditions.Province
          );
          if (finded) setCities(finded?.cities);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
    axiosInstance(`${baseUrl}/${ALL_SHIPPING_COMPANIES}`, configReq(token))
      .then((res) => {
        const { data } = res;

        if (data && data.code === 200 && data.data) {
          setShipping(data.data);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  }, []);
  return (
    <div className="relative w-full">
      {planStarted ? (
        <div className="absolute z-20 cursor-not-allowed bg-gray-100 opacity-40 w-full h-full top-0 right-0"></div>
      ) : (
        <div></div>
      )}
      {type === "1" ? (
        <>
          {" "}
          <Paper
            elevation={0}
            className="p-4 border border-[#dbdfea] w-full mb-4"
          >
            <div className="flex lg:justify-between xl:justify-between flex-col lg:flex-row xl:flex-row md:flex-col sm:flex-col">
              {/* Right */}
              <div className="flex flex-col w-auto">
                <Box
                  sx={{
                    background: (theme) =>
                      theme.palette.mode === "dark" ? "#351936" : "#F0F2F5",
                  }}
                  className=" py-4 pr-8  border border-[#707070] rounded-[10px]"
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    شرایط ارسالی
                  </Typography>
                  <Paper elevation={0} className=" mt-3 w-[265px]">
                    <Dropdown
                      title="انتخاب نوع ارسال "
                      data={shipping}
                      value={shipping?.find(
                        (item) => item.id === conditions.ShippingCompany
                      )}
                      change={(e) =>
                        setConditions({ ...conditions, ShippingCompany: e?.id })
                      }
                    />
                  </Paper>
                  <div className="flex items-center mt-3">
                    <Paper elevation={0} className="">
                      <TextInput
                        price={true}
                        number={!conditions?.FreeShipping}
                        change={(e) =>
                          setConditions({ ...conditions, ShippingDiscount: e })
                        }
                        noError={conditions?.FreeShipping}
                        allowZero={conditions?.FreeShipping}
                        disabled={conditions?.FreeShipping}
                        currentValue={conditions?.ShippingDiscount || ""}
                        label="مبلغ تخفیف "
                      />
                    </Paper>

                    <div className="flex items-center w-auto px-4 py-2">
                      <Checkbox
                        onClick={(e) =>
                          setConditions({
                            ...conditions,
                            FreeShipping: !conditions?.FreeShipping,
                          })
                        }
                        checked={conditions?.FreeShipping}
                      />
                      <label className="mr-2 text-xs">رایگان</label>
                    </div>
                  </div>
                </Box>
                <Box
                  sx={{
                    background: (theme) =>
                      theme.palette.mode === "dark" ? "#351936" : "#F0F2F5",
                  }}
                  className=" py-6 pr-8  border border-[#707070] rounded-[10px] mt-[15px]"
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    شرایط درگاه پرداخت
                  </Typography>
                  <Paper elevation={0} className=" mt-7 w-[265px]">
                    <Dropdown
                      title="انتخاب درگاه "
                      data={GETWAY}
                      value={GETWAY?.find(
                        (item) => item.id === conditions.Gateway
                      )}
                      change={(e) =>
                        setConditions({ ...conditions, Gateway: e?.id })
                      }
                    />
                  </Paper>
                </Box>
                <Box
                  sx={{
                    background: (theme) =>
                      theme.palette.mode === "dark" ? "#351936" : "#F0F2F5",
                  }}
                  className=" mt-[25px] py-4 px-8 border border-[#707070] rounded-[10px]"
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    شرایط ثبت نام و خرید
                  </Typography>
                  <div className="flex items-center py-2">
                    <Radio
                      size="small"
                      onClick={(e) =>
                        setConditions({
                          ...conditions,
                          UserType: 0,
                        })
                      }
                      checked={conditions?.UserType === 0}
                    />
                    <label className="mr-[6px]"> همه کاربران </label>
                  </div>
                  <div className="flex items-center py-2">
                    <Radio
                      size="small"
                      onClick={(e) =>
                        setConditions({
                          ...conditions,
                          UserType: 1,
                        })
                      }
                      checked={conditions?.UserType === 1}
                    />
                    <label className="mr-[6px]">
                      قابل استفاده برای کاربرانی که اولین خرید را دارند
                    </label>
                  </div>
                  <div className="flex items-center py-2">
                    <Radio
                      size="small"
                      onClick={(e) =>
                        setConditions({
                          ...conditions,
                          UserType: 2,
                        })
                      }
                      checked={conditions?.UserType === 2}
                    />
                    <label className="mr-[6px]">
                      قابل استفاده برای کاربرانی که خرید دوم به بعد را دارند
                    </label>
                  </div>
                  <div className="flex items-center py-2">
                    <Radio
                      size="small"
                      onClick={(e) =>
                        setConditions({
                          ...conditions,
                          UserType: 3,
                        })
                      }
                      checked={conditions?.UserType === 3}
                    />
                    <label className="mr-[6px]">
                      قابل استفاده برای کاربرانی که در تاریخ مشخص شده ثبت نام
                      کرده اند
                    </label>
                  </div>
                  {conditions?.UserType === 3 && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <DatePicker
                          value={startTime}
                          timePicker={false}
                          isGregorian={false}
                          ref={startTimeCalender}
                          onChange={(value) => {
                            if (value) {
                              setstartTime(value);
                              setConditions({
                                ...conditions,
                                RegisterFrom: toIsoString(new Date(value._d)),
                              });
                            }
                          }}
                        />
                        <TextField
                          onMouseUp={() =>
                            startTimeCalender.current?.setOpen(true)
                          }
                          InputProps={{
                            inputProps: {
                              style: { textAlign: "right", width: "100%" },
                            },
                          }}
                          variant="outlined"
                          value={
                            conditions?.RegisterFrom
                              ? new Date(
                                  conditions?.RegisterFrom
                                ).toLocaleDateString("fa")
                              : ""
                          }
                          label={"از تاریخ "}
                          autoComplete="off"
                          fullWidth
                        />
                      </div>
                      <div>
                        <DatePicker
                          value={endTime}
                          isGregorian={false}
                          timePicker={false}
                          ref={endTimeCalender}
                          onChange={(value) => {
                            if (value) {
                              setendTime(value);
                              setConditions({
                                ...conditions,
                                RegisterTo: toIsoString2(new Date(value._d)),
                              });
                            }
                          }}
                        />
                        <TextField
                          onMouseUp={() =>
                            endTimeCalender.current?.setOpen(true)
                          }
                          InputProps={{
                            inputProps: {
                              style: { textAlign: "right", width: "100%" },
                            },
                          }}
                          variant="outlined"
                          value={
                            conditions?.RegisterTo
                              ? new Date(
                                  conditions?.RegisterTo
                                ).toLocaleDateString("fa")
                              : ""
                          }
                          label={"تا تاریخ "}
                          autoComplete="off"
                          fullWidth
                        />
                      </div>
                    </div>
                  )}
                </Box>
              </div>
              {/* Left */}
              <div className="flex flex-col">
                <Box
                  sx={{
                    background: (theme) =>
                      theme.palette.mode === "dark" ? "#351936" : "#F0F2F5",
                  }}
                  className=" p-8  border border-[#707070] rounded-[10px]"
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    شرایط منطقه ای
                  </Typography>
                  <div className="flex justify-between gap-4 pl-4">
                    <Paper elevation={0} className=" mt-7 w-[265px]">
                      <Dropdown
                        title=" استان"
                        data={province}
                        value={province?.find(
                          (item) => item.id === conditions.Province
                        )}
                        change={(e) => {
                          setCities(e?.cities);
                          setConditions({ ...conditions, Province: e?.id });
                        }}
                      />
                    </Paper>
                    <Paper elevation={0} className=" mt-7 w-[265px]">
                      <Dropdown
                        title="شهر "
                        data={cities}
                        value={cities?.find(
                          (item) => item.id === conditions.City
                        )}
                        change={(e) =>
                          setConditions({ ...conditions, City: e?.id })
                        }
                      />
                    </Paper>
                  </div>
                </Box>
                <Box
                  sx={{
                    background: (theme) =>
                      theme.palette.mode === "dark" ? "#351936" : "#F0F2F5",
                  }}
                  className=" mt-[25px]  p-8  border border-[#707070] rounded-[10px]"
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    شرایط سبد خرید
                  </Typography>
                  <div className="flex justify-between gap-4 pl-4">
                    <Paper elevation={0} className=" mt-7 w-[265px]">
                      <TextInput
                        price={true}
                        number={true}
                        label="حداقل مبلغ سبد خرید (تومان) 
                "
                        change={(e) =>
                          setConditions({ ...conditions, InvoiceMinPrice: e })
                        }
                        currentValue={conditions?.InvoiceMinPrice || ""}
                      />
                    </Paper>
                    <Paper elevation={0} className=" mt-7 w-[265px]">
                      <TextInput
                        price={true}
                        number={true}
                        change={(e) =>
                          setConditions({ ...conditions, InvoiceMaxPrice: e })
                        }
                        currentValue={conditions?.InvoiceMaxPrice || ""}
                        label="حداکثر مبلغ سبد خرید (تومان) "
                      />
                    </Paper>
                  </div>
                  <div className="flex justify-between gap-4 pl-4">
                    <Paper elevation={0} className=" mt-7 w-[265px]">
                      <NumberInput
                        change={(e) =>
                          setConditions({ ...conditions, InvoiceMinQty: e })
                        }
                        value={conditions?.InvoiceMinQty}
                        label=" حداقل تعداد در سبد خرید"
                      />
                    </Paper>
                    <Paper elevation={0} className=" mt-7 w-[265px]">
                      <NumberInput
                        change={(e) =>
                          setConditions({ ...conditions, InvoiceMaxQty: e })
                        }
                        value={conditions?.InvoiceMaxQty}
                        label="  حداکثر تعداد در سبد خرید"
                      />
                    </Paper>
                  </div>
                </Box>
              </div>
            </div>
          </Paper>
        </>
      ) : (
        <Paper
          elevation={0}
          className="p-4 border border-[#dbdfea] w-full mb-4"
        >
          {" "}
          <Box
            sx={{
              background: (theme) =>
                theme.palette.mode === "dark" ? "#351936" : "#F0F2F5",
            }}
            className=" py-6 pr-8  border border-[#707070] rounded-[10px] mt-[15px]"
          >
            <Typography sx={{ fontWeight: "bold" }}>
              شرایط درگاه پرداخت
            </Typography>
            <Paper elevation={0} className=" mt-7 w-[265px]">
              <Dropdown
                title="انتخاب درگاه "
                data={GETWAY}
                value={GETWAY?.find((item) => item.id === conditions.Gateway)}
                change={(e) => setConditions({ ...conditions, Gateway: e?.id })}
              />
            </Paper>
          </Box>
          <Box
            sx={{
              background: (theme) =>
                theme.palette.mode === "dark" ? "#351936" : "#F0F2F5",
            }}
            className=" py-6 pr-8  border border-[#707070] rounded-[10px] mt-[15px]"
          >
            {" "}
            <Typography sx={{ fontWeight: "bold" }}>شرایط طرح</Typography>
            <Box
              sx={{
                ".MuiInputBase-root": {
                  background: (theme) => theme.palette.background.paper,
                },
              }}
              className=" mt-7 grid md:grid-cols-4 gap-3"
            >
              <NumberInput
                label=" کارمزد طرح (‌درصد) "
                value={conditions.Wage}
                float={true}
                change={(e) => {
                  if (e > 100) {
                    toast.error("کارمزد طرح نمی تواند بیشتر از ۱۰۰ درصد باشد");
                  } else {
                    setConditions({ ...conditions, Wage: e });
                  }
                }}
                max={100}
              />{" "}
              <NumberInput
                label=" کارمزد بانک (‌درصد) "
                value={conditions.BankWage}
                float={true}
                change={(e) => {
                  if (e > 100) {
                    toast.error("کارمزد بانک نمی تواند بیشتر از ۱۰۰ درصد باشد");
                  } else {
                    setConditions({ ...conditions, BankWage: e });
                  }
                }}
                max={100}
              />
            </Box>
          </Box>
          <Box
            sx={{
              background: (theme) =>
                theme.palette.mode === "dark" ? "#351936" : "#F0F2F5",
            }}
            className=" py-6 pr-8  flex flex-col gap-0 border border-[#707070] rounded-[10px] mt-[15px]"
          >
            {" "}
            <Typography sx={{ fontWeight: "bold" }}>مبلغ طرح</Typography>
            <Box
              sx={{
                ".MuiInputBase-root": {
                  background: (theme) => theme.palette.background.paper,
                },
              }}
              className="grid mt-5 md:grid-cols-4 gap-5"
            >
              {/*           <TextInput
                  price={true}
                  number={true}
                  label="   حداقل مبلغ تهسیلات "
                  currentValue={conditions.MinimumAmount || ""}
                  change={(e) =>
                    setConditions({ ...conditions, MinimumAmount: e })
                  }
                />
 */}

              <TextInput
                price={true}
                number={true}
                label="       مبلغ تهسیلات "
                currentValue={conditions.PlanAmount || ""}
                change={(e) => setConditions({ ...conditions, PlanAmount: e })}
              />
            </Box>
          </Box>
          <Box
            sx={{
              background: (theme) =>
                theme.palette.mode === "dark" ? "#351936" : "#F0F2F5",
            }}
            className=" py-6 pr-8   border border-[#707070] rounded-[10px] mt-[15px]"
          >
            <Typography sx={{ fontWeight: "bold" }}> تنظیمات </Typography>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center w-auto px-4 py-2">
                <Checkbox
                  onClick={(e) =>
                    setConditions({
                      ...conditions,
                      NoPayment: !conditions?.NoPayment,
                    })
                  }
                  checked={conditions?.NoPayment}
                />
                <label className="mr-2 text-xs">
                  عدم پرداخت هزینه اعتبار سنجی پوشه و مدارک
                </label>
              </div>{" "}
              <div className="flex items-center w-auto px-4 py-2">
                <Checkbox
                  onClick={(e) =>
                    setConditions({
                      ...conditions,
                      AdminView: !conditions?.AdminView,
                    })
                  }
                  checked={conditions?.AdminView}
                />
                <label className="mr-2 text-xs"> عدم نمایش طرح در فرانت </label>
              </div>
            </div>
          </Box>
        </Paper>
      )}
    </div>
  );
};

export default Step4;
const GETWAY = [
  { id: 0, title: " بانک شهر" },
  { id: 1, title: " کیف پول آینده" },
  { id: 5, title: " بانک ملت" },
  /*   { id: 2, title: " کیف پول سایت" }, */
  /*   { id: 3, title: "  کیف پول سایت + بانک شهر" },
  { id: 4, title: "  کیف پول سایت + کیف پول آینده" }, */
];
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
