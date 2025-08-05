import { Delete } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Switch,
  Typography,
  Divider,
  Paper,
  Grid,
  Stack,
  Skeleton,
} from "@mui/material";
import "@neshan-maps-platform/react-openlayers/dist/style.css";
import { Editor } from "@tinymce/tinymce-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  Dropdown,
  Modal,
  PageTitle,
  TextInput,
  UploadImage,
} from "../../components/common";
import Map from "../../components/common/map";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  ALL_SHIPPING_COMPANIES_GET_BY_ID,
  ALL_SHIPPINGCLASS,
  baseUrl,
  CREATE_SHIPPING_COMPANY,
  DELETE_SHIPPING_COMPANY,
  EDIT_SHIPPING_COMPANY,
  GET_PROVINCE,
} from "../../helpers/api-routes";
import {
  DistributionType,
  PackType,
  PaymentType,
  PickupType,
  ServiceId,
} from "../../helpers/constants";
import { configReq } from "../../helpers/functions";
import { useNavigate, useParams } from "react-router-dom";

const TYPED = ["خیر", "بلی"];
const TYPEC = [
  { id: null, title: "هیچ کدام" },
  { id: 1, title: "تیپاکس" },
  { id: 4, title: "ماهکس" },
];
const TYPES = [
  { id: 1, title: "داخل شهر" },
  { id: 2, title: "شهر های دیگر" },
  { id: 3, title: "سراسری" },
];

const Section = ({ label, children, spacing = 2 }) => (
  <Paper elevation={0} sx={{ p: 2, mb: spacing, borderRadius: 2 }}>
    {label && (
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        {label}
      </Typography>
    )}
    <Divider sx={{ mb: 2 }} />
    {children}
  </Paper>
);

