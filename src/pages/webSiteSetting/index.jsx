/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_WEBSITE_SETTING,
  GET_WEBSITE_SETTING,
  CREATE_WEBSITE_SETTING,
  EDIT_WEBSITE_SETTING,
  DELETE_WEBSITE_SETTING,
} from "../../helpers/api-routes";

const WebsiteSettings = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [refreshData, setRefresh] = useState(0);

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_WEBSITE_SETTING,
    EXPORT_DATA: EXPORT_WEBSITE_SETTING,
    CREATE_DATA: CREATE_WEBSITE_SETTING,
    EDIT_DATA: EDIT_WEBSITE_SETTING,
    DELETE_DATA: DELETE_WEBSITE_SETTING,
  };

  // تعریف فیلدهای فرم
  const fields = [
    {
      name: 'key',
      label: 'کلید',
      type: 'textInput',
      required: true
    },
    {
      name: 'value',
      label: 'مقدار',
      type: 'textInput',
      required: true,
      props: {
        multiline: true,
        rows: 3
      }
    },
    {
      name: 'description',
      label: 'توضیحات',
      type: 'textInput',
      required: false,
      props: {
        multiline: true,
        rows: 2
      }
    },
    {
      name: 'type',
      label: 'نوع',
      type: 'dropdown',
      required: false,
      options: [
        { id: 'string', title: 'رشته' },
        { id: 'number', title: 'عدد' },
        { id: 'boolean', title: 'بولین' },
        { id: 'json', title: 'JSON' }
      ],
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'isActive',
      label: 'فعال',
      type: 'switch',
      required: false,
      defaultValue: true
    }
  ];

  return (
    <CustomePage
      apis={apis}
      title="تنظیمات کلید های سایت"
      canAdd={userPermissions?.websitekeySetting?.insert}
      canEdit={userPermissions?.websitekeySetting?.update}
      permissionsTag="websitekeySetting"
      customeModal={false}
      feilds={fields}
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/companyInfo",
        },
      ]}
      key={refreshData}
    />
  );
};

export default WebsiteSettings;

// تسک 1: صفحه webSiteSetting به فرم ژنراتور تبدیل شد ✓
