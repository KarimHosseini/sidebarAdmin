/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_SUM_GATEWAY_BY_USER,
  GET_SUM_GATEWAY_BY_USER,
} from "../../helpers/api-routes";

const ReportSumGatewayByUser = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for read-only operations
  const reportSumGatewayByUserApis = {
    GET_DATA: GET_SUM_GATEWAY_BY_USER,
    EXPORT_DATA: EXPORT_SUM_GATEWAY_BY_USER,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only
  };

  return (
    <CustomePage
      apis={reportSumGatewayByUserApis}
      title="گزارش مجموع درگاه بر اساس کاربر"
      canAdd={false}
      canEdit={false}
      permissionsTag="ReportSumGatewayByUser"
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

export default ReportSumGatewayByUser;
