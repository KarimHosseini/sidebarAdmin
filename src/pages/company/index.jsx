/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomePage from "../../components/customePage";
import {
  EDIT_ACTIVE_COMPANY,
  EXPORT_COMPANY,
  GET_COMPANY,
  CREATE_COMPANY,
  EDIT_COMPANY,
  DELETE_COMPANY,
} from "../../helpers/api-routes";

const Companies = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const navigate = useNavigate();
  const [editingData, setEditingData] = useState({});

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_COMPANY,
    EXPORT_DATA: EXPORT_COMPANY,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_COMPANY,
    CREATE_DATA: CREATE_COMPANY,
    EDIT_DATA: EDIT_COMPANY,
    DELETE_DATA: DELETE_COMPANY,
  };

  // عملیات‌های اضافی برای ردیف‌ها
  const extraActions = userPermissions?.company?.update
    ? [
        {
          title: "مشاهده / ویرایش اعضا",
          handler: (
            <Button
              onClick={(rowData) => {
                const data = rowData?.id ? rowData : editingData;
                navigate(`/company/users/${data?.id}`);
              }}
              variant="outlined"
            >
              مشاهده
            </Button>
          ),
        },
        {
          title: "ویرایش",
          handler: (
            <IconButton
              onClick={(rowData) => {
                const data = rowData?.id ? rowData : editingData;
                navigate(`/company/${data?.id}`);
              }}
            >
              <Edit sx={{ color: "#ff2000" }} />
            </IconButton>
          ),
        },
      ]
    : false;

  return (
    <CustomePage
      apis={apis}
      title="شرکت / سازمان"
      canAdd={userPermissions?.company?.insert}
      canEdit={userPermissions?.company?.update}
      permissionsTag="company"
      createOrEditPageUsingOtherPage={true}
      addLink="/company/create"
      editLink="/company"
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

export default Companies;
