import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { configReq } from "../../helpers/functions";
import {
  baseUrl,
  DELETE_ALL_CITY,
  EDIT_ACTIVE_ALL_CITY,
  EDIT_ACTIVE_CITY,
  EXPORT_CITY,
  GET_CITY,
  GET_PROVINCE,
  CREATE_CITY,
  DELETE_CITY,
  EDIT_CITY,
} from "../../helpers/api-routes";

const Citiies = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  const [province, setProvince] = useState([]);

  // Fetch provinces for dropdown
  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const res = await axiosInstance.get(
          `${baseUrl}/${GET_PROVINCE}?Page=1&Limit=1000`,
          configReq(token)
        );
        if (res.data.code === 200) {
          setProvince(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching provinces:', err);
      }
    };
    
    fetchProvince();
  }, [token]);

  // City type options
  const cityTypes = [
    { id: 1, title: "شهر" },
    { id: 2, title: "محله" },
  ];

  // Define form fields based on the modal
  const cityFields = [
    {
      name: 'code',
      label: 'کد شهر',
      type: 'textInput',
      required: false
    },
    {
      name: 'provinceId',
      label: 'استان',
      type: 'dropdown',
      required: true,
      options: province,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'title',
      label: 'نام شهر',
      type: 'textInput',
      required: true
    },
    {
      name: 'latitude',
      label: 'latitude',
      type: 'textInput',
      required: false
    },
    {
      name: 'longitude',
      label: 'longitude',
      type: 'textInput',
      required: false
    },
    {
      name: 'type',
      label: 'نوع',
      type: 'dropdown',
      required: false,
      options: cityTypes,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'county',
      label: 'بخش',
      type: 'textInput',
      required: false
    },
    {
      name: 'district',
      label: 'منطقه',
      type: 'textInput',
      required: false
    },
    {
      name: 'active',
      label: 'داخل شهر',
      type: 'switch',
      required: false,
      defaultValue: false
    },
    {
      name: 'region',
      label: 'منطقه شهرداری',
      type: 'textInput',
      required: false,
      conditional: {
        dependsOn: 'active',
        showWhen: true
      }
    },
    {
      name: 'ruralDistrict',
      label: 'دهستان',
      type: 'textInput',
      required: false
    },
    {
      name: 'village',
      label: 'ده',
      type: 'textInput',
      required: false
    },
    {
      name: 'tipaxId',
      label: 'ایدی تیپاکس',
      type: 'textInput',
      required: false
    }
  ];

  // Define APIs for CRUD operations
  const cityApis = {
    GET_DATA: GET_CITY,
    EXPORT_DATA: EXPORT_CITY,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_CITY,
    CREATE_DATA: CREATE_CITY,
    EDIT_DATA: EDIT_CITY,
    DELETE_DATA: DELETE_CITY,
    DELETE_ALL_DATA: DELETE_ALL_CITY,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_CITY,
  };

  return (
    <CustomePage
      apis={cityApis}
      title="شهرها"
      canAdd={true}
      canEdit={true}
      permissionsTag="city"
      customeModal={false}
      feilds={cityFields}
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/settings",
        },
      ]}
      showSync={true}
      showExport={true}
      key={`city-${province.length}`}
    />
  );
};

export default Citiies;
