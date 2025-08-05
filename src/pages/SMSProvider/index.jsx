/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_SMS_PROVIDER,
  DELETE_ALL_SMS_PROVIDER,
  EDIT_ACTIVE_ALL_SMS_PROVIDER,
  EDIT_ACTIVE_SMS_PROVIDER,
  EXPORT_SMS_PROVIDER,
  CREATE_SMS_PROVIDER,
  EDIT_SMS_PROVIDER,
  DELETE_SMS_PROVIDER,
} from "../../helpers/api-routes";

const SMSProvider = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [refreshData, setRefresh] = useState(0);

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: ALL_SMS_PROVIDER,
    EXPORT_DATA: EXPORT_SMS_PROVIDER,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_SMS_PROVIDER,
    DELETE_ALL_DATA: DELETE_ALL_SMS_PROVIDER,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_SMS_PROVIDER,
    CREATE_DATA: CREATE_SMS_PROVIDER,
    EDIT_DATA: EDIT_SMS_PROVIDER,
    DELETE_DATA: DELETE_SMS_PROVIDER,
  };

  // تعریف انواع خط
  const lineTypes = [
    { id: 1, title: "اشتراکی" },
    { id: 2, title: "خدماتی" },
  ];

  const linePriorities = [
    { id: 1, title: "خط اشتراکی" },
    { id: 2, title: "خط خدماتی" },
  ];

  // تعریف فیلدهای فرم برای modal
  const fields = [
    {
      name: 'title',
      label: 'عنوان',
      type: 'textInput',
      required: true,
      grid: { xs: 12, md: 6 }
    },
    {
      name: 'providerName',
      label: 'عنوان سرویس دهنده های اس ام اس',
      type: 'textInput',
      required: true,
      grid: { xs: 12, md: 6 }
    },
    {
      name: 'description',
      label: 'توضیحات',
      type: 'textInput',
      required: false,
      props: {
        multiline: true,
        rows: 2
      },
      grid: { xs: 12 }
    },
    {
      name: 'servicePriority',
      label: 'اولویت سرویس',
      type: 'numberInput',
      required: false,
      grid: { xs: 12, md: 6 }
    },
    {
      name: 'lineType',
      label: 'نوع خط ارسالی',
      type: 'dropdown',
      required: false,
      options: lineTypes,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      },
      grid: { xs: 12, md: 6 }
    },
    {
      name: 'linePriority',
      label: 'اولویت استفاده از خطوط',
      type: 'dropdown',
      required: false,
      options: linePriorities,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      },
      grid: { xs: 12, md: 6 }
    },
    {
      name: 'serviceLineActive',
      label: 'وضعیت خط خدماتی',
      type: 'switch',
      required: false,
      defaultValue: false,
      grid: { xs: 12, md: 6 }
    },
    {
      name: 'shareLineActive',
      label: 'وضعیت خط اشتراکی',
      type: 'switch',
      required: false,
      defaultValue: false,
      grid: { xs: 12, md: 6 }
    },
    {
      name: 'serviceActive',
      label: 'فعال/غیرفعال سرویس',
      type: 'switch',
      required: false,
      defaultValue: true,
      grid: { xs: 12, md: 6 }
    }
  ];

  return (
    <CustomePage
      apis={apis}
      title="سرویس دهنده های اس ام اس"
      canAdd={userPermissions?.smsProvider?.insert}
      canEdit={userPermissions?.smsProvider?.update}
      permissionsTag="smsProvider"
      customeModal={false}
      feilds={fields}
      broadCrumb={[
        {
          title: "پیام ها",
          path: "/sms",
        },
      ]}
      key={refreshData}
    />
  );
};

export default SMSProvider;
