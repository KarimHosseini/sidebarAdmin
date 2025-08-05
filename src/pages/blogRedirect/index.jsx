/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_BLOG_REDIRECT,
  GET_BLOG_REDIRECT,
} from "../../helpers/api-routes";

const BlogsRedirect = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for read-only operations
  const blogRedirectApis = {
    GET_DATA: GET_BLOG_REDIRECT,
    EXPORT_DATA: EXPORT_BLOG_REDIRECT,
    // No CREATE, EDIT, DELETE operations for blog redirects
  };

  return (
    <CustomePage
      apis={blogRedirectApis}
      title="ریدایرکت بلاگ"
      canAdd={false}
      canEdit={false}
      permissionsTag="blogRedirect"
      customeModal={false}
      feilds={[]} // No form fields for blog redirects
      broadCrumb={[
        {
          title: "بلاگ",
          path: "/blog",
        },
      ]}
      extraActions={[]}
      showSync={true}
      showExport={true}
    />
  );
};

export default BlogsRedirect;
