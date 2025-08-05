/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_DEPARTMENT,
  DELETE_ALL_DEPARTMENT,
  EDIT_ACTIVE_ALL_DEPARTMENT,
  EDIT_ACTIVE_DEPARTMENT,
  EXPORT_DEPARTMENT,
  CREATE_DEPARTMENT,
  EDIT_DEPARTMENT,
  DELETE_DEPARTMENT,
} from "../../helpers/api-routes";

const Department = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define form fields for the department form
  const departmentFields = [
    {
      name: 'title',
      label: 'نام',
      type: 'textInput',
      required: true
    }
  ];

  // Define APIs for CRUD operations
  const departmentApis = {
    GET_DATA: ALL_DEPARTMENT,
    EXPORT_DATA: EXPORT_DEPARTMENT,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_DEPARTMENT,
    DELETE_ALL_DATA: DELETE_ALL_DEPARTMENT,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_DEPARTMENT,
    CREATE_DATA: CREATE_DEPARTMENT,
    EDIT_DATA: EDIT_DEPARTMENT,
    DELETE_DATA: DELETE_DEPARTMENT,
  };

  return (
    <CustomePage
      apis={departmentApis}
      title="دپارتمان"
      canAdd={true}
      canEdit={true}
      permissionsTag="department"
      customeModal={false}
      feilds={departmentFields}
      broadCrumb={[
        {
          title: "پیام ها",
          path: "/sms",
        },
      ]}
    />
  );
};

export default Department;
