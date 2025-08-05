/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import CustomePage from "../../components/customePage";
import {
  EXPORT_REPORT_TRANSACTION,
  GET_REPORT_TRANSACTION,
} from "../../helpers/api-routes";

const ReportTransactions = () => {

  // Define APIs for read-only operations
  const reportTransactionsApis = {
    GET_DATA: GET_REPORT_TRANSACTION,
    EXPORT_DATA: EXPORT_REPORT_TRANSACTION,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only
  };

  return (
    <CustomePage
      apis={reportTransactionsApis}
      title="گزارش تراکنش ها"
      canAdd={false}
      canEdit={false}
      permissionsTag="ReportTransactions"
      customeModal={false}
      feilds={[]} // No form fields for read-only page
      broadCrumb={[
        {
          title: "گزارشات",
          path: "/reports",
        },
      ]}
      extraActions={[]}
      showSync={true}
      showExport={true}
    />
  );
};

export default ReportTransactions;
