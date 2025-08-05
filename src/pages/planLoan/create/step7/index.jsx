import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Paper,
  Radio,
  TextField,
} from "@mui/material";
import NoAccess from "../../../../components/noAccess";

import RefreshIcon from "@mui/icons-material/Refresh";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Dropdown,
  Modal,
  TextInput,
  UploadImage,
} from "../../../../components/common";
import axiosInstance from "../../../../components/dataFetch/axiosInstance";
import { Confirm } from "../../../../components/modals";
import {
  BANK_PLAN_LOAN,
  baseUrl,
  CREATE_PLAN_LOAN_DOCUMENT,
  DOWNLOAD_FILE,
  EDIT_PLAN_LOAN,
  GET_PLAN_LOAN_DOCUMENT,
  SMS_PLAN_LOAN,
} from "../../../../helpers/api-routes";
import { configReq } from "../../../../helpers/functions";
import Revoke from "../revoke";

const Step7 = ({
  steps,
  data,
  setData,
  changeStep,
  disabled,
  payType,
  checkBank,
}) => {
  const [files, setFiles] = useState();
  const { token } = useSelector((state) => state.user);
  const [docs, setDocs] = useState([]);
  const [selectedProductImage, setselectedProductImage] = useState();
  const [des, setDes] = useState("");
  const [open, setOpen] = useState();
  const [newAdd, setNewAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [branchId, setBranchId] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);

  const [removePreview, setRemovePreview] = useState(1);
  const roleHandler = (status) => {
    var d = { ...data };
    setLoading(true);
    var plan = d.plan;
    delete d.plan;
    delete d.branchs;
    delete d.updateHistory;
    delete d.updatesHistory;
    delete d.user;
    delete d.updatedBy;
    delete d.knowType;
    delete d.createdBy;
    delete d.createdByName;
    delete d.updatedByName;
    delete d.revokeDesc;
    delete d.StepComment;

    axiosInstance
      .put(
        `${baseUrl}/${EDIT_PLAN_LOAN}`,
        {
          ...d,
          step: 6,
          /*    plan: plan, */
          bankConfirm: status,
          bankBranchId: branchId,
          endWage: !checked2,
        },
        configReq(token)
      )
      .then((res) => {
        const { data } = res;
        setData({
          ...d,

          ...res.data?.data,
          step: 6,
          bankConfirm: status,
          endWage: !checked2,
        });
        setLoading(false);
        toast.success("با موفقیت ثبت شد");
        setChecked(status);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
        setChecked(d.bankConfirm);
      });
  };
  const sendDocumentRequest = () => {
    var fd = new FormData();
    fd.append("planLoanRequestId", data?.id);
    fd.append("step", 6);
    fd.append("docType", 3);
    fd.append("description", des);
    fd.append("dateTime", new Date().toISOString());
    var tepm = [...docs];
    setLoading2(true);
    if (selectedProductImage) fd.append("fromGallery", selectedProductImage);
    fd.append("files", files);
    axiosInstance
      .post(`${baseUrl}/${CREATE_PLAN_LOAN_DOCUMENT}`, fd, configReq(token))
      .then((res) => {
        const { data } = res;
        tepm.unshift(res.data.data);
        toast.success("با موفقیت ثبت شد");
        setDes("");
        setselectedProductImage();
        setFiles();
        setNewAdd(true);
        setRemovePreview((r) => r + 1);
        setLoading2(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading2(false);
      });
    setDocs(tepm);
  };
  useEffect(() => {
    setChecked(data.bankConfirm);
    setChecked2(data.endWage === false);
    axiosInstance(
      `${baseUrl}/${GET_PLAN_LOAN_DOCUMENT}?Page=1&Limit=2000&filter[0][key]=step&filter[0][value]=6&filter[0][operator]=eq&filter[1][key]=planLoanRequestId&filter[1][value]=${data?.id}&filter[1][operator]=eq`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setDocs(res.data?.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  }, []);
  const handleSms = (number) => {
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
        toast.success("با موفقیت ارسال شد");
        setNewAdd(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);

        /*  setLoading(false); */
      });
  };

  useEffect(() => {
    if (data?.bankBranchId) setBranchId(data?.bankBranchId);
  }, [data]);
  const { userPermissions } = useSelector((state) => state.relationals);

  const handleSms2 = (number, type, getWay) => {
    axiosInstance
      .post(
        `${baseUrl}/${BANK_PLAN_LOAN}`,
        {
          id: data?.id,
          payType: 3,
          gateway: getWay,
          target: number,
        },
        configReq(token)
      )
      .then((res) => {
        toast.success("با موفقیت ارسال شد");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };
  if (!userPermissions?.planLoanRequest?.step6) {
    return <NoAccess noTitle={false} />;
  }
  return (
    <div className="w-full">
      {" "}
      <h3 className="font-bold text-xl">ارسال مدارک به بانک</h3>
      <div className="md:grid md:grid-cols-5 gap-4">
        <Paper
          elevation={0}
          className="rounded-lg relative  border-[#dbdfea] border w-full col-span-1 py-6 md:px-5 px-2 flex flex-col gap-6 mt-2 "
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
          <h3 className="font-bold text-lg">
            {" "}
            شماره سریال تسهیلات : {data?.id}
          </h3>{" "}
          <TextInput
            InputLabelProps={{ shrink: true }}
            price={true}
            number={true}
            disabled
            currentValue={data?.amount || ""}
            label="  مبلغ تسهیلات"
          />
          <Dropdown
            title="  شعبه بانک"
            data={data?.branchs}
            value={data?.branchs?.find((item) => item?.id === branchId)}
            change={(e) => setBranchId(e?.id)}
          />
          {/*        <div className="flex gap-4 items-center">
            <span className="text-xs  text-blue-700">پذیرش قوانین </span>
            <FormControlLabel
              control={<Checkbox checked={checkedRole} />}
              onChange={() => {
                setCheckedRole(!checkedRole);
              }}
              label={<h2 className=" text-[0.78rem]"> بله</h2>}
            />
          </div> */}
          {/*          <Button
            onClick={() => handleDownload()}
            sx={{ maxWidth: "140px", marginInline: "auto" }}
            variant="outlined"
            color="warning"
          >
            پرینت قوانین تسهیلات
          </Button> */}
          <div className="flex gap-3 items-center">
            <span className="text-xs text-blue-700">تایید مدارک در بانک</span>
            <FormControlLabel
              onClick={() => {
                setChecked(true);
              }}
              value="male"
              control={<Radio size="small" checked={checked} />}
              label=" بله"
              sx={{ zIndex: 200 }}
            />{" "}
            <FormControlLabel
              onClick={() => {
                setChecked(false);
              }}
              value="male"
              control={<Radio size="small" checked={!checked} />}
              label=" خیر"
              sx={{ zIndex: 200 }}
            />
          </div>{" "}
          <div className="flex gap-3 items-center">
            <span className="text-xs text-blue-700">
              {" "}
              پرداخت کارمزد نقدی:‌{" "}
            </span>
            <FormControlLabel
              onClick={() => {
                setChecked2(true);
              }}
              value="male"
              control={<Radio size="small" checked={checked2} />}
              label=" بله"
              sx={{ zIndex: 200 }}
            />{" "}
            <FormControlLabel
              onClick={() => {
                setChecked2(false);
              }}
              value="male"
              control={<Radio size="small" checked={!checked2} />}
              label=" خیر"
              sx={{ zIndex: 200 }}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => roleHandler(checked)}
            disabled={loading || !branchId}
          >
            {loading ? <CircularProgress /> : <> اعمال تغییرات</>}
          </Button>
        </Paper>{" "}
        <Paper
          elevation={0}
          className="rounded-lg relative  border-[#dbdfea] border w-full col-span-3 py-6 md:px-5 px-2 grid md:grid-cols-2 gap-6 mt-2 "
        >
          {data?.state !== 2 ? (
            <>
              {" "}
              {data?.bankConfirm || checked ? (
                <Box
                  sx={{
                    zIndex: data?.bankConfirm || checked ? 9999999 : 0,
                  }}
                  className="absolute z-20 cursor-not-allowed bg-gray-100 opacity-40 w-full h-full top-0 right-0"
                ></Box>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}

          <div className="flex flex-col gap-5">
            <TextField
              onChange={(e) => setDes(e.target.value)}
              value={des || ""}
              multiline
              rows={3}
              label="توضیحات نقص مدارک"
            />
            <UploadImage
              file={files}
              change={setFiles}
              selectedProductImage={selectedProductImage}
              setselectedProductImage={setselectedProductImage}
              removePreview={removePreview}
            />
            <Button
              sx={{ maxWidth: { md: "150px" }, marginLeft: "auto" }}
              variant="contained"
              color="primary"
              fullWidth
              onClick={sendDocumentRequest}
            >
              ثبت اطلاعات
            </Button>
          </div>
          <div className="flex flex-col gap-3 md:max-h-96 md:overflow-y-auto">
            <div className="flex justify-between items-center px-4 ">
              <span className="text-xs">تاریخ ارسال نقص</span>
              <span className="text-xs">مشاهده </span>
            </div>
            {docs?.map((item, index) => (
              <Box
                sx={{
                  transition: "all 300ms ease",
                  ":hover": {
                    boxShadow: "0 0 6px #8a8a8a57",
                  },
                }}
                key={index}
                className="flex cursor-pointer justify-between items-center border rounded-md px-4 py-2"
                onClick={() => setOpen(item)}
              >
                <span className="text-xs">
                  {" "}
                  {new Date(item?.dateTime).toLocaleDateString("fa-IR")}
                </span>
                <span className="text-xs">
                  {" "}
                  {item?.description?.slice(0, 10)} ...{" "}
                </span>
              </Box>
            ))}
          </div>
        </Paper>
        <div className="flex flex-col items-end justify-between gap-3 py-3">
          <Revoke data={data} setData={setData} />

          <Dropdown
            change={(e) => setOpenDelete(e?.id)}
            value={steps?.find((item) => item.id === data.planType)}
            title=" تغییر مرحله به "
            data={steps2}
            disabled={disabled || data?.bankConfirm}
          />
          <div className="flex flex-col w-full md:w-fit items-end  py-2 justify-end gap-3">
            {" "}
            <Button
              disabled={!newAdd || disabled}
              onClick={() => handleSms(19)}
              sx={{ width: { md: "240px", xs: "100%" } }}
              variant="contained"
              color="warning"
            >
              ارسال پیامک ارسال نقص مدارک
            </Button>
            <Button
              disabled={!data?.bankConfirm || disabled}
              onClick={() => handleSms(22)}
              sx={{ width: { md: "240px", xs: "100%" } }}
              variant="contained"
              color="success"
            >
              ارسال پیامک تایید مدارک
            </Button>
          </div>
        </div>
      </div>
      {checked2 && (
        <div className="md:grid flex flex-col md:grid-cols-7 gap-4 mt-4">
          <div className="flex items-center">
            {" "}
            <span className="text-sm text-blue-700">درکاه پرداخت نقدی</span>
          </div>
          <Dropdown
            change={(e) => setData({ ...data, planType: e?.id })}
            value={Gates2?.find((item) => item.id === data.planType)}
            title=" درگاه پرداخت "
            data={Gates2}
            disabled={disabled}
          />{" "}
          <Button
            onClick={() => handleSms2(28, 0, data.planType)}
            className="col-span-2"
            variant="contained"
            color="success"
            disabled={disabled || loading[17] || payType[4]}
          >
            ارسال لینک پرداخت به پیامک و ایمیل
          </Button>
          <Box
            sx={{
              border: payType[4] ? "1px solid green" : "1px solid red",
              background: payType[4] ? "green" : "red",
              color: "#fff",
            }}
            className="flex justify-center items-center rounded-md gap-3 md:py-0 py-3"
          >
            {payType[4] ? "پرداخت شده" : "پرداخت نشده"}
            <Box className="border-r border-white mr-3 pr-3">
              <RefreshIcon
                onClick={() => checkBank(3)}
                sx={{ color: "#fff", cursor: "pointer" }}
              />{" "}
            </Box>
          </Box>
        </div>
      )}
      <Modal
        open={open}
        close={() => {
          setOpen(false);
        }}
        title=" نقص مدرک"
        autoWidth={false}
      >
        {open && (
          <div className="flex flex-col gap-7">
            <TextField
              disabled
              label={"تاریخ ثبت مدرک"}
              value={new Date(open?.dateTime).toLocaleDateString("fa-IR")}
            />
            <img
              loading="lazy"
              className="w-full h-auto max-w-md max-h-[100%] lazyload blur-up"
              src={`${baseUrl}/${DOWNLOAD_FILE}/${open?.galleryId}`}
              alt=""
            />
            <TextField
              disabled
              value={open?.description}
              multiline
              rows={3}
              label="توضیحات نقص مدارک"
            />
          </div>
        )}
      </Modal>
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

export default Step7;
const steps2 = [
  { title: "انتخاب طرح", id: 1 },
  { title: "پرداخت /دریافت مدارک", id: 2 },
  { title: "صحت سنجی", id: 3 },
  { title: "تعیین نوبت", id: 4 },
  { title: " تحویل مدارک به باجه", id: 5 },
];
const Gates2 = [
  { id: 0, title: "بانک شهر" },
  /*   { id: 2, title: "کیف پول سایت " },
   */ { id: 5, title: "بانک ملت" },
];
