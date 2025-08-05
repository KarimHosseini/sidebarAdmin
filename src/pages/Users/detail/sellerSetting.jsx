import React from "react";
import { TextInput } from "../../../components/common";

const SellerSetting = ({ userData, setUserData }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <TextInput
        label="درصد کارمد از فروش"
        number
        noSepreate
        currentValue={userData?.referralCommissionPercent}
        change={(e) =>
          setUserData({ ...userData, referralCommissionPercent: e })
        }
      />{" "}
      <TextInput
        label="کد معرف"
        currentValue={userData?.referralCode}
        change={(e) => setUserData({ ...userData, referralCode: e })}
      />
    </div>
  );
};

export default SellerSetting;
