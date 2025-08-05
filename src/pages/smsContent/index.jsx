/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  EDIT_ACTIVE_SMS,
  EXPORT_GET_SMS,
  GET_SMS,
  GET_SMS_CENTER_TYPES,
  GET_SMS_PROVIDERS,
  ALL_TELEGRAM_GROUP,
  CREATE_SMS,
  EDIT_SMS,
  DELETE_SMS,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const SmsContent = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  const [smsTypes, setSmsTypes] = useState([]);
  const [telegramGroups, setTelegramGroups] = useState([]);
  const [providers, setProviders] = useState([]);
  const [refreshData, setRefresh] = useState(0);

  // بارگذاری داده‌های مورد نیاز
  useEffect(() => {
    // بارگذاری انواع پیام
    axiosInstance(`${baseUrl}/${GET_SMS_CENTER_TYPES}`, configReq(token))
      .then((res) => {
        setSmsTypes(res?.data.data || []);
      })
      .catch((err) => {
        console.error('Error loading SMS types:', err);
      });

    // بارگذاری گروه‌های تلگرام
    axiosInstance(`${baseUrl}/${ALL_TELEGRAM_GROUP}`, configReq(token))
      .then((res) => {
        setTelegramGroups(res?.data.data || []);
      })
      .catch((err) => {
        console.error('Error loading Telegram groups:', err);
      });

    // بارگذاری ارائه‌دهندگان پیامک
    axiosInstance(`${baseUrl}/${GET_SMS_PROVIDERS}`, configReq(token))
      .then((res) => {
        setProviders(res?.data.data || []);
      })
      .catch((err) => {
        console.error('Error loading SMS providers:', err);
      });
  }, [token]);

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_SMS,
    EXPORT_DATA: EXPORT_GET_SMS,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_SMS,
    CREATE_DATA: CREATE_SMS,
    EDIT_DATA: EDIT_SMS,
    DELETE_DATA: DELETE_SMS,
  };

  // تعریف فیلدهای فرم برای modal
  const fields = [
    {
      name: 'title',
      label: 'عنوان',
      type: 'textInput',
      required: true
    },
    {
      name: 'message',
      label: 'متن پیام',
      type: 'textInput',
      required: false,
      props: {
        multiline: true,
        rows: 4
      }
    },
    {
      name: 'target',
      label: 'نوع پیام',
      type: 'dropdown',
      required: false,
      options: smsTypes,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'smsActive',
      label: 'فعال بودن ارسال SMS',
      type: 'switch',
      required: false,
      defaultValue: true
    },
    {
      name: 'emailActive',
      label: 'فعال بودن ارسال ایمیل',
      type: 'switch',
      required: false,
      defaultValue: false
    },
    {
      name: 'email',
      label: 'متن ایمیل',
      type: 'textInput',
      required: false,
      props: {
        multiline: true,
        rows: 3
      },
      conditional: (formData) => formData.emailActive
    },
    {
      name: 'voiceActive',
      label: 'فعال بودن پیام صوتی',
      type: 'switch',
      required: false,
      defaultValue: false
    },
    {
      name: 'voice',
      label: 'متن پیام صوتی',
      type: 'textInput',
      required: false,
      props: {
        multiline: true,
        rows: 3
      },
      conditional: (formData) => formData.voiceActive
    },
    {
      name: 'sendToTelegram',
      label: 'ارسال به تلگرام',
      type: 'switch',
      required: false,
      defaultValue: false
    },
    {
      name: 'telegramGroupIds',
      label: 'گروه‌های تلگرام',
      type: 'multipleDropdown',
      required: false,
      options: telegramGroups,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      },
      conditional: (formData) => formData.sendToTelegram
    },
    {
      name: 'isUser',
      label: 'مخصوص کاربر',
      type: 'switch',
      required: false,
      defaultValue: false
    },
    {
      name: 'active',
      label: 'فعال / غیرفعال',
      type: 'switch',
      required: false,
      defaultValue: true
    },
    // فیلدهای مربوط به ارائه‌دهندگان پیامک به صورت داینامیک
    ...providers.flatMap(provider => [
      {
        name: `provider_${provider.id}_templateId`,
        label: `آیدی قالب ${provider.title}`,
        type: 'textInput',
        required: false,
        grid: { xs: 12, md: 6 }
      },
      {
        name: `provider_${provider.id}_voiceTemplateId`,
        label: `آیدی قالب ${provider.title} (صوتی)`,
        type: 'textInput',
        required: false,
        grid: { xs: 12, md: 6 }
      }
    ])
  ];

  // مدیریت تغییر فرم
  const handleFormChange = (fieldName, value, formData) => {
    // تبدیل فیلدهای مربوط به ارائه‌دهندگان به فرمت مناسب
    if (fieldName.startsWith('provider_')) {
      const match = fieldName.match(/provider_(\d+)_(.+)/);
      if (match) {
        const providerId = parseInt(match[1]);
        const fieldType = match[2];
        
        let templateRelations = formData.templateRelations || [];
        const existingIndex = templateRelations.findIndex(
          rel => rel.smsProviderId === providerId
        );
        
        if (existingIndex !== -1) {
          templateRelations[existingIndex][fieldType === 'templateId' ? 'providerTemplateId' : 'providerVoiceTemplateId'] = value;
        } else if (value) {
          templateRelations.push({
            smsProviderId: providerId,
            [fieldType === 'templateId' ? 'providerTemplateId' : 'providerVoiceTemplateId']: value
          });
        }
        
        return {
          ...formData,
          templateRelations
        };
      }
    }
    
    // تبدیل telegramGroupIds به رشته
    if (fieldName === 'telegramGroupIds' && Array.isArray(value)) {
      return {
        ...formData,
        telegramGroupIds: value.join(',')
      };
    }
    
    return value;
  };

  // آماده‌سازی داده‌ها قبل از ارسال
  const validateBeforeSubmit = (data, forEdit) => {
    const submitData = {
      ...data,
      smsActive: data.smsActive || false,
      emailActive: data.emailActive || false,
      voiceActive: data.voiceActive || false,
      sendToTelegram: data.sendToTelegram || false,
      isUser: data.isUser || false,
      active: data.active !== false
    };
    
    // حذف فیلدهای provider_ از داده نهایی
    Object.keys(submitData).forEach(key => {
      if (key.startsWith('provider_')) {
        delete submitData[key];
      }
    });
    
    return true;
  };

  return (
    <CustomePage
      apis={apis}
      title="مدیریت متون پیام ها"
      canAdd={userPermissions?.sms?.insert}
      canEdit={userPermissions?.sms?.update}
      permissionsTag="sms"
      customeModal={false}
      feilds={fields}
      broadCrumb={[
        {
          title: "پیام ها",
          path: "/sms",
        },
      ]}
      onFormChange={handleFormChange}
      validateBeforeSubmit={validateBeforeSubmit}
      key={`sms-content-${refreshData}-${providers.length}-${smsTypes.length}-${telegramGroups.length}`}
    />
  );
};

export default SmsContent;
