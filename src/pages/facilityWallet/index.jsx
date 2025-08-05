/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  All_FACILITY_WALLET,
  EXPORT_All_FACILITY_WALLET,
} from "../../helpers/api-routes";
const FacilityWallet = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [editingData, setEditingData] = useState({});

  // Define APIs for facility wallet operations
  const facilityWalletApis = {
    GET_DATA: All_FACILITY_WALLET,
    EXPORT_DATA: EXPORT_All_FACILITY_WALLET,
  };

  return (
    <CustomePage
      apis={facilityWalletApis}
      title="گزارش کیف پول تسهیلاتی"
      canAdd={false} // Read-only page
      canEdit={false} // Read-only page
      permissionsTag="facilityWallet"
      customeModal={false} // No modals needed
      feilds={[]} // No form fields
      broadCrumb={[
        {
          title: "کیف پول تسهیلاتی",
          path: "/facilityWallet",
        },
      ]}
      onRowClick={(data) => {
        setEditingData(data);
      }}
      extraActions={[
        {
          title: "جزییات",
          handler: (
            <Button
              onClick={(rowData) => {
                const data = rowData?.id ? rowData : editingData;
                window.open(
                  `/facilityWallet/${data.facilityId}?title=${data.facilityName}`
                );
              }}
              variant="outlined"
            >
              مشاهده
            </Button>
          ),
        },
      ]}
      showSync={true}
      showExport={true}
    />
  );
};

export default FacilityWallet;
