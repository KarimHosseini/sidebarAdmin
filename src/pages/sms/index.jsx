/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  EDIT_ACTIVE_SMS_CENTER,
  EXPORT_GET_SMS_CENTER,
  GET_SMS_CENTER,
  GET_SMS_CENTER_TYPES,
  CREATE_SMS_CENTER,
  EDIT_SMS_CENTER,
  DELETE_SMS_CENTER,
  ALL_USERS,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const Sms = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  const [smsType, setSmsType] = useState([]);
  const [users, setUsers] = useState([]);
  const [refreshData, setRefresh] = useState(0);

  // بارگذاری انواع پیام و کاربران
  useEffect(() => {
    // بارگذاری انواع پیام
    axiosInstance(`${baseUrl}/${GET_SMS_CENTER_TYPES}`, configReq(token))
      .then((res) => {
        setSmsType(res?.data.data || []);
      })
      .catch((err) => {});

    // بارگذاری کاربران برای انتخاب موبایل
    axiosInstance(`${baseUrl}/${ALL_USERS}?Page=1&Limit=1000`, configReq(token))
      .then((res) => {
        setUsers(res?.data.data || []);
      })
      .catch((err) => {});
  }, []);

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_SMS_CENTER,
    EXPORT_DATA: EXPORT_GET_SMS_CENTER,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_SMS_CENTER,
    CREATE_DATA: CREATE_SMS_CENTER,
    EDIT_DATA: EDIT_SMS_CENTER,
    DELETE_DATA: DELETE_SMS_CENTER,
  };

  // تعریف فیلدهای فرم
  const fields = [
    {
      name: 'mobile',
      label: 'شماره موبایل',
      type: 'custom',
      required: true,
      customRender: ({ value, onChange }) => {
        const [searchTerm, setSearchTerm] = useState('');
        const filteredUsers = users.filter(u => 
          u.mobile?.includes(searchTerm) || 
          u.userInformation?.name?.includes(searchTerm) ||
          u.userInformation?.family?.includes(searchTerm)
        );

        return (
          <div className="w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو..."
              className="w-full p-2 border rounded mb-2"
            />
            <select
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-2 border rounded"
              size="5"
            >
              <option value="">انتخاب کنید</option>
              {filteredUsers.map(user => (
                <option key={user.id} value={user.mobile}>
                  {user.mobile} - {user.userInformation?.name} {user.userInformation?.family}
                </option>
              ))}
            </select>
          </div>
        );
      }
    },
    {
      name: 'type',
      label: 'نوع پیام',
      type: 'dropdown',
      required: true,
      options: smsType,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'email',
      label: 'ایمیل',
      type: 'textInput',
      required: true,
      validation: (value) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'ایمیل معتبر نیست';
        }
        return true;
      }
    },
    {
      name: 'active',
      label: 'فعال',
      type: 'switch',
      required: false,
      defaultValue: true
    }
  ];

  // مدیریت تغییر فرم برای تبدیل type object به id
  const handleFormChange = (fieldName, value) => {
    if (fieldName === 'type' && value && typeof value === 'object') {
      return value.id;
    }
    return value;
  };

  return (
    <CustomePage
      apis={apis}
      title="تنظیمات ارسال پیام ها به ادمین"
      canAdd={userPermissions?.smsCenter?.insert}
      canEdit={userPermissions?.smsCenter?.update}
      permissionsTag="smsCenter"
      customeModal={false}
      feilds={fields}
      broadCrumb={[
        {
          title: "پیام ها",
          path: "/sms",
        },
      ]}
      onFormChange={handleFormChange}
      key={`sms-${refreshData}-${smsType?.length}-${users?.length}`}
    />
  );
};

export default Sms;

// تسک 1: صفحه sms به فرم ژنراتور تبدیل شد ✓
