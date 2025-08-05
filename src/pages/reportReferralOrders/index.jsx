/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_REFERRAL_REPORT,
  GET_REFERRAL_REPORT,
} from "../../helpers/api-routes";

const ReportReferralOrders = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for read-only operations
  const reportReferralOrdersApis = {
    GET_DATA: GET_REFERRAL_REPORT,
    EXPORT_DATA: EXPORT_REFERRAL_REPORT,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only
  };

  return (
    <CustomePage
      apis={reportReferralOrdersApis}
      title="گزارش سفارشات ارجاعی"
      canAdd={false}
      canEdit={false}
      permissionsTag="reportReferralOrders"
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

export default ReportReferralOrders;
