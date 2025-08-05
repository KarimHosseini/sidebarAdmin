import { Delete } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Skeleton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PageTitle } from "../../../components/common";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import { Confirm } from "../../../components/modals";
import {
  baseUrl,
  DELETE_COMPANY,
  EDIT_COMPANY,
  GET_COMPANY_SINGLE,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import Step1Company from "../create/step1";

const EditCompany = () => {
  const [data, setData] = useState({});
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { userPermissions } = useSelector((state) => state.relationals);

  const navigate = useNavigate();
  const { id } = useParams();
  const saveData = () => {
    setLoading(true);
    axiosInstance
      .put(`${baseUrl}/${EDIT_COMPANY}`, data, configReq(token))
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
  const getData = () => {
    setLoading2(true);
    axiosInstance
      .get(`${baseUrl}/${GET_COMPANY_SINGLE}?id=${id}`, configReq(token))
      .then((res) => {
        setData(res?.data?.data);
        setLoading2(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading2(false);
      });
  };
  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);
  const deleteProduct = () => {
    axiosInstance
      .delete(`${baseUrl}/${DELETE_COMPANY}?id=${id}`, configReq(token))
      .then((res) => {
        setConfirmDelete(false);
        navigate("/company");
        toast.success("با موفقیت حذف شد");
      })
      .catch((err) => {
        setConfirmDelete(false);
        toast.error(err.response?.data?.message);
      });
  };
  return (
    <>
      <PageTitle
        title={"ویرایش  سازمان " + (data?.title ? data?.title : "")}
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
          {loading2 ? (
            <>
              <Skeleton width={"100%"} height={500} />
            </>
          ) : (
            <>
              {" "}
              <Step1Company data={data} setData={setData} editMode={true} />
            </>
          )}

          <div className="flex justify-between items-center">
            {userPermissions?.company?.delete && (
              <IconButton
                size="medium"
                color="error"
                onClick={() => setConfirmDelete(true)}
              >
                <Delete />
              </IconButton>
            )}
            <Button disabled={loading} onClick={saveData} variant="contained">
              <>{loading ? <CircularProgress /> : <>ثبت اطلاعات</>}</>
            </Button>
          </div>
        </Paper>
        <Confirm
          message="آیا از حذف این ویترین اطمینان دارید؟"
          close={() => setConfirmDelete(false)}
          submit={deleteProduct}
          open={confirmDelete}
        />
      </div>
    </>
  );
};

export default EditCompany;
