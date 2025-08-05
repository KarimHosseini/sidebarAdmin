/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_REPORT_LOAN_USER,
  GET_REPORT_LOAN_USER,
} from "../../helpers/api-routes";

const ReportLoanDetailByUser = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for read-only operations
  const reportLoanUserApis = {
    GET_DATA: GET_REPORT_LOAN_USER,
    EXPORT_DATA: EXPORT_REPORT_LOAN_USER,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only
  };

  return (
    <CustomePage
      apis={reportLoanUserApis}
      title="گزارش تسهیلات بر اساس کاربر"
      canAdd={false}
      canEdit={false}
      permissionsTag="reportLoanUser"
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

export default ReportLoanDetailByUser;
