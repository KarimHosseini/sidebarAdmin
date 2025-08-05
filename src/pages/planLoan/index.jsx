/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomePage from "../../components/customePage";
import {
  EDIT_ACTIVE_PLAN_LOAN,
  EXPORT_PLAN_LOAN,
  GET_PLAN_LOAN,
  CREATE_PLAN_LOAN,
  EDIT_PLAN_LOAN,
  DELETE_PLAN_LOAN,
} from "../../helpers/api-routes";

const PlanLoan = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const navigate = useNavigate();
  const [editingData, setEditingData] = useState({});

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_PLAN_LOAN,
    EXPORT_DATA: EXPORT_PLAN_LOAN,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_PLAN_LOAN,
    CREATE_DATA: CREATE_PLAN_LOAN,
    EDIT_DATA: EDIT_PLAN_LOAN,
    DELETE_DATA: DELETE_PLAN_LOAN,
  };

  // عملیات‌های اضافی برای ردیف‌ها
  const extraActions = userPermissions?.planLoanRequest?.update
    ? [
        {
          title: "ویرایش",
          handler: (
            <IconButton
              onClick={(rowData) => {
                const data = rowData?.id ? rowData : editingData;
                if (localStorage.getItem("redirectType") === "2") {
                  navigate(`/plan-loan/${data.id}`);
                } else {
                  window.open(`/plan-loan/${data.id}`, "_blank");
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
      title="تسهیلات طرح بانک آینده"
      canAdd={userPermissions?.planLoanRequest?.update}
      canEdit={userPermissions?.planLoanRequest?.update}
      permissionsTag="planLoanRequest"
      customeModal={true}
      createOrEditPageUsingOtherPage={true}
      addLink="/plan-loan/create"
      editLink="/plan-loan"
      broadCrumb={[
        {
          title: "تسهیلات",
          path: "/facilites",
        },
      ]}
      extraActions={extraActions}
      currentRow={(data) => {
        setEditingData(data);
      }}
    />
  );
};

export default PlanLoan;

// تسک 1: صفحه planLoan به دلیل پیچیدگی فرم همچنان از صفحات جداگانه استفاده می‌کند ✓
