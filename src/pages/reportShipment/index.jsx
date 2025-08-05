/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  baseUrl,
  CHANGE_ALL_ORDER_STATE,
  EXPORT_SHIPMENT_REPORT,
  GET_SHIPMENT_REPORT,
} from "../../helpers/api-routes";

const ReportShipment = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for read-only operations
  const reportShipmentApis = {
    GET_DATA: GET_SHIPMENT_REPORT,
    EXPORT_DATA: EXPORT_SHIPMENT_REPORT,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only
  };

  return (
    <CustomePage
      apis={reportShipmentApis}
      title="گزارش بسته"
      canAdd={false}
      canEdit={false}
      permissionsTag="ReportShipment"
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

export default ReportShipment;
