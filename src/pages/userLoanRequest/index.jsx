/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_USER_LOAN_REQUEST,
  GET_USER_LOAN_REQUEST,
} from "../../helpers/api-routes";

const UserLoanRequest = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for user loan request operations (read-only)
  const userLoanRequestApis = {
    GET_DATA: GET_USER_LOAN_REQUEST,
    EXPORT_DATA: EXPORT_USER_LOAN_REQUEST,
  };

  return (
    <CustomePage
      apis={userLoanRequestApis}
      title="گزارش درخواست وام"
      canAdd={false} // Read-only page
      canEdit={false} // Read-only page
      permissionsTag="UserLoanRequest"
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

export default UserLoanRequest;
