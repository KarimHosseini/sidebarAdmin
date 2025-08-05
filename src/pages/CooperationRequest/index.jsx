/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomePage from "../../components/customePage";
import { 
  EXPORT_SUM_COOPERATION, 
  GET_SUM_COOPERATION,
  EDIT_SUM_COOPERATION 
} from "../../helpers/api-routes";

const ReportCooperation = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const navigate = useNavigate();
  const [editingData, setEditingData] = useState({});

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_SUM_COOPERATION,
    EXPORT_DATA: EXPORT_SUM_COOPERATION,
    EDIT_DATA: EDIT_SUM_COOPERATION,
  };

  // عملیات‌های اضافی برای ردیف‌ها
  const extraActions = [
    {
      title: "جزییات",
      handler: (
        <Button 
          onClick={(rowData) => {
            const data = rowData?.id ? rowData : editingData;
            navigate(`/CooperationRequest/${data?.id || data?.Id}?UI=${data.UserId}`);
          }} 
          variant="outlined"
        >
          مشاهده
        </Button>
      ),
    },
  ];

  return (
    <CustomePage
      apis={apis}
      title="گزارش در خواست نمایندگی"
      canAdd={false}
      canEdit={false}
      permissionsTag="CooperationRequest"
      broadCrumb={[
        {
          title: "گزارشات",
          path: "/reports",
        },
      ]}
      extraActions={extraActions}
      currentRow={(data) => {
        setEditingData(data);
      }}
    />
  );
};

export default ReportCooperation;
