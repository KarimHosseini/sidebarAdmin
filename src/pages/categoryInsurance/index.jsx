/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  EDIT_ACTIVE_CATEGORY_INSURANCE,
  EXPORT_CATEGORY_INSURANCE,
  GET_CATEGORY_INSURANCE,
  GET_INSURANCE,
  TYPES_CATEGORY_INSURANCE,
  CREATE_CATEGORY_INSURANCE,
  EDIT_CATEGORY_INSURANCE,
  DELETE_CATEGORY_INSURANCE,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import CategoryInsuranceForceModal from "./forceModal";

const CategoryInsurance = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [searchParams] = useSearchParams();
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();
  
  const [openForce, setOpenForce] = useState(false);
  const [insurances, setInsurances] = useState([]);
  const [types, setTypes] = useState([]);
  const [refreshData, setRefresh] = useState(0);

  // بارگذاری لیست بیمه‌ها و انواع
  useEffect(() => {
    getAllGateWays();
  }, []);

  const getAllGateWays = () => {
    axiosInstance
      .get(
        `${baseUrl}/${GET_INSURANCE}?Page=1&Limit=10000&filter[0][key]=active&filter[0][value]=true&filter[0][operator]=e`,
        configReq(token)
      )
      .then((res) => {
        setInsurances(res.data.data);
      })
      .catch((err) => {});
      
    axiosInstance
      .get(
        `${baseUrl}/${TYPES_CATEGORY_INSURANCE}?Page=1&Limit=10000`,
        configReq(token)
      )
      .then((res) => {
        setTypes(res.data.data);
      })
      .catch((err) => {});
  };

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_CATEGORY_INSURANCE,
    EXPORT_DATA: EXPORT_CATEGORY_INSURANCE,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_CATEGORY_INSURANCE,
    CREATE_DATA: CREATE_CATEGORY_INSURANCE,
    EDIT_DATA: EDIT_CATEGORY_INSURANCE,
    DELETE_DATA: DELETE_CATEGORY_INSURANCE,
  };

  // تعریف فیلدهای فرم
  const fields = [
    {
      name: 'insuranceId',
      label: 'انتخاب خدمات',
      type: 'dropdown',
      required: true,
      options: insurances,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'categoryType',
      label: 'نوع خدمات',
      type: 'dropdown',
      required: true,
      options: types,
      props: {
        valueKey: 'value',
        labelKey: 'title'
      }
    },
    {
      name: 'insuranceMarkup',
      label: 'افزایش قیمت',
      type: 'numberInput',
      required: false,
      defaultValue: 0,
      props: {
        suffix: 'درصد'
      }
    },
    {
      name: 'discountInsuranceMarkup',
      label: 'تخفیف',
      type: 'numberInput',
      required: false,
      defaultValue: 0,
      props: {
        suffix: 'درصد'
      }
    },
    {
      name: 'totalExpirationDay',
      label: 'تعداد روز انقضا',
      type: 'numberInput',
      required: false,
      defaultValue: 365
    },
    {
      name: 'coverage',
      label: 'پوشش',
      type: 'editor',
      required: false
    },
    {
      name: 'termsAndConditions',
      label: 'شرایط و ضوابط',
      type: 'editor',
      required: false
    }
  ];

  // دکمه‌های اضافی
  const extraButtons = (
    <>
      {userPermissions?.categoryInsurance?.insert && (
        <Button
          onClick={() => setOpenForce(true)}
          variant="contained"
          color="secondary"
        >
          انتخاب خدمات اجباری
        </Button>
      )}
    </>
  );

  // پارامترهای اضافی برای API
  const extraParams = {
    categoryId: id
  };

  // مدیریت تغییر فرم
  const onFormChange = (fieldName, value) => {
    // اگر نیاز به پردازش خاصی برای فیلدها داشتیم
    if (fieldName === 'categoryId') {
      return id;
    }
    return value;
  };

  return (
    <>
      <CustomePage
        apis={apis}
        title={`دسته بندی خدمات ${searchParams.get("title") || ''}`}
        canAdd={userPermissions?.categoryInsurance?.insert}
        canEdit={userPermissions?.categoryInsurance?.update}
        permissionsTag="categoryInsurance"
        customeModal={false}
        feilds={fields}
        broadCrumb={[
          {
            title: "مدیریت محصولات",
            path: "/products",
          },
          {
            title: "دسته بندی ها",
            path: "/categories",
          },
        ]}
        extraButtons={extraButtons}
        extraParams={extraParams}
        onFormChange={onFormChange}
        key={refreshData}
      />
      
      <CategoryInsuranceForceModal
        prevData={[]}
        open={openForce}
        reset={() => setRefresh((r) => r + 1)}
        close={() => setOpenForce(false)}
      />
    </>
  );
};

export default CategoryInsurance;
