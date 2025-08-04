import React, { Suspense } from 'react';
import { Box } from '@mui/system';
import { CircularProgress } from '@mui/material';
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

// Import your preview components here
const BlogSlider1 = React.lazy(() => import('../blog/BlogSlider1'));
const CarouselnnerImage = React.lazy(() => import('../carousel/CarouselnnerImage'));
const ListContent = React.lazy(() => import('../list/ListContent'));
const BlogHero = React.lazy(() => import('../blog/BlogHero'));
const GridContent = React.lazy(() => import('../grid/GridContent'));
const ContentPreivew = React.lazy(() => import('../content/ContentPreview'));
const CounterPreview = React.lazy(() => import('../counter/CounterPreview'));
const Gridcategory = React.lazy(() => import('../grid/Gridcategory'));
const ScrollCategory = React.lazy(() => import('../scroll/ScrollCategory'));
const GridBrand = React.lazy(() => import('../grid/GridBrand'));
const ScrollBrand = React.lazy(() => import('../scroll/ScrollBrand'));
const ScrollProduct = React.lazy(() => import('../scroll/ScrollProduct'));
const ProductList = React.lazy(() => import('../product/ProductList'));
const Productgrid = React.lazy(() => import('../product/Productgrid'));
const ProductgridGeneral = React.lazy(() => import('../product/ProductgridGeneral'));
const ProductgridGeneralH = React.lazy(() => import('../product/ProductgridGeneralH'));
const GeneralSlider = React.lazy(() => import('../general/GeneralSlider'));
const GeneralSliderH = React.lazy(() => import('../general/GeneralSliderH'));
const BannerProduct = React.lazy(() => import('../banner/BannerProduct'));
const SliderImage = React.lazy(() => import('../sliderImage'));
const Story = React.lazy(() => import('../story'));

