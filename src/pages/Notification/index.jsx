/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_NOTIFICATIONS,
  EDIT_ACTIVE_NOTIFICATION,
  EXPORT_ALL_NOTIFICATIONS,
  CREATE_NOTIFICATION,
  EDIT_NOTIFICATION,
  DELETE_NOTIFICATION,
} from "../../helpers/api-routes";

const Notification = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Type options for dropdown
  const TYPE = [
    { id: "پاپ آپ", title: "پاپ آپ" },
    { id: "بنر", title: "بنر" },
    { id: "اسلایدر", title: "اسلایدر" },
  ];

  // Define form fields for the notification form
  const notificationFields = [
    {
      name: 'type',
      label: 'نوع',
      type: 'dropdown',
      required: true,
      options: TYPE,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'title',
      label: 'عنوان',
      type: 'textInput',
      required: true
    },
    {
      name: 'link',
      label: 'لینک',
      type: 'textInput',
      required: false,
      props: {
        dir: 'ltr'
      }
    },
    {
      name: 'count',
      label: 'تعداد دفعات نمایش',
      type: 'numberInput',
      required: false,
      // Only show when type is "پاپ آپ"
      conditional: (formData) => formData.type === "پاپ آپ"
    },
    {
      name: 'image',
      label: 'تصویر',
      type: 'uploader',
      required: false
    },
    {
      name: 'active',
      label: 'فعال/غیرفعال',
      type: 'switch',
      required: false,
      defaultValue: true
    },
    {
      name: 'mobileView',
      label: 'نمایش در موبایل',
      type: 'switch',
      required: false,
      defaultValue: false
    }
  ];

  // Define APIs for CRUD operations
  const notificationApis = {
    GET_DATA: ALL_NOTIFICATIONS,
    EXPORT_DATA: EXPORT_ALL_NOTIFICATIONS,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_NOTIFICATION,
    CREATE_DATA: CREATE_NOTIFICATION,
    EDIT_DATA: EDIT_NOTIFICATION,
    DELETE_DATA: DELETE_NOTIFICATION,
  };

  return (
    <CustomePage
      apis={notificationApis}
      title="نوتیفیکیشن"
      canAdd={true}
      canEdit={true}
      permissionsTag="notification"
      customeModal={false}
      feilds={notificationFields}
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/companyInfo",
        },
      ]}
    />
  );
};

export default Notification;
