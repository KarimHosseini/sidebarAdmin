import { Box, Paper, Step, StepLabel, Stepper } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PublicAttributesAccordion from "../../components/add-product/PublicAttributesAccordion";
import {
  StepFour,
  StepOne,
  StepThree,
  StepTwo,
} from "../../components/add-product/steps";
import { PageTitle } from "../../components/common";
import ForceSell from "../../components/single-product/forceSell";

const CreateProduct = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const navigate = useNavigate();
  const [createdId, setCreatedId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [createdName, setCreatedName] = useState("");
  const [addProductSteps, setAddStep] = useState([]);

  const [step, setStep] = useState({});
  useEffect(() => {
    var temp = [];
    var temp1 = {};
    temp.push({ name: "basic", title: " تعریف محصول" });
    if (
      userPermissions?.productPublicAttribute?.view &&
      userPermissions?.productPublicAttribute?.insert
    ) {
      temp.push({ name: "productPublicAttribute", title: "ویژگیهای عمومی" });
      temp1 = { ...temp1, productPublicAttribute: true };
    }
    if (
      userPermissions?.productAttribute?.view &&
      userPermissions?.productAttribute?.update
    ) {
      temp.push({ name: "productAttribute", title: " ویژگی های مشخصاتی" });
      temp1 = { ...temp1, productAttribute: true };
    }
    if (
      userPermissions?.productProperties?.view &&
      userPermissions?.productProperties?.update
    ) {
      temp.push({ name: "productProperties", title: "قیمت گذاری ویژگی ها" });
      temp1 = { ...temp1, productProperties: true };
    }
    if (
      userPermissions?.crossCells?.view &&
      userPermissions?.crossCells?.update
    ) {
      temp.push({ name: "crossCells", title: "فروش جانبی" });
      temp1 = { ...temp1, crossCells: true };
    }
    if (
      userPermissions?.productCrossForcedSell?.view &&
      userPermissions?.productCrossForcedSell?.update
    ) {
      temp.push({ name: "crossCellForce", title: "فروش اجباری جانبی" });
      temp1 = { ...temp1, crossCellForce: true };
    }

    setStep(temp1);
    setAddStep(temp);
  }, [userPermissions]);

  return (
    <>
      <PageTitle
        title={
          currentStep === 1
            ? "افزودن محصول"
            : `ثبت ${addProductSteps[currentStep - 1]?.title} ${createdName}`
        }
        broadCrumb={[
          {
            title: "مدیریت محصولات",
            path: "/products",
          },
          {
            title: "محصولات",
            path: "/products",
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
              <Step key={label?.title}>
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
                  {label?.title}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          <Paper
            elevation={0}
            className="rounded-lg  border-[#dbdfea] border w-full py-6 md:px-5 px-2 flex flex-col gap-6"
          >
            {currentStep === 1 && (
              <StepOne
                nextStep={() => {
                  if (step?.productPublicAttribute) {
                    setCurrentStep(2);
                  } else if (step?.productAttribute) {
                    setCurrentStep(3);
                  } else if (step?.productProperties) {
                    setCurrentStep(4);
                  } else if (step?.crossCells) {
                    setCurrentStep(5);
                  } else {
                    navigate("/products");
                  }
                }}
                setCreatedId={setCreatedId}
                setCreatedName={setCreatedName}
              />
            )}
            {currentStep === 2 && (
              <>
                <PublicAttributesAccordion
                  nextStep={() => {
                    if (step?.productAttribute) {
                      setCurrentStep(3);
                    } else if (step?.productProperties) {
                      setCurrentStep(4);
                    } else if (step?.crossCells) {
                      setCurrentStep(5);
                    } else {
                      navigate("/products");
                    }
                  }}
                  createdId={createdId}
                  createdName={createdName}
                />
              </>
            )}
            {currentStep === 3 && (
              <>
                <StepTwo
                  nextStep={() => {
                    if (step?.productProperties) {
                      setCurrentStep(4);
                    } else if (step?.crossCells) {
                      setCurrentStep(5);
                    } else {
                      navigate("/products");
                    }
                  }}
                  createdId={createdId}
                  createdName={createdName}
                />
              </>
            )}
            {currentStep === 4 && (
              <StepThree
                nextStep={() => {
                  if (step?.crossCells) {
                    setCurrentStep(5);
                  } else {
                    navigate("/products");
                  }
                }}
                createdId={createdId}
                setCreatedName={setCreatedName}
              />
            )}
            {currentStep === 5 && (
              <StepFour
                createdId={createdId}
                setCreatedName={setCreatedName}
                nextStep={() => {
                  setCurrentStep(6);
                }}
              />
            )}{" "}
            {currentStep === 6 && <ForceSell createdId={createdId} data={[]} />}
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default CreateProduct;
