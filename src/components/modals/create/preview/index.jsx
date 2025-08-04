import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Tooltip,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { Suspense, useState } from "react";

import datas from "./product/p.json";

import ReactHtmlParse from "html-react-parser";
import BannerProduct from "./product/banner";
import { GeneralSlider } from "./product/generall";
import ProductgridGeneral from "./product/generall/grid";
import { GeneralSliderH } from "./product/generelH";
import ProductgridGeneralH from "./product/generelH/gridGenralH";
const CounterPreview = React.lazy(() => import("./counter"));

const BlogHero = React.lazy(() => import("./blog/bannerHero"));
const BlogSlider1 = React.lazy(() => import("./blog/carouselContent"));
const CarouselnnerImage = React.lazy(() => import("./blog/carouselnnerImage"));
const ContentPreivew = React.lazy(() => import("./blog/contentPreivew"));
const GridContent = React.lazy(() => import("./blog/gridContent"));
const ListContent = React.lazy(() => import("./blog/listContent"));
const GridBrand = React.lazy(() => import("./brand/gridBrand"));
const ScrollBrand = React.lazy(() => import("./brand/scrollBrand"));
const Gridcategory = React.lazy(() => import("./category/gridcategory"));
const ScrollCategory = React.lazy(() => import("./category/scrollCategory"));
const Productgrid = React.lazy(() => import("./product/gridProduct"));
const ProductList = React.lazy(() => import("./product/productList"));
const ScrollProduct = React.lazy(() => import("./product/scrollProduct"));
const SliderImage = React.lazy(() => import("./sliderImage"));
const Story = React.lazy(() => import("./story/index"));

