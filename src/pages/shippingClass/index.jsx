/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_SHIPPINGCLASS,
  DELETE_ALL_SHIPPINGCLASS,
  EDIT_ACTIVE_ALL_SSHIPPINGCLASS,
  EDIT_ACTIVE_SHIPPINGCLASS,
  EXPORT_SHIPPINGCLASS,
  CREATE_SHIPPINGCLASS,
  EDIT_SHIPPINGCLASS,
  DELETE_SHIPPINGCLASS,
} from "../../helpers/api-routes";
import EditShipingClassModal from "./modal";

const ShippingClass = () => {
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

  // Define APIs for shipping class operations
  const shippingClassApis = {
    GET_DATA: ALL_SHIPPINGCLASS,
    EXPORT_DATA: EXPORT_SHIPPINGCLASS,
    CREATE_DATA: CREATE_SHIPPINGCLASS,
    EDIT_DATA: EDIT_SHIPPINGCLASS,
    DELETE_DATA: DELETE_SHIPPINGCLASS,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_SHIPPINGCLASS,
    DELETE_ALL_DATA: DELETE_ALL_SHIPPINGCLASS,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_SSHIPPINGCLASS,
  };

  // Custom modal component for shipping class form
  const customModalComponent = (
    <EditShipingClassModal
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
      apis={shippingClassApis}
      title="کلاس های حمل و نقل"
      canAdd={false} // Using custom add button
      canEdit={false}
      permissionsTag="shippingClass"
      customeModal={true} // Use custom modal
      feilds={[]} // No form fields - using custom modal
      broadCrumb={[
        {
          title: "ارسال کالا",
          path: "/shippingSetting",
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
          {userPermissions?.shippingClass?.insert && (
            <Button
              onClick={() => {
                setEditingData({});
                setForEdit(false);
                setOpen(true);
              }}
              variant="contained"
              startIcon={<AddIcon />}
            >
              افزودن کلاس های حمل و نقل جدید
            </Button>
          )}
        </>
      }
      showSync={true}
      showExport={true}
    />
  );
};

export default ShippingClass;
