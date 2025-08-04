import { useEffect, useState } from "react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Hooks

import { Box } from "@mui/material";
import GenralItems from "./itemCarousel";

export const GeneralSliderH = ({ allData, data }) => {
  const [showSLider, setShowSlider] = useState(false);
  useEffect(() => {
    setShowSlider(true);
  }, []);
  const [width, setWidth] = useState(1200);
  useEffect(() => {
    const updateWindowDimensions = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
    };

    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);
  const ShowNavigation = () => {
    if (width > 1024) {
      if (data.limited) {
        if (data.length > 4) {
          return true;
        } else {
          return false;
        }
      } else {
        if (data.length > 5) {
          return true;
        } else {
          return false;
        }
      }
    } else if (width > 768) {
      if (data.length > 3) {
        return true;
      } else {
        return false;
      }
    } else {
      if (data.length > 2) {
        return true;
      } else {
        return false;
      }
    }
  };
  return (
    <>
      {showSLider && width > 760 ? (
        <Swiper
          slidesPerView={
            width > 1250
              ? data.carouselNumber
              : width > 1050
              ? data.carouselNumber
              : width > 650
              ? 7
              : 3
          }
          spaceBetween={30}
          dir="rtl"
          navigation={ShowNavigation()}
          modules={[Navigation]}
        >
          {allData?.slice(0, data.limit)?.map((item, index) => (
            <SwiperSlide key={index}>
              <GenralItems data={data} product={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <>
          <Box className="overflow-x-auto scrollbar-hide overflow-y-hidden">
            <Box className=" w-full flex items-center gap-2 ">
              {allData?.slice(0, data.limit)?.map((item, index) => (
                <div className="w-48 " key={index}>
                  <GenralItems data={data} product={item} />
                </div>
              ))}
            </Box>
          </Box>
        </>
      )}
    </>
  );
};
