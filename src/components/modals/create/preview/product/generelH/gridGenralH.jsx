import { Box } from "@mui/system";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { baseUrl, DOWNLOAD_FILE } from "../../../../../../helpers/api-routes";

const ProductgridGeneralH = ({ data, allData }) => {
  const { companyInfo } = useSelector((state) => state.relationals);

  return (
    <Box
      sx={{
        gridTemplateColumns: {
          lg: data?.column
            ? `repeat(${data?.column},1fr) `
            : "repeat(auto-fit, minmax(200px, 1fr))",
          xs: "repeat(auto-fit, minmax(200px, 1fr))",
        },
        gridTemplateRows: `repeat(${data?.row},1fr) `,
        gap: data.gridGap + "px",

        /*    backgroundColor: " #f1f2f4", */
      }}
      className="grid  my-6  rounded-md "
    >
      {allData?.slice(0, data?.showCaseLimit || 3)?.map((product, index) => (
        <Box
          sx={{
            ":before": {
              position: "absolute",
              right: "0px",
              top: "50%",
              height: "90%",
              transform: "translateY(-50%)",
              content: "' '",
              borderRightWidth: `${data?.elementBorderRight}px !important`,

              borderLeftWidth: `${data?.elementBorderLeft}px !important`,
              /*             borderTopRightRadius: data?.borderElementRaduisTop + "px",
            borderTopLeftRadius: data?.borderElementRaduisRight + "px",
            borderBottomLeftRadius: data?.borderElementRaduisBottom + "px",
            borderBottomRightRadius: data?.borderElementRaduisLeft + "px", */
              borderColor: data?.elementBorderColor || "#e5e7eb",
              [`:nth-child(${data?.column}n)`]: {
                borderRightWidth: "0px !Important",
              },
            },
            borderTopWidth: `${data?.elementBorderTop}px !important`,
            borderBottomWidth:
              index >=
              allData.length +
                (allData.length > data?.column
                  ? allData.length % data?.column === 0
                    ? 0
                    : data.column - (allData.length % data?.column)
                  : 0) -
                data?.column
                ? ""
                : `${data?.elementBorderBottom}px !important`,
            [`:nth-child(${data?.column}n)::before`]: {
              borderRightWidth: "0px !Important",
            },
            borderColor: data?.elementBorderColor || "#e5e7eb",
          }}
          className="w-full h-full overflow-hidden relative"
          key={index}
        >
          <div className="grid grid-cols-5 gap-6 px-4">
            <div className="col-span-2 flex flex-col gap-3">
              <Box
            
                className=" w-full  rounded-xl p-1 flex items-center  justify-center "
              >
                {data.showImg && (
                  <picture className="eimage">
                    {product.image ? (
                      <img
                        loading="lazy"
                        className="rect-img"
                        /*           style={{aspectRatio:"1/1"}}
                      className="object-cover overflow-hidden lazyload rounded-xl blur-up w-full h-full" */
                        src={`${baseUrl}/${DOWNLOAD_FILE}/${product.image}`}
                        alt={product.alt || product.title}
                      />
                    ) : (
                      <img
                        src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}`}
                        alt={product.title}
                        loading="lazy"
                        style={{ filter: "brightness(0.94)", opacity: "10%" }}
                        className="opacity-10 w-[80px] h-[80px]"
                      />
                    )}
                  </picture>
                )}
              </Box>
              {data.showColor && (
                <div className="flex gap-2 mt-1 items-center mx-1">
                  {product?.colors?.slice(0, 3)?.map((color) => (
                    <Fragment key={color.value + color.imageUrl}>
                      <div
                        className="rounded-[3px] w-[8px] h-[8px]"
                        style={{
                          background: color.imageUrl
                            ? `url(${color.imageUrl})`
                            : `${color.value}`,
                        }}
                      ></div>
                    </Fragment>
                  ))}
                </div>
              )}
              {data.showScore || data.showDelivery ? (
                <Box
                  sx={{
                    justifyContent:
                      data.showScore && !data.showDelivery
                        ? "flex-end"
                        : "space-between",
                  }}
                  className="flex items-center  mb-1"
                >
                  {data.showDelivery && <img src="/images/truck.svg" alt="/" />}
                  {data?.showScore && (
                    <div className="flex gap-1 items-center">
                      <span className="text-[10px]">4.7</span>
                      <img src="/images/fillstar.svg" alt="" />
                    </div>
                  )}
                </Box>
              ) : (
                <></>
              )}
            </div>
            <div className="col-span-3 flex flex-col ">
              {data.showPromotion && (
                <Box
                  sx={{
                    background: data?.promotionBg || "#FFA94D",
                    color: data?.counterColor || "#fff",
                    justifyContent:
                      data.showCounter && !data.showPromotionIcon
                        ? "flex-end"
                        : "space-between",
                  }}
                  className="flex  items-center  px-4 h-[18px] rounded-md"
                >
                  {data.showPromotionIcon && (
                    <img
                      className="w-[16px]"
                      src={companyInfo.promotionGalleryUrl}
                      alt=""
                    />
                  )}
                  {data.showCounter && (
                    <span className="text-[10px]">10:56:48</span>
                  )}
                </Box>
              )}{" "}
              {data.showProductTitle && (
                <div className="h-[48px] my-2 flex items-start justify-start">
                  <h3 className="md:text-[13px]  px-1 text-[#343A40] font-bold  leading-[22px] ellipsis-2">
                    {product?.title?.length > 60 ? (
                      <>{product.title.slice(0, 60)}...</>
                    ) : (
                      product.title
                    )}
                  </h3>
                </div>
              )}
              {!product.available || product.maxPrice === 0 ? (
                <div className="flex items-center mt-7 gap-1 justify-center">
                  <span className="text-center text-red-600">
                    {/*     <AiOutlineLine /> */}
                  </span>
                  <span className="text-center text-red-600">ناموجود</span>
                  <span className="text-center text-red-600">
                    {/*    <AiOutlineLine /> */}
                  </span>
                </div>
              ) : (
                <>
                  <>
                    <>
                      {product.discount < product.minPrice &&
                      product.discount > 0 ? (
                        <Box
                          sx={{
                            justifyContent:
                              data.showOldPrice && !data.showPrecent
                                ? "flex-end"
                                : "space-between",
                          }}
                          className="flex items-center my-2  w-full gap-2"
                        >
                          {data.showPrecent && (
                            <div className="py-1 px-2 text-xs font-bold text-center text-white bg-[#FF6B6B] rounded-lg">
                              %{product.topDiscount}
                            </div>
                          )}
                          {data.showOldPrice && (
                            <p className=" flex font-light gap-1 items-center text-sm text-[#FFA94D] line-through">
                              {product.minPriceBeforeDiscount.toLocaleString(
                                "en-US"
                              )}
                              {data.tomanIcon && (
                                <img src="/images/toman.svg" alt="/" />
                              )}
                            </p>
                          )}
                        </Box>
                      ) : (
                        <div></div>
                      )}
                    </>
                    <Box
                      sx={{
                        justifyContent: "flex-end",
                        marginTop:
                          product.discount < product.minPrice &&
                          product.discount > 0
                            ? "0px"
                            : "10px",
                      }}
                      className="flex  items-center"
                    >
                      {data.showPrice && (
                        <p className="text-base text-[#343A40] font-bold flex gap-1 items-center">
                          {/*          {product.minPrice !== product.maxPrice ||
                      product.hasRange > 0 ? (
                        <>از</>
                      ) : (
                        <></>
                      )} */}
                          {(product.discount < product.minPrice &&
                          product.discount > 0
                            ? product.discount
                            : product.minPrice
                          ).toLocaleString("en-US")}
                          {data.tomanIcon && (
                            <img
                              style={{
                                visibility:
                                  product.discount < product.minPrice &&
                                  product.discount > 0
                                    ? "hidden"
                                    : "visible",
                              }}
                              src="/images/toman.svg"
                              alt="/"
                            />
                          )}
                        </p>
                      )}
                    </Box>
                  </>
                </>
              )}
            </div>
          </div>
        </Box>
      ))}
    </Box>
  );
};

export default ProductgridGeneralH;
