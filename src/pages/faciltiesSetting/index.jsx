/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  EDIT_ACTIVE_FACILITIES,
  EXPORT_FACILITIES,
  GET_FACILITIES,
  CREATE_FACILITIES,
  EDIT_FACILITIES,
  DELETE_FACILITIES,
  GET_GATEWAYS_ENUM,
  ALL_USER_GROUP,
  baseUrl,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { toast } from "react-toastify";

const FacilitySetting = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [searchParams] = useSearchParams();
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();
  const [gateWays, setGateWays] = useState([]);
  const [groups, setGroups] = useState([]);
  const [refreshData, setRefresh] = useState(0);

  // بارگذاری داده‌های اولیه
  useEffect(() => {
    getAllGateWays();
    getAllGroups();
  }, []);

  const getAllGateWays = () => {
    axiosInstance
      .get(
        `${baseUrl}/${GET_GATEWAYS_ENUM}?Page=1&Limit=10000&showBasicGateWay=true`,
        configReq(token)
      )
      .then((res) => {
        setGateWays(res.data.data);
      })
      .catch((err) => {});
  };

  const getAllGroups = () => {
    axiosInstance(`${baseUrl}/${ALL_USER_GROUP}`, configReq(token))
      .then((res) => {
        const { data } = res;
        if (data && data.code === 200 && data.data) {
          setGroups(data.data);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_FACILITIES,
    EXPORT_DATA: EXPORT_FACILITIES,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_FACILITIES,
    CREATE_DATA: CREATE_FACILITIES,
    EDIT_DATA: EDIT_FACILITIES,
    DELETE_DATA: DELETE_FACILITIES,
  };

  // تعریف فیلدهای فرم
  const fields = [
    {
      name: 'title',
      label: 'عنوان',
      type: 'textInput',
      required: true
    },
    {
      name: 'sortDesc',
      label: 'توضیحات کوتاه',
      type: 'textInput',
      required: false,
      props: {
        multiline: true,
        rows: 2
      }
    },
    {
      name: 'maxAmount',
      label: 'حداکثر مبلغ',
      type: 'numberInput',
      required: false,
      props: {
        suffix: 'تومان'
      }
    },
    {
      name: 'monthCount',
      label: 'تعداد ماه',
      type: 'numberInput',
      required: false
    },
    {
      name: 'cost',
      label: 'هزینه',
      type: 'numberInput',
      required: false,
      props: {
        suffix: 'تومان'
      }
    },
    {
      name: 'profit',
      label: 'سود',
      type: 'numberInput',
      required: false,
      props: {
        suffix: 'درصد'
      }
    },
    {
      name: 'penalty',
      label: 'جریمه',
      type: 'numberInput',
      required: false,
      props: {
        suffix: 'درصد'
      }
    },
    {
      name: 'loanRequestExpireTime',
      label: 'زمان انقضای درخواست (روز)',
      type: 'numberInput',
      required: false
    },
    {
      name: 'gatewayId',
      label: 'درگاه پرداخت',
      type: 'dropdown',
      required: false,
      options: gateWays,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'groupIds',
      label: 'گروه‌های کاربری',
      type: 'dropdown',
      required: false,
      options: groups,
      props: {
        valueKey: 'id',
        labelKey: 'title',
        multiple: true
      }
    },
    {
      name: 'prepaymentPenalty',
      label: 'جریمه پیش پرداخت',
      type: 'numberInput',
      required: false,
      props: {
        suffix: 'درصد'
      }
    },
    {
      name: 'postponementPenalty',
      label: 'جریمه تعویق',
      type: 'numberInput',
      required: false,
      props: {
        suffix: 'درصد'
      }
    },
    {
      name: 'bnplMaxDelay',
      label: 'حداکثر تاخیر BNPL',
      type: 'numberInput',
      required: false
    },
    {
      name: 'minAge',
      label: 'حداقل سن',
      type: 'numberInput',
      required: false
    },
    {
      name: 'maxAge',
      label: 'حداکثر سن',
      type: 'numberInput',
      required: false
    },
    {
      name: 'minInstallmentPrice',
      label: 'حداقل مبلغ قسط',
      type: 'numberInput',
      required: false,
      props: {
        suffix: 'تومان'
      }
    },
    {
      name: 'hasInsurance',
      label: 'دارای بیمه',
      type: 'switch',
      required: false,
      defaultValue: false
    },
    {
      name: 'description',
      label: 'توضیحات',
      type: 'editor',
      required: false
    },
    {
      name: 'active',
      label: 'فعال',
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

  // پارامترهای اضافی برای API
  const extraParams = {
    parentId: id
  };

  // مدیریت تغییر فرم
  const onFormChange = (fieldName, value, formData) => {
    // اگر نیاز به پردازش خاصی برای فیلدها داشتیم
    if (fieldName === 'parentId') {
      return id;
    }
    return value;
  };

  return (
    <CustomePage
      apis={apis}
      title={`تسهیلات ${searchParams.get("title") || ''}`}
      canAdd={userPermissions?.LoanSettings?.add}
      canEdit={userPermissions?.LoanSettings?.update}
      permissionsTag="LoanSettings"
      customeModal={false}
      feilds={fields}
      broadCrumb={[
        {
          title: "تسهیلات",
          path: "/facilitySetting",
        },
        {
          title: "تنظیمات تسهیلات",
          path: "/facilitySetting",
        },
      ]}
      extraParams={extraParams}
      onFormChange={onFormChange}
      key={`facilities-setting-${refreshData}-${gateWays?.length}-${groups?.length}`}
    />
  );
};

export default FacilitySetting;

// تسک 1: صفحه faciltiesSetting به فرم ژنراتور تبدیل شد ✓
