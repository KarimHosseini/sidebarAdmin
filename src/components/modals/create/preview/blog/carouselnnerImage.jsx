import { Box } from "@mui/material";
import React from "react";
import { AiTwotoneCalendar } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { baseUrl, DOWNLOAD_FILE } from "../../../../../helpers/api-routes";

const CarouselnnerImage = ({ data, justImage, allData }) => {
  const { companyInfo } = useSelector((state) => state.relationals);

  return (
    <div>
      {" "}
      <Swiper
        slidesPerView={data?.carouselNumber}
        spaceBetween={"10px"}
        dir="rtl"
        navigation={{
          nextEl: ".swiper3-button-next",
          prevEl: ".swiper3-button-prev",
        }}
        modules={[Navigation]}
        className={`swiper3 $`}
        loop={false}
      >
        {allData?.slice(0, data?.showCaseLimit || 3)?.map((item, index) => (
          <SwiperSlide key={index}>
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
                borderColor: data?.elementBorderColor || "#e5e7eb",
                ":hover": {
                  img: {
                    transform: !justImage ? "scale(110%)" : "",
                    transition: "all 500ms",
                  },
                },
              }}
              className="w-full relative overflow-hidden"
            >
              {item.galleryId || item.Image ? (
                <img
                  loading="lazy"
                  className="w-full object-cover h-56 rounded-t lazyload blur-up"
                  src={
                    item.Image
                      ? item.Image
                      : `${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}`
                  }
                  alt={item.alt || item.title}
                />
              ) : (
                <img
                  src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}`}
                  alt={item.title}
                  loading="lazy"
                  style={{ filter: "brightness(0.94)", opacity: "10%" }}
                  className="w-full h-56  rounded-t lazyload blur-up"
                />
              )}
              {!justImage && (
                <>
                  {" "}
                  <div className="absolute top-0 right-0 w-full h-full bg-black opacity-40 "></div>
                  <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-full text-center px-3">
                    <h2 className="text-base font-bold text-white">
                      {" "}
                      {item.title}
                    </h2>
                  </div>
                  <div className="absolute bottom-3 right-4">
                    <div className="flex gap-3 text-white text-xs items-center">
                      <AiTwotoneCalendar />
                      14 ساعت پیش
                    </div>
                  </div>
                </>
              )}
            </Box>
          </SwiperSlide>
        ))}{" "}
      </Swiper>
    </div>
  );
};

export default CarouselnnerImage;
const breakpoints = {
  1024: {
    slidesPerView: 4,
    spaceBetween: 30,
  },
  768: {
    slidesPerView: 3,
    spaceBetween: 25,
  },
  680: {
    slidesPerView: 2,
    spaceBetween: 16,
  },
  0: {
    slidesPerView: 1,
    spaceBetween: 20,
  },
};
