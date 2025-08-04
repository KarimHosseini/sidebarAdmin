import React from "react";
import { useSelector } from "react-redux";
import { baseUrl, DOWNLOAD_FILE } from "../../../../../helpers/api-routes";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const BannerProduct = ({ data, allData }) => {
  const { companyInfo } = useSelector((state) => state.relationals);
  return (
    <div>
      <div className="flex justify-end items-center w-full">
        <div className="max-w-3xl flex items-center justify-end gap-3">
          {allData?.slice(0, 5).map((item, index) => (
            <div
              className="bg-white p-3 rounded-full relative cursor-pointer flex items-center justify-center"
              key={index}
            >
              {item.image ? (
                <img
                  loading="lazy"
                  className="object-contain overflow-hidden  w-[50px] h-[50px] lazyload blur-up rounded-full "
                  width={50}
                  height={50}
                  src={`${baseUrl}/${DOWNLOAD_FILE}/${item.image}`}
                  alt={item.alt || item.title}
                />
              ) : (
                <img
                  src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}`}
                  alt={item.title}
                  loading="lazy"
                  style={{ filter: "brightness(0.94)", opacity: "10%" }}
                  className="opacity-10 w-[50px] h-[50px] md:w-[50px] md:h-[50px]"
                />
              )}
              {item?.topDiscount ? <div className="text-[10px] text-white bg-red-500 rounded-lg py-1 px-2 -bottom-1 absolute -right-2">{item?.topDiscount } %</div> : <></>}
            </div>
          ))}
          {data?.moreLink && (
            <a
              href={
                process.env.REACT_APP_DOMAIN_URL +
                  "/" +
                  data?.moreLink?.slice(0, 1) ===
                "/"
                  ? data?.moreLink
                  : "/" + data?.moreLink
              }
              target="_blank"
              rel="noreferrer"
            >
              <div className="bg-white p-2 px-4 rounded-full relative flex items-center justify-center text-sm text-purple-700">
                مشاهده همه
                <KeyboardBackspaceIcon className="font-medium" />

              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerProduct;
