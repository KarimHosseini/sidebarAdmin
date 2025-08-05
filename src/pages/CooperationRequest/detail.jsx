import { Button, Paper, Skeleton, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { PageTitle, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  CONFIRM_COOPERATION,
  EBORT_COOPERATION,
  EXPORT_BY_ID_SUM_COOPERATION,
  FINAL_COOPERATION,
  GET_BY_ID_SUM_COOPERATION,
  GET_FILES_SUM_COOPERATION,
  INCOMPELTE_COOPERATION,
  SINGLE_USER,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
import Files from "./files";
import UserData from "./userData";

const CooperationDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [userdata, setUserData] = useState({});
  const [reuqestDetail, setRequesDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [descirption, setDescription] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const [value, setValue] = useState(0);
  const [loadingEx, setLoadingEx] = useState(false);
  const dispatch = useDispatch();
  const { token, userId } = useSelector((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const { userPermissions } = useSelector((state) => state.relationals);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setLoading3(true);
      axiosInstance
        .get(
          `${baseUrl}/${GET_FILES_SUM_COOPERATION}?id=${id}`,
          configReq(token)
        )
        .then((res) => {
          setData(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
      axiosInstance
        .get(
          `${baseUrl}/${GET_BY_ID_SUM_COOPERATION}?id=${id}`,
          configReq(token)
        )
        .then((res) => {
          setRequesDetail(res.data.data);
          setDescription(res.data.data.Description);
          setLoading3(false);
        })
        .catch((err) => {
          setLoading3(false);
          toast.error(err.response?.data?.message);
          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
    }
  }, [id]);
  useEffect(() => {
    if (searchParams.get("UI")) {
      setLoading2(true);
      axiosInstance
        .get(
          `${baseUrl}/${SINGLE_USER}?id=${searchParams.get("UI")}`,
          configReq(token)
        )
        .then((res) => {
          setUserData(res.data.data);
          setLoading2(false);
        })
        .catch((err) => {
          setLoading2(false);
          toast.error(err.response?.data?.message);
          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
    }
  }, [searchParams.get("UI")]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleAbort = () => {
    setLoadingButton(true);
    axiosInstance
      .post(
        `${baseUrl}/${EBORT_COOPERATION}`,
        { ConfirmedByUserId: userId, Description: descirption, Id: id },
        configReq(token)
      )
      .then((res) => {
        setLoadingButton(false);
        setRequesDetail(res.data.data);

        toast.success("با موفقیت رد شد");
      })
      .catch((err) => {
        setLoadingButton(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const handleIncompeleted = () => {
    setLoadingButton(true);
    axiosInstance
      .post(
        `${baseUrl}/${INCOMPELTE_COOPERATION}`,
        { ConfirmedByUserId: userId, Description: descirption, Id: id },
        configReq(token)
      )
      .then((res) => {
        setLoadingButton(false);
        setRequesDetail(res.data.data);

        toast.success("با موفقیت ثبت شد");
      })
      .catch((err) => {
        setLoadingButton(false);

        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const handleApproved = () => {
    setLoadingButton(true);
    axiosInstance
      .post(
        `${baseUrl}/${CONFIRM_COOPERATION}`,
        { ConfirmedByUserId: userId, Description: descirption, Id: id },
        configReq(token)
      )
      .then((res) => {
        setLoadingButton(false);
        setRequesDetail(res.data.data);

        toast.success("با موفقیت تایید شد");
      })
      .catch((err) => {
        setLoadingButton(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const handleFinal = () => {
    setLoadingButton(true);
    axiosInstance
      .post(
        `${baseUrl}/${FINAL_COOPERATION}`,
        { ConfirmedByUserId: userId, Description: descirption, Id: id },
        configReq(token)
      )
      .then((res) => {
        setLoadingButton(false);
        setRequesDetail(res.data.data);

        toast.success("با موفقیت تایید شد");
      })
      .catch((err) => {
        setLoadingButton(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const allExels = async (datas) => {
    try {
      var name = "";
      const title = `در خواست نمایندگی ${userdata.mobile}`;
      var temp = [...datas?.body];
      temp.unshift(datas.header);
      var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.aoa_to_sheet(temp);

      XLSX.utils.book_append_sheet(wb, ws, title);
      XLSX.writeFile(wb, `${title}.xlsx`);
    } catch (err) {}
  };
  const handleExport = () => {
    var params = "";
    var temp = "";
    setLoadingEx(true);
    axiosInstance(
      `${baseUrl}/${EXPORT_BY_ID_SUM_COOPERATION}?id=${id}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoadingEx(false);

        allExels(data?.data);
      })
      .catch((err) => {
        setLoadingEx(false);
      });
  };
  return (
    <div>
      {" "}
      <PageTitle
        broadCrumb={[
          {
            title: " گزارشات",
            path: "/reports",
          },
          {
            title: " گزارش در خواست نمایندگی ",
            path: "/CooperationRequest",
          },
        ]}
        title="جزییات در خواست نمایندگی "
      />
      <div className="md:mx-3 mx-1">
        {" "}
        <Paper sx={{ border: "1px solid #dbdfea", mt: 2 }} elevation={0}>
          {" "}
          <Box
            sx={{ borderBottom: 1, borderColor: "divider" }}
            className="relative z-10"
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
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
              <Tab label=" اطلاعات در خواست" {...a11yProps(0)} />

              <Tab label=" اطلاعات کاربر" {...a11yProps(1)} />
              <Tab label=" مدارک بارگذاری شده " {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            {loading3 ? (
              <Skeleton height={500} width={"100%"} variant="rounded" />
            ) : (
              <div>
                <div className="md:grid grid-cols-3 flex flex-col gap-4 mb-4">
                  <TextInput
                    disabled
                    currentValue={new Date(
                      reuqestDetail.RequestDate
                    ).toLocaleDateString("fa")}
                    label="تاریخ ثبت درخواست"
                  />
                  <TextInput
                    disabled
                    currentValue={
                      reuqestDetail.RequestType === 1 ? "حقیقی" : "حقوقی"
                    }
                    label="وضعیت"
                  />
                  <TextInput
                    disabled
                    currentValue={
                      stepEnum.find(
                        (item) => item.value === String(reuqestDetail.Step)
                      )?.title
                    }
                    label="مرحله"
                  />
                  <TextInput
                    disabled
                    currentValue={reuqestDetail.ConfirmedByFullName}
                    label="نام تایید کننده"
                  />
                  <TextInput
                    disabled
                    currentValue={
                      reuqestDetail.ConfirmedDate
                        ? new Date(
                            reuqestDetail.ConfirmedDate
                          ).toLocaleDateString("fa")
                        : ""
                    }
                    label="تاریخ تایید درخواست"
                  />
                </div>
                <TextInput
                  change={(e) => setDescription(e)}
                  currentValue={descirption}
                  label="توضیحات"
                />
                <div className="flex justify-center gap-4 mt-4 items-center flex-wrap">
                  {userPermissions?.CooperationRequest?.exportRequest && (
                    <Button
                      disabled={loadingEx}
                      onClick={handleExport}
                      color="warning"
                      variant="outlined"
                    >
                      خروجی اکسل
                    </Button>
                  )}

                  <Button
                    disabled={loadingButton}
                    onClick={handleAbort}
                    color="error"
                    variant="contained"
                  >
                    رد درخواست
                  </Button>
                  <Button
                    disabled={loadingButton}
                    onClick={handleIncompeleted}
                    color="warning"
                    variant="contained"
                  >
                    نقض مدارک
                  </Button>

                  <Button
                    disabled={loadingButton}
                    onClick={handleApproved}
                    variant="contained"
                  >
                    تایید درخواست
                  </Button>
                  <Button
                    disabled={loadingButton}
                    onClick={handleFinal}
                    color="success"
                    variant="contained"
                  >
                    عقد قرارداد
                  </Button>
                </div>
              </div>
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {loading2 ? (
              <Skeleton height={500} width={"100%"} variant="rounded" />
            ) : (
              <>
                <UserData userData={userdata} reuqestDetail={reuqestDetail} />
              </>
            )}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {loading ? (
              <Skeleton height={500} width={"100%"} variant="rounded" />
            ) : (
              <>
                <Files data={data} userData={userdata} />
              </>
            )}
          </TabPanel>
        </Paper>
      </div>
    </div>
  );
};

export default CooperationDetail;

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
        <Box sx={{ p: 3 }}>
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
const stepEnum = [
  {
    value: "1",
    title: "1-ثبت درخواست",
    style: null,
    styleDark: null,
  },
  {
    value: "2",
    title: "2-ارسال مدارک",
    style: null,
    styleDark: null,
  },
  {
    value: "3",
    title: "3-در دست بررسي",
    style: null,
    styleDark: null,
  },
  {
    value: "4",
    title: "4-تاييد اوليه",
    style: null,
    styleDark: null,
  },
  {
    value: "5",
    title: "5-عقد قرارداد",
    style: null,
    styleDark: null,
  },
  {
    value: "6",
    title: "6-باطل شده",
    style: null,
    styleDark: null,
  },
  {
    value: "7",
    title: "7-نقص اطلاعات",
    style: null,
    styleDark: null,
  },
];
