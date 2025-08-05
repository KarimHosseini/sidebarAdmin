/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  ALL_ADMIN_NOTIFICATIONS,
  EDIT_ACTIVE_ADMIN_NOTIFICATION,
  EXPORT_ALL_ADMIN_NOTIFICATIONS,
  CREATE_ADMIN_NOTIFICATION,
  EDIT_ADMIN_NOTIFICATION,
  DELETE_ADMIN_NOTIFICATION,
  GET_ACCESS_PROFILE,
  baseUrl,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const NotificationAdmin = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  const [roles, setRoles] = useState([]);

  // Fetch roles data
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axiosInstance.get(
          `${baseUrl}/${GET_ACCESS_PROFILE}?Page=1&Limit=1000`,
          configReq(token)
        );
        setRoles(res.data.data || []);
      } catch (err) {
        console.error('Error fetching roles:', err);
      }
    };

    fetchRoles();
  }, [token]);

  // Define form fields for the notification admin form
  const notificationAdminFields = [
    {
      name: 'title',
      label: 'عنوان',
      type: 'textInput',
      required: true
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
      name: 'showCount',
      label: 'تعداد نمایش',
      type: 'numberInput',
      required: false,
      defaultValue: 1
    },
    {
      name: 'startDate',
      label: 'تاریخ شروع',
      type: 'datePicker',
      required: false
    },
    {
      name: 'endDate',
      label: 'تاریخ پایان',
      type: 'datePicker',
      required: false
    },
    {
      name: 'rollIds',
      label: 'نقش ها',
      type: 'searchableDropdown',
      required: false,
      options: roles,
      props: {
        multiple: true,
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'avatar',
      label: 'تصویر',
      type: 'uploader',
      required: false
    }
  ];

  // Define APIs for CRUD operations
  const notificationAdminApis = {
    GET_DATA: ALL_ADMIN_NOTIFICATIONS,
    EXPORT_DATA: EXPORT_ALL_ADMIN_NOTIFICATIONS,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_ADMIN_NOTIFICATION,
    CREATE_DATA: CREATE_ADMIN_NOTIFICATION,
    EDIT_DATA: EDIT_ADMIN_NOTIFICATION,
    DELETE_DATA: DELETE_ADMIN_NOTIFICATION,
  };

  return (
    <CustomePage
      apis={notificationAdminApis}
      title="نوتیفیکیشن ادمین"
      canAdd={true}
      canEdit={true}
      permissionsTag="adminNotification"
      customeModal={false}
      feilds={notificationAdminFields}
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/companyInfo",
        },
      ]}
      key={`notification-admin-${roles?.length}`}
    />
  );
};

export default NotificationAdmin;
