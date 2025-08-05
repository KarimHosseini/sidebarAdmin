/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import CustomePage from "../../components/customePage";
import {
  ALL_WHITE_LIST_HISTORY,
  DELETE_ALL_WHITE_LIST_HISTORY,
  EDIT_ACTIVE_ALL_WHITE_LIST_HISTORY,
  EDIT_ACTIVE_WHITE_LIST_HISTORY,
  EXPORT_WHITE_LIST_HISTORY,
  CREATE_WHITE_LIST_HISTORY,
  EDIT_WHITE_LIST_HISTORY,
  DELETE_WHITE_LIST_HISTORY,
} from "../../helpers/api-routes";

const WhiteListHistory = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [searchParams] = useSearchParams();
  const guarantorId = searchParams.get("guarantorId");
  const guarantorName = searchParams.get("guarantorName");
  const whiteListUserName = searchParams.get("whiteListUserName");
  const whiteListId = searchParams.get("whiteListId");
  const [refreshData, setRefresh] = useState(0);

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: ALL_WHITE_LIST_HISTORY,
    EXPORT_DATA: EXPORT_WHITE_LIST_HISTORY,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_WHITE_LIST_HISTORY,
    DELETE_ALL_DATA: DELETE_ALL_WHITE_LIST_HISTORY,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_WHITE_LIST_HISTORY,
    CREATE_DATA: CREATE_WHITE_LIST_HISTORY,
    EDIT_DATA: EDIT_WHITE_LIST_HISTORY,
    DELETE_DATA: DELETE_WHITE_LIST_HISTORY,
  };

  // تعریف انواع عملیات
  const operationTypes = [
    {
      id: 0,
      title: "مصرف",
      style: '{fontWeight:500 , color: "#ff8b00"}',
      styleDark: '{fontWeight:500 , color: "#ffcc6f"}',
    },
    {
      id: 1,
      title: "شارژ",
      style: '{fontWeight:500 , color: "#00c83a"}',
      styleDark: '{fontWeight:500 , color: "#76e59f"}',
    },
    {
      id: 2,
      title: "شارژ کیف پول داخلی",
      style: '{fontWeight:500 , color: "#00c83a"}',
      styleDark: '{fontWeight:500 , color: "#76e59f"}',
    },
    {
      id: 3,
      title: "عودت وجه از کیف پول سایت",
      style: '{fontWeight:500 , color: "#ff8b00"}',
      styleDark: '{fontWeight:500 , color: "#ffcc6f"}',
    },
    {
      id: 4,
      title: "عودت سیستمی",
      style: '{fontWeight:500 , color: "red"}',
      styleDark: null,
    },
    {
      id: 5,
      title: "کسر بابت کارمزد طرح",
      style: null,
      styleDark: null,
    },
    {
      id: 6,
      title: "به روز رسانی",
      style: null,
      styleDark: null,
    },
  ];

  // تعریف فیلدهای فرم برای modal
  const fields = [
    {
      name: 'op',
      label: 'عملیات',
      type: 'dropdown',
      required: true,
      options: operationTypes,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'value',
      label: 'مقدار',
      type: 'textInput',
      required: false
    },
    {
      name: 'description',
      label: 'توضیحات',
      type: 'textInput',
      required: false,
      props: {
        multiline: true,
        rows: 2
      }
    }
  ];

  // مدیریت تغییر فرم
  const handleFormChange = (fieldName, value, formData) => {
    // افزودن whiteListUserId به داده‌ها
    if (fieldName === 'op' && value !== undefined) {
      return {
        ...formData,
        op: value,
        WhiteListUserId: whiteListId
      };
    }
    return value;
  };

  // پارامترهای اضافی برای API
  const extraParams = {
    whiteListUserId: whiteListId
  };

  return (
    <CustomePage
      apis={apis}
      title={`تاریخچه فعالیت ${whiteListUserName ? `برای ${whiteListUserName}` : ""}`}
      canAdd={userPermissions?.whiteListHistory?.insert}
      canEdit={userPermissions?.whiteListHistory?.update}
      permissionsTag="whiteListHistory"
      customeModal={false}
      feilds={fields}
      broadCrumb={[
        {
          title: "تسهیلات",
          path: "/facilitySetting",
        },
        {
          title: "تضمین کننده ها",
          path: "/guarantor",
        },
        {
          title: `لیست کاربران سفید ${guarantorName ? `برای ${guarantorName}` : ""}`,
          path: `/whiteListUser?guarantorId=${guarantorId}&guarantorName=${guarantorName}`,
        },
      ]}
      onFormChange={handleFormChange}
      extraParams={extraParams}
      key={`whitelist-history-${refreshData}-${whiteListId}`}
    />
  );
};

export default WhiteListHistory;
