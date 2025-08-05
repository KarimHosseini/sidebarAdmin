/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EDIT_ACTIVE_PRODUCY_SCORE,
  EXPORT_productScores,
  productScores,
  EDIT_PRODUCY_SCORE,
  DELETE_PRODUCY_SCORE,
} from "../../helpers/api-routes";

const Comments = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define form fields based on the modal
  const commentsFields = [
    {
      name: 'title',
      label: 'متن',
      type: 'textInput',
      required: false
    },
    {
      name: 'description',
      label: 'توضیحات',
      type: 'textInput',
      required: false
    },
    {
      name: 'suggest',
      label: 'توصیه می کند/نمی کند',
      type: 'switch',
      required: false,
      defaultValue: false
    },
    {
      name: 'verified',
      label: 'تایید نمایش نظر',
      type: 'switch',
      required: false,
      defaultValue: false
    }
  ];

  // Define APIs for CRUD operations
  const commentsApis = {
    GET_DATA: productScores,
    EXPORT_DATA: EXPORT_productScores,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_PRODUCY_SCORE,
    // No CREATE_DATA - this is for managing existing comments
    EDIT_DATA: EDIT_PRODUCY_SCORE,
    DELETE_DATA: DELETE_PRODUCY_SCORE,
  };

  return (
    <CustomePage
      apis={commentsApis}
      title="نظرات محصولات"
      canAdd={false} // No create - only edit existing comments
      canEdit={true}
      permissionsTag="productScores"
      customeModal={false}
      feilds={commentsFields}
      broadCrumb={[
        {
          title: "نظرات",
          path: "/comments",
        },
      ]}
      showSync={true}
      showExport={true}
    />
  );
};

export default Comments;
