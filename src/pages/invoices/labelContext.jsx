/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-loop-func */

import { Button } from "@mui/material";
import React, { useState } from "react";
import Barcode from "react-barcode";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { baseUrl, DOWNLOAD_FILE } from "../../helpers/api-routes";

const OrderLabelContext = ({ orders, seller, names }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const { token } = useSelector((state) => state.user);
  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);
  const { companyInfo } = useSelector((state) => state.relationals);

  const [isPrinting, setIsPrinting] = useState(false);

  const handleAfterPrint = React.useCallback(() => {
    setIsPrinting(false);
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    setIsPrinting(true);
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    setLoading(true);

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        resolve();
      }, 3000);
    });
  }, []);

  React.useEffect(() => {
    if (!loading && typeof onBeforeGetContentResolve.current === "function") {
      onBeforeGetContentResolve.current();
    }
  }, [loading]);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, []);

  const reactToPrintTrigger = React.useCallback(() => {
    return (
      <Button
        sx={{
          position: "absolute",
          top: "20px",
          left: "150px",
          zIndex: 99999999,
        }}
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? "در حال آماده سازی..." : "چاپ لیبل"}
      </Button>
    );
  }, [loading]);

  return (
    <>
      <ReactToPrint
        content={reactToPrintContent}
        documentTitle={names ? names : "orderLabel"}
        onAfterPrint={handleAfterPrint}
        onBeforeGetContent={handleOnBeforeGetContent}
        onBeforePrint={handleBeforePrint}
        removeAfterPrint
        trigger={reactToPrintTrigger}
      />
      <div ref={componentRef} className="print-container">
        {/* Improved print styles with more specific rules */}
        <style type="text/css" media="print">
          {`
            @page {
              size: A4 landscape;
              margin: 0;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .print-container {
                width: 100%;
                height: 100%;
              }
              .invoicePage {
                page-break-after: always;
                break-after: page;
                margin: 50px  auto !important;
                padding: 10px !important;
              }
              img, .barcode-container {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                    margin-bottom: -115px !important;
              }
            .headerLabel{
            
            max-height: 50px !important;
            margin-top: -45px !important;
            
            }
            .priceInfo{ 
            margin-bottom: -70px !important;
            
            }
              .deliverInfo{ 
            margin-bottom: -60px !important;
            
            }
        
            
            }
          `}
        </style>

        {orders?.map((items, index) => (
          <div
            key={index}
            style={{
              width: "12.5cm",
              height: "9.5cm",
              border: "1px solid #000",
              pageBreakAfter: "always",
              breakAfter: "page",
            }}
            className="p-4 flex-col !m-auto flex justify-between mx-auto my-4 overflow-hidden invoicePage"
          >
            <div className="flex gap-2 py-1 justify-between headerLabel max-h-[50px] items-center">
              <div className="flex items-center gap-2">
                {companyInfo?.companyLogo && (
                  <img
                    src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}`}
                    alt="logo"
                    className="img-fluid w-[100px]"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
              </div>
              <div className="rounded-md px-4 flex flex-col gap-2 items-center mt-3">
                <div className="w-[270px] -mt-2 barcode-container">
                  {/* Simplified barcode with error handling */}
                  {items.tipaxTrackingCode || items.id ? (
                    <Barcode
                      fontSize={20}
                      height={50}
                      width={1.5}
                      margin={10}
                      className="w-[270px]"
                      value={
                        items.tipaxTrackingCode
                          ? items.tipaxTrackingCode
                          : `${process.env.REACT_APP_LABEL_URL}/order/${String(
                              items.id
                            )}`
                      }
                      displayValue={true}
                    />
                  ) : (
                    <div>کد پیگیری موجود نیست</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center priceInfo justify-start gap-1">
              <div className="flex items-center gap-1">
                <small className="!text-[10px] font-bold">
                  مبلغ کل فاکتور:‌
                </small>
                <div className="d-inline-block text-xs">
                  {items.final?.toLocaleString()} ریال -
                </div>
              </div>
            </div>

            <div className="flex gap-5 deliverInfo justify-between w-full ">
              <div className="w-full">
                <div className="border border-black flex-1 w-full rounded-md p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between ">
                    <small className="!text-[10px] font-semibold ">
                      مشخصات فرستنده
                    </small>{" "}
                    <span className="text-xs "> ON : {items?.id}</span>
                    <div className="flex items-center gap-1">
                      <small className="!text-[10px] font-bold">
                        شرکت ارسال کننده :‌
                      </small>
                      <div className="d-inline-block !text-[10px]">
                        {items.shippingCompanyTitle}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="d-inline-block !leading-[18px] text-xs">
                      {seller.address}
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-1">
                      <small className="!text-[10px]"> کد پستی: </small>
                      <small className="d-inline-block !text-[10px]">
                        {seller.postalCode}
                      </small>
                    </div>
                    <div className="flex items-center gap-1">
                      <small className="!text-[10px]">تلفن :‌</small>
                      <small className="d-inline-block !text-[10px]">
                        {seller.tel}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="">
              <div className="border border-black flex-1 w-full rounded-md p-4 flex flex-col gap-4">
                <b className="!text-[10px] font-semibold ">
                  مشخصات تحویل گیرنده
                </b>
                <div className="flex justify-between w-full gap-2 items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">نام و خانوادگی گیرنده:‌</span>
                    <p className="d-inline-block text-xs">
                      {items?.sendAddress?.receptorFname} {"  "}
                      {items?.sendAddress?.receptorLname}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs"> کد ملی: </span>
                    <p className="d-inline-block text-xs">
                      {items?.sendAddress?.receptorNationalCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {items.shippingCompanyType !== 1 ? (
                    <p className="d-inline-block !leading-[16px] leading-8 h-[40px] !text-[11px]">
                      {items?.sendAddress?.province} ,{"    "}
                      {items?.sendAddress?.city}, {"    "} {"    "}{" "}
                      {items?.sendAddress?.address} {"    "}, {"   "} پلاک
                      {"    "} {items?.sendAddress?.plaque}
                      {"    "}, {"   "} طبقه
                      {"    "} {items?.sendAddress?.floorNo}
                      {"    "}, {"   "} واحد
                      {"    "} {items?.sendAddress?.unit}
                    </p>
                  ) : (
                    <p className="d-inline-block !text-[11px]">
                      {items?.shippingCompanyAddress}
                    </p>
                  )}
                </div>
                <div className="flex justify-between w-full gap-2 items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">کد پستی :‌</span>
                    <p className="d-inline-block text-xs">
                      {items?.sendAddress?.postalCode}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">تلفن :‌</span>
                    <p className="d-inline-block text-xs">
                      {items?.sendAddress?.receptorMobile}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default OrderLabelContext;
