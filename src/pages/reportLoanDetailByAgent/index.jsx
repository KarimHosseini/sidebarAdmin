/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_REPORT_LOAN_AGENT,
  GET_REPORT_LOAN_AGENT,
} from "../../helpers/api-routes";

const ReportLoanDetailByAgent = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for read-only operations
  const reportLoanAgentApis = {
    GET_DATA: GET_REPORT_LOAN_AGENT,
    EXPORT_DATA: EXPORT_REPORT_LOAN_AGENT,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only
  };

  return (
    <CustomePage
      apis={reportLoanAgentApis}
      title="گزارش تسهیلات بر اساس نماینده"
      canAdd={false}
      canEdit={false}
      permissionsTag="reportLoanAgent"
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

export default ReportLoanDetailByAgent;
