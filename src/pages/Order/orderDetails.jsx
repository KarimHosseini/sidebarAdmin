import { Button, CircularProgress, Skeleton, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { TextInput } from "../../components/common";
import Uploader from "../../components/common/uploader";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  ORDER_SEND_SMS,
  orderDescription,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const OrderDetails = ({ orderData, saleManagerId, loadingData }) => {
  const { token } = useSelector((state) => state.user);
  const [adminDescription, setAdminDescription] = useState(undefined);
  const [loadingSms, setloadingSms] = useState(false);

  const [files, setFiles] = useState();

  const { userPermissions } = useSelector((state) => state.relationals);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setAdminDescription(orderData?.adminDescription || "");
  }, [orderData]);
  const handleAdminDescriptions = (sendSms) => {
    const formData = new FormData();
    formData.append("id", orderData.id);
    if (saleManagerId) formData.append("saleManagerId", saleManagerId);
    formData.append("adminDescription", adminDescription);
    if (files) formData.append("Files", files);
    if (orderData?.agentId) {
      formData.append("agentId", orderData?.agentId);
    }
    axiosInstance
      .put(`${baseUrl}/${orderDescription}`, formData, configReq(token))
      .then((res) => {
        setLoading(false);
        if (sendSms) {
          handleSend();
        } else {
          toast.success("با موفقیت ثبت شد");
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };
  const handleSend = () => {
    setloadingSms(true);
    const formData = new FormData();
    formData.append("orderId", orderData.id);
    if (orderData?.agentId) {
      formData.append("agentId", orderData?.agentId);
    }
    axiosInstance
      .post(`${baseUrl}/${ORDER_SEND_SMS}`, formData, configReq(token))
      .then((res) => {
        setloadingSms(false);
        toast.success("با موفقیت ثبت و ارسال شد");
      })
      .catch((err) => {
        setloadingSms(false);
        toast.error(err.response?.data?.message);
      });
  };
  return (
    <>
      <fieldset className="flex gap-3 items-center border-t  px-3 py-2 flex-wrap">
        <legend className="text-center mx-2 px-2 text-sm font-bold">
          اطلاعات نقدی
        </legend>
      </fieldset>
      {loadingData ? (
        <div className="flex flex-col md:grid lg:grid-cols-4 md:grid-cols-3   gap-4 relative z-10">
          {Array.from(Array(12).keys()).map((item, i) => (
            <Skeleton key={"orderItemDetails" + i} height={30} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col md:grid lg:grid-cols-4 md:grid-cols-3   gap-4 relative z-10">
          <>
            <TextInput
              currentValue={orderData?.id}
              label="شماره سفارش"
              disabled
            />
          </>
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
          </>
          <>
            <TextInput
              currentValue={
                orderData?.payDate
                  ? new Date(orderData?.payDate).toLocaleDateString("fa-IR")
                  : ""
              }
              label="تاریخ پرداخت"
              disabled
            />
          </>
          <>
            <TextInput
              currentValue={new Date(orderData?.updateAt).toLocaleDateString(
                "fa-IR"
              )}
              label="تاریخ بروزرسانی"
              disabled
            />
          </>
          <>
            <TextInput
              currentValue={`${String(
                new Date(orderData?.updateAt).getMinutes()
              ).padStart(2, "0")} : ${String(
                new Date(orderData?.updateAt).getHours()
              ).padStart(2, "0")}`}
              label="ساعت بروزرسانی"
              disabled
            />
          </>
          <>
            <TextInput
              currentValue={orderData?.legalInvoice ? "دارد" : "ندارد"}
              label=" درخواست فاکتور رسمی دارد "
              disabled
            />
          </>
          {orderData?.type !== 1 && (
            <div className=" md:mt-[1.2px]">
              <TextInput
                currentValue={
                  orderData?.InfrastructureCost
                    ? orderData?.InfrastructureCost || ""
                    : ""
                }
                label="  هزینه زیر ساخت"
                disabled
                price
                number
              />
            </div>
          )}
          <div className=" md:mt-[1.2px]">
            <TextInput
              currentValue={orderData?.totalVat || ""}
              label="  جمع ارزش افزوده"
              disabled
              price
              number
            />
          </div>
          <div className=" md:mt-[1.2px]">
            <TextInput
              currentValue={orderData?.planDiscount}
              label="  کوپن تخفیف "
              disabled
            />
          </div>
          <>
            <TextInput
              currentValue={orderData?.discount || ""}
              label="  مبلغ تخفیف "
              disabled
              price
              number
            />
          </>
          <>
            <TextInput
              currentValue={orderData?.mode === 1 ? 0 : orderData?.total || ""}
              label="  مبلغ کل کالا "
              disabled
              price
              number
            />
          </>{" "}
          <>
            {/*             <TextInput
              currentValue={
                orderData?.facilityPrice || ""
              }
              label="  مبلغ تسهیلاتی"
              disabled
            /> */}
          </>
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
          <>
            <TextInput
              currentValue={
                orderData?.payState === 1 ? "پرداخت شده" : "پرداخت نشده"
              }
              label="  وضعیت پرداخت "
              disabled
            />
          </>{" "}
          <TextInput
            currentValue={orderData?.totalWallet || ""}
            label=" مبلغ استفاده شده از کیف پول نقدی"
            disabled
            price
            number
          />
          {/*           <>
            <TextInput
              currentValue={
                orderData?.planTitle
              }
              label="   عنوان طرح "
              disabled
            />
          </>{" "}
          <>
            <TextInput
               currentValue={orderData?.planWage || ""}
              label="  کارمز طرح  "
              disabled
            />
          </> */}
          <div className=" col-span-4">
            <TextField
              value={orderData?.description}
              label="  توضیحات سفارش دهنده"
              disabled
              fullWidth
            />
          </div>{" "}
          {orderData?.type === 1 && orderData.mode !== 1 ? (
            <div className="col-span-4 grid md:grid-cols-4 gap-4 mt-5 pt-5">
              {" "}
              <fieldset className="flex gap-3 col-span-4 items-center border-t  px-3 py-2 flex-wrap">
                <legend className="text-center mx-2 px-2 text-sm font-bold">
                  اطلاعات تسهیلاتی
                </legend>
              </fieldset>
              <TextInput
                currentValue={orderData?.facilityDeference || ""}
                label="  مابه التفاوت"
                disabled
                price
                number
              />{" "}
              <TextInput
                currentValue={
                  orderData?.InfrastructureCost
                    ? orderData?.InfrastructureCost || ""
                    : ""
                }
                label="  هزینه زیر ساخت"
                disabled
                price
                number
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
                currentValue={orderData?.final || ""}
                label={
                  orderData?.type === 1
                    ? "      مبلغ کل فاکتور نقدی "
                    : "قیمت نهایی "
                }
                disabled
                price
                number
              />{" "}
              <div className=" md:mt-[1.2px]">
                <TextInput
                  currentValue={
                    orderData?.prePayment ? orderData?.prePayment || "" : ""
                  }
                  label="  هزینه پیش پرداخت"
                  disabled
                  price
                  number
                />
              </div>
              <div className=" md:mt-[1.2px]">
                <TextInput
                  currentValue={
                    orderData?.totalFacilityWallet
                      ? orderData?.totalFacilityWallet || ""
                      : ""
                  }
                  label=" مبلغ استفاده شده از کیف پول تسهیلاتی"
                  disabled
                  price
                  number
                />
              </div>
            </div>
          ) : (
            <></>
          )}
          {orderData?.revokeDescription && (
            <div className=" col-span-4">
              <TextField
                value={orderData?.revokeDescription}
                label="  توضیحات لغو سفارش "
                disabled
                fullWidth
              />
            </div>
          )}
          {userPermissions?.orders?.descriptionAdminUpdate && (
            <div className=" col-span-4">
              {adminDescription !== undefined && (
                <TextField
                  label=" توضیحات ادمین"
                  multiline
                  fullWidth
                  rows={1}
                  /*                   disabled={!userPermissions?.orders?.update}
                   */ onChange={(e) => setAdminDescription(e.target.value)}
                  value={adminDescription}
                />
              )}

              <div className="flex items-center mt-4 w-full justify-between">
                <div className="w-fit">
                  <Uploader
                    setFiles={(e) => {
                      setFiles(e);
                    }}
                    check="image"
                    type="image"
                    defualt={orderData?.descriptionImage}
                  />
                </div>
                <div className="flex gap-2 items-center">
                  {userPermissions?.orders?.sendMessage && (
                    <Button
                      disabled={loadingSms}
                      size="small"
                      onClick={() => {
                        if (adminDescription === orderData?.adminDescription) {
                          handleSend();
                        } else {
                          handleAdminDescriptions(true);
                        }
                      }}
                      variant="contained"
                    >
                      {loadingSms ? <CircularProgress /> : "  ارسال اس ام اس"}
                    </Button>
                  )}
                  <Button
                    onClick={handleAdminDescriptions}
                    color="primary"
                    size="small"
                    variant="outlined"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress /> : "  ثبت توضیحات"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default OrderDetails;
