import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Skeleton,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, UploadImage } from "../../../../components/common";
import axiosInstance from "../../../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  CREATE_LEND_TECH_DOCUMENT,
  DOWNLOAD_FILE,
  EDIT_PLAN_LOAN,
  GET_LEND_TECH_DOCUMENT,
  GET_LEND_TECH_FIELD,
} from "../../../../helpers/api-routes";
import { configReq } from "../../../../helpers/functions";
import Generator from "./generator";

const CreateFrom = ({ data, setData, stepInfo }) => {
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
  const [feilds, setFeilds] = useState([]);
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
    fd.append("step", stepInfo.step);
    fd.append("docType", stepInfo.step);
    fd.append("description", des);
    fd.append("dateTime", new Date().toISOString());
    var tepm = [...docs];
    setLoading2(true);
    if (selectedProductImage) fd.append("fromGallery", selectedProductImage);
    fd.append("files", files);
    axiosInstance
      .post(`${baseUrl}/${CREATE_LEND_TECH_DOCUMENT}`, fd, configReq(token))
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
    if (stepInfo) {
      setLoading3(true);
      axiosInstance(
        `${baseUrl}/${GET_LEND_TECH_DOCUMENT}?Page=1&Limit=2000&filter[0][key]=step&filter[0][value]=${stepInfo.step}&filter[0][operator]=eq&filter[1][key]=planLoanRequestId&filter[1][value]=${data?.id}&filter[1][operator]=eq`,
        configReq(token)
      )
        .then((res) => {
          setDocs(res.data?.data);
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
        });
      axiosInstance(
        `${baseUrl}/${GET_LEND_TECH_FIELD}?Page=1&Limit=2000&filter[0][key]=lendTechStepId&filter[0][value]=${stepInfo.id}&filter[0][operator]=eq`,
        configReq(token)
      )
        .then((res) => {
          setFeilds(res.data?.data);
          setLoading3(false);
        })
        .catch((err) => {
          setLoading3(false);

          toast.error(err.response?.data?.message);
        });
    }
  }, []);

  return (
    <div className="w-full">
      {" "}
      <h3 className="font-bold text-xl">{stepInfo.title}</h3>
      <div className="md:grid md:grid-cols-5 gap-4">
        <Paper
          elevation={0}
          className="rounded-lg relative  border-[#dbdfea] border w-full col-span-1 py-6 md:px-5 px-2 flex flex-col gap-6 mt-2 "
        >
          <h3 className="font-bold text-lg">
            شماره سریال تسهیلات : {data?.id}
          </h3>
          {loading3 ? (
            <>
              <Skeleton variant="rounded" height={200} width={"200"} />
            </>
          ) : (
            <Generator feilds={feilds} data={data} setData={setData} />
          )}

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
          <div className="flex flex-col gap-5">
            <TextField
              onChange={(e) => setDes(e.target.value)}
              multiline
              rows={3}
              value={des || ""}
              label="توضیحات مرحله"
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
              <span className="text-xs">تاریخ ارسال توضیحات</span>
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
        <div className="flex flex-col items-end  justify-between py-2 gap-3"></div>
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
    </div>
  );
};

export default CreateFrom;
const steps2 = [
  { title: "انتخاب طرح", id: 1 },
  { title: "پرداخت /دریافت مدارک", id: 2 },
];
