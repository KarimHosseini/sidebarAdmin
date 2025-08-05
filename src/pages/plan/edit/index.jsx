import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Tab,
  Tabs,
} from "@mui/material";
import dayjs from "dayjs";
import momentJalaali from "moment-jalaali";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PageTitle } from "../../../components/common";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import { Confirm } from "../../../components/modals";
import {
  ALL_USERS,
  baseUrl,
  DELETE_PLAN,
  EDIT_PLAN,
  GET_BLOG_URL,
  GET_COMPANY,
  GET_PLAN_SINGEL,
  GET_SHOWCASES_URLS,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import Step1 from "../create/step1";
import Users from "../create/step2";
import Step3 from "../create/step3";
import Step4 from "../create/step4";
import Step5 from "../create/step5";
const EditPlan = () => {
  const { id } = useParams();
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState({});
  const [loading, setLoading] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [sortUser, setSortUser] = useState({});
  const [filterUser, setFilterUser] = useState([]);
  const [changedDate, setChangedDate] = useState(false);
  const [planStarted, setPlanStarted] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [data, setData] = useState({ codeType: "0", planType: "0" });
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
  const { userPermissions } = useSelector((state) => state.relationals);

  const [usersSelected, setUsersSelected] = useState([]);
  const [urls, setUrls] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [markter, setMarkter] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [conditions, setConditions] = useState({});
  const { token } = useSelector((state) => state.user);
  const [durations, setDuration] = useState("");
  const [duration2, setDuration2] = useState("");

  const [timeStart, setTimeStart] = useState();
  const [timeEnd, setTimeEnd] = useState();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  const handleChange = (newValue) => {
    setTimeStart(newValue);
  };
  const handleChangeEnd = (newValue) => {
    setTimeEnd(newValue);
  };
  useEffect(() => {
    if (changedDate) {
      var startDate = data?.fromDate
        ? dayjs(new Date(data?.fromDate))
        : new Date();
      var endDate = data?.toDate ? dayjs(new Date(data?.toDate)) : new Date();
      var date = { startTime: new Date(), endDate: new Date() };
      if (startTime) {
        date = {
          ...date,
          fromDate: toIsoString(
            startTime?._d,
            timeStart
              ? timeStart.$H.toString().padStart(2, 0)
              : dayjs(new Date(data?.fromDate)).$H.toString().padStart(2, 0),
            timeStart
              ? timeStart.$m.toString().padStart(2, 0)
              : dayjs(new Date(data?.fromDate)).$m.toString().padStart(2, 0)
          ),
        };

        startDate = toIsoString(
          startTime?._d,
          timeStart
            ? timeStart.$H.toString().padStart(2, 0)
            : dayjs(new Date(data?.fromDate)).$H.toString().padStart(2, 0),
          timeStart
            ? timeStart.$m.toString().padStart(2, 0)
            : dayjs(new Date(data?.fromDate)).$m.toString().padStart(2, 0)
        );
      }
      if (endTime) {
        date = {
          ...date,
          toDate: toIsoString(
            endTime?._d,
            timeEnd
              ? timeEnd.$H.toString().padStart(2, 0)
              : dayjs(new Date(data?.toDate)).$H.toString().padStart(2, 0),
            timeEnd
              ? timeEnd.$m.toString().padStart(2, 0)
              : dayjs(new Date(data?.toDate)).$m.toString().padStart(2, 0)
          ),
        };

        endDate = toIsoString(
          endTime?._d,
          timeEnd
            ? timeEnd.$H.toString().padStart(2, 0)
            : dayjs(new Date(data?.toDate)).$H.toString().padStart(2, 0),
          timeEnd
            ? timeEnd.$m.toString().padStart(2, 0)
            : dayjs(new Date(data?.toDate)).$m.toString().padStart(2, 0)
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
    } else {
      const diffInMs = Math.abs(
        new Date(data?.fromDate) - new Date(data?.toDate)
      );
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
    }
  }, [timeStart, timeEnd, endTime, startTime]);

  useEffect(() => {
    getPlanData();
    getUrls();
    getMarkter();
    getFactory();
  }, []);
  const getPlanData = () => {
    setLoadingData(true);
    axiosInstance(`${baseUrl}/${GET_PLAN_SINGEL}?id=${id}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoadingData(false);
        setConditions(data?.data?.conditions);
        if (data?.data?.users) setUsersSelected(data?.data?.users);
        if (data?.data?.products) setSelectedProduct(data?.data?.products);
        var temp = {
          ...data?.data,
          planType: String(data?.data?.planType),
          codeType: String(data?.data?.codeType),

          fitler: data?.data?.productFilter ? true : undefined,
          productChoosen: data?.data?.products ? true : undefined,
        };
        if (data?.data?.planType === 0) {
          temp = {
            ...temp,
            titleP: data?.data?.title,
            title: null,
            codeP: data?.data?.code,
            code: null,
            descriptionP: data?.data?.description,
            description: null,
            selectedProductImageP: data?.data?.galleryId,

            galleryId: null,
            activeP: data?.data?.active,
            active: null,
          };
        } else {
        }
        if (data?.data?.companyId) {
          var tt = [];
          tt.push({
            name: "companyId",
            value: String(data?.data?.companyId),
            type: "eq",
          });
          setFilterUser(tt);
        }
        setData({ ...temp });
        if (data?.data?.fromDate) {
          if (new Date(data?.data?.fromDate) < new Date()) {
            setPlanStarted(true);
          }

          let string = new Date(data?.data?.fromDate).toLocaleDateString(
            "en-US-u-ca-persian"
          );
          string =
            string.split("/")[2] +
            "/" +
            string.split("/")[0] +
            "/" +
            string.split("/")[1];
          setstartTime(momentJalaali(string, "jYYYY/jM/jD"));
        }
        if (data?.data?.toDate) {
          let string = new Date(data?.data?.toDate).toLocaleDateString(
            "en-US-u-ca-persian"
          );
          string =
            string.split("/")[2] +
            "/" +
            string.split("/")[0] +
            "/" +
            string.split("/")[1];
          setendTime(momentJalaali(string, "jYYYY/jM/jD"));
        }

        if (data?.data?.productFilter) {
          const array = [];
          const sortArray = [];

          const regex =
            /&filter\[(\d+)\]\[key]=(\w+)&filter\[\1\]\[value]=(\w+)&filter\[\1\]\[operator]=(\w+)/g;
          const sortRegex =
            /&sort\[(\d+)\]\[key]=(\w+)&sort\[\1\]\[direction]=(\w+)/g;

          let match;
          var string = "&" + data?.data?.productFilter;
          while ((match = regex.exec(string)) !== null) {
            const index = parseInt(match[1]);
            const name = match[2];
            const value = match[3];
            const type = match[4];

            array[index] = {
              name,
              value,
              type,
            };
          }
          while ((match = sortRegex.exec(string)) !== null) {
            const index = parseInt(match[1]);
            const name = match[2];
            const direction = match[3] === "asc";
            sortArray[index] = {
              name,
              value: direction,
            };
          }
          if (sortArray && sortArray.length > 0) {
            var sorts = {};
            sortArray?.map((item) => {
              sorts = { ...sorts, [item?.name]: item?.value };
            });
            setSort(sorts);
          }
          setFilter(array);
        }
      })
      .catch((err) => {
        setLoadingData(false);
      });
  };
  const getUrls = () => {
    var temp = [];
    axiosInstance(
      `${baseUrl}/${GET_SHOWCASES_URLS}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        data?.data.map((item) => {
          temp.push(item);
        });
      })
      .catch((err) => {});
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
    var Cid = filterUser?.find((item) => item?.name === "companyId");
    const fd = new FormData();
    fd.append("planType", data?.planType);
    fd.append("id", data?.id);
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
    if (data?.allProducts) {
      fd.append("allProducts", data?.allProducts);
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
      .put(`${baseUrl}/${EDIT_PLAN}`, fd, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        toast.success("با موفقیت ویرایش شد");
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const deleteProduct = () => {
    axiosInstance
      .delete(`${baseUrl}/${DELETE_PLAN}?id=${id}`, configReq(token))
      .then((res) => {
        setConfirmDelete(false);
        navigate("/plan");
        toast.success("با موفقیت حذف شد");
      })
      .catch((err) => {
        setConfirmDelete(false);
        toast.error(err.response?.data?.message);
      });
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
      {" "}
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
        title={"  طرح یا تخفیف " + (data?.title || data?.titleP)}
      />
      <div className="md:mx-3 mx-1">
        <Paper elevation={0} sx={{ border: "1px solid #dbdfea" }}>
          <Tabs
            variant="scrollable"
            value={value}
            onChange={handleChangeTab}
            sx={{
              flexGrow: 1,
              height: "3.07rem",
              minHeight: "40px !important",
              ".MuiTab-root": {
                minHeight: "40px !important",
              },
              background: (theme) =>
                theme.palette.mode === "light"
                  ? "rgba(0,0,0,0.04) !important"
                  : "rgba(0,0,0,0.7)  !important",
            }}
          >
            {addProductSteps.map((item, index) => (
              <Tab key={item} label={item} {...a11yProps(index)} />
            ))}
          </Tabs>
          <Divider sx={{ mb: 2 }} />
          {loadingData ? (
            <div className="grid md:grid-cols-4 gap-5">
              {" "}
              {Array.from(Array(12).keys()).map((item, i) => (
                <Skeleton
                  key={i}
                  height={30}
                  sx={{ width: "100%" /* , minWidth:{md:"160px"} */ }}
                />
              ))}
            </div>
          ) : (
            <>
              {addProductSteps.map((item, index) => (
                <TabPanel value={value} index={index} key={item.title}>
                  {value === 0 ? (
                    <>
                      <Box
                        sx={{
                          justifyContent: planStarted ? "end" : "space-between",
                        }}
                        className="w-full mb-2 mt-1 justify-between flex items-center"
                      >
                        {!planStarted && userPermissions?.plan?.delete && (
                          <IconButton onClick={() => setConfirmDelete(true)}>
                            <Delete color="error" />
                          </IconButton>
                        )}
                        <div>
                          <Button
                            disabled={loading}
                            onClick={sumbitData}
                            variant="contained"
                          >
                            {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
                          </Button>
                        </div>
                      </Box>
                      <Step1
                        urls={urls}
                        setData={setData}
                        data={data}
                        allUser={markter}
                        companies={companies}
                        editMode={true}
                        planStarted={planStarted}
                      />{" "}
                    </>
                  ) : value === 1 ? (
                    <Paper
                      elevation={0}
                      className="p-4 border border-[#dbdfea] w-full"
                    >
                      <div className="w-full mt- justify-end mb-2 flex items-center">
                        <div>
                          {" "}
                          <Button
                            disabled={loading}
                            onClick={sumbitData}
                            variant="contained"
                          >
                            {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
                          </Button>{" "}
                        </div>
                      </div>
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
                  ) : value === 2 ? (
                    <>
                      <div className="w-full mt- justify-end mb-2 flex items-center">
                        <div>
                          <Button
                            disabled={loading}
                            onClick={sumbitData}
                            variant="contained"
                          >
                            {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
                          </Button>{" "}
                        </div>
                      </div>
                      <Step3
                        setData={setData}
                        data={data}
                        durations={durations}
                        startTime={startTime}
                        duration2={duration2}
                        setstartTime={(e) => {
                          setChangedDate(true);
                          setstartTime(e);
                        }}
                        handleChange={(e) => {
                          handleChange(e);
                          setChangedDate(true);
                        }}
                        endTime={endTime}
                        setendTime={(e) => {
                          setendTime(e);
                          setChangedDate(true);
                        }}
                        handleChangeEnd={(e) => {
                          setChangedDate(true);
                          handleChangeEnd(e);
                        }}
                      />{" "}
                    </>
                  ) : value === 3 ? (
                    <>
                      {!planStarted && (
                        <div className="w-full mt- justify-end mb-2 -mt-5 flex items-center">
                          <div>
                            <Button
                              disabled={loading}
                              onClick={sumbitData}
                              variant="contained"
                            >
                              {loading ? (
                                <CircularProgress />
                              ) : (
                                <>ثبت اطلاعات</>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      <Step4
                        setConditions={setConditions}
                        conditions={conditions}
                        type={data?.planType}
                        planStarted={planStarted}
                      />
                    </>
                  ) : value === 4 ? (
                    <Paper
                      elevation={0}
                      className="p-4 border border-[#dbdfea] w-full"
                    >
                      <div className="w-full mt- justify-end mb-2 -mt-1 flex items-center">
                        <div>
                          <Button
                            disabled={loading}
                            onClick={sumbitData}
                            variant="contained"
                          >
                            {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
                          </Button>
                        </div>
                      </div>

                      <Step5
                        selected={selectedProduct}
                        setSelected={setSelectedProduct}
                        data={data}
                        setData={setData}
                        filter={filter}
                        setFilter={setFilter}
                        sort={sort}
                        setSort={setSort}
                        planStarted={planStarted}
                      />
                    </Paper>
                  ) : currentStep === 6 ? (
                    <></>
                  ) : (
                    <></>
                  )}
                </TabPanel>
              ))}
            </>
          )}
        </Paper>
        <Confirm
          message="آیا از حذف این طرح فروش و تخفیفات
          اطمینان دارید؟"
          close={() => setConfirmDelete(false)}
          submit={deleteProduct}
          open={confirmDelete}
        />
      </div>
    </>
  );
};

export default EditPlan;
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
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { md: "20px" } }}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
