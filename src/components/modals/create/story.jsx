import { Box, Button, Paper, Step, StepLabel, Stepper } from "@mui/material";
import React, { Fragment, useState } from "react";
import Step3ShowCase from "./step3";
const StoryContent = ({ id, data, setData, showCaseId, forEdit }) => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <Paper
      sx={{
        border: "1px solid #dbdfea",
        mb: 1,
        padding: "15px 16px 15px 16px",
        mt: 2,
      }}
      className="col-span-3 noShadow"
    >
      <Box
        elevation={0}
        className=" rounded-lg border border-[#dbdfea] py-3 flex items-center px-4 mb-8"
      >
        {" "}
        <Button
          onClick={() => {
            setCurrentStep((c) => c - 1);
          }}
          variant="outlined"
          disabled={currentStep === 1}
        >
          تب قبل
        </Button>
        <Stepper
          activeStep={currentStep - 1}
          alternativeLabel
          sx={{
            direction: "ltr",

            width: "100%",
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "#fff"
                : theme.palette.background.paper,
          }}
        >
          {data?.stories?.map((label) => (
            <Step key={label.title}>
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
                {label.title}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Button
          onClick={() => {
            setCurrentStep((c) => c + 1);
          }}
          variant="contained"
          disabled={currentStep === data?.stories?.length}
        >
          <> تب بعد</>
        </Button>
      </Box>
      {data?.stories?.map((item, index) => (
        <Fragment key={index}>
          {index + 1 === currentStep && (
            <div className="border rounded-lg">
              <Step3ShowCase
                forEdit={forEdit}
                contents={data.stories[currentStep - 1].content}
                setContents={(e) => {
                  var temp = [...data.stories];
                  temp[currentStep - 1] = {
                    ...temp[currentStep - 1],
                    content: e,
                  };
                  setData({ ...data, stories: temp });
                }}
                id={showCaseId}
                datas={data}
                storyIndex={index}
                storyBanner={data.stories[currentStep - 1].banner}
                setStoryBanner={(e) => {
                  var temp = [...data.stories];
                  temp[currentStep - 1] = {
                    ...temp[currentStep - 1],
                    banner: e,
                  };
                  setData({ ...data, stories: temp });
                }}
              />
            </div>
          )}
        </Fragment>
      ))}
    </Paper>
  );
};

export default React.memo(StoryContent);
