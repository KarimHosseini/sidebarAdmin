import { ImageList, ImageListItem } from "@mui/material";
import { Box } from "@mui/system";
import ReactHtmlParse from "html-react-parser";
import React from "react";
import { AiTwotoneCalendar } from "react-icons/ai";
import { BsShareFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { baseUrl, DOWNLOAD_FILE } from "../../../../../helpers/api-routes";

const GridContent = ({ data, justImage, allData }) => {
  return (
    <div>
      {data?.gridType?.id === 4 ? (
        <ImageList variant="masonry" cols={data?.column} gap={data.gridGap}>
          {allData?.slice(0, data?.showCaseLimit || 3)?.map((item) => (
            <ImageListItem key={item.title}>
              <Cart justImage={justImage} item={item} data={data} />
            </ImageListItem>
          ))}
        </ImageList>
      ) : data?.gridType?.id === 3 ? (
        <>
          <ImageList
            variant="woven"
            cols={data?.column || 1}
            gap={data.gridGap}
          >
            {allData?.slice(0, data?.showCaseLimit || 3)?.map((item) => (
              <ImageListItem key={item.title}>
                <Cart justImage={justImage} item={item} data={data} />
              </ImageListItem>
            ))}
          </ImageList>
        </>
      ) : data?.gridType?.id === 2 ? (
        <ImageList
          variant="quilted"
          cols={4}
          rowHeight={195}
          gap={data.gridGap}
        >
          {allData?.slice(0, data?.showCaseLimit || 3)?.map((item, index) => (
            <ImageListItem
              key={item.title}
              cols={
                index === 0
                  ? 2
                  : index === 1
                  ? 1
                  : index === 2
                  ? 1
                  : index === 3
                  ? 2
                  : index === 4
                  ? 1
                  : index === 5
                  ? 1
                  : index === 6
                  ? 2
                  : index === 7
                  ? 2
                  : 1
              }
              rows={index === 0 || index === 6 ? 2 : 1}
            >
              <Cart
                justImage={justImage}
                variant="quilted"
                item={item}
                data={data}
              />
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <>
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
            className="grid my-6"
          >
            {" "}
            {allData?.slice(0, data?.showCaseLimit || 3)?.map((item, index) => (
              <Box
                sx={{
                  gridColumn:
                    data?.column > 1 && data?.gridTemplateColumn
                      ? `span ${
                          /*  (index + 1) % data?.column !== 0
                            ? data?.gridTemplateColumn[
                                (index + 1) % data?.column
                              ] || 1
                            : data?.gridTemplateColumn[data?.column] || 1 */ data
                            ?.gridTemplateColumn[index + 1] || 1
                        }/span ${data?.column}`
                      : `span 1/span ${data?.column}`,
                  border: data?.borderWidthElement
                    ? `${data?.borderWidthElement}px solid #f1f2f4  !important`
                    : "",
                  borderRadius: data?.borderRaduisElement + "px",
                }}
                key={item.title}
              >
                <Cart
                  justImage={justImage}
                  item={item}
                  borderRadius={data?.borderRaduisElement + "px"}
                  data={data}
                />
              </Box>
            ))}
          </Box>
        </>
      )}
    </div>
  );
};

export default GridContent;
const Cart = ({ item, index, justImage, data }) => {
  const { companyInfo } = useSelector((state) => state.relationals);
  const imageStyle = item?.imageStyle ? JSON.parse(item?.imageStyle) : null;

  return (
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
        ":hover": {
          img: {
            transform: !justImage && "scale(1.1)",
            transition: "all 300ms ease-in",
          },
        },
        img: {
          transform: "scale(1)",
          transition: "all 300ms ease-in",
        },
        /*       height:
          item?.possiton === 10 ||
          item?.possiton === 11 ||
          item?.possiton === 12
            ? "max-content"
            : "100%", */
      }}
      key={index}
      className="w-full relative"
    >
      {" "}
      {justImage && imageStyle?.showTitle && imageStyle?.possition === "up" && (
        <div className="w-full">
          {imageStyle?.showTitle && <>{ReactHtmlParse(item.title || "")}</>}
        </div>
      )}
      {item.galleryId || item.Image ? (
        <img
          loading="lazy"
          className="lazyload blur-up  object-cover h-full w-full"
          src={
            item.Image
              ? item.Image
              : `${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}`
          }
          alt={item.alt || item.title}
        />
      ) : (
        <img
          src={`${baseUrl}/${DOWNLOAD_FILE}/${companyInfo?.companyLogo}`}
          alt={item.title}
          loading="lazy"
          style={{ filter: "brightness(0.94)", opacity: "10%" }}
          className="lazyload blur-up  object-cover h-full w-full"
        />
      )}
      <>
        {" "}
        {/* <div className="absolute top-0 right-0 w-full h-full bg-black opacity-40 "></div> */}
        {justImage ? (
          <>
            {item?.title && imageStyle?.showTitle ? (
              <>
                {imageStyle?.possition === "in" ? (
                  <Box
                    sx={{
                      top: justImage ? `${item.top}%` : "40px",

                      left: justImage ? `${item.right}%` : "20px",
                      bottom: "0",
                      left: "0",
                      position: "absolute",
                    }}
                    style={{
                      transform: `translate(${
                        JSON.parse(item?.imageStyle).right
                      }%,-${imageStyle.top}%)`,
                    }}
                    className="  flex flex-col gap-5 z-50 w-fit h-fit"
                  >
                    {imageStyle?.showTitle && (
                      <>{ReactHtmlParse(item.title || "")}</>
                    )}
                  </Box>
                ) : (
                  imageStyle?.possition === "down" && (
                    <div className="w-full">
                      {" "}
                      {imageStyle?.showTitle && (
                        <>{ReactHtmlParse(item.title || "")}</>
                      )}
                    </div>
                  )
                )}
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            <Box
              sx={{
                top: justImage ? `${item.top}%` : "40px",

                left: justImage ? `${item.right}%` : "20px",
                bottom: "0",
                right: "0",

                position: "absolute",
              }}
              style={{
                transform: `translate(${item.right}%,-${item.top}%)`,
              }}
              className="  flex flex-col gap-5 z-50 w-fit h-fit"
            >
              {" "}
              <h2 className="text-base font-bold text-white"> {item.title}</h2>
              {item?.description && (
                <h2 className="text-xs font-bold text-white">
                  {" "}
                  {item.description}
                </h2>
              )}{" "}
            </Box>
          </>
        )}
        {}
        {!justImage && (
          <Box
            sx={{ bottom: "20px" }}
            className="absolute  right-0 flex justify-between w-full px-5 items-center"
          >
            <div className="flex items-center gap-1 text-[#fff] text-xs">
              <AiTwotoneCalendar />
              14 ساعت پیش
            </div>
            <div className="flex items-center gap-1 text-[#fff] text-xs">
              <BsShareFill /> اشتراک‌گذاری
            </div>
          </Box>
        )}
      </>
    </Box>
  );
};
