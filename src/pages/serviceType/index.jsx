/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_SERVICE_TYPE,
  DELETE_ALL_SERVICE_TYPE,
  EDIT_ACTIVE_ALL_SERVICE_TYPE,
  EDIT_ACTIVE_SERVICE_TYPE,
  EXPORT_SERVICE_TYPE,
  CREATE_SERVICE_TYPE,
  EDIT_SERVICE_TYPE,
  DELETE_SERVICE_TYPE,
} from "../../helpers/api-routes";
import EditServiceType from "./modal";

const ServiceType = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [open, setOpen] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [forEdit, setForEdit] = useState(false);
  const [allRows, setAllRows] = useState([]);

  // Control modal opening after editingData is set
  useEffect(() => {
    if (editingData && Object.keys(editingData).length > 0 && forEdit) {
      setOpen(true);
    }
  }, [editingData, forEdit]);

  // Define APIs for service type operations
  const serviceTypeApis = {
    GET_DATA: ALL_SERVICE_TYPE,
    EXPORT_DATA: EXPORT_SERVICE_TYPE,
    CREATE_DATA: CREATE_SERVICE_TYPE,
    EDIT_DATA: EDIT_SERVICE_TYPE,
    DELETE_DATA: DELETE_SERVICE_TYPE,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_SERVICE_TYPE,
    DELETE_ALL_DATA: DELETE_ALL_SERVICE_TYPE,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_SERVICE_TYPE,
  };

  // Custom modal component for service type form
  const customModalComponent = (
    <EditServiceType
      open={open}
      close={() => {
        setOpen(false);
        setEditingData({});
        setForEdit(false);
      }}
      forEdit={forEdit}
      data={editingData}
      setAllRows={setAllRows}
      allRows={allRows}
    />
  );

  return (
    <CustomePage
      apis={serviceTypeApis}
      title="تنظیمات خدمات"
      canAdd={false} // Using custom add button
      canEdit={false}
      permissionsTag="serviceType"
      customeModal={true} // Use custom modal
      feilds={[]} // No form fields - using custom modal
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/companyInfo",
        },
      ]}
      onRowClick={(data) => {
        setEditingData(data);
        setForEdit(true);
        // Modal will open automatically via useEffect
      }}
      onDataChange={setAllRows} // Update allRows when data changes
      customModalComponent={customModalComponent}
      extraButtons={
        <>
          {userPermissions?.serviceType?.insert && (
            <Button
              onClick={() => {
                setEditingData({});
                setForEdit(false);
                setOpen(true);
              }}
              variant="contained"
              startIcon={<AddIcon />}
            >
              افزودن تنظیمات خدمات جدید
            </Button>
          )}
        </>
      }
      showSync={true}
      showExport={true}
    />
  );
};

export default ServiceType;
