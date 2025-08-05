/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import CustomePage from "../../components/customePage";
import RedirectModal from "../../components/blogs/redirect";
import {
  BRANDS,
  EDIT_ACTIVE_BRAND,
  EXPORT_BRANDS,
  CREATE_BRAND,
  EDIT_BRAND,
  DELETE_BRAND,
  CREATE_REDIRECT_GENRALL,
} from "../../helpers/api-routes";

const Brands = () => {
  // Define form fields for the brand form
  const brandFields = [
    {
      name: 'title',
      label: 'نام برند',
      type: 'textInput',
      required: true
    },
    {
      name: 'slug',
      label: 'نشانی',
      type: 'textInput',
      required: true
    },
    {
      name: 'description',
      label: 'توضیحات (صفحه شاپ)',
      type: 'editor',
      required: false
    },
    {
      name: 'active',
      label: 'فعال/غیر فعال',
      type: 'switch',
      required: false,
      defaultValue: true
    },
    {
      name: 'avatar',
      label: 'تصویر برند',
      type: 'uploader',
      required: false
    }
  ];

  // Define APIs for CRUD operations
  const brandApis = {
    GET_DATA: BRANDS,
    EXPORT_DATA: EXPORT_BRANDS,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_BRAND,
    CREATE_DATA: CREATE_BRAND,
    EDIT_DATA: EDIT_BRAND,
    DELETE_DATA: DELETE_BRAND,
    REDIRECT_API: CREATE_REDIRECT_GENRALL
  };

  return (
    <CustomePage
      apis={brandApis}
      title="برند"
      canAdd={true}
      canEdit={true}
      permissionsTag="brand"
      customeModal={false}
      feilds={brandFields}
      broadCrumb={[
        {
          title: "مدیریت محصولات",
          path: "/products",
        },
      ]}
      redirectModal={RedirectModal}
      redirectModalProps={{
        name: "slug"
      }}
    />
  );
};

export default Brands;
