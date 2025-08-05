/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import { EXPORT_PLAN_REPORT, GET_PLAN_REPORT } from "../../helpers/api-routes";

const ReportPlan = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for read-only operations
  const reportPlanApis = {
    GET_DATA: GET_PLAN_REPORT,
    EXPORT_DATA: EXPORT_PLAN_REPORT,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only
  };

  return (
    <CustomePage
      apis={reportPlanApis}
      title="گزارش طرح"
      canAdd={false}
      canEdit={false}
      permissionsTag="planTransaction"
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

export default ReportPlan;
