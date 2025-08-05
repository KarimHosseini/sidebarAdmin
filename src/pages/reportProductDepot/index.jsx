/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_REPORT_DEPOT,
  GET_REPORT_DEPOT,
} from "../../helpers/api-routes";

const ReportProductDepot = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for read-only operations
  const reportProductDepotApis = {
    GET_DATA: GET_REPORT_DEPOT,
    EXPORT_DATA: EXPORT_REPORT_DEPOT,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only
  };

  return (
    <CustomePage
      apis={reportProductDepotApis}
      title="گزارش انبار محصولات"
      canAdd={false}
      canEdit={false}
      permissionsTag="reportProductDepot"
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

export default ReportProductDepot;
