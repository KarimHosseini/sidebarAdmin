import { Box, Button, Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { TextInput } from "../../../../components/common";

import { baseUrl, DOWNLOAD_FILE } from "../../../../helpers/api-routes";

const Step2 = ({ info, data, setData, disable }) => {
  const { token } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);

  const [registerId, setRegisterId] = useState(null);
  const sumbitData = () => {
    var i = data.plan?.id;
    var d = data;
    if (info?.minRequest > data?.amount || info?.maxRequest < data?.amount) {
      toast.error(
        ` حداقل مبلغ قابل ثبت ${info?.minRequest?.toLocaleString(
          "en-US"
        )} و حداکثر ان ${info?.maxRequest?.toLocaleString(
          "en-US"
        )} تومان می باشد`
      );
    } else {
      /*    axiosInstance
        .put(
          `${baseUrl}/${EDIT_PLAN_LOAN}`,
          {
            planId: data.plan?.id,
            amount: data?.amount,
            userId: data?.userId,
            id: data.id,
            step: 1,
          },
          configReq(token)
        )
        .then((res) => {
          const { data } = res;
          setLoading(false);
          setRegisterId(data.data.id);
          toast.success("با موفقیت ساخته شد");
          setData(res?.data?.data);
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);

          setLoading(false);
        }); */
    }
  };

  useEffect(() => {
    if (registerId) {
      setData({ ...data, id: registerId });
    }
  }, [registerId]);

  return (
    <div className="w-full">
      <h3 className="font-bold text-xl">مشخصات طرح</h3>
      <div className="grid md:grid-cols-3 gap-3 flex-wrap">
        <Paper
          elevation={0}
          className="rounded-lg relative  border-[#dbdfea] border w-full col-span-2 py-6 md:px-5 px-2 flex flex-col  gap-6 mt-2 "
        >
          {disable ? (
            <Box
              sx={{
                zIndex: disable ? 9999999 : 0,
              }}
              className="absolute z-20 cursor-not-allowed bg-gray-100 opacity-40 w-full h-full top-0 right-0"
            ></Box>
          ) : (
            <></>
          )}
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-3 md:grid md:grid-cols-3  flex flex-col  gap-x-6 gap-y-9">
              <TextInput
                label=" تسهیلات انتخاب شده  "
                currentValue={info.title || ""}
                disabled={true}
              />

              <TextInput
                price={true}
                number={true}
                label=" مبلغ تسهیلات "
                currentValue={data.amount || ""}
                change={(e) => setData({ ...data, amount: e })}
                disabled={disable}
              />
              <div className="col-span-3 text-center md:text-right">
                <span className="text-sm text-blue-700">
                  اطلاعات تسهیلات طرحی
                </span>
              </div>
              <div className="flex justify-center md:justify-start">
                {info?.galleyId && (
                  <img
                    src={`${baseUrl}/${DOWNLOAD_FILE}/${info?.galleyId}`}
                    alt="logo"
                    style={{ width: "130px" }}
                  />
                )}
              </div>
              <div className="col-span-2">
                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  disabled
                  value={info?.description}
                />
              </div>
            </div>
            <div className="md:flex hidden w-full flex-col justify-start gap-3">
              {/*          <TextInput
                label="درگاه پرداختی"
                currentValue={
                  data?.plan?.conditions?.Gateway === 1
                    ? " کیف پول آینده"
                    : " بانک شهر" || ""
                }
                disabled
              />{" "} */}
            </div>
          </div>{" "}
          <div className="flex md:hidden w-full flex-col justify-start gap-3">
            {/*        <TextInput
              label="درگاه پرداختی"
              currentValue={
                data?.plan?.conditions?.Gateway === 1
                  ? " کیف پول آینده"
                  : " بانک شهر" || ""
              }
              disabled
            />{" "} */}
          </div>
        </Paper>
        <div className="flex flex-col w-full justify-end items-end gap-3">
          <Button
            onClick={sumbitData}
            sx={{ width: "200px" }}
            variant="contained"
            color="primary"
          >
            ثبت اطلاعات
          </Button>
          {/*       <Button
            onClick={handleSms}
            disabled={!registerId}
            sx={{ width: "200px" }}
            variant="contained"
            color="success"
          >
            ارسال پیامک ثبت نام طرح
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default Step2;
/*       <TextInput
                label="کارمزد طرح"
                currentValue={data?.plan?.conditions?.PlanAmount || ""}
                disabled
              />{" "}
              <TextInput
                label="نام بازاریاب"
                currentValue={data?.plan?.marketerName || ""}
                disabled
              />{" "}
              <TextInput
                price={true}
                number={true}
                label=" ارزش کمیسیون"
                currentValue={data?.plan?.commissionAmount || ""}
                disabled
              /> */
