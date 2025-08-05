/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  DISCOUNTES,
  EDIT_ACTIVE_DISCOUNT,
  EXPORT_DISCOUNTES,
} from "../../helpers/api-routes";

const Discounts = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define APIs for operations
  const discountApis = {
    GET_DATA: DISCOUNTES,
    EXPORT_DATA: EXPORT_DISCOUNTES,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_DISCOUNT,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA since this uses separate pages
  };

  return (
    <CustomePage
      apis={discountApis}
      title="کد تخفیف محصول"
      canAdd={true}
      canEdit={false}
      permissionsTag="discountCode"
      customeModal={false}
      feilds={[]} // No form fields since it redirects to separate page
      createOrEditPageUsingOtherPage={true}
      addLink="/discounts/create"
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

export default Discounts;
