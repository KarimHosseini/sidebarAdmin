import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, TextField } from "@mui/material";
import React, { useState } from "react";
import Lightbox from "react-image-lightbox";
import { TextInput } from "../../components/common";
import { baseUrl, DOWNLOAD_FILE } from "../../helpers/api-routes";

const DeliverInfo = ({ orderData }) => {
  const [openPreview, setOpenPreview] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `${baseUrl}/${DOWNLOAD_FILE}/${orderData?.baileeAgent.galleryId}`;
    link.download = `national-card-${
      orderData?.baileeAgent?.nationalCode || "image"
    }.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="text-base font-bold mb-5 pb-3 border-b w-full ">
        اطلاعات صاحب اکانت
      </div>
      <div className="flex flex-col md:grid lg:grid-cols-4 md:grid-cols-3   gap-4 relative z-10">
        {orderData && (
          <>
            <a
              className="cursor-pointer relative z-50"
              target={"_blank"}
              href={"/users/" + orderData?.userId}
              rel="noreferrer"
            >
              {" "}
              <TextField
                value={orderData?.userName}
                label={"نام سفارش دهنده"}
                disabled
                fullWidth
                className="!cursor-pointer"
                onClick={() => {
                  window.open("/users/" + orderData?.userId);
                }}
              />
            </a>

            {[
              ["  نوع شخص", orderData?.isLegal ? "حقوقی" : "حقیقی"],
              ["  کد اقتصادی", orderData?.economicCode],
              ["  نام سازمان", orderData?.companyName],
              ["  شناسه ثبت", orderData?.regNumber],
              ["  شناسه ملی", orderData?.nationalId],

              ["تلفن ثابت", orderData?.tel],
              ["کد ملی  ", orderData?.nationalCode],
            ].map((item, i) => (
              <div key={i + " vjrhgov"} className="">
                <TextInput currentValue={item[1]} label={item[0]} disabled />
              </div>
            ))}
          </>
        )}
      </div>
      <div className="text-base font-bold mb-5 pb-3 border-b w-full mt-10">
        اطلاعات تحویل گیرنده
      </div>
      <div className="flex flex-col md:grid lg:grid-cols-4 md:grid-cols-3   gap-4 relative z-10">
        {orderData && (
          <>
            {[
              [
                "نام تحویل گیرنده",
                orderData?.mode === 1
                  ? ""
                  : orderData?.sendAddress?.receptorFname +
                    " " +
                    orderData?.sendAddress?.receptorLname,
              ],
              [
                "  کد ملی تحویل گیرنده",
                orderData?.sendAddress?.receptorNationalCode,
              ],

              ["کدپستی", orderData?.sendAddress?.postalCode],
              [
                "شماره  موبایل تحویل گیرنده",
                orderData?.sendAddress?.receptorMobile,
              ],
            ].map((item, i) => (
              <div key={i + " vjrhdsadsadov"} className="">
                <TextInput currentValue={item[1]} label={item[0]} disabled />
              </div>
            ))}
            {orderData.shippingCompanyType !== 1 && (
              <>
                <TextInput
                  currentValue={orderData?.sendAddress?.province}
                  label={" استان "}
                  disabled
                />
                <TextInput
                  currentValue={orderData?.sendAddress?.city}
                  label={"   شهر"}
                  disabled
                />
                <div className=" col-span-4">
                  <TextInput
                    currentValue={
                      orderData?.mode === 1
                        ? ""
                        : `${orderData?.sendAddress?.address} ,پلاک  ${orderData?.sendAddress?.plaque} ,طبقه  ${orderData?.sendAddress?.floorNo} ,واحد  ${orderData?.sendAddress?.unit}`
                    }
                    label="نشانی"
                    disabled
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
      {orderData?.baileeAgent && (
        <>
          <div className="text-base font-bold mb-5 pb-3 border-b w-full mt-10">
            اطلاعات نماینده تحویل گیرنده
          </div>
          <div className="flex flex-col md:grid lg:grid-cols-4 md:grid-cols-3   gap-4 relative z-10">
            <>
              {[
                [
                  "نام تحویل گیرنده",
                  orderData?.mode === 1
                    ? ""
                    : orderData?.baileeAgent?.firstName +
                      " " +
                      orderData?.baileeAgent?.lastName,
                ],
                ["  کد ملی تحویل گیرنده", orderData?.baileeAgent?.nationalCode],

                [
                  "شماره  موبایل تحویل گیرنده",
                  orderData?.baileeAgent?.mobileNumber,
                ],
              ].map((item, i) => (
                <div key={i + " vjrhdsadsadov"} className="">
                  <TextInput currentValue={item[1]} label={item[0]} disabled />
                </div>
              ))}
              <div className="border rounded-lg px-4 py-2 border-gray-400 flex justify-between items-center">
                <span className="text-xs">مشاهده کارت ملی :‌</span>
                <div className="flex gap-2">
                  <IconButton
                    variant="outlined"
                    size="small"
                    onClick={() => setOpenPreview(true)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={handleDownload}
                  >
                    <FileDownloadIcon />
                  </IconButton>
                </div>
              </div>
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
              </>{" "}
              <>
                <TextInput
                  currentValue={orderData?.baileeAgent?.updaterName}
                  label="ادمین ویرایش کننده"
                  disabled
                />
              </>
              {openPreview && (
                <Lightbox
                  mainSrc={`${baseUrl}/${DOWNLOAD_FILE}/${orderData?.baileeAgent.galleryId}`}
                  onCloseRequest={() => setOpenPreview(false)}
                />
              )}
            </>
          </div>
        </>
      )}
    </>
  );
};

export default DeliverInfo;
