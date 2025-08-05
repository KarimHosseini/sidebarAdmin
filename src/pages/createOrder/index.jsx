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
import { PageTitle } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  ALL_SHIPPING_COMPANIES,
  baseUrl,
  GET_ALL_BRANCHES,
  GET_BY_FACILITES_ID,
  GET_FACILITIES,
  GET_PROVINCE,
  GET_USER_ADDRESS,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import Step1 from "../planLoan/create/step1";
import Step2CreateOrder from "./step2";
import Step3 from "./step3";
import OrderSend from "./step4";
import Step5 from "./step5";

const CreateOrder = () => {
  const { token } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(null);
  const [userData, setUserData] = useState({ userType: "0" });
  const [currentStep, setCurrentStep] = useState(1);
  const [valueChanges, setvalueChanges] = useState(false);
  const [value, setValue] = useState();
  const [createdUser, setCreatedUser] = useState({});
  const [data, setData] = useState({});
  const [province, setProvince] = useState([]);
  const [facilities, setfacilities] = useState([]);
  const [choosenFacilitesShipment, setchoosenFacilitesShipment] = useState();
  const [sendeddeliverTime, setSendedDeliverTime] = useState(null);
  const [selectedDay, setSelectedDay] = useState();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [datetype, setDateType] = useState(0);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [shipingCompany, setShipingCompany] = useState([]);
  const [selectedShipingCompany, setsSelectedShipingCompany] = useState({});
  const [address, setAddress] = useState([]);
  const [selectedaddress, setSelectedAddress] = useState([]);

  const [branch, setBranch] = useState({});
  useEffect(() => {
    axiosInstance
      .get(
        `${baseUrl}/${GET_ALL_BRANCHES}?Page=1&Limit=10000&filter[0][key]=active&filter[0][value]=true&filter[0][operator]=eq`,

        configReq(token)
      )
      .then((res) => {
        setBranches(res.data.data);
      })
      .catch((err) => {});

    axiosInstance
      .get(
        `${baseUrl}/${ALL_SHIPPING_COMPANIES}?Page=1&Limit=10000&filter[0][key]=active&filter[0][value]=true&filter[0][operator]=eq`,

        configReq(token)
      )
      .then((res) => {
        if (res.data.data.length > 0) {
          setsSelectedShipingCompany(
            res.data.data.find((item) => item.companyType === 1)
          );
        }
        setShipingCompany(res.data.data);
      })
      .catch((err) => {});
    axiosInstance(`${baseUrl}/${GET_PROVINCE}`, configReq(token))
      .then((res) => {
        const { data } = res;
        if (data && data.code === 200 && data.data) {
          setProvince(data.data);
        }
      })
      .catch((err) => {});
    axiosInstance(`${baseUrl}/${GET_FACILITIES}`, configReq(token))
      .then((res) => {
        const { data } = res;
        if (data && data.code === 200 && data.data) {
          setfacilities(data.data);
        }
      })
      .catch((err) => {});
  }, []);
  const getFacilityShipment = (id) => {
    axiosInstance(
      `${baseUrl}/${GET_BY_FACILITES_ID}?facilityId=${id}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        if (data && data.code === 200 && data.data) {
          const dateDict = {};
          res.data.data.forEach((item) => {
            const date = item.date;
            if (date in dateDict) {
              dateDict[date].push(item);
            } else {
              dateDict[date] = [item];
            }
          });

          const result2DArray = Object.values(dateDict);
          setchoosenFacilitesShipment(result2DArray);
        }
      })
      .catch((err) => {});
  };
  useEffect(() => {
    if (data.facilityId) {
      getFacilityShipment(data.facilityId);
    }
  }, [data.facilityId]);
  useEffect(() => {
    if (value?.id) {
      axiosInstance
        .get(
          `${baseUrl}/${GET_USER_ADDRESS}?filter[0][key]=userId&filter[0][value]=${value.id}&filter[0][operator]=eq`,

          configReq(token)
        )
        .then((res) => {
          setAddress(res.data.data);
        })
        .catch((err) => {});
    }
  }, [value]);
  return (
    <div>
      {" "}
      <PageTitle
        broadCrumb={[
          {
            title: "  سفارشات",
            path: "/orders",
          },
        ]}
        title={
          " ساخت   سفارش" +
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
              {STEPS.map((label) => (
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
                onClick={() => setCurrentStep((r) => r + 1)}
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
            <Fragment>
              {currentStep === 1 ? (
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
                  isOrder={true}
                />
              ) : currentStep === 2 ? (
                <>
                  <Step2CreateOrder
                    selectedProducts={selectedProducts}
                    setSelectedProducts={setSelectedProducts}
                    data={data}
                    setData={setData}
                    facilities={facilities}
                  />
                </>
              ) : currentStep === 3 ? (
                <>
                  <Step3
                    shipingCompany={shipingCompany}
                    setsSelectedShipingCompany={setsSelectedShipingCompany}
                    selectedShipingCompany={selectedShipingCompany}
                    setAddress={setAddress}
                    setSelectedAddress={setSelectedAddress}
                    selectedaddress={selectedaddress}
                    address={address}
                    setBranch={setBranch}
                    branches={branches}
                    userData={value}
                    province={province}
                  />
                </>
              ) : currentStep === 4 ? (
                <>
                  {" "}
                  <OrderSend
                    deliverTime={choosenFacilitesShipment}
                    setDeliverTime={(e) => setSendedDeliverTime(e)}
                    sendeddeliverTime={sendeddeliverTime}
                    isCodSelected={selectedShipingCompany?.companyType === 1}
                    setDateType={setDateType}
                    setSelectedDay={setSelectedDay}
                    setSelectedIndex={setSelectedIndex}
                    selectedDay={selectedDay}
                    selectedIndex={selectedIndex}
                    /*     hasPlan={company?.showPlanInCheckout && plans?.length > 0} */
                  />
                </>
              ) : currentStep === 5 ? (
                <>
                  <Step5
                    user={value}
                    selectedAddress={selectedaddress}
                    product={selectedProducts}
                    sendeddeliverTime={sendeddeliverTime}
                  />
                </>
              ) : (
                <></>
              )}
            </Fragment>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default CreateOrder;
const STEPS = [
  { id: 0, title: "انتخاب کاربر" },
  { id: 1, title: "انتخاب محصول" },
  { id: 2, title: "انتخاب نوع ارسال" },
  { id: 3, title: "انتخاب زمان تحویل" },
  { id: 4, title: "پیش نمایش فاکتور" },
  { id: 4, title: "پرداخت  " },
];
