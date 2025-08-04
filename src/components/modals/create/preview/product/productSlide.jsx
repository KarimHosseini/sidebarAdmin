import { useEffect, useState } from "react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Hooks

import { Box } from "@mui/material";
import { CategoryItem } from "./scrollItem";

export const CategorySlider = ({
  className = "my-8 pb-0.5",
  data,
  small,
  limited,
  filter,
  banner4Url = false,
  target = false,
  limit,
  carouselNumber,
  option
}) => {

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
      if (limited) {
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
          width > 1250 ? carouselNumber : width > 1050 ? carouselNumber  : width > 650 ? 7 : 3
        }
        spaceBetween={20}
          dir="rtl"
          navigation={ShowNavigation()}
          modules={[Navigation]}
          className={`group static my-swiper2 ${
            filter === "recommend" ? "recommendSlider" : ""
          }`}
        
        >
          {data?.slice(0, limit)?.map((item, index) => (
            <SwiperSlide key={index}>
              <CategoryItem
              data={option}
                product={item}
                extraSmall={filter === "recommend"}
                filter={filter}
                target={target}
              />
            </SwiperSlide>
          ))}
          {data.length > 3 && filter === "recommend" && (
            <SwiperSlide>
              {" "}
              <>
                <div className="w-full h-full ">
                  <div className="flex items-center md:h-[304px] h-[270px]  bg-[#fff] border rounded-lg flex-col justify-center">
                    {/*    <BsArrowLeftCircle className="text-2xl mb-4" /> */}
                    <span className="text-sm"> مشاهده همه </span>
                  </div>
                </div>
              </>
            </SwiperSlide>
          )}
        </Swiper>
      ) : (
        <>
          <Box
            sx={{
              height: {
                md: filter === "recommend" ? "355px" : "415px",
                xs: filter === "recommend" ? "355px" : "355px",
              },
            }}
            className="overflow-x-auto scrollbar-hide overflow-y-hidden"
          >
            <Box
              sx={{
                minWidth: "fit-content",
                height: filter === "recommend" ? "315px" : "unset",
              }}
              className=" w-full flex items-center gap-2 "
            >
              {filter === "recommend" && banner4Url && (
                <>
                  <>
                    {" "}
                    <div className="flex flex-col items-center justify-center">
                      <img
                        src={banner4Url}
                        alt=""
                        className=" bg-cover w-28 md:self-end self-center lazyload blur-up"
                      />
                      <span className="text-xs text-white"> مشاهده همه </span>
                    </div>{" "}
                  </>
                </>
              )}
              {data?.slice(0, limit)?.map((item, index) => (
                <div className="w-48 " key={index}>
                  <CategoryItem
                  data={option}
                    extraSmall={filter === "recommend"}
                    product={item}
                    filter={filter}
                  />
                </div>
              ))}
            </Box>
          </Box>
        </>
      )}
    </>
  );
};
