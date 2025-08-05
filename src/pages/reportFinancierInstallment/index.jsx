/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_ReportFinancierInstallment,
  GET_ReportFinancierInstallment,
} from "../../helpers/api-routes";

const ReportFinancierInstallment = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [editingData, setEditingData] = useState({});

  // Define APIs for read-only operations
  const reportFinancierInstallmentApis = {
    GET_DATA: GET_ReportFinancierInstallment,
    EXPORT_DATA: EXPORT_ReportFinancierInstallment,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only
  };

  // View details action
  const extraActions = [
    userPermissions?.ReportOverdueInstallmentsBasedOnFinancier?.view && {
      title: "مشاهده جزییات",
      handler: (
        <>
          <Button
            onClick={() => {
              window.open(
                `/reportFinancierInstallment/${editingData.financier}?month=${editingData.month}&year=${editingData.year}`
              );
            }}
            variant="contained"
            color="primary"
          >
            مشاهده
          </Button>
        </>
      ),
    },
  ].filter((it) => it);

  return (
    <CustomePage
      apis={reportFinancierInstallmentApis}
      title="گزارش اقساط تامین کننده"
      canAdd={false}
      canEdit={false}
      permissionsTag="ReportFinancierInstallment"
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
  );
};

export default ReportFinancierInstallment;
