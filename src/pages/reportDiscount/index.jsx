/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_DISCOUNT_REPORT,
  GET_DISCOUNT_REPORT,
} from "../../helpers/api-routes";

const ReportDiscount = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for read-only operations
  const reportDiscountApis = {
    GET_DATA: GET_DISCOUNT_REPORT,
    EXPORT_DATA: EXPORT_DISCOUNT_REPORT,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only
  };

  return (
    <CustomePage
      apis={reportDiscountApis}
      title="گزارش تخفیف"
      canAdd={false}
      canEdit={false}
      permissionsTag="discountTransaction"
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

export default ReportDiscount;
