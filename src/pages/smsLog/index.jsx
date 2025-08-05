/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  DELETE_ALL_SMS_LOG,
  EXPORT_GET_SMS_LOG,
  GET_SMS_LOG,
} from "../../helpers/api-routes";

const SmsLog = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for SMS log operations (read-only)
  const smsLogApis = {
    GET_DATA: GET_SMS_LOG,
    EXPORT_DATA: EXPORT_GET_SMS_LOG,
    DELETE_ALL_DATA: DELETE_ALL_SMS_LOG,
  };

  return (
    <CustomePage
      apis={smsLogApis}
      title="پیامک های ارسال شده"
      canAdd={false} // Read-only page
      canEdit={false} // Read-only page
      permissionsTag="smslog"
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

export default SmsLog;
