/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_PLAN_LOAN_DOCUMENT,
  GET_PLAN_LOAN_DOCUMENT,
} from "../../helpers/api-routes";

const PlanDocument = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for read-only operations
  const planDocumentApis = {
    GET_DATA: GET_PLAN_LOAN_DOCUMENT,
    EXPORT_DATA: EXPORT_PLAN_LOAN_DOCUMENT,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only
  };

  return (
    <CustomePage
      apis={planDocumentApis}
      title="اسناد طرح"
      canAdd={false}
      canEdit={false}
      permissionsTag="planLoanDocument"
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

export default PlanDocument;
