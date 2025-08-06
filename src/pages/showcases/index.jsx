/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomePage from "../../components/customePage";
import {
  ALL_SHOWCASES,
  EDIT_ACTIVE_SHOWCASE,
  EditPriority_SHOWCASES_TYPE,
  EXPORT_ALL_SHOWCASES,
} from "../../helpers/api-routes";

const ShowCases = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const navigate = useNavigate();
  const [editingData, setEditingData] = useState({});

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: ALL_SHOWCASES,
    EXPORT_DATA: EXPORT_ALL_SHOWCASES,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_SHOWCASE,
  };

  // عملیات‌های اضافی برای ردیف‌ها
  const extraActions = userPermissions?.showcases?.update
    ? [
        {
          title: "ویرایش",
          handler: (
            <IconButton
              onClick={(rowData) => {
                const data = rowData?.id ? rowData : editingData;
                if (localStorage.getItem("redirectType") === "2") {
                  navigate(`/showcases/${data.id}`);
                } else {
                  window.open(`/showcases/${data.id}`, "_blank");
                }
              }}
            >
              <Edit sx={{ color: "#ff2000" }} />
            </IconButton>
          ),
        },
      ]
    : [];

  return (
    <CustomePage
      apis={apis}
      title="ویترین ها"
      canAdd={userPermissions?.showcases?.insert}
      canEdit={userPermissions?.showcases?.update}
      permissionsTag="showcases"
      customeModal={true}
      createOrEditPageUsingOtherPage={true}
      addLink="/showcases/create"
      editLink="/showcases"
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/companyInfo",
        },
        {
          title: "مدیریت فرانت",
          path: "/menu",
        },
      ]}
      extraActions={extraActions}
      currentRow={(data) => {
        setEditingData(data);
      }}
      editInputApi={EditPriority_SHOWCASES_TYPE}
    />
  );
};

export default ShowCases;

// تسک 1: صفحه showcases به CustomePage تبدیل شد (از صفحات جداگانه برای ویرایش استفاده می‌کند) ✓
