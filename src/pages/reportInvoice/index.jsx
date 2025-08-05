/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_INVOICE_REPORT,
  GET_INVOICE_REPORT,
} from "../../helpers/api-routes";

const ReportInvoice = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for read-only operations
  const reportInvoiceApis = {
    GET_DATA: GET_INVOICE_REPORT,
    EXPORT_DATA: EXPORT_INVOICE_REPORT,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only
  };

  return (
    <CustomePage
      apis={reportInvoiceApis}
      title="گزارش فاکتور"
      canAdd={false}
      canEdit={false}
      permissionsTag="invoiceReport"
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

export default ReportInvoice;
