/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_RESERVE_REPORT,
  GET_RESERVE_REPORT,
} from "../../helpers/api-routes";

const ReportReserve = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for read-only operations
  const reportReservedApis = {
    GET_DATA: GET_RESERVE_REPORT,
    EXPORT_DATA: EXPORT_RESERVE_REPORT,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only
  };

  return (
    <CustomePage
      apis={reportReservedApis}
      title="گزارش رزرو"
      canAdd={false}
      canEdit={false}
      permissionsTag="ReportReserved"
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

export default ReportReserve;
