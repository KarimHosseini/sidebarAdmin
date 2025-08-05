/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EDIT_ACTIVE_BLOG,
  EXPORT_BLOG,
  GET_BLOG,
  CREATE_BLOG,
  EDIT_BLOG,
  DELETE_BLOG,
} from "../../helpers/api-routes";

const Blogs = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [editingData, setEditingData] = useState({});

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_BLOG,
    EXPORT_DATA: EXPORT_BLOG,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_BLOG,
    CREATE_DATA: CREATE_BLOG,
    EDIT_DATA: EDIT_BLOG,
    DELETE_DATA: DELETE_BLOG,
  };

  // عملیات‌های اضافی برای ردیف‌ها
  const extraActions = [
    userPermissions?.blog?.update && {
      title: "ویرایش",
      handler: (
        <IconButton
          onClick={(rowData) => {
            const data = rowData?.id ? rowData : editingData;
            window.open(`/blog/${data.id}`);
          }}
        >
          <Edit sx={{ color: "#ff2000" }} />
        </IconButton>
      ),
    },
    userPermissions?.seoAssign?.view && {
      title: "seo",
      handler: (
        <Button
          onClick={(rowData) => {
            const data = rowData?.id ? rowData : editingData;
            window.open(
              `/seoGenrator?id=${data?.id}&name=blog&slug=${data?.url?.slice(1)}`
            );
          }}
          variant="outlined"
        >
          ویرایش seo
        </Button>
      ),
    },
  ].filter((item) => item);

  return (
    <CustomePage
      apis={apis}
      title="بلاگ"
      canAdd={userPermissions?.blog?.insert}
      canEdit={userPermissions?.blog?.update}
      permissionsTag="blog"
      createOrEditPageUsingOtherPage={true}
      addLink="/blog/create"
      editLink="/blog"
      broadCrumb={[
        {
          title: "مدیریت بلاگ",
          path: "/blog",
        },
      ]}
      extraActions={extraActions}
      currentRow={(data) => {
        setEditingData(data);
      }}
    />
  );
};

export default Blogs;
