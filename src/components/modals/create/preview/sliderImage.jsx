// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Fragment } from "react";
import { Autoplay, Navigation, Pagination } from "swiper";
import { baseUrl, DOWNLOAD_FILE } from "../../../../helpers/api-routes";
import { Box } from "@mui/material";

const Slider = ({ allData, data }) => {
  return (
    <div className=" overflow-hidden md:my-8 md:max-h-[300px]">
      <Swiper
        navigation={true}
        pagination={{
          clickable: true,
        }}
        loop={true}
        modules={[Navigation, Pagination, Autoplay]}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        speed={400}
        className=" overflow-hidden swiperPagination"
        style={{ borderRadius: data?.borderRaduisElement + "px" }}
      >
        {allData?.map((banner, index) => (
          <Fragment key={index}>
            {(!banner?.screenSize || banner?.screenSize === 1200) && (
              <SwiperSlide
                style={{ borderRadius: data?.borderRaduisElement + "px" }}
                className=" overflow-hidden"
              >
                <div className="relative max-h-[575px]">
                  <>
                    {" "}
                    <Box
                      component={"img"} /* + "?size=tiny" */
                      sx={{
                        borderRadius: data?.borderRaduisElement + "px",
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
                      className=" overflow-hidden xl:w-[1400px] h-[290px] object-cover w-full lazyload blur-up"
                      src={
                        banner.Image
                          ? banner.Image
                          : `${baseUrl}/${DOWNLOAD_FILE}/${banner.galleryId}`
                      }
                      data-sizes="auto"
                      alt={banner.alt || "banner"}
                    />
                    {banner?.title && banner?.showTitle && (
                      <Box
                        sx={{
                          top: `${banner.top}%`,

                          left: `${banner.right}%`,
                          bottom: "0",
                          right: "0",

                          position: "absolute",
                        }}
                        style={{
                          transform: `translate(${banner.right}%,-${banner.top}%)`,
                        }}
                        className="  flex flex-col gap-5 z-50 w-fit h-fit"
                      >
                        {banner?.showTitle && (
                          <>
                            <h2
                              style={{
                                color: banner?.titleColor,
                                fontSize: banner?.fontTitleSize,
                                fontWeight: banner?.fontTitleWeight,
                              }}
                              className="text-base font-bold "
                            >
                              {" "}
                              {banner.title}
                            </h2>
                            {banner?.description && (
                              <h2
                                style={{
                                  color: banner?.titleColor,
                                  fontSize: banner?.fontDescriptionSize,
                                  fontWeight: banner?.fontDescriptionWeight,
                                }}
                                className="text-xs font-bold "
                              >
                                {" "}
                                {banner.description}
                              </h2>
                            )}
                          </>
                        )}
                      </Box>
                    )}
                  </>
                </div>
              </SwiperSlide>
            )}
          </Fragment>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
