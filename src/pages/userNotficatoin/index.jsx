/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_USER_NOTIFACTION,
  GET_USER_NOTIFACTION,
} from "../../helpers/api-routes";

const UserNotifaction = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for user notification operations (read-only)
  const userNotifactionApis = {
    GET_DATA: GET_USER_NOTIFACTION,
    EXPORT_DATA: EXPORT_USER_NOTIFACTION,
  };

  return (
    <CustomePage
      apis={userNotifactionApis}
      title="اطلاع رسانی های ارسال شده از ادمین"
      canAdd={false} // Read-only page
      canEdit={false} // Read-only page
      permissionsTag="userNotification"
      customeModal={false} // No modals needed
      feilds={[]} // No form fields
      broadCrumb={[
        {
          title: "پیام ها",
          path: "/sms",
        },
      ]}
      showSync={true}
      showExport={true}
    />
  );
};

export default UserNotifaction;