const EditShippingCompanyModal = () => {
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const { themeColor } = useSelector((state) => state.themeColor);
  const [allData, setAllData] = useState({
    locationDeliveryType: 1,
    enableLabelPrivacy: true,
    serviceId: 1,
    distributionType: 20,
    pickupType: 20,
    paymentType: 10,
    packType: 20,
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [avatar, setAvatar] = useState([]);
  const [selectedProductImage, setselectedProductImage] = useState();
  const [province, setProvince] = useState([]);
  const [cities, setCities] = useState();
  const [allShippingClass, setAllShippingClass] = useState([]);
  const useDarkMode = themeColor === "dark";
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch province and shipping class data
  useEffect(() => {
    axiosInstance(
      `${baseUrl}/${ALL_SHIPPINGCLASS}?Page=1&Limit=10000`,
      configReq(token)
    )
      .then((res) => {
        const temp = [];
        res.data.data
          .filter((it) => it.active)
          .map((item) => {
            temp.push({ ...item, title: item.name });
          });
        setAllShippingClass(temp);
      })
      .catch((err) => toast.error(err.response?.data?.message));
    if (id) {
      setLoadingData(true);
      axiosInstance
        .get(
          `${baseUrl}/${ALL_SHIPPING_COMPANIES_GET_BY_ID}?id=${id}`,
          configReq(token)
        )
        .then((res) => {
          setAllData(res.data.data);
          getProvince(res.data.data.provinceId);
        })
        .catch(() => {
          setLoadingData(false);
        })
        .finally(() => {
          setLoadingData(false);
        });
    } else {
      getProvince();
      setAllData({
        locationDeliveryType: 1,
        enableLabelPrivacy: true,
        serviceId: 1,
        distributionType: 20,
        pickupType: 20,
        paymentType: 10,
        packType: 20,
      });
    }
    // eslint-disable-next-line
  }, [id]);

  const getProvince = (provinceId) => {
    axiosInstance(`${baseUrl}/${GET_PROVINCE}`, configReq(token))
      .then((res) => {
        const { data } = res;
        if (data && data.code === 200 && data.data) setProvince(data.data);
        console.log(provinceId);
        setCities(data.data.find((item) => item.id === provinceId)?.cities);
      })
      .catch((err) => toast.error(err.response?.data?.message));
  };

  const deleteItem = () => {
    if (id) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_SHIPPING_COMPANY}?id=${id}`,
          configReq(token)
        )
        .then(() => {
          navigate("/shipping-companies");
          toast.success("با موفقیت حذف شد");
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
          setOpenDelete(false);
        });
    }
  };

  const handleSubmit = (lat, lan) => {
    const latitude = lat || allData.latitude;
    const longitude = lan || allData.longitude;
    if (!longitude || !latitude)
      return toast.error("لطفا موقعیت روی نقشه را انتخاب کنید");
    if (!allData.description)
      return toast.error("لطفا توضیحات (مودال) وارد کنید");
    if (!allData.extraDescription)
      return toast.error("لطفا توضیحات داخل کارت را وارد کنید");
    if (!allData.provinceId) return toast.error("لطفااستان را وارد کنید");
    if (!allData.cityId) return toast.error("لطفا شهر را وارد کنید");
    if (!allData?.title) return toast.error("نام شرکت را وارد کنید");

    let sendingData = {
      ...allData,
      title: allData.title,
      files: avatar,
      packagingCost: allData.packagingCost || 0,
      extraShippingCost: allData.extraShippingCost || 0,
      active: !!allData.active,
      delayedDelivery: allData.delayedDelivery || 0,
      coworkerDelayedDelivery: allData.coworkerDelayedDelivery || 0,
      longitude,
      latitude,
      isDefault: allData.isDefault,
      useDistanceLogic: allData.useDistanceLogic,
      hasVat: allData.hasVat,
      vat: allData.vat,
      hasPackagingVat: allData.hasPackagingVat,
      packagingVat: allData.packagingVat,
      fastSend: allData.fastSend,
      hasDeliveryCode: allData.hasDeliveryCode,
      maxSupportDistanceInKm: allData.maxSupportDistanceInKm,
    };
    if (selectedProductImage)
      sendingData = { ...sendingData, fromGallery: selectedProductImage };
    if (id) sendingData = { ...sendingData, id };
    Object.keys(sendingData).forEach((key) => {
      if (sendingData[key] === null || sendingData[key] === "")
        delete sendingData[key];
    });
    setLoading(true);
    const request = id
      ? axiosInstance.put(
          `${baseUrl}/${EDIT_SHIPPING_COMPANY}`,
          sendingData,
          configReq(token)
        )
      : axiosInstance.post(
          `${baseUrl}/${CREATE_SHIPPING_COMPANY}`,
          sendingData,
          configReq(token)
        );
    request
      .then(() => {
        toast.success(id ? "با موفقیت ویرایش شد" : "با موفقیت اضافه شد");
        navigate("/shipping-companies");
        setLoading(false);
        if (!id) setCities();
        setAllData({
          locationDeliveryType: 1,
          enableLabelPrivacy: true,
          serviceId: 1,
          distributionType: 20,
          pickupType: 20,
          paymentType: 10,
          packType: 20,
        });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading(false);
      });
  };

  // Main UI
  return (
    <>
      {" "}
      <PageTitle
        broadCrumb={[
          {
            title: "    ارسال کالا ",
            path: "/shippingSetting",
          },
          {
            title: "     شرکت حمل ",
            path: "/shipping-companies",
          },
        ]}
        title={` ${id ? "شرکت حمل ویرایش" : "شرکت حمل جدید"}`}
      />
      <div className="md:mx-3 mx-1">
        {loadingData ? (
          <Skeleton
            variant="rounded"
            height={600}
            animation="wave"
            width={"100%"}
          />
        ) : (
          <Paper
            sx={{
              border: "1px solid #dbdfea",
              mb: 1,
              padding: "15px 16px 50px 16px",
            }}
            elevation={0}
            className="relative"
          >
            {" "}
            <Section label="نکات مهم">
              <Stack spacing={1}>
                <Alert variant="outlined" severity="info">
                  در زمان استفاده از تیپاکس شهر و استان انتخاب شود محله انتخاب
                  نگردد
                </Alert>
                <Alert variant="outlined" severity="info">
                  در صورتی که نوع پرداخت "سمت گیرنده پس کرایه " و یا "سمت گیرنده
                  پرداخت در محل" بود به معنای تحویل وجه در محل می باشد و قیمت
                  ارسالی در چک اوت صفر میباشد.
                </Alert>
                <Alert variant="outlined" severity="info">
                  در صورتیکه که قیمت بر اساس مسافت روشن باشد می توانید محدوده
                  ارسال را با حداکثر کیلومتر قابل ارسال کنترل نمایید{" "}
        و در غیر اینصورت آیتم نوع تحویل در شهر کار خواهد کرد
        
                </Alert>
              </Stack>
            </Section>
            <Section label="مشخصات شرکت حمل">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextInput
                    label="نام شرکت حمل"
                    change={(e) => setAllData({ ...allData, title: e })}
                    currentValue={allData?.title}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput
                    label="هزینه اضافات"
                    change={(e) =>
                      setAllData({ ...allData, extraShippingCost: e })
                    }
                    currentValue={allData?.extraShippingCost || ""}
                    price
                    number
                    allowZero
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Dropdown
                    value={allShippingClass?.find(
                      (g) => g.id === allData?.shippingClassId
                    )}
                    change={(e) =>
                      setAllData({ ...allData, shippingClassId: e.id })
                    }
                    data={allShippingClass}
                    title="کلاس حمل و نقل"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput
                    label="تاخیر در ارسال"
                    change={(e) =>
                      setAllData({
                        ...allData,
                        delayedDelivery: e,
                        coworkerDelayedDelivery: "",
                      })
                    }
                    currentValue={allData?.delayedDelivery || ""}
                    number
                    price
                    priceLabel="روز"
                    allowZero
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput
                    label="تاخیر در ارسال همکار"
                    change={(e) =>
                      setAllData({ ...allData, coworkerDelayedDelivery: e })
                    }
                    currentValue={allData?.coworkerDelayedDelivery || ""}
                    number
                    price
                    priceLabel="ساعت"
                    allowZero
                    disabled={allData?.delayedDelivery}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Dropdown
                    title="استان"
                    data={province}
                    value={province?.find(
                      (item) => item.id === allData.provinceId
                    )}
                    change={(e) => {
                      setCities(e?.cities);
                      setAllData({ ...allData, provinceId: e?.id });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Dropdown
                    title="شهر / محله"
                    data={cities}
                    value={cities?.find((item) => item.id === allData.cityId)}
                    change={(e) => setAllData({ ...allData, cityId: e?.id })}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput
                    currentValue={allData?.tel}
                    change={(e) => setAllData({ ...allData, tel: e })}
                    label="تلفن"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput
                    currentValue={allData?.address}
                    change={(e) => setAllData({ ...allData, address: e })}
                    label="نشانی"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Section>
            <Section label="قیمت براساس مسافت">
              <Stack direction="row" alignItems="center" spacing={2}>
                <span className="text-xs">فعال سازی قیمت بر اساس مسافت</span>
                <Switch
                  onChange={() =>
                    setAllData({
                      ...allData,
                      useDistanceLogic: !allData?.useDistanceLogic,
                    })
                  }
                  checked={allData?.useDistanceLogic}
                />
              </Stack>
              {allData?.useDistanceLogic && (
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12} md={4}>
                    <TextInput
                      currentValue={
                        allData?.perKilometerPrice !== undefined
                          ? allData?.perKilometerPrice
                          : ""
                      }
                      change={(e) =>
                        setAllData({ ...allData, perKilometerPrice: e })
                      }
                      label="قیمت بر اساس کیلومتر"
                      price
                      number
                      allowZero
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextInput
                      currentValue={
                        allData?.extraCostForDistances !== undefined
                          ? allData?.extraCostForDistances
                          : ""
                      }
                      change={(e) =>
                        setAllData({ ...allData, extraCostForDistances: e })
                      }
                      label="قیمت پایه حمل و نقل"
                      price
                      number
                      allowZero
                      fullWidth
                    />
                  </Grid>{" "}
                  {allData.companyType === 0 && (
                    <Grid item xs={12} md={4}>
                      <TextInput
                        label="حداکثر کیلومتر قابل ارسال"
                        change={(e) =>
                          setAllData({ ...allData, maxSupportDistanceInKm: e })
                        }
                        currentValue={allData?.maxSupportDistanceInKm || ""}
                        fullWidth
                      />
                    </Grid>
                  )}
                </Grid>
              )}
            </Section>
            <Section label="بسته بندی">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextInput
                    label="هزینه بسته بندی"
                    change={(e) => setAllData({ ...allData, packagingCost: e })}
                    currentValue={allData?.packagingCost || ""}
                    price
                    number
                    allowZero
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <span className="text-xs">دارای ارزش افزوده بسته بندی</span>
                    <Switch
                      onChange={() =>
                        setAllData({
                          ...allData,
                          hasPackagingVat: !allData.hasPackagingVat,
                        })
                      }
                      checked={allData.hasPackagingVat}
                      disabled={!userPermissions?.gatewaySetting?.patch}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  {allData.hasPackagingVat && (
                    <TextInput
                      disabled={!allData.hasPackagingVat}
                      currentValue={allData.packagingVat}
                      change={(e) =>
                        setAllData({ ...allData, packagingVat: e })
                      }
                      label="درصد ارزش افزوده بسته بندی"
                      fullWidth
                    />
                  )}
                </Grid>
              </Grid>
            </Section>
            {allData.companyType === 0 && (
              <Section label="حمل و نقل">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <span className="text-xs">دارای ارزش افزوده</span>
                      <Switch
                        onChange={() =>
                          setAllData({ ...allData, hasVat: !allData.hasVat })
                        }
                        checked={allData.hasVat}
                        disabled={!userPermissions?.gatewaySetting?.patch}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {allData.hasVat && (
                      <TextInput
                        disabled={!allData.hasVat}
                        currentValue={allData.vat}
                        change={(e) => setAllData({ ...allData, vat: e })}
                        label="درصد ارزش افزوده"
                        fullWidth
                      />
                    )}
                  </Grid>
                </Grid>
              </Section>
            )}
            <Section label="تنظیمات پیشرفته">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Dropdown
                    value={TYPED[allData?.companyType]}
                    change={(e) =>
                      setAllData({
                        ...allData,
                        companyType: TYPED.findIndex((v) => v === e),
                        apiType: e === 1 ? null : allData.apiType,
                      })
                    }
                    data={TYPED || []}
                    title="تحویل حضوری"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput
                    label="تعداد روز های قابل انتخاب"
                    change={(e) => setAllData({ ...allData, comingDay: e })}
                    currentValue={allData?.comingDay || ""}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput
                    label="سقف بیمه مرسوله"
                    change={(e) =>
                      setAllData({ ...allData, maxInsurancePrice: e })
                    }
                    currentValue={allData?.maxInsurancePrice || ""}
                    price
                    number
                    allowZero
                    fullWidth
                  />
                </Grid>

                {allData.companyType === 0 && (
                  <Grid item xs={12} md={4}>
                    <Dropdown
                      data={TYPEC}
                      value={TYPEC?.find((item) => item.id === allData.apiType)}
                      change={(e) => setAllData({ ...allData, apiType: e?.id })}
                      title="نوع api"
                    />
                  </Grid>
                )}

                {allData.companyType === 0 && (
                  <>
                    <Grid item xs={12} md={4}>
                      <Dropdown
                        data={TYPES}
                        value={TYPES?.find(
                          (item) => item.id === allData.locationDeliveryType
                        )}
                        change={(e) =>
                          setAllData({
                            ...allData,
                            locationDeliveryType: e?.id,
                          })
                        }
                        title="نوع تحویل در شهر"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Dropdown
                        data={PackType}
                        value={PackType?.find(
                          (item) => item.id === allData.packType
                        )}
                        change={(e) =>
                          setAllData({ ...allData, packType: e?.id })
                        }
                        title="نوع بسته بندی"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Dropdown
                        data={PaymentType}
                        value={PaymentType?.find(
                          (item) => item.id === allData.paymentType
                        )}
                        change={(e) =>
                          setAllData({ ...allData, paymentType: e?.id })
                        }
                        title="نوع پرداخت"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Dropdown
                        data={PickupType}
                        value={PickupType?.find(
                          (item) => item.id === allData.pickupType
                        )}
                        change={(e) =>
                          setAllData({ ...allData, pickupType: e?.id })
                        }
                        title="نوع جمع آوری"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Dropdown
                        data={DistributionType}
                        value={DistributionType?.find(
                          (item) => item.id === allData.distributionType
                        )}
                        change={(e) =>
                          setAllData({ ...allData, distributionType: e?.id })
                        }
                        title="نوع تحویل"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Dropdown
                        data={ServiceId}
                        value={ServiceId?.find(
                          (item) => item.id === allData.serviceId
                        )}
                        change={(e) =>
                          setAllData({ ...allData, serviceId: e?.id })
                        }
                        title="نوع ارسال"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <span className="text-xs">
                          جزئیات اطلاعات فرستنده و گیرنده بر روی لیبل چاپ نشود
                        </span>
                        <Switch
                          onChange={() =>
                            setAllData({
                              ...allData,
                              enableLabelPrivacy: !allData?.enableLabelPrivacy,
                            })
                          }
                          checked={allData?.enableLabelPrivacy}
                        />
                      </Stack>
                    </Grid>
                  </>
                )}
              </Grid>
            </Section>
            <Section label="وضعیت شرکت حمل">
              <Grid container spacing={2}>
                <Grid item xs={12} md={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span className="text-xs">فعال/غیرفعال:</span>
                    <Switch
                      onChange={() =>
                        setAllData({ ...allData, active: !allData?.active })
                      }
                      checked={allData?.active}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span className="text-xs">پیش فرض:</span>
                    <Switch
                      onChange={() =>
                        setAllData({
                          ...allData,
                          isDefault: !allData?.isDefault,
                        })
                      }
                      checked={allData?.isDefault}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span className="text-xs">ارسال سریع:</span>
                    <Switch
                      onChange={() =>
                        setAllData({ ...allData, fastSend: !allData?.fastSend })
                      }
                      checked={allData?.fastSend}
                    />
                  </Stack>
                </Grid>{" "}
                <Grid item xs={12} md={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span className="text-xs">دارای کد تحویل:</span>
                    <Switch
                      onChange={() =>
                        setAllData({
                          ...allData,
                          hasDeliveryCode: !allData?.hasDeliveryCode,
                        })
                      }
                      checked={allData?.hasDeliveryCode}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span className="text-xs">ارسال در جمعه ها:</span>
                    <Switch
                      onChange={() =>
                        setAllData({ ...allData, isFriday: !allData?.isFriday })
                      }
                      checked={allData?.isFriday}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span className="text-xs">ارسال همه روزه:</span>
                    <Switch
                      onChange={() =>
                        setAllData({
                          ...allData,
                          isEveryDay: !allData?.isEveryDay,
                        })
                      }
                      checked={allData?.isEveryDay}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Section>
            <Section label="تصویر شرکت حمل">
              <UploadImage
                file={avatar}
                change={setAvatar}
                address={allData?.galleryId}
                selectedProductImage={selectedProductImage}
                setselectedProductImage={setselectedProductImage}
              />
            </Section>{" "}
            <Section label="توضیحات">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextInput
                    label="توضیحات داخل کارت"
                    change={(e) =>
                      setAllData({ ...allData, extraDescription: e })
                    }
                    currentValue={allData?.extraDescription || ""}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ direction: "ltr !important" }}>
                    <span className="text-xs">توضیحات (مودال)</span>
                    <Editor
                      tinymceScriptSrc="/js/tinymce/tinymce.min.js"
                      onEditorChange={(e) =>
                        setAllData({ ...allData, description: e })
                      }
                      value={allData?.description || ""}
                      init={{
                        menubar: false,
                        selector: "textarea#open-source-plugins",
                        plugins:
                          "print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen     codesample   hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount  textpattern noneditable  charmap  ",
                        imagetools_cors_hosts: ["picsum.photos"],
                        toolbar:
                          "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | ltr rtl",
                        toolbar_sticky: true,
                        autosave_ask_before_unload: true,
                        directionality: "rtl",
                        autosave_interval: "30s",
                        autosave_prefix: "{path}{query}-{id}-",
                        autosave_restore_when_empty: false,
                        autosave_retention: "2m",
                        importcss_append: true,
                        templates: [
                          {
                            title: "New Table",
                            description: "creates a new table",
                            content:
                              '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
                          },
                          {
                            title: "Starting my story",
                            description: "A cure for writers block",
                            content: "Once upon a time...",
                          },
                          {
                            title: "New list with dates",
                            description: "New List with dates",
                            content:
                              '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>',
                          },
                        ],
                        template_cdate_format:
                          "[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]",
                        template_mdate_format:
                          "[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]",
                        height: 300,
                        image_caption: true,
                        quickbars_selection_toolbar:
                          "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
                        noneditable_noneditable_class: "mceNonEditable",
                        toolbar_mode: "sliding",
                        skin: useDarkMode ? "oxide-dark" : "oxide",
                        content_css: useDarkMode ? "dark" : "default",
                        content_style:
                          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Section>{" "}
            <Section label="موقعیت جغرافیایی شرکت حمل و نقل">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextInput
                    currentValue={allData?.longitude}
                    change={(e) => setAllData({ ...allData, longitude: e })}
                    label="طول جغرافیایی"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput
                    currentValue={allData?.latitude}
                    change={(e) => setAllData({ ...allData, latitude: e })}
                    label="عرض جغرافیایی"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Map
                      onLocationSelect={(e) =>
                        handleSubmit(e.latitude, e.longitude)
                      }
                      longitude={allData.longitude}
                      latitude={allData.latitude}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Section>
            <Paper
              className="fixed bottom-0 justify-between left-3 right-[16.5rem] z-50 px-8 py-4 border-t"
              sx={{ display: "flex", mt: 2 }}
            >
              {userPermissions?.shippingCompany?.delete && id && (
                <IconButton onClick={() => setOpenDelete(true)}>
                  <Delete color="error" />
                </IconButton>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit()}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : <>ثبت اطلاعات</>}
              </Button>
            </Paper>
            <Confirm
              message="آیا از حذف این شرکت حمل اطمینان دارید؟"
              close={() => setOpenDelete(false)}
              submit={deleteItem}
              open={openDelete}
            />
          </Paper>
        )}
      </div>
    </>
  );
};

export default EditShippingCompanyModal;
