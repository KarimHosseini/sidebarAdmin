/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  GET_PAGE_SEO,
  EDIT_ACTIVE_PAGE_SEO,
  EXPORT_PAGE_SEO,
  CREATE_PAGE_SEO,
  EDIT_PAGE_SEO,
  DELETE_PAGE_SEO,
} from "../../helpers/api-routes";

const SEO = () => {
  const { userPermissions } = useSelector((state) => state.relationals);


  // Define APIs for CRUD operations
  const seoApis = {
    GET_DATA: GET_PAGE_SEO,
    EXPORT_DATA: EXPORT_PAGE_SEO,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_PAGE_SEO,
    CREATE_DATA: CREATE_PAGE_SEO,
    EDIT_DATA: EDIT_PAGE_SEO,
    DELETE_DATA: DELETE_PAGE_SEO,
  };

  return (
    <CustomePage
      apis={seoApis}
      title="تنظیمات SEO"
      canAdd={true}
      canEdit={true}
      permissionsTag="seo"
      customeModal={false}
      feilds={[]}
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/companyInfo",
        },
      ]}
    />
  );
};

export default SEO;
