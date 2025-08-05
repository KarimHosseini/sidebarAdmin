/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_REDIRECT_GENRALL,
  EDIT_ACTIVE_REDIRECT_GENRALL,
  EXPORT_REDIRECT_GENRALL,
  CREATE_REDIRECT_GENRALL,
  EDIT_REDIRECT_GENRALL,
  DELETE_REDIRECT_GENRALL,
} from "../../helpers/api-routes";

const Redirects = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Status options for redirect type
  const STATUS = [
    { value: 301, title: "301 - Moved Permanently" },
    { value: 302, title: "302 - Found (Temporary)" },
    { value: 307, title: "307 - Temporary Redirect" },
    { value: 308, title: "308 - Permanent Redirect" },
  ];

  // Define form fields for the redirect form
  const redirectFields = [
    {
      name: 'FromUrl',
      label: 'URL مبدا',
      type: 'textInput',
      required: true,
      props: {
        dir: 'ltr',
        disabled: false // Will be disabled in edit mode
      }
    },
    {
      name: 'ToUrl',
      label: 'URL مقصد',
      type: 'textInput',
      required: true,
      props: {
        dir: 'ltr'
      }
    },
    {
      name: 'RedirectType',
      label: 'نوع تغیر مسیر',
      type: 'dropdown',
      required: true,
      options: STATUS,
      props: {
        valueKey: 'value',
        labelKey: 'title'
      }
    },
    {
      name: 'IsActive',
      label: 'فعال/غیر فعال',
      type: 'switch',
      required: false,
      defaultValue: true
    }
  ];

  // Define APIs for CRUD operations
  const redirectApis = {
    GET_DATA: ALL_REDIRECT_GENRALL,
    EXPORT_DATA: EXPORT_REDIRECT_GENRALL,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_REDIRECT_GENRALL,
    CREATE_DATA: CREATE_REDIRECT_GENRALL,
    EDIT_DATA: EDIT_REDIRECT_GENRALL,
    DELETE_DATA: DELETE_REDIRECT_GENRALL,
  };

  return (
    <CustomePage
      apis={redirectApis}
      title="ریدایرکت ها"
      canAdd={true}
      canEdit={true}
      permissionsTag="redirect"
      customeModal={false}
      feilds={redirectFields}
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/companyInfo",
        },
      ]}
    />
  );
};

export default Redirects;
