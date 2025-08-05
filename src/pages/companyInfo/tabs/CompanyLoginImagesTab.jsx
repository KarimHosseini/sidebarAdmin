import React from 'react';
import CustomePage from '../../../components/customePage';
import {
  GET_LOGIN_IMAGES,
  EXPORT_LOGIN_IMAGES,
  EDIT_ACTIVE_LOGIN_IMAGES,
  CREATE_LOGIN_IMAGE,
  EDIT_LOGIN_IMAGE,
  DELETE_LOGIN_IMAGE,
} from '../../../helpers/api-routes';

const CompanyLoginImagesTab = () => {
  // Define form fields for login images
  const loginImageFields = [
    {
      name: 'title',
      label: 'عنوان تصویر',
      type: 'textInput',
      required: true,
    },
    {
      name: 'avatar',
      label: 'تصویر',
      type: 'uploader',
      required: true,
    },
    {
      name: 'position',
      label: 'موقعیت نمایش',
      type: 'dropdown',
      required: true,
      options: [
        { id: 'login', title: 'صفحه ورود' },
        { id: 'register', title: 'صفحه ثبت نام' },
        { id: 'both', title: 'هر دو صفحه' },
      ],
    },
    {
      name: 'priority',
      label: 'اولویت نمایش',
      type: 'numberInput',
      required: false,
      defaultValue: 0,
    },
    {
      name: 'link',
      label: 'لینک (اختیاری)',
      type: 'textInput',
      required: false,
      props: {
        ltr: true,
      },
    },
    {
      name: 'alt',
      label: 'متن جایگزین (Alt)',
      type: 'textInput',
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
  const loginImageApis = {
    GET_DATA: GET_LOGIN_IMAGES,
    EXPORT_DATA: EXPORT_LOGIN_IMAGES,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_LOGIN_IMAGES,
    CREATE_DATA: CREATE_LOGIN_IMAGE,
    EDIT_DATA: EDIT_LOGIN_IMAGE,
    DELETE_DATA: DELETE_LOGIN_IMAGE,
  };

  return (
    <CustomePage
      apis={loginImageApis}
      title="تصاویر صفحه ورود"
      canAdd={true}
      canEdit={true}
      permissionsTag="companyInfo"
      feilds={loginImageFields}
      customeModal={false}
    />
  );
};

export default CompanyLoginImagesTab;