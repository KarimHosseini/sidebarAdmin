/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  Button,
  CircularProgress,
  Paper,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PageTitle } from "../../../components/common";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  EDIT_LEND_TECH_REQUEST,
  GET_LEND_TECH_STEP,
  GET_PLAN_SINGEL_LOAN,
  GET_PROVINCE,
  GET_SINGLE_LEND_TECH,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import Step1 from "../../planLoan/create/step1";
import CreateFrom from "./forms";
import Step2 from "./step2";

const CreatePlanLendTech = () => {
  const [loading, setLoading] = useState(null);
  const [userData, setUserData] = useState({ userType: "0" });
  const [currentStep, setCurrentStep] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const [payType1, setPayType1] = useState({});
  const [openCancel, setOpenCancel] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const [addProductSteps, setProductStep] = useState([]);
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();
  const [createdUser, setCreatedUser] = useState({});
  const navigate = useNavigate();
  const [province, setProvince] = useState([]);
  const [plans, setPlans] = useState([]);
  const [valueChanges, setvalueChanges] = useState(false);
  const [value, setValue] = useState();
  const [description, setDescription] = useState("");

  const [data, setData] = useState({});
  const [histories, setHistories] = useState(null);
  const [lendTechInfo, setlendTechInfo] = useState({});
  const [steps, setSteps] = useState({});

  const [disabled, setDisaled] = useState(false);
  useEffect(() => {
    axiosInstance(`${baseUrl}/${GET_PROVINCE}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data && data.code === 200 && data.data) {
          setProvince(data.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  }, []);
  useEffect(() => {
    if (searchParams.get("li")) {
      getLantechInfo(searchParams.get("li"));
    }
  }, [searchParams.get("li")]);
  const getLantechInfo = (li) => {
    axiosInstance(
      `${baseUrl}/${GET_SINGLE_LEND_TECH}?id=${li}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setlendTechInfo(data.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
    axiosInstance(
      `${baseUrl}/${GET_LEND_TECH_STEP}?filter[0][key]=lenTechId&filter[0][value]=${li}&filter[0][operator]=eq`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setSteps(data.data);
        var temp = data.data.sort(function (a, b) {
          return a.step - b.step;
        });

        setProductStep(temp);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };

  const getPlanData = (id, isUrl) => {
    axiosInstance(
      `${baseUrl}/${GET_PLAN_SINGEL_LOAN}?id=${id}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;

        var plns = plans?.find((item) => item?.id === data?.data?.planId);

        setData({ ...data?.data, plan: plns });
        if (isUrl) {
          setValue(data?.data?.user);
          setvalueChanges(true);
          setCurrentStep(data?.data?.step + 1);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const handleSumbit = () => {
    if (data?.step === 9) {
      navigate("/plan-loan");
    } else {
      var d = { ...data };
      if (!d.userId) {
        d = { ...d, userId: userData.id };
      }
      if (!d.step) {
        d = { ...d, step: 1 };
      } else {
        d = { ...d, step: d.step + 1 };
      }
      if (!d.lendTechId) {
        d = { ...d, lendTechId: searchParams.get("li") };
      }
      delete d.user;
      delete d.updateHistory;
      axiosInstance
        .put(
          `${baseUrl}/${EDIT_LEND_TECH_REQUEST}`,
          {
            ...d,
          },
          configReq(token)
        )
        .then((res) => {
          setData(res.data.data);
          setCurrentStep((s) => s + 1);
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
        });
    }
  };

  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "  تسهیلات",
            path: "/facilites",
          },
          {
            title: "    تسهیلات طرح",
            path: "/plan-loan",
          },
        ]}
        title={
          " ساخت  تسهیلات طرح" +
          `${
            data?.fullUserName
              ? ` برای ${data?.fullUserName}`
              : value?.fname
              ? ` برای ${value?.fname} ${value?.lname}`
              : ""
          }`
        }
      />
      <div className="px-3 ">
        <Box
          sx={{
            width: "100%",
            my: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={0}
            className=" rounded-lg border border-[#dbdfea] py-3 flex flex-wrap md:flex-nowrap items-center md:px-4 pl-2 w-full mb-4 gap-4 justify-end overflow-x-auto"
          >
            {" "}
            <Button
              onClick={() => {
                setCurrentStep((r) => r - 1);
              }}
              variant="outlined"
              sx={{ display: { md: "block ", xs: "none" } }}
              disabled={currentStep === 1}
            >
              مرحله قبل
            </Button>
            <Stepper
              activeStep={currentStep - 1}
              alternativeLabel
              sx={{
                direction: "ltr",
                /*     minWidth:"fit-content", */
                width: "100%",
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? "#fff"
                    : theme.palette.background.paper,
              }}
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
                    {label?.title}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <div className="flex justify-between w-full md:w-fit pr-2">
              <Button
                onClick={() => {
                  setCurrentStep((r) => r - 1);
                }}
                variant="outlined"
                sx={{ display: { md: "none ", xs: "block" } }}
                disabled={currentStep === 1}
              >
                مرحله قبل
              </Button>
              <Button
                onClick={() => {
                  handleSumbit();
                }}
                disabled={disabled}
                variant="contained"
              >
                {currentStep === 9 ? (
                  <>{loading ? <CircularProgress /> : <>ثبت اطلاعات</>}</>
                ) : (
                  <> مرحله بعد</>
                )}
              </Button>
            </div>
          </Paper>

          <div className="w-full relative">
            {addProductSteps?.map((item, index) => (
              <Fragment key={index + "1"}>
                {index + 1 === currentStep && (
                  <>
                    {item.type === 1 ? (
                      <>
                        {" "}
                        <Step1
                          setData={setData}
                          data={data}
                          province={province}
                          userData={userData}
                          setUserData={setUserData}
                          value={value}
                          setValue={setValue}
                          valueChanges={valueChanges}
                          setvalueChanges={setvalueChanges}
                          disabledAll={data?.step}
                          setCreatedUser={setCreatedUser}
                          createdUser={createdUser}
                        />
                      </>
                    ) : item.type === 2 ? (
                      <>
                        {" "}
                        <Step2
                          setData={setData}
                          data={{ userId: userData?.id, ...data }}
                          info={lendTechInfo}
                        />
                      </>
                    ) : item.type === 3 ? (
                      <>
                        <CreateFrom
                          setData={setData}
                          data={data}
                          stepInfo={item}
                        />
                      </>
                    ) : item.type === 4 ? (
                      <></>
                    ) : item.type === 5 ? (
                      <></>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </Fragment>
            ))}
          </div>
        </Box>
      </div>
    </>
  );
};

export default CreatePlanLendTech;
