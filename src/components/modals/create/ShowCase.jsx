import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../common";
import EditorTabs from "./components/EditorTabs";
import { initialShowcaseState } from "./config/initialState";
import Counter from "./counter";
import { useShowcaseApi } from "./hooks/useShowcaseApi";
import { useShowcaseState } from "./hooks/useShowcaseState";
import Preview from "./preview";
import Step1ShowCase from "./step1";
import Step2ShowCase from "./step2";
import Step3ShowCase from "./step3";
import StepContent from "./stepContent";
import StepContent2 from "./stepContent2";

const ShowCase = () => {
  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCaseId, setShowCaseId] = useState(null);
  const [allData, setAllData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState([]);
  const [selected, setSelected] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories2, setCategories2] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [desktopContents, setDesktopContents] = useState([]);
  const [mobileContents, setMobileContents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    data,
    updateData,
    backgroundSettings,
    updateBackgroundSettings,
    valueTab,
    setValueTab,
    banner,
    setBanner,
  } = useShowcaseState({ ...initialShowcaseState });
  const {
    loading: apiLoading,
    error: apiError,
    categories,
    blogCategories: blogcategories,
    showCaseType,
    attributes,
    brands,
    allUrl,
    createShowcase,
    uploadShowcaseImage,
  } = useShowcaseApi(token);
  const handleStepChange = async (step, sumbit) => {
    /*     if (step < 1 || step > 3) return;
     */
    try {
      setIsLoading(true);
      setError(null);

      if (sumbit) {
        try {
          await createShowcase(
            data,
            allData,
            backgroundSettings,
            filter,
            sort,
            selected,
            valueTab,
            desktopContents,
            mobileContents,
            banner
          );
          navigate("/showcases");
        } catch (err) {}

        return;
      }

      setCurrentStep(step);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      label: "اطلاعات اولیه",
    },
    {
      label: "تنظیمات",
    },
    {
      label: "انتخاب محتوا",
    },
  ];
  if (apiLoading || isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "500px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "   تنظیمات",
            path: "/companyInfo",
          },
          {
            title: "   تنظیمات صفحات",
            path: "/menu",
          },
        ]}
        title="ویترین ها"
      />
      <div className="mx-3">
        <Paper
          sx={{
            px: 3,
            py: 3,
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => handleStepChange(currentStep - 1)}
            disabled={currentStep === 1 || isLoading}
          >
            قبلی
          </Button>
          <Stepper
            sx={{
              direction: "ltr",
              width: "100%",
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? "#fff"
                  : theme.palette.background.paper,
            }}
            activeStep={currentStep - 1}
          >
            {steps.map((step, index) => (
              <Step key={step.label} completed={currentStep > index + 1}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Button
            variant="contained"
            onClick={() =>
              handleStepChange(currentStep + 1, currentStep === steps.length)
            }
            disabled={isLoading}
          >
            {currentStep === steps.length ? "ثبت اطلاعات" : "بعدی"}
          </Button>
        </Paper>

        <Paper sx={{ p: 3, mt: 4, minHeight: "500px" }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {currentStep === 1 && (
            <Step1ShowCase
              data={data}
              setData={updateData}
              allUrl={allUrl}
              editMode={false}
              ALL_FILTER={showCaseType}
            />
          )}
          {currentStep === 2 && (
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
          )}
          {currentStep === 3 && (
            <>
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
                />
              ) : data?.filter?.id === "4" ? (
                <>
                  {data?.viewType?.id === 57 ? (
                    /*  <StoryContent
                      id={showCaseId}
                      data={data}
                      setData={updateData}
                    /> */ <></>
                  ) : (
                    <Step3ShowCase
                      desktopContents={desktopContents}
                      setDesktopContents={setDesktopContents}
                      mobileContents={mobileContents}
                      setMobileContents={setMobileContents}
                      showCaseLimit={data.showCaseLimit || 7}
                      isMobile={isMobile}
                      setIsMobile={setIsMobile}
                      onBack={() => handleStepChange(2)}
                      onFinish={() => handleStepChange(4)}
                    />
                  )}
                </>
              ) : data?.filter?.id === "5" ? (
                <div className="mb-5">
                  <EditorTabs
                    value={data?.filterValue}
                    onChange={(e) => updateData({ ...data, filterValue: e })}
                    hint="html"
                  />
                </div>
              ) : data?.filter?.id === "8" ? (
                <Counter data={data} setData={updateData} />
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
                />
              )}
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
          currentStep={currentStep}
          allData={allData}
          contents={desktopContents}
          banner={banner}
        />
      </div>
    </>
  );
};

export default ShowCase;
