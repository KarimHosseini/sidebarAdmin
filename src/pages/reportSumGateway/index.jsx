/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_SUM_GATEWAY,
  GET_SUM_GATEWAY,
} from "../../helpers/api-routes";
const ReportSumGateway = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for sum gateway report operations (read-only)
  const reportSumGatewayApis = {
    GET_DATA: GET_SUM_GATEWAY,
    EXPORT_DATA: EXPORT_SUM_GATEWAY,
  };

  return (
    <CustomePage
      apis={reportSumGatewayApis}
      title="گزارش تجمیعی درگاه"
      canAdd={false} // Read-only page
      canEdit={false} // Read-only page
      permissionsTag="ReportSumGateway"
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

export default ReportSumGateway;
