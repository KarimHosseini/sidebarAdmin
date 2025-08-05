import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, CircularProgress, Paper, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dropdown } from "../../../../components/common";
import axiosInstance from "../../../../components/dataFetch/axiosInstance";
import { Confirm } from "../../../../components/modals";
import {
  BANK_PLAN_LOAN,
  baseUrl,
  CREATE_PLAN_LOAN_DOCUMENT,
  GET_PLAN_LOAN_DOCUMENT,
  SMS_PLAN_LOAN,
} from "../../../../helpers/api-routes";
import { configReq } from "../../../../helpers/functions";
import Revoke from "../revoke";
import NoAccess from "../../../../components/noAccess";

const Step9 = ({
  steps,
  data,
  checkBank,
  payType,
  disabled,
  plans,
  changeStep,

  setData,
}) => {
  const { token } = useSelector((state) => state.user);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    if (!data?.id) return;
    axiosInstance(
      `${baseUrl}/${GET_PLAN_LOAN_DOCUMENT}?Page=1&Limit=2000&filter[0][key]=step&filter[0][value]=8&filter[0][operator]=eq&filter[1][key]=planLoanRequestId&filter[1][value]=${data?.id}&filter[1][operator]=eq`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        if (res.data?.data?.length > 0) {
          setDescription(
            res.data?.data[res.data?.data?.length - 1]?.description
          );
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  }, [data?.id]);
  const sendRequest = () => {
    const finded = plans?.find((item) => item?.id === data?.planId);
    axiosInstance
      .post(
        `${baseUrl}/${BANK_PLAN_LOAN}`,
        {
          id: data?.id,
          payType: 2,
          gateway: finded
            ? finded?.conditions?.Gateway
            : data?.plan?.conditions?.Gateway,
        },
        configReq(token)
      )
      .then((res) => {
        const { data } = res;
        window.open(
          `${process.env.REACT_APP_DOMAIN_URL}/payment/summery?ud=${data.data?.guid}&tp=1`,
          "_blank"
        );
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };

  const sendDocumentRequest = () => {
    var fd = new FormData();
    fd.append("planLoanRequestId", data?.id);
    fd.append("step", 3);
    fd.append("docType", 3);
    fd.append("description", description);
    fd.append("dateTime", new Date().toISOString());
    setLoading2(true);

    axiosInstance
      .post(`${baseUrl}/${CREATE_PLAN_LOAN_DOCUMENT}`, fd, configReq(token))
      .then((res) => {
        const { data } = res;
        toast.success("با موفقیت ثبت شد");
      })
      .catch((err) => {
        setLoading2(false);
        toast.error(err.response?.data?.message);
      });
  };
  const handleSms = (number) => {
    setLoading({ ...loading, [number]: true });
    axiosInstance
      .post(
        `${baseUrl}/${SMS_PLAN_LOAN}?target=${number}`,
        {
          id: data?.id,
        },
        configReq(token)
      )
      .then((res) => {
        const { data } = res;
        setLoading({ ...loading, [number]: false });
        toast.success("با موفقیت ارسال شد");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading({ ...loading, [number]: false });
        /*  setLoading(false); */
      });
  };
  const { userPermissions } = useSelector((state) => state.relationals);

  if (!userPermissions?.planLoanRequest?.step8) {
    return <NoAccess  noTitle={false}  />;
  }
  return (
    <div className="w-full">
      {" "}
      <h3 className="font-bold text-xl">
        {" "}
        تایید نهایی مدارک و شارژ کیف پول سایت{" "}
      </h3>
      <div className="flex justify-between md:grid grid-cols-3 items-end md:flex-nowrap flex-wrap">
        <Paper
          elevation={0}
          className="rounded-lg max-w-4xl relative  border-[#dbdfea] col-span-2 border w-full  py-6 md:px-5 px-2 grid md:grid-cols-2 gap-6 mt-2 "
        >
          {" "}
          {disabled ? (
            <Box
              sx={{
                zIndex: disabled ? 9999999 : 0,
              }}
              className="absolute z-20 cursor-not-allowed bg-gray-100 opacity-40 w-full h-full top-0 right-0"
            ></Box>
          ) : (
            <></>
          )}
          <div className="flex flex-col gap-4">
            {" "}
            <span className="text-xs text-blue-700"> شارژ کیف پول سایت</span>
            <div className=" flex justify-center items-center p-5 rounded border border-[#0000003b] flex-col gap-4">
              <span className="text-xs text-blue-700"> شارژ کیف پول سایت</span>
              <Box
                sx={{
                  background: (theme) => theme.palette.background.default,
                  padding:
                    data?.plan?.conditions?.Gateway === 0 ? "20px" : "30px 0px",
                }}
                className="rounded-full cursor-pointer"
                onClick={() => sendRequest()}
              >
                {data?.plan?.conditions?.Gateway === 0 ? (
                  <img src="/images/bank.svg" alt="" className="w-14" />
                ) :data?.plan?.conditions?.Gateway === 1 ?  (
                  <img src="/images/ayande.svg" alt="" className="w-36" />
                ) :  <img src="/images/melat.png" alt="" className="w-36" />}
              </Box>
            </div>{" "}
            <Box
              sx={{
                border: payType ? "1px solid green" : "1px solid red",
                background: payType ? "green" : "red",
                color: "#fff",
                width: { md: "200px", xs: "100%" },
                marginInline: "auto",
              }}
              className="flex justify-center items-center rounded-md gap-3  py-3"
            >
              {payType ? "پرداخت شده" : "پرداخت نشده"}
              <Box className="border-r border-white mr-3 pr-3">
                <RefreshIcon
                  onClick={() => checkBank(2)}
                  sx={{ color: "#fff", cursor: "pointer" }}
                />{" "}
              </Box>
            </Box>
          </div>{" "}
          <div className="flex flex-col gap-4">
            {" "}
            <span className="text-xs text-blue-700"> توضیحات نهایی</span>
            <TextField
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              fullWidth
              multiline
            ></TextField>
            <div className="flex justify-end">
              <Button
                disabled={!payType || loading2}
                variant="contained"
                color="primary"
                onClick={() => sendDocumentRequest()}
              >
                {loading2 ? <CircularProgress /> : <> ثبت اطلاعات</>}
              </Button>
            </div>
          </div>
        </Paper>{" "}
        <div className="flex flex-col items-end justify-between h-full gap-3 w-full md:w-fit mr-auto md:mt-0 mt-4">
          <Revoke data={data} setData={setData} />
          <div className="flex flex-col items-end justify-end gap-3">
            {" "}
            <Dropdown
              change={(e) => setOpenDelete(e?.id)}
              value={steps?.find((item) => item.id === data.planType)}
              title=" تغییر مرحله به "
              data={steps2}
              disabled={disabled}
            />
            <Button
              disabled={!payType || disabled}
              sx={{ width: { md: "240px", xs: "100%" } }}
              variant="contained"
              color="success"
              onClick={() => handleSms(24)}
            >
              ارسال پیامک تایید نهایی
            </Button>
          </div>
        </div>
      </div>
      <Confirm
        message={`آیا از تغییر  مرحله به ${
          steps2[openDelete - 1]?.title
        }  اطمینان دارید؟`}
        close={() => setOpenDelete(false)}
        submit={() => changeStep(openDelete)}
        open={openDelete}
      />
    </div>
  );
};

export default Step9;
const steps2 = [
  { title: "انتخاب طرح", id: 1 },
  { title: "پرداخت /دریافت مدارک", id: 2 },
  { title: "صحت سنجی", id: 3 },
  { title: "تعیین نوبت", id: 4 },
  { title: " تحویل مدارک به باجه", id: 5 },
  { title: " ارسال به بانک  ", id: 6 },
  { title: " تایید نهایی  ", id: 7 },
];
