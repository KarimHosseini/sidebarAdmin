import { Box, Paper, Step, StepLabel, Stepper } from "@mui/material";
import { useState } from "react";
import CrosBlog from "../../components/blogs/crossBlog";
import Forms from "../../components/blogs/forms";
import CrosBlogTag from "../../components/blogs/relatedTags";
import { PageTitle } from "../../components/common";

const CreateBlogs = () => {
  const [createdId, setCreatedId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [created, setCreated] = useState({});

  const [createdName, setCreatedName] = useState("");
  const addProductSteps = [
    "تعریف بلاگ",
    " بلاگ های مشابه",
    " تگ های بلاگ",
    /*     " ویژگی های مشخصاتی",
    " قیمت گذاری ویژگی ها", */
  ];
  return (
    <>
      <PageTitle
        title={
          currentStep === 1
            ? "افزودن محصول"
            : `ثبت ${addProductSteps[currentStep - 1]} ${createdName}`
        }
        broadCrumb={[
          {
            title: "مدیریت بلاگ",
            path: "/blog",
          },
          {
            title: "بلاگ",
            path: "/blog",
          },
        ]}
      />
      <div className="px-3 biggerButton">
        <Box
          sx={{
            width: "100%",
            my: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Stepper
            activeStep={currentStep - 1}
            alternativeLabel
            sx={{
              direction: "ltr",
              mb: 2,
              width: "100%",
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? "#fff"
                  : theme.palette.background.paper,
            }}
            className=" rounded-lg border border-[#dbdfea] py-3"
          >
            {addProductSteps.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    ".MuiStepLabel-label": {
                      fontSize: {
                        md: "0.9rem !important",
                        xs: "1rem !important",
                      },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          <Paper
            elevation={0}
            className="rounded-lg  border-[#dbdfea] border w-full pb-6 pt-3 md:px-5 px-2 flex flex-col gap-6"
          >
            {currentStep === 1 && (
              <Forms
                nextStep={() => setCurrentStep(2)}
                setCreatedId={setCreatedId}
                setCreatedName={setCreatedName}
                setCreated={setCreated}
              />
            )}{" "}
            {currentStep === 2 && (
              <>
                <CrosBlog
                  nextStep={() => setCurrentStep(3)}
                  createdId={createdId}
                  createdName={createdName}
                  data={created}
                />
              </>
            )}
            {currentStep === 3 && (
              <>
                <CrosBlogTag
                  nextStep={() => setCurrentStep(3)}
                  createdId={createdId}
                  createdName={createdName}
                />
              </>
            )}
            {/*  
            {currentStep === 3 && (
              <>
                <StepTwo
                  nextStep={() => setCurrentStep(4)}
                  createdId={createdId}
                  createdName={createdName}
                />
              </>
            )}
            {currentStep === 4 && (
              <StepThree
                nextStep={() => setCurrentStep(5)}
                createdId={createdId}
                setCreatedName={setCreatedName}
              />
            )}
            {currentStep === 5 && (
              <StepFour createdId={createdId} setCreatedName={setCreatedName} />
            )} */}
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default CreateBlogs;
