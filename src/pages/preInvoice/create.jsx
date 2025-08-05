import {
  Alert,
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
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Dropdown, Modal, PageTitle, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  CHECK_USER_CREDIT,
  CREATE_PREINVOICE,
  EDIT_PREINVOICE,
  GET_CHILD_FACILITIES,
  GET_PROVINCE,
  GET_USER_ADDRESS,
  SINGLE_ORDER,
} from "../../helpers/api-routes";
import { getWay } from "../../helpers/constants";
import { configReq } from "../../helpers/functions";
import PreCreateInvoice from "../invoices/preCreate";
import Step1 from "../planLoan/create/step1";

const CreatePreFactor = () => {
  const { token, userId } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [userInfo, setuserInfo] = useState({});
  const { id } = useParams();
  const [loading, setLoading] = useState(null);
  const [userData, setUserData] = useState({ userType: "0" });
  const [currentStep, setCurrentStep] = useState(1);
  const [valueChanges, setvalueChanges] = useState(false);
  const [value, setValue] = useState();
  const [createdUser, setCreatedUser] = useState({});
  const [data, setData] = useState({ productProperty: [] });
  const [province, setProvince] = useState([]);
  const [facilities, setfacilities] = useState([]);
  const [loadingOrder, setLoadingOrder] = useState();
  const [sendeddeliverTime, setSendedDeliverTime] = useState(null);
  const [noCredit, setNoCredit] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loadingCredit, setLoadingCredit] = useState(false);
  const [openDifferenceModal, setOpenDifferenceModal] = useState(false);
  const [userBuyMax, setuserBuyMax] = useState();
  const [selectedaddress, setSelectedAddress] = useState();
  const [selectedaddressAgent, setSelectedAddressAgent] = useState();
  const [passCredit, setPassCredit] = useState(false);
  const [error, setError] = useState({});
  const [allTotal, setAllTotal] = useState({});
  useEffect(() => {
    if (localStorage.getItem("s")) {
      setuserInfo(JSON.parse(localStorage.getItem("s")));
      axiosInstance
        .get(
          `${baseUrl}/${GET_USER_ADDRESS}?filter[0][key]=userId&filter[0][value]=${
            JSON.parse(localStorage.getItem("s"))?.id
          }&filter[0][operator]=eq`,

          configReq(token)
        )
        .then((res) => {
          const find = res.data?.data.find((item) => item.isDefault === true);

          if (find) {
            setSelectedAddressAgent(find);
          } else {
            setSelectedAddressAgent(res.data?.data[0]);
          }
        })
        .catch((err) => {});
    }
  }, [localStorage.getItem("s")]);

  useEffect(() => {
    axiosInstance(`${baseUrl}/${GET_PROVINCE}`, configReq(token))
      .then((res) => {
        const { data } = res;
        if (data && data.code === 200 && data.data) {
          setProvince(data.data);
        }
      })
      .catch((err) => {});
    axiosInstance
      .get(
        `${baseUrl}/${GET_CHILD_FACILITIES}?agentMode=true`,
        configReq(token)
      )
      .then((res) => {
        var temp = [];

        res.data.data
          .filter((item) => item.children?.length > 0)
          .map((item) => {
            temp.push({
              title: `↓ - ${item.title} - ↓ `,
              id: -1,
              disabled: true,
            });
            item.children.map((ch) => {
              temp.push({
                title: ch.title,
                id: ch.id,
                gatewayname: ch.gatewayName,
                wage: ch.wage,
                hasValidation: ch.hasValidation,
                maxCredit: ch.maxCredit,
                gatewayId: ch.gatewayId,
              });
            });
          });
        setfacilities(temp);
        const firstChild = temp.find((item) => item.id !== -1);
        if (firstChild && !data.FacilityId) {
          setData({
            ...data,
            FacilityId: firstChild.id,
            wage: firstChild.wage,
            gatewayname: firstChild.gatewayname,
            maxCredit: firstChild.maxCredit,
            hasValidation: firstChild.hasValidation,
            gatewayId: firstChild.hasValidation,
          });
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  }, []);
  useEffect(() => {
    if (id) {
      setCurrentStep(3);
      setLoadingOrder(true);
      axiosInstance(`${baseUrl}/${SINGLE_ORDER}?id=${id}`, configReq(token))
        .then((res) => {
          const { data } = res;
          setLoadingOrder(false);
          var temp = [];
          res.data.data.detail.map((item) => {
            temp.push({
              title: item.title,
              description: item.description,
              qty: item.qty,
              price: Number(item.price) * 10,
              discount: item.discount * 10,
              vat: item.vat,
              basePrice: item.basePrice * 10,
              totalPrice: item.total * 10,
              finalPrice: item.finalPrice * 10,
              saleType: 0,
            });
          });
          setData({
            productProperty: temp,
            description: res.data.data.order.description,
            gatewayname: getWay.find(
              (item) =>
                Number(item.value) === Number(res.data.data?.order.gateway)
            )?.title,
            FacilityId: res.data.data.order.facilityId,
            FacilityUserMaxCredit: res.data.data.order.facilityUserMaxCredit,
            facilityPrice: res.data.data.order.facilityPrice,
            UserSalePower: res.data.data.order.userSalePower,
            RefahCredit: res.data.data.order.userMaxCredit,
          });
          setuserBuyMax({
            FacilityUserMaxCredit: res.data.data.order.facilityUserMaxCredit,
            facilityPrice: res.data.data.order.facilityPrice,
            userSalePower: res.data.data.order.userSalePower,
            RefahCredit: res.data.data.order.userMaxCredit,
          });
          setValue({
            fname: res.data.data.order.userName,
            companyName: res.data.data.order.companyName,
            isLegal: res.data.data.order.isLegal,
            nationalCode: res.data.data.order.nationalCode,
            economicCode: res.data.data.order.economicCode,
            regNumber: res.data.data.order.regNumber,
            mobile: res.data.data.order.mobile,
            tel: res.data.data.order.tel,
            id: res.data.data.order.userId,
          });
        })
        .catch((err) => {
          setLoadingOrder(false);
        });
    }
  }, [id]);
  useEffect(() => {
    if (currentStep === 1) {
      setIsDisabled(!value && !userData?.id);
    } else if (currentStep === 2) {
      setIsDisabled(!data.FacilityId);
    } else {
      setIsDisabled(false);
    }
  }, [currentStep, value, data.FacilityId, userData?.id]);
  const handleSubmit = () => {
    var temp = [];
    var hasError = false;
    var tempError = {};
    var totalPrice = 0;
    data.productProperty.map((item, index) => {
      if (
        !item.title ||
        !item.description ||
        item.qty === undefined ||
        item.price === undefined
      ) {
        tempError = {
          ...tempError,
          [index]: {
            title: !item.title,
            description: !item.description,
            qty: item.qty === undefined,
            price: item.price === undefined,
          },
        };

        hasError = true;
      }
      totalPrice += item.finalPrice / 10;
      temp.push({
        Title: item.title,
        Description: item.description,
        Qty: item.qty,
        Price: Number(item.price) / 10,
        Discount: item.discount / 10,
        Vat: item.vat,
        BasePrice: item.basePrice / 10,
        TotalPrice: item.totalPrice / 10,
        FinalPrice: item.finalPrice / 10,
        SaleType: 0,
      });
    });
    const userMax = userBuyMax?.userSalePower;
    var sumbitedData = {
      UserId: value.id || userData.id,
      FacilityId: data.FacilityId,
      FacilityUserMaxCredit: userBuyMax?.userSalePower || 0,
      Deference: totalPrice - userMax < 0 ? 0 : totalPrice - userMax,
      AgentId: userId,
      facilityPrice: data.hasValidation
        ? totalPrice - userMax < 0
          ? totalPrice
          : userMax || userBuyMax?.guarantorCredit
        : totalPrice,
      UserSalePower: userBuyMax?.userSalePower || 0,
      RefahCredit: userBuyMax?.userMaxCredit || 0,
      title: "خرید کالا",
      description: "",
    };
    if (data.description)
      sumbitedData = { ...sumbitedData, Description: data.description };
    if (hasError) {
      setError(tempError);
      toast.error("همه فیلد ها اجباری را پر کنید");
    } else {
      sumbitedData = { ...sumbitedData, AgentPreOrderDetail: temp };
      if (id) {
        axiosInstance
          .put(
            `${baseUrl}/${EDIT_PREINVOICE}`,
            { ...sumbitedData, Id: id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            navigate(`/order/${id}`);

            toast.success("با موفقیت ثبت شد");
          })
          .catch((err) => {
            setLoading(false);
            toast.error(err.response?.data?.message);
          });
      } else {
        axiosInstance
          .post(`${baseUrl}/${CREATE_PREINVOICE}`, sumbitedData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            navigate("/orders");
            toast.success("با موفقیت ثبت شد");
          })
          .catch((err) => {
            setLoading(false);
            toast.error(err.response?.data?.message);
          });
      }
    }
  };
  const checkCredit = () => {
    getMaxData(0);
  };

  const getMaxData = (credit) => {
    if (data.FacilityId) {
      setLoadingCredit(true);
      axiosInstance
        .post(
          `${baseUrl}/${CHECK_USER_CREDIT}`,
          {
            facilityId: data.FacilityId,
            userId: value.id || userData.id,
            agentId: userId,
            agentMode: true,
          },
          configReq(token)
        )
        .then((res) => {
          if (res.data.code === -1) {
            toast.error(res.data.message || "مشخصه وارد شده صحیح نمی باشد");
          } else {
            setuserBuyMax({
              ...res.data.data?.salePower,
              financierCredit: res.data.data?.financierCredit,
              guarantorCredit: res.data.data?.guarantorCredit,
              isOkFinancier: res.data.data?.isOkFinancier,
              isOkGuarantor: res.data.data?.isOkGuarantor,
              nextStep: res.data.data?.nextStep,
              startDate: res.data.data?.startDate,
            });
          }

          setLoadingCredit(false);
        })
        .catch((err) => {
          setLoadingCredit(false);
          toast.error(
            err.response?.data?.message || "مشخصه وارد شده صحیح نمی باشد"
          );
        });
    }
  };
  return (
    <div>
      <PageTitle
        broadCrumb={[
          {
            title: "  سفارشات",
            path: "/orders",
          },
        ]}
        title={
          `   ${id ? "ویرایش" : "ساخت"} پیش فاکتور بدون وابستگی نماینده` +
          `${
            id
              ? ` برای ${value?.fname}`
              : data?.fullUserName
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
                setuserBuyMax();
                setData({ ...data, facilityPrice: 0 });
              }}
              variant="outlined"
              sx={{ display: { md: "block ", xs: "none" } }}
              disabled={currentStep === 1 || id}
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
                  setuserBuyMax();
                }}
                variant="outlined"
                sx={{ display: { md: "none ", xs: "block" } }}
                disabled={currentStep === 1 || id}
              >
                مرحله قبل
              </Button>
              <Button
                onClick={() => {
                  if (currentStep === 3) {
                    var totalPrice = 0;
                    data.productProperty.map((item, index) => {
                      totalPrice += item.finalPrice / 10;
                    });
                    const userMax = userBuyMax?.userSalePower;
                    if (totalPrice - userMax > 0) {
                      setAllTotal({ totalPrice, userMax });
                      setOpenDifferenceModal(true);
                    } else {
                      handleSubmit();
                    }
                  } else if (
                    currentStep === 2 &&
                    data.hasValidation &&
                    !userBuyMax
                  ) {
                    checkCredit();
                  } else {
                    setCurrentStep((r) => r + 1);
                  }
                }}
                variant="contained"
                disabled={isDisabled || loadingCredit}
              >
                {loadingCredit ? (
                  <>
                    در حال دریافت اطلاعات از بانک <CircularProgress />
                  </>
                ) : (
                  <>
                    {" "}
                    {currentStep === 3 ? (
                      <>{loading ? <CircularProgress /> : <>ثبت اطلاعات</>}</>
                    ) : currentStep === 2 ? (
                      data.hasValidation && !userBuyMax ? (
                        "اعتبار سنجی "
                      ) : (
                        "مرحله بعد"
                      )
                    ) : (
                      <> مرحله بعد</>
                    )}
                  </>
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
                <Paper
                  className="p-3 border md:grid gap-4 grid-cols-3 pb-10"
                  elevation={0}
                >
                  {noCredit && (
                    <Alert
                      className="col-span-3"
                      sx={{ my: 3 }}
                      variant="filled"
                      severity="error"
                    >
                      کاربر{" "}
                      {id
                        ? `  ${value?.fname}`
                        : data?.fullUserName
                        ? `  ${data?.fullUserName}`
                        : value?.fname
                        ? `  ${value?.fname} ${value?.lname}`
                        : ""}{" "}
                      اعتبار در بانک {noCredit} ندارد
                    </Alert>
                  )}
                  <Dropdown
                    title="انتخاب تسهیلات"
                    data={facilities}
                    value={facilities.find(
                      (item) => item.id === data.FacilityId
                    )}
                    change={(e) => {
                      setuserBuyMax();
                      setData({
                        ...data,
                        FacilityId: e.id,
                        wage: e.wage,
                        gatewayname: e.gatewayname,
                        maxCredit: e.maxCredit,
                        hasValidation: e.hasValidation,
                        gatewayId: e.hasValidation,
                        gateway: e.gatewayId,
                      });
                    }}
                  />
                  {data.wage ? (
                    <>
                      {" "}
                      <TextInput
                        label="کارمزد"
                        currentValue={data.wage}
                        disabled
                      />{" "}
                      <TextInput
                        label="حداکثر مبلغ پیش فاکتور"
                        currentValue={data.maxCredit}
                        disabled
                        price
                        number
                      />
                    </>
                  ) : (
                    <></>
                  )}{" "}
                  <TextInput
                    label="اعتبار درخواستی با احتساب کسر کارمزد"
                    currentValue={data.facilityPrice || ""}
                    change={(e) => {
                      if (userBuyMax?.userSalePower) {
                        if (e > userBuyMax?.userSalePower) {
                          toast.error(
                            "مبلغ در خواستی نباید از سقف توان مشتری بیشتر باشد"
                          );
                        } else if (data.maxCredit < e) {
                          toast.error(
                            "مبلغ در خواستی نباشد از حداکثر مبلغ پیش فاکتور بیشتر باشد"
                          );
                        } else {
                          setData({
                            ...data,
                            facilityPrice: e,
                          });
                        }
                      } else {
                        toast.error("ابتدا اعتبار سنجی   کنید");
                      }
                    }}
                    number
                    price
                  />
                  {userBuyMax && (
                    <>
                      {data.gateway === 15 && (
                        <TextInput
                          label="حداکثر اعتبار تسهیلاتی"
                          currentValue={userBuyMax?.maxFacilityCredit || ""}
                          price
                          disabled
                          number
                        />
                      )}

                      <TextInput
                        label="توان خرید مشتری"
                        currentValue={userBuyMax?.userSalePower}
                        disabled
                        price
                        number
                      />
                      {userBuyMax?.isOkGuarantor ? (
                        <TextInput
                          label="اعتبار تضمین کننده"
                          currentValue={userBuyMax?.guarantorCredit || ""}
                          disabled
                          price
                          number
                        />
                      ) : (
                        <>
                          <Alert severity="error">
                            تضمین کننده اعتبار سنجی نشده است
                          </Alert>
                        </>
                      )}
                      {userBuyMax?.isOkFinancier ? (
                        <TextInput
                          label="اعتبار تامین کننده"
                          currentValue={userBuyMax?.financierCredit || ""}
                          disabled
                          price
                          number
                        />
                      ) : (
                        <>
                          <Alert severity="error">
                            تامین کننده اعتبار سنجی نشده است
                          </Alert>
                        </>
                      )}
                    </>
                  )}
                  {userBuyMax && (
                    <>
                      <TextInput
                        label="خروجی استعلام  "
                        currentValue={userBuyMax?.userMaxCredit}
                        disabled
                        price
                        number
                      />
                    </>
                  )}
                </Paper>
              ) : currentStep === 3 ? (
                <>
                  {selectedaddressAgent ? (
                    <PreCreateInvoice
                      user={value}
                      selectedAddress={selectedaddress}
                      product={selectedProducts}
                      setData={setData}
                      data={data}
                      sendeddeliverTime={sendeddeliverTime}
                      selectedaddressAgent={selectedaddressAgent}
                      userInfo={userInfo}
                      error={error}
                      userBuyMax={
                        (data.facilityPrice
                          ? data.facilityPrice
                          : userBuyMax?.userSalePower) * 10
                      }
                      setError={setError}
                    />
                  ) : (
                    "نماینده محترم لطفا نشانی برای خود ثبت کنید"
                  )}{" "}
                </>
              ) : (
                <></>
              )}
            </Fragment>
          </div>
        </Box>
      </div>{" "}
      {allTotal.userMax && (
        <Modal
          open={openDifferenceModal}
          close={() => setOpenDifferenceModal(false)}
          title="نماینده عزیز شما در حال ثبت پیش فاکتور بصورت مابه التفاوت نقدی هستید . "
        >
          <div className="flex flex-col px-5 py-2 gap-6">
            <div className="flex gap-2 items-center">
              <span>مبلغ سقف اعتبار کاربر : </span>{" "}
              <span>{(allTotal.userMax * 10).toLocaleString("en-US")}ریال</span>
            </div>{" "}
            <div className="flex gap-2 items-center">
              <span>مبلغ مابه التفاوت :</span>{" "}
              <span>
                {((allTotal.totalPrice - allTotal.userMax) * 10).toLocaleString(
                  "en-US"
                )}{" "}
                ریال
              </span>
            </div>
            <div className="flex gap-2 items-center justify-end">
              <Button
                onClick={() => {
                  handleSubmit();
                }}
                variant="contained"
                color="primary"
              >
                {" "}
                متوجه شدم
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CreatePreFactor;
const STEPS = [
  { id: 0, title: "انتخاب کاربر" },
  { id: 1, title: "انتخاب تسهیلات" },

  { id: 3, title: "پیش نمایش فاکتور" },
];
