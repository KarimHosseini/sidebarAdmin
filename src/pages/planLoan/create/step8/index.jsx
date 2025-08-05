import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dropdown } from "../../../../components/common";
import axiosInstance from "../../../../components/dataFetch/axiosInstance";
import { Confirm } from "../../../../components/modals";
import {
  baseUrl,
  EDIT_PLAN_LOAN,
  SMS_PLAN_LOAN,
} from "../../../../helpers/api-routes";
import { configReq } from "../../../../helpers/functions";
import Revoke from "../revoke";
import NoAccess from "../../../../components/noAccess";

const Step8 = ({ steps, data, setData, disabled, changeStep }) => {
  const { token } = useSelector((state) => state.user);
  const [checkedRole, setCheckedRole] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const roleHandler = (status) => {
    var d = { ...data };
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
    setLoading(true);
    axiosInstance
      .put(
        `${baseUrl}/${EDIT_PLAN_LOAN}`,
        {
          ...d,
          step: 7,
          documentSent: status,
        },
        configReq(token)
      )
      .then((res) => {
        const { data } = res;
        setData({
          ...d,
          step: 7,
          plan: plan,
          documentSent: status,
        });
        setLoading(false);
        toast.success("با موفقیت ثبت شد");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };
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
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);

        /*  setLoading(false); */
      });
  };
  useEffect(() => {
    setCheckedRole(data.documentSent);
  }, []);
  const { userPermissions } = useSelector((state) => state.relationals);
  if (!userPermissions?.planLoanRequest?.step7) {
    return <NoAccess noTitle={false} />;
  }
  return (
    <div className="w-full">
      {" "}
      <h3 className="font-bold text-xl"> تایید شارژ کیف پول بانک</h3>
      <div className="flex justify-between items-end md:flex-nowrap flex-wrap">
        <Paper
          elevation={0}
          className="rounded-lg relative max-w-4xl  border-[#dbdfea] border w-full col-span-1 py-6 md:px-5 px-4 flex flex-col gap-6 mt-2 "
        >
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
          <div className="flex gap-3 items-center">
            <FormControlLabel
              control={<Checkbox checked={checkedRole} />}
              onChange={() => {
                setCheckedRole(!checkedRole);
              }}
              label={
                <h2 className=" text-[0.78rem]">
                  {" "}
                  تایید شارژ کیف پول از سمت بانک
                </h2>
              }
            />
            {/*    <FormControlLabel
               onClick={() => {
                roleHandler(true);
              }}
              value="male"
              control={<Radio size="small" checked={data?.documentSent} />}
              label=" بله"
              sx={{ zIndex: 200 }}
            />{" "}
            <FormControlLabel
                onClick={() => {
                  roleHandler(false);
                }}
              value="male"
              control={<Radio size="small" checked={!data?.documentSent} />}
              label=" خیر"
              sx={{ zIndex: 200 }}
            /> */}
          </div>{" "}
          <Button
            variant="contained"
            color="primary"
            sx={{ maxWidth: { md: "160px" } }}
            onClick={() => roleHandler(checkedRole)}
            disabled={loading}
          >
            {loading ? <CircularProgress /> : <> اعمال تغییرات</>}
          </Button>
        </Paper>{" "}
        <div className="flex  flex-col md:items-end w-full md:w-fit md:justify-between justify-end gap-3 mt-5 items-center md:mt-0">
          {" "}
          <Revoke data={data} setData={setData} />
          <Dropdown
            change={(e) => setOpenDelete(e?.id)}
            value={steps?.find((item) => item.id === data.planType)}
            title=" تغییر مرحله به "
            data={steps2}
            disabled={disabled}
          />
          <Button
            disabled={!data?.documentSent || disabled}
            onClick={() => handleSms(23)}
            sx={{ width: { md: "240px", xs: "100%" } }}
            variant="contained"
            color="success"
          >
            ارسال پیامک تایید شارژ کیف پول
          </Button>
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

export default Step8;
const steps2 = [
  { title: "انتخاب طرح", id: 1 },
  { title: "پرداخت /دریافت مدارک", id: 2 },
  { title: "صحت سنجی", id: 3 },
  { title: "تعیین نوبت", id: 4 },
  { title: " تحویل مدارک به باجه", id: 5 },
  { title: " ارسال به بانک  ", id: 6 },
];
