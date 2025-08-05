/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  WALLET_PAYMENT,
  EXPORT_WALLET_PAYMENT,
  ADD_WALLET_PAYMENT,
  EDIT_WALLET_PAYMENT,
  DELETE_WALLET_PAYMENT,
} from "../../helpers/api-routes";
import WalletWithrawModal from "./modal";

const WalletWithdraw = () => {
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

  // Define APIs for wallet withdraw operations
  const walletApis = {
    GET_DATA: WALLET_PAYMENT,
    EXPORT_DATA: EXPORT_WALLET_PAYMENT,
    CREATE_DATA: ADD_WALLET_PAYMENT,
    EDIT_DATA: EDIT_WALLET_PAYMENT,
    DELETE_DATA: DELETE_WALLET_PAYMENT,
  };

  return (
    <>
      <CustomePage
        apis={walletApis}
        title="درخواست عودت کیف"
        canAdd={false} // Using custom add button
        canEdit={false}
        permissionsTag="walletPaymentRefund"
        customeModal={false} // Not using customModalComponent prop
        feilds={[]} // No form fields - using separate modal
        broadCrumb={[
          {
            title: " کیف پول سایت",
            path: "/wallet",
          },
        ]}
        defaultFilter={[
          {
            name: "op",
            value: 3,
            type: "eq",
          }
        ]}
        onRowClick={(data) => {
          setEditingData(data);
          setForEdit(true);
          // Modal will open automatically via useEffect
        }}
        onDataChange={setAllRows} // Update allRows when data changes
        extraButtons={
          <>
            {userPermissions?.walletPaymentRefund?.insert && (
              <Button
                onClick={() => {
                  setEditingData({});
                  setForEdit(false);
                  setOpen(true);
                }}
                variant="contained"
                startIcon={<AddIcon />}
              >
                افزودن درخواست جدید
              </Button>
            )}
          </>
        }
        showSync={true}
        showExport={true}
        exportParams="&filter[0][key]=op&filter[0][value]=3&filter[0][operator]=eq"
      />
      
      {/* Separate modal outside CustomePage to prevent infinite renders */}
      <WalletWithrawModal
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
      />
    </>
  );
};

export default WalletWithdraw;
