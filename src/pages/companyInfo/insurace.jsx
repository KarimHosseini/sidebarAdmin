import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { NumberInput, TextEditor, TextInput } from "../../components/common";

const Insurance = ({ data, setData }) => {
  const { userPermissions } = useSelector((state) => state.relationals);

  return (
    <div className="md:grid grid-cols-4 gap-5">
      <TextInput
        label=" نام خدمات"
        currentValue={data?.insuranceTitle}
        change={(e) => setData({ ...data, insuranceTitle: e })}
        disabled={!userPermissions?.companyInfo?.update}
      />
      <NumberInput
        label=" درصد اولیه"
        value={data?.insurancePercent}
        change={(e) => {
          if (e <= 0) {
            toast.error("عدد بزرگ تر از صفر وارد کنید");
          } else {
            setData({ ...data, insurancePercent: e });
          }
        }}
        disabled={!userPermissions?.companyInfo?.update}
        float
        min={1}
      />
      <NumberInput
        label=" درصد تخفیف"
        value={data?.insuranceDiscount}
        change={(e) => {
          if (e <= 0) {
            toast.error("عدد بزرگ تر از صفر وارد کنید");
          } else {
            setData({ ...data, insuranceDiscount: e });
          }
        }}
        disabled={!userPermissions?.companyInfo?.update}
        float
        min={1}
      />
      <div className="col-span-4">
        {" "}
        <TextEditor
          value={data?.insuranceDescription}
          change={(e) => setData({ ...data, insuranceDescription: e })}
          hint=" توضیحات خدمات"
        />
      </div>
    </div>
  );
};

export default Insurance;
