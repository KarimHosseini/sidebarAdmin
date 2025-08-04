import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  AiOutlineLeft,
  AiOutlineRight,
  AiTwotoneCalendar,
} from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { BsShareFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { baseUrl, DOWNLOAD_FILE } from "../../../../../helpers/api-routes";
const BlogSlider1 = ({ data, allData }) => {
  const { companyInfo } = useSelector((state) => state.relationals);

  return (
    <div className="flex gap-1">
      {" "}
      <div className="swiper3-button-prev">
        <AiOutlineRight />
      </div>
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
        /*         loop={allData?.length > 5} */
      >
        {allData?.slice(0, data?.showCaseLimit || 3)?.map((item, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                boxShadow: "  0 1px 3px 0 #383e4330",
                borderRadius: data?.borderRaduisElement + "px",
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
              className="w-full rounded overflow-hidden"
            >
              {" "}
              {item.galleryId ? (
                <Box
                  component={"img"}
           
                  loading="lazy"
                  className="w-full object-cover h-56 rounded-t lazyload blur-up"
                  src={`${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}`}
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
              <div className="flex flex-col justify-between py-4 px-3">
                <span className="text-[#383e43] text-sm font-bold">
                  {item?.title}
                </span>{" "}
                <div className="flex items-center md:justify-start justify-between gap-5 mt-7">
                  <div className="flex items-center gap-1 text-[#7d7d87] text-xs">
                    <BiComment />
                    {item?.points}
                  </div>
                  <div className="flex items-center gap-1 text-[#7d7d87] text-xs">
                    <AiTwotoneCalendar />
                    14 ساعت پیش
                  </div>
                  <div className="flex items-center gap-1 text-[#7d7d87] text-xs">
                    <BsShareFill /> اشتراک‌گذاری
                  </div>
                </div>
              </div>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>{" "}
      <div className="swiper3-button-next">
        <AiOutlineLeft />
      </div>
    </div>
  );
};

export default BlogSlider1;
