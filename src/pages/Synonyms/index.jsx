/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_SYNONYMS,
  EDIT_ACTIVE_SYNOIM,
  EXPORT_ALL_SYNONYMS,
  CREATE_SYNONIM,
  EDIT_SYNOIM,
  DELETE_SYNONYM,
} from "../../helpers/api-routes";

const Synonyms = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define form fields for the synonyms form
  const synonymsFields = [
    {
      name: 'title',
      label: 'کلمه اصلی',
      type: 'textInput',
      required: true
    },
    {
      name: 'synonyms',
      label: 'مترادف ها (با کاما جدا کنید)',
      type: 'textInput',
      required: true,
      props: {
        multiline: true,
        rows: 3
      }
    },
    {
      name: 'description',
      label: 'توضیحات',
      type: 'textInput',
      required: false,
      props: {
        multiline: true,
        rows: 2
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
  const synonymsApis = {
    GET_DATA: ALL_SYNONYMS,
    EXPORT_DATA: EXPORT_ALL_SYNONYMS,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_SYNOIM,
    CREATE_DATA: CREATE_SYNONIM,
    EDIT_DATA: EDIT_SYNOIM,
    DELETE_DATA: DELETE_SYNONYM,
  };

  return (
    <CustomePage
      apis={synonymsApis}
      title="مترادف ها"
      canAdd={true}
      canEdit={true}
      permissionsTag="synonyms"
      customeModal={false}
      feilds={synonymsFields}
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/companyInfo",
        },
      ]}
    />
  );
};

export default Synonyms;
