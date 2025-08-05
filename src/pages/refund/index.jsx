/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  GET_Refund_REPORT,
  EDIT_ACTIVE_REFUND_GROUP,
  EXPORT_Refund_REPORT,
  CREATE_REFUND_GROUP,
  EDIT_REFUND_GROUP,
  DELETE_REFUND_GROUP,
  GET_GATEWAYS_ENUM,
  baseUrl,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const Refund = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  const [gateways, setGateways] = useState([]);

  useEffect(() => {
    const fetchGateways = async () => {
      try {
        const res = await axiosInstance.get(
          `${baseUrl}/${GET_GATEWAYS_ENUM}?Page=1&Limit=1000`,
          configReq(token)
        );
        setGateways(res.data.data || []);
      } catch (err) {
        console.error('Error fetching gateways:', err);
      }
    };

    fetchGateways();
  }, [token]);

  const refundFields = [
    {
      name: 'amount',
      label: 'قیمت',
      type: 'numberInput',
      required: true,
      props: {
        suffix: 'تومان'
      }
    },
    {
      name: 'gateway',
      label: 'نام درگاه',
      type: 'dropdown',
      required: false,
      options: gateways,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'orderId',
      label: 'شماره سفارش',
      type: 'textInput',
      required: false
    },
    {
      name: 'refundResponse',
      label: 'ریسپانس برگشت پول',
      type: 'textInput',
      required: false
    },
    {
      name: 'cardPan',
      label: 'شماره کارت',
      type: 'textInput',
      required: false
    },
    {
      name: 'refundCode',
      label: 'کد برگشت پول',
      type: 'textInput',
      required: false
    },
    {
      name: 'refundDate',
      label: 'تاریخ برگشت پول',
      type: 'datePicker',
      required: false
    }
  ];

  const refundApis = {
    GET_DATA: GET_Refund_REPORT,
    EXPORT_DATA: EXPORT_Refund_REPORT,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_REFUND_GROUP,
    CREATE_DATA: CREATE_REFUND_GROUP,
    EDIT_DATA: EDIT_REFUND_GROUP,
    DELETE_DATA: DELETE_REFUND_GROUP,
  };

  return (
    <CustomePage
      apis={refundApis}
      title="برگشت پول"
      canAdd={true}
      canEdit={true}
      permissionsTag="refund"
      customeModal={false}
      feilds={refundFields}
      broadCrumb={[
        {
          title: " عملیات بانکی",
          path: "/refund",

        },
      ]}
      key={`refund-${gateways?.length}`}
    />
  );
};

export default Refund;
