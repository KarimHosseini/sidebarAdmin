/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  WALLET_PAYMENT,
  EXPORT_WALLET_PAYMENT,
  EDIT_WALLET_PAYMENT,
  DELETE_WALLET_PAYMENT,
} from "../../helpers/api-routes";
import WalletRquestModal from "./moda";

const WalletRequests = () => {
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

  // Define APIs for wallet requests operations
  const walletApis = {
    GET_DATA: WALLET_PAYMENT,
    EXPORT_DATA: EXPORT_WALLET_PAYMENT,
    EDIT_DATA: EDIT_WALLET_PAYMENT,
    DELETE_DATA: DELETE_WALLET_PAYMENT,
    // No CREATE_DATA - this is for approving existing requests
  };

  return (
    <>
      <CustomePage
        apis={walletApis}
        title="تایید در خواست های کیف پول سایت"
        canAdd={false} // No add for approval workflow
        canEdit={false} // Using onRowClick instead
        permissionsTag="walletPayment"
        customeModal={false} // Not using customModalComponent prop
        feilds={[]} // No form fields - using separate modal
        broadCrumb={[
          {
            title: " کیف پول",
            path: "/wallet",
          },
        ]}
        onRowClick={(data) => {
          setEditingData(data);
          setForEdit(true);
          // Modal will open automatically via useEffect
        }}
        onDataChange={setAllRows} // Update allRows when data changes
        extraButtons={
          <>
            <Button href="/ChargingWallet" target={"_blank"} variant="outlined">
              شارژ
            </Button>
            <Button href="/withdrawWallet" target={"_blank"} variant="outlined">
              عودت
            </Button>
          </>
        }
        showSync={true}
        showExport={true}
      />
      
      {/* Separate modal outside CustomePage to prevent infinite renders */}
      <WalletRquestModal
        open={open}
        close={() => {
          setOpen(false);
          setEditingData({});
          setForEdit(false);
        }}
        prevData={editingData}
        forEdit={forEdit}
        setAllRows={setAllRows}
        allRows={allRows}
        setEditedItem={() => {}} // Legacy prop
      />
    </>
  );
};

export default WalletRequests;
