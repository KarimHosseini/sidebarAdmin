import { Box } from "@mui/system";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { baseUrl, DOWNLOAD_FILE } from "../../../../../helpers/api-routes";

export const CategoryItem = ({
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
          borderColor:data?.elementBorderColor || "#e5e7eb"
        }}
        className="w-auto h-full"
      >
        <Box
          sx={{
            "&:hover": {
              boxShadow: Withanimation ? " " : "",
              ".getHoverd": {
                height: { md: Withanimation ? "250px" : "160px" },
              },
            },
            p: Withanimation || filter === "recommend" ? 1 : 0,
            borderRadius: Withanimation || filter === "recommend" ? 2 : 0,
            background: filter === "recommend" ? "#fff" : "",
            minHeight: {
              md: Withanimation ? "370px" : "290px ",
              xs: Withanimation ? "350px" : "320px",
            },
          }}
          className="w-full flex flex-col justify-between  transition-all duration-200 ease-linear  cursor-pointer"
        >
          <Box
            sx={{
              background: filter === "recommend" ? "#fff" : "#f0f0f0",
              height: {
                md: Withanimation ? "270px" : "160px ",
                xs: Withanimation ? "200px" : "170px ",
              },
            }}
            className="relative pb-3 getHoverd transition-all duration-200 ease-linear flex items-center rounded-lg justify-center w-full overflow-hidden"
          >
            {product.image ? (
              <img
                loading="lazy"
                className="object-cover overflow-hidden lazyload blur-up"
                width={150}
                height={150}
                src={`${baseUrl}/${DOWNLOAD_FILE}/${product.image}`}
                alt={product.alt || product.title}
                style={{
                  filter: filter === "recommend" ? "" : "brightness(0.94)",
                }}
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
            <div className="absolute bottom-4 right-2 flex gap-2 items-center">
              {product?.colors?.map((color) => (
                <Fragment key={color.value + color.imageUrl}>
                  <div
                    className="rounded-full w-2 h-2"
                    style={{
                      background: color.imageUrl
                        ? `url(${color.imageUrl})`
                        : `${color.value}`,
                    }}
                  ></div>
                </Fragment>
              ))}
            </div>
          </Box>
          <div className="h-[50px] flex items-start justify-start">
            <span className="md:text-[0.8125rem] text-[0.7375rem] font-normal px-1 text-[#595959] flex-1 mt-3 md:hidden">
              {product?.title?.length > 80 ? (
                <>{product.title.slice(0, 80)}...</>
              ) : (
                product.title
              )}
            </span>
            <span className="md:text-[0.8125rem] text-[0.9375rem] font-normal px-1 text-[#595959] flex-1 mt-3 md:block hidden">
              {product?.title?.length > 70 ? (
                <>{product.title.slice(0, 70)}...</>
              ) : (
                product.title
              )}
            </span>
          </div>

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
              <div className="h-[40px] flex items-end justify-end">
                <div className="text-left mt-4 font-bold text-lg">
                  <>
                    <div className="gap-2">
                      {product.discount < product.minPrice &&
                      product.discount > 0 ? (
                        <div className="flex items-center justify-end gap-2">
                          <p className="  font-light text-sm text-gray-500 line-through">
                            {product.minPriceBeforeDiscount.toLocaleString(
                              "en-US"
                            )}
                          </p>
                          <div className="p-1 text-xs text-center  bg-[#feed00] ">
                            %{product.topDiscount}
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )}
                      <span className="text-lg">
                        {product.minPrice !== product.maxPrice ||
                        product.hasRange > 0 ? (
                          <>از</>
                        ) : (
                          <></>
                        )}
                        {(product.discount < product.minPrice &&
                        product.discount > 0
                          ? product.discount
                          : product.minPrice
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
          </>
        </Box>
      </Box>
    </>
  );
};
