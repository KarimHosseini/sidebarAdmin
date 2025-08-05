import React from 'react';
import CustomePage from '../../../components/customePage';
import {
  GET_SITE_ADDRESS,
  EXPORT_SITE_ADDRESS,
  EDIT_ACTIVE_SITE_ADDRESS,
  CREATE_SITE_ADDRESS,
  EDIT_SITE_ADDRESS,
  DELETE_SITE_ADDRESS,
} from '../../../helpers/api-routes';

const CompanyAddressesTab = () => {
  // Define form fields for addresses
  const addressFields = [
    {
      name: 'title',
      label: 'عنوان آدرس',
      type: 'textInput',
      required: true,
    },
    {
      name: 'address',
      label: 'آدرس',
      type: 'textInput',
      required: true,
      props: {
        multiline: true,
        rows: 3,
      },
    },
    {
      name: 'tel',
      label: 'تلفن',
      type: 'textInput',
      required: false,
    },
    {
      name: 'mobile',
      label: 'موبایل',
      type: 'textInput',
      required: false,
    },
    {
      name: 'postalCode',
      label: 'کد پستی',
      type: 'textInput',
      required: false,
    },
    {
      name: 'latitude',
      label: 'عرض جغرافیایی',
      type: 'numberInput',
      required: false,
    },
    {
      name: 'longitude',
      label: 'طول جغرافیایی',
      type: 'numberInput',
      required: false,
    },
    {
      name: 'active',
      label: 'فعال/غیرفعال',
      type: 'switch',
      defaultValue: true,
    },
  ];

  // Define APIs
  const addressApis = {
    GET_DATA: GET_SITE_ADDRESS,
    EXPORT_DATA: EXPORT_SITE_ADDRESS,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_SITE_ADDRESS,
    CREATE_DATA: CREATE_SITE_ADDRESS,
    EDIT_DATA: EDIT_SITE_ADDRESS,
    DELETE_DATA: DELETE_SITE_ADDRESS,
  };

  return (
    <CustomePage
      apis={addressApis}
      title="آدرس‌ها"
      canAdd={true}
      canEdit={true}
      permissionsTag="companyInfo"
      feilds={addressFields}
      customeModal={false}
    />
  );
};

export default CompanyAddressesTab;