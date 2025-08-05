import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import momentJalaali from "moment-jalaali";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PageTitle } from "../../../components/common";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import {
  ALL_USERS,
  baseUrl,
  CREATE_PLAN,
  GET_BLOG_URL,
  GET_COMPANY,
  GET_SHOWCASES_URLS,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import Step1 from "./step1";
import Users from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";

const CreatePlan = () => {
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState({});
  const [loading, setLoading] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [duration2, setDuration2] = useState("");

  const [sortUser, setSortUser] = useState({});
  const [filterUser, setFilterUser] = useState([]);
  const [data, setData] = useState({
    codeType: "0",
    planType: "0",
    productChoosen: true,
    productFilter: undefined,
    discountType: 1,
    commissionType: 0,
  });
  const [addProductSteps, setProductStep] = useState([
    "تعریف اولیه ",
    " انتخاب کاربران  ",
    "  انتخاب زمانبندی ",
    "    انتخاب شرایط",
    /*  " انتخاب محصول و ثبت کد", */
    /*  "گزارش گیری و تایید ", */
  ]);
  const [startTime, setstartTime] = useState(momentJalaali());
  const [endTime, setendTime] = useState();
  const [startTimeD, setStartTimeD] = useState();
  const [endTimeD, setendTimeD] = useState();
  const [usersSelected, setUsersSelected] = useState([]);
  const [urls, setUrls] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [markter, setMarkter] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [conditions, setConditions] = useState({});
  const { token } = useSelector((state) => state.user);
  const [durations, setDuration] = useState("");
  const [timeStart, setTimeStart] = useState();
  const [timeEnd, setTimeEnd] = useState();
  const navigate = useNavigate();
  const handleChange = (newValue) => {
    setTimeStart(newValue);
  };
  const handleChangeEnd = (newValue) => {
    setTimeEnd(newValue);
  };
  useEffect(() => {
    var startDate = new Date();
    var endDate = new Date();
    var date = { startTime: new Date(), endDate: new Date() };
    if (startTime) {
      date = {
        ...date,
        fromDate: toIsoString(
          startTime?._d,
          timeStart ? timeStart.$H.toString().padStart(2, 0) : "00",
          timeStart ? timeStart.$m.toString().padStart(2, 0) : "00"
        ),
      };

      startDate = toIsoString(
        startTime?._d,
        timeStart ? timeStart.$H.toString().padStart(2, 0) : "00",
        timeStart ? timeStart.$m.toString().padStart(2, 0) : "00"
      );
    }
    if (endTime) {
      date = {
        ...date,
        toDate: toIsoString(
          endTime?._d,
          timeEnd ? timeEnd.$H.toString().padStart(2, 0) : "00",
          timeEnd ? timeEnd.$m.toString().padStart(2, 0) : "00"
        ),
      };

      endDate = toIsoString(
        endTime?._d,
        timeEnd ? timeEnd.$H.toString().padStart(2, 0) : "00",
        timeEnd ? timeEnd.$m.toString().padStart(2, 0) : "00"
      );
    }
    setData({ ...data, ...date });

    const diffInMs = Math.abs(new Date(endDate) - new Date(startDate));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

    const remainingTime = `${days} روز, ${hours} ساعت, ${minutes} دقیقه`;
    if (remainingTime) setDuration(remainingTime);
    const diffInMs2 = Math.abs(new Date(data?.toDate) - new Date());
    const days2 = Math.floor(diffInMs2 / (1000 * 60 * 60 * 24));
    const hours2 = Math.floor(
      (diffInMs2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes2 = Math.floor((diffInMs2 % (1000 * 60 * 60)) / (1000 * 60));
    var remainingTime2 = "";
    if (new Date(data?.toDate) < new Date()) {
      remainingTime2 = `${0} روز, ${0} ساعت, ${0} دقیقه`;
    } else {
      remainingTime2 = `${days2} روز, ${hours2} ساعت, ${minutes2} دقیقه`;
    }

    setDuration2(remainingTime2);
  }, [timeStart, timeEnd, endTime, startTime]);

  useEffect(() => {
    getUrls();
    getMarkter();
    getFactory();
  }, []);

  const getUrls = () => {
    var temp = [];
    axiosInstance(
      `${baseUrl}/${GET_SHOWCASES_URLS}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading(false);
        data?.data.map((item) => {
          temp.push(item);
        });
      })
      .catch((err) => {
        setLoading(false);
      });
    axiosInstance(
      `${baseUrl}/${GET_BLOG_URL}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading(false);

        data?.data.map((item) => {
          if (item.url?.slice(0, 1) === "/") {
            temp.push(`/blog${item.url}`);
          } else {
            temp.push(`/blog/${item.url}`);
          }
        });
        /*   setCategories(data);
          setCategories2(data?.data); */
      })
      .catch((err) => {
        setLoading(false);
      });
    setUrls(temp);
  };
  const getMarkter = () => {
    axiosInstance(
      `${baseUrl}/${ALL_USERS}?Page=${1}&Limit=${2000}&filter[0][key]=role&filter[0][value]=6&filter[0][operator]=eq`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading(false);

        setMarkter(data?.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const getFactory = () => {
    axiosInstance(
      `${baseUrl}/${GET_COMPANY}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading(false);

        setCompanies(data?.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const sumbitData = () => {
    const fd = new FormData();
    var Cid = filterUser?.find((item) => item?.name === "companyId");
    fd.append("planType", data?.planType);
    fd.append("title", data?.planType === "0" ? data?.titleP : data?.title);
    fd.append("code", data?.planType === "0" ? data?.codeP : data?.code);
    fd.append(
      "description",
      data?.planType === "0" ? data?.descriptionP : data?.description
    );
    if (data?.link) fd.append("link", data?.link);
    if (data?.selectedProductImageP || data?.selectedProductImage) {
      fd.append(
        "fromGallery",
        data?.planType === "0"
          ? data?.selectedProductImageP
          : data?.selectedProductImage
      );
    }
    if (data?.avatarP || data?.avatar) {
      fd.append("files", data?.planType === "0" ? data?.avatarP : data?.avatar);
    }

    fd.append(
      "active",
      data?.planType === "0"
        ? data?.activeP
          ? data?.activeP
          : false
        : data?.active
        ? data?.active
        : false
    );
    if (data?.discountType) fd.append("discountType", data?.discountType);
    if (data?.discountAmount) fd.append("discountAmount", data?.discountAmount);
    fd.append("codeType", data?.codeType);
    if (data?.codeLimit) fd.append("codeLimit", data?.codeLimit);
    if (data?.commissionType) fd.append("commissionType", data?.commissionType);
    if (data?.commissionAmount)
      fd.append("commissionAmount", data?.commissionAmount);
    if (data?.marketer) fd.append("marketer", data?.marketer);
    if (data?.fromDate) fd.append("fromDate", data?.fromDate);
    if (data?.toDate) fd.append("toDate", data?.toDate);
    if (Cid?.value) fd.append("companyId", Cid?.value);
    if (data?.allUsers) fd.append("allUsers", data?.allUsers);
    if (data?.num && data?.codeType === "1") fd.append("num", data?.num);
    if (!data?.allUsers) {
      var id = "";
      usersSelected.map((items) => {
        id += `,${items?.id}`;
      });
      fd.append("userIds", id.slice(1));
    }
    if (data?.allProducts || data?.planType === "0") {
      fd.append("allProducts", data?.allProducts || data?.planType === "0");
    }
    if (data?.fitler) {
      var temp = "";
      filter?.map((item, index) => {
        temp += `&filter[${index}][key]=${item?.name}&filter[${index}][value]=${item?.value}&filter[${index}][operator]=${item?.type}`;
      });
      if (sort) {
        var counter = 0;
        for (var prop in sort) {
          temp += `&sort[${counter}][key]=${prop}&sort[${counter}][direction]=${
            data?.sort[prop] ? "asc" : "desc"
          }`;
          counter++;
        }
      }
      fd.append("productFilter", temp?.slice(1) || "");
    }
    if (data?.productChoosen) {
      var ids = "";
      selectedProduct.map((items) => {
        ids += `,${items?.id}`;
      });
      fd.append("productIds", ids.slice(1));
    }
    fd.append("conditions", JSON.stringify(conditions));
    axiosInstance
      .post(`${baseUrl}/${CREATE_PLAN}`, fd, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        toast.success("با موفقیت ساخته شد");
        navigate("/plan");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);

        setLoading(false);
      });
  };
  const stepHandler = () => {
    if (currentStep === 5) {
      sumbitData();
    } else {
      if (currentStep === 1) {
        if (data?.planType === "0") {
          if (!data?.titleP) {
            toast.error("عنوان طرح را وارد کنید");
          } else if (!data?.codeP) {
            toast.error("کد تجاری طرح را وارد کنید");
          } else {
            setCurrentStep((r) => r + 1);
          }
        } else {
          if (!data?.title) {
            toast.error("عنوان تخفیف را وارد کنید");
          } else if (!data?.code) {
            toast.error("کد تخفیف را وارد کنید");
          } else if (!data?.description) {
            toast.error("شرح تخفیف را وارد کنید");
          } else {
            setCurrentStep((r) => r + 1);
          }
        }
      } else if (currentStep === 3) {
        if (!data?.fromDate) {
          toast.error(" تاریخ شروع تاریخ اعمال تخفیف را وارد کنید          ");
        } else if (!data?.toDate) {
          toast.error("تاریخ پایان تاریخ اعمال تخفیف را وارد کنید");
        } else {
          setCurrentStep((r) => r + 1);
        }
      } else if (currentStep === 4) {
        if (data?.planType === "0") {
          if (!conditions.Wage) {
            toast.error("کارمزد طرح را وارد کنید");
          } /* else if (!conditions.MinimumAmount) {
            toast.error("حداقل مبلغ تسهیلات  را وارد کنید");
          }  */ else if (!conditions.PlanAmount) {
            toast.error("حداکثر مبلغ تسهیلات  را وارد کنید");
          } else {
            if (data?.planType === "0") {
              sumbitData();
            } else {
              setCurrentStep((r) => r + 1);
            }
          }
        } else {
          if (data?.planType === "0") {
            sumbitData();
          } else {
            setCurrentStep((r) => r + 1);
          }
        }
      } else {
        setCurrentStep((r) => r + 1);
      }
    }
  };
  useEffect(() => {
    var temp = [
      "تعریف اولیه ",
      " انتخاب کاربران  ",
      "  انتخاب زمانبندی ",
      "    انتخاب شرایط",
    ];
    if (data?.planType === "1") temp.push(" انتخاب محصول و ثبت کد");
    setProductStep(temp);
  }, [data?.planType]);
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "    باشگاه مشتریان",
            path: "/discounts",
          },
          {
            title: "     طرح فروش و تخفیفات",
            path: "/plan",
          },
        ]}
        title=" ساخت طرح فروش / تخفیفات جدید"
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
            className=" rounded-lg border border-[#dbdfea] py-3 flex flex-wrap md:flex-nowrap items-center px-4 w-full mb-4 gap-4 justify-end"
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
              /*   onClick={() => {
              if (currentStep === 1) {
                setCurrentStep(2);
              } else if (currentStep === 2) {
                setCurrentStep(3);
              } else if (currentStep === 3) {
                handleSumbit();
              }
            }} */
              onClick={stepHandler}
              variant="contained"
            >
              {currentStep === 5 ? (
                <>{loading ? <CircularProgress /> : <>ثبت اطلاعات</>}</>
              ) : currentStep === 4 ? (
                <>
                  {data?.planType === "0" ? (
                    <>{loading ? <CircularProgress /> : <>ثبت اطلاعات</>}</>
                  ) : (
                    <> مرحله بعد</>
                  )}
                </>
              ) : (
                <> مرحله بعد</>
              )}
            </Button>
          </Paper>
          {currentStep === 1 ? (
            <Step1
              urls={urls}
              setData={setData}
              data={data}
              allUser={markter}
              companies={companies}
            />
          ) : currentStep === 2 ? (
            <Paper elevation={0} className="p-4 border border-[#dbdfea] w-full">
              <Users
                selected={usersSelected}
                setSelected={setUsersSelected}
                data={data}
                setData={setData}
                filter={filterUser}
                setFilter={setFilterUser}
                sort={sortUser}
                setSort={setSortUser}
                /*               setSelectedAll={setSelectedAll}
              selectedAll={selectedAll} */
              />{" "}
            </Paper>
          ) : currentStep === 3 ? (
            <>
              <Step3
                setData={setData}
                data={data}
                durations={durations}
                startTime={startTime}
                setstartTime={setstartTime}
                handleChange={handleChange}
                endTime={endTime}
                setendTime={setendTime}
                handleChangeEnd={handleChangeEnd}
                /*     duration2={duration2} */
              />{" "}
            </>
          ) : currentStep === 4 ? (
            <Step4
              setConditions={setConditions}
              conditions={conditions}
              type={data?.planType}
              setstartTime={setStartTimeD}
              setendTime={setendTimeD}
              startTime={endTimeD}
              endTime={startTimeD}
            />
          ) : currentStep === 5 ? (
            <Paper elevation={0} className="p-4 border border-[#dbdfea] w-full">
              <Step5
                selected={selectedProduct}
                setSelected={setSelectedProduct}
                data={data}
                setData={setData}
                filter={filter}
                setFilter={setFilter}
                sort={sort}
                setSort={setSort}
              />
            </Paper>
          ) : currentStep === 6 ? (
            <></>
          ) : (
            <></>
          )}
        </Box>
      </div>
    </>
  );
};

export default CreatePlan;
function toIsoString(date, h, m) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      return (num < 10 ? "0" : "") + num;
    };
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    h +
    ":" +
    m +
    ":" +
    "00"
  );
}
