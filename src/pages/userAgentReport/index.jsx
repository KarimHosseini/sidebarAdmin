/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_AGENT_SUMMERY,
  GET_AGENT_SUMMERY,
} from "../../helpers/api-routes";

const ReportUserAgent = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for user agent report operations (read-only)
  const userAgentReportApis = {
    GET_DATA: GET_AGENT_SUMMERY,
    EXPORT_DATA: EXPORT_AGENT_SUMMERY,
  };

  return (
    <CustomePage
      apis={userAgentReportApis}
      title="گزارش تسویه نماینده ها"
      canAdd={false} // Read-only page
      canEdit={false} // Read-only page
      permissionsTag="AgentRefahLoanSummery"
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

export default ReportUserAgent;
