import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Paper,
  Radio,
  TextField,
} from "@mui/material";
import fileSaver from "file-saver";
import NoAccess from "../../../../components/noAccess";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Dropdown,
  Modal,
  MultipleImages,
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

const Step6 = ({ steps, data, setData, changeStep, disabled }) => {
  const [files, setFiles] = useState();
  const { token } = useSelector((state) => state.user);
  const [docs, setDocs] = useState([]);
  const [selectedProductImage, setselectedProductImage] = useState();
  const [des, setDes] = useState("");
  const [open, setOpen] = useState();
  const [newAdd, setNewAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkedRole, setCheckedRole] = useState(false);
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
          step: 5,
          plan: plan,
          documentReceived: status,
          agrement: checkedRole,
        },
        configReq(token)
      )
      .then((res) => {
        const { data } = res;
        setData({
          ...d,
          step: 5,
          documentReceived: status,
        });
        setLoading(false);
        toast.success("با موفقیت ثبت شد");
        setChecked(status);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
        setChecked(d.documentReceived);
      });
  };
  const sendDocumentRequest = () => {
    var fd = new FormData();
    fd.append("planLoanRequestId", data?.id);
    fd.append("step", 5);
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
    setChecked(data.documentReceived);
    setCheckedRole(data?.agrement);
    axiosInstance(
      `${baseUrl}/${GET_PLAN_LOAN_DOCUMENT}?Page=1&Limit=2000&filter[0][key]=step&filter[0][value]=5&filter[0][operator]=eq&filter[1][key]=planLoanRequestId&filter[1][value]=${data?.id}&filter[1][operator]=eq`,
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
  const handleDownload = () => {
    fileSaver.saveAs("/images/agreement.pdf", "agreement.pdf");
  };
  const { userPermissions } = useSelector((state) => state.relationals);
  if (!userPermissions?.planLoanRequest?.step5) {
    return <NoAccess noTitle={false} />;
  }
  return (
    <div className="w-full">
      {" "}
      <h3 className="font-bold text-xl"> تحویل مدارک به باجه</h3>
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
          <div className="flex gap-4 items-center justify-center">
            <span className="text-xs  text-blue-700">پذیرش قوانین </span>
            <FormControlLabel
              control={<Checkbox checked={checkedRole} />}
              onChange={() => {
                setCheckedRole(!checkedRole);
              }}
              label={<h2 className=" text-[0.78rem]"> بله</h2>}
            />
          </div>
          <Button
            onClick={() => handleDownload()}
            sx={{ maxWidth: "140px", marginInline: "auto" }}
            variant="outlined"
            color="warning"
          >
            پرینت قوانین تسهیلات
          </Button>
          <div className="flex gap-3 items-center">
            <span className="text-xs text-blue-700"> تایید مدارک در باجه </span>
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => roleHandler(checked)}
            disabled={loading || !checkedRole}
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
              {data?.documentReceived || checked ? (
                <Box
                  sx={{
                    zIndex: data?.documentReceived || checked ? 9999999 : 0,
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
        <div className="flex flex-col items-end justify-between gap-3 py-3">
          <div className="flex flex-col w-full gap-3">
            {" "}
            <Revoke data={data} setData={setData} />
            <Dropdown
              change={(e) => setOpenDelete(e?.id)}
              value={steps?.find((item) => item.id === data.planType)}
              title=" تغییر مرحله به "
              data={steps2}
              disabled={disabled || data?.documentReceived}
            />
          </div>

          <div className="flex flex-col  w-full md:w-fit  py-2 items-end justify-end gap-3">
            {" "}
            <Button
              disabled={!newAdd || disabled}
              onClick={() => handleSms(26)}
              sx={{ width: { md: "240px", xs: "100%" } }}
              variant="contained"
              color="warning"
            >
              ارسال پیامک ارسال نقص مدارک
            </Button>
            <Button
              disabled={!data?.documentReceived || disabled}
              onClick={() => handleSms(21)}
              sx={{ width: { md: "240px", xs: "100%" } }}
              variant="contained"
              color="success"
            >
              ارسال پیامک تایید مدارک
            </Button>
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

export default Step6;
const steps2 = [
  { title: "انتخاب طرح", id: 1 },
  { title: "پرداخت /دریافت مدارک", id: 2 },
  { title: "صحت سنجی", id: 3 },
  { title: "تعیین نوبت", id: 4 },
];
