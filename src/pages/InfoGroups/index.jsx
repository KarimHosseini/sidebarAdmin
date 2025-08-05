/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  ALL_INFOGROUPS,
  BRANDS,
  CATEGORIES,
  EDIT_ACTIVE_INFOGROUP,
  EXPORT_ALL_INFOGROUPS,
  CREATE_INFOGROUP,
  EDIT_INFOGROUP,
  DELETE_INFOGROUP,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { setCategories } from "../../redux/slices/relationals";
import { baseUrl } from "../../helpers/api-routes";

const InfoGroups = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions, categories } = useSelector((state) => state.relationals);
  const [brands, setBrands] = useState([]);
  const [refreshData, setRefresh] = useState(0);

  // Fetch categories and brands data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await axiosInstance(
          `${baseUrl}/${CATEGORIES}?Page=1&Limit=2000`,
          configReq(token)
        );
        if (categoriesRes.data.code === 200) {
          dispatch(setCategories(categoriesRes.data.data));
        }

        // Fetch brands
        const brandsRes = await axiosInstance(
          `${baseUrl}/${BRANDS}?Page=1&Limit=2000`,
          configReq(token)
        );
        if (brandsRes.data.code === 200) {
          setBrands([{ id: null, title: "بدون برند" }, ...brandsRes.data.data]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [token, dispatch]);

  // Define form fields for the infogroup form
  const infogroupFields = [
    {
      name: 'title',
      label: 'متن توضیحات',
      type: 'textInput',
      required: true
    },
    {
      name: 'categoryId',
      label: 'دسته بندی',
      type: 'dropdown',
      required: false,
      options: categories || [],
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'brandId',
      label: 'برند',
      type: 'dropdown',
      required: false,
      options: brands || [],
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    },
    {
      name: 'avatar',
      label: 'تصویر',
      type: 'uploader',
      required: false
    }
  ];

  // Define APIs for CRUD operations
  const infogroupApis = {
    GET_DATA: ALL_INFOGROUPS,
    EXPORT_DATA: EXPORT_ALL_INFOGROUPS,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_INFOGROUP,
    CREATE_DATA: CREATE_INFOGROUP,
    EDIT_DATA: EDIT_INFOGROUP,
    DELETE_DATA: DELETE_INFOGROUP,
  };

  // Custom form data transformation for dropdown values
  const handleFormChange = (fieldName, value) => {
    // Handle dropdown object values
    if (fieldName === 'categoryId' && value && typeof value === 'object') {
      return value.id;
    }
    if (fieldName === 'brandId' && value && typeof value === 'object') {
      return value.id;
    }
    return value;
  };

  // Transform data for editing (convert IDs back to objects)
  const transformDataForEdit = (data) => {
    if (!data) return data;
    
    return {
      ...data,
      categoryId: categories?.find(cat => cat.id === data.categoryId) || null,
      brandId: brands?.find(brand => brand.id === data.brandId) || null,
    };
  };

  return (
    <CustomePage
      apis={infogroupApis}
      title="توضیحات وندور"
      canAdd={true}
      canEdit={true}
      permissionsTag="categoryAbilities"
      customeModal={false}
      feilds={infogroupFields}
      broadCrumb={[
        {
          title: "مدیریت محصولات",
          path: "/products",
        },
      ]}
      onFormChange={handleFormChange}
      key={`infogroups-${refreshData}-${categories?.length}-${brands?.length}`}
    />
  );
};

export default InfoGroups;
