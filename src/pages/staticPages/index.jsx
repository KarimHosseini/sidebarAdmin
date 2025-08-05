/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_STATIC_PAGES,
  EDIT_ACTIVE_STATIC_PAGES,
  EXPORT_STATIC_PAGES,
  CREATE_STATIC_PAGES,
  EDIT_STATIC_PAGES,
  DELETE_STATIC_PAGES,
} from "../../helpers/api-routes";
 
const StaticPages = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define form fields for the static pages form
  const staticPagesFields = [
    {
      name: 'title',
      label: 'عنوان صفحه',
      type: 'textInput',
      required: true
    },
    {
      name: 'slug',
      label: 'نامک (Slug)',
      type: 'textInput',
      required: true,
      props: {
        dir: 'ltr'
      }
    },
    {
      name: 'content',
      label: 'محتوا',
      type: 'editor',
      required: false
    },
    {
      name: 'metaTitle',
      label: 'عنوان متا',
      type: 'textInput',
      required: false
    },
    {
      name: 'metaDescription',
      label: 'توضیحات متا',
      type: 'textInput',
      required: false,
      props: {
        multiline: true,
        rows: 3
      }
    },
    {
      name: 'active',
      label: 'فعال/غیرفعال',
      type: 'switch',
      required: false,
      defaultValue: true
    }
  ];

  // Define APIs for CRUD operations
  const staticPagesApis = {
    GET_DATA: ALL_STATIC_PAGES,
    EXPORT_DATA: EXPORT_STATIC_PAGES,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_STATIC_PAGES,
    CREATE_DATA: CREATE_STATIC_PAGES,
    EDIT_DATA: EDIT_STATIC_PAGES,
    DELETE_DATA: DELETE_STATIC_PAGES,
  };

  return (
    <CustomePage
      apis={staticPagesApis}
      title="صفحات استاتیک"
      canAdd={true}
      canEdit={true}
      permissionsTag="staticPages"
      customeModal={false}
      feilds={staticPagesFields}
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/companyInfo",
        },
      ]}
    />
  );
};

export default StaticPages;
