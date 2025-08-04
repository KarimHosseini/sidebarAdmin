import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { baseUrl, DOWNLOAD_FILE } from "../../../../../helpers/api-routes";
const ScrollBrand = ({ data, allData }) => {
  const [width, setWidth] = useState(1200);
  useEffect(() => {
    const updateWindowDimensions = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
    };

    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);
  const { companyInfo } = useSelector((state) => state.relationals);

  return (
    <div className="my-8 border rounded-md py-4 md:px-12 md:mx-0 mx-3 relative">
      {" "}
      {width > 760 ? (
        <Swiper
        slidesPerView={
          width > 1250 ? data?.carouselNumber : width > 1050 ? data?.carouselNumber  : width > 650 ? 7 : 3
        }
          dir="rtl"
          navigation={true}
          modules={[Navigation]}
          className={`group static my-swiper3 `}
          loop={false}
        >
          {allData?.slice(0, data?.showCaseLimit || 3)?.map((item, index) => (
            <SwiperSlide
              style={{
                borderRight:
                  index === allData.length + 1 ? "0px" : "1px solid #f1f2f4",
              }}
              key={index}
            >
              <div className="px-2">
                <div className="flex justify-center items-center">
                  {item.galleryId ? (
                    <Box
                    component={"img"}
                    sx={{
                      borderTopWidth: `${data?.elementBorderTop}px !important`,
                      borderRightWidth: `${data?.elementBorderRight}px !important`,
                      borderBottomWidth: `${data?.elementBorderBottom}px !important`,
                      borderLeftWidth: `${data?.elementBorderLeft}px !important`,
                      borderTopRightRadius: data?.borderElementRaduisTop + "px",
                      borderTopLeftRadius: data?.borderElementRaduisRight + "px",
                      borderBottomLeftRadius:
                        data?.borderElementRaduisBottom + "px",
                      borderBottomRightRadius: data?.borderElementRaduisLeft + "px",
          borderColor:data?.elementBorderColor || "#e5e7eb"
                    }}
                      loading="lazy"
                      className="w-[110px] h-[110px] "
                      src={`${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}`}
                      alt={item.alt || item.title}
                    />
                  ) : (
                    <Box
                    component={"img"}
                    sx={{
                      borderTopWidth: `${data?.elementBorderTop}px !important`,
                      borderRightWidth: `${data?.elementBorderRight}px !important`,
                      borderBottomWidth: `${data?.elementBorderBottom}px !important`,
                      borderLeftWidth: `${data?.elementBorderLeft}px !important`,
                      borderTopRightRadius: data?.borderElementRaduisTop + "px",
                      borderTopLeftRadius: data?.borderElementRaduisRight + "px",
                      borderBottomLeftRadius:
                        data?.borderElementRaduisBottom + "px",
                      borderBottomRightRadius: data?.borderElementRaduisLeft + "px",
          borderColor:data?.elementBorderColor || "#e5e7eb"
                    }}
                      src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}`}
                      alt={item.title}
                      loading="lazy"
                      style={{ filter: "brightness(0.94)", opacity: "10%" }}
                      className="w-[110px] h-[110px] object-cover"
                    />
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <>
          <Box className="overflow-x-auto scrollbar-hide overflow-y-hidden">
            <Box
              sx={{
                minWidth: "fit-content",
              }}
              className=" w-full flex items-center gap-2 "
            >
              {allData?.map((item, index) => (
                <div key={index} className="w-[60px] h-[60px]">
                  <div className="flex justify-center items-center">
                    <img
                      alt=""
                      className="w-[60px] h-[60px] object-cover"
                      src={item?.imageUrl}
                    />
                  </div>
                </div>
              ))}
            </Box>
          </Box>
        </>
      )}
    </div>
  );
};

export default ScrollBrand;

