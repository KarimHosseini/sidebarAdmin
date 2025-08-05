import React, { useMemo } from "react";
import { TextInput } from "../../components/common";

const InsuranceDetails = ({ orderData, orderItems }) => {
function getInsuranceObjs(item) {
  if (item.insurance) {
    const insuranceObj = typeof item.insurance === "string"
      ? JSON.parse(item.insurance)
      : item.insurance;
    return [insuranceObj];
  }
  return Array.isArray(item.OrderDetailsService) ? item.OrderDetailsService : [];
}

function getAllInsurances(orderItems) {
  return orderItems.flatMap(getInsuranceObjs);
}

const insuranceMarkUp = useMemo(() => {
  return getAllInsurances(orderItems).reduce((sum, insurance) => {
    return sum + (insurance?.totalMarkUp || 0);
  }, 0);
}, [orderData]);

const insuranceBase = useMemo(() => {
  return getAllInsurances(orderItems).reduce((sum, insurance) => {
    return sum + ((insurance?.price || 0) * (insurance?.qty || 0));
  }, 0);
}, [orderData]);

const priceWithDiscount = useMemo(() => {
  return getAllInsurances(orderItems).reduce((sum, insurance) => {
    return sum + (insurance?.priceWithDiscount || 0);
  }, 0);
}, [orderData]);

const discount = useMemo(() => {
  return getAllInsurances(orderItems).reduce((sum, insurance) => {
    return sum + (insurance?.discount || 0);
  }, 0);
}, [orderData]);

const insuranceName = useMemo(() => {
  return getAllInsurances(orderItems)
    .map((insurance) => insurance?.title || "")
    .filter(Boolean)
    .join(", ");
}, [orderItems]);

  return (
    <div className="flex flex-col md:grid lg:grid-cols-4 md:grid-cols-3   gap-4 relative z-10">
      <div className=" md:mt-[1.2px]">
        <TextInput
          currentValue={priceWithDiscount}
          label="  جمع هزینه خدمات پرداختی"
          disabled
          price
          number
        />
      </div>
      <div className=" md:mt-[1.2px]">
        <TextInput
          currentValue={insuranceMarkUp || ""}
          label="  جمع مارک آپ خدمات ها"
          disabled
          price
          number
        />
      </div>
      <div className=" md:mt-[1.2px]">
        <TextInput
          currentValue={insuranceBase - insuranceMarkUp || ""}
          label="  جمع خالص خدمات ها"
          disabled
          price
          number
        />
      </div>{" "}
      <div className=" md:mt-[1.2px]">
        <TextInput
          currentValue={discount || ""}
          label="  جمع تخفیف خدمات ها"
          disabled
          price
          number
        />
      </div>
      <div className=" md:mt-[1.2px]">
        <TextInput
          currentValue={insuranceName || ""}
          label="  نام  خدمات ها"
          disabled
        />
      </div>{" "}
      <TextInput
        currentValue={orderData?.totalInsuranceVat || ""}
        label="  جمع ارزش افزوده خدمات"
        disabled
        price
        number
      />
    </div>
  );
};

export default InsuranceDetails;
