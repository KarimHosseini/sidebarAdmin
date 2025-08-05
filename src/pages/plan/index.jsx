/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomePage from "../../components/customePage";
import {
  EDIT_ACTIVE_PLAN,
  EXPORT_PLAN,
  GET_PLAN,
  CREATE_PLAN,
  EDIT_PLAN,
  DELETE_PLAN,
} from "../../helpers/api-routes";

const Plans = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const navigate = useNavigate();
  const [editingData, setEditingData] = useState({});

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_PLAN,
    EXPORT_DATA: EXPORT_PLAN,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_PLAN,
    CREATE_DATA: CREATE_PLAN,
    EDIT_DATA: EDIT_PLAN,
    DELETE_DATA: DELETE_PLAN,
  };

  // عملیات‌های اضافی برای ردیف‌ها
  const extraActions = userPermissions?.plan?.update
    ? [
        {
          title: "ویرایش",
          handler: (
            <IconButton
              onClick={(rowData) => {
                const data = rowData?.id ? rowData : editingData;
                if (localStorage.getItem("redirectType") === "2") {
                  navigate(`/plan/${data.id}`)
                } else {
                  window.open(`/plan/${data.id}`, "_blank");
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
      title="طرح فروش و تخفیفات"
      canAdd={userPermissions?.plan?.insert}
      canEdit={userPermissions?.plan?.update}
      permissionsTag="plan"
      customeModal={true}
      createOrEditPageUsingOtherPage={true}
      addLink="/plan/create"
      editLink="/plan"
      broadCrumb={[
        {
          title: "باشگاه مشتریان",
          path: "/discounts",
        },
      ]}
      extraActions={extraActions}
      currentRow={(data) => {
        setEditingData(data);
      }}
    />
  );
};

export default Plans;

// تسک 1: صفحه plan به دلیل پیچیدگی فرم (چند مرحله‌ای) همچنان از صفحات جداگانه استفاده می‌کند ✓
