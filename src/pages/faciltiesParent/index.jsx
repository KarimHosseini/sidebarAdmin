/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  ALL_GUARANTOR,
  baseUrl,
  CATEGORIES,
  EDIT_ACTIVE_FACILITIES_PARENT,
  EXPORT_FACILITIES_PARENT,
  GET_FACILITIES_PARENT,
  CREATE_FACILITIES_PARENT,
  EDIT_FACILITIES_PARENT,
  DELETE_FACILITIES_PARENT,
  GET_Financier,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import InsuranceModal from "./insuranceModal";

const FacilityParent = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  
  const [open, setOpen] = useState(false);
  const [gateWays, setGateWays] = useState([]);
  const [financier, setFinancier] = useState([]);
  const [guarantors, setGuarantors] = useState([]);
  const [editingData, setEditingData] = useState({});
  const [refreshData, setRefresh] = useState(0);

  // بارگذاری داده‌های اولیه
  useEffect(() => {
    getAllGateWays();
  }, []);

  const getAllGateWays = () => {
    // بارگذاری دسته‌بندی‌ها
    axiosInstance
      .get(`${baseUrl}/${CATEGORIES}?Page=1&Limit=10000`, configReq(token))
      .then((res) => {
        setGateWays(res.data.data);
      })
      .catch((err) => {});
      
    // بارگذاری تامین‌کنندگان
    axiosInstance
      .get(`${baseUrl}/${GET_Financier}?Page=1&Limit=10000`, configReq(token))
      .then((res) => {
        setFinancier(res.data.data);
      })
      .catch((err) => {});
      
    // بارگذاری ضامن‌ها
    axiosInstance
      .get(`${baseUrl}/${ALL_GUARANTOR}?Page=1&Limit=10000`, configReq(token))
      .then((res) => {
        setGuarantors(res.data.data);
      })
      .catch((err) => {});
  };

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_FACILITIES_PARENT,
    EXPORT_DATA: EXPORT_FACILITIES_PARENT,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_FACILITIES_PARENT,
    CREATE_DATA: CREATE_FACILITIES_PARENT,
    EDIT_DATA: EDIT_FACILITIES_PARENT,
    DELETE_DATA: DELETE_FACILITIES_PARENT,
  };

  // تعریف فیلدهای فرم
  const fields = [
    {
      name: 'Title',
      label: 'عنوان',
      type: 'textInput',
      required: true
    },
    {
      name: 'shortName',
      label: 'نام کوتاه',
      type: 'textInput',
      required: false
    },
    {
      name: 'ChargeType',
      label: 'نوع شارژ',
      type: 'dropdown',
      required: false,
      options: [
        { id: 0, title: 'نوع 0' },
        { id: 1, title: 'نوع 1' },
        { id: 2, title: 'نوع 2' }
      ],
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'ChargeTypeModel',
      label: 'مدل نوع شارژ',
      type: 'numberInput',
      required: false
    },
    {
      name: 'financierId',
      label: 'تامین کننده',
      type: 'dropdown',
      required: false,
      options: financier,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'hasGurantor',
      label: 'دارای ضامن',
      type: 'switch',
      required: false,
      defaultValue: false
    },
    {
      name: 'guarantorId',
      label: 'ضامن',
      type: 'dropdown',
      required: false,
      options: guarantors,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      },
      conditional: (formData) => formData.hasGurantor
    },
    {
      name: 'MaxLoanAmount',
      label: 'حداکثر مبلغ وام',
      type: 'numberInput',
      required: false,
      props: {
        suffix: 'تومان'
      }
    },
    {
      name: 'YearlyProfit',
      label: 'سود سالانه',
      type: 'numberInput',
      required: false,
      props: {
        suffix: 'درصد'
      }
    },
    {
      name: 'MonthCountPreview',
      label: 'تعداد ماه پیش‌نمایش',
      type: 'numberInput',
      required: false
    },
    {
      name: 'maxAgeToSubmit',
      label: 'حداکثر سن برای ثبت',
      type: 'numberInput',
      required: false
    },
    {
      name: 'Order',
      label: 'ترتیب',
      type: 'numberInput',
      required: false
    },
    {
      name: 'Link',
      label: 'لینک',
      type: 'textInput',
      required: false
    },
    {
      name: 'CategoryIds',
      label: 'دسته‌بندی‌ها',
      type: 'dropdown',
      required: false,
      options: gateWays,
      props: {
        valueKey: 'id',
        labelKey: 'title',
        multiple: true
      }
    },
    {
      name: 'Description',
      label: 'توضیحات',
      type: 'editor',
      required: false
    },
    {
      name: 'GetFacilityDescription',
      label: 'توضیحات دریافت تسهیلات',
      type: 'editor',
      required: false
    },
    {
      name: 'showChargeWallet',
      label: 'نمایش شارژ کیف پول',
      type: 'switch',
      required: false,
      defaultValue: false
    },
    {
      name: 'HasPreFactor',
      label: 'دارای پیش فاکتور',
      type: 'switch',
      required: false,
      defaultValue: false
    },
    {
      name: 'CanUseFacilityWallet',
      label: 'امکان استفاده از کیف پول تسهیلات',
      type: 'switch',
      required: false,
      defaultValue: false
    },
    {
      name: 'IsActive',
      label: 'فعال',
      type: 'switch',
      required: false,
      defaultValue: true
    },
    {
      name: 'Files',
      label: 'تصویر',
      type: 'uploader',
      required: false
    },
    {
      name: 'CardImage',
      label: 'تصویر کارت',
      type: 'uploader',
      required: false
    }
  ];

  // عملیات‌های اضافی برای ردیف‌ها
  const extraActions = userPermissions?.LoanSettings?.edit
    ? [
        {
          title: "خدمات های اجباری",
          handler: (
            <Button
              onClick={() => setOpen(true)}
              variant="outlined"
              color="secondary"
            >
              مشاهده
            </Button>
          ),
        },
        {
          title: "تسهیلات",
          handler: (
            <Button
              onClick={(rowData) => {
                const data = rowData?.id ? rowData : editingData;
                window.open(`/facilitySetting/${data.id}?title=${data.title}`);
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
    <>
      <CustomePage
        apis={apis}
        title="تنظیمات تسهیلات"
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
        ]}
        extraActions={extraActions}
        currentRow={(data) => {
          setEditingData(data);
        }}
        key={`facilities-${refreshData}-${gateWays?.length}-${financier?.length}-${guarantors?.length}`}
      />

      <InsuranceModal
        open={open}
        prevData={editingData}
        categroies={gateWays}
        reset={() => setRefresh((r) => r + 1)}
        close={() => {
          setOpen(false);
          setEditingData({});
        }}
      />
    </>
  );
};

export default FacilityParent;

// تسک 1: صفحه faciltiesParent به فرم ژنراتور تبدیل شد ✓
