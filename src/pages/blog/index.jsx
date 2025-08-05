/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomePage from "../../components/customePage";
import { createSmartLinkHandler } from "../../helpers/utils";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  EDIT_ACTIVE_BLOG,
  EXPORT_BLOG,
  GET_BLOG,
  CREATE_BLOG,
  EDIT_BLOG,
  DELETE_BLOG,
  GET_BLOG_CATEGORY,
  ALL_USERS,
  baseUrl,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { toast } from "react-toastify";
import RedirectModal from "../../components/blogs/redirect";

const Blogs = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [editingData, setEditingData] = useState({});
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [refreshData, setRefresh] = useState(0);

  // بارگذاری دسته‌بندی‌ها و کاربران
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // بارگذاری دسته‌بندی‌های بلاگ
    axiosInstance
      .get(`${baseUrl}/${GET_BLOG_CATEGORY}?Page=1&Limit=2000`, configReq(token))
      .then((res) => {
        setCategories(res.data.data || []);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });

    // بارگذاری کاربران
    axiosInstance
      .get(`${baseUrl}/${ALL_USERS}?Page=1&Limit=2000`, configReq(token))
      .then((res) => {
        setUsers(res.data.data || []);
      })
      .catch((err) => {});
  };

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_BLOG,
    EXPORT_DATA: EXPORT_BLOG,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_BLOG,
    CREATE_DATA: CREATE_BLOG,
    EDIT_DATA: EDIT_BLOG,
    DELETE_DATA: DELETE_BLOG,
  };

  // تعریف فیلدهای فرم
  const fields = [
    {
      name: 'title',
      label: 'عنوان بلاگ',
      type: 'textInput',
      required: true
    },
    {
      name: 'url',
      label: 'نشانی بلاگ',
      type: 'textInput',
      required: true,
      validation: (value) => {
        if (!value.startsWith('/')) {
          return 'نشانی باید با / شروع شود';
        }
        return true;
      }
    },
    {
      name: 'blogCategoryId',
      label: 'دسته‌بندی',
      type: 'dropdown',
      required: true,
      options: categories,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'summery',
      label: 'خلاصه',
      type: 'textInput',
      required: false,
      props: {
        multiline: true,
        rows: 3
      }
    },
    {
      name: 'blogContent',
      label: 'محتوای بلاگ',
      type: 'editor',
      required: true
    },
    {
      name: 'selected',
      label: 'بلاگ برگزیده',
      type: 'switch',
      required: false,
      defaultValue: false
    },
    {
      name: 'active',
      label: 'فعال',
      type: 'switch',
      required: false,
      defaultValue: true
    },
    {
      name: 'galleryId',
      label: 'تصویر',
      type: 'uploader',
      required: false
    }
  ];

  // عملیات‌های اضافی برای ردیف‌ها  
  const extraActions = [
    userPermissions?.seoAssign?.view && {
      title: "seo",
      handler: (
        <Button
          onClick={(rowData) => {
            const data = rowData?.id ? rowData : editingData;
            createSmartLinkHandler(
              `/seoGenrator?id=${data?.id}&name=blog&slug=${data?.url?.slice(1)}`,
              navigate
            )(rowData);
          }}
          variant="outlined"
        >
          ویرایش seo
        </Button>
      ),
    },
  ].filter((item) => item);

  // برای مدیریت redirect
  const [openRedirect, setOpenRedirect] = useState(false);
  const [redirectData, setRedirectData] = useState({});

  // مدیریت بعد از ذخیره
  const onAfterSubmit = (data, isEdit) => {
    if (!isEdit && data?.url) {
      setRedirectData(data);
      setOpenRedirect(true);
    }
    setRefresh(r => r + 1);
  };

  return (
    <>
      <CustomePage
        apis={apis}
        title="بلاگ"
        canAdd={userPermissions?.blog?.insert}
        canEdit={userPermissions?.blog?.update}
        permissionsTag="blog"
        customeModal={false}
        feilds={fields}
        broadCrumb={[
          {
            title: "مدیریت بلاگ",
            path: "/blog",
          },
        ]}
        extraActions={extraActions}
        currentRow={(data) => {
          setEditingData(data);
        }}
        onAfterSubmit={onAfterSubmit}
        key={`blog-${refreshData}-${categories?.length}`}
      />

      <RedirectModal
        open={openRedirect}
        name="url"
        data={redirectData}
        close={() => {
          setOpenRedirect(false);
          setRedirectData({});
        }}
      />
    </>
  );
};

export default Blogs;

// تسک 1: صفحه blog به فرم ژنراتور تبدیل شد ✓
