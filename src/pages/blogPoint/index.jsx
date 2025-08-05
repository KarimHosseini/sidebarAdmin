/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  DELETE_BLOG_POINT,
  EDIT_BLOG_POINT,
  EXPORT_BLOG_POINT,
  GET_BLOG_POINT,
  CREATE_BLOG_POINT,
  EDIT_BLOG_POINT_VERIFY,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { Button } from "@mui/material";

const BlogsPoint = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  const [refreshData, setRefresh] = useState(0);

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_BLOG_POINT,
    EXPORT_DATA: EXPORT_BLOG_POINT,
    EDIT_ACTIVE_DATA: EDIT_BLOG_POINT,
    CREATE_DATA: CREATE_BLOG_POINT,
    EDIT_DATA: EDIT_BLOG_POINT,
    DELETE_DATA: DELETE_BLOG_POINT,
  };

  // تعریف فیلدهای فرم
  const fields = [
    {
      name: 'point',
      label: 'متن نظر',
      type: 'textInput',
      required: true,
      props: {
        multiline: true,
        rows: 3
      }
    }
  ];

  // عملیات‌های اضافی برای ردیف‌ها
  const extraFormActions = [
    {
      component: (formData) => {
        const handleVerify = () => {
          axiosInstance
            .put(
              `${baseUrl}/${EDIT_BLOG_POINT_VERIFY}`,
              { pointId: formData?.id },
              configReq(token)
            )
            .then((res) => {
              toast.success("با موفقیت انجام شد");
              setRefresh(r => r + 1);
            })
            .catch((err) => {
              toast.error(err.response?.data?.message);
            });
        };

        if (!formData?.id) return null;

        return !formData?.verified ? (
          <Button
            variant="contained"
            color="success"
            onClick={handleVerify}
            sx={{ mx: "10px" }}
          >
            تایید نظر
          </Button>
        ) : (
          <Button
            variant="contained"
            color="error"
            onClick={handleVerify}
            sx={{ mx: "10px" }}
          >
            رد نظر
          </Button>
        );
      }
    }
  ];

  return (
    <CustomePage
      apis={apis}
      title="نظرات کاربران"
      canAdd={false}
      canEdit={userPermissions?.blogPoint?.update}
      permissionsTag="blogPoint"
      customeModal={false}
      feilds={fields}
      broadCrumb={[
        {
          title: "مدیریت بلاگ",
          path: "/blog",
        },
      ]}
      extraFormActions={extraFormActions}
      key={refreshData}
    />
  );
};

export default BlogsPoint;
