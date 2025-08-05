/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Pagination,
  Paper,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import axios from "axios";
import momentJalaali from "moment-jalaali";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Dropdown, PageTitle, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  ALL_PRICES,
  ALL_USERS,
  baseUrl,
  BRANDS,
  CATEGORIES,
  CREATE_DISCOUNT,
  DOWNLOAD_FILE,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { setBrands, setCategories } from "../../redux/slices/relationals";
import { logout } from "../../redux/slices/user";
import Users from "./users";
const CreateDiscount = () => {
  const [step, setStep] = useState(1);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState({});
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [startTime, setstartTime] = useState(momentJalaali());
  const [endTime, setendTime] = useState();
  const startTimeCalender = useRef();
  const endTimeCalender = useRef();
  const [title, setTitle] = useState("");
  const [valueStatDate, setValueStatDate] = useState(0);
  const [valueEndDate, setValueEndDate] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [brandFilter, setBrandFilter] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [search, setsearch] = useState("");
  const [products, setProducts] = useState({});
  const [productChoosen, setProductChoosen] = useState(null);

  const [users, setUsers] = useState({});
  const [usersLimit, setUsersLimit] = useState(20);
  const [usersSearch, setUsersSearch] = useState();
  const [usersApplySearch, setUsersApplySearch] = useState("");
  const [usersPage, setUsersPage] = useState(1);
  const [usersSelected, setUsersSelected] = useState();
  const [selectedAll, setSelectedAll] = useState(false);

  const [applySearch, setApplySearch] = useState("");

  const submitData = () => {
    const data = {
      title: title,
      code: code,
      value: value,
      type: type.value,
      targetId: productChoosen?.id,
      fromDate: new Date(startTime._d).toISOString(),
      toDate: new Date(endTime._d).toISOString(),
      userId: selectedAll ? null : usersSelected?.id,
      active: true,
    };
    if (
      data.title &&
      data.code &&
      data.value !== undefined &&
      data.type !== undefined &&
      data.targetId !== undefined &&
      data.fromDate &&
      data.toDate
    ) {
      setLoading(true);
      axiosInstance
        .post(`${baseUrl}/${CREATE_DISCOUNT}`, data, configReq(token))
        .then((res) => {
          setLoading(false);
          toast.success("با موفقیت اضافه شد");
          navigate("/discounts");
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
        });
    } else if (!title) {
      toast.error("   موارد را کامل کنید");
    }
  };
  useEffect(() => {
    const params = new URLSearchParams();
    page !== null && params.append("Page", page);
    limit !== null && params.append("Limit", limit);

    brandFilter !== "" &&
      brandFilter.id &&
      params.append("brand", brandFilter.id);
    catFilter !== "" && catFilter.id && params.append("category", catFilter.id);
    applySearch !== "" && params.append("search", applySearch);
    getProducts(params);
  }, [page, limit, brandFilter, catFilter, token, applySearch]);
  const getProducts = (url) => { 
    setLoading(true);
    axiosInstance(`${baseUrl}/${ALL_PRICES}?${url}`, configReq(token))
      .then((res) => {
        setLoading(false);
        setProducts(res.data);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const resetFilter = () => {
    setBrandFilter("");
    setCatFilter("");
    setLimit(20);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    usersPage !== null && params.append("Page", usersPage);
    usersLimit !== null && params.append("Limit", usersLimit);
    usersApplySearch !== null && params.append("search", usersApplySearch);
    getUsers(params);
  }, [token, usersPage, usersLimit, usersApplySearch]);
  const getUsers = (url) => {
    setLoading(true);
    axiosInstance(`${baseUrl}/${ALL_USERS}?${url}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        setUsers(data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    setLoading(true);
    axiosInstance(`${baseUrl}/${BRANDS}?Page=${1}&Limit=${2000}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data.code === 200) {
          dispatch(setBrands(data.data));
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    axiosInstance(`${baseUrl}/${CATEGORIES}?Page=${1}&Limit=${2000}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data.code === 200) {
          dispatch(setCategories(data.data));
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  }, []);
  return (
    <>
      <PageTitle
        title=" افزودن کد تخفیف محصول"
        broadCrumb={[
          {
            title: "    باشگاه مشتریان",
            path: "/discounts",
          },
          {
            title: "کد تخفیف محصول",
            path: "/discounts",
          },
        ]}
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          <>
            {" "}
            {step === 1 ? (
              <div className="flex flex-col md:grid lg:grid-cols-4 md:grid-cols-3   gap-4 relative z-10">
                <TextInput
                  label="شرح تخفیف"
                  change={setTitle}
                  currentValue={title}
                />

                <TextInput
                  label="کد تخفیف محصول"
                  change={setCode}
                  currentValue={code}
                />
                <Dropdown
                  value={type}
                  change={setType}
                  data={TPYE}
                  title="  نوع تخفیف"
                />
                <TextInput
                  label="ارزش تخفیف "
                  change={setValue}
                  currentValue={value}
                  number
                />
                <div className="relative">
                  <DatePicker
                   timePicker={false}
                    value={startTime}
                    isGregorian={false}
                    ref={startTimeCalender}
                    min={momentJalaali()}
                    onChange={(value) => {
                      setstartTime(value);
    
                      setValueStatDate(value._d.toLocaleDateString("fa"));
                    }}
                  />
                  <TextField
                    onMouseUp={() => startTimeCalender.current?.setOpen(true)}
                    InputProps={{
                      inputProps: {
                        style: { textAlign: "right", width: "100%" },
                      },
                    }}
                    variant="outlined"
                    value={valueStatDate ? valueStatDate : ""}
                    label={"از تاریخ "}
                    autoComplete="off"
                    fullWidth
                  />
                </div>
                <div className="relative">
                  <DatePicker
                    value={endTime}
                    timePicker={false}
                    min={startTime}
                    isGregorian={false}
                    ref={endTimeCalender}
                    onChange={(value) => {
                      setendTime(value);
                      /*    handleOnchange(
            props.item.name,
            value._d.toLocaleDateString("fa")
          ); */
                      setValueEndDate(value._d.toLocaleDateString("fa"));
                    }}
                  />
                  <TextField
                    onMouseUp={() => endTimeCalender.current?.setOpen(true)}
                    InputProps={{
                      inputProps: {
                        style: { textAlign: "right", width: "100%" },
                      },
                    }}
                    variant="outlined"
                    value={valueEndDate ? valueEndDate : ""}
                    label={"تا تاریخ "}
                    autoComplete="off"
                    fullWidth
                  />
                </div>
                <Button
                  sx={{ maxWidth: "200px", margin: "0 auto" }}
                  variant="contained"
                  color="primary"
                  disabled={
                    !valueEndDate ||
                    !valueStatDate ||
                    !value ||
                    !type ||
                    !code ||
                    !title
                  }
                  onClick={() => setStep(2)}
                  className="col-span-4 justify-center items-center "
                >
                  مرحله بعد
                </Button>
              </div>
            ) : step === 2 ? (
              <>
                <div className="flex justify-between ">
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={() => setStep(1)}
                  >
                    بازگشت
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    variant="contained"
                    color="primary"
                  >
                    مرحله بعد
                  </Button>
                </div>
                <Users
                  data={users}
                  resetUserFilter={() => {
                    setUsersLimit(20);
                    setUsersApplySearch("");
                  }}
                  limit={usersLimit}
                  setLimit={setUsersLimit}
                  setApplySearch={setUsersApplySearch}
                  setsearch={setUsersSearch}
                  search={usersSearch}
                  selectedUser={usersSelected}
                  setUserChoosen={setUsersSelected}
                  setPage={setUsersPage}
                  page={usersPage}
                  setSelectedAll={setSelectedAll}
                  selectedAll={selectedAll}
                  nextStep={() => setStep(3)}
                />
              </>
            ) : (
              <>
                <Paper elevation={0} className="rounded-sm border-[#f0f0f0] ">
                  <div className="justify-between flex items-center">
                    <Button
                      variant="outlined"
                      size="medium"
                      onClick={() => setStep(2)}
                    >
                      بازگشت
                    </Button>
                    <Button variant="contained" onClick={submitData}>
                      ثبت کد تخفیف محصول
                    </Button>
                  </div>
                  <div className="flex justify-between items-center border-b-2 border-dashed py-4 border-[#f0f0f0]">
                    <div className="flex items-center">
                      <span className="text-base font-semibold pl-4 ml-4 border-l">
                        نتایج جستجو :{" "}
                      </span>
                      <span className="text-xs text-[#8c8c8c] ml-4">
                        تعداد نتایج:
                      </span>
                      <span className="text-sm ">
                        {products?.meta?.total} مورد
                      </span>
                    </div>

                    <Button
                      onClick={resetFilter}
                      variant="contained"
                      color="success"
                    >
                      <RestartAltIcon />
                      ریست فیلتر
                    </Button>
                  </div>{" "}
                  <Box
                    sx={{ label: { marginTop: "0 !important" } }}
                    className="grid md:grid-cols-4 py-5  md:px-3 gap-x-4 gap-y-4"
                  >
                    <Dropdown
                      title="تعداد موارد"
                      data={[5, 10, 15, 20, 30, 50, 2000]}
                      value={limit}
                      change={setLimit}
                    />

                    <FormControl variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-password">
                        جستجو
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        value={search}
                        onChange={(e) => setsearch(e.target.value)}
                        endAdornment={
                          <>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => setApplySearch(search)}
                            >
                              جستجو
                            </Button>
                          </>
                        }
                        label="Password"
                      />
                    </FormControl>
                  </Box>
                </Paper>
                {productChoosen && (
                  <div className="flex  items-center flex-wrap gap-2 border-b py-6">
                    <span className="text-sm font-bold">
                      محصول انتخاب شده :‌
                    </span>
                    <div>
                      <Box
                        sx={{
                          overflow: "none",
                          alignItems: "center",
                          display: "flex",
                          gap: 2,

                          borderRadius: "12px",
                          cursor: "pointer",
                        }}
                        className="flex-wrap"
                      >
                        {productChoosen?.galleryId && (
                          <img
                            style={{ width: "50px" }}
                            src={`${baseUrl}/${DOWNLOAD_FILE}/${productChoosen?.galleryId}?size=tiny`}
                            alt=""
                          />
                        )}

                        <Typography
                          sx={{
                            fontSize: "12px",
                            textAlign: "center",
                            mx: "5px",
                          }}
                        >
                          {productChoosen?.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            textAlign: "center",
                            mx: "5px",
                          }}
                        >
                          {productChoosen?.code}
                        </Typography>
                        <Box
                          sx={{
                            fontSize: "12px",
                            textAlign: "center",
                            mx: "5px",
                          }}
                          className="flex gap-2"
                        >
                          {productChoosen?.productAttribute?.type === 1 && (
                            <Avatar
                              sx={{
                                bgcolor:
                                  productChoosen?.productAttribute?.value,
                                border: "1px solid gray",
                                width: "18px",
                                height: "18px",
                              }}
                            >
                              &nbsp;
                            </Avatar>
                          )}
                          {productChoosen?.productAttribute?.title}
                        </Box>
                        <Box
                          className="flex gap-2"
                          sx={{
                            fontSize: "12px",
                            textAlign: "center",
                            mx: "5px",
                          }}
                        >
                          {productChoosen?.productAttribute2?.type === 1 && (
                            <Avatar
                              sx={{
                                bgcolor:
                                  productChoosen?.productAttribute2?.value,
                                border: "1px solid gray",
                                width: "18px",
                                height: "18px",
                              }}
                            >
                              &nbsp;
                            </Avatar>
                          )}
                          {productChoosen?.productAttribute2?.title}
                        </Box>
                      </Box>
                    </div>
                  </div>
                )}
                <Grid sx={{ mt: 4 }} container spacing={2}>
                  {products?.data?.map((item, index) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                      {" "}
                      <Box
                        sx={{
                          overflow: "none",
                          alignItems: "center",
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          pt: "20px",
                          borderRadius: "12px",
                          cursor: "pointer",
                          backgroundColor: (theme) =>
                            productChoosen?.id === item.id
                              ? "#b7e8fd75"
                              : theme.palette.mode === "light"
                              ? "white"
                              : theme.palette.background.paper,
                          height: "270px",
                        }}
                        key={index}
                        onClick={() => setProductChoosen(item)}
                        className="border rounded-sm"
                      >
                        {item?.galleryId ? (
                          <img
                            style={{ width: "50px" }}
                            src={`${baseUrl}/${DOWNLOAD_FILE}/${item?.galleryId}?size=tiny`}
                            alt=""
                          />
                        ) : (
                          <img
                            style={{ width: "50px" }}
                            src={"/images/no_image.svg"}
                            alt=""
                          />
                        )}

                        <Typography
                          sx={{
                            fontSize: "12px",
                            textAlign: "center",
                            mx: "5px",
                          }}
                        >
                          {item?.title}
                        </Typography>
                        <div className="flex justify-around items-center w-full">
                          <Typography variant="caption">کد ویژگی :‌</Typography>
                          <Typography variant="caption">
                            {item?.code}
                          </Typography>
                        </div>

                        <Box
                          sx={{
                            fontSize: "12px",
                            /*    textAlign: "center", */
                            /*    mx: "5px", */
                          }}
                          className="flex gap-2 justify-start w-full px-5"
                        >
                          {item?.productAttribute?.type === 1 && (
                            <Avatar
                              sx={{
                                bgcolor: item?.productAttribute?.value,
                                border: "1px solid gray",
                                width: "18px",
                                height: "18px",
                              }}
                            >
                              &nbsp;
                            </Avatar>
                          )}
                          {item?.productAttribute?.title}
                        </Box>
                        <Box
                          className="flex gap-2"
                          sx={{
                            fontSize: "12px",
                            textAlign: "center",
                            mx: "5px",
                          }}
                        >
                          {item?.productAttribute2?.type === 1 && (
                            <Avatar
                              sx={{
                                bgcolor: item?.productAttribute2?.value,
                                border: "1px solid gray",
                                width: "18px",
                                height: "18px",
                              }}
                            >
                              &nbsp;
                            </Avatar>
                          )}
                          {item?.productAttribute2?.title}
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Pagination
                    count={products?.meta?.total_pages}
                    variant="outlined"
                    page={page}
                    onChange={(_e, value) => {
                      setPage(value);
                    }}
                    sx={{ my: 2 }}
                  />
                </Box>
              </>
            )}
          </>
        </Paper>
      </div>
    </>
  );
};

export default CreateDiscount;
const TPYE = [
  {
    value: 0,
    title: "مبلغی",
  },
  /*  {
    value: 0,
    title: "درصدی",
  }, */
];
