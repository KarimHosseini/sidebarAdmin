/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_TELEGRAM_GROUP,
  EDIT_ACTIVE_TELEGRAM_GROUP,
  EXPORT_TELEGRAM_GROUP,
  CREATE_TELEGRAM_GROUP,
  EDIT_TELEGRAM_GROUP,
  DELETE_TELEGRAM_GROUP,
} from "../../helpers/api-routes";

const TelegramGroup = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define form fields for the telegram group form
  const telegramGroupFields = [
    {
      name: 'title',
      label: 'نام گروه',
      type: 'textInput',
      required: true
    },
    {
      name: 'chatId',
      label: 'شناسه گروه (Chat ID)',
      type: 'textInput',
      required: true,
      props: {
        dir: 'ltr'
      }
    },
    {
      name: 'description',
      label: 'توضیحات',
      type: 'textInput',
      required: false,
      props: {
        multiline: true,
        rows: 3
      }
    },
    {
      name: 'active',
      label: 'فعال/غیرفعال',
      type: 'switch',
      required: false,
      defaultValue: true
    }
  ];

  // Define APIs for CRUD operations
  const telegramGroupApis = {
    GET_DATA: ALL_TELEGRAM_GROUP,
    EXPORT_DATA: EXPORT_TELEGRAM_GROUP,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_TELEGRAM_GROUP,
    CREATE_DATA: CREATE_TELEGRAM_GROUP,
    EDIT_DATA: EDIT_TELEGRAM_GROUP,
    DELETE_DATA: DELETE_TELEGRAM_GROUP,
  };

  return (
    <CustomePage
      apis={telegramGroupApis}
      title="گروه های تلگرام"
      canAdd={true}
      canEdit={true}
      permissionsTag="telegramGroup"
      customeModal={false}
      feilds={telegramGroupFields}
      broadCrumb={[
        {
          title: "پیام ها",
          path: "/sms",
        },
      ]}
    />
  );
};

export default TelegramGroup;
