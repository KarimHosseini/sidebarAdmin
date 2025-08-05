/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EDIT_ACTIVE_CALENDER,
  EXPORT_CALENDER,
  GET_CALENDER,
  CREATE_CALENDER,
  DELETE_CALENDER,
  EDIT_CALENDER,
} from "../../helpers/api-routes";

const Calender = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define form fields based on the modal
  const calenderFields = [
    {
      name: 'title',
      label: 'متن',
      type: 'textInput',
      required: true
    },
    {
      name: 'date',
      label: 'تاریخ',
      type: 'DatePicker',
      required: true
    }
  ];

  // Define APIs for CRUD operations
  const calenderApis = {
    GET_DATA: GET_CALENDER,
    EXPORT_DATA: EXPORT_CALENDER,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_CALENDER,
    CREATE_DATA: CREATE_CALENDER,
    EDIT_DATA: EDIT_CALENDER,
    DELETE_DATA: DELETE_CALENDER,
  };

  return (
    <CustomePage
      apis={calenderApis}
      title="تقویم"
      canAdd={true}
      canEdit={true}
      permissionsTag="calender"
      customeModal={false}
      feilds={calenderFields}
      broadCrumb={[
        {
          title: "تقویم",
          path: "/calender",
        },
      ]}
      showSync={true}
      showExport={true}
    />
  );
};

export default Calender;
