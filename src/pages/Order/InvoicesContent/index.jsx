import { Button } from "@mui/material";
import * as React from "react";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { baseUrl, DOWNLOAD_FILE } from "../../../helpers/api-routes";
import Num2persian from "../../../helpers/numbric";

export const InvoicesContent = ({ invoices, name }) => {
  const { order, seller, detail, buyer } = invoices;
  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);
  const user = { noCheck: false };
  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState("old boring text");
  const { companyInfo } = useSelector((state) => state.relationals);

  const handleAfterPrint = React.useCallback(() => {}, []);

  const handleBeforePrint = React.useCallback(() => {}, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    setLoading(true);
    setText("Loading new text...");

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        setText("New, Updated Text!");
        resolve();
      }, 2000);
    });
  }, [setLoading, setText]);

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
    // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
    // to the root node of the returned component as it will be overwritten.

    // Bad: the `onClick` here will be overwritten by `react-to-print`
    // return <button onClick={() => alert('This will not work')}>Print this out!</button>;

    // Good
    return (
      <Button
        sx={{ position: "absolute", top: "30px", right: "30%", zIndex: 999999 }}
        variant="contained"
        color="info"
      >
        چاپ فاکتور
      </Button>
    ); // eslint-disable-line max-len
  }, []);

  return (
    <div>
      <ReactToPrint
        content={reactToPrintContent}
        documentTitle={name || "AwesomeFileName"}
        onAfterPrint={handleAfterPrint}
        onBeforeGetContent={handleOnBeforeGetContent}
        onBeforePrint={handleBeforePrint}
        removeAfterPrint
        trigger={reactToPrintTrigger}
      />
      <div ref={componentRef}>
        <div className="invoicePage">
          <style type="text/css" media="print">
            {
              "\
   @page { size: h4; direction: rtl }\
"
            }
          </style>
          <div
            id="printContent"
            style={{ direction: "rtl" }}
            className="container max-w-6xl A4 min-h-[93vh] my-6 pt-6 border-print bg-white "
          >
            <div className="grid relative grid-cols-4 gap-4">
              <div className=" mb-2 relative">
                <div className="w-90PX">
                  <img
                    src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}`}
                    loading="lazy"
                    className="img-fluid w-28"
                  />
                </div>

                {user?.noCheck && (
                  <div className="text-xs  absolute -bottom-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs "> صادر شده از نماینده فروش</div>
                      <div className="text-xs mr-6">
                        تلفن : {buyer?.tel || buyer?.mobile}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-span-2">
                {" "}
                {order.type === 1 ? (
                  <h1 className="text-center text-base font-bold">
                    پیش فاکتور فروش کالا و خدمات تسهیلاتی
                  </h1>
                ) : (
                  <h1 className="text-center text-base font-bold">
                    {" "}
                    فاکتور فروش کالا و خدمات{" "}
                    {user?.noCheck && <>به صورت حضوری </>}
                  </h1>
                )}
              </div>
              <div className="absolute left-52 -top-3">
                {" "}
                {Number(order?.stateId) === 1 ||
                Number(order?.stateId) === 2 ||
                Number(order?.stateId) === 3 ||
                Number(order?.stateId) === 4 ? (
                  <>
                    <img
                      src="/assets/images/public/paid_status.svg"
                      alt=""
                      className="max-w-[90px] "
                    />
                  </>
                ) : Number(order?.stateId) === 0 ? (
                  <>
                    {" "}
                    <img
                      src="/assets/images/public/unpaid_status.svg"
                      alt=""
                      className="max-w-[90px] "
                    />
                  </>
                ) : (
                  <>
                    <img
                      src="/assets/images/public/cancle_status copy.svg"
                      alt=""
                      className="max-w-[90px] "
                    />
                  </>
                )}
              </div>
              <div className="flex gap-2 items-center relative justify-end">
                <div className="flex flex-col-reverse gap-3 items-end ">
                  <div className="text-left flex items-center justify-end  gap-3 text-[11px] font-bold">
                    زمان ثبت
                    {order?.dateTime && (
                      <div className="flex items-center gap-2">
                        {" "}
                        <div className="flex">
                          <div>
                            {String(
                              new Date(order?.dateTime).getMinutes()
                            ).padStart(2, "0")}
                            :
                          </div>
                          <div>
                            {String(
                              new Date(order?.dateTime).getHours()
                            ).padStart(2, "0")}
                          </div>
                        </div>
                        <span className="text-base font-bold">
                          {new Date(order?.dateTime).toLocaleDateString(
                            "fa-IR"
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-left flex items-center justify-between  text-xs gap-3 font-bold">
                    شماره فاکتور
                    <span>{order?.id}</span>
                  </div>{" "}
                </div>{" "}
                <div className="w-[60px]">
                  <QRCode
                    size={200}
                    style={{
                      height: "100%",
                      maxWidth: "100%",
                      width: "100%",
                    }}
                    value={`${process.env.NEXT_PUBLIC_ADMIN_URL}order/${String(
                      order.id
                    )}`}
                    viewBox={`0 0 256 256`}
                  />
                </div>
              </div>
            </div>

            <div className="gap-4 mt-10 mb-1 pt-6 ">
              <div className="border-print bg-[#eaeaea] ">
                <h2 className="text-center font-extrabold">مشخصات فروشنده</h2>
              </div>
              <div className="grid grid-cols-2 mt-2 w-full items-center">
                <div className="text-sm">
                  نام شخص حقیقی/حقوقی:
                  <span className="text-sm mx-2"> {seller.name} </span>
                </div>
                {/*  <div className="text-sm text-center">
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
                  {user?.noCheck ? (
                    <span className="text-sm mx-2">
                      {" "}
                      {order?.sendAddress?.receptorFname}{" "}
                      {order?.sendAddress?.receptorLname}
                    </span>
                  ) : (
                    <span className="text-sm mx-2">
                      {buyer?.fName} {buyer?.lName}
                    </span>
                  )}
                </div>
                {/*        <div className="text-sm text-center">
                  نوع شخص:
                  <span className="text-sm mx-2">
                    {buyer?.isLegal && !user?.noCheck ? "حقوقی" : "حقیقی"}
                  </span>
                </div>
 */}{" "}
                <div className="text-sm text-center">
                  نام سازمان/شرکت :‌
                  <span className="text-sm mx-2">
                    <>{buyer?.companyName}</>
                  </span>
                </div>
                <div className="text-sm text-end">
                  کد ملی / اقتصادی
                  <span className="text-sm mx-2">
                    {user?.noCheck ? (
                      <>{order?.sendAddress?.receptorNationalCode}</>
                    ) : (
                      <>
                        {" "}
                        {buyer?.isLegal
                          ? buyer?.economicCode
                          : buyer?.nationalCode}
                      </>
                    )}
                  </span>{" "}
                </div>
              </div>
              {user?.noCheck ? (
                <>
                  <div className="border-print bg-[#eaeaea]  mt-3">
                    <h2 className="text-center font-extrabold">مشخصات ارسال</h2>
                  </div>
                  <div className="grid grid-cols-3 w-full items-end mt-2">
                    <div className="text-sm">
                      استان:
                      <span className="text-sm mx-2">
                        {order?.sendAddress?.province}
                      </span>
                    </div>
                    <div className="text-sm text-center">
                      شهر:
                      <span className="text-sm mx-2">
                        {order?.sendAddress?.city}
                      </span>
                    </div>
                    <div className="text-sm text-end">
                      کد پستی:
                      <span className="text-sm mx-2">
                        {order?.sendAddress?.postalCode}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 mt-2  ">
                    <div className="col-span-6 w-full text-sm flex">
                      نشانی:
                      <div className="flex text-sm mx-2 gap-5">
                        {"    "} {order?.sendAddress?.address} {"    "}, {"   "}{" "}
                        پلاک
                        {"    "} {order?.sendAddress?.plaque}
                        {"    "}, {"   "} طبقه
                        {"    "} {order?.sendAddress?.floorNo}
                        {"    "}, {"   "} واحد
                        {"    "} {order?.sendAddress?.unit}
                      </div>
                    </div>
                    <div className="text-sm text-left">
                      موبایل:
                      <span className="text-sm mx-2">
                        {order?.sendAddress?.receptorMobile}
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
                        {buyer?.isLegal ? buyer.regNumber : "-"}
                      </span>
                    </div>
                    <div className="text-sm text-center">
                      موبایل:
                      <span className="text-sm mx-2">{buyer?.mobile}</span>
                    </div>
                    <div className="text-sm text-left">
                      تلفن:
                      <span className="text-sm mx-2">{buyer?.tel}</span>
                    </div>
                  </div>{" "}
                  <div className="border-print bg-[#eaeaea]  mt-3">
                    <h2 className="text-center font-extrabold">مشخصات ارسال</h2>
                  </div>
                  <div className="grid grid-cols-3 w-full items-end mt-2">
                    <div className="text-sm">
                      استان:
                      <span className="text-sm mx-2">
                        {order?.sendAddress?.province}
                      </span>
                    </div>
                    <div className="text-sm text-center">
                      شهر:
                      <span className="text-sm mx-2">
                        {order?.sendAddress?.city}
                      </span>
                    </div>
                    <div className="text-sm text-end">
                      کد پستی:
                      <span className="text-sm mx-2">
                        {order?.sendAddress?.postalCode}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-7">
                    <div className="mt-2  col-span-6 w-full text-sm flex">
                      نشانی:
                      <div className="flex text-sm mx-2 gap-5">
                        {"    "} {order?.sendAddress?.address} {"    "}, {"   "}{" "}
                        پلاک
                        {"    "} {order?.sendAddress?.plaque}
                        {"    "}, {"   "} طبقه
                        {"    "} {order?.sendAddress?.floorNo}
                        {"    "}, {"   "} واحد
                        {"    "} {order?.sendAddress?.unit}
                      </div>
                    </div>
                    <div className="text-sm text-left mt-2">
                      شماره باربری:
                      <span className="text-sm mx-2">{order.waybill}</span>
                    </div>
                  </div>
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
                          جمع ارزش افزوده
                        </th>
                        <th className=" border border-black ">خالص فاکتور </th>

                        {/*              <th>مالیات و عوارض</th>
                      <th>جمع مبلغ کل بعلاوه مالیات و عوارض</th> */}
                      </tr>
                    </thead>

                    <tbody>
                      {detail?.map((item, index) => (
                        <tr className="" key={index}>
                          <td className="border border-black text-xs py-1 text-center">
                            {index + 1}
                          </td>
                          <td className="border border-black text-xs py-1 text-center">
                            {item.productProperty?.code}
                          </td>
                          <td
                            colSpan={3}
                            className="text-center border border-black text-xs py-1"
                          >
                            {item.productProperty?.title} /
                            {item.productProperty?.arrtib1?.title}
                            {item.productProperty?.arrtib2?.title && (
                              <> / {item.productProperty?.arrtib2?.title} </>
                            )}{" "}
                            {item.productProperty?.description && (
                              <>/{item.productProperty?.description}</>
                            )}{" "}
                            {item?.isFake ? "(غیر اصل)" : ""}
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
                            {item.final}
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
                          {order.discount?.toLocaleString("en-US")}
                        </td>
                        <td className="border border-black  text-xs text-center py-1">
                          {order.total?.toLocaleString("en-US")}
                        </td>
                        <td className="border border-black  text-xs text-center py-1">
                          {order.totalVat?.toLocaleString("en-US")}
                        </td>
                        <td className="border border-black  text-xs text-center py-1">
                          {order.final?.toLocaleString("en-US")}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="w-full border border-black justify-between border-t-0 h-8 flex px-2 items-center gap-4">
                    <div className="flex gap-3 items-center">
                      <span className="text-xs">جمع کل به حروف : </span>
                      <span className="text-xs">
                        {Num2persian(order.final)} ریال
                      </span>
                    </div>
                    {order.type === 1 ? (
                      <div className="flex justify-end gap-3 items-center">
                        {order.facilityDeference ? (
                          <div className="flex gap-1 items-center">
                            <span className="text-xs">مابه التفاوت نقدی: </span>
                            <td className="  text-xs ">
                              {order.facilityDeference?.toLocaleString("en-US")}
                              ریال
                            </td>
                          </div>
                        ) : (
                          <></>
                        )}
                        <div className="flex gap-1 items-center">
                          <span className="text-xs">پیش پرداخت: </span>
                          <td className=" text-xs ">
                            {order.prePayment?.toLocaleString("en-US")}ریال
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
                        {new Date(order?.shippingDate).toLocaleDateString(
                          "fa-IR"
                        )}{" "}
                      </span>
                      {order.shippingFromDate && order.shippingToDate && (
                        <div className="flex text-xs gap-1 items-center text-[#141414] mx-2 ">
                          ساعت :‌
                          <span>
                            {new Date(order.shippingFromDate).getHours()}
                          </span>
                          <span>تا</span>
                          <span>
                            {new Date(order.shippingToDate).getHours()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs">درگاه پرداخت : </span>
                      <span className="text-xs"> {order.gateway} </span>
                    </div>{" "}
                    <div className="flex items-center">
                      <span className="text-xs">شماره تراکنش : </span>
                      <span className="text-xs">{order.referenceNumber}</span>
                    </div>
                    {order.totalWallet !== 0 && (
                      <div className="flex items-center">
                        <span className="text-xs">
                          {" "}
                          مبلغ پرداخت شده با کیف پول :{" "}
                        </span>
                        <span className="text-xs">
                          {" "}
                          {order.totalWallet?.toLocaleString("en-US")} ریال
                        </span>
                      </div>
                    )}
                    {order.totalBank !== 0 && (
                      <div className="flex items-center">
                        <span className="text-xs">
                          {" "}
                          مبلغ پرداخت شده با درگاه پرداخت :{" "}
                        </span>
                        <span className="text-xs">
                          {" "}
                          {order.totalBank?.toLocaleString("en-US")} ریال
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="w-full border border-black border-t-0 h-8 flex px-2 items-center gap-4 justify-between">
                    <div className="flex  items-center gap-4 ">
                      {" "}
                      <span className="text-xs">توضیحات : </span>
                      <span className="text-xs"> {order.description} </span>
                    </div>
                    <div className="flex  items-center gap-4 ">
                      {" "}
                      <span className="text-xs">روش تخفیف : </span>
                      <span className="text-xs">
                        {" "}
                        {order.planDiscount ? "کد تخفیف" : ""}{" "}
                      </span>
                    </div>
                  </div>
                  <div className="w-full border border-black border-t-0 h-18 grid grid-cols-4 px-2 items-center justify-between gap-4 ">
                    <div className="flex items-center justify-center flex-col gap-3 py-2 border-l border-black">
                      <span className="text-sm font-bold">
                        مهر و امضا فروشنده
                      </span>
                      <img
                        className="img-fluid w-24"
                        src={`${baseUrl}/${DOWNLOAD_FILE}/${seller.seal}`}
                      />
                    </div>
                    <div className="flex items-center justify-center flex-col gap-3 py-2 border-l border-black h-full">
                      {" "}
                      <span className="text-sm font-bold">
                        مهر و امضا خریدار
                      </span>
                    </div>
                    <div className="grid grid-cols-3 w-full col-span-2">
                      <div className="col-span-3 mb-3">
                        <div className="text-sm font-bold">
                          مشخصات تحویل گیرنده
                        </div>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        نام شخص :
                        <span className="text-sm mx-2">
                          {order?.sendAddress?.receptorFname} {"  "}
                          {order?.sendAddress?.receptorLname}
                        </span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        شماره موبایل :
                        <span className="text-sm mx-2">
                          {order?.sendAddress?.receptorMobile}
                        </span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        کد ملی :
                        <span className="text-sm mx-2">
                          {order?.sendAddress?.receptorNationalCode}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InvoicesContent;
