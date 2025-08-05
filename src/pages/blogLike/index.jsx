/* eslint-disable react-hooks/exhaustive-deps */
import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { Confirm } from "../../components/modals";
import {
  baseUrl,
  DELETE_BLOG_LIKE,
  EXPORT_BLOG_LIKE,
  GET_BLOG_LIKE,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const BlogsLiked = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingData, setEditingData] = useState({});
  const { token } = useSelector((state) => state.user);

  // Delete blog like function
  const deleteAttr = async () => {
    try {
      await axiosInstance.delete(
        `${baseUrl}/${DELETE_BLOG_LIKE}/${editingData.id}`,
        configReq(token)
      );
      toast.success("لایک با موفقیت حذف شد");
      setConfirmDelete(false);
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "خطا در حذف لایک");
    }
  };

  // Define APIs for read-only operations
  const blogLikeApis = {
    GET_DATA: GET_BLOG_LIKE,
    EXPORT_DATA: EXPORT_BLOG_LIKE,
    // No CREATE, EDIT operations for blog likes
  };

  // Delete action
  const extraActions = [
    userPermissions?.blog?.update && {
      title: "حذف",
      handler: (
        <>
          <IconButton onClick={() => setConfirmDelete(true)}>
            <Delete sx={{ color: "red" }} />
          </IconButton>
        </>
      ),
    },
  ].filter((it) => it);

  return (
    <>
      <CustomePage
        apis={blogLikeApis}
        title="لایک های بلاگ"
        canAdd={false}
        canEdit={false}
        permissionsTag="blog"
        customeModal={false}
        feilds={[]} // No form fields for blog likes
        broadCrumb={[
          {
            title: "بلاگ",
            path: "/blog",
          },
        ]}
        extraActions={extraActions}
        onRowClick={(data) => {
          setEditingData(data);
        }}
        showSync={true}
        showExport={true}
      />
      <Confirm
        message="آیا از حذف این لایک اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
    </>
  );
};

export default BlogsLiked;
