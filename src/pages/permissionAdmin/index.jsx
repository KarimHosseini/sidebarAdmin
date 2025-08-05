/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_ADMIN_PERMISSIONS,
  DELETE_ALL_ADMIN_PERMISSIONS,
  EDIT_ACTIVE_ALL_ADMIN_PERMISSIONS,
  EDIT_ADMIN_PERMISSIONS,
  EXPORT_ADMIN_PERMISSIONS,
  CREATE_ADMIN_PERMISSIONS,
  DELETE_ADMIN_PERMISSIONS,
} from "../../helpers/api-routes";

const PermissionsAdmin = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [refreshData, setRefresh] = useState(0);

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: ALL_ADMIN_PERMISSIONS,
    EXPORT_DATA: EXPORT_ADMIN_PERMISSIONS,
    EDIT_ACTIVE_DATA: EDIT_ADMIN_PERMISSIONS,
    CREATE_DATA: CREATE_ADMIN_PERMISSIONS,
    EDIT_DATA: EDIT_ADMIN_PERMISSIONS,
    DELETE_DATA: DELETE_ADMIN_PERMISSIONS,
    DELETE_ALL_DATA: DELETE_ALL_ADMIN_PERMISSIONS,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_ADMIN_PERMISSIONS,
  };

  // تعریف فیلدهای فرم
  const fields = [
    {
      name: 'title',
      label: 'عنوان',
      type: 'textInput',
      required: true
    },
    {
      name: 'tag',
      label: 'تگ',
      type: 'textInput',
      required: true
    },
    {
      name: 'section',
      label: 'بخش',
      type: 'textInput',
      required: false
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
      name: 'permissionType',
      label: 'نوع دسترسی',
      type: 'dropdown',
      required: false,
      options: [
        { id: 'read', title: 'خواندن' },
        { id: 'write', title: 'نوشتن' },
        { id: 'delete', title: 'حذف' },
        { id: 'admin', title: 'مدیر' }
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
      title="پرمیژن های ادمین"
      canAdd={userPermissions?.permissionAdmin?.add}
      canEdit={userPermissions?.permissionAdmin?.update}
      permissionsTag="permissionAdmin"
      customeModal={false}
      feilds={fields}
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/companyInfo",
        },
      ]}
      key={`permission-admin-${refreshData}`}
    />
  );
};

export default PermissionsAdmin;

// تسک 1: صفحه permissionAdmin به فرم ژنراتور تبدیل شد ✓
