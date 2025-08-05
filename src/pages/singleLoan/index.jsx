/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_REPORT_SINGLE_LOAN,
  GET_REPORT_SINGLE_LOAN,
} from "../../helpers/api-routes";

const SingleLoan = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for single loan report operations (read-only)
  const singleLoanApis = {
    GET_DATA: GET_REPORT_SINGLE_LOAN,
    EXPORT_DATA: EXPORT_REPORT_SINGLE_LOAN,
  };

  return (
    <CustomePage
      apis={singleLoanApis}
      title="تسهیلات فاقد تضمین کننده"
      canAdd={false} // Read-only page
      canEdit={false} // Read-only page
      permissionsTag="singleLoan"
      customeModal={false} // No modals needed
      feilds={[]} // No form fields
      broadCrumb={[
        {
          title: "گزارشات",
          path: "/reports",
        },
      ]}
      showSync={true}
      showExport={true}
    />
  );
};

export default SingleLoan;
