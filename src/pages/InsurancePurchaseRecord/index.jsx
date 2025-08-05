/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_INSURANCE_PURCHASED,
  GET_INSURANCE_PURCHASED,
} from "../../helpers/api-routes";
import InsurancePurchasedModal from "./modal";

const InsurancePurchaseRecord = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [open, setOpen] = useState(false);
  const [editingData, setEditingData] = useState({});

  // Define APIs for read-only operations
  const insuranceApis = {
    GET_DATA: GET_INSURANCE_PURCHASED,
    EXPORT_DATA: EXPORT_INSURANCE_PURCHASED,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - mostly read-only with custom actions
  };

  // Custom modal for activation
  const customModalComponent = (
    <InsurancePurchasedModal
      open={open}
      close={() => {
        setOpen(false);
        setEditingData({});
      }}
      prevData={editingData}
      forEdit={true}
      setRefresh={() => window.location.reload()}
    />
  );

  return (
    <CustomePage
      apis={insuranceApis}
      title="سوابق خرید بیمه"
      canAdd={false}
      canEdit={false}
      permissionsTag="insurancePurchaseRecords"
      customeModal={true} // Use custom modal
      feilds={[]} // No form fields for read-only page
      broadCrumb={[
        {
          title: "بیمه",
          path: "/insurance",
        },
      ]}
      onRowClick={(data) => {
        setEditingData(data);
        setOpen(true);
      }}
      customModalComponent={customModalComponent}
      extraActions={[]}
      showSync={true}
      showExport={true}
    />
  );
};

export default InsurancePurchaseRecord;
