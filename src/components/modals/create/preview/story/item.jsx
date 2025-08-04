/* eslint-disable jsx-a11y/alt-text */
import CloseIcon from "@mui/icons-material/Close";
import { Box, Modal as NewModal } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Items = ({ item }) => {
  const [clicked, setClicked] = useState(false);
  const [open, setOpen] = useState(false);
  const close = () => {
    setOpen(false);
    setClicked(false);
  };
  const [indexOfImage, setindexOfImage] = useState(0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (clicked) {
      setTimeout(() => {
        setClicked(false);
        setOpen(true);
      }, 3000);
    }
  }, [clicked]);
  const { themeColor } = useSelector((state) => state.themeColor);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { md: "auto", xs: "100%" },
    bgcolor: "transparent",
    px: 1,
    borderRadius: "20px",
    maxHeight: "100%",
    maxWidth: { md: "95%", xs: "98%" },
    overflowY: "hidden",
  };

  const onAutoplayTimeLeft = (s, time, progress) => {
    setProgress(progress);

    if (
      item?.content?.filter((c) => c && c.screenSize === 1200)?.length ===
        indexOfImage + 1 &&
      parseInt((1 - progress) * 100) === 100
    ) {
      setClicked(false);
      setOpen(false);
    }
  };
  return (
    <>
      {" "}
      <div
        className="flex flex-col items-center cursor-pointer select-none"
        onClick={() => {
          setClicked(true);
        }}
      >
        <div className="w-[100px] h-[100px] relative">
          <img src={item?.banner?.Image} className="story_image" />
          <svg
            style={{ borderColor: "#ed1b34" }}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            /*     xml:space="preserve" */
            className={`story_cricle marked ${clicked ? "story_in" : ""}`}
          >
            <circle cx="50" cy="50" r="40"></circle>
          </svg>
        </div>
        <span className="stroyTitle">{item?.title}</span>
      </div>{" "}
      <NewModal
        onClose={close}
        open={open}
        closeAfterTransition
        classes={{ root: "storyModal" }}
      >
        <Box sx={{ ...style }}>
          <Box
            className={`${
              themeColor === "dark" ? "darkMode" : ""
            } flex justify-center`}
          >
            <Swiper
              spaceBetween={30}
              centeredSlides={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              navigation={{
                nextEl: ".button-next-slide",
                prevEl: ".button-prev-slide",
              }}
              speed={1000}
              onSlideChange={(e) => {
                setProgress(0);
                setindexOfImage(e.activeIndex);
              }}
              modules={[Autoplay, Navigation]}
              onAutoplayTimeLeft={onAutoplayTimeLeft}
              className="historySwiper relative"
            >
              {" "}
              <div className="absolute top-2 w-full flex px-3 gap-3 z-50">
                {item?.content
                  ?.filter((c) => c && c.screenSize === 1200)
                  ?.map((content, i) => (
                    <Box
                      sx={{
                        background: indexOfImage > i ? "#fff" : "#ccc",
                      }}
                      key={i + 1 + "few"}
                      className="flex-1 h-[5px] rounded-md relative"
                    >
                      {indexOfImage === i ? (
                        <Box
                          sx={{ width: `${(1 - progress) * 100}%` }}
                          className="absolute h-full bg-white rounded-md"
                        ></Box>
                      ) : (
                        <></>
                      )}
                    </Box>
                  ))}
              </div>
              {item?.content
                ?.filter((c) => c && c.screenSize === 1200)
                ?.map((content, i) => (
                  <Fragment>
                    {content && (
                      <SwiperSlide key={i}>
                        <Box
                          className="h-[98vh] w-full relative"
                          sx={{
                            background: `url(${content.Image}) no-repeat center center`,
                            backgroundSize: "cover",
                          }}
                        >
                          {" "}
                          <div className="absolute top-6 w-full z-50">
                            <div className="flex justify-between items-center px-10">
                              <div className="flex items-center gap-4 ">
                                <img
                                  src={content?.Image}
                                  className="w-[60px] h-[60px] rounded-full"
                                />

                                <span className="text-lg text-white">
                                  {content?.title}
                                </span>
                              </div>{" "}
                              <div
                                onClick={close}
                                className=" p-2 flex justify-center items-center rounded-lg bg-[#00000072]"
                              >
                                {" "}
                                <CloseIcon sx={{ color: "#fff" }} />
                              </div>
                            </div>
                          </div>
                          {content?.title && content?.showTitle && (
                            <Box
                              sx={{
                                top: `${content.top}%`,

                                left: `${content.right}%`,
                                bottom: "0",
                                right: "0",

                                position: "absolute",
                              }}
                              style={{
                                transform: `translate(${content.right}%,-${content.top}%)`,
                              }}
                              className="  flex flex-col gap-5 z-50 w-fit h-fit"
                            >
                              {content?.showTitle && (
                                <>
                                  <h2
                                    style={{
                                      color: content?.titleColor,
                                      fontSize: content?.fontTitleSize,
                                      fontWeight: content?.fontTitleWeight,
                                    }}
                                    className="text-base font-bold "
                                  >
                                    {" "}
                                    {content.title}
                                  </h2>
                                  {content?.description && (
                                    <h2
                                      style={{
                                        color: content?.titleColor,
                                        fontSize: content?.fontDescriptionSize,
                                        fontWeight:
                                          content?.fontDescriptionWeight,
                                      }}
                                      className="text-xs font-bold "
                                    >
                                      {" "}
                                      {content.description}
                                    </h2>
                                  )}
                                </>
                              )}
                            </Box>
                          )}
                        </Box>
                      </SwiperSlide>
                    )}
                  </Fragment>
                ))}
              <div className="absolute group-hover:right-0 right-[2rem] duration-0 top-[43%] z-10  button-prev-slide ">
                <ArrowForwardIosIcon
                  sx={{
                    width: "36px",
                    height: "36px",
                    color: "#191e20db",
                    p: "7px",
                    backgroundColor: "#fff",
                    borderRadius: "40px",
                    cursor: "pointer",
                  }}
                />
              </div>
              <div className="absolute group-hover:left-0 left-[2rem] duration-0 top-[43%]  z-10 button-next-slide">
                <ArrowBackIosNewIcon
                  sx={{
                    width: "36px",
                    height: "36px",
                    color: "#191e20db",
                    p: "7px",
                    backgroundColor: "#fff",
                    borderRadius: "40px",
                    cursor: "pointer",
                  }}
                />
              </div>
            </Swiper>
          </Box>
        </Box>
      </NewModal>
    </>
  );
};

export default Items;
