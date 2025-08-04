import { Box } from "@mui/system";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { baseUrl, DOWNLOAD_FILE } from "../../../../../../helpers/api-routes";

const GenralItems = ({
  product,
  Withanimation,
  filter = false,
  extraSmall = false,
  target = false,
  data,
}) => {
  const { companyInfo } = useSelector((state) => state.relationals);
  return (
    <>
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
          borderColor: data?.elementBorderColor || "#e5e7eb",
        }}
        className="w-full h-full overflow-hidden bg-white"
      >
        {data.showPromotion && (
          <Box
            sx={{
              borderTopRightRadius: data?.borderElementRaduisTop + "px",
              borderTopLeftRadius: data?.borderElementRaduisRight + "px",
              background: data?.promotionBg || "#FFA94D",
              color: data?.counterColor || "#fff",
              justifyContent:
                data.showCounter && !data.showPromotionIcon
                  ? "flex-end"
                  : "space-between",
              borderBottom: data.borderBottomPromotion
                ? `${data.borderBottomPromotion}px solid ${data.borderBottomPromotionColor}`
                : "",
            }}
            className="flex  items-center  px-4 h-[56px]"
          >
            {data.showPromotionIcon && (
              <img
                className="w-[50px]"
                src={companyInfo.promotionGalleryUrl}
                alt=""
              />
            )}
            {data.showCounter && <span>10:56:48</span>}
          </Box>
        )}

        <Box
          sx={{
            minHeight: {
              md: "350px ",
              xs: "320px",
            },
          }}
          className="px-3"
        >
          {data.showImg && (
            <Box
              sx={{
                height: {
                  md: "170px ",
                  xs: "170px ",
                },
              }}
              className="relative pb-3 getHoverd transition-all duration-200 ease-linear flex items-center rounded-lg justify-center w-full overflow-hidden"
            >
              {product.image ? (
                <img
                  loading="lazy"
                  className="object-cover overflow-hidden lazyload blur-up"
                  width={170}
                  height={170}
                  src={`${baseUrl}/${DOWNLOAD_FILE}/${product.image}`}
                  alt={product.alt || product.title}
                />
              ) : (
                <img
                  src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}`}
                  alt={product.title}
                  loading="lazy"
                  style={{ filter: "brightness(0.94)", opacity: "10%" }}
                  className="opacity-10 w-[80px] h-[80px] md:w-[100px] md:h-[100px]"
                />
              )}
            </Box>
          )}
          {data.showProductTitle && (
            <div className="h-[64px] flex items-start justify-start">
              <h3 className="md:text-[14px]  px-1 text-[#343A40] font-bold  leading-[32px] ellipsis-2">
                {product?.title?.length > 60 ? (
                  <>{product.title.slice(0, 60)}...</>
                ) : (
                  product.title
                )}
              </h3>
            </div>
          )}
          {data.showScore || data.showColor ? (
            <Box
              sx={{
                justifyContent:
                  data.showScore && !data.showColor
                    ? "flex-end"
                    : "space-between",
              }}
              className="flex items-center mt-2 h-[32px]"
            >
              {data.showColor && (
                <div className="flex gap-2 items-center">
                  {product?.colors?.slice(0, 3)?.map((color) => (
                    <Fragment key={color.value + color.imageUrl}>
                      <div
                        className="rounded-[6px] w-[16px] h-[16px]"
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
              {data?.showScore && (
                <div className="flex gap-1 items-center">
                  <img src="/images/star.svg" alt="" />{" "}
                  <img src="/images/star.svg" alt="" />{" "}
                  <img src="/images/star.svg" alt="" />{" "}
                  <img src="/images/fillstar.svg" alt="" />{" "}
                  <img src="/images/fillstar.svg" alt="" />
                </div>
              )}
            </Box>
          ) : (
            <></>
          )}

          <>
            {!product.available || product.maxPrice === 0 ? (
              <div className="flex items-center mt-4 gap-1 justify-center">
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
                      justifyContent:
                        data.showPrice && !data.showDelivery
                          ? "flex-end"
                          : "space-between",
                      marginTop:
                        product.discount < product.minPrice &&
                        product.discount > 0
                          ? "0px"
                          : "10px",
                    }}
                    className="flex  items-center"
                  >
                    {data.showDelivery && (
                      <img src="/images/truck.svg" alt="/" />
                    )}
                    {data.showPrice && (
                      <p className="text-lg text-[#343A40] font-bold flex gap-1 items-center">
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
                        ).toLocaleString("en-US")}{" "}
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
          </>
        </Box>
      </Box>
    </>
  );
};
export default GenralItems;
