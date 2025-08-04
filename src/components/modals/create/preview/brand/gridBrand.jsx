import { Box } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import { baseUrl, DOWNLOAD_FILE } from "../../../../../helpers/api-routes";

const GridBrand = ({ data, allData }) => {
  const { companyInfo } = useSelector((state) => state.relationals);
  return (
    <Box
      sx={{
        gridTemplateColumns: {
          lg: data?.column
            ? `repeat(${data?.column},1fr) `
            : "repeat(auto-fit, minmax(200px, 1fr))",
          xs: "repeat(auto-fit, minmax(200px, 1fr))",
        },
        gridTemplateRows: `repeat(${data?.row},1fr) `,
        gap: data.gridGap + "px",
        /*    backgroundColor: " #f1f2f4", */
      }}
      className="grid  my-6  rounded-md "
    >
      {allData?.slice(0, data?.showCaseLimit || 3)?.map((item, index) => (
        <Box
          key={index}
          className="flex  z-10  flex-col items-center justify-center w-full cursor-pointer"
          sx={{
            outline: data?.borderWidthElement
              ? `${data?.borderWidthElement}px solid #f1f2f4  !important`
              : "",
            borderRadius: data?.borderRaduisElement + "px",
          }}
        >
          {" "}
          <div className="hover:scale-95 transition-all">
            {" "}
            {item.galleryId ? (
              <Box
                component={"img"}
                sx={{
                  borderTopWidth: `${data?.elementBorderTop}px !important`,
                  borderRightWidth: `${data?.elementBorderRight}px !important`,
                  borderBottomWidth: `${data?.elementBorderBottom}px !important`,
                  borderLeftWidth: `${data?.elementBorderLeft}px !important`,
                  borderTopRightRadius: data?.borderElementRaduisTop + "px",
                  borderTopLeftRadius: data?.borderElementRaduisRight + "px",
                  borderBottomLeftRadius:
                    data?.borderElementRaduisBottom + "px",
                  borderBottomRightRadius: data?.borderElementRaduisLeft + "px",
          borderColor:data?.elementBorderColor || "#e5e7eb"
                }}
                loading="lazy"
                className="rounded-full w-[60px] h-[60px] lazyload blur-up "
                src={`${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}`}
                alt={item.alt || item.title}
              />
            ) : (
              <Box
                component={"img"}
                sx={{
                  borderTopWidth: `${data?.elementBorderTop}px !important`,
                  borderRightWidth: `${data?.elementBorderRight}px !important`,
                  borderBottomWidth: `${data?.elementBorderBottom}px !important`,
                  borderLeftWidth: `${data?.elementBorderLeft}px !important`,
                  borderTopRightRadius: data?.borderElementRaduisTop + "px",
                  borderTopLeftRadius: data?.borderElementRaduisRight + "px",
                  borderBottomLeftRadius:
                    data?.borderElementRaduisBottom + "px",
                  borderBottomRightRadius: data?.borderElementRaduisLeft + "px",
          borderColor:data?.elementBorderColor || "#e5e7eb"
                }}
                src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}`}
                alt={item.title}
                loading="lazy"
                style={{ filter: "brightness(0.94)", opacity: "10%" }}
                className="rounded-full w-[60px] h-[60px] lazyload blur-up "
              />
            )}
          </div>
          <p className="py-4 text-sm text-center md:font-normal  font-bold">
            {item.title}
          </p>
        </Box>
      ))}
    </Box>
  );
};

export default GridBrand;
