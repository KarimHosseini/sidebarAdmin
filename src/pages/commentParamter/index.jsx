/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  GET_USER_SCORE_PARAMETER,
  EDIT_ACTIVE_USER_SCORE_PARAMETER,
  EXPORT_USER_SCORE_PARAMETER,
  baseUrl,
  CATEGORIES,
  CREATE_USER_SCORE_PARAMETER,
  DELETE_USER_SCORE_PARAMETER,
  EDIT_USER_SCORE_PARAMETER,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const CommentParameter = () => {
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [showingCats, setShowingCats] = useState([]);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get(
          `${baseUrl}/${CATEGORIES}?Page=1&Limit=2000`,
          configReq(token)
        );
        if (res.data.code === 200) {
          setShowingCats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    fetchCategories();
  }, [token]);

  // Define form fields based on the modal
  const commentParamterFields = [
    {
      name: 'title',
      label: 'نام',
      type: 'textInput',
      required: true
    },
    {
      name: 'categoryId',
      label: 'انتخاب دسته بندی',
      type: 'dropdown',
      required: false,
      options: showingCats,
      props: {
        valueKey: 'id',
        labelKey: 'title'
      }
    }
  ];

  // Define APIs for CRUD operations
  const commentParamterApis = {
    GET_DATA: GET_USER_SCORE_PARAMETER,
    EXPORT_DATA: EXPORT_USER_SCORE_PARAMETER,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_USER_SCORE_PARAMETER,
    CREATE_DATA: CREATE_USER_SCORE_PARAMETER,
    EDIT_DATA: EDIT_USER_SCORE_PARAMETER,
    DELETE_DATA: DELETE_USER_SCORE_PARAMETER,
  };

  return (
    <CustomePage
      apis={commentParamterApis}
      title="پارامتر امتیاز"
      canAdd={true}
      canEdit={true}
      permissionsTag="scoreParams"
      customeModal={false}
      feilds={commentParamterFields}
      broadCrumb={[
        {
          title: "کامنت",
          path: "/comments",
        },
      ]}
      showSync={true}
      showExport={true}
      key={`commentParamter-${showingCats.length}`}
    />
  );
};

export default CommentParameter;
