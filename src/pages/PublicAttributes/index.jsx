/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import CustomePage from "../../components/customePage";
import {
  EDIT_ACTIVE_PUBLIC_ATTR,
  EXPORT_PUBLIC_ATTRS,
  PUBLIC_ATTRS,
  CREATE_PUBLIC_ATTR,
  EDIT_PUBLIC_ATTR,
  DELETE_PUBLIC_ATTR,
} from "../../helpers/api-routes";
const PublicAttributes = () => {
  // Define form fields for the public attributes form
  const publicAttributeFields = [
    {
      name: 'title',
      label: 'عنوان ویژگی',
      type: 'textInput',
      required: true
    },
    {
      name: 'name',
      label: 'نام ویژگی',
      type: 'textInput',
      required: true
    },
    {
      name: 'avatar',
      label: 'تصویر ویژگی',
      type: 'uploader',
      required: false
    }
  ];

  // Define APIs for CRUD operations
  const publicAttributeApis = {
    GET_DATA: PUBLIC_ATTRS,
    EXPORT_DATA: EXPORT_PUBLIC_ATTRS,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_PUBLIC_ATTR,
    CREATE_DATA: CREATE_PUBLIC_ATTR,
    EDIT_DATA: EDIT_PUBLIC_ATTR,
    DELETE_DATA: DELETE_PUBLIC_ATTR,
  };

  return (
    <CustomePage
      apis={publicAttributeApis}
      title="ویژگی عمومی"
      canAdd={true}
      canEdit={true}
      permissionsTag="publicAttributes"
      customeModal={false}
      feilds={publicAttributeFields}
      broadCrumb={[
        {
          title: "مدیریت محصولات",
          path: "/products",
        },
        {
          title: " ویژگی ها",
          path: "/attributes",
        },
      ]}
    />
  );
};

export default PublicAttributes;
