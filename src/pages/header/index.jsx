/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_HEADER,
  DELETE_ALL_HEADER,
  EDIT_ACTIVE_ALL_HEADER,
  EDIT_ACTIVE_HEADER,
  EXPORT_HEADER,
  CREATE_HEADER,
  EDIT_HEADER,
  DELETE_HEADER,
} from "../../helpers/api-routes";

const Header = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define form fields for the header form
  const headerFields = [
    {
      name: 'id',
      label: 'آی دی',
      type: 'textInput',
      required: false
    },
    {
      name: 'tableName',
      label: 'نام تیبل',
      type: 'textInput',
      required: false
    },
    {
      name: 'fieldName',
      label: 'نام فیلد',
      type: 'textInput',
      required: false
    },
    {
      name: 'title',
      label: 'عنوان',
      type: 'textInput',
      required: false
    },
    {
      name: 'columnType',
      label: 'نوع ستون',
      type: 'textInput',
      required: false
    },
    {
      name: 'style',
      label: 'استایل',
      type: 'textInput',
      required: false
    },
    {
      name: 'styleDark',
      label: 'استایل تم دارک',
      type: 'textInput',
      required: false
    },
    {
      name: 'columnOrder',
      label: 'اولویت ستون',
      type: 'numberInput',
      required: false,
      props: {
        allowZero: true
      }
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
      name: 'visible',
      label: 'نمایش',
      type: 'switch',
      required: false,
      defaultValue: false
    },
    {
      name: 'sortable',
      label: 'قابل مرتب سازی',
      type: 'switch',
      required: false,
      defaultValue: false
    },
    {
      name: 'searchable',
      label: 'قابل جستجو',
      type: 'switch',
      required: false,
      defaultValue: false
    },
    {
      name: 'filterable',
      label: 'قابل فیلتر',
      type: 'switch',
      required: false,
      defaultValue: false
    }
  ];

  // Define APIs for CRUD operations
  const headerApis = {
    GET_DATA: ALL_HEADER,
    EXPORT_DATA: EXPORT_HEADER,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_HEADER,
    DELETE_ALL_DATA: DELETE_ALL_HEADER,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_HEADER,
    CREATE_DATA: CREATE_HEADER,
    EDIT_DATA: EDIT_HEADER,
    DELETE_DATA: DELETE_HEADER,
  };

  return (
    <CustomePage
      apis={headerApis}
      title="هدر"
      canAdd={true}
      canEdit={true}
      permissionsTag="header"
      customeModal={false}
      feilds={headerFields}
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/companyInfo",
        },
      ]}
    />
  );
};

export default Header;
