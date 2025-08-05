import React from "react";
import { useNavigate } from "react-router-dom";
import { TextInput } from "../../components/common";

const FacilityInfo = ({ orderData, refahDetails }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:grid lg:grid-cols-4 md:grid-cols-3   gap-4 relative z-10">
      <TextInput
        currentValue={orderData?.facilityName}
        label="نام تسهیلات"
        disabled
      />{" "}
      <TextInput
        currentValue={orderData?.loanAmount || ""}
        label="میزان تسهیلات درخواستی"
        disabled
        price
        number
      />{" "}
      <TextInput
        currentValue={orderData?.facilityFinalRefundAmount || ""}
        label="  مبلغ باز پرداخت نهایی "
        disabled
        price
        number
      />
      <TextInput
        currentValue={orderData?.refundMonthCount}
        label="تعداد اقساط"
        disabled
      />
      <TextInput
        currentValue={orderData?.facilityChargeType}
        label="مدل تسهیلات"
        disabled
      />
      {orderData?.facilityChargeTypeModel ? (
        <TextInput
          currentValue={
            orderData?.facilityChargeTypeModel === 1 ? "تسهیم" : "درگاه"
          }
          label="نوع شارژ"
          disabled
        />
      ) : (
        <></>
      )}
      <TextInput
        currentValue={orderData?.facilitatorWagePercent}
        label=" کارمزد تسهیل گر"
        disabled
      />{" "}
      <TextInput
        currentValue={orderData?.facilitatorFromCompanyWagePercent}
        label={` سهم تسهیل گر از کارمزد  ${process.env.REACT_APP_COMPANY_TITLE} `}
        disabled
      />
      <TextInput
        currentValue={orderData?.salesDevelopmentFee}
        label="  کارمزد توسعه فروش نماینده"
        disabled
      />
      <TextInput
        currentValue={orderData?.companyWagePercent}
        label={`  کارمزد  ${process.env.REACT_APP_COMPANY_TITLE} `}
        disabled
      />
      <TextInput
        currentValue={orderData?.pmtPercent}
        label="  درصد pmt"
        disabled
      />
      <TextInput
        currentValue={orderData?.facilityMinCredit || ""}
        label="  حداقل تسهیلات"
        disabled
        price
        number
      />
      <TextInput
        currentValue={orderData?.facilityMaxCredit || ""}
        label="  حداکثر تسهیلات"
        disabled
        price
        number
      />{" "}
      <TextInput
        currentValue={orderData?.loanAmount || ""}
        label="اعتبار درخواستی با احتساب کسر کارمزد"
        disabled
        price
        number
      />
      {orderData?.facilityBlockedPrice ? (
        <>
          <TextInput
            currentValue={orderData?.facilityBlockedPrice || ""}
            label=" مبلغ هدیه"
            disabled
            price
            number
          />{" "}
          <TextInput
            currentValue={
              orderData?.facilityExpBlockDate
                ? new Date(orderData?.facilityExpBlockDate).toLocaleDateString(
                    "fa-IR"
                  )
                : ""
            }
            label=" تاریخ انقضا هدیه"
            disabled
            price
            number
          />
        </>
      ) : (
        <></>
      )}
      {/*       <TextInput currentValue={orderData?.id} label="" disabled />
       */}
      <TextInput
        currentValue={orderData?.facilityDescription}
        label="توضیحات "
        disabled
      />
      <TextInput
        currentValue={orderData?.facilityUserMaxCredit || ""}
        label="  سقف اعتبار کاربر"
        disabled
        price
        number
      />{" "}
      {orderData?.mode === 1 && (
        <TextInput
          currentValue={orderData?.userSalePower || ""}
          label=" حداکثر قدرت خرید کاربر"
          disabled
          price
          number
        />
      )}
      {refahDetails?.refahBlueRefId && (
        <TextInput
          currentValue={refahDetails?.refahBlueRefId}
          label=" شماره وام بلو"
          disabled
        />
      )}
      {refahDetails?.refahId && (
        <a href={`/betaloan/${refahDetails?.refahId}`} target="_blank">
          <div
            className="cursor-pointer w-full relative z-50"
            onClick={() => navigate(`/betaloan/${refahDetails?.refahId}`)}
          >
            <TextInput
              currentValue={refahDetails?.refahId}
              label="شماره تسهیلات دارای تضمین کننده "
              disabled
            />
          </div>
        </a>
      )}
      {refahDetails?.refahRefId && (
        <TextInput
          currentValue={refahDetails?.refahRefId}
          label="شماره وام رفاه "
          disabled
        />
      )}
      {orderData?.mode === 1 ? (
        <>
          {" "}
          {refahDetails?.refahLoanAmount && (
            <TextInput
              currentValue={refahDetails?.refahLoanAmount}
              label="مبلغ وام"
              disabled
              price
              number
            />
          )}{" "}
          {refahDetails?.refahFinalAmount && (
            <TextInput
              currentValue={refahDetails?.refahFinalAmount}
              label="مبلغ باز پرداخت نهایی"
              disabled
              number
              price
            />
          )}{" "}
          {refahDetails?.agentPercent && (
            <TextInput
              currentValue={refahDetails?.agentPercent}
              label="درصد کارمزد نماینده"
              disabled
            />
          )}{" "}
          <TextInput
            currentValue={orderData?.facilityDeference || ""}
            label=" مابه التفاوت تسهیلات در فاکتور نماینده"
            disabled
            price
            number
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default FacilityInfo;
