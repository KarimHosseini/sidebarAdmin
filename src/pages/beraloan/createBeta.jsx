import {
  Button,
  Paper,
  Skeleton,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { useState } from "react";
import { PageTitle, TextInput } from "../../components/common";

import { useSelector } from "react-redux";
const CreateBeta = () => {
  const [reuqestDetail, setRequesDetail] = useState({});
  const { token, userId } = useSelector((state) => state.user);
  const [currentStep, setcurrentStep] = useState(1);
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };
  return (
    <div>
      {" "}
      <PageTitle
        title={"  ثبت تسهیلات "}
        broadCrumb={[
          {
            title: "  تسهیلات",
            path: "/facilites",
          },
          {
            title: "  تسهیلات رفاه",
            path: "/betaloan",
          },
        ]}
      />
      <div className="md:mx-3 mx-1 ">
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
          <Step>
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
              اطلاعات اولیه
            </StepLabel>
          </Step>
          <Step>
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
              ثبت درخواست
            </StepLabel>
          </Step>
        </Stepper>
        {currentStep === 1 ? (
          <Paper
            sx={{ border: "1px solid #dbdfea", mt: 2, px: 2 }}
            elevation={0}
          >
            <div className="grid grid-cols-4 p-3 gap-4">
              {/*  <SearchInput2
                url={ALL_USERS}
                value={value}
                setValue={(e) => {
                  setValue(e);
                }}
                label={"جست و جو کاربر"}
              /> */}
              <TextInput
                change={(e) => setRequesDetail({ ...reuqestDetail, title: e })}
                currentValue={reuqestDetail.title}
                label="عنوان  محصول"
              />

              <div className="col-span-3">
                <TextInput
                  change={(e) =>
                    setRequesDetail({ ...reuqestDetail, description: e })
                  }
                  currentValue={reuqestDetail.description}
                  label="توضیحات  "
                />
              </div>
              <div className="col-span-4 flex justify-center">
                <Button
                  variant="contained"
                  onClick={() => setcurrentStep(2)}
                  disabled={!reuqestDetail.description || !reuqestDetail.title}
                >
                  مرحله بعد
                </Button>
              </div>
            </div>
          </Paper>
        ) : (
          <>
            {" "}
            {loading && (
              <Skeleton
                height={"70vh"}
                width={"100%"}
                animation="wave"
                variant="rounded"
                className="mt-3"
              />
            )}{" "}
            {/* ${process.env.REACT_APP_DOMAIN_URL} */}
            <iframe
              src={`${process.env.REACT_APP_DOMAIN_URL}/beta?description=${reuqestDetail.description}&title=${reuqestDetail.title}&tk=${token}&ui=${userId}`}
              style={{
                width: "100%",
                height: "100vh",
                visibility: loading ? "hidden" : "visible",
              }}
              loading="lazy"
              onLoad={handleLoad}
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateBeta;
