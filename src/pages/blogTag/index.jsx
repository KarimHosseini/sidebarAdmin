/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import CustomePage from "../../components/customePage";
import {
  GET_BLOG_Tag,
  EDIT_BLOG_Tag,
  EXPORT_BLOG_Tag,
  CREATE_BLOG_Tag,
  DELETE_BLOG_Tag,
} from "../../helpers/api-routes";

const BlogTag = () => {
  // Define form fields for the blog tag form
  const blogTagFields = [
    {
      name: 'title',
      label: 'نام تگ جدید',
      type: 'textInput',
      required: true
    },
    {
      name: 'active',
      label: 'پیش نمایش',
      type: 'switch',
      required: false,
      defaultValue: true
    }
  ];

  // Define APIs for CRUD operations
  const blogTagApis = {
    GET_DATA: GET_BLOG_Tag,
    EXPORT_DATA: EXPORT_BLOG_Tag,
    EDIT_ACTIVE_DATA: EDIT_BLOG_Tag,
    CREATE_DATA: CREATE_BLOG_Tag,
    EDIT_DATA: EDIT_BLOG_Tag,
    DELETE_DATA: DELETE_BLOG_Tag,
  };

  return (
    <CustomePage
      apis={blogTagApis}
      title="تگ"
      canAdd={true}
      canEdit={true}
      permissionsTag="blogTag"
      customeModal={false}
      feilds={blogTagFields}
      broadCrumb={[
        {
          title: "مدیریت بلاگ",
          path: "/blog",
        },
      ]}
    />
  );
};

export default BlogTag;
