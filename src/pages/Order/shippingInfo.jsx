import React from "react";
import { TextInput } from "../../components/common";
import { getWay } from "../../helpers/constants";

const ShippingInfo = ({ orderData, wallets, tipaxDetail }) => {
  return (
    <div>
      <fieldset className="flex gap-3 items-center border-t  px-3 py-2 flex-wrap">
        <legend className="text-center mx-2 px-2 text-sm font-bold">
          اطلاعات پرداخت
        </legend>
      </fieldset>
      <div className="grid md:grid-cols-3 gap-4">
        {" "}
        <TextInput
          currentValue={orderData?.terminalId}
          label=" شماره ترمینال"
          disabled
        />{" "}
        <TextInput
          currentValue={orderData?.referenceNumber}
          label={"کد تراکنش "}
          disabled
        />
        <TextInput
          currentValue={orderData?.result}
          label={"  متن برگشتی بانک "}
          disabled
        />
        <TextInput
          currentValue={
            orderData?.payState === 1 ? "پرداخت شده" : "پرداخت نشده"
          }
          label={"   وضعیت تراکنش "}
          disabled
        />
        <TextInput
          currentValue={
            getWay.find(
              (item) => Number(item.value) === Number(orderData?.gateway)
            )?.title
          }
          label={"   درگاه سفارش گیری "}
          disabled
        />
        <div className="leftInput">
          <TextInput
            currentValue={orderData?.pan}
            label={"     شماره کارت "}
            disabled
          />
        </div>
        {wallets.walletId && (
          <TextInput
            currentValue={wallets?.walletId}
            label={"     شماره ردیف کیف پول نقدی "}
            disabled
          />
        )}{" "}
        {wallets.facilityWalletId && (
          <TextInput
            currentValue={wallets?.facilityWalletId}
            label={"     شماره ردیف کیف پول تسهیلاتی "}
            disabled
          />
        )}{" "}
        <TextInput
          currentValue={orderData?.rrn}
          label={"     شماره مرجع  "}
          disabled
        />
      </div>
      <fieldset className="flex mt-10 gap-3 items-center border-t  px-3 py-2 flex-wrap">
        <legend className="text-center mx-2 px-2 text-sm font-bold">
          اطلاعات حمل و نقل
        </legend>
      </fieldset>
      <div className="grid md:grid-cols-3 gap-4">
        <>
          <TextInput
            currentValue={orderData?.transferCompany}
            label="  شیوه ارسال "
            disabled
          />
        </>
        <div className=" md:mt-[1.2px]">
          <TextInput
            currentValue={orderData?.transportFee || ""}
            label="  هزینه ارسال "
            disabled
            price
            number
          />
        </div>
        <div className=" md:mt-[1.2px]">
          <TextInput
            currentValue={orderData?.packagingCost || ""}
            label="  هزینه بسته بندی"
            disabled
            price
            number
          />
        </div>{" "}
        <>
          <TextInput
            currentValue={
              orderData?.payDate
                ? new Date(orderData?.shippingDate).toLocaleDateString("fa-IR")
                : ""
            }
            label="تاریخ تحویل"
            disabled
          />{" "}
          <TextInput
            currentValue={
              orderData?.payDate
                ? `${new Date(
                    orderData.shippingFromDate
                  ).getHours()} تا  ${new Date(
                    orderData.shippingToDate
                  ).getHours()}`
                : ""
            }
            label="بازه ارسال"
            disabled
          />
        </>
        <>
          <TextInput
            currentValue={orderData?.totalWeight}
            label="وزن کل سفارش به گرم"
            disabled
          />
          <TextInput
            currentValue={orderData?.shippingCompanyAddress}
            label="نشانی شرکت حمل و نقل"
            disabled
          />
          <TextInput
            currentValue={orderData?.shippingCompanyProvinceName}
            label="استان شرکت حمل و نقل"
            disabled
          />
          <TextInput
            currentValue={orderData?.shippingCompanyCityName}
            label="شهر شرکت حمل و نقل"
            disabled
          />
          <TextInput
            currentValue={orderData?.shippingCompanyCoworkerDelayedDelivery}
            label="تاخیر در ارسال همکار"
            disabled
          />
          <TextInput
            currentValue={orderData?.shippingCompanyDelayedDelivery}
            label="تاخیر در ارسال"
            disabled
          />

          <TextInput
            currentValue={orderData?.shippingclassTitle}
            label="کلاس شرکت حمل و نقل"
            disabled
          />
          <TextInput
            currentValue={
              orderData?.locationDeliveryType === 1
                ? "داخل شهر"
                : orderData?.locationDeliveryType === 2
                ? "شهر های دیگر"
                : orderData?.locationDeliveryType === 3
                ? "سراسری"
                : ""
            }
            label="نوع ارسال شهر شهرستان"
            disabled
          />
          <TextInput
            currentValue={orderData?.totalShippingVat || ""}
            label="  جمع ارزش افزوده حمل و نقل"
            disabled
            price
            number
          />
          <TextInput
            currentValue={orderData?.totalPackagingVat || ""}
            label="  جمع ارزش افزوده بسته بندی"
            disabled
            price
            number
          />
          {/*      <TextInput
            currentValue={orderData?.totalWeight}
            label="وزن کل سفارش به گرم"
            disabled
          />
          <TextInput
            currentValue={orderData?.totalWeight}
            label="وزن کل سفارش به گرم"
            disabled
          /> */}
        </>
      </div>

      {orderData.tipaxOrderId && (
        <>
          <fieldset className="flex mt-10 gap-3 items-center border-t  px-3 py-2 flex-wrap">
            <legend className="text-center mx-2 px-2 text-sm font-bold">
              اطلاعات تیپاکس
            </legend>
          </fieldset>
          <>
            {tipaxDetail?.map((item, index) => (
              <div
                className="grid md:grid-cols-3 gap-4 border-b mb-6 pb-6"
                key={index}
              >
                {" "}
                <TextInput
                  currentValue={item?.trackingCode || ""}
                  label="کد رهگیری"
                  disabled
                />
                <TextInput
                  currentValue={item?.description || ""}
                  label="شرح"
                  disabled
                />
                <TextInput
                  currentValue={item?.paymentType || ""}
                  label="نوع پرداخت"
                  disabled
                />
                <TextInput
                  currentValue={item?.id || ""}
                  label="شناسه"
                  disabled
                />
                <TextInput
                  currentValue={item?.orderId || ""}
                  label="شناسه سفارش"
                  disabled
                />
                <TextInput
                  currentValue={item?.trackingCode || ""}
                  label="کد رهگیری ثانویه"
                  disabled
                />
                <TextInput
                  currentValue={item?.status || ""}
                  label="وضعیت"
                  disabled
                />
                <TextInput
                  currentValue={item?.statusId || ""}
                  label="شناسه وضعیت"
                  disabled
                />
                <TextInput
                  currentValue={item?.origin || ""}
                  label="مبدا"
                  disabled
                />
                <TextInput
                  currentValue={item?.originState || ""}
                  label="استان مبدا"
                  disabled
                />
                <TextInput
                  currentValue={item?.originCity || ""}
                  label="شهر مبدا"
                  disabled
                />
                <TextInput
                  currentValue={item?.destination || ""}
                  label="مقصد"
                  disabled
                />
                <TextInput
                  currentValue={item?.destinationState || ""}
                  label="استان مقصد"
                  disabled
                />
                <TextInput
                  currentValue={item?.destinationCity || ""}
                  label="شهر مقصد"
                  disabled
                />
                <TextInput
                  currentValue={item?.package?.weight || ""}
                  label="وزن بسته"
                  disabled
                  price
                  priceLabel=" کیلوگرم"
                />
                <TextInput
                  currentValue={item?.package?.length || ""}
                  label="طول بسته"
                  disabled
                  price
                  priceLabel="سانتی متر"
                />
                <TextInput
                  currentValue={item?.package?.width || ""}
                  label="عرض بسته"
                  disabled
                  price
                  priceLabel="سانتی متر"
                />
                <TextInput
                  currentValue={item?.package?.height || ""}
                  label="ارتفاع بسته"
                  disabled
                  price
                  priceLabel="سانتی متر"
                />
                <TextInput
                  currentValue={item?.package?.value || ""}
                  label="ارزش بسته"
                  disabled
                  price
                  priceLabel="ریال"
                />
                <TextInput
                  currentValue={item?.package?.packageContentTitle || ""}
                  label="محتوای بسته"
                  disabled
                />
                <TextInput
                  currentValue={
                    item?.package?.isFragile ? "شکستنی" : "غیرشکستنی"
                  }
                  label="شکستنی بودن"
                  disabled
                />
                <TextInput
                  currentValue={item?.sender?.fullName || ""}
                  label="نام فرستنده"
                  disabled
                />
                <TextInput
                  currentValue={item?.receivers?.fullName || ""}
                  label="نام گیرنده"
                  disabled
                />
                <TextInput
                  currentValue={item?.priceDetail?.shippingCost || ""}
                  label="هزینه حمل و نقل"
                  disabled
                  price
                  priceLabel="ریال"
                />
                <TextInput
                  currentValue={item?.priceDetail?.compensationService || ""}
                  label="هزینه جبران خسارت"
                  disabled
                  price
                  priceLabel="ریال"
                />
                <TextInput
                  currentValue={item?.priceDetail?.tax || ""}
                  label="مالیات"
                  disabled
                  price
                  priceLabel="ریال"
                />
                <TextInput
                  currentValue={item?.priceDetail?.finalAmount || ""}
                  label="مبلغ نهایی"
                  disabled
                  price
                  priceLabel="ریال"
                />
                <TextInput
                  currentValue={item?.priceDetail?.payInPlaceAmount || ""}
                  label="مبلغ پرداخت در محل"
                  disabled
                  price
                  priceLabel="ریال"
                />
              </div>
            ))}
          </>
        </>
      )}
    </div>
  );
};

export default ShippingInfo;
