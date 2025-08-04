import { Box } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import { baseUrl, DOWNLOAD_FILE } from "../../../../../helpers/api-routes";

const Gridcategory = ({ data, allData }) => {
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
      }}
      className="grid  my-6"
    >
      {allData?.slice(0, data?.showCaseLimit || 3)?.map((item, index) => (
        <Box
          key={index}
          className="flex justify-center pt-3 flex-col items-center w-full"
          sx={{
            outline: data?.borderWidthElement
              ? `${data?.borderWidthElement}px solid #f1f2f4  !important`
              : "",
            borderRadius: data?.borderRaduisElement + "px",
          }}
        >
          {" "}
          <Box className="hover:scale-95 transition-all">
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
                style={{ borderRadius: data?.borderRaduisElement + "px" }}
                className=" w-[150px] h-[150px] lazyload blur-up "
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
                className="opacity-10 w-[80px] h-[80px] md:w-[100px] md:h-[100px]"
              />
            )}
          </Box>
          <p className="py-4 text-sm text-center md:font-normal  font-bold">
            {item.title}
          </p>
        </Box>
      ))}
    </Box>
  );
};

export default Gridcategory;
