/* eslint-disable jsx-a11y/alt-text */
import { Button } from "@mui/material";
import * as React from "react";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { baseUrl, DOWNLOAD_FILE } from "../../helpers/api-routes";
import Num2persian from "../../helpers/numbric";

export const InvoicesContent = ({ orders, seller, names }) => {
  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);
  const { companyInfo } = useSelector((state) => state.relationals);

  const [text, setText] = React.useState("old boring text");

  const handleAfterPrint = React.useCallback(() => {}, []);

  const handleBeforePrint = React.useCallback(() => {}, []);

  const handleOnBeforeGetContent = React.useCallback(() => {}, [setText]);

  React.useEffect(() => {
    if (
      text === "New, Updated Text!" &&
      typeof onBeforeGetContentResolve.current === "function"
    ) {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);
  const reactToPrintTrigger = React.useCallback(() => {
    return (
      <Button
        sx={{
          position: "absolute",
          top: "30px",
          left: "30%",
          zIndex: 99999999,
        }}
        variant="contained"
        color="info"
      >
        چاپ فاکتور
      </Button>
    );
  }, []);

  return (
    <>
      <ReactToPrint
        content={reactToPrintContent}
        documentTitle={names ? names : "AwesomeFileName"}
        onAfterPrint={handleAfterPrint}
        onBeforeGetContent={handleOnBeforeGetContent}
        onBeforePrint={handleBeforePrint}
        removeAfterPrint
        trigger={reactToPrintTrigger}
      />
      <div ref={componentRef}>
        {orders?.map((items, index) => (
          <div
            style={{ pageBreakAfter: "always" }}
            className="invoicePage"
            key={index}
          >
            <style type="text/css" media="print">
              {
                "\
          @page {size: A4 landscape; }\
"
              }
            </style>
            <div
              id="printContent"
              className="md:container md:max-w-6xl A4  my-6 py-6 border-print bg-white "
            >
              <div className="grid grid-cols-4 gap-4 relative">
                <div className=" mb-2 relative">
                  <div className="w-90PX">
                    {items.mode === 1 ? (
                      <></>
                    ) : (
                      <img
                        src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}`}
                        loading="lazy"
                        className="img-fluid w-28"
                      />
                    )}
                  </div>
                  {items?.isSeller && (
                    <div className="text-xs  absolute -bottom-2">
                      <div className="flex items-center justify-between">
                        <div className="text-xs ">
                          {" "}
                          صادر شده از نماینده فروش
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-span-2">
                  {items.type === 1 ? (
                    <h1 className="text-center text-base font-bold">
                      پیش فاکتور فروش کالا و خدمات تسهیلاتی
                    </h1>
                  ) : (
                    <h1 className="text-center text-base font-bold">
                      فاکتور فروش کالا و خدمات{" "}
                      {items?.isSeller && <>به صورت حضوری </>}{" "}
                    </h1>
                  )}
                </div>
                <div className="absolute flex gap-3 items-center left-64 -top-4">
                  {" "}
                  {Number(items?.stateId) === 1 ||
                  Number(items?.stateId) === 2 ||
                  Number(items?.stateId) === 3 ||
                  Number(items?.stateId) === 4 ||
                  Number(items?.stateId) === 13 ||
                  Number(items?.stateId) === 8 ? (
                    <>
                      <img
                        src="/images/paid_status.svg"
                        alt=""
                        className="w-[90px] "
                      />
                    </>
                  ) : Number(items?.stateId) === 0 ||
                    Number(items?.stateId) === 9 ||
                    Number(items?.stateId) === 10 ||
                    Number(items?.stateId) === 11 ||
                    Number(items?.stateId) === 12 ||
                    Number(items?.stateId) === 7 ? (
                    <>
                      {" "}
                      <img
                        src="/images/unpaid_status.svg"
                        alt=""
                        className="w-[90px] "
                      />
                    </>
                  ) : (
                    <>
                      <img
                        src="/images/cancle_status copy.svg"
                        alt=""
                        className="w-[90px] "
                      />
                    </>
                  )}{" "}
                </div>
                <div className="flex flex-col-reverse gap-3 items-end ml-[80px]">
                  <div className="text-left flex items-center justify-end w-52 gap-3 text-[11px] font-bold">
                    زمان ثبت
                    {items?.dateTime && (
                      <div className="flex items-center gap-2">
                        {" "}
                        <div className="flex">
                          <div>
                            {String(
                              new Date(items?.dateTime).getMinutes()
                            ).padStart(2, "0")}
                            :
                          </div>
                          <div>
                            {String(
                              new Date(items?.dateTime).getHours()
                            ).padStart(2, "0")}
                          </div>
                        </div>
                        <span className="text-base font-bold">
                          {new Date(items?.dateTime).toLocaleDateString(
                            "fa-IR"
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-left flex items-center justify-between w-48  text-base font-bold">
                    شماره سفارش
                    <span>{items.id}</span>
                  </div>
                </div>
                <div className="absolute -top-4 left-1">
                  <QRCode
                    size={50}
                    style={{
                      height: "auto",
                      maxWidth: "70px",
                      width: "70px",
                    }}
                    value={`${process.env.REACT_APP_LABEL_URL}/order/${String(
                      items.id
                    )}`}
                    viewBox={`0 0 256 256`}
                  />
                </div>
              </div>

              <div className="gap-4 mt-10 mb-1 pt-6 ">
                <div className="border-print bg-[#eaeaea] relative">
                  <h2 className="text-center font-extrabold">مشخصات فروشنده</h2>
                </div>
                <div className="grid grid-cols-2 mt-2 w-full items-center">
                  <div className="text-sm">
                    نام شخص حقیقی/حقوقی:
                    <span className="text-sm mx-2"> {seller.name} </span>
                  </div>
                  {/*      <div className="text-sm text-center">
                    شناسه ملی:
                    <span className="text-sm mx-2"> {seller.nationalId} </span>
                  </div> */}
                  <div className="text-sm text-left">
                    کد اقتصادی:
                    <span className="text-sm mx-2">{seller.economicCode}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 mt-2 w-full items-center">
                  <div className="text-sm">
                    شماره ثبت:
                    <span className="text-sm mx-2">{seller.regNumber}</span>
                  </div>

                  <div className="text-sm text-center">
                    تلفن:
                    <span className="text-sm mx-2">{seller.tel}</span>
                  </div>

                  <div className="text-sm text-left">
                    شهر:
                    <span className="text-sm mx-2">{seller.city}</span>
                  </div>
                </div>
                <div className="flex justify-between mt-2 w-full items-center">
                  <div className="flex text-sm gap-2">
                    نشانی:
                    <p className="d-inline-block text-sm mx-2">
                      {seller.address}
                    </p>
                  </div>
                  <div className="text-sm">
                    کد پستی:
                    <span className="text-sm mx-2">{seller.postalCode}</span>
                  </div>
                </div>
                <div className="border-print bg-[#eaeaea]  mt-3">
                  <h2 className="text-center font-extrabold">مشخصات خریدار</h2>
                </div>
                <div className="grid grid-cols-3 w-full items-end mt-2">
                  <div className="text-sm">
                    نام شخص حقیقی/حقوقی:
                    {items.buyer?.isLegal ? (
                      ""
                    ) : (
                      <>
                        {" "}
                        {items?.isSeller ? (
                          <span className="text-sm mx-2">
                            {" "}
                            {items?.sendAddress?.receptorFname}{" "}
                            {items?.sendAddress?.receptorLname}
                          </span>
                        ) : (
                          <span className="text-sm mx-2">
                            {items?.buyer?.fName} {items?.buyer?.lName}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {/*     <div className="text-sm text-center">
                    نوع شخص:
                    <span className="text-sm mx-2">
                      {items.buyer?.isLegal ? "حقوقی" : "حقیقی"}
                    </span>
                  </div>
 */}{" "}
                  <div className="text-sm text-center">
                    نام سازمان/شرکت :‌
                    <span className="text-sm mx-2">
                      <>{items?.buyer?.companyName}</>
                    </span>
                  </div>
                  <div className="text-sm text-end flex justify-end">
                    <div className="text-sm text-end">کد ملی / اقتصادی : </div>
                    <span className="text-sm mx-2">
                      {items?.isSeller ? (
                        <>{items?.sendAddress?.receptorNationalCode}</>
                      ) : (
                        <>
                          {items.buyer?.isLegal
                            ? items.buyer?.economicCode
                            : items.buyer?.nationalCode}
                        </>
                      )}
                    </span>{" "}
                  </div>
                </div>
                {items?.isSeller ? (
                  <>
                    <div className="border-print bg-[#eaeaea]  mt-3">
                      <h2 className="text-center font-extrabold">
                        مشخصات ارسال
                      </h2>
                    </div>
                    <div className="grid grid-cols-3 w-full items-end mt-2">
                      <div className="text-sm">
                        استان:
                        <span className="text-sm mx-2">
                          {items?.sendAddress?.province}
                        </span>
                      </div>
                      <div className="text-sm text-center">
                        شهر:
                        <span className="text-sm mx-2">
                          {items?.sendAddress?.city}
                        </span>
                      </div>
                      <div className="text-sm text-end">
                        کد پستی:
                        <span className="text-sm mx-2">
                          {items?.sendAddress?.postalCode}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 mt-2  ">
                      <div className="col-span-6 w-full text-sm flex">
                        نشانی:
                        <div className="flex text-sm mx-2 gap-5">
                          {"    "} {items?.sendAddress?.address} {"    "},{" "}
                          {"   "} پلاک
                          {"    "} {items?.sendAddress?.plaque}
                          {"    "}, {"   "} طبقه
                          {"    "} {items?.sendAddress?.floorNo}
                          {"    "}, {"   "} واحد
                          {"    "} {items?.sendAddress?.unit}
                        </div>
                      </div>
                      <div className="text-sm text-left">
                        موبایل:
                        <span className="text-sm mx-2">
                          {items?.sendAddress?.receptorMobile}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {" "}
                    <div className="grid grid-cols-3 w-full items-end mt-2">
                      <div className="text-sm">
                        شناسه ثبت:
                        <span className="text-sm  mx-2">
                          {items?.buyer?.isLegal ? items?.buyer.regNumber : "-"}
                        </span>
                      </div>
                      <div className="text-sm text-center">
                        موبایل:
                        <span className="text-sm mx-2">
                          {items?.buyer?.mobile}
                        </span>
                      </div>
                      <div className="text-sm text-left">
                        تلفن:
                        <span className="text-sm mx-2">
                          {items?.buyer?.tel}
                        </span>
                      </div>
                    </div>{" "}
                    {items.shippingCompanyType !== 1 && (
                      <>
                        {" "}
                        <div className="border-print bg-[#eaeaea]  mt-3">
                          <h2 className="text-center font-extrabold">
                            مشخصات ارسال
                          </h2>
                        </div>
                        <div className="grid grid-cols-3 w-full items-end mt-2">
                          <div className="text-sm">
                            استان:
                            <span className="text-sm mx-2">
                              {items?.sendAddress?.province}
                            </span>
                          </div>
                          <div className="text-sm text-center">
                            شهر:
                            <span className="text-sm mx-2">
                              {items?.sendAddress?.city}
                            </span>
                          </div>
                          <div className="text-sm text-end">
                            کد پستی:
                            <span className="text-sm mx-2">
                              {items?.sendAddress?.postalCode}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-7">
                          <div className="mt-2  col-span-6 w-full text-sm flex">
                            نشانی:
                            <div className="flex text-sm mx-2 gap-5">
                              {"    "} {items?.sendAddress?.address} {"    "},{" "}
                              {"   "} پلاک
                              {"    "} {items?.sendAddress?.plaque}
                              {"    "}, {"   "} طبقه
                              {"    "} {items?.sendAddress?.floorNo}
                              {"    "}, {"   "} واحد
                              {"    "} {items?.sendAddress?.unit}
                            </div>
                          </div>
                          <div className="text-sm text-left mt-2">
                            شماره باربری:
                            <span className="text-sm mx-2">
                              {items.waybill}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className=" mt-4 ">
                <div className="border-print bg-[#eaeaea]">
                  <h2 className="text-center font-extrabold">
                    مشخصات کالا / خدمات
                  </h2>
                </div>
              </div>
              <div className="grid" dir="rtl">
                <div className="mt-2">
                  <div>
                    <table className="table-fixed border-collapse border border-black  w-full">
                      <thead className="bg-[#d6d8d9]">
                        <tr className="text-center ">
                          <th className=" border border-black ">ردیف</th>
                          <th className=" border border-black ">کد کالا</th>
                          <th colSpan={3} className=" border border-black ">
                            شرح
                          </th>
                          <th className=" border border-black ">تعداد</th>
                          <th className=" border border-black ">مبلغ واحد</th>
                          <th className=" border border-black ">مبلغ کل</th>
                          <th className=" border border-black ">مبلغ تخفیف</th>

                          <th className=" border border-black ">
                            مبلغ کل پس از تخفیف
                          </th>
                          <th className=" border border-black ">
                            {" "}
                            جمع مالیات و عوارض
                          </th>
                          <th className=" border border-black ">
                            جمع مبلغ کل + عوارض
                          </th>

                          {/*              <th>مالیات و عوارض</th>
                      <th>جمع مبلغ کل بعلاوه مالیات و عوارض</th> */}
                        </tr>
                      </thead>

                      <tbody>
                        {items.details?.map((item, index) => (
                          <tr className="" key={index}>
                            <td className="border border-black text-xs py-1 text-center">
                              {index + 1}
                            </td>
                            <td className="border border-black text-xs py-1 text-center">
                              {items.mode === 1 ? (
                                <>{item.title}</>
                              ) : (
                                <>{item.productProperty?.code}</>
                              )}
                            </td>

                            <td
                              colSpan={3}
                              className="text-center border border-black text-xs py-1"
                            >
                              {items.mode === 1 ? (
                                <>{item.description}</>
                              ) : (
                                <>
                                  {" "}
                                  {item.productProperty?.title} /
                                  {item.productProperty?.arrtib1?.title}
                                  {item.productProperty?.arrtib2?.title && (
                                    <>
                                      {" "}
                                      / {
                                        item.productProperty?.arrtib2?.title
                                      }{" "}
                                    </>
                                  )}
                                  {item.productProperty?.description && (
                                    <>/{item.productProperty?.description}</>
                                  )}
                                  {item?.isFake ? "(غیر اصلی)" : ""}
                                </>
                              )}
                            </td>

                            <td className="text-center border border-black text-xs py-1 ">
                              {" "}
                              {item.qty}
                            </td>
                            <td className="text-center border border-black text-xs py-1 ">
                              {item.price.toLocaleString("en-US")}
                            </td>

                            <td className="text-center border border-black text-xs py-1 ">
                              {item.itemsPrice.toLocaleString("en-US")}
                            </td>
                            <td className="text-center border border-black text-xs py-1 ">
                              {item.discount.toLocaleString("en-US")}
                            </td>
                            <td className="text-center border border-black text-xs py-1 ">
                              {item.total.toLocaleString("en-US")}
                            </td>
                            <td className="text-center border border-black text-xs py-1 ">
                              {item.vat.toLocaleString("en-US")}
                            </td>

                            <td className="text-center border border-black text-xs py-1">
                              {item.final?.toLocaleString("en-US")}
                            </td>
                          </tr>
                        ))}

                        <tr className="bg-[#d6d8d9]">
                          <td className=" text-xs text-center border  border-black  border-r-0 border-l-0 ">
                            {}
                          </td>
                          <td className=" text-xs text-center py-1  border  border-black  border-r-0 border-l-0">
                            {}
                          </td>
                          <td className=" text-xs text-center py-1 font-bold border  border-black  border-r-0 border-l-0">
                            جمع کل{" "}
                          </td>
                          <td className=" text-xs text-center py-1 border  border-black  border-r-0 border-l-0">
                            {}
                          </td>
                          <td className=" text-xs text-center py-1 border  border-black  border-r-0 border-l-0">
                            {}
                          </td>{" "}
                          <td className=" text-xs text-center py-1 border  border-black  border-r-0 border-l-0">
                            {}
                          </td>
                          <td className=" text-xs text-center py-1 border  border-black  border-r-0 border-l-0">
                            {}
                          </td>
                          <td className="border border-black  border-r-0 border-l-0 text-xs text-center py-1"></td>
                          <td className="border border-black  text-xs text-center py-1">
                            {items.discount.toLocaleString("en-US")}
                          </td>
                          <td className="border border-black  text-xs text-center py-1">
                            {items.total.toLocaleString("en-US")}
                          </td>
                          <td className="border border-black  text-xs text-center py-1">
                            {items.totalVat.toLocaleString("en-US")}
                          </td>
                          <td className="border border-black  text-xs text-center py-1">
                            {items.final.toLocaleString("en-US")}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="w-full border border-black justify-between border-t-0 h-8 flex px-2 items-center gap-4">
                      <div className="flex gap-3 items-center">
                        <span className="text-xs">جمع کل به حروف : </span>
                        <span className="text-xs">
                          {Num2persian(
                            items.type === 1 ? items.total : items.final
                          )}{" "}
                          ریال
                        </span>
                      </div>
                      {items.type === 1 ? (
                        <div className="flex justify-end gap-3 items-center">
                          {items.facilityDeference ? (
                            <div className="flex gap-1 items-center">
                              <span className="text-xs">مابه التفاوت: </span>
                              <td className="  text-xs ">
                                {items.facilityDeference?.toLocaleString(
                                  "en-US"
                                )}
                                ریال
                              </td>
                            </div>
                          ) : (
                            <></>
                          )}
                          <div className="flex gap-1 items-center">
                            <span className="text-xs">پیش پرداخت: </span>
                            <td className=" text-xs ">
                              {items.prePayment?.toLocaleString("en-US")}ریال
                            </td>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className="w-full border border-black border-t-0 h-8 flex  justify-between px-2 items-center ">
                      <div className="flex items-center">
                        <span className="text-xs">زمان ارسال : </span>
                        <span className="text-xs">
                          {new Date(items?.shippingDate).toLocaleDateString(
                            "fa-IR"
                          )}{" "}
                        </span>{" "}
                        {items.fromDate && items.toDate && (
                          <div className="flex text-xs gap-1 items-center text-[#141414] mx-2 ">
                            ساعت :‌
                            <span>{new Date(items.fromDate).getHours()}</span>
                            <span>تا</span>
                            <span>{new Date(items.toDate).getHours()}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <b className="text-[10px]">درگاه پرداخت : </b>
                        <b className="text-[10px]"> {items.gateway} </b>
                      </div>{" "}
                      <div className="flex items-center">
                        <b className="text-[10px]">شماره تراکنش : </b>
                        <b className="text-[10px]">{items.referenceNumber}</b>
                      </div>
                      {items.totalWallet !== 0 && (
                        <div className="flex items-center">
                          <b className="text-[10px]">
                            {" "}
                            مبلغ پرداخت شده با کیف پول :{" "}
                          </b>
                          <b className="text-[10px]">
                            {" "}
                            {items.totalWallet?.toLocaleString("en-US")} ریال
                          </b>
                        </div>
                      )}
                      {items.totalBank !== 0 && (
                        <div className="flex items-center">
                          <b className="text-[10px]">
                            {" "}
                            مبلغ پرداخت شده با درگاه پرداخت :{" "}
                          </b>
                          <b className="text-[10px]">
                            {" "}
                            {items.totalBank?.toLocaleString("en-US")} ریال
                          </b>
                        </div>
                      )}
                    </div>
                    <div className="w-full border border-black border-t-0 h-8  px-2 items-center gap-4 flex justify-between">
                      <div className="flex gap-4 items-center col-span-3">
                        <span className="text-xs">توضیحات : </span>
                        <span className="text-xs"> {items.description} </span>
                      </div>
                      {items.shippingCompanyType == 1 && (
                        <>
                          <div className="flex gap-4 items-center col-span-3">
                            <span className="text-xs">شرکت حمل و نقل : </span>
                            <span className="text-xs">
                              {" "}
                              {items.shippingCompanyTitle}{" "}
                            </span>
                          </div>
                        </>
                      )}
                      <div className="flex gap-4 items-center ">
                        <span className="text-xs">روش تخفیف : </span>
                        <span className="text-xs">
                          {" "}
                          {items.planDiscount ? "کد تخفیف" : ""}{" "}
                        </span>
                      </div>
                    </div>
                    <div className="w-full  border border-black border-t-0 h-18 grid grid-cols-4 px-2 items-center justify-between gap-4 ">
                      <div
                        style={{ padding: items.mode === 1 ? "20px 0px" : "" }}
                        className="flex items-center justify-center flex-col gap-3 py-2 border-l border-black"
                      >
                        <span className="text-sm font-bold">
                          مهر و امضا فروشنده
                        </span>
                        {items.mode === 1 ? (
                          <></>
                        ) : (
                          <img
                            src={`${baseUrl}/${DOWNLOAD_FILE}/${seller?.seal}`}
                            alt="companySeal"
                            className="img-fluid w-24"
                          />
                        )}
                      </div>
                      <div className="flex items-center justify-center flex-col gap-3 py-2 border-l border-black h-full">
                        {" "}
                        <span className="text-sm font-bold">
                          مهر و امضا خریدار
                        </span>
                      </div>
                      {items?.baileeAgent ? (
                        <div className="grid grid-cols-3 w-full col-span-2">
                          <div className="col-span-3 mb-3 flex gap-8">
                            <div className="text-sm font-bold">
                              مشخصات نماینده تحویل گیرنده
                            </div>{" "}
                            {items.referralDetail?.referralCode && (
                              <>
                                <div className="text-xs  font-extrabold">
                                  کد معرف :‌{" "}
                                  {items.referralDetail?.referralCode}
                                </div>{" "}
                                <div className="text-xs  font-extrabold">
                                  مسئول فروش :{items.salerName}
                                </div>
                              </>
                            )}
                          </div>
                          <div className="flex items-center  col-span-3">
                            <span>
                              اینجانب{" "}
                              {items.baileeAgent?.firstName +
                                " " +
                                items.baileeAgent?.lastName}{" "}
                              به کد ملی {items.baileeAgent?.nationalCode} و
                              شماره موبایل {items.baileeAgent?.mobileNumber}{" "}
                              کالا را تحویل گرفتم
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 w-full col-span-2">
                          <div className="col-span-3 mb-3 flex gap-8">
                            <div className="text-sm font-bold">
                              مشخصات تحویل گیرنده
                            </div>
                            {items.referralDetail?.referralCode && (
                              <>
                                <div className="text-xs  font-extrabold">
                                  کد معرف :‌{" "}
                                  {items.referralDetail?.referralCode}
                                </div>{" "}
                                <div className="text-xs  font-extrabold">
                                  مسئول فروش :{items.salerName}
                                </div>
                              </>
                            )}
                          </div>

                          <div className="flex items-center justify-between col-span-3">
                            {" "}
                            <div className="text-sm flex items-center gap-2">
                              نام گیرنده :
                              <span className="text-sm mx-2">
                                {items?.sendAddress?.receptorFname} {"  "}
                                {items?.sendAddress?.receptorLname}
                              </span>
                            </div>
                            <div className="text-sm flex items-center gap-2">
                              شماره موبایل :
                              <span className="text-sm mx-2">
                                {items?.sendAddress?.receptorMobile}
                              </span>
                            </div>
                            <div className="text-sm flex items-center gap-2">
                              کد ملی :
                              <span className="text-sm mx-2">
                                {items?.sendAddress?.receptorNationalCode}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
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
export default InvoicesContent;
