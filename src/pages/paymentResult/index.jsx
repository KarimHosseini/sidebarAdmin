/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  DELETE_ALL_PAYMENT_RESULT_GROUP,
  EDIT_ACTIVE_ALL_PAYMENT_RESULT_GROUP,
  EDIT_ACTIVE_PAYMENT_RESULT_GROUP,
  EXPORT_PAYMENT_RESULT_REPORT,
  GET_GATEWAYS_ENUM,
  GET_PAYMENT_RESULT_REPORT,
  CREATE_PAYMENT_RESULT_GROUP,
  EDIT_PAYMENT_RESULT_GROUP,
  DELETE_PAYMENT_RESULT_GROUP,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const Payment = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  const [gateWays, setGateWays] = useState([]);
  const [refreshData, setRefresh] = useState(0);

  // بارگذاری درگاه‌های پرداخت
  useEffect(() => {
    getAllGateWays();
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

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_PAYMENT_RESULT_REPORT,
    EXPORT_DATA: EXPORT_PAYMENT_RESULT_REPORT,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_PAYMENT_RESULT_GROUP,
    CREATE_DATA: CREATE_PAYMENT_RESULT_GROUP,
    EDIT_DATA: EDIT_PAYMENT_RESULT_GROUP,
    DELETE_DATA: DELETE_PAYMENT_RESULT_GROUP,
    DELETE_ALL_DATA: DELETE_ALL_PAYMENT_RESULT_GROUP,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_PAYMENT_RESULT_GROUP,
  };

  // تعریف فیلدهای فرم
  const fields = [
    {
      name: 'refId',
      label: 'شناسه پرداخت',
      type: 'textInput',
      required: true
    },
    {
      name: 'trackingCode',
      label: 'کد پیگیری',
      type: 'textInput',
      required: false
    },
    {
      name: 'gatewayId',
      label: 'درگاه پرداخت',
      type: 'dropdown',
      required: true,
      options: gateWays,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'price',
      label: 'مبلغ',
      type: 'numberInput',
      required: true,
      props: {
        suffix: 'تومان'
      }
    },
    {
      name: 'paymentDate',
      label: 'تاریخ پرداخت',
      type: 'custom',
      required: false,
      customRender: ({ value, onChange, label }) => {
      /*   const momentJalaali = require('moment-jalaali');
        const [selectedDate, setSelectedDate] = useState(
          value ? momentJalaali(value) : null
        );

        useEffect(() => {
          if (value) {
            setSelectedDate(momentJalaali(value));
          }
        }, [value]);

        const handleDateChange = (value) => {
          if (value) {
            const isoDate = value.format('YYYY-MM-DDTHH:mm:ss');
            onChange(isoDate);
            setSelectedDate(value);
          } else {
            onChange(null);
            setSelectedDate(null);
          }
        };

        const DatePicker = require('react-datepicker2').default;

        return (
          <DatePicker
            timePicker={true}
            isGregorian={false}
            value={selectedDate}
            onChange={handleDateChange}
            placeholder={label}
            className="form-control"
            inputFormat="jYYYY/jMM/jDD HH:mm"
          />
        ); */
      }
    },
    {
      name: 'userName',
      label: 'نام کاربر',
      type: 'textInput',
      required: false
    },
    {
      name: 'userMobile',
      label: 'موبایل کاربر',
      type: 'textInput',
      required: false
    },
    {
      name: 'orderId',
      label: 'شماره سفارش',
      type: 'numberInput',
      required: false
    },
    {
      name: 'invoiceNumber',
      label: 'شماره فاکتور',
      type: 'textInput',
      required: false
    },
    {
      name: 'message',
      label: 'پیام',
      type: 'textInput',
      required: false,
      props: {
        multiline: true,
        rows: 2
      }
    },
    {
      name: 'status',
      label: 'وضعیت',
      type: 'dropdown',
      required: false,
      options: [
        { id: 0, title: 'ناموفق' },
        { id: 1, title: 'موفق' },
        { id: 2, title: 'در حال انتظار' }
      ],
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    }
  ];

  return (
    <CustomePage
      apis={apis}
      title="تراکنش های بانکی"
      canAdd={userPermissions?.paymentResult?.insert}
      canEdit={userPermissions?.paymentResult?.update}
      permissionsTag="paymentResult"
      customeModal={false}
      feilds={fields}
      broadCrumb={[
        {
          title: "عملیات بانکی",
          path: "/refund",
        },
      ]}
      key={`payment-result-${refreshData}-${gateWays?.length}`}
    />
  );
};

export default Payment;

// تسک 1: صفحه paymentResult به فرم ژنراتور تبدیل شد ✓
