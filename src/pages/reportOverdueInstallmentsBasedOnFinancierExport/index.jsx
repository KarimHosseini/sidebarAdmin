/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import CustomePage from "../../components/customePage";
const ShowTable = ({ URL, URL_EXPORT }) => {
  const [editingData, setEditingData] = useState({});
  const [searchParams] = useSearchParams();
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for overdue installments report operations
  const reportOverdueInstallmentsApis = {
    GET_DATA: URL,
    EXPORT_DATA: URL_EXPORT,
  };

  const year = searchParams.get("year") || "";
  const month = searchParams.get("month") || "";

  return (
    <CustomePage
      apis={reportOverdueInstallmentsApis}
      title={`گزارش تامین کننده مالی - سال: ${year} ماه: ${month}`}
      canAdd={false} // Read-only page
      canEdit={false} // Read-only page
      permissionsTag="ReportOverdueInstallmentsBasedOnFinancier"
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
        !userPermissions?.RefahInstallment?.ManualSettleOverDueInstallment
          ? [
              {
                title: "مشاهده جزییات",
                handler: (
                  <Button
                    onClick={(rowData) => {
                      const data = rowData?.id ? rowData : editingData;
                      window.open(
                        `/report-financier-installment/${data.id}?month=${data.month}&year=${data.year}`
                      );
                    }}
                    variant="contained"
                    color="primary"
                  >
                    مشاهده
                  </Button>
                ),
              },
            ]
          : []
      }
      showSync={true}
      showExport={true}
      exportParams={`year=${year}&month=${month}`}
    />
  );
};

export default ShowTable;
