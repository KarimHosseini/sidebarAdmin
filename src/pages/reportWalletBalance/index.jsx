/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_REPORT_WALLET_BALANCE,
  GET_REPORT_WALLET_BALANCE,
  TOGGLE_WALLET_BALANCE,
} from "../../helpers/api-routes";
import HistoryReport from "./modal";

const ReportWalletBalance = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [open, setOpen] = useState(false);
  const [editingData, setEditingData] = useState({});

  // Define APIs for operations
  const reportWalletBalanceApis = {
    GET_DATA: GET_REPORT_WALLET_BALANCE,
    EXPORT_DATA: EXPORT_REPORT_WALLET_BALANCE,
    EDIT_ACTIVE_DATA: TOGGLE_WALLET_BALANCE, // Special toggle functionality
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA
  };

  // View wallet lock history action
  const extraActions = [
    userPermissions?.walletLockHistory?.view && {
      title: "تاریخچه قفل کیف پول",
      handler: (
        <Button onClick={() => setOpen(true)} variant="outlined">
          مشاهده
        </Button>
      ),
    },
  ].filter((it) => it);

  return (
    <>
      <CustomePage
        apis={reportWalletBalanceApis}
        title="گزارش مانده کیف پول"
        canAdd={false}
        canEdit={false}
        permissionsTag="ReportWalletBalance"
        customeModal={false}
        feilds={[]} // No form fields for read-only page
        broadCrumb={[
          {
            title: "گزارشات",
            path: "/reports",
          },
        ]}
        extraActions={extraActions}
        onRowClick={(data) => {
          setEditingData(data);
        }}
        showSync={true}
        showExport={true}
      />
      <HistoryReport
        open={open}
        data={editingData}
        close={() => {
          setOpen(false);
          setEditingData({});
        }}
      />
    </>
  );
};

export default ReportWalletBalance;
