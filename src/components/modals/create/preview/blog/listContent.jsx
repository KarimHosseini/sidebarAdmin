import React, { Fragment } from "react";
import { Box } from "@mui/material";
import { AiTwotoneCalendar } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { BsShareFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { baseUrl, DOWNLOAD_FILE } from "../../../../../helpers/api-routes";
const ListContent = ({ data, allData }) => {
  const { companyInfo } = useSelector((state) => state.relationals);

  return (
    <Box
      sx={
        {
          /*         gridTemplateColumns: {
          lg: data?.column
            ? `repeat(${data?.column},1fr) `
            : "repeat(auto-fit, minmax(200px, 1fr))",
          xs: "repeat(auto-fit, minmax(200px, 1fr))",
        }, */
          /*   gridTemplateRows: `repeat(${data?.row},1fr) `, */
        }
      }
      className="grid gap-5 my-6"
    >
      {allData?.slice(0, data?.showCaseLimit || 3)?.map((item, index) => (
        <Fragment key={item?.title + index + "summery"}>
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
              boxShadow: {
                md: "none",
                xs: "rgba(25, 25, 35, 0.15) 0px 1px 3px 0px",
              },
            }}
            className="flex gap-2 p-4 justify-between rounded-md md:border-b pb-6"
          >
            <div className="flex flex-col gap-2 justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-[#383e43] md:text-base text-sm font-bold">
                    {item?.title}
                  </h5>
                  {item.galleryId ? (
                    <img
                      loading="lazy"
                      className="block md:hidden w-[64px] h-[64px] lazyload blur-up"
                      src={`${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}?size=tiny`}
                      alt={item.alt || item.title}
                    />
                  ) : (
                    <img
                      src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}`}
                      alt={item.title}
                      loading="lazy"
                      style={{ filter: "brightness(0.94)", opacity: "10%" }}
                      className="block md:hidden w-[64px] h-[64px] lazyload blur-up"
                    />
                  )}
                </div>
                <div className="md:block hidden">
                  <span className="text-xs text-[#7d7d87]">
                    {item?.summery}{" "}
                  </span>
                </div>
              </div>
              <div className="flex items-center md:justify-start justify-between gap-5">
                <div className="flex items-center gap-1 text-[#7d7d87] text-xs">
                  <BiComment />6
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

            {item.galleryId ? (
              <img
                loading="lazy"
                className="md:block hidden w-[186px] h-[124px] rounded-sm lazyload blur-up"
                src={`${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}?size=tiny`}
                alt={item.alt || item.title}
              />
            ) : (
              <img
                src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}`}
                alt={item.title}
                loading="lazy"
                style={{ filter: "brightness(0.94)", opacity: "10%" }}
                className="md:block hidden w-[186px] h-[124px] rounded-sm lazyload blur-up"
              />
            )}
          </Box>
        </Fragment>
      ))}
    </Box>
  );
};

export default ListContent;
