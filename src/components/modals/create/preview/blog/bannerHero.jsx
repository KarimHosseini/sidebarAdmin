import { useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { baseUrl, DOWNLOAD_FILE } from "../../../../../helpers/api-routes";
const BlogHero = ({ data, allData, justImage }) => {
  const isLg = useMediaQuery("(min-width:1050px)");
  const { companyInfo } = useSelector((state) => state.relationals);

  return (
    <>
      {isLg ? (
        <Box
          sx={{
            gridTemplateColumns: {
              lg: data?.column
                ? `repeat(${data?.column},1fr) `
                : "repeat(auto-fit, minmax(200px, 1fr))",
              xs: "repeat(auto-fit, minmax(200px, 1fr))",
            },
            gridTemplateRows: `repeat(${data?.row},1fr) `,
          }}
          className="grid  my-6"
        >
          {allData?.slice(0, data?.showCaseLimit || 3)?.map((item, index) => (
            <Box
              sx={{
                borderRadius: data?.borderRaduisElement + "px",
                borderTopWidth: `${data?.elementBorderTop}px !important`,
                borderRightWidth: `${data?.elementBorderRight}px !important`,
                borderBottomWidth: `${data?.elementBorderBottom}px !important`,
                borderLeftWidth: `${data?.elementBorderLeft}px !important`,
                borderTopRightRadius: data?.borderElementRaduisTop + "px",
                borderTopLeftRadius: data?.borderElementRaduisRight + "px",
                borderBottomLeftRadius: data?.borderElementRaduisBottom + "px",
                borderBottomRightRadius: data?.borderElementRaduisLeft + "px",
          borderColor:data?.elementBorderColor || "#e5e7eb",
                ":hover": {
                  img: {
                    transform: "scale(110%)",
                    transition: "all 500ms",
                  },
                },
              }}
              key={index}
              className="w-full relative overflow-hidden "
            >
              {item.galleryId || item.Image ? (
                <img
                  loading="lazy"
                  className="lazyload blur-up min-h-[380px] object-cover"
                  src={
                    item.Image
                      ? item.Image
                      : `${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}?size=tiny`
                  }
                  alt={item.alt || item.title}
                />
              ) : (
                <img
                  src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}`}
                  alt={item.title}
                  loading="lazy"
                  style={{ filter: "brightness(0.94)", opacity: "10%" }}
                  className="lazyload blur-up min-h-[380px] object-cover"
                />
              )}
              <div className="absolute top-0 right-0 w-full h-full bg-black opacity-40 "></div>
              {justImage ? (
                <>
                  {item?.showTitle && (
                    <>
                      <h2
                        style={{
                          color: item?.titleColor,
                          fontSize: item?.fontTitleSize,
                          fontWeight: item?.fontTitleWeight,
                        }}
                        className="text-base font-bold "
                      >
                        {" "}
                        {item.title}
                      </h2>
                      {item?.description && (
                        <h2
                          style={{
                            color: item?.titleColor,
                            fontSize: item?.fontDescriptionSize,
                            fontWeight: item?.fontDescriptionWeight,
                          }}
                          className="text-xs font-bold "
                        >
                          {" "}
                          {item.description}
                        </h2>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-base font-bold text-white">
                    {" "}
                    {item.title}
                  </h2>
                </>
              )}
            </Box>
          ))}
        </Box>
      ) : (
        <Swiper
          navigation={true}
          loop={true}
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 8000,
            disableOnInteraction: false,
          }}
          speed={400}
        >
          {allData?.slice(0, data?.showCaseLimit || 3)?.map((item, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  ":hover": {
                    img: {
                      transform: "scale(110%)",
                      transition: "all 500ms",
                    },
                  },
                }}
                key={index}
                className="w-full relative overflow-hidden"
              >
                {item.galleryId ? (
                  <img
                    loading="lazy"
                    className="lazyload blur-up"
                    src={`${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}?size=tiny`}
                    alt={item.alt || item.title}
                  />
                ) : (
                  <img
                    src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}`}
                    alt={item.title}
                    loading="lazy"
                    style={{ filter: "brightness(0.94)", opacity: "10%" }}
                    className="lazyload blur-up"
                  />
                )}
                <div className="absolute top-0 right-0 w-full h-full bg-black opacity-40 "></div>
                <div className="absolute bottom-5 right-5">
                  <h2 className="text-base font-bold text-white">
                    {" "}
                    {item.title}
                  </h2>
                </div>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
};

export default BlogHero;
