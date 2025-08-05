import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import { 
  EXPORT_TAG_SEO, 
  GET_TAG_SEO, 
  CREATE_TAG_SEO, 
  EDIT_TAG_SEO, 
  DELETE_TAG_SEO 
} from "../../helpers/api-routes";

const SEOTag = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define the dropdown options for type field
  const typeOptions = [
    { id: 1, title: "title tag" },
    { id: 2, title: "meta tag" },
    { id: 3, title: "link tag" },
  ];

  // Define APIs for CRUD operations
  const seoTagApis = {
    GET_DATA: GET_TAG_SEO,
    EXPORT_DATA: EXPORT_TAG_SEO,
    CREATE_DATA: CREATE_TAG_SEO,
    EDIT_DATA: EDIT_TAG_SEO,
    DELETE_DATA: DELETE_TAG_SEO,
  };

  // Define form fields for the modal
  const seoTagFields = [
    {
      name: "name",
      label: "نام",
      type: "textInput",
      required: true,
    },
    {
      name: "type",
      label: "نوع",
      type: "dropdown",
      required: true,
      options: typeOptions,
      valueKey: "id",
      displayKey: "title",
    },
  ];

  return (
    <CustomePage
      apis={seoTagApis}
      title="مدیریت tag SEO"
      canAdd={true}
      canEdit={true}
      permissionsTag="seoTag"
      customeModal={false}
      feilds={seoTagFields}
      broadCrumb={[
        {
          title: "تنظیمات سئو",
          path: "/seoTag",
        },
      ]}
      extraActions={[]}
      showSync={true}
      showExport={true}
    />
  );
};

export default SEOTag;
