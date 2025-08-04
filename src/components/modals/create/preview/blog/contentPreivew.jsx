import { Box } from "@mui/material";
import React, { Fragment, useState } from "react";
import { AiTwotoneCalendar } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { BsShareFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { baseUrl, DOWNLOAD_FILE } from "../../../../../helpers/api-routes";

const ContentPreivew = ({ data, allData }) => {
  const [select, setSelect] = useState(allData ? allData[0] : {});
  const [selected, setSelected] = useState(0);
  const { companyInfo } = useSelector((state) => state.relationals);

  return (
    <div className="grid md:grid-cols-4 gap-8 my-6">
      <div className="flex flex-col gap-4">
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
          borderColor:data?.elementBorderColor || "#e5e7eb"
            }}
            key={item?.title + index + "summery"}
          >
            <Box
              sx={{
                borderLeft:
                  selected === index ? "4px solid #198dff" : "4px solid #fff",
                transition: "all 500ms",
              }}
              onClick={() => {
                setSelect(item);
                setSelected(index);
              }}
              className="flex items-center gap-2 px-2  py-4 mb-2 cursor-pointer"
            >
              {item.galleryId ? (
                <img
                  loading="lazy"
                  className="w-[72px] h-[48px] lazyload blur-up"
                  src={`${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}`}
                  alt={item.alt || item.title}
                />
              ) : (
                <img
                  src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}`}
                  alt={item.title}
                  loading="lazy"
                  style={{ filter: "brightness(0.94)", opacity: "10%" }}
                  className="w-[72px] h-[48px] lazyload blur-up"
                />
              )}
              <span className="text-[#383e43] md:text-base text-base ">
                {item?.title}
              </span>
            </Box>
          </Box>
        ))}
      </div>
      <div className="col-span-3 flex flex-col gap-6">
        {select?.galleryId ? (
          <img
            loading="lazy"
            className="w-[72px] h-[48px] lazyload blur-up"
            src={`${baseUrl}/${DOWNLOAD_FILE}/${select?.galleryId}`}
            alt={select?.alt || select?.title}
          />
        ) : (
          <img
            src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}`}
            alt={select?.title}
            loading="lazy"
            style={{ filter: "brightness(0.94)", opacity: "10%" }}
            className="w-[72px] h-[48px] lazyload blur-up"
          />
        )}
        <span className="text-[#383e43] md:text-2xl text-sm  font-bold">
          {select?.title}
        </span>
        <div className="flex flex-col gap-2">
          <p className="text-base text-[#383e43]">{select?.summery}</p>
          <a className="text-blue-700 text-base">بیشتر بخوانید</a>
        </div>
        <div className="flex w-full items-center md:justify-start justify-between gap-5">
          <div className="flex items-center gap-1 text-[#7d7d87] text-sm">
            <BiComment />6
          </div>
          <div className="flex items-center gap-1 text-[#7d7d87] text-sm">
            <AiTwotoneCalendar />
            14 ساعت پیش
          </div>
          <div className="flex items-center gap-1 text-[#7d7d87] text-sm">
            <BsShareFill /> اشتراک‌گذاری
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPreivew;
