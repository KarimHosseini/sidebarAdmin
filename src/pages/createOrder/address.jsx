import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import SelectAddress from "./selectAddres";

const OrderAddress = ({
  setAddress,
  address,
  isCodSelected,
  setBranch,
  branches,
  setSelectedAddress,
  selectedaddress,
  setOpenCreate,
}) => {
  const isMd = useMediaQuery("(min-width:900px)");

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isCodSelected && branches?.length > 0) {
      setSelectedIndex(0);
      setBranch(branches[0]?.id);
    }
  }, [isCodSelected]);

  return (
    <div>
      <>
        {isCodSelected ? (
          <>
            {branches?.length === 0 ? (
              <div className="flex flex-col justify-center items-center gap-3 text-center py-5">
                <img
                  src="/assets/images/public/warehouse-8646717-6894975.png"
                  width={120}
                />
                <p className="text-[15px] text-light-primary-text">
                  هیچ شعبه‌ای برای تحویل حضوری فعال نیست
                </p>
                <p className="text-light-secondary-text text-sm font-light">
                  شما می توانید سفارش خود را بصورت پستی ثبت کنید و یا با
                  پشتیبانی ما تماس بگیرید
                </p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 md:gap-7 gap-3 md:border rounded-2xl md:px-4 px-2 py-2">
                  {" "}
                  {branches?.map((item, index) => (
                    <div
                      key={index + "l"}
                      onClick={() => {
                        setSelectedIndex(index);
                        setBranch(item?.id);
                      }}
                      className={`flex flex-col cursor-pointer gap-2 ${
                        isMd
                          ? `border rounded-xl transition-all duration-300  px-2 py-2 ${
                              selectedIndex !== index
                                ? ""
                                : " border-orange-700 bg-orange-50"
                            }`
                          : ""
                      }`}
                    >
                      <div className=" flex gap-5 items-center">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          width={isMd ? 107 : 70}
                          height={isMd ? 107 : 70}
                          className="rounded-[12px] min-h-[70px]"
                        />
                        <div className="flex flex-col gap-3 justify-start items-start h-full pt-3">
                          <div className="flex items-center gap-2">
                            {selectedIndex === index ? (
                              <img
                                src="/assets/images/icons/Icon 24px/tick-circle 24px.svg"
                                width={18}
                                height={18}
                                className="md:block hidden"
                              />
                            ) : (
                              <input
                                type={"radio"}
                                readOnly
                                className="md:block hidden"
                              />
                            )}

                            <p
                              className={`text-sm  font-bold ${
                                selectedIndex !== index
                                  ? "text-light-primary-text"
                                  : "text-orange-700 "
                              }`}
                            >
                              {item?.title}
                            </p>
                          </div>
                          {isMd && (
                            <span
                              className={` text-xs leading-6  ${
                                selectedIndex !== index
                                  ? "text-light-secondary-text"
                                  : "text-orange-700 "
                              }`}
                            >
                              {item?.address}
                            </span>
                          )}{" "}
                        </div>
                      </div>{" "}
                      {!isMd && (
                        <span
                          className={` text-xs leading-6  ${
                            selectedIndex !== index
                              ? "text-light-secondary-text"
                              : "text-orange-700 "
                          }`}
                        >
                          {item?.address}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-2 my-6">
                  {" "}
                  <div className="w-2 h-2 mt-1 rounded-full bg-orange-700"></div>
                  <span className="text-orange-700 text-xs font-bold leading-6">
                    کارت شناسایی ارائه شده هنگام دریافت کالا باید با اطلاعات
                    وارد شده در سایت (گیرنده سفارش)، مطابقت داشته باشد.
                  </span>
                </div>
              </>
            )}
          </>
        ) : (
          <SelectAddress
            address={address}
            canEdit={false}
            canSelect={true}
            isCodSelected={isCodSelected}
            setSelectedAddress={(e) => {
              setSelectedAddress(e);
            }}
            selectedAddress={selectedaddress}
            setLoadedAddress={(e) => {}}
            setOpenCreate={setOpenCreate}
          />
        )}
      </>
    </div>
  );
};

export default OrderAddress;