const PreviewContent = ({
  data,
  isMobile,
  bgSetting,
  allProducts,
  selected,
  currentStep,
  allData,
  contents,
  banner,
  editMode,
}) => {
  return (
    <Box
      sx={{
        maxWidth: data?.hasContainer ? "1150px" : "100%",
        marginInline: "auto",
        transition: "all 500ms",
        borderTopWidth: `${data?.sectionBorderTop || 0}px !important`,
        borderRightWidth: `${data?.sectionBorderRight || 0}px !important`,
        borderBottomWidth: `${data?.sectionBorderBottom || 0}px !important`,
        borderLeftWidth: `${data?.sectionBorderLeft || 0}px !important`,
        borderTopRightRadius: data?.borderSectionRaduisTop + "px",
        borderTopLeftRadius: data?.borderSectionRaduisRight + "px",
        borderBottomLeftRadius: data?.borderSectionRaduisBottom + "px",
        borderBottomRightRadius: data?.borderSectionRaduisLeft + "px",
        borderColor: data?.borderSectionColor + "!important",
        paddingTop: data?.paddingTop + "px",
        paddingBottom: data?.paddingBottom + "px",
        paddingRight: data?.paddingLeft + "px",
        paddingLeft: data?.paddingRight + "px",
        background: bgSetting?.inContainer ? `url(${bgSetting?.image})` : "none",
        backgroundPositionX: bgSetting?.possitionX,
        backgroundPositionY: bgSetting?.possitionY,
        backgroundSize: bgSetting?.size,
        backgroundRepeat: bgSetting?.repeat ? "repeat" : "no-repeat",
        backgroundAttachment: bgSetting?.parallex ? "fixed" : "unset",
      }}
      className="relative z-10"
    >
      <Suspense fallback={<CircularProgress />}>
        {data?.filter?.id === "0" || data?.filter?.id === "6" || data?.filter?.id === "7" ? (
          <>
            {data?.viewType?.id === 6 ? (
              <Gridcategory
                allData={editMode ? allData : currentStep >= 3 ? allData : []}
                data={data}
              />
            ) : data?.viewType?.id === 5 ? (
              <ScrollCategory
                allData={editMode ? allData : currentStep >= 3 ? allData : []}
                data={data}
              />
            ) : null}
          </>
        ) : data?.filter?.id === "1" ? (
          <>
            {data?.viewType?.id === 15 ? (
              <GridBrand
                allData={editMode ? allData : currentStep >= 3 ? allData : []}
                data={data}
              />
            ) : data?.viewType?.id === 14 ? (
              <ScrollBrand
                allData={editMode ? allData : currentStep >= 3 ? allData : []}
                data={data}
              />
            ) : null}
          </>
        ) : data?.filter?.id === "2" ? (
          <>
            {data?.viewType?.id === 2 ? (
              <ScrollProduct
                filter={data?.viewType?.id === 1 ? "recommend" : ""}
                data={data}
                allData={currentStep >= 3 || editMode ? selected?.length > 0 ? selected : allProducts : []}
              />
            ) : data?.viewType?.id === 3 ? (
              <ProductList
                allData={currentStep >= 3 || editMode ? selected?.length > 0 ? selected : allProducts : []}
                data={data}
              />
            ) : data?.viewType?.id === 4 ? (
              <Productgrid
                allData={currentStep >= 3 || editMode ? selected?.length > 0 ? selected : allProducts : []}
                data={data}
              />
            ) : data?.viewType?.id === 61 ? (
              <ProductgridGeneral
                allData={currentStep >= 3 || editMode ? selected?.length > 0 ? selected : allProducts : []}
                data={data}
              />
            ) : data?.viewType?.id === 63 ? (
              <ProductgridGeneralH
                allData={currentStep >= 3 || editMode ? selected?.length > 0 ? selected : allProducts : []}
                data={data}
              />
            ) : data?.viewType?.id === 1 || data?.viewType?.id === 60 ? (
              <GeneralSlider
                filter={data?.viewType?.id === 1 ? "recommend" : ""}
                banner={banner}
                allData={currentStep >= 3 || editMode ? selected?.length > 0 ? selected : allProducts : []}
                data={data}
              />
            ) : data?.viewType?.id === 62 ? (
              <GeneralSliderH
                allData={currentStep >= 3 || editMode ? selected?.length > 0 ? selected : allProducts : []}
                data={data}
              />
            ) : data?.viewType?.id === 55 ? (
              <BannerProduct
                allData={currentStep >= 3 || editMode ? selected?.length > 0 ? selected : allProducts : []}
                data={data}
              />
            ) : null}
          </>
        ) : data?.filter?.id === "3" ? (
          <>
            {data?.viewType?.id === 7 ? (
              <BlogSlider1
                data={data}
                allData={currentStep >= 3 || editMode ? selected?.length > 0 ? selected : allProducts : []}
              />
            ) : data?.viewType?.id === 8 ? (
              <CarouselnnerImage
                data={data}
                allData={currentStep >= 3 || editMode ? selected?.length > 0 ? selected : allProducts : []}
              />
            ) : data?.viewType?.id === 12 ? (
              <ListContent
                data={data}
                allData={currentStep >= 3 || editMode ? selected?.length > 0 ? selected : allProducts : []}
              />
            ) : data?.viewType?.id === 9 ? (
              <BlogHero
                data={data}
                allData={currentStep >= 3 || editMode ? selected?.length > 0 ? selected : allProducts : []}
              />
            ) : data?.viewType?.id === 11 || data?.viewType?.id === 31 ? (
              <GridContent
                data={data}
                allData={currentStep >= 3 || editMode ? selected?.length > 0 ? selected : allProducts : []}
              />
            ) : data?.viewType?.id === 13 ? (
              <ContentPreivew
                data={data}
                allData={currentStep >= 3 || editMode ? selected?.length > 0 ? selected : allProducts : []}
              />
            ) : null}
          </>
        ) : data?.filter?.id === "4" ? (
          <>
            {data?.viewType?.id === 8 ? (
              <CarouselnnerImage
                allData={currentStep >= 3 || editMode ? contents : []}
                justImage={true}
                data={data}
              />
            ) : data?.viewType?.id === 57 ? (
              <Story
                option={data}
                carouselNumber={data?.carouselNumber}
                limit={data?.showCaseLimit}
                data={currentStep >= 3 || editMode ? selected?.length > 0 ? selected : allProducts : []}
              />
            ) : data?.viewType?.id === 9 ? (
              <BlogHero
                allData={currentStep >= 3 || editMode ? contents.filter((n) => n) : []}
                justImage={true}
                data={data}
              />
            ) : data?.viewType?.id === 11 || data?.viewType?.id === 31 ? (
              <GridContent
                allData={currentStep >= 3 || editMode ? contents.filter((n) => n) : []}
                justImage={true}
                data={data}
              />
            ) : data?.viewType?.id === 20 ? (
              <SliderImage
                allData={currentStep >= 3 || editMode ? contents.filter((n) => n) : []}
                justImage={true}
                data={data}
              />
            ) : null}
          </>
        ) : data?.filter?.id === "5" ? (
          <div>
            {data?.filterValue ? (
              <div dangerouslySetInnerHTML={{ __html: data?.filterValue }} />
            ) : (
              <div className="flex justify-center items-center w-full h-full min-h-[20vh]">
                {"<"} html content {">"}
              </div>
            )}
          </div>
        ) : data?.filter?.id === "8" ? (
          <CounterPreview data={data} />
        ) : null}
      </Suspense>
    </Box>
  );
};

export default PreviewContent;
