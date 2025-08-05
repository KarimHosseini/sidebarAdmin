/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  Button,
  CircularProgress,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, PageTitle } from "../../../components/common";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  EDIT_PLAN_LOAN,
  GET_PLAN_ACTIVE,
  GET_PLAN_CHECK_PAYMENT,
  GET_PLAN_SINGEL_LOAN,
  GET_PROVINCE,
  RETRIEVAL_PLAN_LOAN,
  STEP_PLAN_LOAN,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";
import Step6 from "./step6";
import Step7 from "./step7";
import Step8 from "./step8";
import Step9 from "./step9";

const CreatePlanLoan = () => {
  const [loading, setLoading] = useState(null);
  const [userData, setUserData] = useState({ userType: "0" });
  const [currentStep, setCurrentStep] = useState(1);
  const [payType, setPayType] = useState({});
  const [payType2, setPayType2] = useState({});
  const [payType3, setPayType3] = useState({});
  const [payType4, setPayType4] = useState({});

  const [payType1, setPayType1] = useState({});
  const [openCancel, setOpenCancel] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const [addProductSteps, setProductStep] = useState([
    "ثبت نام / انتخاب",
    "انتخاب طرح",
    "پرداخت /دریافت مدارک",
    "صحت سنجی",
    "تعیین نوبت",
    "تحویل مدارک به باجه",
    "ارسال به بانک",
    " شارژ از بانک",
    "اخذ اعتبار",
  ]);
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
  const [allPayed, setAllPayed] = useState(false);
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
    getPlan();
  }, []);
  const getPlan = () => {
    axiosInstance(
      `${baseUrl}/${GET_PLAN_ACTIVE}?Page=1&Limit=2000&filter[0][key]=planType&filter[0][value]=0&filter[0][operator]=eq`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading(false);
        setPlans(res?.data?.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const changeStep = (e) => {
    var id = data?.id;
    axiosInstance
      .post(
        `${baseUrl}/${STEP_PLAN_LOAN}?step=${e}`,
        {
          id: id,
        },
        configReq(token)
      )
      .then((res) => {
        const { data } = res;
        getPlanData(id, false);
        setCurrentStep(e + 1);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);

        /*  setLoading(false); */
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

  useEffect(() => {
    /* setDisaled */
    if (currentStep === 1) {
      if (userData?.id || data?.step > 1) {
        setDisaled(false);
      } else {
        setDisaled(true);
      }
    } else if (currentStep === 2) {
      if (data?.planId) {
        setDisaled(false);
      } else {
        setDisaled(true);
      }
    } else if (currentStep === 3) {
      if (payType[1] || data?.step > 2) {
        setDisaled(false);
      } else {
        setDisaled(true);
      }
    } else if (currentStep === 4) {
      if (data?.documentValidation) {
        setDisaled(false);
      } else {
        setDisaled(true);
      }
    } else if (currentStep === 5) {
      if (data?.meetDateTime) {
        setDisaled(false);
      } else {
        setDisaled(true);
      }
    } else if (currentStep === 6) {
      if (data?.documentReceived) {
        setDisaled(false);
      } else {
        setDisaled(true);
      }
    } else if (currentStep === 7) {
      if (data?.bankConfirm && (data?.endWage === false ? payType4[4] : true)) {
        setDisaled(false);
      } else {
        setDisaled(true);
      }
    } else if (currentStep === 8) {
      if (data?.documentSent) {
        setDisaled(false);
      } else {
        setDisaled(true);
      }
    } else if (currentStep === 9) {
      if (allPayed || payType4[4] === true) {
        setDisaled(false);
      } else {
        setDisaled(true);
      }
    }
  }, [data, currentStep, userData, allPayed, payType4]);
  useEffect(() => {
    if (data?.id) {
      checkBank(0, false);
   /*    checkBank(1, false); */
      if (data?.step === 8 || data?.step === 9) {
        checkBank2(2, false);
      }
      if (data?.step > 5) {
        checkBank(3, false);
      }
    }
  }, [data?.id]);
  const checkBank = (e, noError = true) => {
    var step = data?.step;
    var d = { ...data };
    axiosInstance(
      `${baseUrl}/${GET_PLAN_CHECK_PAYMENT}?id=${data?.id}&payType=${e}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        if (res?.data?.data.payState === true) {
          var status = res?.data?.data.payState;
          if (noError) {
            if (status) {
              toast.success("هزینه مورد نظر پرداخت شده است");
            } else {
              toast.error("هزینه مورد نظر پرداخت نشده است");
            }
          }
          if (e === 0) {
            setPayType1({ 1: true });
          } else if (e === 1) {
            setPayType2({ 2: true });
          } else if (e === 2) {
            setPayType3({ 3: true });
          } else if (e === 3) {
            setPayType4({ 4: true });
          }
          if (e === 0 && (noError || step === 2)) {
            var plan = d.plan;
            var user = d.user;
            delete d.plan;
            delete d.branchs;
            delete d.updateHistory;
            delete d.updatesHistory;
            delete d.user;
            delete d.updatedBy;
            delete d.knowType;
            delete d.createdBy;
            delete d.createdByName;
            delete d.updatedByName;
            delete d.revokeDesc;
            delete d.StepComment;
            delete d.user;
            axiosInstance
              .put(
                `${baseUrl}/${EDIT_PLAN_LOAN}`,
                {
                  ...d,
                  step: 2,
                },
                configReq(token)
              )
              .then((res) => {
                const { data } = res;
                setData({
                  ...d,
                  plan: plan,
                  step: 2,
                  user: user,
                });
                setPayType({
                  ...payType,
                  [e + 1]: status,
                });
              })
              .catch((err) => {
                toast.error(err.response?.data?.message);
              });
          } else {
            setPayType({
              ...payType,
              [e + 1]: status,
            });
          }
        } else {
          if (noError) {
            toast.error("هزینه مورد نظر پرداخت نشده است");
          }
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const checkBank2 = (e, noError = true) => {
    axiosInstance(
      `${baseUrl}/${GET_PLAN_CHECK_PAYMENT}?id=${data?.id}&payType=${e}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        if (res?.data?.data.payState === true) {
          var status = res?.data?.data.payState;
          if (noError) {
            if (status) {
              toast.success("هزینه مورد نظر پرداخت شده است");
            } else {
              toast.error("هزینه مورد نظر پرداخت نشده است");
            }
          }
          setAllPayed(status);
        } else {
          if (noError) {
            toast.error("هزینه مورد نظر پرداخت نشده است");
          }
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (id && plans?.length > 0) {
      getPlanData(id, true);
    }
  }, [id, plans]);
  const handleSumbit = () => {
    if (data?.step === 9) {
      navigate("/plan-loan");
    } else {
      var d = { ...data };
      var plan = d.plan;
      var user = d.user;
      setLoading(true);
      delete d.plan;
      delete d.branchs;
      delete d.updateHistory;
      delete d.updatesHistory;
      delete d.user;
      delete d.updatedBy;
      delete d.knowType;
      delete d.createdBy;
      delete d.createdByName;
      delete d.updatedByName;
      delete d.revokeDesc;
      delete d.StepComment;

      axiosInstance
        .put(
          `${baseUrl}/${EDIT_PLAN_LOAN}`,
          {
            ...d,
            step: 8,
          },
          configReq(token)
        )
        .then((res) => {
          const { data } = res;
          setData({
            ...d,
            plan: plan,
            user: user,
            step: 8,
          });
          setLoading(false);
          navigate("/plan-loan");
          toast.success("با موفقیت ثبت شد");
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
        });
    }
  };
  useEffect(() => {
    setPayType({
      ...payType,
      ...payType1,
      ...payType2,
      ...payType3,
      ...payType4,
    });
  }, [payType1, payType3, payType2]);
  useEffect(() => {
    if (data?.updateHistory) {
      var temp = JSON.parse(data?.updateHistory);

      var step = temp?.find((item) => item?.step === currentStep - 1);

      setHistories(step);
    }
  }, [data?.step, currentStep]);
  const cancelCancel = () => {
    setLoadingCancel(true);
    axiosInstance
      .post(
        `${baseUrl}/${RETRIEVAL_PLAN_LOAN}?description=${description}`,
        { id },
        configReq(token)
      )
      .then((res) => {
        setData(res?.data?.data);
        setLoadingCancel(false);
        setOpenCancel(false);
        setDescription("");
      })
      .catch((err) => {
        setLoadingCancel(false);
      });
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
                    {label}
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
                  if (currentStep === 9) {
                    handleSumbit();
                  } else if (currentStep === 2 && data.step === 3) {
                    setCurrentStep(4);
                  } else {
                    setCurrentStep((r) => r + 1);
                  }
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
            {data?.state === 2 ? (
              <Box
                sx={{
                  zIndex: data?.state === 2 && !openCancel ? 9999999 : 0,
                }}
                className="absolute z-20 cursor-not-allowed w-full h-full top-0 right-0 flex flex-col justify-start items-center"
              >
                {" "}
                <img
                  src="/images/cancle_status copy.svg"
                  alt=""
                  className="max-w-[200px] relative"
                  style={{
                    zIndex: data?.state === 2 && !openCancel ? 9999999 : 0,
                  }}
                />
                <div
                  style={{
                    zIndex: data?.state === 2 && !openCancel ? 9999999 : 0,
                  }}
                  className="relative mt-10"
                >
                  <Button
                    onClick={() => setOpenCancel(true)}
                    variant="contained"
                    color="success"
                  >
                    لغو کنسل
                  </Button>
                </div>
                <div className="absolute  bg-gray-100   opacity-60 w-full h-full "></div>
              </Box>
            ) : (
              <></>
            )}
            {currentStep === 1 ? (
              <>
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
            ) : currentStep === 2 ? (
              <>
                <>
                  <Step2
                    setData={setData}
                    data={{ userId: userData?.id, ...data }}
                    plans={plans}
                    disable={data?.state !== 2 ? data?.step > 1 : false}
                  />
                </>
              </>
            ) : currentStep === 3 ? (
              <>
                <>
                  <Step3
                    userData={value ? value : userData}
                    checkBank={(e) => checkBank(e)}
                    datas={data}
                    payType={payType}
                    setDatas={setData}
                    disabled={data?.state !== 2 ? data?.step > 2 : false}
                    changeStep={(e) => changeStep(e)}
                  />
                </>
              </>
            ) : currentStep === 4 ? (
              <>
                <Step4
                  data={data}
                  setData={setData}
                  disabled={data?.state !== 2 ? data?.step > 3 : false}
                  changeStep={(e) => changeStep(e)}
                />
              </>
            ) : currentStep === 5 ? (
              <Step5
                data={data}
                setData={setData}
                disabled={data?.state !== 2 ? data?.step > 4 : false}
              />
            ) : currentStep === 6 ? (
              <>
                <Step6
                  data={data}
                  changeStep={(e) => changeStep(e)}
                  setData={setData}
                  disabled={data?.state !== 2 ? data?.step > 5 : false}
                />
              </>
            ) : currentStep === 7 ? (
              <>
                <Step7
                  data={data}
                  changeStep={(e) => changeStep(e)}
                  setData={setData}
                  payType={payType}
                  checkBank={(e) => checkBank(3)}
                  disabled={data?.state !== 2 ? data?.step > 6 : false}
                />
              </>
            ) : currentStep === 8 ? (
              <>
                <Step8
                  data={data}
                  setData={setData}
                  disabled={data?.state !== 2 ? data?.step > 7 : false}
                  changeStep={(e) => changeStep(e)}
                />
              </>
            ) : (
              <>
                <Step9
                  data={data}
                  setData={setData}
                  disabled={data?.state !== 2 ? data?.step > 8 : false}
                  checkBank={(e) => checkBank2(e)}
                  payType={allPayed}
                  plans={plans}
                  changeStep={(e) => changeStep(e)}
                />
              </>
            )}
          </div>
          {histories?.userName && (
            <div className="flex md:justify-end my-8 w-full flex-wrap gap-5">
              <span>ویرایش کننده : {histories?.userName}‌</span>{" "}
              <span>
                تاریخ :{" "}
                {new Date(histories?.dateTime).toLocaleDateString("fa-IR")}‌
              </span>
            </div>
          )}

          {/*      <div className="md:absolute bottom-2 left-2 md:w-[200px] w-full mt-6">
              <Revoke data={data} setData={setData} /> 
          </div> */}
        </Box>
        <Modal
          open={openCancel}
          close={() => {
            setOpenCancel(false);
            setDescription("");
          }}
          title="فعال کردن تسهیلات "
        >
          <div className="flex flex-col gap-6">
            <span>آیا از فعال کردن این تسهیلات اطمینان دارید ؟‌</span>
            <TextField
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              multiline
              fullWidth
              focused
              label="توضیحات"
            />
            <div className="flex justify-between">
              <Button
                onClick={() => {
                  setOpenCancel(false);
                  setDescription("");
                }}
                variant="contained"
                sx={{ width: { md: "150px !important" } }}
                color="error"
              >
                لغو
              </Button>
              <Button
                disabled={loadingCancel}
                sx={{ width: { md: "150px !important" } }}
                onClick={cancelCancel}
                variant="contained"
              >
                {loadingCancel ? <CircularProgress /> : "    ثبت اطلاعات"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default CreatePlanLoan;