const Privew = ({
  data,
  needPreviewD,
  needPreviewM,
  bgSetting,
  bgSettingM,
  allProducts,
  selected,
  currentStep,
  allData,
  contents,
  editMode = false,
  banner,
}) => {
  const [isMobileView, setIsMobileView] = useState(false);

  const currentBgSettings = isMobileView ? bgSettingM : bgSetting;
  const currentPreview = isMobileView ? needPreviewM : needPreviewD;

  return (
    <Paper elevation={0} className="col-span-3 mb-5 border pb-7 rounded-md">
      <Box
        sx={{
          background: (theme) =>
            theme.palette.mode === "dark" ? "#FFC53C" : "#FFC53C",
        }}
        className="flex max-h-[40px] items-center gap-0 pr-5 border-b"
      >
        <span className="text-xs">پیش نمایش</span>
        <Box
          sx={{
            background: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.grey[700]
                : theme.palette.grey[200],
          }}
          className="w-[70%] mx-auto my-6 border rounded-3xl flex justify-start px-5 py-2 text-left ltr"
        >
          <span className="text-sm">
            {process.env.REACT_APP_DOMAIN_URL}/
            {data.url?.slice(0, 1) === "/" ? data.url?.substring(1) : data.url}
          </span>
        </Box>
        <div className="flex items-center gap-2">
          <Tooltip title={isMobileView ? "Desktop View" : "Mobile View"}>
            <IconButton
              size="small"
              onClick={() => setIsMobileView(!isMobileView)}
              sx={{ color: "inherit" }}
            >
              {isMobileView ? <DesktopWindowsIcon /> : <PhoneIphoneIcon />}
            </IconButton>
          </Tooltip>
          <RefreshIcon
            sx={{ fontSize: "1.5rem !important", cursor: "pointer" }}
          />
          <KeyboardBackspaceIcon
            sx={{
              width: "1.5rem !important",
              transform: "rotate(180deg)",
              cursor: "pointer",
            }}
          />
          <KeyboardBackspaceIcon
            sx={{ fontSize: "1.5rem !important", cursor: "pointer" }}
          />
        </div>
      </Box>

      <div
        className={`w-full overflow-x-hidden ${
          isMobileView ? "flex justify-center py-8 bg-gray-100" : ""
        }`}
      >
        <div
          className={
            isMobileView
              ? "relative w-[350px] h-[700px] bg-white rounded-[3rem] shadow-xl overflow-hidden"
              : "w-full"
          }
        >
          {isMobileView && (
            <>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[150px] h-[30px] bg-black rounded-b-[1.2rem] z-20"></div>
              <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[10px] h-[10px] bg-[#222] rounded-full z-30"></div>
              <div className="absolute right-[-2px] top-[100px] w-[4px] h-[50px] bg-black rounded-l-lg"></div>
              <div className="absolute right-[-2px] top-[170px] w-[4px] h-[50px] bg-black rounded-l-lg"></div>
              <div className="absolute left-[-2px] top-[100px] w-[4px] h-[70px] bg-black rounded-r-lg"></div>
            </>
          )}
          <div
            className={`${
              isMobileView
                ? "w-full h-full overflow-y-auto overflow-x-hidden px-2"
                : ""
            }`}
          >
            <Box
              sx={{
                marginTop: data?.marginTop + "px",
                marginBottom: data?.marginBottom + "px",
                ":after": {
                  background: currentPreview
                    ? `url(${currentPreview})`
                    : currentBgSettings?.color,
                  backgroundPositionX: currentBgSettings?.possitionX,
                  backgroundPositionY: currentBgSettings?.possitionY,
                  backgroundSize: currentBgSettings?.size,
                  backgroundRepeat: currentBgSettings?.repeat
                    ? "repeat"
                    : "no-repeat",
                  backgroundAttachment: currentBgSettings?.parallex
                    ? "fixed"
                    : "unset",
                  position: "absolute",
                  content: currentBgSettings?.inContainer ? "none" : '""',
                  top: 0,
                  right: 0,
                  left: currentBgSettings?.inContainer ? "50%" : 0,
                  bottom: 0,
                  zIndex: 1,
                  opacity: currentBgSettings?.opacity + "%",
                  maxWidth: currentBgSettings?.inContainer ? "98%" : "100%",
                  transform: currentBgSettings?.inContainer
                    ? "translateX(-50%)"
                    : "unset",
                  width: "100%",
                },
              }}
              className={`relative ${
                currentBgSettings?.invert ? "needInvert" : ""
              }`}
            >
              {currentBgSettings?.overlay && (
                <Box
                  sx={{
                    background: currentBgSettings?.overlayColor,
                    zIndex: 2,
                  }}
                  className="absolute w-full top-0 right-0 h-full"
                />
              )}
              <Box
                sx={{
                  maxWidth: isMobileView
                    ? "100%"
                    : data?.hasContainer
                    ? "1150px"
                    : "100%",
                  display: {
                    md:
                      data?.viewType?.id === 6 ||
                      data?.viewType?.id === 4 ||
                      data?.viewType?.id === 15 ||
                      data?.viewType?.id === 9 ||
                      data?.viewType?.id === 31 ||
                      data?.viewType?.id === 11
                        ? "grid"
                        : "block",
                  },
                  marginInline: "auto",
                  transition: "all 500ms",
                  borderTopWidth: `${data?.sectionBorderTop || 0}px !important`,
                  borderRightWidth: `${
                    data?.sectionBorderRight || 0
                  }px !important`,
                  borderBottomWidth: `${
                    data?.sectionBorderBottom || 0
                  }px !important`,
                  borderLeftWidth: `${
                    data?.sectionBorderLeft || 0
                  }px !important`,
                  borderTopRightRadius: data?.borderSectionRaduisTop + "px",
                  borderTopLeftRadius: data?.borderSectionRaduisRight + "px",
                  borderBottomLeftRadius:
                    data?.borderSectionRaduisBottom + "px",
                  borderBottomRightRadius: data?.borderSectionRaduisLeft + "px",
                  borderColor: data?.borderSectionColor + "!important",
                  paddingTop: data?.paddingTop + "px",
                  paddingBottom: data?.paddingBottom + "px",
                  paddingRight: data?.paddingLeft + "px",
                  paddingLeft: data?.paddingRight + "px",
                  gridTemplateColumns: isMobileView
                    ? "1fr"
                    : data?.gridNumber?.id === 1
                    ? "1fr 1fr 1fr 1fr"
                    : data?.gridNumber?.id === 2
                    ? "1fr 1fr 1fr"
                    : data?.gridNumber?.id === 3
                    ? "1fr 1fr 1fr"
                    : data?.gridNumber?.id === 4
                    ? "1fr 1fr 1fr 1fr"
                    : data?.gridNumber?.id === 5
                    ? "1fr 1fr 1fr 1fr"
                    : data?.gridNumber?.id === 6
                    ? "1fr 1fr 1fr 1fr"
                    : data?.gridNumber?.id === 7
                    ? "1fr 1fr 1fr 1fr"
                    : "1fr",
                  background:
                    currentPreview && currentBgSettings?.inContainer
                      ? `url(${currentPreview})`
                      : "none",
                  backgroundPositionX: currentBgSettings?.possitionX,
                  backgroundPositionY: currentBgSettings?.possitionY,
                  backgroundSize: currentBgSettings?.size,
                  backgroundRepeat: currentBgSettings?.repeat
                    ? "repeat"
                    : "no-repeat",
                  backgroundAttachment: currentBgSettings?.parallex
                    ? "fixed"
                    : "unset",
                  ":hover": {
                    boxShadow: data?.shadow ? `0 0px 30px ${data?.shadow}` : "",
                  },
                }}
                className="relative z-10"
              >
                <Box
                  sx={{
                    gridColumn:
                      data?.gridNumber?.id === 1
                        ? "span 2 / span 4"
                        : data?.gridNumber?.id === 2
                        ? "span 1 / span 3"
                        : data?.gridNumber?.id === 3
                        ? "span 2 / span 3"
                        : data?.gridNumber?.id === 4
                        ? ""
                        : data?.gridNumber?.id === 5
                        ? "span 2 / span 4"
                        : data?.gridNumber?.id === 6
                        ? "span 3 / span 4"
                        : data?.gridNumber?.id === 7
                        ? "span 4 / span 4"
                        : "span 1 / span 1",
                  }}
                  className="w-full"
                >
                  <div className="w-full">
                    {data?.showTitle && (
                      <Box
                        sx={{
                          flexDirection:
                            data?.titlePosition?.id === 3
                              ? "row-reverse"
                              : "row",
                        }}
                        className="flex justify-between items-center px-5 mb-5 transition-all"
                      >
                        {data?.titlePosition?.id === 2 ? <div></div> : <></>}
                        <span
                          style={{ color: data?.titleColor }}
                          className="text-base font-bold"
                        >
                          {data?.title}
                        </span>
                        {data?.headerDivider &&
                          data?.titlePosition?.id !== 2 && (
                            <Divider
                              sx={{
                                width: data?.moreLink ? "70%" : "88%",
                                transition: "all 500ms",
                              }}
                            />
                          )}
                        <div>
                          {" "}
                          {data?.viewType?.id !== 3 &&
                            data?.viewType?.id !== 12 &&
                            data?.viewType?.id !== 55 &&
                            data?.moreLink &&
                            data?.moreLink !== "/" && (
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
                                className="flex cursor-pointer items-center gap-2 font-medium md:text-xs text-xs hover:text-[#0000ff]"
                                rel="noreferrer"
                              >
                                مشاهده بیشتر{" "}
                                <KeyboardBackspaceIcon className="font-medium" />
                              </a>
                            )}
                        </div>
                      </Box>
                    )}
                    <Suspense fallback={<CircularProgress />}>
                      <>
                        {" "}
                        {data?.filter?.id === "0" ||
                        data?.filter?.id === "6" ||
                        data?.filter?.id === "7" ? (
                          <>
                            {data?.viewType?.id === 6 ? (
                              <>
                                <Gridcategory
                                  allData={
                                    editMode
                                      ? allData
                                      : currentStep >= 3
                                      ? allData
                                      : allData2
                                  }
                                  data={data}
                                />
                              </>
                            ) : data?.viewType?.id === 5 ? (
                              <ScrollCategory
                                allData={
                                  editMode
                                    ? allData
                                    : currentStep >= 3
                                    ? allData
                                    : allData2
                                }
                                data={data}
                              />
                            ) : (
                              <></>
                            )}
                          </>
                        ) : data?.filter?.id === "1" ? (
                          <>
                            {" "}
                            {data?.viewType?.id === 15 ? (
                              <>
                                <GridBrand
                                  allData={
                                    editMode
                                      ? allData
                                      : currentStep >= 3
                                      ? allData
                                      : allData3
                                  }
                                  data={data}
                                />
                              </>
                            ) : data?.viewType?.id === 14 ? (
                              <ScrollBrand
                                allData={
                                  editMode
                                    ? allData
                                    : currentStep >= 3
                                    ? allData
                                    : allData3
                                }
                                data={data}
                              />
                            ) : (
                              <></>
                            )}
                          </>
                        ) : data?.filter?.id === "2" ? (
                          <>
                            {data?.viewType?.id === 2 ? (
                              <>
                                <ScrollProduct
                                  filter={
                                    data?.viewType?.id === 1 ? "recommend" : ""
                                  }
                                  data={data}
                                  allData={
                                    currentStep >= 3 || editMode
                                      ? selected?.length > 0
                                        ? selected
                                        : allProducts
                                      : datas?.data
                                  }
                                  isMobileView={isMobileView}
                                />
                              </>
                            ) : data?.viewType?.id === 3 ? (
                              <ProductList
                                allData={
                                  currentStep >= 3 || editMode
                                    ? selected?.length > 0
                                      ? selected
                                      : allProducts
                                    : datas?.data
                                }
                                data={data}
                              />
                            ) : data?.viewType?.id === 4 ? (
                              <Productgrid
                                allData={
                                  currentStep >= 3 || editMode
                                    ? selected?.length > 0
                                      ? selected
                                      : allProducts
                                    : datas?.data
                                }
                                data={data}
                              />
                            ) : data?.viewType?.id === 61 ? (
                              <ProductgridGeneral
                                allData={
                                  currentStep >= 3 || editMode
                                    ? selected?.length > 0
                                      ? selected
                                      : allProducts
                                    : datas?.data
                                }
                                data={data}
                                isMobileView={isMobileView}
                              />
                            ) : data?.viewType?.id === 63 ? (
                              <ProductgridGeneralH
                                allData={
                                  currentStep >= 3 || editMode
                                    ? selected?.length > 0
                                      ? selected
                                      : allProducts
                                    : datas?.data
                                }
                                data={data}
                                isMobileView={isMobileView}
                              />
                            ) : data?.viewType?.id === 1 ||
                              data?.viewType?.id === 60 ? (
                              <GeneralSlider
                                filter={
                                  data?.viewType?.id === 1 ? "recommend" : ""
                                }
                                banner={banner}
                                allData={
                                  currentStep >= 3 || editMode
                                    ? selected?.length > 0
                                      ? selected
                                      : allProducts
                                    : datas?.data
                                }
                                data={data}
                                isMobileView={isMobileView}
                              />
                            ) : data?.viewType?.id === 62 ? (
                              <GeneralSliderH
                                allData={
                                  currentStep >= 3 || editMode
                                    ? selected?.length > 0
                                      ? selected
                                      : allProducts
                                    : datas?.data
                                }
                                data={data}
                                isMobileView={isMobileView}
                              />
                            ) : data?.viewType?.id === 55 ? (
                              <BannerProduct
                                allData={
                                  currentStep >= 3 || editMode
                                    ? selected?.length > 0
                                      ? selected
                                      : allProducts
                                    : datas?.data
                                }
                                data={data}
                              />
                            ) : (
                              <></>
                            )}
                          </>
                        ) : data?.filter?.id === "3" ? (
                          <>
                            {" "}
                            {data?.viewType?.id === 7 ? (
                              <>
                                <BlogSlider1
                                  allData={
                                    currentStep >= 3 || editMode
                                      ? contents
                                      : itemData
                                  }
                                  data={data}
                                  isMobileView={isMobileView}
                                />
                              </>
                            ) : data?.viewType?.id === 8 ? (
                              <CarouselnnerImage
                                allData={
                                  currentStep >= 3 || editMode
                                    ? contents
                                    : itemData
                                }
                                justImage={true}
                                data={data}
                                isMobileView={isMobileView}
                              />
                            ) : data?.viewType?.id === 12 ? (
                              <ListContent
                                allData={
                                  currentStep >= 3 || editMode
                                    ? contents
                                    : itemData
                                }
                                data={data}
                              />
                            ) : data?.viewType?.id === 9 ? (
                              <BlogHero
                                allData={
                                  currentStep >= 3 || editMode
                                    ? contents
                                    : itemData
                                }
                                data={data}
                              />
                            ) : data?.viewType?.id === 11 ||
                              data?.viewType?.id === 31 ? (
                              <GridContent
                                allData={
                                  currentStep >= 3 || editMode
                                    ? contents
                                    : itemData
                                }
                                data={data}
                              />
                            ) : data?.viewType?.id === 13 ? (
                              <>
                                <ContentPreivew
                                  allData={
                                    currentStep >= 3 || editMode
                                      ? contents
                                      : itemData
                                  }
                                  data={data}
                                />
                              </>
                            ) : (
                              <></>
                            )}
                          </>
                        ) : data?.filter?.id === "4" ? (
                          <>
                            {" "}
                            {data?.viewType?.id === 8 ? (
                              <CarouselnnerImage
                                allData={
                                  currentStep >= 3 || editMode
                                    ? contents
                                    : itemData
                                }
                                justImage={true}
                                data={data}
                                isMobileView={isMobileView}
                              />
                            ) : data?.viewType?.id === 57 ? (
                              <Story
                                option={data}
                                carouselNumber={data?.carouselNumber}
                                limit={data?.showCaseLimit}
                                data={
                                  currentStep >= 3 || editMode
                                    ? selected?.length > 0
                                      ? selected
                                      : allProducts
                                    : datas?.data
                                }
                              />
                            ) : data?.viewType?.id === 9 ? (
                              <BlogHero
                                allData={
                                  currentStep >= 3 || editMode
                                    ? contents
                                    : itemData
                                }
                                justImage={true}
                                data={data}
                              />
                            ) : data?.viewType?.id === 11 ||
                              data?.viewType?.id === 31 ? (
                              <GridContent
                                allData={
                                  currentStep >= 3 || editMode
                                    ? contents
                                    : itemData
                                }
                                justImage={true}
                                data={data}
                              />
                            ) : data?.viewType?.id === 20 ? (
                              <SliderImage
                                allData={
                                  currentStep >= 3 || editMode
                                    ? contents
                                    : allData4
                                }
                                justImage={true}
                                data={data}
                              />
                            ) : (
                              <></>
                            )}
                          </>
                        ) : data?.filter?.id === "5" ? (
                          <>
                            <div>
                              {data?.filterValue ? (
                                <> {ReactHtmlParse(data?.filterValue)}</>
                              ) : (
                                <div className="flex justify-center  items-center w-full h-full min-h-[20vh]">
                                  {" "}
                                  {"<"} html content {">"}
                                </div>
                              )}
                            </div>
                          </>
                        ) : data?.filter?.id === "8" ? (
                          <>
                            <CounterPreview data={data} />
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    </Suspense>{" "}
                    {(data?.viewType?.id === 3 || data?.viewType?.id === 12) &&
                      data?.moreLink &&
                      data?.moreLink !== "/" && (
                        <a
                          href={
                            process.env.REACT_APP_DOMAIN_URL +
                            "/" +
                            data?.moreLink
                          }
                          target="_blank"
                          className="flex cursor-pointer items-center gap-2 font-medium md:text-xs text-xs hover:text-[#0000ff]"
                          rel="noreferrer"
                        >
                          مشاهده بیشتر{" "}
                          <KeyboardBackspaceIcon className="font-medium" />
                        </a>
                      )}
                  </div>{" "}
                </Box>
              </Box>
            </Box>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default Privew;
const itemData = [
  {
    galleryId: null,
    Image: "/images/Banner_Heder_01.webp",
    title: "تماشا کنید: جنگ جهانی سوم را هوش مصنوعی آغاز می‌کند؟",
    description:
      "مدیرعامل اپل می‌گوید تعداد دستگاه‌های فعال این شرکت به بالاترین حد در تاریخ رسیده است. ",
  },
  {
    galleryId: null,
    Image: "/images/Banner_Heder_01.webp",
    title: "تماشا کنید: جنگ جهانی سوم را هوش مصنوعی آغاز می‌کند؟",
    description:
      "مدیرعامل اپل می‌گوید تعداد دستگاه‌های فعال این شرکت به بالاترین حد در تاریخ رسیده است. ",
  },
  {
    galleryId: null,
    Image: "/images/Banner_Heder_01.webp",
    description:
      "مدیرعامل اپل می‌گوید تعداد دستگاه‌های فعال این شرکت به بالاترین حد در تاریخ رسیده است. ",
    createdAt: "2023-05-18T18:34:20.687",
    liked: 3,
    points: 2,
    title: "تماشا کنید: جنگ جهانی سوم را هوش مصنوعی آغاز می‌کند؟",
  },
  {
    galleryId: null,
    Image: "/images/Banner_Heder_01.webp",
    description:
      "مدیرعامل اپل می‌گوید تعداد دستگاه‌های فعال این شرکت به بالاترین حد در تاریخ رسیده است. ",
    createdAt: "2023-05-18T18:34:20.687",
    liked: 3,
    points: 2,
    title: "تماشا کنید: جنگ جهانی سوم را هوش مصنوعی آغاز می‌کند؟",
  },
  {
    galleryId: null,
    Image: "/images/Banner_Heder_01.webp",
    description:
      "مدیرعامل اپل می‌گوید تعداد دستگاه‌های فعال این شرکت به بالاترین حد در تاریخ رسیده است. ",
    createdAt: "2023-05-18T18:34:20.687",
    liked: 3,
    points: 2,
    title: "تماشا کنید: جنگ جهانی سوم را هوش مصنوعی آغاز می‌کند؟",
  },
  {
    galleryId: null,
    Image: "/images/Banner_Heder_01.webp",
    description:
      "مدیرعامل اپل می‌گوید تعداد دستگاه‌های فعال این شرکت به بالاترین حد در تاریخ رسیده است. ",
    createdAt: "2023-05-18T18:34:20.687",
    liked: 3,
    points: 2,
    title: "تماشا کنید: جنگ جهانی سوم را هوش مصنوعی آغاز می‌کند؟",
  },
  {
    galleryId: null,
    Image: "/images/Banner_Heder_01.webp",
    description:
      "مدیرعامل اپل می‌گوید تعداد دستگاه‌های فعال این شرکت به بالاترین حد در تاریخ رسیده است. ",
    createdAt: "2023-05-18T18:34:20.687",
    liked: 3,
    points: 2,
    title: "تماشا کنید: جنگ جهانی سوم را هوش مصنوعی آغاز می‌کند؟",
  },
  {
    galleryId: null,
    Image: "/images/Banner_Heder_01.webp",
    description:
      "مدیرعامل اپل می‌گوید تعداد دستگاه‌های فعال این شرکت به بالاترین حد در تاریخ رسیده است. ",
    createdAt: "2023-05-18T18:34:20.687",
    liked: 3,
    points: 2,
    title: "تماشا کنید: جنگ جهانی سوم را هوش مصنوعی آغاز می‌کند؟",
  },
  {
    galleryId: null,
    Image: "/images/Banner_Heder_01.webp",
    description:
      "مدیرعامل اپل می‌گوید تعداد دستگاه‌های فعال این شرکت به بالاترین حد در تاریخ رسیده است. ",
    createdAt: "2023-05-18T18:34:20.687",
    liked: 3,
    points: 2,
    title: "تماشا کنید: جنگ جهانی سوم را هوش مصنوعی آغاز می‌کند؟",
  },
  {
    galleryId: null,
    Image: "/images/Banner_Heder_01.webp",
    description:
      "مدیرعامل اپل می‌گوید تعداد دستگاه‌های فعال این شرکت به بالاترین حد در تاریخ رسیده است. ",
    createdAt: "2023-05-18T18:34:20.687",
    liked: 3,
    points: 2,
    title: "تماشا کنید: جنگ جهانی سوم را هوش مصنوعی آغاز می‌کند؟",
  },
];
const allData2 = [
  { title: "Test", galleryId: 148 },
  { title: "Test", galleryId: 148 },
  { title: "Test", galleryId: 148 },
  { title: "Test", galleryId: 148 },
  { title: "Test", galleryId: 148 },
  { title: "Test", galleryId: 148 },
  { title: "Test", galleryId: 148 },
  { title: "Test", galleryId: 148 },
  { title: "Test", galleryId: 148 },
  { title: "Test", galleryId: 148 },
];
const allData3 = [
  { title: "Test", galleryId: 161 },
  { title: "Test", galleryId: 161 },
  { title: "Test", galleryId: 161 },
  { title: "Test", galleryId: 161 },
  { title: "Test", galleryId: 161 },
  { title: "Test", galleryId: 161 },
  { title: "Test", galleryId: 161 },
  { title: "Test", galleryId: 161 },
  { title: "Test", galleryId: 161 },
  { title: "Test", galleryId: 161 },
];
const allData4 = [
  { title: "Test", Image: "/images/sample-banner-show-case.webp" },
  { title: "Test", Image: "/images/sample-banner-show-case.webp" },
  { title: "Test", Image: "/images/sample-banner-show-case.webp" },
  { title: "Test", Image: "/images/sample-banner-show-case.webp" },
  { title: "Test", Image: "/images/sample-banner-show-case.webp" },
  { title: "Test", Image: "/images/sample-banner-show-case.webp" },
  { title: "Test", Image: "/images/sample-banner-show-case.webp" },
  { title: "Test", Image: "/images/sample-banner-show-case.webp" },
  { title: "Test", Image: "/images/sample-banner-show-case.webp" },
  { title: "Test", Image: "/images/sample-banner-show-case.webp" },
];
