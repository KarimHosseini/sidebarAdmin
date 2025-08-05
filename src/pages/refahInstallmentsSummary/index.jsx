/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_REPORT_INSTALLMENT_SUMMERY,
  GET_REPORT_INSTALLMENT_SUMMERY,
} from "../../helpers/api-routes";
const ReportOverdueInstallmentsSummary = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [editingData, setEditingData] = useState({});

  // Define APIs for installments summary report operations
  const reportInstallmentsSummaryApis = {
    GET_DATA: GET_REPORT_INSTALLMENT_SUMMERY,
    EXPORT_DATA: EXPORT_REPORT_INSTALLMENT_SUMMERY,
  };

  return (
    <CustomePage
      apis={reportInstallmentsSummaryApis}
      title="گزارش تجمیعی اقساط رفاه"
      canAdd={false} // Read-only page
      canEdit={false} // Read-only page
      permissionsTag="ReportOverdueInstallmentsSummary"
      customeModal={false} // No modals needed
      feilds={[]} // No form fields
      broadCrumb={[
        {
          title: "گزارشات",
          path: "/reports",
        },
      ]}
      onRowClick={(data) => {
        setEditingData(data);
      }}
      extraActions={
        userPermissions?.RefahInstallment?.view
          ? [
              {
                title: "مشاهده جزییات",
                handler: (
                  <Button
                    onClick={(rowData) => {
                      const data = rowData?.id ? rowData : editingData;
                      window.open(
                        `/refahInstallment?userId=${data.userId}&userFullName=${data.userFullName}`
                      );
                    }}
                    variant="contained"
                    color="primary"
                  >
                    مشاهده جزییات
                  </Button>
                ),
              },
            ]
          : []
      }
      showSync={true}
      showExport={true}
    />
  );
};

export default ReportOverdueInstallmentsSummary;
