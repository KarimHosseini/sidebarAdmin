import { Button, CircularProgress, Paper } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PageTitle } from "../../../components/common";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import { baseUrl, CREATE_COMPANY } from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import Step1Company from "./step1";

const CreateCompany = () => {
  const [data, setData] = useState({});
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const saveData = () => {
    setLoading(true);
    axiosInstance
      .post(`${baseUrl}/${CREATE_COMPANY}`, data, configReq(token))
      .then((res) => {
        toast.success("با موفقیت ثبت شد");
        navigate("/company");
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading(false);
      });
  };
  return (
    <>
      <PageTitle
        title={"افزودن سازمان"}
        broadCrumb={[
          {
            title: "    باشگاه مشتریان",
            path: "/discounts",
          },
          {
            title: "سازمان",
            path: "/company",
          },
        ]}
      />
      <div className="px-3 ">
        <Paper
          className="rounded-lg  border-[#dbdfea] border w-full py-6 md:px-5 px-2 flex flex-col gap-6 mt-2 mb-10"
          elevation={0}
        >
          {" "}
          <Step1Company data={data} setData={setData} />
          <div className="flex justify-end items-center">
            <Button disabled={loading} onClick={saveData} variant="contained">
              <>{loading ? <CircularProgress /> : <>ثبت اطلاعات</>}</>
            </Button>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default CreateCompany;
