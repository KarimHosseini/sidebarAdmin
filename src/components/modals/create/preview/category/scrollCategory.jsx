import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { baseUrl, DOWNLOAD_FILE } from "../../../../../helpers/api-routes";
const ScrollCategory = ({ data, allData }) => {
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
    <>
      {width > 760 ? (
        <Swiper
          slidesPerView={
            width > 1250
              ? data?.carouselNumber
              : width > 1050
              ? data?.carouselNumber
              : width > 650
              ? 7
              : 3
          }
          spaceBetween={7}
          freeMode={true}
          modules={[FreeMode]}
          className="cardSwiper"
        >
          {allData?.slice(0, data?.showCaseLimit || 3)?.map((item, index) => (
            <SwiperSlide key={index}>
              <>
                <>
                  <Box className="flex justify-around flex-col items-center min-w-[60px]">
                    <div className="hover:scale-95 transition-all">
                      {" "}
                      {item.galleryId ? (
                        <Box
                          component={"img"}
                          sx={{
                            borderTopWidth: `${data?.elementBorderTop}px !important`,
                            borderRightWidth: `${data?.elementBorderRight}px !important`,
                            borderBottomWidth: `${data?.elementBorderBottom}px !important`,
                            borderLeftWidth: `${data?.elementBorderLeft}px !important`,
                            borderTopRightRadius:
                              data?.borderElementRaduisTop + "px",
                            borderTopLeftRadius:
                              data?.borderElementRaduisRight + "px",
                            borderBottomLeftRadius:
                              data?.borderElementRaduisBottom + "px",
                            borderBottomRightRadius:
                              data?.borderElementRaduisLeft + "px",
                          }}
                          loading="lazy"
                          className=" w-[95px] h-[95px] lazyload blur-up "
                          src={`${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}`}
                          alt={item.alt || item.title}
                        />
                      ) : (
                        <img
                          src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}`}
                          alt={item.title}
                          loading="lazy"
                          style={{ filter: "brightness(0.94)", opacity: "10%" }}
                          className="rounded-full w-[95px] h-[95px] lazyload blur-up "
                        />
                      )}
                    </div>

                    <p className="py-4 text-sm text-center md:font-normal  font-bold">
                      {item.title}
                    </p>
                  </Box>
                </>
              </>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <>
          {" "}
          <div className="overflow-x-auto scrollbar-hide overflow-y-hidden">
            <Box
              sx={{
                minWidth: "fit-content",
              }}
              className=" w-full flex items-center gap-2 "
            >
              {allData?.map((item, index) => (
                <Fragment key={index}>
                  <>
                    <>
                      <div className="flex justify-around flex-col items-center min-w-[110px]">
                        <img
                          loading="lazy"
                          className="rounded-full w-[95px] h-[95px] lazyload blur-up "
                          alt={item.alt || item.title}
                          src={
                            item.imageUrl
                              ? /* `${IMAGES_ENDPOINT}/${.image}` */ item.imageUrl
                              : "/assets/images/home/category/accesories.webp"
                          }
                        />
                        <p className="py-4 text-sm text-center md:font-normal  font-bold">
                          {item.title}
                        </p>
                      </div>
                    </>
                  </>
                </Fragment>
              ))}
            </Box>
          </div>
        </>
      )}
    </>
  );
};

export default ScrollCategory;
