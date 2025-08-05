/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { Delete } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Tab,
  Tabs,
} from "@mui/material";
import { Box, useMediaQuery } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { PageTitle } from "../../components/common";
import { Confirm } from "../../components/modals";
import Preview from "../../components/modals/create/preview";
import Step1ShowCase from "../../components/modals/create/step1";
import Step2ShowCase from "../../components/modals/create/step2";
import Step3ShowCase from "../../components/modals/create/step3";
import StepContent from "../../components/modals/create/stepContent";

import EditorTabs from "../../components/modals/create/components/EditorTabs";
import Counter from "../../components/modals/create/counter";
import { useGetShowCaseData } from "../../components/modals/create/hooks/useGetShowCaseData";
import { useShowcaseApi } from "../../components/modals/create/hooks/useShowcaseApi";
import { useShowcaseState } from "../../components/modals/create/hooks/useShowcaseState";
import StepContent2 from "../../components/modals/create/stepContent2";

const ShowCaseEdit = () => {
  const { token } = useSelector((state) => state.user);
  const [showCaseId, setShowCaseId] = useState(null);
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState([]);
  const [selected, setSelected] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories2, setCategories2] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [desktopContents, setDesktopContents] = useState([]);
  const [mobileContents, setMobileContents] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [value, setValue] = useState(0);
  const { id } = useParams();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const {
    data,
    updateData,
    backgroundSettings,
    updateBackgroundSettings,
    valueTab,
    setValueTab,
    banner,
    setBanner,
  } = useShowcaseState({});
  const {
    loading: apiLoading,
    error: apiError,
    categories,
    blogCategories: blogcategories,
    showCaseType,
    attributes,
    brands,
    allUrl,
    editShowcase,
    uploadShowcaseImage,
    deleteShowcase,
  } = useShowcaseApi(token);
  const {
    loadingFetchData,
    fetchedData,
    allData,

    setAllData,
  } = useGetShowCaseData(
    token,
    id,
    showCaseType,
    categories,
    blogcategories,
    attributes,
    brands,
    setValueTab,
    setSelected,
    setSort,
    setFilter,
    setAllProducts,
    setDesktopContents,
    setMobileContents,
    updateBackgroundSettings,
    setBanner
  );
  useEffect(() => {
    updateData(fetchedData);
  }, [fetchedData]);
  const UpdateBackground = () => {
    if (
      backgroundSettings.desktop.selectedProductImage ||
      backgroundSettings.desktop.avatar
    ) {
      let fd3 = new FormData();
      fd3.append("showCaseId", id);
      fd3.append("screenSize", 1200);
      fd3.append("imageType", 0);
      fd3.append("priority", 1);
      fd3.append(
        "imageStyle",
        JSON.stringify(backgroundSettings.desktop.settings)
      );
      if (backgroundSettings.desktop.avatar)
        fd3.append("files", backgroundSettings.desktop.avatar);
      if (backgroundSettings.desktop.selectedProductImage) {
        fd3.append(
          "fromGallery",
          backgroundSettings.desktop.selectedProductImage
        );
      }
      uploadShowcaseImage(fd3);
    }
    if (
      backgroundSettings.mobile.selectedProductImage ||
      backgroundSettings.mobile.avatar
    ) {
      let fd3 = new FormData();
      fd3.append("showCaseId", id);
      fd3.append("screenSize", 0);
      fd3.append("imageType", 0);
      fd3.append("priority", 1);
      fd3.append(
        "imageStyle",
        JSON.stringify(backgroundSettings.mobile.settings)
      );
      if (backgroundSettings.mobile.avatar)
        fd3.append("files", backgroundSettings.mobile.avatar);
      if (backgroundSettings.mobile.selectedProductImage) {
        fd3.append(
          "fromGallery",
          backgroundSettings.mobile.selectedProductImage
        );
      }
      uploadShowcaseImage(fd3);
    }
  };
  const isMd = useMediaQuery("(min-width:900px)");

  return (
    <div>
      {" "}
      <>
        <PageTitle
          title={`ویرایش ${data?.title || ""}`}
          broadCrumb={[
            {
              title: "  مدیریت فرانت ",
              path: "/menu",
            },

            {
              title: "مدیریت ویترین های صفحات ",
              path: "/showcases",
            },
          ]}
        />
        <div className="md:mx-3 mx-1 relative">
          <Paper elevation={0} sx={{ border: "1px solid #dbdfea" }}>
            <Tabs
              variant="scrollable"
              value={value}
              onChange={handleChange}
              sx={{
                flexGrow: 1,
                height: "3.07rem",
                minHeight: "40px !important",
                ".MuiTab-root": {
                  minHeight: "40px !important",
                },
                background: (theme) =>
                  theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.04) !important"
                    : "rgba(0,0,0,0.7)  !important",
              }}
            >
              {addProductSteps.map((item, index) => (
                <Tab key={item} label={item} {...a11yProps(index)} />
              ))}{" "}
              {isMd && (
                <Button
                  target={"_blank"}
                  href={process.env.REACT_APP_DOMAIN_URL + `/${data.url}`}
                  sx={{ position: "absolute", top: "6px", right: "12px" }}
                >
                  مشاهده شوکیس
                </Button>
              )}
            </Tabs>
            <Divider sx={{ mb: 2 }} />
            {loadingFetchData ? (
              <div className="grid md:grid-cols-4 gap-5">
                {" "}
                {Array.from(Array(12).keys()).map((item, i) => (
                  <Skeleton
                    key={i + "fioerfhpew"}
                    height={30}
                    sx={{ width: "100%" /* , minWidth:{md:"160px"} */ }}
                  />
                ))}
              </div>
            ) : (
              <>
                {" "}
                {addProductSteps.map((item, index) => (
                  <TabPanel value={value} index={index} key={item.title}>
                    {item === "تعریف ویترین" ? (
                      <>
                        {data?.filter && (
                          <Step1ShowCase
                            data={data}
                            setData={updateData}
                            allUrl={allUrl}
                            editMode={true}
                            ALL_FILTER={showCaseType}
                          />
                        )}
                        <div className="w-full justify-between flex items-center py-3">
                          <IconButton
                            size="medium"
                            color="error"
                            onClick={() => setConfirmDelete(true)}
                          >
                            <Delete />
                          </IconButton>
                          <Button
                            disabled={apiLoading}
                            onClick={() => {
                              editShowcase(
                                data,
                                allData,
                                filter,
                                sort,
                                selected,
                                valueTab,
                                id
                              );
                            }}
                            variant="contained"
                          >
                            {apiLoading ? (
                              <CircularProgress />
                            ) : (
                              <>ثبت اطلاعات</>
                            )}
                          </Button>
                        </div>
                      </>
                    ) : item === "تنظیمات پس زمینه" ? (
                      <>
                        <div className="w-full mb-2 justify-end flex items-center">
                          <Button
                            disabled={apiLoading}
                            onClick={() => {
                              valueTab === 1
                                ? UpdateBackground()
                                : editShowcase(
                                    data,
                                    allData,
                                    filter,
                                    sort,
                                    selected,
                                    valueTab,
                                    id
                                  );
                            }}
                            variant="contained"
                          >
                            {apiLoading ? (
                              <CircularProgress />
                            ) : (
                              <>ثبت اطلاعات</>
                            )}
                          </Button>
                        </div>
                        <Step2ShowCase
                          data={data}
                          setData={updateData}
                          backgroundConfig={{
                            desktop: backgroundSettings.desktop,
                            mobile: backgroundSettings.mobile,
                          }}
                          updateBackgroundConfig={updateBackgroundSettings}
                          valueTab={valueTab}
                          setValueTab={setValueTab}
                          handleChange
                        />
                      </>
                    ) : item === "انتخاب محتوا" ? (
                      <>
                        <div className="w-full justify-end flex items-center mb-2">
                          {data?.viewType?.id === 20 ||
                          data?.viewType?.id === 9 ||
                          data?.viewType?.id === 57 ||
                          data?.viewType?.id === 11 ? (
                            <></>
                          ) : (
                            <>
                              {" "}
                              <Button
                                onClick={() => {
                                  editShowcase(
                                    data,
                                    allData,
                                    filter,
                                    sort,
                                    selected,
                                    valueTab,
                                    id
                                  );
                                }}
                                disabled={apiLoading}
                                variant="contained"
                              >
                                {apiLoading ? (
                                  <CircularProgress />
                                ) : (
                                  <>ثبت اطلاعات</>
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                        {data?.filter?.id === "0" ||
                        data?.filter?.id === "1" ||
                        data?.filter?.id === "6" ||
                        data?.filter?.id === "7" ? (
                          <StepContent2
                            data={data}
                            setData={updateData}
                            ALL_FILTER={showCaseType}
                            setAllData={setAllData}
                            categories={categories}
                            categories2={categories2}
                            attributes={attributes}
                            brands={brands}
                            blogcategories={blogcategories}
                            forEdit={true}
                          />
                        ) : data?.filter?.id === "4" ? (
                          <>
                            {data?.viewType?.id === 57 ? (
                              <>
                                {/*     <StoryContent
                                  id={showCaseId}
                                  data={data}
                                  setData={setData}
                                  forEdit={true}
                                /> */}
                              </>
                            ) : (
                              <>
                                {" "}
                                <Step3ShowCase
                                  desktopContents={desktopContents}
                                  setDesktopContents={setDesktopContents}
                                  mobileContents={mobileContents}
                                  setMobileContents={setMobileContents}
                                  showCaseLimit={data.showCaseLimit || 7}
                                  isMobile={isMobile}
                                  setIsMobile={setIsMobile}
                                  onBack={() => {}}
                                  onFinish={() => {}}
                                />
                              </>
                            )}
                          </>
                        ) : data?.filter?.id === "5" ? (
                          <div className="mb-5">
                            <EditorTabs
                              value={data?.filterValue}
                              onChange={(e) =>
                                updateData({ ...data, filterValue: e })
                              }
                              hint="html"
                            />
                          </div>
                        ) : data?.filter?.id === "8" ? (
                          <>
                            <Counter data={data} setData={updateData} />
                          </>
                        ) : (
                          <StepContent
                            data={data}
                            setData={updateData}
                            showCaseId={setShowCaseId}
                            allData={allData}
                            valueTab={valueTab}
                            setValueTab={setValueTab}
                            filter={filter}
                            setFilter={setFilter}
                            sort={sort}
                            setSort={setSort}
                            selected={selected}
                            setSelected={setSelected}
                            setAllProducts={setAllProducts}
                            setBanner={setBanner}
                            banner={banner}
                            forEdit
                          />
                        )}{" "}
                      </>
                    ) : (
                      <></>
                    )}
                  </TabPanel>
                ))}
              </>
            )}
          </Paper>
          <Preview
            data={data}
            needPreviewD={backgroundSettings.desktop.selectedImage}
            needPreviewM={backgroundSettings.mobile.selectedImage}
            bgSetting={backgroundSettings.desktop.settings}
            bgSettingM={backgroundSettings.mobile.settings}
            allProducts={valueTab === 0 ? allProducts : []}
            selected={selected}
            currentStep={1}
            allData={allData}
            contents={desktopContents}
            banner={banner}
            editMode
          />
        </div>
      </>
      <Confirm
        message="آیا از حذف این ویترین اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={() => deleteShowcase(id)}
        open={confirmDelete}
      />
    </div>
  );
};

export default ShowCaseEdit;
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { md: "20px" } }}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const addProductSteps = ["تعریف ویترین", "تنظیمات پس زمینه", "انتخاب محتوا"];
