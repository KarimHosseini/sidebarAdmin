import React from 'react';
import CustomePage from '../../../components/customePage';
import {
  GET_SITE_LINK as GET_SITELINKS,
  EXPORT_SITE_LINK as EXPORT_SITELINKS,
  EDIT_ACTIVE_SITE_LINK as EDIT_ACTIVE_SITELINKS,
  CREATE_SITE_LINK as CREATE_SITELINK,
  EDIT_SITE_LINK as EDIT_SITELINK,
  DELETE_SITE_LINK as DELETE_SITELINK,
} from '../../../helpers/api-routes';

const CompanyLinksTab = () => {
  // Define form fields for site links
  const siteLinkFields = [
    {
      name: 'title',
      label: 'عنوان لینک',
      type: 'textInput',
      required: true,
    },
    {
      name: 'link',
      label: 'آدرس لینک',
      type: 'textInput',
      required: true,
      props: {
        ltr: true,
      },
    },
    {
      name: 'position',
      label: 'موقعیت',
      type: 'dropdown',
      required: true,
      options: [
        { id: 'header', title: 'هدر' },
        { id: 'footer', title: 'فوتر' },
        { id: 'both', title: 'هر دو' },
      ],
    },
    {
      name: 'priority',
      label: 'اولویت',
      type: 'numberInput',
      required: false,
      defaultValue: 0,
    },
    {
      name: 'description',
      label: 'توضیحات',
      type: 'textInput',
      required: false,
      props: {
        multiline: true,
        rows: 2,
      },
    },
    {
      name: 'active',
      label: 'فعال/غیرفعال',
      type: 'switch',
      defaultValue: true,
    },
  ];

  // Define APIs
  const siteLinkApis = {
    GET_DATA: GET_SITELINKS,
    EXPORT_DATA: EXPORT_SITELINKS,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_SITELINKS,
    CREATE_DATA: CREATE_SITELINK,
    EDIT_DATA: EDIT_SITELINK,
    DELETE_DATA: DELETE_SITELINK,
  };

  return (
    <CustomePage
      apis={siteLinkApis}
      title="لینک‌های سایت"
      canAdd={true}
      canEdit={true}
      permissionsTag="companyInfo"
      feilds={siteLinkFields}
      customeModal={false}
    />
  );
};

export default CompanyLinksTab;