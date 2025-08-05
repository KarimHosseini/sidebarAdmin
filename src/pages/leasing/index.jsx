/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  leasings,
  EDIT_ACTIVE_LEASING,
  EXPORT_leasings,
  CREATE_LEASING,
  EDIT_LEASING,
  DELETE_LEASING,
} from "../../helpers/api-routes";

const Leasing = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Provider options for dropdown
  const PROVIDER = [
    { id: 1, title: "تامین کننده 1" },
    { id: 2, title: "تامین کننده 2" },
    { id: 3, title: "تامین کننده 3" },
  ];

  // Define form fields for the leasing form
  const leasingFields = [
    {
      name: 'title',
      label: 'نام',
      type: 'textInput',
      required: true
    },
    {
      name: 'primaryCost',
      label: 'مبلغ',
      type: 'numberInput',
      required: false
    },
    {
      name: 'provider',
      label: 'تامین کننده',
      type: 'dropdown',
      required: false,
      options: PROVIDER,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'message',
      label: 'شرح پیام',
      type: 'textInput',
      required: false,
      props: {
        multiline: true,
        rows: 2
      }
    },
    {
      name: 'active',
      label: 'فعال/غیر فعال',
      type: 'switch',
      required: false,
      defaultValue: true
    },
    {
      name: 'avatar',
      label: 'تصویر',
      type: 'uploader',
      required: false
    }
  ];

  // Define APIs for CRUD operations
  const leasingApis = {
    GET_DATA: leasings,
    EXPORT_DATA: EXPORT_leasings,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_LEASING,
    CREATE_DATA: CREATE_LEASING,
    EDIT_DATA: EDIT_LEASING,
    DELETE_DATA: DELETE_LEASING,
  };

  return (
    <CustomePage
      apis={leasingApis}
      title="لیزینگ"
      canAdd={true}
      canEdit={true}
      permissionsTag="leasing"
      customeModal={false}
      feilds={leasingFields}
      broadCrumb={[
        {
          title: "تسهیلات",
          path: "/facilites",
        },
      ]}
    />
  );
};

export default Leasing;
