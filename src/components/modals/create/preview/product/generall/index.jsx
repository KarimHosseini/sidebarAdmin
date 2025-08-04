import { useEffect, useMemo, useState } from "react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Hooks

import { Box } from "@mui/material";
import { baseUrl, DOWNLOAD_FILE } from "../../../../../../helpers/api-routes";
import GenralItems from "./genralItems";

export const GeneralSlider = ({ allData, data, filter, banner }) => {
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
  const dataIMage = useMemo(() => {
    return banner?.find((item) => item.screenSize === 1200);
  }, [banner]);
  return (
    <div className="flex gap-3 items-center">
      {filter === "recommend" && (
        <div className="h-full min-w-[250px] px-3 flex justify-center items-center">
          {dataIMage ? (
            <img
              src={
                dataIMage.Image
                  ? dataIMage.Image
                  : `${baseUrl}/${DOWNLOAD_FILE}/${dataIMage?.galleryId}`
              }
              alt=""
              className="w-full "
            />
          ) : (
            <></>
          )}
        </div>
      )}
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
          spaceBetween={20}
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
    </div>
  );
};
