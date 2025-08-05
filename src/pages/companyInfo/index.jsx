/* eslint-disable react-hooks/exhaustive-deps */
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Paper,
  Skeleton,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import momentJalaali from "moment-jalaali";
import React, { Fragment, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker2";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PageTitle, TextInput, UploadImage } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { Confirm } from "../../components/modals";
import NoAccess from "../../components/noAccess";
import {
  baseUrl,
  CHANGE_CATELOGE_WEBSITE,
  CHANGE_SHOW_UNAVILABLE_PRODUCTS,
  EDIT_PROMOTION_LOGO,
  EDIT_SETTINGS,
  GET_GATEWAY_TYPES,
  GET_PROVINCE,
  GET_SETTING_MAINTEIN,
  GET_SETTING_SYNC_PRODUCT,
  GET_SETTING_TELEGRAM,
  GET_SETTING_WALLET,
  GET_SETTINGS,
  SHOW_MAP_SETTING,
  SHOW_ROBOTS_SETTING,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
import Address from "./address";
import FooterLogos from "./footer";
import LoginImage from "./loginImage";
import Logos from "./logos";
import SiteLink from "./siteLink";
import Social from "./social";
import SyncSetting from "./syncSetting";

const CompanyInfo = () => {
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [mainTain, setmainTain] = useState(false);
  const [loadingSumbit, setLoadingSumbit] = useState(false);
  const [loadingSumbit2, setLoadingSumbit2] = useState(false);
  const [wallet, setWallet] = useState(false);
  const [openWarining, setOpenWarining] = useState(false);
  const [value2, setValue2] = useState();
  const [catalog, setCatalog] = useState(false);
  const [province, setProvince] = useState([]);
  const [cities, setCities] = useState();

  const [data, setData] = useState({});
  const dispatch = useDispatch();
  const location = useLocation();
  const [selectedProductImage2, setselectedProductImage2] = useState();
  const [avatar2, setAvatar2] = useState();
  const [selectedProductImage3, setselectedProductImage3] = useState();
  const [avatar3, setAvatar3] = useState();
  const [showUnavailableProducts, setShowUnavailableProducts] = useState();
  const [avatar4, setAvatar4] = useState();
  const [value, setValue] = useState(0);
  const [showMap, setShowMap] = useState(0);
  const [noRobots, setNoRobots] = useState(0);
  const [startTime, setstartTime] = useState();
  const [valueStatDate, setValueStatDate] = useState(0);
  const startTimeCalender = useRef();
  const [selectedProductImage, setselectedProductImage] = useState();
  const [avatar, setAvatar] = useState();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [types, setTypes] = useState([]);
  const { userPermissions } = useSelector((state) => state.relationals);

  useEffect(() => {
    setLoading(true);
    axiosInstance(`${baseUrl}/${GET_SETTINGS}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data && data.code === 200 && data.data) {
          setData({
            ...data.data,
            syncProductSetting: data.data.syncProductSetting || {},
          });
          setmainTain(data.data.maintenanceMode);
          setShowMap(data.data.showMapInFront);
          setCatalog(data.data.catalogMode);
          setNoRobots(data.data.robotNoIndex);
          setShowUnavailableProducts(data.data.showUnavailableProducts);
          if (data.data.maintenanceModeExpDateTime) {
            let date = new Date(data.data.maintenanceModeExpDateTime);

            let formattedDate = date.toLocaleDateString("en-US-u-ca-persian");
            let formattedTime = date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });

            formattedDate =
              formattedDate.split("/")[2] +
              "/" +
              formattedDate.split("/")[0] +
              "/" +
              formattedDate.split("/")[1];

            let jalaliDateTime = `${formattedDate} ${formattedTime}`;
            setstartTime(momentJalaali(jalaliDateTime, "jYYYY/jM/jD HH:mm"));
          }
          setWallet(data.data.showWalletPayment);
          setselectedProductImage2(data.data.walletImage);
          const pi = data.data.province;
          axiosInstance(`${baseUrl}/${GET_PROVINCE}`, configReq(token))
            .then((res) => {
              if (res.data.data) {
                setProvince(res.data.data);
                var finded = res.data.data?.find(
                  (item) => Number(item.id) === Number(pi)
                );
                if (finded) setCities(finded?.cities);
              }
            })
            .catch((err) => {
              toast.error(err.response?.data?.message);
            });
        }
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
        setLoading(false);
      });

    axiosInstance(`${baseUrl}/${GET_GATEWAY_TYPES}`, configReq(token))
      .then((res) => {
        var temp = [];
        res.data.data.map((item) => {
          temp.push({ id: item.Id, title: item.PersianTitle });
        });
        setTypes(temp);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      });
  }, [id, token]);

  useEffect(() => {
    if (location.hash) {
      setValue(Number(location.hash.slice(1)));
    }
  }, [location.hash]);
  const submitEdit = () => {
    setLoadingSumbit(true);

    axiosInstance
      .put(
        `${baseUrl}/${EDIT_SETTINGS}`,
        {
          ...data,
        },
        configReq(token)
      )
      .then((res) => {
        toast.success("با موفقیت ویرایش شد");
        setLoadingSumbit(false);
        setOpenWarining(false);
        setData(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoadingSumbit(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      });
    if (avatar || selectedProductImage) {
      const formData = new FormData();
      if (avatar) formData.append("files", avatar);
      if (selectedProductImage)
        formData.append("fromGallery", selectedProductImage);
      axiosInstance
        .put(`${baseUrl}/${EDIT_PROMOTION_LOGO}`, formData, configReq(token))
        .then((res) => {})
        .catch((err) => {
          toast.error(err.response?.data?.message);
          if (err.response?.status === 401 || err.response?.status === 403) {
            dispatch(logout());
          }
        });
    }
  };
  const submitEdit2 = () => {
    setLoadingSumbit2(true);
    axiosInstance
      .put(
        `${baseUrl}/${GET_SETTING_MAINTEIN}`,
        {
          state: mainTain,
          expDateTime: momentJalaali(startTime._d).format(
            "YYYY-MM-DDTHH:mm:ss"
          ),
        },
        configReq(token)
      )
      .then((res) => {
        toast.success("با موفقیت ویرایش شد");
        setLoadingSumbit2(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoadingSumbit2(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      });
  };
  const submitEdit4 = () => {
    setLoadingSumbit2(true);

    axiosInstance
      .put(
        `${baseUrl}/${SHOW_MAP_SETTING}`,
        {
          showMap: showMap,
        },
        configReq(token)
      )
      .then((res) => {
        toast.success("با موفقیت ویرایش شد");
        setLoadingSumbit2(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoadingSumbit2(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      });
  };
  const submitEdit5 = () => {
    setLoadingSumbit2(true);

    axiosInstance
      .put(
        `${baseUrl}/${SHOW_ROBOTS_SETTING}`,
        {
          disAllowSiteMap: noRobots,
        },
        configReq(token)
      )
      .then((res) => {
        toast.success("با موفقیت ویرایش شد");
        setLoadingSumbit2(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoadingSumbit2(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      });
  };
  const submitEdit6 = () => {
    setLoadingSumbit2(true);

    axiosInstance
      .put(
        `${baseUrl}/${CHANGE_CATELOGE_WEBSITE}`,
        {
          state: catalog,
        },
        configReq(token)
      )
      .then((res) => {

      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoadingSumbit2(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      });
    axiosInstance
      .put(
        `${baseUrl}/${CHANGE_SHOW_UNAVILABLE_PRODUCTS}`,
        {
          showUnavailableProducts: showUnavailableProducts,
        },
        configReq(token)
      )
      .then((res) => {
        toast.success("با موفقیت ویرایش شد");
        setLoadingSumbit2(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoadingSumbit2(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      });
  };
  const submitEdit3 = () => {
    setLoadingSumbit2(true);
    const formData = new FormData();

    if (avatar2) {
      formData.append("filesForWalletImage", avatar2);
    } else {
      formData.append("fromGalleryForWalletImage", selectedProductImage2);
    }
    if (avatar3) {
      formData.append("fromGalleryForCoverImage", avatar3);
    } else {
      formData.append(
        "fromGalleryForCoverImage",
        selectedProductImage3 || data?.walletCoverImage
      );
    }
    formData.append("state", wallet);
    formData.append("amount", data?.minWalletChargeLimit);
    axiosInstance
      .put(`${baseUrl}/${GET_SETTING_WALLET}`, formData, configReq(token))
      .then((res) => {
        toast.success("با موفقیت ویرایش شد");
        setLoadingSumbit2(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoadingSumbit2(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      });
  };

  const handleSumbitTelegram = () => {
    setLoadingSumbit2(true);
    const formData = new FormData();
    formData.append("isActive", data?.isTelegramActive);
    axiosInstance
      .put(`${baseUrl}/${GET_SETTING_TELEGRAM}`, formData, configReq(token))
      .then((res) => {
        toast.success("با موفقیت ویرایش شد");
        setLoadingSumbit2(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoadingSumbit2(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      });
  };
  const handleDateChange = (value) => {
    setstartTime(value);

    const formattedDateTime = `${value._d.toLocaleDateString(
      "fa"
    )} - ${value._d.toLocaleTimeString("fa", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    setValueStatDate(formattedDateTime);
  };
  const handleNumberSync = () => {
    setLoadingSumbit2(true);
    axiosInstance
      .put(
        `${baseUrl}/${GET_SETTING_SYNC_PRODUCT}`,
        { ...data.syncProductSetting },
        configReq(token)
      )
      .then((res) => {
        toast.success("با موفقیت ویرایش شد");
        setLoadingSumbit2(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoadingSumbit2(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      });
  };
  if (!userPermissions?.companyInfo?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle title="  تنظیمات " />
      <div className="md:mx-3 mx-1">
        <Paper sx={{ border: "1px solid #dbdfea", mb: 1 }} elevation={0}>
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
              <Tab
                label=" 
مشخصات شرکت / مجموعه "
                {...a11yProps(0)}
              />{" "}
              <Tab label="  آدرس های شرکت / مجموعه" {...a11yProps(1)} />
              <Tab label=" لوگو  " {...a11yProps(2)} />
              <Tab label="  لوگو فوتر " {...a11yProps(3)} />
              <Tab label="  شبکه های اجتماعی   " {...a11yProps(4)} />
              <Tab label="   لینک ها   " {...a11yProps(5)} />
{/*               <Tab label="     تنظیمات قیمت گذاری  " {...a11yProps(6)} />{" "}
 */}              <Tab label="     تنظیمات  صفحه پرداخت  " {...a11yProps(7)} />
              {/*    <Tab label="     تنظیمات   ایمیل  " {...a11yProps(7)} /> */}
              <Tab label="     تنظیمات   کمپین  " {...a11yProps(8)} />
              {/*               <Tab label="     تنظیمات   خدمات  " {...a11yProps(10)} />
               */}{" "}
              <Tab label="   عکس های لاگین " {...a11yProps(9)} />
              <Tab label="   تنظیمات سایت" {...a11yProps(10)} />
              <Tab label="   تنظیمات شارژ از کیف پول" {...a11yProps(11)} />
              <Tab label="  تنظیمات نقشه" {...a11yProps(12)} />
              <Tab label="  تنظیمات ربات" {...a11yProps(13)} />
              <Tab label="  تنظیمات صفحه محصول" {...a11yProps(14)} />
              <Tab label="  تنظیمات  محصول" {...a11yProps(15)} />
              <Tab label="  تنظیمات  تلگرام" {...a11yProps(16)} />
              <Tab label="  تنظیمات  سینک با سایت دوم" {...a11yProps(17)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            {" "}
            {loading ? (
              <>
                <div className="grid grid-cols-4 gap-6">
                  {Array.from(Array(8).keys()).map((item, i) => (
                    <Fragment key={i + "TableCellLoading"}>
                      <Skeleton height={30} width="100%" />
                    </Fragment>
                  ))}
                </div>
              </>
            ) : (
              <>
                {" "}
                {data && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <TextInput
                        label="نام شرکت / مجموعه"
                        currentValue={data?.companyName}
                        change={(e) => setData({ ...data, companyName: e })}
                        disabled={!userPermissions?.companyInfo?.update}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <TextInput
                        label=" کد پستی"
                        currentValue={data?.postalCode}
                        change={(e) => setData({ ...data, postalCode: e })}
                        disabled={!userPermissions?.companyInfo?.update}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <TextInput
                        label=" کد اقتصادی"
                        currentValue={data?.economicCode}
                        change={(e) => setData({ ...data, economicCode: e })}
                        disabled={!userPermissions?.companyInfo?.update}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <TextInput
                        label="  شناسه ثبت"
                        currentValue={data?.regNumber}
                        change={(e) => setData({ ...data, regNumber: e })}
                        disabled={!userPermissions?.companyInfo?.update}
                      />
                    </Grid>
                    {/*               <Grid item xs={12} sm={6} md={4} lg={3}>
                      <Dropdown
                        title=" استان"
                        data={province}
                        value={province?.find(
                          (item) => Number(item.id) === Number(data.province)
                        )}
                        change={(e) => {
                          setData({ ...data, province: e?.id });
                          setCities(e?.cities);
                        }}
                      />{" "}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <Dropdown
                        title="شهر "
                        data={cities}
                        value={cities?.find(
                          (item) => Number(item.id) === Number(data.city)
                        )}
                        change={(e) => setData({ ...data, city: e?.id })}
                      />
                    </Grid> */}
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <TextInput
                        label="شماره همراه "
                        currentValue={data?.contactMobile}
                        change={(e) => setData({ ...data, contactMobile: e })}
                        disabled={!userPermissions?.companyInfo?.update}
                      />
                    </Grid>{" "}
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <TextInput
                        label=" ایمیل "
                        currentValue={data?.companyEmail}
                        change={(e) => setData({ ...data, companyEmail: e })}
                        disabled={!userPermissions?.companyInfo?.update}
                      />
                    </Grid>
                    {/*            <Grid item xs={12} sm={6} md={4} lg={3}>
                      <TextInput
                        label="تلفن ۱ "
                        currentValue={data?.tel}
                        change={(e) => setData({ ...data, tel: e })}
                        disabled={!userPermissions?.companyInfo?.update}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <TextInput
                        label="تلفن  ۲"
                        currentValue={data?.tel2}
                        change={(e) => setData({ ...data, tel2: e })}
                        disabled={!userPermissions?.companyInfo?.update}
                      />
                    </Grid>{" "}
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <TextInput
                        label="تلفن  ۳"
                        currentValue={data?.tel3}
                        change={(e) => setData({ ...data, tel3: e })}
                        disabled={!userPermissions?.companyInfo?.update}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <TextInput
                        label="تلفن  ۴"
                        currentValue={data?.tel4}
                        change={(e) => setData({ ...data, tel4: e })}
                        disabled={!userPermissions?.companyInfo?.update}
                      />
                    </Grid> */}
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <h2> - موارد دیگر</h2>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <TextInput
                        label=" توضیحات "
                        currentValue={data?.companyDescription}
                        change={(e) =>
                          setData({ ...data, companyDescription: e })
                        }
                        disabled={!userPermissions?.companyInfo?.update}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <TextInput
                        label=" شعار "
                        currentValue={data?.companySlogan}
                        change={(e) => setData({ ...data, companySlogan: e })}
                        disabled={!userPermissions?.companyInfo?.update}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <FormControlLabel
                        sx={{
                          border: (theme) =>
                            theme.palette.mode === "light"
                              ? "1px solid rgba(0, 0, 0, 0.23)"
                              : "1px solid rgba(55, 255, 255, 0.23)",
                          borderRadius: "4px",
                          height: "3.07rem",
                          marginLeft: "0px !important",
                          marginRight: "0px !important",
                          width: "100%",
                        }}
                        control={<Checkbox checked={data?.LegalInvoice} />}
                        onChange={(e) => {
                          setData({
                            ...data,
                            LegalInvoice: !data?.LegalInvoice,
                          });
                        }}
                        label={
                          <Typography
                            sx={{
                              color: (theme) =>
                                theme.palette.mode === "light"
                                  ? "rgba(0, 0, 0, 0.6)"
                                  : "rgba(255, 255, 255, 0.7)",
                              fontSize: { md: "0.75rem !important" },
                              fontWeight: "400 !important",
                            }}
                          >
                            درخواست فاکتور حقیقی
                          </Typography>
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <TextInput
                        label=" متن کپی رایت "
                        currentValue={data?.footerCopyright}
                        change={(e) => setData({ ...data, footerCopyright: e })}
                        disabled={!userPermissions?.companyInfo?.update}
                      />
                    </Grid>
                    {/*        <Grid item xs={12} sm={12} md={12} lg={12}>
                      <TextInput
                        label=" نشانی ۱"
                        currentValue={data?.address}
                        change={(e) => setData({ ...data, address: e })}
                        disabled={!userPermissions?.companyInfo?.update}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <TextInput
                        label=" نشانی ۲"
                        currentValue={data?.address2}
                        change={(e) => setData({ ...data, address2: e })}
                        disabled={!userPermissions?.companyInfo?.update}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <TextInput
                        label=" نشانی ۳ "
                        currentValue={data?.address3}
                        change={(e) => setData({ ...data, address3: e })}
                        disabled={!userPermissions?.companyInfo?.update}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <TextInput
                        label=" نشانی ۴"
                        currentValue={data?.address4}
                        change={(e) => setData({ ...data, address4: e })}
                        disabled={!userPermissions?.companyInfo?.update}
                      />
                    </Grid> */}
                    {/*    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <h2> - موقعیت بر روی نقشه</h2>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Map
                        onLocationSelect={(e) => {
                          setData({
                            ...data,
                            longtitude: e.longitude,
                            latitude: e.latitude,
                          });
                        }}
                        longitude={data.longtitude}
                        latitude={data.latitude}
                      />
                    </Grid> */}
                    {/*      <Grid item xs={12} sm={12} md={12} lg={12}>
                    <div className="flex gap-4">
                      {" "}
                      {data.logo && (
                        <img
                          src={`${baseUrl}/${DOWNLOAD_FILE}/${data.logo}`}
                          alt=""
                          loading="lazy"
                          className="object-contain"
                        />
                      )}
                      {userPermissions?.companyInfo?.update && (
                        <MultipleImages
                          files={files}
                          setFiles={setFiles}
                          selectedProductImage={selectedProductImage}
                          setselectedProductImage={setselectedProductImage}
                        />
                      )}
                    </div>
                  </Grid> */}
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        onClick={submitEdit}
                        variant="contained"
                        disabled={
                          !userPermissions?.companyInfo?.update || loadingSumbit
                        }
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                      >
                        {loadingSumbit ? (
                          <CircularProgress />
                        ) : (
                          <>ثبت اطلاعات</>
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </>
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Address />
          </TabPanel>{" "}
          <TabPanel value={value} index={2}>
            <Logos data={data} />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <FooterLogos />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <Social data={data} setData={setData} />
            <div className="flex justify-end w-full mt-7">
              <Button
                onClick={submitEdit}
                variant="contained"
                disabled={
                  !userPermissions?.companyInfo?.update || loadingSumbit
                }
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                {loadingSumbit ? <CircularProgress /> : <>ثبت اطلاعات</>}
              </Button>
            </div>
          </TabPanel>
          <TabPanel value={value} index={5}>
            <SiteLink />
          </TabPanel>
   
          <TabPanel value={value} index={6}>
            <div className="grid md:grid-cols-4 flex-wrap items-center gap-5">
              <TextInput
                label=" تغیر نام مالیات در صفحه چک اوت"
                currentValue={data?.vatTitle}
                change={(e) => setData({ ...data, vatTitle: e })}
                disabled={!userPermissions?.companyInfo?.update}
              />
              <div className="col-span-4">
                {" "}
                <TextField
                  multiline
                  rows={2}
                  fullWidth
                  label=" توضیحات صفحه پرداخت"
                  value={data?.checkoutDescription}
                  onChange={(e) =>
                    setData({
                      ...data,
                      checkoutDescription: e.target.value,
                    })
                  }
                  disabled={!userPermissions?.companyInfo?.update}
                />
              </div>

              <div className="flex col-span-4 justify-end w-full mt-7">
                <Button
                  onClick={submitEdit}
                  s
                  variant="contained"
                  disabled={
                    !userPermissions?.companyInfo?.update || loadingSumbit
                  }
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {loadingSumbit ? <CircularProgress /> : <>ثبت اطلاعات</>}
                </Button>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={7}>
            <div className="grid md:grid-cols-4 flex-wrap items-center gap-5">
              <TextInput
                label=" عنوان پرموشن"
                currentValue={data?.promotionTitle}
                change={(e) => setData({ ...data, promotionTitle: e })}
                disabled={!userPermissions?.companyInfo?.update}
              />
              <div className="flex gap-1 items-center">
                <span className="text-xs">لوگو :</span>
                <UploadImage
                  file={avatar}
                  change={setAvatar}
                  address={data?.promotionGalleryId}
                  selectedProductImage={selectedProductImage}
                  setselectedProductImage={(e) => setselectedProductImage(e)}
                />
              </div>
              {/*    <div className="flex gap-1 items-center">
                <span className="text-xs">بنر صفحه محصول:</span>
                <UploadImage
                  file={avatar4}
                  change={setAvatar4}
                  address={data?.productBannerImageId}
                  selectedProductImage={selectedProductImage4}
                  setselectedProductImage={(e) => setselectedProductImage4(e)}
                />
              </div> */}
              <div className="flex col-span-4 justify-end w-full mt-7">
                <Button
                  onClick={() => {
                    submitEdit();
                    /*    productBannnerChange(); */
                  }}
                  variant="contained"
                  disabled={
                    !userPermissions?.companyInfo?.update || loadingSumbit
                  }
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {loadingSumbit ? <CircularProgress /> : <>ثبت اطلاعات</>}
                </Button>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={8}>
            <>
              {" "}
              <LoginImage data={data} setData={setData} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  mt: 4,
                }}
              >
                <Button
                  onClick={submitEdit}
                  variant="contained"
                  disabled={
                    !userPermissions?.companyInfo?.update || loadingSumbit
                  }
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {loadingSumbit ? <CircularProgress /> : <>ثبت اطلاعات</>}
                </Button>
              </Box>
            </>
          </TabPanel>
          <TabPanel value={value} index={9}>
            <>
              <div className="grid  md:grid-cols-4 flex-wrap items-center gap-5">
                <div className="flex justify-between items-center gap-3">
                  <span className="text-sm">حالت بروزرسانی سایت </span>
                  <Switch
                    onClick={() => setmainTain(!mainTain)}
                    checked={mainTain}
                  />
                </div>{" "}
                <Box
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
                    timePicker={true}
                    ref={startTimeCalender}
                    onChange={(value) => {
                      handleDateChange(value);
                    }}
                  />
                  <TextField
                    /*           error={errors.startTime} */
                    onMouseUp={() => startTimeCalender.current?.setOpen(true)}
                    InputProps={{
                      inputProps: {
                        style: { textAlign: "right", width: "100%" },
                      },
                    }}
                    variant="outlined"
                    value={valueStatDate ? valueStatDate : ""}
                    label={" تا تاریخ"}
                    autoComplete="off"
                    fullWidth
                  />
                </Box>
              </div>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  mt: 4,
                }}
              >
                <Button
                  onClick={submitEdit2}
                  variant="contained"
                  disabled={
                    !userPermissions?.companyInfo?.update || loadingSumbit2
                  }
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {loadingSumbit2 ? <CircularProgress /> : <>ثبت اطلاعات</>}
                </Button>
              </Box>
            </>
          </TabPanel>
          <TabPanel value={value} index={10}>
            <>
              <div className="grid md:grid-cols-4 flex-wrap items-center gap-5">
                <div className="flex justify-between items-center gap-3">
                  <span className="text-sm">شارژ کیف پول از درگاه نقدی</span>
                  <Switch onClick={() => setWallet(!wallet)} checked={wallet} />
                </div>
                <div className="flex gap-1 items-center">
                  <span className="text-xs">لوگو کیف پول:</span>
                  <UploadImage
                    file={avatar2}
                    change={setAvatar2}
                    address={data?.walletImage}
                    selectedProductImage={selectedProductImage2}
                    setselectedProductImage={(e) => setselectedProductImage2(e)}
                  />
                </div>{" "}
                <div className="flex gap-1 items-center">
                  <span className="text-xs">تصویر کاور کیف پول:</span>
                  <UploadImage
                    file={avatar3}
                    change={setAvatar3}
                    address={data?.walletCoverImage}
                    selectedProductImage={selectedProductImage3}
                    setselectedProductImage={(e) => setselectedProductImage3(e)}
                  />
                </div>
                <TextInput
                  label="حداقل مبلغ شارژ کیف پول"
                  currentValue={data?.minWalletChargeLimit || ""}
                  change={(e) => setData({ ...data, minWalletChargeLimit: e })}
                  disabled={!userPermissions?.companyInfo?.update}
                  number
                  price
                />
              </div>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  mt: 4,
                }}
              >
                <Button
                  onClick={submitEdit3}
                  variant="contained"
                  disabled={
                    !userPermissions?.companyInfo?.update || loadingSumbit2
                  }
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {loadingSumbit2 ? <CircularProgress /> : <>ثبت اطلاعات</>}
                </Button>
              </Box>
            </>
          </TabPanel>
          <TabPanel value={value} index={11}>
            <>
              <div className="grid md:grid-cols-4 flex-wrap items-center gap-5">
                <div className="flex justify-between items-center gap-3">
                  <span className="text-sm"> نمایش نقشه در سایت :‌ </span>
                  <Switch
                    onClick={() => setShowMap(!showMap)}
                    checked={showMap}
                  />
                </div>
              </div>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  mt: 4,
                }}
              >
                <Button
                  onClick={submitEdit4}
                  variant="contained"
                  disabled={
                    !userPermissions?.companyInfo?.update || loadingSumbit2
                  }
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {loadingSumbit2 ? <CircularProgress /> : <>ثبت اطلاعات</>}
                </Button>
              </Box>
            </>
          </TabPanel>
          <TabPanel value={value} index={12}>
            <>
              <div className="grid md:grid-cols-4 flex-wrap items-center gap-5">
                <div className="flex justify-between items-center gap-3">
                  <span className="text-sm"> غیر فعال سایت مپ :‌ </span>
                  <Switch
                    onClick={() => setNoRobots(!noRobots)}
                    checked={noRobots}
                  />
                </div>
              </div>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  my: 4,
                }}
              >
                <Button
                  onClick={submitEdit5}
                  variant="contained"
                  disabled={
                    !userPermissions?.companyInfo?.update || loadingSumbit2
                  }
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {loadingSumbit2 ? <CircularProgress /> : <>ثبت اطلاعات</>}
                </Button>
              </Box>
              <Alert severity="info">robots.txt</Alert>
            </>
          </TabPanel>
          <TabPanel value={value} index={13}>
            <>
              <div className="grid md:grid-cols-4 flex-wrap items-center gap-5">
                <div className="flex justify-start items-center gap-3">
                  <span className="text-sm"> حالت کاتالوگ:‌ </span>
                  <Switch
                    onClick={() => setCatalog(!catalog)}
                    checked={catalog}
                  />
                </div>
                <div className="flex justify-start items-center gap-3">
                  <span className="text-sm"> نمایش محصولات ناموجود:‌ </span>
                  <Switch
                    onClick={() =>
                      setShowUnavailableProducts(!showUnavailableProducts)
                    }
                    checked={showUnavailableProducts}
                  />
                </div>
              </div>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  my: 4,
                }}
              >
                <Button
                  onClick={submitEdit6}
                  variant="contained"
                  disabled={
                    !userPermissions?.companyInfo?.update || loadingSumbit2
                  }
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {loadingSumbit2 ? <CircularProgress /> : <>ثبت اطلاعات</>}
                </Button>
              </Box>
            </>
          </TabPanel>
          <TabPanel value={value} index={14}>
            <>
              <div className="grid md:grid-cols-4 flex-wrap items-center gap-5">
                <TextInput
                  label="کد پیش فرض  حسابداری (مانند : site)"
                  currentValue={data?.productCodePrefix}
                  change={(e) => setData({ ...data, productCodePrefix: e })}
                  disabled={!userPermissions?.companyInfo?.update}
                />{" "}
                <TextInput
                  label="شروع کد حسابداری"
                  currentValue={data?.productCodeStart}
                  change={(e) => setData({ ...data, productCodeStart: e })}
                  disabled={!userPermissions?.companyInfo?.update}
                />
                <TextInput
                  label=" کد حسابداری کنونی"
                  currentValue={data?.productCurrentCode}
                  change={(e) => setData({ ...data, productCurrentCode: e })}
                  disabled={true}
                />
              </div>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  my: 4,
                }}
              >
                <Button
                  onClick={() => setOpenWarining(true)}
                  variant="contained"
                  disabled={
                    !userPermissions?.companyInfo?.update || loadingSumbit2
                  }
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {loadingSumbit2 ? <CircularProgress /> : <>ثبت اطلاعات</>}
                </Button>
              </Box>
            </>
          </TabPanel>
          <TabPanel value={value} index={15}>
            <>
              <div className="grid md:grid-cols-4 flex-wrap items-center gap-5">
                <div className="flex justify-between items-center gap-3">
                  <span className="text-sm"> فعال سازی تلگرام:‌ </span>
                  <Switch
                    onClick={() =>
                      setData({
                        ...data,
                        isTelegramActive: !data?.isTelegramActive,
                      })
                    }
                    checked={data?.isTelegramActive}
                  />
                </div>

                <TextInput
                  label="آخرین لاگ خطا تلکرام"
                  currentValue={data?.telegramLastLog}
                  change={(e) => setData({ ...data, telegramLastLog: e })}
                  disabled={true}
                  ltr={true}
                />
              </div>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  my: 4,
                }}
              >
                <Button
                  onClick={() => handleSumbitTelegram()}
                  variant="contained"
                  disabled={
                    !userPermissions?.companyInfo?.update || loadingSumbit2
                  }
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {loadingSumbit2 ? <CircularProgress /> : <>ثبت اطلاعات</>}
                </Button>
              </Box>
            </>
          </TabPanel>
          <TabPanel value={value} index={16}>
            <>
              <SyncSetting data={data} setData={setData} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  my: 4,
                }}
              >
                <Button
                  onClick={() => handleNumberSync()}
                  variant="contained"
                  disabled={
                    !userPermissions?.companyInfo?.update || loadingSumbit2
                  }
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {loadingSumbit2 ? <CircularProgress /> : <>ثبت اطلاعات</>}
                </Button>
              </Box>
            </>
          </TabPanel>
        </Paper>
      </div>
      <Confirm
        message="درصورت تغییر کد شروع حسابداری یا کد پیشفرض حسابداری ، در زمان ساخت ویژگی قیمتی یا افزدون ویژگی قیمتی ، کدها بر اساس کد جدید ساخته میشود ."
        close={() => setOpenWarining(false)}
        submit={submitEdit}
        open={openWarining}
        loading={loadingSumbit}
      />
    </>
  );
};

export default CompanyInfo;

function a11yProps(index) {
  return {
    id: `company-tab-${index}`,
    "aria-controls": `company-tabpanel-${index}`,
  };
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
        <Box sx={{ p: 3 }}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}

var planData = [
  { id: 0, title: "فاکتور" },
  { id: 1, title: "کیف پول" },
];
