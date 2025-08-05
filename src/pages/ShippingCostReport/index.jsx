/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_REPORT_SHIPPING_COST,
  EXPORT_REPORT_SHIPPING_COST,
} from "../../helpers/api-routes";

const ShippingCostReport = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for shipping cost report operations (read-only)
  const shippingCostReportApis = {
    GET_DATA: ALL_REPORT_SHIPPING_COST,
    EXPORT_DATA: EXPORT_REPORT_SHIPPING_COST,
  };

  return (
    <CustomePage
      apis={shippingCostReportApis}
      title="گزارشات هزینه های حمل و نقل"
      canAdd={false} // Read-only page
      canEdit={false} // Read-only page
      permissionsTag="shippingCostReport"
      customeModal={false} // No modals needed
      feilds={[]} // No form fields
      broadCrumb={[
        {
          title: "گزارشات",
          path: "/reports",
        },
      ]}
      showSync={false}
      showExport={true}
    />
  );
};

export default ShippingCostReport;
