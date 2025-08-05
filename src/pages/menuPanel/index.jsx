/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_PANEL_MENU,
  DELETE_ALL_PANEL_MENU,
  EDIT_ACTIVE_ALL_PANEL_MENU,
  EDIT_ACTIVE_PANEL_MENU,
  EXPORT_PANEL_MENU,
  CREATE_PANEL_MENU,
  EDIT_PANEL_MENU,
  DELETE_PANEL_MENU,
} from "../../helpers/api-routes";

const MenuPanel = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define form fields for the menuPanel form
  const menuPanelFields = [
    {
      name: 'title',
      label: 'نام',
      type: 'textInput',
      required: true
    },
    {
      name: 'order',
      label: 'اولویت',
      type: 'numberInput',
      required: false
    },
    {
      name: 'url',
      label: 'نشانی',
      type: 'textInput',
      required: false,
      props: {
        dir: 'ltr'
      }
    },
    {
      name: 'active',
      label: 'فعال/غیرفعال',
      type: 'switch',
      required: false,
      defaultValue: true
    },
    {
      name: 'icon',
      label: 'آیکون',
      type: 'uploader',
      required: false
    }
  ];

  // Define APIs for CRUD operations
  const menuPanelApis = {
    GET_DATA: ALL_PANEL_MENU,
    EXPORT_DATA: EXPORT_PANEL_MENU,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_PANEL_MENU,
    DELETE_ALL_DATA: DELETE_ALL_PANEL_MENU,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_PANEL_MENU,
    CREATE_DATA: CREATE_PANEL_MENU,
    EDIT_DATA: EDIT_PANEL_MENU,
    DELETE_DATA: DELETE_PANEL_MENU,
  };

  return (
    <CustomePage
      apis={menuPanelApis}
      title="منو پنل کاربری"
      canAdd={true}
      canEdit={true}
      permissionsTag="menuPanel"
      customeModal={false}
      feilds={menuPanelFields}
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/companyInfo",
        },
      ]}
    />
  );
};

export default MenuPanel;
