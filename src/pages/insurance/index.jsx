/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  ALL_SERVICE_TYPE,
  baseUrl,
  EDIT_ACTIVE_INSURANCE,
  EXPORT_INSURANCE,
  GET_INSURANCE,
  TYPEPS_INSURANCE,
  CREATE_INSURANCE,
  EDIT_INSURANCE,
  DELETE_INSURANCE,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const Insurance = () => { 
  const { token } = useSelector((state) => state.user);
  const [types, setTypes] = useState([]);
  const [refreshData, setRefresh] = useState(0);

  // Fetch insurance types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await axiosInstance.get(
          `${baseUrl}/${TYPEPS_INSURANCE}?Page=1&Limit=10000`,
          configReq(token)
        );
        setTypes(res.data.data || []);
      } catch (err) {
        console.error('Error fetching insurance types:', err);
      }
    };

    fetchTypes();
  }, [token]);

  // Define form fields for the insurance form
  const insuranceFields = [
    {
      name: 'title',
      label: 'نام بیمه',
      type: 'textInput',
      required: true
    },
    {
      name: 'code',
      label: 'کد',
      type: 'textInput',
      required: false
    },
    {
      name: 'type',
      label: 'نام سرویس',
      type: 'dropdown',
      required: false,
      options: types || [],
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'description',
      label: 'توضیحات کلی بیمه',
      type: 'textInput',
      required: false,
      props: {
        multiline: true,
        rows: 3
      }
    },
    {
      name: 'minIsurancePrice',
      label: 'حداقل قیمت محصول',
      type: 'numberInput',
      required: false,
      props: {
        suffix: 'تومان'
      }
    },
    {
      name: 'maxInsurancePrice',
      label: 'حداکثر قیمت محصول',
      type: 'numberInput',
      required: false,
      props: {
        suffix: 'تومان'
      }
    },
    {
      name: 'percent',
      label: 'درصد',
      type: 'numberInput',
      required: false,
      props: {
        suffix: '%'
      },
      // Only show when type is 1 (percentage type)
      conditional: (formData) => formData.type === 1
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
  const insuranceApis = {
    GET_DATA: GET_INSURANCE,
    EXPORT_DATA: EXPORT_INSURANCE,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_INSURANCE,
    CREATE_DATA: CREATE_INSURANCE,
    EDIT_DATA: EDIT_INSURANCE,
    DELETE_DATA: DELETE_INSURANCE,
  };

  // Custom form data transformation for dropdown values
  const handleFormChange = (fieldName, value) => {
    // Handle type dropdown object values
    if (fieldName === 'type' && value && typeof value === 'object') {
      return {
        type: value.id,
        inType: value.type
      };
    }
    return value;
  };

  return (
    <CustomePage
      apis={insuranceApis}
      title="بیمه ها"
      canAdd={true}
      canEdit={true}
      permissionsTag="insurance"
      customeModal={false}
      feilds={insuranceFields}
      broadCrumb={[
        {
          title: "مدیریت محصولات",
          path: "/products",
        },
      ]}
      onFormChange={handleFormChange}
      key={`insurance-${refreshData}-${types?.length}`}
    />
  );
};

export default Insurance;
