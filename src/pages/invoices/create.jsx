import { Button } from "@mui/material";
import * as React from "react";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import Num2persian from "../../helpers/numbric";
const CreateInvoice = () => {
  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);
  const [data, setData] = React.useState({ id: 42345, productProperty: [] });
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
    temp[index] = { ...temp[index], [name]: value };
    setData({ ...data, productProperty: temp });
  };
  React.useEffect(() => {
    setTotals({
      discount: data.productProperty.reduce(
        (sum, item) => sum + (item.discount || 0) * (item.qty || 1),
        0
      ),
      total: data.productProperty.reduce(
        (sum, item) => sum + (item.discountAfter || 0) * (item.qty || 1),
        0
      ),
      totalVat: data.productProperty.reduce(
        (sum, item) => sum + (item.vat || 0) * (item.qty || 1),
        0
      ),
      final: data.productProperty.reduce(
        (sum, item) => sum + (item.final || 0) * (item.qty || 1),
        0
      ),
    });
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
    <div>
      {" "}
      <div className="overflow-x-auto flex justify-center ">
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
              trigger={reactToPrintTrigger}
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
                      <div className="w-90PX">
                        <img
                          src={companyInfo?.companyLogoUrl}
                          alt="logo"
                          className="img-fluid w-28"
                        />
                      </div>
                      {/*        {items?.isSeller && (
                        <div className="text-xs  absolute -bottom-2">
                          <div className="flex items-center justify-between">
                            <div className="text-xs ">
                              {" "}
                              صادر شده از نماینده فروش
                            </div>
                          </div>
                        </div>
                      )} */}
                    </div>
                    <div className="col-span-2">
                      <h1 className="text-center text-base font-bold">
                        فاکتور فروش کالا و خدمات{" "}
                      </h1>
                    </div>
                    <div className="absolute flex gap-3 items-center left-64 -top-4">
                      <>
                        <img
                          src="/images/paid_status.svg"
                          alt=""
                          className="max-w-[90px] "
                        />
                      </>
                    </div>
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
                      <div className="text-left flex items-center justify-between w-48  text-base font-bold">
                        شماره سفارش
                        <span>{data.id}</span>
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
                        value={`${
                          process.env.REACT_APP_LABEL_URL
                        }/order/${String(data.id)}`}
                        viewBox={`0 0 256 256`}
                      />
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
                        <input
                          className="border-0 h-[20px] text-sm px-2"
                          value={data.name}
                          onChange={(e) =>
                            setData({ ...data, name: e.target.value })
                          }
                        />
                      </div>
                      {/*      <div className="text-sm text-center">
                    شناسه ملی:
                    <span className="text-sm mx-2"> {seller.nationalId} </span>
                  </div> */}
                      <div className="text-sm text-left">
                        کد اقتصادی:
                        <input
                          className="border-0 h-[20px] text-sm px-2"
                          value={data.economicCode}
                          onChange={(e) =>
                            setData({ ...data, economicCode: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 mt-2 w-full items-center">
                      <div className="text-sm">
                        شماره ثبت:
                        <input
                          className="border-0 h-[20px] text-sm px-2"
                          value={data.regNumber}
                          onChange={(e) =>
                            setData({ ...data, regNumber: e.target.value })
                          }
                        />
                      </div>

                      <div className="text-sm text-center">
                        تلفن:
                        <input
                          className="border-0 h-[20px] text-sm px-2"
                          value={data.tel}
                          onChange={(e) =>
                            setData({ ...data, tel: e.target.value })
                          }
                        />
                      </div>

                      <div className="text-sm text-left">
                        شهر:
                        <input
                          className="border-0 h-[20px] text-sm px-2"
                          value={data.city}
                          onChange={(e) =>
                            setData({ ...data, city: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 w-full items-center">
                      <div className="flex text-sm gap-2 items-center w-full">
                        نشانی:
                        <input
                          className="border-0 h-[20px] w-full text-sm px-2"
                          value={data.address}
                          onChange={(e) =>
                            setData({ ...data, address: e.target.value })
                          }
                        />
                      </div>
                      <div className="text-sm flex items-center">
                        <span className="min-w-max"> کد پستی:</span>

                        <input
                          className="border-0 h-[20px] text-sm px-2"
                          value={data.postalCode}
                          onChange={(e) =>
                            setData({ ...data, postalCode: e.target.value })
                          }
                        />
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
                        <input
                          className="border-0 h-[20px] text-sm px-2"
                          value={data.receptorFname}
                          onChange={(e) =>
                            setData({
                              ...data,
                              receptorFname: e.target.value,
                            })
                          }
                        />
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
                          <input
                            className="border-0 h-[20px] text-sm px-2"
                            value={data.companyName}
                            onChange={(e) =>
                              setData({
                                ...data,
                                companyName: e.target.value,
                              })
                            }
                          />
                        </span>
                      </div>
                      <div className="text-sm text-end flex items-center justify-end">
                        <div className="text-sm text-end">
                          کد ملی / اقتصادی :{" "}
                        </div>

                        <input
                          className="border-0 h-[20px] text-sm px-2"
                          value={data.receptorNationalCode}
                          onChange={(e) =>
                            setData({
                              ...data,
                              receptorNationalCode: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <>
                      <div className="border-print bg-[#eaeaea]  mt-3">
                        <h2 className="text-center font-extrabold">
                          مشخصات ارسال
                        </h2>
                      </div>
                      <div className="grid grid-cols-3 w-full items-end mt-2">
                        <div className="text-sm">
                          استان:
                          <input
                            className="border-0 h-[20px] text-sm px-2"
                            value={data.province}
                            onChange={(e) =>
                              setData({
                                ...data,
                                province: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="text-sm text-center">
                          شهر:
                          <input
                            className="border-0 h-[20px] text-sm px-2"
                            value={data.city}
                            onChange={(e) =>
                              setData({
                                ...data,
                                city: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="text-sm text-end">
                          کد پستی:
                          <input
                            className="border-0 h-[20px] text-sm px-2"
                            value={data.postalCode}
                            onChange={(e) =>
                              setData({
                                ...data,
                                postalCode: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 mt-2  ">
                        <div className="col-span-3 w-full text-sm flex items-center">
                          نشانی:
                          <input
                            className="border-0 h-[20px] text-sm px-2"
                            value={data.fullAddress}
                            onChange={(e) =>
                              setData({
                                ...data,
                                fullAddress: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="text-sm col-span-1 mr-8 flex items-center gap-2 text-left">
                          موبایل:
                          <input
                            className="border-0 h-[20px] text-sm px-2"
                            value={data.receptorMobile}
                            onChange={(e) =>
                              setData({
                                ...data,
                                receptorMobile: e.target.value,
                              })
                            }
                          />
                        </div>
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
                                <td className="border border-black text-xs py-1 text-center overflow-hidden">
                                  {i + 1}
                                </td>
                                <td className="border border-black text-xs py-1 text-center overflow-hidden">
                                  <input
                                    className="border-0 h-[20px] text-sm w-[calc(100%-4px)] px-1 "
                                    value={data.productProperty[i]?.code}
                                    onChange={(e) =>
                                      handleData("code", e.target.value, i)
                                    }
                                  />
                                </td>
                                <td
                                  colSpan={3}
                                  className="overflow-hidden text-center border border-black text-xs py-1"
                                >
                                  <input
                                    className="border-0 h-[20px] text-sm w-[calc(100%-4px)] px-1 "
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
                                    className="border-0 h-[20px] text-sm w-[calc(100%-4px)] px-1 "
                                    value={data.productProperty[i]?.qty}
                                    onChange={(e) =>
                                      handleData("qty", e.target.value, i)
                                    }
                                  />
                                </td>
                                <td className="overflow-hidden text-center border border-black text-xs py-1 ">
                                  <input
                                    className="border-0 h-[20px] text-sm w-[calc(100%-4px)] px-1 "
                                    value={data.productProperty[i]?.price}
                                    onChange={(e) =>
                                      handleData("price", e.target.value, i)
                                    }
                                  />
                                </td>

                                <td className="overflow-hidden text-center border border-black text-xs py-1 ">
                                  <input
                                    className="border-0 h-[20px] text-sm w-[calc(100%-4px)] px-1 "
                                    value={data.productProperty[i]?.itemsPrice}
                                    onChange={(e) =>
                                      handleData(
                                        "itemsPrice",
                                        e.target.value,
                                        i
                                      )
                                    }
                                  />
                                </td>
                                <td className="overflow-hidden text-center border border-black text-xs py-1 ">
                                  <input
                                    className="border-0 h-[20px] text-sm w-[calc(100%-4px)] px-1 "
                                    value={data.productProperty[i]?.discount}
                                    onChange={(e) =>
                                      handleData("discount", e.target.value, i)
                                    }
                                  />
                                </td>
                                <td className="overflow-hidden text-center border border-black text-xs py-1 ">
                                  <input
                                    className="border-0 h-[20px] text-sm w-[calc(100%-4px)] px-1 "
                                    value={
                                      data.productProperty[i]?.discountAfter
                                    }
                                    onChange={(e) =>
                                      handleData(
                                        "discountAfter",
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
                                    onChange={(e) =>
                                      handleData("vat", e.target.value, i)
                                    }
                                  />
                                </td>

                                <td className="overflow-hidden text-center border border-black text-xs py-1">
                                  <input
                                    className="border-0 h-[20px] text-sm w-[calc(100%-4px)] px-1 "
                                    value={data.productProperty[i]?.final}
                                    onChange={(e) =>
                                      handleData("final", e.target.value, i)
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

                        <div className="w-full border border-black border-t-0 h-8 flex px-2 items-center gap-4">
                          <span className="text-xs">جمع کل به حروف : </span>
                          <span className="text-xs">
                            {Num2persian(totals.final)} ریال
                          </span>
                        </div>

                        <div className="w-full border border-black border-t-0 h-8 flex  justify-between px-2 items-center ">
                          <div className="flex items-center">
                            <span className="text-xs min-w-max">
                              زمان ارسال :{" "}
                            </span>
                            <span className="text-xs">
                              <input
                                className="border-0 h-[20px] text-sm px-2 w-full max-w-fit"
                                value={data.shippingDate}
                                onChange={(e) =>
                                  setData({
                                    ...data,
                                    shippingDate: e.target.value,
                                  })
                                }
                              />
                            </span>{" "}
                            <div className="flex text-xs gap-1 items-center text-[#141414] mx-2 ">
                              <span className=" min-w-max"> ساعت :</span>
                              ‌
                              <input
                                className="border-0 h-[20px] text-sm px-2 w-full max-w-fit"
                                value={data.fromDate}
                                onChange={(e) =>
                                  setData({
                                    ...data,
                                    fromDate: e.target.value,
                                  })
                                }
                              />
                              <span>تا</span>
                              <input
                                className="border-0 h-[20px] text-sm px-2 w-full max-w-fit"
                                value={data.toDate}
                                onChange={(e) =>
                                  setData({
                                    ...data,
                                    toDate: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs  min-w-max">
                              درگاه پرداخت :{" "}
                            </span>
                            <input
                              className="border-0 h-[20px] text-sm px-2 w-full max-w-fit"
                              value={data.gateway}
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  gateway: e.target.value,
                                })
                              }
                            />
                          </div>{" "}
                          <div className="flex items-center">
                            <span className="text-xs  min-w-max">
                              شماره تراکنش :{" "}
                            </span>
                            <span className="text-xs">
                              <input
                                className="border-0 h-[20px] text-sm px-2 w-full max-w-fit"
                                value={data.referenceNumber}
                                onChange={(e) =>
                                  setData({
                                    ...data,
                                    referenceNumber: e.target.value,
                                  })
                                }
                              />
                            </span>
                          </div>
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

export default CreateInvoice;
