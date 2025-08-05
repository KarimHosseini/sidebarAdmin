import { Button } from "@mui/material";
import React from "react";
import { TextInput } from "../../components/common";
import { getWay } from "../../helpers/constants";

const ChangeStatusWarinig = ({
  orderData,
  handleClose,
  handleSumbit,
  nextValid,
}) => {
  return (
    <>
      {nextValid === 2 || nextValid === 13 ? (
        <div className=" flex flex-col md:grid grid-cols-3 gap-4 md:min-w-[800px]">
          {orderData?.baileeAgent ? (
            <>
              {" "}
              <>
                <TextInput
                  currentValue={new Date(
                    orderData?.baileeAgent?.createdAt
                  ).toLocaleDateString("fa-IR")}
                  label="تاریخ تحویل"
                  disabled
                />
              </>
              <>
                <TextInput
                  currentValue={` ${String(
                    new Date(orderData?.baileeAgent?.createdAt).getMinutes()
                  ).padStart(2, "0")}: ${String(
                    new Date(orderData?.baileeAgent?.createdAt).getHours()
                  ).padStart(2, "0")}`}
                  label="ساعت تحویل"
                  disabled
                />
              </>
            </>
          ) : (
            <>
              {" "}
              <>
                <TextInput
                  currentValue={orderData?.transferCompany}
                  label="  شیوه ارسال "
                  disabled
                />
              </>{" "}
              <>
                <TextInput
                  currentValue={
                    orderData?.payDate
                      ? new Date(orderData?.shippingDate).toLocaleDateString(
                          "fa-IR"
                        )
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
                  label={nextValid !== 13 ? "بازه ارسال" : "بازه تحویل"}
                  disabled
                />
              </>
            </>
          )}
        </div>
      ) : nextValid === 4 ?<></> : (
        <div className=" flex flex-col md:grid grid-cols-3 gap-4 md:min-w-[800px]">
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
          <TextInput
            currentValue={orderData?.rrn}
            label={"     شماره مرجع  "}
            disabled
          />{" "}
          <>
            <TextInput
              currentValue={new Date(orderData?.dateTime).toLocaleDateString(
                "fa-IR"
              )}
              label="تاریخ سفارش"
              disabled
            />
          </>
          <>
            <TextInput
              currentValue={` ${String(
                new Date(orderData?.dateTime).getMinutes()
              ).padStart(2, "0")}: ${String(
                new Date(orderData?.dateTime).getHours()
              ).padStart(2, "0")}`}
              label="ساعت سفارش"
              disabled
            />
          </>{" "}
          <>
            {orderData?.type !== 1 ? (
              <TextInput
                currentValue={orderData?.final || ""}
                label={
                  orderData?.type === 1
                    ? "قیمت نهایی   تسهیلاتی "
                    : "قیمت نهایی "
                }
                disabled
                price
                number
              />
            ) : (
              <></>
            )}
          </>
          <TextInput
            currentValue={orderData?.totalWallet || ""}
            label=" مبلغ استفاده شده از کیف پول نقدی"
            disabled
            price
            number
          />{" "}
          <TextInput
            currentValue={orderData?.legalInvoice ? "دارد" : "ندارد"}
            label=" درخواست فاکتور رسمی دارد "
            disabled
          />
        </div>
      )}{" "}
      <div className="col-span-3 font-bold my-4">
        * آیا از تغییر وضعیت و اطلاعات پرداختی اطمینان دارید؟
      </div>
      <div className="flex items-center justify-between col-span-3 w-full flex-wrap">
        <Button onClick={handleClose} variant="outlined">
          انصرف
        </Button>
        <Button onClick={handleSumbit} variant="contained">
          ثایید و ثبت اطلاعات
        </Button>
      </div>
    </>
  );
};

export default ChangeStatusWarinig;
