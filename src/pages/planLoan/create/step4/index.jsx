import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Paper,
  Radio,
  TextField,
} from "@mui/material";
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
  baseUrl,
  CREATE_PLAN_LOAN_DOCUMENT,
  DOWNLOAD_FILE,
  EDIT_PLAN_LOAN,
  GET_PLAN_LOAN_DOCUMENT,
  SMS_PLAN_LOAN,
} from "../../../../helpers/api-routes";
import { configReq } from "../../../../helpers/functions";
import Revoke from "../revoke";
import NoAccess from "../../../../components/noAccess";

const Step4 = ({ data, setData, checkBank, changeStep, disabled }) => {
  const [files, setFiles] = useState();
  const { token } = useSelector((state) => state.user);
  const [docs, setDocs] = useState([]);
  const [selectedProductImage, setselectedProductImage] = useState();
  const [des, setDes] = useState("");
  const [open, setOpen] = useState();
  const [newAdd, setNewAdd] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [removePreview, setRemovePreview] = useState(1);
  const [openDelete, setOpenDelete] = useState(false);
  const roleHandler = (status) => {
    var d = { ...data };
    var plan = d.plan;
    setLoading(true);
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
          step: 3,
          documentValidation: status,
        },
        configReq(token)
      )
      .then((res) => {
        const { data } = res;
        setData({
          ...d,
          plan: plan,
          step: 3,
          documentValidation: status,
        });
        setLoading(false);
        toast.success("با موفقیت ثبت شد");
        setChecked(status);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
        setChecked(d.documentValidation);
      });
  };
  const sendDocumentRequest = () => {
    var fd = new FormData();
    fd.append("planLoanRequestId", data?.id);
    fd.append("step", 3);
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
        setLoading2(false);
        setNewAdd(true);
        setRemovePreview((r) => r + 1);
      })
      .catch((err) => {
        setLoading2(false);
        toast.error(err.response?.data?.message);
      });
    setDocs(tepm);
  };
  useEffect(() => {
    setChecked(data.documentValidation);
    axiosInstance(
      `${baseUrl}/${GET_PLAN_LOAN_DOCUMENT}?Page=1&Limit=2000&filter[0][key]=step&filter[0][value]=3&filter[0][operator]=eq&filter[1][key]=planLoanRequestId&filter[1][value]=${data?.id}&filter[1][operator]=eq`,
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
    setLoading3(true);
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
        setLoading3(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading3(false);
        /*  setLoading(false); */
      });
  };
  const { userPermissions } = useSelector((state) => state.relationals);
  if (!userPermissions?.planLoanRequest?.step3) {
    return <NoAccess noTitle={false} />;
  }
  return (
    <div className="w-full">
      {" "}
      <h3 className="font-bold text-xl">صحت سنجی فیزیکی مدارک</h3>
      <div className="md:grid md:grid-cols-5 gap-4">
        <Paper
          elevation={0}
          className="rounded-lg relative  border-[#dbdfea] border w-full col-span-1 py-6 md:px-5 px-2 flex flex-col gap-6 mt-2 "
        >
          {data?.state !== 2 ? (
            <>
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
            </>
          ) : (
            <></>
          )}
          <h3 className="font-bold text-lg">
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
          <div className="flex gap-3 items-center">
            <span className="text-xs text-blue-700">تایید مدارک </span>
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
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => roleHandler(checked)}
            disabled={loading}
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
              {data?.documentValidation || checked ? (
                <Box
                  sx={{
                    zIndex: data?.documentValidation || checked ? 9999999 : 0,
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
              multiline
              rows={3}
              value={des || ""}
              label="توضیحات نقص مدرک"
            />
            <UploadImage
              file={files}
              change={setFiles}
              selectedProductImage={selectedProductImage}
              setselectedProductImage={setselectedProductImage}
              removePreview={removePreview}
            />
            <div className="flex justify-end w-full">
              <Button
                sx={{ maxWidth: { md: "150px" } }}
                variant="contained"
                color="primary"
                fullWidth
                onClick={sendDocumentRequest}
                disabled={loading2}
              >
                {" "}
                {loading2 ? <CircularProgress /> : <> ثبت اطلاعات</>}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:max-h-96 md:overflow-y-auto">
            <div className="flex justify-between items-center px-4">
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
        <div className="flex flex-col items-end  justify-between py-2 gap-3">
          <div className="w-full flex flex-col   gap-3">
            {" "}
            <Revoke data={data} setData={setData} />
            <Dropdown
              change={(e) => setOpenDelete(e?.id)}
              value={steps2?.find((item) => item.id === data.planType)}
              title=" تغییر مرحله به "
              data={steps2}
              disabled={disabled || data?.documentValidation}
            />{" "}
          </div>
          <div className="flex flex-col items-end w-full md:w-fit  justify-end  gap-3">
            <Button
              onClick={() => handleSms(19)}
              disabled={
                !newAdd || data?.documentValidation || loading3 || disabled
              }
              sx={{ width: { md: "240px", xs: "100%" } }}
              variant="contained"
              color="warning"
            >
              ارسال پیامک ارسال نقص مدارک
            </Button>
            <Button
              disabled={!data?.documentValidation || loading3 || disabled}
              sx={{ width: { md: "240px", xs: "100%" } }}
              variant="contained"
              color="success"
              onClick={() => handleSms(26)}
            >
              ارسال پیامک صحت سنجی مدارک
            </Button>{" "}
          </div>
        </div>
      </div>
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
              label="توضیحات نقص مدرک"
            />
          </div>
        )}
      </Modal>{" "}
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

export default Step4;
const steps2 = [
  { title: "انتخاب طرح", id: 1 },
  { title: "پرداخت /دریافت مدارک", id: 2 },
];
