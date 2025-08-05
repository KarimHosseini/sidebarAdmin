import { Delete } from "@mui/icons-material";
import { Button } from "@mui/material";
import * as React from "react";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import Num2persian from "../../helpers/numbric";
const PreCreateInvoice = ({
  user,
  selectedAddress,
  sendeddeliverTime,
  data,
  setData,
  selectedaddressAgent,
  userInfo,
  error,
  setError,
  userBuyMax,
}) => {
  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);
  const [rows, setRows] = React.useState(1);
  const [text, setText] = React.useState("old boring text");
  const [totals, setTotals] = React.useState({
    discount: 0,
    total: 0,
    totalVat: 0,
    final: 0,
  });
  const handleAfterPrint = React.useCallback(() => {}, []);
  const { companyInfo } = useSelector((state) => state.relationals);
  const handleBeforePrint = React.useCallback(() => {}, []);

  const handleOnBeforeGetContent = React.useCallback(() => {}, [setText]);
  const handleData = (name, value, index) => {
    const temp = [...data.productProperty];
    const price = name === "price" ? Number(value) : temp[index]?.price;
    const qty = name === "qty" ? Number(value) : temp[index]?.qty;
    const discount =
      name === "discount" ? Number(value) : temp[index]?.discount;
    const basePrice = Number((price || 0) * (qty || 0));
    const totalPrice = Number((basePrice || 0) - (discount || 0));
    const vat = companyInfo.invoiceNinePercentDiscount
      ? Number(((totalPrice || 0) * 23) / 100).toFixed(0)
      : 0;

    const finalPrice = Number((totalPrice || 0) + Number(vat || 0));
    temp[index] = {
      ...temp[index],
      [name]: value,
      basePrice: basePrice,
      discount: Number(discount || 0),
      totalPrice: totalPrice,
      vat: Number(vat),
      finalPrice: finalPrice,
    };
    setError({ ...error, [index]: { ...error[index], [name]: false } });
    setData({ ...data, productProperty: temp });
  };
  React.useEffect(() => {
    setTotals({
      discount: data.productProperty.reduce(
        (sum, item) => sum + (item.discount || 0),
        0
      ),
      total: data.productProperty.reduce(
        (sum, item) => sum + (item.totalPrice || 0),
        0
      ),
      totalVat: data.productProperty.reduce(
        (sum, item) => sum + Number(item.vat || 0),
        0
      ),
      final: data.productProperty.reduce(
        (sum, item) => sum + (item.finalPrice || 0),
        0
      ),
    });
    if (rows === 1) {
      if (data.productProperty.length > 0) setRows(data.productProperty.length);
    }
  }, [data.productProperty]);
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
  const handleAddRows = () => {
    setRows((r) => r + 1);
  };
  const handleDeleteRow = (i) => {
    let temp = [...data.productProperty];
    temp.splice(i, 1);
    setRows((r) => r - 1);
    setData({ ...data, productProperty: temp });
  };
  /*  const reactToPrintTrigger = React.useCallback(() => {
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
  }, []); */
  return (
    <div>
      {" "}
      <div className="overflow-x-auto  noArr flex justify-center ">
        {" "}
        <div className="w-[1200px] relative">
          <>
            <ReactToPrint
              content={reactToPrintContent}
              documentTitle={"AwesomeFileName"}
              onAfterPrint={handleAfterPrint}
              onBeforeGetContent={handleOnBeforeGetContent}
              onBeforePrint={handleBeforePrint}
              removeAfterPrint
              /*               trigger={reactToPrintTrigger}
               */
            />
            <div ref={componentRef}>
              <div style={{ pageBreakAfter: "always" }} className="invoicePage">
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
                      <div className="w-90PX"></div>
                    </div>
                    <div className="col-span-2">
                      <h1 className="text-center text-base font-bold">
                        پیش فاکتور نیابتی کالا و خدمات
                      </h1>
                    </div>
                    <div className="absolute flex gap-3 items-center left-64 -top-4"></div>
                    <div className="flex flex-col-reverse gap-3 items-end ml-[80px]">
                      <div className="text-left flex items-center justify-end w-52 gap-3 text-[11px] font-bold">
                        زمان ثبت
                        <div className="flex items-center gap-2">
                          {" "}
                          <div className="flex">
                            <div>
                              {String(new Date().getMinutes()).padStart(2, "0")}
                              :
                            </div>
                            <div>
                              {String(new Date().getHours()).padStart(2, "0")}
                            </div>
                          </div>
                          <span className="text-base font-bold">
                            {new Date().toLocaleDateString("fa-IR")}
                          </span>
                        </div>
                      </div>
                      {/*   <div className="text-left flex items-center justify-between w-48  text-base font-bold">
                        شماره سفارش
                        <span>{data.id}</span>
                      </div> */}
                    </div>
                    <div className="absolute -top-4 left-1">
                      {/*    <QRCode
                        size={50}
                        style={{
                          height: "auto",
                          maxWidth: "70px",
                          width: "70px",
                        }}
                        value={`${
                          process.env.REACT_APP_LABEL_URL
                        }/order/${String(data.id)}`}
                        viewBox={`0 0 256 256`}
                      /> */}
                    </div>
                  </div>

                  <div className="gap-4 mt-10 mb-1 pt-6 ">
                    <div className="border-print bg-[#eaeaea] ">
                      <h2 className="text-center font-extrabold">
                        مشخصات فروشنده
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 mt-2 w-full items-center">
                      <div className="text-sm">
                        نام شخص حقیقی/حقوقی:
                        <span className="text-sm mx-2">
                          {" "}
                          {userInfo.fname} {userInfo.lname}
                        </span>
                      </div>
                      {/*      <div className="text-sm text-center">
          شناسه ملی:
          <span className="text-sm mx-2"> {companyInfo.nationalId} </span>
        </div> */}
                      <div className="text-sm text-left">
                        کد اقتصادی:
                        <span className="text-sm mx-2">
                          {userInfo.economicCode}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 mt-2 w-full items-center">
                      <div className="text-sm">
                        شماره ثبت:
                        <span className="text-sm mx-2">
                          {userInfo.regNumber}
                        </span>
                      </div>

                      <div className="text-sm text-center">
                        تلفن:
                        <span className="text-sm mx-2">{userInfo.tel}</span>
                      </div>

                      <div className="text-sm text-left">
                        شهر:
                        <span className="text-sm mx-2">
                          {selectedaddressAgent.city}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 w-full items-center">
                      <div className="flex text-sm gap-2">
                        نشانی:
                        <div className="flex text-sm mx-2 gap-5">
                          {"    "} {selectedaddressAgent?.address} {"    "},{" "}
                          {"   "} پلاک
                          {"    "} {selectedaddressAgent?.plaque}
                          {"    "}, {"   "} طبقه
                          {"    "} {selectedaddressAgent?.floorNo}
                          {"    "}, {"   "} واحد
                          {"    "} {selectedaddressAgent?.unit}
                        </div>
                      </div>
                      <div className="text-sm">
                        کد پستی:
                        <span className="text-sm mx-2">
                          {selectedaddressAgent.postalCode}
                        </span>
                      </div>
                    </div>
                    <div className="border-print bg-[#eaeaea]  mt-3">
                      <h2 className="text-center font-extrabold">
                        مشخصات خریدار
                      </h2>
                    </div>
                    <div className="grid grid-cols-3 w-full items-end mt-2">
                      <div className="text-sm">
                        نام شخص حقیقی/حقوقی:
                        <span className="text-sm mx-2">
                          {user?.fname} {user?.lname}
                        </span>
                      </div>

                      <div className="text-sm text-center">
                        نام سازمان/شرکت :‌
                        <span className="text-sm mx-2">
                          <>{user?.companyName}</>
                        </span>
                      </div>
                      <div className="text-sm text-end flex justify-end">
                        <div className="text-sm text-end">
                          کد ملی / اقتصادی :{" "}
                        </div>
                        <span className="text-sm mx-2">
                          {!user?.isLegal ? (
                            <>{user?.nationalCode}</>
                          ) : (
                            <>
                              {user?.isLegal
                                ? user?.economicCode
                                : user?.nationalCode}
                            </>
                          )}
                        </span>{" "}
                      </div>
                    </div>

                    <>
                      {" "}
                      <div className="grid grid-cols-3 w-full items-end mt-2">
                        <div className="text-sm">
                          شناسه ثبت:
                          <span className="text-sm  mx-2">
                            {user?.isLegal ? user.regNumber : "-"}
                          </span>
                        </div>
                        <div className="text-sm text-center">
                          موبایل:
                          <span className="text-sm mx-2">{user?.mobile}</span>
                        </div>
                        <div className="text-sm text-left">
                          تلفن:
                          <span className="text-sm mx-2">{user?.tel}</span>
                        </div>
                      </div>{" "}
                      <div className="border-print bg-[#eaeaea]  mt-3">
                        <h2 className="text-center font-extrabold">
                          مشخصات ارسال
                        </h2>
                      </div>
                      <div className="grid grid-cols-3 w-full items-end mt-2">
                        <div className="text-sm">
                          استان:
                          <span className="text-sm mx-2">
                            {selectedAddress?.province}
                          </span>
                        </div>
                        <div className="text-sm text-center">
                          شهر:
                          <span className="text-sm mx-2">
                            {selectedAddress?.city}
                          </span>
                        </div>
                        <div className="text-sm text-end">
                          کد پستی:
                          <span className="text-sm mx-2">
                            {selectedAddress?.postalCode}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-7">
                        <div className="mt-2  col-span-6 w-full text-sm flex">
                          نشانی:
                          <div className="flex text-sm mx-2 gap-5">
                            {"    "} {selectedAddress?.address} {"    "},{" "}
                            {"   "} پلاک
                            {"    "} {selectedAddress?.plaque}
                            {"    "}, {"   "} طبقه
                            {"    "} {selectedAddress?.floorNo}
                            {"    "}, {"   "} واحد
                            {"    "} {selectedAddress?.unit}
                          </div>
                        </div>
                        {/*       <div className="text-sm text-left mt-2">
              شماره باربری:
              <span className="text-sm mx-2">{items.waybill}</span>
            </div> */}
                      </div>
                    </>
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
                              <th className=" border border-black ">
                                مبلغ واحد
                              </th>
                              <th className=" border border-black ">مبلغ کل</th>
                              <th className=" border border-black ">
                                مبلغ تخفیف
                              </th>

                              <th className=" border border-black ">
                                مبلغ کل پس از تخفیف
                              </th>
                              <th className=" border border-black ">
                                {" "}
                                جمع مالیات و عوارض
                              </th>
                              <th className=" border border-black ">
                                خالص فاکتور{" "}
                              </th>

                              {/*              <th>مالیات و عوارض</th>
                      <th>جمع مبلغ کل بعلاوه مالیات و عوارض</th> */}
                            </tr>
                          </thead>

                          <tbody>
                            {Array.from(Array(rows).keys()).map((item, i) => (
                              <tr className="" key={i}>
                                <td className="border relative border-black text-xs py-1 text-center overflow-hidden">
                                  {i !== 0 && (
                                    <Delete
                                      sx={{
                                        width: "12px",
                                        height: "12px",
                                        position: "absolute",
                                        top: "40%",
                                        left: "4px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleDeleteRow(i)}
                                      color="error"
                                    />
                                  )}
                                  {i + 1}
                                </td>
                                <td className="border border-black text-xs py-1 text-center overflow-hidden">
                                  <input
                                    className={`border-0 h-[20px] text-sm w-[calc(100%-4px)] tranistion-all duration-300 px-1 ${
                                      error[i]?.title ? "bg-red-100 " : ""
                                    } `}
                                    value={data.productProperty[i]?.title}
                                    onChange={(e) =>
                                      handleData("title", e.target.value, i)
                                    }
                                  />
                                </td>
                                <td
                                  colSpan={3}
                                  className="overflow-hidden text-center border border-black text-xs py-1"
                                >
                                  <input
                                    className={`border-0 h-[20px] text-sm w-[calc(100%-4px)] tranistion-all duration-300 px-1 ${
                                      error[i]?.description ? "bg-red-100 " : ""
                                    } `}
                                    value={data.productProperty[i]?.description}
                                    onChange={(e) =>
                                      handleData(
                                        "description",
                                        e.target.value,
                                        i
                                      )
                                    }
                                  />
                                </td>

                                <td className="overflow-hidden text-center border border-black text-xs py-1 ">
                                  {" "}
                                  <input
                                    className={`border-0 h-[20px] text-sm w-[calc(100%-4px)] tranistion-all duration-300 px-1 ${
                                      error[i]?.qty ? "bg-red-100 " : ""
                                    } `}
                                    value={data.productProperty[i]?.qty}
                                    type="number"
                                    onChange={(e) =>
                                      handleData("qty", e.target.value, i)
                                    }
                                  />
                                </td>
                                <td className="overflow-hidden text-center border border-black text-xs py-1 ">
                                  <input
                                    className={`border-0 h-[20px] text-sm w-[calc(100%-4px)] tranistion-all duration-300 px-1 ${
                                      error[i]?.price ? "bg-red-100 " : ""
                                    } `}
                                    type="number"
                                    value={data.productProperty[i]?.price}
                                    onChange={(e) =>
                                      handleData("price", e.target.value, i)
                                    }
                                  />
                                </td>

                                <td className="overflow-hidden text-center border border-black text-xs py-1 ">
                                  <input
                                    className="border-0 h-[20px] text-sm w-[calc(100%-4px)] px-1 "
                                    value={data.productProperty[i]?.basePrice}
                                    type="number"
                                    disabled
                                    onChange={(e) =>
                                      handleData("basePrice", e.target.value, i)
                                    }
                                  />
                                </td>
                                <td className="overflow-hidden text-center border border-black text-xs py-1 ">
                                  <input
                                    className="border-0 h-[20px] text-sm w-[calc(100%-4px)] px-1 "
                                    value={data.productProperty[i]?.discount}
                                    type="number"
                                    onChange={(e) =>
                                      handleData("discount", e.target.value, i)
                                    }
                                  />
                                </td>
                                <td className="overflow-hidden text-center border border-black text-xs py-1 ">
                                  <input
                                    className="border-0 h-[20px] text-sm w-[calc(100%-4px)] px-1 "
                                    value={data.productProperty[i]?.totalPrice}
                                    type="number"
                                    disabled
                                    onChange={(e) =>
                                      handleData(
                                        "totalPrice",
                                        e.target.value,
                                        i
                                      )
                                    }
                                  />
                                </td>
                                <td className="overflow-hidden text-center border border-black text-xs py-1 ">
                                  <input
                                    className="border-0 h-[20px] text-sm w-[calc(100%-4px)] px-1 "
                                    value={data.productProperty[i]?.vat}
                                    type="number"
                                    disabled
                                    onChange={(e) =>
                                      handleData("vat", e.target.value, i)
                                    }
                                  />
                                </td>

                                <td className="overflow-hidden text-center border border-black text-xs py-1">
                                  <input
                                    className="border-0 h-[20px] text-sm w-[calc(100%-4px)] px-1 "
                                    value={data.productProperty[i]?.finalPrice}
                                    type="number"
                                    disabled
                                    onChange={(e) =>
                                      handleData(
                                        "finalPrice",
                                        e.target.value,
                                        i
                                      )
                                    }
                                  />
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
                                {totals.discount.toLocaleString("en-US")}
                              </td>
                              <td className="border border-black  text-xs text-center py-1">
                                {totals.total.toLocaleString("en-US")}
                              </td>
                              <td className="border border-black  text-xs text-center py-1">
                                {totals.totalVat.toLocaleString("en-US")}
                              </td>
                              <td className="border border-black  text-xs text-center py-1">
                                {totals.final.toLocaleString("en-US")}
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <div className="w-full border flex justify-betweem border-black border-t-0 h-8 flex px-2 items-center gap-4">
                          <div className="flex gap-2 w-full">
                            <span className="text-xs">جمع کل به حروف : </span>
                            <span className="text-xs">
                              {Num2persian(totals.final)} ریال
                            </span>
                          </div>
                        </div>

                        <div className="w-full border border-black border-t-0 h-8 flex  justify-between px-2 items-center ">
                          <div className="flex items-center">
                            <span className="text-xs">
                              درگاه پرداخت :{data.gatewayname}{" "}
                            </span>
                          </div>{" "}
                        </div>
                        <div className="w-full border border-black border-t-0 h-8  px-2 items-center gap-4 flex justify-between">
                          <div className="flex gap-4 items-center col-span-3">
                            <span className="text-xs">توضیحات : </span>

                            <input
                              className="border-0 h-[20px] text-sm px-2 w-full max-w-fit"
                              value={data.description}
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex gap-4 items-center ">
                            <span className="text-xs">روش تخفیف : </span>
                            <span className="text-xs">
                              {" "}
                              <input
                                className="border-0 h-[20px] text-sm px-2 w-full max-w-fit"
                                value={data.planDiscount}
                                onChange={(e) =>
                                  setData({
                                    ...data,
                                    planDiscount: e.target.value,
                                  })
                                }
                              />
                            </span>
                          </div>
                          {/*          <div className="flex gap-4 items-center text-xs min-w-[210px] col-span-3">
                            <span className="text-xs">
                              {" "}
                              مبلغ وام در خواستی:{" "}
                            </span>
                            <span className="text-xs">
                              {" "}
                              {userBuyMax.toLocaleString("en-US")} ریال{" "}
                            </span>
                          </div> */}
                          <div className="flex gap-4 items-center text-xs min-w-[210px] col-span-3">
                            <span className="text-xs">
                              {" "}
                              مابه التفاوت نقدی :{" "}
                            </span>
                            <span className="text-xs">
                              {" "}
                              {(totals.final - userBuyMax < 0
                                ? 0
                                : totals.final - userBuyMax
                              ).toLocaleString("en-US")}{" "}
                              ریال{" "}
                            </span>
                          </div>
                          {/*     <div className="flex gap-4 items-center ">
                            <span className="text-xs">
                           :{" "}
                            </span>
                            <span className="text-xs">
                              {" "}
                              <input
                                className="border-0 h-[20px] text-sm px-2 w-full max-w-fit"
                                value={data.deference}
                                type="number"
                                onChange={(e) =>
                                  setData({
                                    ...data,
                                    deference: e.target.value,
                                  })
                                }
                              />
                            </span>
                          </div> */}
                        </div>
                        <div className="w-full border border-black border-t-0 h-18 grid grid-cols-4 px-2 items-center justify-between gap-4 ">
                          <div className="flex items-center justify-center flex-col gap-3 py-2 border-l border-black">
                            <span className="text-sm font-bold">
                              مهر و امضا فروشنده
                            </span>
                            {/*    <img
                              src={`${baseUrl}/${DOWNLOAD_FILE}/${seller?.seal}`}
                              alt="companySeal"
                              className="img-fluid w-24"
                            /> */}
                          </div>
                          <div className="flex h-[100px] items-center justify-center flex-col gap-3 py-2 border-l border-black ">
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
                            {/*   <div className="flex items-center justify-between col-span-3">
                                {" "}
                                <div className="text-sm flex items-center gap-2">
                                  نام گیرنده :
                                  <span className="text-sm mx-2">
                                    {items?.sendAddress?.receptorFname}
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
                              </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
          <div className="absolute right-[90px] top-[380px]">
            <Button
              sx={{
                fontSize: "30px !important",
                padding: "5px !important",
                minWidth: "40px !important",
                height: "30px !important",
              }}
              onClick={handleAddRows}
              variant="contained"
              color="primary"
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreCreateInvoice;
