import React from 'react';
import CustomePage from '../../../components/customePage';
import { 
  GET_SETTINGS, 
  EDIT_SETTINGS 
} from '../../../helpers/api-routes';

const CompanyBasicInfo = () => {
  const fields = [
    {
      name: 'companyName',
      label: 'نام شرکت',
      type: 'text',
      required: true,
      grid: { xs: 12, sm: 6, md: 4 }
    },
    {
      name: 'nationalCode',
      label: 'شناسه ملی',
      type: 'text',
      required: true,
      grid: { xs: 12, sm: 6, md: 4 }
    },
    {
      name: 'economicCode',
      label: 'کد اقتصادی',
      type: 'text',
      grid: { xs: 12, sm: 6, md: 4 }
    },
    {
      name: 'regNumber',
      label: 'شناسه ثبت',
      type: 'text',
      grid: { xs: 12, sm: 6, md: 4 }
    },
    {
      name: 'contactMobile',
      label: 'شماره همراه',
      type: 'text',
      grid: { xs: 12, sm: 6, md: 4 }
    },
    {
      name: 'companyEmail',
      label: 'ایمیل',
      type: 'email',
      grid: { xs: 12, sm: 6, md: 4 }
    },
    {
      name: 'companyDescription',
      label: 'توضیحات',
      type: 'text',
      multiline: true,
      rows: 3,
      grid: { xs: 12, sm: 6 }
    },
    {
      name: 'companySlogan',
      label: 'شعار',
      type: 'text',
      grid: { xs: 12, sm: 6 }
    },
    {
      name: 'LegalInvoice',
      label: 'درخواست فاکتور حقیقی',
      type: 'checkbox',
      grid: { xs: 12, sm: 6, md: 4 }
    },
    {
      name: 'footerCopyright',
      label: 'متن کپی رایت',
      type: 'text',
      grid: { xs: 12 }
    }
  ];

  return (
    <CustomePage
      title="اطلاعات پایه شرکت"
      apis={{
        GET_DATA: GET_SETTINGS,
        EDIT_DATA: EDIT_SETTINGS
      }}
      permissionsTag="companyInfo"
      feilds={fields}
      canAdd={false}
      canEdit={true}
      showSync={false}
      showExport={false}
    />
  );
};

export default CompanyBasicInfo;