/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_SCRIPTS,
  DELETE_ALL_SCRIPTS,
  EDIT_ACTIVE_ALL_SCRIPTS,
  EDIT_ACTIVE_SCRIPTS,
  EXPORT_SCRIPTS,
  CREATE_SCRIPTS,
  EDIT_SCRIPTS,
  DELETE_SCRIPTS,
} from "../../helpers/api-routes";

const Scripts = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define form fields for the scripts form
  const scriptsFields = [
    {
      name: 'title',
      label: 'عنوان',
      type: 'textInput',
      required: true
    },
    {
      name: 'value',
      label: 'کد اسکریپت',
      type: 'codeEditor',
      required: true,
      props: {
        language: 'html',
        height: '300px',
        theme: 'vs-dark',
        options: {
          minimap: { enabled: true },
          automaticLayout: true,
        }
      }
    }
  ];

  // Define APIs for CRUD operations
  const scriptsApis = {
    GET_DATA: ALL_SCRIPTS,
    EXPORT_DATA: EXPORT_SCRIPTS,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_SCRIPTS,
    DELETE_ALL_DATA: DELETE_ALL_SCRIPTS,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_SCRIPTS,
    CREATE_DATA: CREATE_SCRIPTS,
    EDIT_DATA: EDIT_SCRIPTS,
    DELETE_DATA: DELETE_SCRIPTS,
  };

  return (
    <CustomePage
      apis={scriptsApis}
      title="اسکریپت ها"
      canAdd={true}
      canEdit={true}
      permissionsTag="scripts"
      customeModal={false}
      feilds={scriptsFields}
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/companyInfo",
        },
      ]}
    />
  );
};

export default Scripts;
