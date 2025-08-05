/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EDIT_BLOG_CATEGORY,
  EXPORT_BLOG_CATEGORY,
  GET_BLOG_CATEGORY,
  CREATE_BLOG_CATEGORY,
  DELETE_BLOG_CATEGORY,
} from "../../helpers/api-routes";

const BlogblogCategory = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [allRows, setAllRows] = useState([]);

  // Define form fields based on the modal
  const blogCategoryFields = [
    {
      name: 'title',
      label: 'عنوان',
      type: 'textInput',
      required: true
    },
    {
      name: 'description',
      label: 'توضیحات',
      type: 'textInput',
      required: false
    },
    {
      name: 'parentId',
      label: 'دسته بندی والد',
      type: 'dropdown',
      required: false,
      options: allRows || [],
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'avatar',
      label: 'تصویر',
      type: 'uploader',
      required: false
    },
    {
      name: 'active',
      label: 'وضعیت',
      type: 'switch',
      required: false,
      defaultValue: true
    }
  ];

  // Define APIs for CRUD operations
  const blogCategoryApis = {
    GET_DATA: GET_BLOG_CATEGORY,
    EXPORT_DATA: EXPORT_BLOG_CATEGORY,
    EDIT_ACTIVE_DATA: EDIT_BLOG_CATEGORY,
    CREATE_DATA: CREATE_BLOG_CATEGORY,
    EDIT_DATA: EDIT_BLOG_CATEGORY,
    DELETE_DATA: DELETE_BLOG_CATEGORY,
  };

  return (
    <CustomePage
      apis={blogCategoryApis}
      title="دسته بندی بلاگ"
      canAdd={true}
      canEdit={true}
      permissionsTag="blogCategory"
      customeModal={false}
      feilds={blogCategoryFields}
      broadCrumb={[
        {
          title: "بلاگ",
          path: "/blog",
        },
      ]}
      onDataChange={(data) => {
        setAllRows(data);
      }}
      showSync={true}
      showExport={true}
    />
  );
};

export default BlogblogCategory;
