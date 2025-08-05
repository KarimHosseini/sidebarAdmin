/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  EDIT_ACTIVE_BRANCHES,
  EXPORT_BRANCHES,
  GET_ALL_BRANCHES,
  GET_PROVINCE,
  CREATE_BRANCHES,
  EDIT_BRANCHES,
  DELETE_BRANCHES,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const Branches = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  const [province, setProvince] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);

  // بارگذاری لیست استان‌ها
  useEffect(() => {
    axiosInstance(`${baseUrl}/${GET_PROVINCE}`, configReq(token)).then(
      (res) => {
        const { data } = res;
        if (data && data.code === 200 && data.data) {
          setProvince(data.data);
        }
      }
    );
  }, []);

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_ALL_BRANCHES,
    EXPORT_DATA: EXPORT_BRANCHES,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_BRANCHES,
    CREATE_DATA: CREATE_BRANCHES,
    EDIT_DATA: EDIT_BRANCHES,
    DELETE_DATA: DELETE_BRANCHES,
  };

  // تعریف فیلدهای فرم
  const fields = [
    {
      name: 'title',
      label: 'نام شعبه',
      type: 'textInput',
      required: true
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
      name: 'cityId',
      label: 'شهر',
      type: 'dropdown',
      required: true,
      options: cities,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      },
      // نمایش تنها در صورت انتخاب استان
      conditional: (formData) => formData.provinceId
    },
    {
      name: 'address',
      label: 'آدرس',
      type: 'textInput',
      required: false,
      props: {
        multiline: true,
        rows: 2
      }
    },
    {
      name: 'mapLocation',
      label: 'موقعیت روی نقشه',
      type: 'custom',
      customRender: ({ value, onChange }) => {
        const handleMapChange = (lat, lng) => {
          onChange({
            latitude: lat,
            longitude: lng
          });
        };

        return (
          <div className="w-full h-64">
            {/* نقشه */}
            <div className="text-sm text-gray-600 mb-2">
              برای انتخاب موقعیت روی نقشه کلیک کنید
            </div>
          </div>
        );
      }
    },
    {
      name: 'latitude',
      label: 'عرض جغرافیایی',
      type: 'numberInput',
      required: false
    },
    {
      name: 'longitude',
      label: 'طول جغرافیایی',
      type: 'numberInput',
      required: false
    },
    {
      name: 'active',
      label: 'فعال/غیرفعال',
      type: 'switch',
      required: false,
      defaultValue: true
    },
    {
      name: 'avatar',
      label: 'تصویر شعبه',
      type: 'uploader',
      required: false
    }
  ];

  // مدیریت تغییر فرم
  const handleFormChange = (fieldName, value, formData) => {
    // هنگام تغییر استان، لیست شهرها را بروزرسانی کن
    if (fieldName === 'provinceId' && value) {
      const selectedProv = province.find(p => p.id === value);
      if (selectedProv && selectedProv.cities) {
        setCities(selectedProv.cities);
      }
      // پاک کردن انتخاب شهر قبلی
      return {
        provinceId: value,
        cityId: null
      };
    }
    return value;
  };

  return (
    <CustomePage
      apis={apis}
      title="شعب فروشگاه"
      canAdd={userPermissions?.branch?.insert}
      canEdit={userPermissions?.branch?.update}
      permissionsTag="branch"
      customeModal={false}
      feilds={fields}
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/companyInfo",
        },
      ]}
      onFormChange={handleFormChange}
    />
  );
};

export default Branches;
