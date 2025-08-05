import { Edit } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Switch } from "@mui/material";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  ALL_ACCOUNTING_PAGES,
  baseUrl,
  BRANDS,
  CATEGORIES,
  DELETE_ALL_ACCOUNTING_PAGES,
  EDIT_ACTIVE_ACCOUNTING_PAGES,
  EDIT_ACTIVE_ALL_ACCOUNTING_PAGES,
  EXPORT_ACCOUNTING_PAGES,
  SYNC_ACCOUNTING_PAGES,
  CREATE_ACCOUNTING_PAGES,
  EDIT_ACCOUNTING_PAGES,
  DELETE_ACCOUNTING_PAGES,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const AccountingPage = () => {
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);

  // Fetch brands and categories for dropdown options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandsRes = await axiosInstance(
          `${baseUrl}/${BRANDS}?Page=1&Limit=2000`,
          configReq(token)
        );
        if (brandsRes.data.code === 200) {
          setBrands(brandsRes.data.data);
        }

        const categoriesRes = await axiosInstance(
          `${baseUrl}/${CATEGORIES}?Page=1&Limit=2000`,
          configReq(token)
        );
        if (categoriesRes.data.code === 200) {
          setCategories(categoriesRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [token]);

  // Sync accounting pages
  const syncAccountingPages = async () => {
    setLoadingButton(true);
    try {
      const res = await axiosInstance.post(
        `${baseUrl}/${SYNC_ACCOUNTING_PAGES}`,
        {},
        configReq(token)
      );
      if (res.data.code === 200) {
        toast.success("سینک با موفقیت انجام شد");
        window.location.reload();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "خطا در سینک");
    } finally {
      setLoadingButton(false);
    }
  };

  // Define form fields for the accounting form
  const accountingFields = [
    {
      name: 'isCategory',
      label: 'نوع',
      type: 'switch',
      required: false,
      defaultValue: true,
      customRender: (value, onChange, formData) => (
        <div className="flex items-center gap-3">
          <span>دسته بندی</span>
          <Switch
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span>برند</span>
        </div>
      )
    },
    {
      name: 'categoryId',
      label: 'دسته بندی',
      type: 'dropdown',
      required: false,
      options: categories,
      props: {
        // Only show when isCategory is true
        disabled: (formData) => !formData.isCategory
      }
    },
    {
      name: 'brandId',
      label: 'برند',
      type: 'dropdown',
      required: false,
      options: brands,
      props: {
        // Only show when isCategory is false
        disabled: (formData) => formData.isCategory
      }
    },
    {
      name: 'isSerialize',
      label: 'دارای سریال',
      type: 'switch',
      required: false,
      defaultValue: false
    }
  ];

  // Define APIs for CRUD operations
  const accountingApis = {
    GET_DATA: ALL_ACCOUNTING_PAGES,
    EXPORT_DATA: EXPORT_ACCOUNTING_PAGES,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_ACCOUNTING_PAGES,
    CREATE_DATA: CREATE_ACCOUNTING_PAGES,
    EDIT_DATA: EDIT_ACCOUNTING_PAGES,
    DELETE_DATA: DELETE_ACCOUNTING_PAGES,
    DELETE_ALL_DATA: DELETE_ALL_ACCOUNTING_PAGES,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_ACCOUNTING_PAGES,
  };

  // Custom selection action for sync
  const selectionActions = [
    {
      title: "سینک با آرپا",
      icon: <Edit />,
      onClick: () => syncAccountingPages(),
      permissions: ["accountingArpaCategroty.sync"],
      requiresSelection: false,
      loading: loadingButton,
      variant: "outlined",
      color: "primary"
    }
  ];

  return (
    <CustomePage
      apis={accountingApis}
      title="حسابداری"
      canAdd={true}
      canEdit={true}
      permissionsTag="accountingArpaCategroty"
      customeModal={false}
      feilds={accountingFields}
      broadCrumb={[
        {
          title: "حسابداری",
          path: "/accounting",
        },
      ]}
      selectionActions={selectionActions}
      key={`accounting-${brands.length}-${categories.length}`}
    />
  );
};

export default AccountingPage;
