/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_GUARANTOR,
  DELETE_ALL_GUARANTOR,
  EDIT_ACTIVE_ALL_GUARANTOR,
  EDIT_ACTIVE_GUARANTOR,
  EXPORT_GUARANTOR,
  CREATE_GUARANTOR,
  EDIT_GUARANTOR,
  DELETE_GUARANTOR,
} from "../../helpers/api-routes";

const Guarantor = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define form fields for the guarantor form
  const guarantorFields = [
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
  const guarantorApis = {
    GET_DATA: ALL_GUARANTOR,
    EXPORT_DATA: EXPORT_GUARANTOR,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_GUARANTOR,
    DELETE_ALL_DATA: DELETE_ALL_GUARANTOR,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_GUARANTOR,
    CREATE_DATA: CREATE_GUARANTOR,
    EDIT_DATA: EDIT_GUARANTOR,
    DELETE_DATA: DELETE_GUARANTOR,
  };

  return (
    <CustomePage
      apis={guarantorApis}
      title="تضمین کننده"
      canAdd={true}
      canEdit={true}
      permissionsTag="guarantor"
      customeModal={false}
      feilds={guarantorFields}
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/companyInfo",
        },
      ]}
    />
  );
};

export default Guarantor;
