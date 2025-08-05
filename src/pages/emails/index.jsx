/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import { EXPORT_EMAILS, GET_EMAILS } from "../../helpers/api-routes";

const EmailSended = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for read-only operations
  const emailsApis = {
    GET_DATA: GET_EMAILS,
    EXPORT_DATA: EXPORT_EMAILS,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only
  };

  return (
    <CustomePage
      apis={emailsApis}
      title="ایمیل های ارسال شده"
      canAdd={false}
      canEdit={false}
      permissionsTag="emailLog"
      customeModal={false}
      feilds={[]} // No form fields for read-only page
      broadCrumb={[
        {
          title: "پیام ها",
          path: "/sms",
        },
      ]}
      extraActions={[]}
      showSync={true}
      showExport={true}
    />
  );
};

export default EmailSended;
