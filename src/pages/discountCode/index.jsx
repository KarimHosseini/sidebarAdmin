/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  GET_DISCOUNTES_PLAN,
  EDIT_ACTIVE_DISCOUNT_PLAN,
  EXPORT_DISCOUNTES_PLAN,
} from "../../helpers/api-routes";

const DiscountsPlan = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for operations
  const discountCodeApis = {
    GET_DATA: GET_DISCOUNTES_PLAN,
    EXPORT_DATA: EXPORT_DISCOUNTES_PLAN,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_DISCOUNT_PLAN,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only
  };

  return (
    <CustomePage
      apis={discountCodeApis}
      title="لیست تخفیف"
      canAdd={false}
      canEdit={false}
      permissionsTag="discount"
      customeModal={false}
      feilds={[]} // No form fields for read-only page
      broadCrumb={[
        {
          title: "باشگاه مشتریان",
          path: "/discounts",
        },
      ]}
      showSync={true}
      showExport={true}
    />
  );
};

export default DiscountsPlan;
