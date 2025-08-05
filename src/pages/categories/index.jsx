/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import RedirectModal from "../../components/blogs/redirect";
import {
  CATEGORIES,
  EDIT_ACTIVE_CATEGORY,
  EXPORT_CATEGORIES,
  CREATE_CATEGORY,
  EDIT_CATEGORY,
  DELETE_CATEGORY,
  CREATE_REDIRECT_GENRALL,
} from "../../helpers/api-routes";

const Categories = () => {
  const navigate = useNavigate();
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for CRUD operations
  const categoryApis = {
    GET_DATA: CATEGORIES,
    EXPORT_DATA: EXPORT_CATEGORIES,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_CATEGORY,
    CREATE_DATA: CREATE_CATEGORY,
    EDIT_DATA: EDIT_CATEGORY,
    DELETE_DATA: DELETE_CATEGORY,
    REDIRECT_API: CREATE_REDIRECT_GENRALL
  };

  // Define extra actions for row-level operations
  const extraActions = [];
  
  if (userPermissions?.categories?.detail) {
    extraActions.push({
      title: "ویرایش",
      handler: (
        <IconButton
          onClick={(event) => {
            const target = event.currentTarget.closest("[data-id]") || 
                          event.currentTarget.parentElement;
            const id = target.getAttribute("data-id");
            navigate(`/categories/${id}`);
          }}
        >
          <Edit sx={{ color: "#ff2000" }} />
        </IconButton>
      ),
    });
  }

  return (
    <CustomePage
      apis={categoryApis}
      title="دسته بندی"
      canAdd={true}
      canEdit={true}
      permissionsTag="categories"
      createOrEditPageUsingOtherPage={true}
      addLink="/categories/create"
      editLink="/categories"
      broadCrumb={[
        {
          title: "مدیریت محصولات",
          path: "/products",
        },
      ]}
      extraActions={extraActions}
      redirectModal={RedirectModal}
      redirectModalProps={{
        name: "slug"
      }}
    />
  );
};

export default Categories;
