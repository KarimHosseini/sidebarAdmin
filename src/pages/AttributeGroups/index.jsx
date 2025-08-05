/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import CustomePage from "../../components/customePage";
import {
  ATTR_GROUPS,
  EDIT_ACTIVE_ATTR_GROUP,
  EXPORT_ATTR_GROUPS,
  CREATE_ATTR_GROUP,
  EDIT_ATTR_GROUP,
  DELETE_ATTR_GROUP,
} from "../../helpers/api-routes";
const AttributeGroups = () => {
  // Define form fields for the attribute groups form
  const attributeGroupFields = [
    {
      name: 'title',
      label: 'نام گروه ویژگی',
      type: 'textInput',
      required: true
    },
    {
      name: 'avatar',
      label: 'تصویر گروه ویژگی',
      type: 'uploader',
      required: false
    }
  ];

  // Define APIs for CRUD operations
  const attributeGroupApis = {
    GET_DATA: ATTR_GROUPS,
    EXPORT_DATA: EXPORT_ATTR_GROUPS,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_ATTR_GROUP,
    CREATE_DATA: CREATE_ATTR_GROUP,
    EDIT_DATA: EDIT_ATTR_GROUP,
    DELETE_DATA: DELETE_ATTR_GROUP,
  };

  return (
    <CustomePage
      apis={attributeGroupApis}
      title="گروه ویژگی"
      canAdd={true}
      canEdit={true}
      permissionsTag="attributeGroup"
      customeModal={false}
      feilds={attributeGroupFields}
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

export default AttributeGroups;
