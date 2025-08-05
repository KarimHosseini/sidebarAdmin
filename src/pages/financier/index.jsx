/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  GET_Financier,
  DELETE_ALL_Financier,
  EDIT_ACTIVE_ALL_Financier,
  EDIT_ACTIVE_Financier,
  EXPORT_Financier,
  CREATE_Financier,
  EDIT_Financier,
  DELETE_Financier,
} from "../../helpers/api-routes";

const Financier = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define form fields for the financier form
  const financierFields = [
    {
      name: 'title',
      label: 'عنوان تامین کننده مالی',
      type: 'textInput',
      required: true
    },
    {
      name: 'description',
      label: 'توضیحات تامین کننده مالی',
      type: 'textInput',
      required: false
    },
    {
      name: 'breathingTime',
      label: 'زمان تنفس',
      type: 'textInput',
      required: false
    },
    {
      name: 'startBreathingDayInMonth',
      label: 'شروع تنفس در ماه جاری',
      type: 'textInput',
      required: false
    },
    {
      name: 'hasApi',
      label: 'دارای api',
      type: 'switch',
      required: false,
      defaultValue: false
    },
    {
      name: 'avatar',
      label: 'تصویر',
      type: 'uploader',
      required: false
    }
  ];

  // Define APIs for CRUD operations
  const financierApis = {
    GET_DATA: GET_Financier,
    EXPORT_DATA: EXPORT_Financier,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_Financier,
    DELETE_ALL_DATA: DELETE_ALL_Financier,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_Financier,
    CREATE_DATA: CREATE_Financier,
    EDIT_DATA: EDIT_Financier,
    DELETE_DATA: DELETE_Financier,
  };

  return (
    <CustomePage
      apis={financierApis}
      title="تامین کننده مالی"
      canAdd={true}
      canEdit={true}
      permissionsTag="financier"
      customeModal={false}
      feilds={financierFields}
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/companyInfo",
        },
      ]}
    />
  );
};

export default Financier;
