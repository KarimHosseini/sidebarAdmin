/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_PACKAGING,
  DELETE_ALL_PACKAGING,
  EDIT_ACTIVE_ALL_PACKAGING,
  EDIT_ACTIVE_PACKAGING,
  EXPORT_PACKAGING,
  CREATE_PACKAGING,
  EDIT_PACKAGING,
  DELETE_PACKAGING,
} from "../../helpers/api-routes";

const Packaging = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define form fields for the packaging form
  const packagingFields = [
    {
      name: 'name',
      label: 'نام بسته بندی',
      type: 'textInput',
      required: true
    },
    {
      name: 'length',
      label: 'طول',
      type: 'numberInput',
      required: false,
      props: {
        allowZero: true,
        suffix: 'سانتی‌متر'
      }
    },
    {
      name: 'width',
      label: 'عرض',
      type: 'numberInput',
      required: false,
      props: {
        allowZero: true,
        suffix: 'سانتی‌متر'
      }
    },
    {
      name: 'depth',
      label: 'عمق',
      type: 'numberInput',
      required: false,
      props: {
        allowZero: true,
        suffix: 'سانتی‌متر'
      }
    },
    {
      name: 'gap',
      label: 'فاصله بین دسته بندی',
      type: 'numberInput',
      required: false,
      props: {
        allowZero: true,
        suffix: 'سانتی‌متر'
      }
    },
    {
      name: 'description',
      label: 'توضیحات',
      type: 'textInput',
      required: false
    },
    {
      name: 'active',
      label: 'فعال/غیرفعال',
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
  const packagingApis = {
    GET_DATA: ALL_PACKAGING,
    EXPORT_DATA: EXPORT_PACKAGING,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_PACKAGING,
    DELETE_ALL_DATA: DELETE_ALL_PACKAGING,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_PACKAGING,
    CREATE_DATA: CREATE_PACKAGING,
    EDIT_DATA: EDIT_PACKAGING,
    DELETE_DATA: DELETE_PACKAGING,
  };

  return (
    <CustomePage
      apis={packagingApis}
      title="بسته بندی"
      canAdd={true}
      canEdit={true}
      permissionsTag="packaging"
      customeModal={false}
      feilds={packagingFields}
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/companyInfo",
        },
      ]}
    />
  );
};

export default Packaging;
