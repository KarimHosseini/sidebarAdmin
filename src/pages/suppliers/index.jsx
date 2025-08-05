/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  suppliers,
  EDIT_ACTIVE_SUPLIER,
  EXPORT_suppliers,
  CREATE_SUPLIER,
  EDIT_SUPLIER,
  DELETE_SUPLIER,
} from "../../helpers/api-routes";

const Suppliers = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  const suppliersFields = [
    {
      name: 'title',
      label: 'نام تامین کننده',
      type: 'textInput',
      required: true
    },
    {
      name: 'phone',
      label: 'تلفن',
      type: 'textInput',
      required: false
    },
    {
      name: 'email',
      label: 'ایمیل',
      type: 'textInput',
      required: false,
      props: {
        dir: 'ltr'
      }
    },
    {
      name: 'address',
      label: 'آدرس',
      type: 'textInput',
      required: false,
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
        rows: 3
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

  const suppliersApis = {
    GET_DATA: suppliers,
    EXPORT_DATA: EXPORT_suppliers,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_SUPLIER,
    CREATE_DATA: CREATE_SUPLIER,
    EDIT_DATA: EDIT_SUPLIER,
    DELETE_DATA: DELETE_SUPLIER,
  };

  return (
    <CustomePage
      apis={suppliersApis}
      title="تامین کنندگان"
      canAdd={true}
      canEdit={true}
      permissionsTag="suppliers"
      customeModal={false}
      feilds={suppliersFields}
      broadCrumb={[
        {
          title: "مدیریت محصولات",
          path: "/products",
        },
      ]}
    />
  );
};

export default Suppliers;
