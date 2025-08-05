/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import { EXPORT_LOG_REPORT, GET_LOG_REPORT } from "../../helpers/api-routes";

const ReportLog = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for read-only operations
  const reportLogApis = {
    GET_DATA: GET_LOG_REPORT,
    EXPORT_DATA: EXPORT_LOG_REPORT,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only
  };

  return (
    <CustomePage
      apis={reportLogApis}
      title="گزارش لاگ"
      canAdd={false}
      canEdit={false}
      permissionsTag="log"
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

export default ReportLog;
