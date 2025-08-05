/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_SUMMERY_REPORT_SHIPPING_COST,
  SUMMERY_REPORT_SHIPPING_COST,
} from "../../helpers/api-routes";

const ShippingCostReportSummery = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for shipping cost report summary operations (read-only)
  const shippingCostReportSummeryApis = {
    GET_DATA: SUMMERY_REPORT_SHIPPING_COST,
    EXPORT_DATA: EXPORT_SUMMERY_REPORT_SHIPPING_COST,
  };

  return (
    <CustomePage
      apis={shippingCostReportSummeryApis}
      title="گزارش تجمیعی قیمت شرکت های حمل و نقل"
      canAdd={false} // Read-only page
      canEdit={false} // Read-only page
      permissionsTag="shippingCostReportSummery"
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

export default ShippingCostReportSummery;
