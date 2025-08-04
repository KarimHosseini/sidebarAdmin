import { Box } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import { baseUrl, DOWNLOAD_FILE } from "../../../../../helpers/api-routes";
import datas from "./p.json";

const ProductList = ({ data, allData }) => {
  const { companyInfo } = useSelector((state) => state.relationals);

  return (
    <Box
/*       sx={{
        gridTemplateColumns: {
          lg: data?.column
            ? `repeat(${data?.column},1fr) `
            : "repeat(auto-fit, minmax(200px, 1fr))",
          xs: "repeat(auto-fit, minmax(200px, 1fr))",
        },
        gridTemplateRows: `repeat(${data?.row},1fr) `,
      }} */
      className="block gap-5 my-6"
    >
      {allData?.slice(0, data?.showCaseLimit || 3)?.map((item, index) => (
        <Box
          sx={{
            borderTopWidth: `${data?.elementBorderTop}px !important`,
            borderRightWidth: `${data?.elementBorderRight}px !important`,
            borderBottomWidth: `${data?.elementBorderBottom}px !important`,
            borderLeftWidth: `${data?.elementBorderLeft}px !important`,
            borderTopRightRadius: data?.borderElementRaduisTop + "px",
            borderTopLeftRadius: data?.borderElementRaduisRight + "px",
            borderBottomLeftRadius: data?.borderElementRaduisBottom + "px",
            borderBottomRightRadius: data?.borderElementRaduisLeft + "px",
          borderColor:data?.elementBorderColor || "#e5e7eb"
          }}
          key={index}
          className="w-full md:flex grid grid-cols-3  gap-3  cursor-pointer"
        >
          {" "}
          <div className=" transition-all">
            {item.image ? (
              <img
                loading="lazy"
                className="object-cover overflow-hidden lazyload blur-up"
                width={40}
                height={40}
                src={`${baseUrl}/${DOWNLOAD_FILE}/${item.image}`}
                alt={item.alt || item.title}
              />
            ) : (
              <img
                src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}`}
                alt={item.title}
                loading="lazy"
                style={{ filter: "brightness(0.94)", opacity: "10%" }}
                className="opacity-10 w-[40px] h-[40px] md:w-[40px] md:h-[40px]"
              />
            )}
          </div>
          <>
            <p className="py-4 text-sm text-start md:font-normal  font-bold">
              {item?.title?.length > 50 && data?.column > 2 ? (
                <>
                  {item.title.slice(0, 40)}
                  ...
                </>
              ) : (
                item.title
              )}
            </p>
            <div>
              {!item.available || item.maxPrice === 0 ? (
                <div className="flex items-center mt-1 gap-1 justify-start">
                  <span className="text-center text-red-600">
                    {/*     <AiOutlineLine /> */}
                  </span>
                  <span className="text-center text-red-600">ناموجود</span>
                  <span className="text-center text-red-600">
                    {/*    <AiOutlineLine /> */}
                  </span>
                </div>
              ) : (
                <div className=" flex py-2 items-center justify-start">
                  <div className="text-left mt-1 font-bold text-lg">
                    <>
                      <div className="flex gap-2 items-center justify-start">
                        {item.discount < item.minPrice && item.discount > 0 ? (
                          <div className="flex items-center justify-end gap-2">
                            <p className="  font-light text-sm text-gray-500 line-through">
                              {item.minPriceBeforeDiscount.toLocaleString(
                                "en-US"
                              )}
                            </p>
                            <div className="p-1 text-xs text-center  bg-[#feed00] ">
                              %{item.topDiscount}
                            </div>
                          </div>
                        ) : (
                          <div></div>
                        )}
                        <span className="text-lg">
                          {item.minPrice !== item.maxPrice ||
                          item.hasRange > 0 ? (
                            <>از</>
                          ) : (
                            <></>
                          )}
                          {(item.discount < item.minPrice && item.discount > 0
                            ? item.discount
                            : item.minPrice
                          ).toLocaleString("en-US")}
                        </span>
                        <span className="text-sm font-normal text-gray-500 mr-2">
                          تومان
                        </span>
                      </div>
                    </>
                  </div>
                </div>
              )}
            </div>
          </>
        </Box>
      ))}
    </Box>
  );
};

export default ProductList;
