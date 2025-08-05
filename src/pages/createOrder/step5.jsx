import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Num2persian from "../../helpers/numbric";

const Step5 = ({ user, product, selectedAddress, sendeddeliverTime }) => {
  const { companyInfo } = useSelector((state) => state.relationals);
  const [totall, setTotall] = useState({});
  useEffect(() => {
    var sum1 = 0,
      sum2 = 0,
      sum3 = 0;
    product.map((item) => {
      sum1 += item.discount;
      sum2 += item.price;
      sum3 += item.priceAmount;
    });
    setTotall({ discount: sum1, price: sum2, priceAmount: sum3 });
  }, [product]);

  return (
    <div>
      {" "}
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
          </div>
          <div className="col-span-2">
            <h1 className="text-center text-base font-bold">
              فاکتور فروش کالا و خدمات{" "}
            </h1>
          </div>
          <div className="absolute flex gap-3 items-center left-64 -top-4">
            <img
              src="/images/unpaid_status.svg"
              alt=""
              className="max-w-[90px] "
            />
          </div>
          <div className="flex flex-col-reverse gap-3 items-end ml-[80px]">
            <div className="text-left flex items-center justify-end w-52 gap-3 text-[11px] font-bold">
              زمان ثبت
            </div>
            <div className="text-left flex items-center justify-between w-48  text-base font-bold">
              شماره سفارش
              <span>-</span>
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
              <span className="text-sm mx-2"> {companyInfo.companyName} </span>
            </div>
            {/*      <div className="text-sm text-center">
          شناسه ملی:
          <span className="text-sm mx-2"> {companyInfo.nationalId} </span>
        </div> */}
            <div className="text-sm text-left">
              کد اقتصادی:
              <span className="text-sm mx-2">{companyInfo.companyName}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 mt-2 w-full items-center">
            <div className="text-sm">
              شماره ثبت:
              <span className="text-sm mx-2">{companyInfo.regNumber}</span>
            </div>

            <div className="text-sm text-center">
              تلفن:
              <span className="text-sm mx-2">{companyInfo.tel}</span>
            </div>

            <div className="text-sm text-left">
              شهر:
              <span className="text-sm mx-2">{companyInfo.city}</span>
            </div>
          </div>
          <div className="flex justify-between mt-2 w-full items-center">
            <div className="flex text-sm gap-2">
              نشانی:
              <p className="d-inline-block text-sm mx-2">
                {companyInfo.address}
              </p>
            </div>
            <div className="text-sm">
              کد پستی:
              <span className="text-sm mx-2">{companyInfo.postalCode}</span>
            </div>
          </div>
          <div className="border-print bg-[#eaeaea]  mt-3">
            <h2 className="text-center font-extrabold">مشخصات خریدار</h2>
          </div>
          <div className="grid grid-cols-3 w-full items-end mt-2">
            <div className="text-sm">
              نام شخص حقیقی/حقوقی:
              {user?.iscompanyInfo ? (
                <span className="text-sm mx-2">
                  {" "}
                  {user?.receptorFname} {user?.receptorLname}
                </span>
              ) : (
                <span className="text-sm mx-2">
                  {user?.fName} {user?.lName}
                </span>
              )}
            </div>

            <div className="text-sm text-center">
              نام سازمان/شرکت :‌
              <span className="text-sm mx-2">
                <>{user?.companyName}</>
              </span>
            </div>
            <div className="text-sm text-end flex justify-end">
              <div className="text-sm text-end">کد ملی / اقتصادی : </div>
              <span className="text-sm mx-2">
                {user?.iscompanyInfo ? (
                  <>{user?.receptorNationalCode}</>
                ) : (
                  <>{user?.isLegal ? user?.economicCode : user?.nationalCode}</>
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
              <h2 className="text-center font-extrabold">مشخصات ارسال</h2>
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
                <span className="text-sm mx-2">{selectedAddress?.city}</span>
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
                  {"    "} {selectedAddress?.address} {"    "}, {"   "} پلاک
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
            <h2 className="text-center font-extrabold">مشخصات کالا / خدمات</h2>
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
                    <th className=" border border-black ">خالص فاکتور </th>

                    {/*              <th>مالیات و عوارض</th>
            <th>جمع مبلغ کل بعلاوه مالیات و عوارض</th> */}
                  </tr>
                </thead>

                <tbody>
                  {product?.map((item, index) => (
                    <tr className="" key={index}>
                      <td className="border border-black text-xs py-1 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-black text-xs py-1 text-center">
                        {item?.code}
                      </td>
                      <td
                        colSpan={3}
                        className="text-center border border-black text-xs py-1"
                      >
                        {item?.title} /{item?.productAttribute?.title}
                        {item?.productAttribute2?.title && (
                          <> / {item?.productAttribute2?.title} </>
                        )}
                        {item?.description && <>/{item?.description}</>}
                      </td>

                      <td className="text-center border border-black text-xs py-1 ">
                        {" "}
                        1
                      </td>
                      <td className="text-center border border-black text-xs py-1 ">
                        {item.price.toLocaleString("en-US")}
                      </td>

                      <td className="text-center border border-black text-xs py-1 ">
                        {" "}
                        {item.price.toLocaleString("en-US")}
                      </td>
                      <td className="text-center border border-black text-xs py-1 ">
                        {item.discount.toLocaleString("en-US")}
                      </td>
                      <td className="text-center border border-black text-xs py-1 ">
                        {" "}
                        {item.priceAmount.toLocaleString("en-US")}
                      </td>
                      <td className="text-center border border-black text-xs py-1 "></td>

                      <td className="text-center border border-black text-xs py-1">
                        {" "}
                        {item.priceAmount.toLocaleString("en-US")}
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
                      {totall?.discount}
                    </td>
                    <td className="border border-black  text-xs text-center py-1">
                      {" "}
                      {totall?.price}
                    </td>
                    <td className="border border-black  text-xs text-center py-1">
                      -
                    </td>
                    <td className="border border-black  text-xs text-center py-1">
                      {" "}
                      {totall?.priceAmount}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="w-full border border-black border-t-0 h-8 flex px-2 items-center gap-4">
                <span className="text-xs">جمع کل به حروف : </span>
                <span className="text-xs">
                  {Num2persian(totall.priceAmount || 0)} ریال
                </span>
              </div>
              <div className="w-full border border-black border-t-0 h-8 flex  justify-between px-2 items-center ">
                <div className="flex items-center">
                  <span className="text-xs">زمان ارسال : </span>
                  <span className="text-xs">
                    {new Date(sendeddeliverTime?.date).toLocaleDateString(
                      "fa-IR"
                    )}{" "}
                  </span>{" "}
                  <div className="flex text-xs gap-1 items-center text-[#141414] mx-2 ">
                    ساعت :‌
                    <span>
                      {new Date(
                        sendeddeliverTime?.shippingTimes?.fromDate
                      ).getHours()}
                    </span>
                    <span>تا</span>
                    <span>
                      {new Date(
                        sendeddeliverTime?.shippingTimes?.toDate
                      ).getHours()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs">درگاه پرداخت : </span>
                </div>{" "}
                <div className="flex items-center">
                  <span className="text-xs">شماره تراکنش : </span>
                </div>
              </div>
              {/*  
          <div className="w-full border border-black border-t-0 h-8  px-2 items-center gap-4 flex justify-between">
            <div className="flex gap-4 items-center col-span-3">
              <span className="text-xs">توضیحات : </span>
              <span className="text-xs"> {items.description} </span>
            </div>
            <div className="flex gap-4 items-center ">
              <span className="text-xs">روش تخفیف : </span>
              <span className="text-xs">
                {" "}
                {items.planDiscount ? "کد تخفیف" : ""}{" "}
              </span>
            </div>
          </div>
          <div className="w-full border border-black border-t-0 h-18 grid grid-cols-4 px-2 items-center justify-between gap-4 ">
            <div className="flex items-center justify-center flex-col gap-3 py-2 border-l border-black">
              <span className="text-sm font-bold">
                مهر و امضا فروشنده
              </span>
              <img
                src={`${baseUrl}/${DOWNLOAD_FILE}/${seller?.seal}`}
                alt="companySeal"
                className="img-fluid w-24"
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
              <div className="flex items-center justify-between col-span-3">
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
              </div>
            </div>
          </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5;
