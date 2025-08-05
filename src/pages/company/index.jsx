/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  EDIT_ACTIVE_COMPANY,
  EXPORT_COMPANY,
  GET_COMPANY,
  CREATE_COMPANY,
  EDIT_COMPANY,
  DELETE_COMPANY,
  GET_PROVINCE,
  baseUrl,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const Companies = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const navigate = useNavigate();
  const [editingData, setEditingData] = useState({});
  const { token } = useSelector((state) => state.user);
  const [province, setProvince] = useState([]);
  const [cities, setCities] = useState([]);
  const [refreshData, setRefresh] = useState(0);

  // بارگذاری لیست استان‌ها
  useEffect(() => {
    axiosInstance(`${baseUrl}/${GET_PROVINCE}`, configReq(token))
      .then((res) => {
        const { data } = res;
        if (data && data.code === 200 && data.data) {
          setProvince(data.data);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  }, []);

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_COMPANY,
    EXPORT_DATA: EXPORT_COMPANY,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_COMPANY,
    CREATE_DATA: CREATE_COMPANY,
    EDIT_DATA: EDIT_COMPANY,
    DELETE_DATA: DELETE_COMPANY,
  };

  // تعریف فیلدهای فرم
  const fields = [
    {
      name: 'title',
      label: 'نام سازمان / شرکت',
      type: 'textInput',
      required: true
    },
    {
      name: 'tel',
      label: 'شماره تلفن',
      type: 'textInput',
      required: false
    },
    {
      name: 'contactMobile',
      label: 'شماره همراه نماینده',
      type: 'textInput',
      required: false
    },
    {
      name: 'regNumber',
      label: 'شناسه ثبت',
      type: 'textInput',
      required: false
    },
    {
      name: 'economicCode',
      label: 'کد اقتصادی',
      type: 'textInput',
      required: false
    },
    {
      name: 'address',
      label: 'نشانی',
      type: 'textInput',
      required: false,
      props: {
        multiline: true,
        rows: 2
      }
    },
    {
      name: 'provinceId',
      label: 'استان',
      type: 'dropdown',
      required: false,
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
      required: false,
      options: cities,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      },
      // نمایش تنها در صورت انتخاب استان
      conditional: (formData) => formData.provinceId
    },
    {
      name: 'description',
      label: 'توضیحات سازمان / شرکت',
      type: 'textInput',
      required: false,
      props: {
        multiline: true,
        rows: 2
      }
    },
    {
      name: 'contact1',
      label: 'ایدی / شماره تلگرام',
      type: 'textInput',
      required: false
    },
    {
      name: 'email',
      label: 'ایمیل',
      type: 'textInput',
      required: false,
      validation: (value) => {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'ایمیل معتبر نیست';
        }
        return true;
      }
    },
    {
      name: 'contact2',
      label: 'ایدی / شماره واتساپ',
      type: 'textInput',
      required: false
    },
    {
      name: 'active',
      label: 'فعال / غیر فعال',
      type: 'switch',
      required: false,
      defaultValue: true
    },
    {
      name: 'files',
      label: 'تصویر',
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

  // عملیات‌های اضافی برای ردیف‌ها
  const extraActions = userPermissions?.company?.update
    ? [
        {
          title: "مشاهده / ویرایش اعضا",
          handler: (
            <Button
              onClick={(rowData) => {
                const data = rowData?.id ? rowData : editingData;
                navigate(`/company/users/${data?.id}`);
              }}
              variant="outlined"
            >
              مشاهده
            </Button>
          ),
        },
      ]
    : [];

  return (
    <CustomePage
      apis={apis}
      title="شرکت / سازمان"
      canAdd={userPermissions?.company?.insert}
      canEdit={userPermissions?.company?.update}
      permissionsTag="company"
      customeModal={false}
      feilds={fields}
      broadCrumb={[
        {
          title: "باشگاه مشتریان",
          path: "/discounts",
        },
      ]}
      extraActions={extraActions}
      currentRow={(data) => {
        setEditingData(data);
      }}
      onFormChange={handleFormChange}
      key={`company-${refreshData}-${province?.length}`}
    />
  );
};

export default Companies;

// تسک 1: صفحه company به فرم ژنراتور تبدیل شد ✓
