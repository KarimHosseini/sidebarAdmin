/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import { EXPORT_INBOX, GET_INBOX } from "../../helpers/api-routes";

const Inbox = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for read-only operations
  const inboxApis = {
    GET_DATA: GET_INBOX,
    EXPORT_DATA: EXPORT_INBOX,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only
  };

  return (
    <CustomePage
      apis={inboxApis}
      title="صندوق پیام"
      canAdd={false}
      canEdit={false}
      permissionsTag="inbox"
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

export default Inbox;
