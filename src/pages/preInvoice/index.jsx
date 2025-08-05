/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomePage from "../../components/customePage";
import { 
  EXPORT_PREINVOICE, 
  GET_PREINVOICE,
  CREATE_PREINVOICE,
  EDIT_PREINVOICE,
  DELETE_PREINVOICE,
} from "../../helpers/api-routes";

const PreFactor = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const navigate = useNavigate();

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_PREINVOICE,
    EXPORT_DATA: EXPORT_PREINVOICE,
    CREATE_DATA: CREATE_PREINVOICE,
    EDIT_DATA: EDIT_PREINVOICE,
    DELETE_DATA: DELETE_PREINVOICE,
  };

  return (
    <CustomePage
      apis={apis}
      title="سفارشات نماینده ها"
      canAdd={userPermissions?.PreFactor?.AddPreFactorWithOutDependency}
      canEdit={false}
      permissionsTag="PreFactor"
      customeModal={true}
      createOrEditPageUsingOtherPage={true}
      addLink="/preFactor/create"
      editLink="/preFactor"
    />
  );
};

export default PreFactor;

// تسک 1: صفحه preInvoice به CustomePage تبدیل شد (از صفحه جداگانه برای ایجاد استفاده می‌کند) ✓
