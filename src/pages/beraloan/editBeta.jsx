import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Skeleton,
  Tab,
  Tabs,
} from "@mui/material";
import momentJalaali from "moment-jalaali";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, PageTitle, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  ABORT_REFAHLOAN,
  baseUrl,
  CONFIRM_REFAHLOAN,
  DELETE_REFAHLOAN,
  DeleteOnlyRefah,
  EDIT_REFAHLOAN,
  EDIT_REQUEST_REFAHLOAN,
  EDIT_SIMPLE_REFAHLOAN,
  GET_SINGLE_REFAHLOAN,
  REFAHLOAN,
} from "../../helpers/api-routes";

import Uploader from "../../components/common/uploader";
import { Confirm } from "../../components/modals";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
import AgencyInfo from "./agencyInfo";
import Ballon from "./ballon";
import LoanModal from "./modal";
const EditBeta = () => {
  const { id } = useParams();
  const [reuqestDetail, setRequesDetail] = useState({});

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState({});
  const [loadingButton, setLoadingButton] = useState(false);
  const dispatch = useDispatch();
  const { token, userId } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const startTimeCalender = useRef();
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState("");

  const [loading3, setLoading3] = useState(false);
  const [startTime, setstartTime] = useState();
  const [data, setData] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
  const [openDelete2, setOpenDelete2] = useState(false);

  const [value, setValue] = useState(0);

  const [lists, setLists] = useState([]);
  const navigate = useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    if (id) {
      getRefah();
      getInstallment(true);
    }
  }, [id]);
  const getRefah = () => {
    setLoading(true);

    axiosInstance
      .get(`${baseUrl}/${GET_SINGLE_REFAHLOAN}?id=${id}`, configReq(token))
      .then((res) => {
        setRequesDetail(res.data.data);
        let string = new Date(res.data.data.startDate).toLocaleDateString(
          "en-US-u-ca-persian"
        );
        setLists(res.data.extraObject);
        string =
          string.split("/")[2] +
          "/" +
          string.split("/")[0] +
          "/" +
          string.split("/")[1];
        setstartTime(momentJalaali(string, "jYYYY/jM/jD"));
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const getInstallment = (firstTime) => {
    setLoading3(true);
    axiosInstance
      .get(`${baseUrl}/${REFAHLOAN}?id=${id}`, configReq(token))
      .then((res) => {
        setLoading3(false);
        setData(res.data.data || {});
        if (!firstTime) {
          getRefah();
        }
      })
      .catch((err) => {
        setLoading3(false);

        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const handleApproved = () => {
    setLoadingButton(true);
    setLoading2({ approved: true });
    axiosInstance
      .get(
        `${baseUrl}/${CONFIRM_REFAHLOAN}?changerId=${userId}&id=${id}`,

        configReq(token)
      )
      .then((res) => {
        setLoadingButton(false);
        setRequesDetail(res.data.data);
        setLoading2({ approved: false });

        toast.success("با موفقیت تایید شد");
      })
      .catch((err) => {
        setLoading2({ approved: false });

        setLoadingButton(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const handleAbort = () => {
    setLoading2({ abort: true });

    setLoadingButton(true);
    axiosInstance
      .get(
        `${baseUrl}/${ABORT_REFAHLOAN}?changerId=${userId}&id=${id}`,

        configReq(token)
      )
      .then((res) => {
        setLoadingButton(false);
        setRequesDetail(res.data.data);
        setLoading2({ abort: false });

        toast.success("با موفقیت رد شد");
      })
      .catch((err) => {
        setLoading2({ abort: false });

        setLoadingButton(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const handleDelete = () => {
    setLoadingButton(true);
    setLoading2({ delete: true });

    axiosInstance
      .delete(
        `${baseUrl}/${DELETE_REFAHLOAN}?changerId=${userId}&id=${id}`,

        configReq(token)
      )
      .then((res) => {
        navigate("/betaloan");
        setLoading2({ delete: false });
        setRequesDetail(res.data.data);
        setOpenDelete(false);
        toast.success("با موفقیت حذف شد");
      })
      .catch((err) => {
        setLoading2({ delete: false });

        setLoadingButton(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const handleDeleteRefah = () => {
    setLoadingButton(true);
    setLoading2({ deleteRefah: true });

    axiosInstance
      .delete(
        `${baseUrl}/${DeleteOnlyRefah}?id=${id}`,

        configReq(token)
      )
      .then((res) => {
        setLoading2({ deleteRefah: false });
        setRequesDetail(res.data.data);
        setOpenDelete2(false);
        toast.success("با موفقیت حذف شد");
      })
      .catch((err) => {
        setLoading2({ deleteRefah: false });

        setLoadingButton(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const handleEdit1 = () => {
    setLoading2({ edit: true });

    setLoadingButton(true);
    var sD = {
      id: reuqestDetail.id,
      userId: reuqestDetail.userId,
      title: reuqestDetail.title,
      amount: reuqestDetail.amount,
      startDate: reuqestDetail.startDate,
      numberOfInstallments: reuqestDetail.numberOfInstallments,
      installmentAmount: reuqestDetail.installmentAmount,
    };
    axiosInstance
      .post(`${baseUrl}/${EDIT_REQUEST_REFAHLOAN}`, { ...sD }, configReq(token))
      .then((res) => {
        setLoadingButton(false);
        setOpen(true);
        setRequesDetail(res.data.data);

        setLoading2({ edit: false });
      })
      .catch((err) => {
        setLoading2({ edit: false });
        /*         setOpen(true);
         */ setLoadingButton(false);

        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const handleEdit = () => {
    setLoading2({ editMoal: true });

    setLoadingButton(true);
    var sD = {
      id: reuqestDetail.id,
      userId: reuqestDetail.userId,
      title: reuqestDetail.title,
      amount: reuqestDetail.amount,
      /*       description: reuqestDetail.description,
       */ startDate: reuqestDetail.startDate,
      numberOfInstallments: reuqestDetail.numberOfInstallments,
      installmentAmount: reuqestDetail.installmentAmount,
      /*       files: reuqestDetail.files,
       */ agentId: reuqestDetail.agentId,
      otp: otp,
    };
    axiosInstance
      .post(`${baseUrl}/${EDIT_REFAHLOAN}`, { ...sD }, configReq(token))
      .then((res) => {
        setLoadingButton(false);
        setRequesDetail(res.data.data);
        setOtp("");

        toast.success("با موفقیت ویرایش شد");
        setLoading2({ editMoal: false });
      })
      .catch((err) => {
        setLoading2({ editMoal: false });

        setLoadingButton(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const handleEdit2 = () => {
    setLoading2({ edit2: true });

    setLoadingButton(true);
    var sD = {
      id: reuqestDetail.id,

      description: reuqestDetail.description,
      userId: userId,
      agentId: reuqestDetail.agentId,
      files: reuqestDetail.files,
      finalRefundAmount: reuqestDetail.finalRefundAmount,
      usableAmount: reuqestDetail.usableAmount,
    };
    axiosInstance
      .post(`${baseUrl}/${EDIT_SIMPLE_REFAHLOAN}`, { ...sD }, configReq(token))
      .then((res) => {
        setLoadingButton(false);
        setRequesDetail(res.data.data);

        toast.success("با موفقیت ویرایش شد");
        setLoading2({ edit2: false });
      })
      .catch((err) => {
        setLoading2({ edit2: false });

        setLoadingButton(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  return (
    <div>
      <PageTitle
        title={"  ویرایش تسهیلات " + reuqestDetail.userFullName || ""}
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
      />{" "}
      <Box
        sx={{ borderBottom: 1, borderColor: "divider" }}
        className="relative z-10 md:mx-3 mx-1 "
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
          <Tab
            label={`  گزارش وام ${reuqestDetail.guarantorName} `}
            {...a11yProps(0)}
          />
          {userPermissions?.RefahLoans?.viewBluBank && (
            <Tab
              label={` گزارش وام ${reuqestDetail.financierName} `}
              {...a11yProps(1)}
            />
          )}{" "}
          {userPermissions?.RefahLoans?.viewAgent && (
            <Tab label=" مشخصات نماینده" {...a11yProps(2)} />
          )}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <div>
          <div className="md:mx-3 mx-1 ">
            {" "}
            <div className={` text-sm items-center flex gap-2 my-4 `}>
              {" "}
              <span>وضعیت : </span>
              <span
                className={` font-bold text-lg ${
                  reuqestDetail.state === 2 || reuqestDetail.state === 4
                    ? "text-green-500"
                    : reuqestDetail.state === 3
                    ? "text-red-500"
                    : ""
                }`}
              >
                {
                  STATUS.find(
                    (item) => Number(item?.id) === Number(reuqestDetail.state)
                  )?.title
                }
              </span>
            </div>
            <Paper
              sx={{ border: "1px solid #dbdfea", mt: 2, px: 2 }}
              elevation={0}
            >
              {loading ? (
                <Skeleton height={100} width={"100%"} variant="rounded" />
              ) : (
                <>
                  <div className="grid md:grid-cols-4 gap-4 py-4">
                    <TextInput
                      disabled
                      currentValue={reuqestDetail.userFullName}
                      label="  نام در خواست دهنده"
                    />
                    <TextInput
                      disabled
                      currentValue={reuqestDetail.nationalCode}
                      label=" کد ملی در خواست دهنده "
                    />
                    <TextInput
                      disabled
                      currentValue={reuqestDetail.mobile}
                      label=" شماره همراه در خواست دهنده "
                    />
                    <TextInput
                      disabled
                      currentValue={reuqestDetail.requestId}
                      label=" شماره پیگیری"
                    />
                    {/*    <TextInput
                      disabled
                      currentValue={
                        STATUS.find((item) => item?.id === reuqestDetail.state)
                          ?.title
                      }
                      label="وضعیت  "
                    /> */}{" "}
                  </div>
                </>
              )}
            </Paper>
          </div>
          <div className="md:mx-3 mx-1 mt-4 ">
            <Paper
              sx={{ border: "1px solid #dbdfea", mt: 2, px: 2 }}
              elevation={0}
            >
              {loading ? (
                <Skeleton height={300} width={"100%"} variant="rounded" />
              ) : (
                <>
                  <div className="grid md:grid-cols-4 gap-4 py-7">
                    {" "}
                    <TextInput
                      disabled
                      currentValue={reuqestDetail.installmentAmount}
                      label="  مبلغ هر قسط"
                      price
                      number
                    />{" "}
                    <TextInput
                      disabled
                      currentValue={new Date(
                        reuqestDetail.CreateDate || reuqestDetail.createDate
                      )?.toLocaleDateString("fa-ir")}
                      label=" تاریخ ثبت در خواست "
                    />
                    <TextInput
                      change={(e) =>
                        setRequesDetail({
                          ...reuqestDetail,
                          finalRefundAmount: e,
                        })
                      }
                      currentValue={reuqestDetail.finalRefundAmount}
                      label="مبلغ وام درخواستی  "
                      price
                      number
                      disabled
                    />
                    <TextInput
                      change={(e) =>
                        setRequesDetail({
                          ...reuqestDetail,
                          finalRefundForAgent: e,
                        })
                      }
                      currentValue={reuqestDetail.finalRefundForAgent}
                      label="مبلغ کل وام  "
                      price
                      number
                      disabled
                    />
                    <TextInput
                      change={(e) =>
                        setRequesDetail({
                          ...reuqestDetail,
                          numberOfInstallments: e,
                        })
                      }
                      currentValue={reuqestDetail.numberOfInstallments}
                      label="تعداد اقساط  "
                      disabled
                    />
                    {/*    <Box
                      sx={{
                        position: "relative",

                        ".tether-target": {
                          visibility: "hidden",
                        },
                        ".datepicker-input ": {
                          visibility: "hidden",
                        },
                      }}
                    >
                      <DatePicker
                        value={startTime}
                        isGregorian={false}
                        timePicker={false}
                        ref={startTimeCalender}
                        onChange={(value) => {
                          setstartTime(value);
                          setRequesDetail({
                            ...reuqestDetail,
                            startDate: toIsoString(new Date(value._d)),
                          });

                          setValueStatDate(value._d.toLocaleDateString("fa"));
                        }}
                      />
                      <TextField
                        onMouseUp={() =>
                          startTimeCalender.current?.setOpen(true)
                        }
                        InputProps={{
                          inputProps: {
                            style: { textAlign: "right", width: "100%" },
                          },
                        }}
                        variant="outlined"
                        value={valueStatDate ? valueStatDate : ""}
                        label={" تاریخ  شروع باز پرداخت "}
                        autoComplete="off"
                        fullWidth
                      />
                    </Box> */}
                    <TextInput
                      disabled
                      currentValue={new Date(
                        reuqestDetail.startDate
                      )?.toLocaleDateString("fa-ir")}
                      label=" تاریخ  شروع باز پرداخت "
                    />
                    <TextInput
                      change={(e) =>
                        setRequesDetail({ ...reuqestDetail, title: e })
                      }
                      currentValue={reuqestDetail.title}
                      label="عنوان  محصول"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center items-center py-6">
                    {userPermissions?.RefahLoans?.viewInstallments && (
                      <Button
                        onClick={() => getInstallment(false)}
                        variant="outlined"
                        color="warning"
                        disabled={loading3}
                      >
                        استعلام وضعیت رفاه
                      </Button>
                    )}
                    {userPermissions?.RefahLoans?.edit &&
                      reuqestDetail.state !== 3 &&
                      reuqestDetail.state !== 4 && (
                        <Button
                          disabled={loadingButton}
                          onClick={handleEdit1}
                          variant="contained"
                          color="primary"
                        >
                          {loading2.edit ? (
                            <CircularProgress />
                          ) : (
                            <> ویرایش در خواست</>
                          )}
                        </Button>
                      )}
                    {/*  {userPermissions?.RefahLoans?.confirm && (
                      <Button
                        disabled={loadingButton}
                        onClick={handleApproved}
                        variant="contained"
                        color="success"
                      >
                        {loading2.approved ? (
                          <CircularProgress />
                        ) : (
                          <>تایید اجازه نامه</>
                        )}
                      </Button>
                    )} */}
                    {/*           {userPermissions?.RefahLoans?.abort && (
                      <Button
                        disabled={loadingButton}
                        onClick={handleAbort}
                        variant="contained"
                        color="warning"
                      >
                        {loading2.abort ? (
                          <CircularProgress />
                        ) : (
                          <> انصراف کاربر</>
                        )}
                      </Button>
                    )} */}
                    {userPermissions?.RefahLoans?.delete &&
                      reuqestDetail.state !== 3 &&
                      reuqestDetail.state !== 4 && (
                        <Button
                          disabled={loadingButton}
                          onClick={() => setOpenDelete(true)}
                          variant="contained"
                          color="error"
                        >
                          {loading2.delete ? (
                            <CircularProgress />
                          ) : (
                            <> حذف وام از رفاه و بالن </>
                          )}
                        </Button>
                      )}{" "}
                    {userPermissions?.RefahLoans?.deleteOnlyRefah &&
                      reuqestDetail.state !== 3 &&
                      reuqestDetail.state !== 4 && (
                        <Button
                          disabled={loadingButton}
                          onClick={() => setOpenDelete2(true)}
                          variant="outlined"
                          color="error"
                        >
                          {loading2.deleteRefah ? (
                            <CircularProgress />
                          ) : (
                            <> حذف وام از رفاه </>
                          )}
                        </Button>
                      )}
                    {/*   {userPermissions?.RefahLoans?.viewInstallments && (
                  <Button
                    onClick={handleS}
                    variant="contained"
                    color="secondary"
                  >
                    جداول اقساط
                  </Button>
                )} */}
                  </div>
                </>
              )}
            </Paper>
          </div>
          <div className="md:mx-3 mx-1 ">
            <Paper
              sx={{ border: "1px solid #dbdfea", mt: 2, px: 2 }}
              elevation={0}
            >
              {loading ? (
                <Skeleton height={100} width={"100%"} variant="rounded" />
              ) : (
                <div className="py-4">
                  <div className="grid md:grid-cols-4 gap-4 py-4">
                    <TextInput
                      disabled
                      currentValue={reuqestDetail.agentFullName}
                      label="  نام   نماینده "
                    />
                    <TextInput
                      disabled
                      currentValue={reuqestDetail.changedByFullName}
                      label=" نام ویرایش کننده "
                    />{" "}
                    <div className="col-span-2 ">
                      <TextInput
                        change={(e) =>
                          setRequesDetail({ ...reuqestDetail, description: e })
                        }
                        currentValue={reuqestDetail.description}
                        label=" توضیحات  "
                      />
                    </div>
                  </div>
                  {userPermissions?.RefahLoans?.normalEdit && (
                    <>
                      {" "}
                      <Uploader
                        setFiles={(e) => {
                          setRequesDetail({ ...reuqestDetail, files: e });
                        }}
                        type="image"
                        check="image"
                        defualt={reuqestDetail.galleryId}
                      />
                      <div className="w-full flex mt-2 justify-center items-center">
                        <Button
                          disabled={loadingButton}
                          onClick={handleEdit2}
                          variant="contained"
                          color="primary"
                        >
                          {loading2.edit2 ? (
                            <CircularProgress />
                          ) : (
                            <> ویرایش اطلاعات</>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </Paper>
          </div>
          {userPermissions?.RefahLoans?.viewInstallments && (
            <div className="md:mx-3 mx-1 ">
              <LoanModal
                lists={lists}
                url={reuqestDetail.galleryUrl}
                datas={data}
                loading3={loading3}
                isRefah={reuqestDetail.guarantorGateway === 15}
                isBlue={reuqestDetail.financierGateway === 7}
              />
            </div>
          )}
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div>
          {loading ? (
            <Skeleton variant="rectangular" width={"100%"} height={400} />
          ) : (
            <Ballon
              reuqestDetail={reuqestDetail}
              setRequesDetail={setRequesDetail}
              handleRerender={getRefah}
            />
          )}
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div>
          {loading ? (
            <Skeleton variant="rectangular" width={"100%"} height={400} />
          ) : (
            <AgencyInfo
              reuqestDetail={reuqestDetail}
              setRequesDetail={setRequesDetail}
            />
          )}
        </div>
      </TabPanel>
      <Confirm
        message={`آیا از حذف ${
          "   تسهیلات " + reuqestDetail.userFullName || ""
        } اطمینان دارید؟`}
        close={() => setOpenDelete(false)}
        submit={handleDelete}
        open={openDelete}
        loading={loading2.delete}
      />
      <Confirm
        message={`آیا از حذف ${
          "   وام رفاه " + reuqestDetail.userFullName || ""
        } اطمینان دارید؟`}
        close={() => setOpenDelete2(false)}
        submit={handleDeleteRefah}
        open={openDelete2}
        loading={loading2.deleteRefah}
      />
      <Modal
        open={open}
        close={() => {
          setOtp("");
          setOpen(false);
        }}
        title="کد ارسالی را وارد کنید"
      >
        <div className="flex flex-col gap-3">
          <TextInput currentValue={otp} change={setOtp} label="کد ارسالی" />
          <Button
            onClick={handleEdit}
            disabled={!otp || loading2.editMoal}
            variant="contained"
          >
            {" "}
            {loading2.editMoal ? <CircularProgress /> : <> تایید </>}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default EditBeta;
const STATUS = [
  {
    id: 1,
    title: "وام ایجاد شده است",
  },
  {
    id: "2",
    title: "اجازه نامه تایید شده است",
  },
  {
    id: 4,
    title: "وام تسویه شده است",
  },
  {
    id: 3,
    title: "حذف وام از رفاه و بالن",
  },
];
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
        <>
          <>{children}</>
        </>
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
