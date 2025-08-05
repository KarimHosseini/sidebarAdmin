import { Alert, Button, CircularProgress, Paper } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Dropdown, TextInput } from "../../../../components/common";
import RefreshIcon from "@mui/icons-material/Refresh";
import axiosInstance from "../../../../components/dataFetch/axiosInstance";
import {
  BANK_PLAN_LOAN,
  baseUrl,
  CREDIT_SCORE_PLAN_LOAN,
  GET_PLAN_LOAN_SETTING,
  SCORE_REPORT_PLAN_LOAN,
  SMS_PLAN_LOAN,
  STATUS_CHECK_PLAN_LOAN,
  VERIFY_CODE_PLAN_LOAN,
} from "../../../../helpers/api-routes";
import { configReq } from "../../../../helpers/functions";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Revoke from "../revoke";
import { Confirm } from "../../../../components/modals";
import NoAccess from "../../../../components/noAccess";

const Step3 = ({
  getWays,
  datas,
  setDatas,
  checkBank,
  userData,
  payType,
  disabled,
  changeStep,
}) => {
  const [data, setData] = useState({ planType2: 5, planType: 5 });
  const { token } = useSelector((state) => state.user);
  const [ingo, setInfo] = useState({});
  const [loading, setLoading] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
  const [code, setCode] = useState("");
  const [codeSended, setCodeSended] = useState(false);
  const [check, setCheck] = useState(false);
  useEffect(() => {
    axiosInstance(`${baseUrl}/${GET_PLAN_LOAN_SETTING}`, configReq(token))
      .then((res) => {
        setInfo(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  }, []);
  const handleSms = (number) => {
    setLoading({ ...loading, [number]: true });
    axiosInstance
      .post(
        `${baseUrl}/${SMS_PLAN_LOAN}?target=${number}`,
        {
          id: datas?.id,
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
  const handleSms2 = (number, type, getWay) => {
    setLoading({ ...loading, [number]: true });
    axiosInstance
      .post(
        `${baseUrl}/${BANK_PLAN_LOAN}`,
        {
          id: datas?.id,
          payType: type,
          gateway: getWay,
          target: number,
        },
        configReq(token)
      )
      .then((res) => {
        const { data } = res;
        toast.success("با موفقیت ارسال شد");
        setLoading({ ...loading, [number]: false });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading({ ...loading, [number]: false });
      });
  };
  const handleBank = (number, gateway, price, name) => {
    axiosInstance
      .post(
        `${baseUrl}/${BANK_PLAN_LOAN}`,
        {
          id: datas?.id,
          payType: number,
          gateway: gateway,
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
  const checkCredit = () => {
    setLoading({ credit: true });
    axiosInstance
      .get(
        `${baseUrl}/${CREDIT_SCORE_PLAN_LOAN}?id=${datas?.id}`,

        configReq(token)
      )
      .then((res) => {
        const { data } = res;
        setLoading({ credit: false });

        setCodeSended(true);
      })
      .catch((err) => {
        setLoading({ credit: false });
        toast.error(err.response?.data?.message);
      });
  };
  const handleCheck = () => {
    setLoading({ check: true });
    axiosInstance
      .get(
        `${baseUrl}/${VERIFY_CODE_PLAN_LOAN}?id=${datas?.id}&code=${code}`,

        configReq(token)
      )
      .then((res) => {
        const { data } = res;
        setLoading({ check: false });
      })
      .catch((err) => {
        setLoading({ check: false });
        toast.error(err.response?.data?.message);
      });
  };
  const handleVerfiy = () => {
    setLoading({ verfiy: true });
    axiosInstance
      .get(
        `${baseUrl}/${STATUS_CHECK_PLAN_LOAN}?id=${datas?.id}`,

        configReq(token)
      )
      .then((res) => {
        const { data } = res;
        setLoading({ verfiy: false });
        setCheck(res.data?.data?.result?.hasError === false);
        toast.success(res.data?.data?.result?.data?.statusTitle);
      })
      .catch((err) => {
        setLoading({ verfiy: false });
        toast.error(err.response?.data?.message);
      });
  };
  const handleExport = () => {
    setLoading({ export: true });
    axiosInstance
      .get(
        `${baseUrl}/${SCORE_REPORT_PLAN_LOAN}?id=${datas?.id}`,

        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/pdf",
          },
        }
      )
      .then((res) => {
        const { data } = res;
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `گزارش اعتبار سنجی.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        setLoading({ export: false });
      })
      .catch((err) => {
        setLoading({ export: false });
        toast.error(err.response?.data?.message);
      });
  };
  useEffect(() => {
    axiosInstance
      .get(
        `${baseUrl}/${STATUS_CHECK_PLAN_LOAN}?id=${datas?.id}`,

        configReq(token)
      )
      .then((res) => {
        setCheck(res.data?.data?.result?.hasError === false);
      })
      .catch((err) => {});
  }, []);
  const { userPermissions } = useSelector((state) => state.relationals);
  if (!userPermissions?.planLoanRequest?.step2) {
    return <NoAccess noTitle={false} />;
  }
  return (
    <div className="w-full">
      <div className="flex md:justify-between flex-wrap gap-3">
        <h3 className="font-bold text-xl">
          {" "}
          پرداخت هزینه ثبت نام و دریافت مدارک
        </h3>
        <div className="md:w-[200px] flex flex-col gap-2">
          {" "}
          <Revoke data={datas} setData={setDatas} />{" "}
          <Dropdown
            change={(e) => setOpenDelete(e?.id)}
            value={steps2?.find((item) => item.id === data.planType)}
            title=" تغییر مرحله به "
            data={steps2}
            disabled={disabled}
          />
        </div>
      </div>
  
      <Paper
        elevation={0}
        className="rounded-lg re  border-[#dbdfea] border w-full col-span-2 py-6 md:px-5 px-2 flex flex-col gap-6 mt-2 "
      >
        <div className="w-full">
          <span className="text-xs">هزینه پوشه مدارک</span>
        </div>
        <div className="md:grid flex flex-col md:grid-cols-7 gap-4">
          <div className="flex items-center">
            {" "}
            <span className="text-sm text-blue-700">درگاه پرداخت </span>
          </div>
          <Dropdown
            change={(e) => setData({ ...data, planType: e?.id })}
            value={Gates2?.find((item) => item.id === data.planType)}
            title=" درگاه پرداخت "
            data={Gates2}
            disabled={disabled}
          />{" "}
          <TextInput
            price={true}
            number={true}
            label=" هزینه ثبت نام"
            currentValue={ingo.documentPrice || ""}
            disabled
          />
          <Button
            onClick={() =>
              handleBank(
                0,
                data.planType,
                ingo.documentPrice,
                "هزینه پوشه مدارک"
              )
            }
            variant="contained"
            color="primary"
            disabled={disabled /* || payType[1] *//*  || !check */}
          >
            پرداخت هزینه بصورت آنلاین
          </Button>
          <Button
            onClick={() => handleSms2(17, 0, data.planType)}
            className="col-span-2"
            variant="contained"
            color="success"
            disabled={disabled || loading[17] || payType[1]}
          >
            ارسال لینک پرداخت به پیامک و ایمیل
          </Button>
          <Box
            sx={{
              border: payType[1] ? "1px solid green" : "1px solid red",
              background: payType[1] ? "green" : "red",
              color: "#fff",
            }}
            className="flex justify-center items-center rounded-md gap-3 md:py-0 py-3"
          >
            {payType[1] ? "پرداخت شده" : "پرداخت نشده"}
            <Box className="border-r border-white mr-3 pr-3">
              <RefreshIcon
                onClick={() => checkBank(0)}
                sx={{ color: "#fff", cursor: "pointer" }}
              />{" "}
            </Box>
          </Box>
        </div>
      </Paper>{" "}
      <Paper
        elevation={0}
        className="rounded-lg re  border-[#dbdfea] border w-full col-span-2 py-6 md:px-5 px-2 flex flex-col gap-6 mt-2 "
      >
        <div></div>
        <div className="grid md:grid-cols-7 gap-4">
          <div className="flex items-center">
            {" "}
            <span className="text-sm text-blue-700"> لینک مدارک</span>
          </div>
          <div></div>
          <div></div>
          <div></div>
          <Button
            onClick={() => handleSms(25)}
            className="col-span-2"
            variant="contained"
            color="success"
            disabled={loading[25]}
          >
            ارسال لینک مدارک به پیامک و ایمیل
          </Button>
          <div></div>
          {/*      <Box
            sx={{
              border: status[1] ? "1px solid green" : "1px solid red",
              color: status[1] ? "green" : "red",
            }}
            className="flex justify-center items-center rounded-md gap-3"
          >
            {status[1] ? "پرداخت شده" : "پرداخت نشده"}
            <RefreshIcon sx={{ color: "#001ee4" , cursor:"pointer" }} />
          </Box> */}
        </div>
      </Paper>
      <Alert sx={{ mt: 2 }} variant="outlined" color="info">
        زمان اعتبار لینک پرداختی ۴۸ ساعت میباشد
      </Alert>
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

export default Step3;
const Gates = [
  { id: 0, title: "بانک شهر" },
  { id: 2, title: "کیف پول سایت " },
  { id: 5, title: "بانک ملت" },
];
const Gates2 = [
  { id: 0, title: "بانک شهر" },
  { id: 2, title: "کیف پول سایت " },
  { id: 5, title: "بانک ملت" },
];
const steps2 = [{ title: "انتخاب طرح", id: 1 }];
//<Paper
//elevation={0}
//className="rounded-lg re  border-[#dbdfea] border w-full col-span-2 py-6 md:px-5 px-2 flex flex-col gap-6 mt-2 "
//>
//<div className="w-full">
//  <span className="text-xs"> هزینه اعتبارسنجی</span>
//</div>
//<div className="md:grid flex flex-col md:grid-cols-7 gap-4">
//  <div className="flex items-center">
//    {" "}
//    <span className="text-sm text-blue-700"> درگاه پرداخت </span>
//  </div>
//  <Dropdown
//    change={(e) => setData({ ...data, planType2: e?.id })}
//    value={Gates.find((item) => item?.id === data?.planType2)}
//    title=" درگاه پرداخت "
//    data={Gates}
//    disabled={payType[2]}
//  />{" "}
//  <TextInput
//    price={true}
//    number={true}
//    label=" هزینه ثبت نام"
//    currentValue={ingo.validationPrice || ""}
//    disabled
//  />
//  <Button
//    onClick={() =>
//      handleBank(1, data.planType2, data.planType2, "هزینه اعتبارسنجی")
//    }
//    variant="contained"
//    color="primary"
//    disabled={payType[2]}
//  >
//    پرداخت هزینه بصورت آنلاین
//  </Button>
//  <Button
//    onClick={() => handleSms2(18, 1, data.planType2)}
//    className="col-span-2"
//    variant="contained"
//    color="success"
//    disabled={payType[2] || loading[25]}
//  >
//    ارسال لینک پرداخت به پیامک و ایمیل
//  </Button>
//  <Box
//    sx={{
//      border: payType[2] ? "1px solid green" : "1px solid red",
//      background: payType[2] ? "green" : "red",
//      color: "#fff",
//    }}
//    className="flex justify-center items-center rounded-md gap-3 md:py-0 py-3"
//    onClick={() => checkBank(1)}
//  >
//    {payType[2] ? "پرداخت شده" : "پرداخت نشده"}
//    <Box className="border-r border-white mr-3 pr-3">
//      <RefreshIcon sx={{ color: "#fff", cursor: "pointer" }} />
//    </Box>
//  </Box>
//</div>
//</Paper>{" "}
//<Paper
//elevation={0}
//className="rounded-lg re  border-[#dbdfea] border w-full col-span-2 py-6 md:px-5 px-2 flex flex-col gap-6 mt-2 "
//>
//<div className="w-full">
//  <span className="text-xs"> اعتبارسنجی</span>
//</div>
//<div className="md:grid flex flex-col md:grid-cols-7 gap-4">
//  <Button
//    onClick={() => checkCredit()}
//    variant="contained"
//    color="primary"
//    disabled={
//      loading.credit/*  || !payType[2] */ || datas?.creditScoreStep > 0
//    }
//  >
//    {loading.credit ? (
//      <CircularProgress />
//    ) : (
//      <> ارسال در خواست اعتبار سنجی</>
//    )}
//  </Button>
//  <TextInput
//    number={true}
//    label=" کد"
//    noSepreate
//    change={setCode}
//    currentValue={code}
//    disabled={!codeSended/*  || !payType[2] */}
//  />
//  <Button
//    onClick={() => handleCheck()}
//    variant="contained"
//    color="primary"
//    disabled={
//      !code ||
//      loading.check ||
//      !payType[2] ||
//      datas?.creditScoreStep > 1
//    }
//  >
//    {" "}
//    {loading.check ? <CircularProgress /> : <> اعتبار سنجی</>}
//  </Button>{" "}
//  <Box
//    sx={{
//      border:
//        datas?.creditScoreStep > 2
//          ? "1px solid #ccc"
//          : check
//          ? "1px solid green"
//          : "1px solid red",
//      background:
//        datas?.creditScoreStep > 2 ? "#ccc" : check ? "green" : "red",
//      color: "#fff",
//    }}
//    className="flex justify-center items-center rounded-md gap-3 md:py-0 py-3"
//    onClick={() => {
//      if (datas?.creditScoreStep <= 2) {
//        handleVerfiy();
//      }
//    }}
//  >
//    {" "}
//    {loading.verfiy ? <CircularProgress /> : <></>}
//    برسی
//    <Box className="border-r border-white mr-3 pr-3">
//      <RefreshIcon sx={{ color: "#fff", cursor: "pointer" }} />
//    </Box>
//  </Box>
//  <Button
//    onClick={() => handleExport()}
//    className="col-span-2"
//    variant="contained"
//    color="success"
//    disabled={loading.export/*  || !payType[2] */}
//  >
//    {" "}
//    {loading.export ? <CircularProgress /> : <></>}
//    دانلود گزارش
//  </Button>
//</div>
//</Paper>{" "}