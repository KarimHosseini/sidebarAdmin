import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Skeleton,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import dayjs from "dayjs";
import momentJalaali from "moment-jalaali";
import { useEffect, useState } from "react";
import Resizer from "react-image-file-resizer";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PageTitle } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import PublicAttributesBundles from "../../components/groupProduct/publicStep";
import StepOneGroupProduct from "../../components/groupProduct/step1";
import Step2GroupProduct from "../../components/groupProduct/step2";
import Step3ProductGroup from "../../components/groupProduct/step3";
import Step4ProductGroup from "../../components/groupProduct/step4";
import { Confirm } from "../../components/modals";
import NoAccess from "../../components/noAccess";
import {
  ADD_PRODUCT_IMAGE,
  baseUrl,
  DELETE_BUNDLE_PRODUCT,
  EDIT_BUNDLE_PRODUCT,
  EDIT_MULTIPLE_PTODUCT_PUBLIC,
  GET_PTODUCT_PUBLIC,
  GET_SINGLE_BUNDLE_PRODUCT,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const EditProductBundle = () => {
  const [createdId, setCreatedId] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedPublics, setSelectedPublics] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const { token } = useSelector((state) => state.user);
  const [durations, setDuration] = useState("");
  const [timeStart, setTimeStart] = useState();
  const [timeEnd, setTimeEnd] = useState();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [startTime, setstartTime] = useState(momentJalaali());
  const [endTime, setendTime] = useState(momentJalaali());
  const { id } = useParams();
  const [duration2, setDuration2] = useState("");
  const [changedDate, setChangedDate] = useState(false);
  const [resizing, setresizing] = useState(false);

  const [createdName, setCreatedName] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [data, setData] = useState({
    seo: ' <title></title> \n <meta name="description" content=""/> \n <meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large"/> \n <link rel="canonical" href="" /> \n <meta property="og:locale" content="fa_IR" /> \n <meta property="og:type" content="article" /> \n <meta property="og:title" content="" /> \n <meta property="og:description" content="" /> \n <meta property="og:url" content="" /> \n <meta property="og:site_name" content="" /> \n <meta property="article:tag" content="" /> \n <meta property="article:section" content="" /> \n <meta property="og:updated_time" content="" /> \n <meta property="og:image" content="" /> \n <meta property="og:image:secure_url" content="" /> \n <meta property="og:image:width" content="" /> \n <meta property="og:image:height" content="" /> \n <meta property="og:image:alt" content="" /> \n <meta property="og:image:type" content="" /> \n <meta property="article:published_time" content="" /> \n <meta property="article:modified_time" content="" /> \n <meta name="twitter:card" content="" /> \n <meta name="twitter:title" content="" /> \n <meta name="twitter:description" content="" /> \n <meta name="twitter:image" content="" /> \n <meta name="twitter:label1" content="" /> \n <meta name="twitter:data1" content="" /> \n <meta name="twitter:label2" content="" /> \n <meta name="twitter:data2" content="" /> \n ',
    active: false,
    files: [],
    selectedProductImage: [],
  });
  const addProductSteps = [
    "تعریف محصول",
    "   انتخاب محصول ",

    "   قیمت گذاری و تنظیمات  اصلی",
    " ویژگیهای عمومی    ",
    "    بازه زمانی",
  ];
  useEffect(() => {
    setLoading1(true);
    axiosInstance(
      `${baseUrl}/${GET_SINGLE_BUNDLE_PRODUCT}?id=${id}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading1(false);
        setData({
          ...res?.data?.data,
          minBuy: res?.data?.data?.property?.minBuy,
          maxBuy: res?.data?.data?.property?.maxBuy,
          Supplier: res?.data?.data?.supplierId,
        });
        var temp = [];
        res?.data?.data?.bundles?.map((item) =>
          temp.push({
            ...item,
            ...item?.property,
            productAttribute: item?.property.arrtib1,
            productAttribute2: item?.property.arrtib2,
          })
        );
        if (data?.data?.bundleFromDate) {
          let string = new Date(data?.data?.bundleFromDate).toLocaleDateString(
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
        if (data?.data?.bundleToDate) {
          let string = new Date(data?.data?.bundleToDate).toLocaleDateString(
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

        setSelectedProducts(temp);
      })
      .catch((err) => {
        setLoading1(false);
      });
    axiosInstance(
      `${baseUrl}/${GET_PTODUCT_PUBLIC}?productId=${id}`,
      configReq(token)
    )
      .then((res) => {
        setSelectedPublics(res.data.data);
      })
      .catch((err) => {});
  }, [id]);
  useEffect(() => {
    if (changedDate) {
      var startDate = data?.bundleFromDate
        ? dayjs(new Date(data?.bundleFromDate))
        : new Date();
      var endDate = data?.bundleToDate
        ? dayjs(new Date(data?.bundleToDate))
        : new Date();
      var date = { startTime: new Date(), endDate: new Date() };
      if (startTime) {
        date = {
          ...date,
          bundleFromDate: toIsoString(
            startTime?._d,
            timeStart
              ? timeStart.$H.toString().padStart(2, 0)
              : dayjs(new Date(data?.bundleFromDate))
                  .$H.toString()
                  .padStart(2, 0),
            timeStart
              ? timeStart.$m.toString().padStart(2, 0)
              : dayjs(new Date(data?.bundleFromDate))
                  .$m.toString()
                  .padStart(2, 0)
          ),
        };

        startDate = toIsoString(
          startTime?._d,
          timeStart
            ? timeStart.$H.toString().padStart(2, 0)
            : dayjs(new Date(data?.bundleFromDate))
                .$H.toString()
                .padStart(2, 0),
          timeStart
            ? timeStart.$m.toString().padStart(2, 0)
            : dayjs(new Date(data?.bundleFromDate)).$m.toString().padStart(2, 0)
        );
      }
      if (endTime) {
        date = {
          ...date,
          bundleToDate: toIsoString(
            endTime?._d,
            timeEnd
              ? timeEnd.$H.toString().padStart(2, 0)
              : dayjs(new Date(data?.bundleToDate))
                  .$H.toString()
                  .padStart(2, 0),
            timeEnd
              ? timeEnd.$m.toString().padStart(2, 0)
              : dayjs(new Date(data?.bundleToDate)).$m.toString().padStart(2, 0)
          ),
        };

        endDate = toIsoString(
          endTime?._d,
          timeEnd
            ? timeEnd.$H.toString().padStart(2, 0)
            : dayjs(new Date(data?.bundleToDate)).$H.toString().padStart(2, 0),
          timeEnd
            ? timeEnd.$m.toString().padStart(2, 0)
            : dayjs(new Date(data?.bundleToDate)).$m.toString().padStart(2, 0)
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

      const diffInMs2 = Math.abs(new Date(data?.bundleToDate) - new Date());
      const days2 = Math.floor(diffInMs2 / (1000 * 60 * 60 * 24));
      const hours2 = Math.floor(
        (diffInMs2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes2 = Math.floor((diffInMs2 % (1000 * 60 * 60)) / (1000 * 60));
      var remainingTime2 = "";
      if (new Date(data?.bundleToDate) < new Date()) {
        remainingTime2 = `${0} روز, ${0} ساعت, ${0} دقیقه`;
      } else {
        remainingTime2 = `${days2} روز, ${hours2} ساعت, ${minutes2} دقیقه`;
      }

      setDuration2(remainingTime2);
    } else {
      const diffInMs = Math.abs(
        new Date(data?.bundleFromDate) - new Date(data?.bundleToDate)
      );
      const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

      const remainingTime = `${days} روز, ${hours} ساعت, ${minutes} دقیقه`;
      if (remainingTime) setDuration(remainingTime);

      const diffInMs2 = Math.abs(new Date(data?.bundleToDate) - new Date());
      const days2 = Math.floor(diffInMs2 / (1000 * 60 * 60 * 24));
      const hours2 = Math.floor(
        (diffInMs2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes2 = Math.floor((diffInMs2 % (1000 * 60 * 60)) / (1000 * 60));
      var remainingTime2 = "";
      if (new Date(data?.bundleToDate) < new Date()) {
        remainingTime2 = `${0} روز, ${0} ساعت, ${0} دقیقه`;
      } else {
        remainingTime2 = `${days2} روز, ${hours2} ساعت, ${minutes2} دقیقه`;
      }

      setDuration2(remainingTime2);
    }
  }, [timeStart, timeEnd, endTime, startTime]);
  const handleChange = (newValue) => {
    setTimeStart(newValue);
  };
  const handleChangeEnd = (newValue) => {
    setTimeEnd(newValue);
  };

  const submitImages = async () => {
    try {
      const totalItems =
        (data.files?.length || 0) + (data.selectedProductImage?.length || 0);
      let completedItems = 0;
      setIsUploading(true);
      setUploadProgress(0);

      if (data.files?.length > 0) {
        var resizedFiles = [];
        for (let x = 0; x < data.files.length; x++) {
          if (
            data.files[x].type === "image/svg+xml" ||
            data.files[x].type === "image/gif" ||
            !resizing
          ) {
            resizedFiles.push(data.files[x]);
          } else {
            const resizedFile = await new Promise((resolve) => {
              Resizer.imageFileResizer(
                data.files[x],
                1000,
                1000,
                "webp",
                80,
                0,
                (uri) => {
                  resolve(uri);
                },
                "blob"
              );
            });
            resizedFiles.push(resizedFile);
          }
        }

        for (let i = 0; i < resizedFiles.length; i++) {
          const file = resizedFiles[i];
          const originalFile = data.files[i];
          let fd = new FormData();
          fd.append("productId", id);

          if (
            originalFile.type === "image/svg+xml" ||
            originalFile.type === "image/gif"
          ) {
            fd.append(
              "files",
              file,
              originalFile.name?.split(".")[0] +
                (originalFile.type === "image/svg+xml" ? ".svg" : ".gif")
            );
          } else if (!resizing) {
            fd.append("files", file);
          } else {
            fd.append(
              "files",
              file,
              originalFile.name?.split(".")[0] + ".webp"
            );
          }

          await axiosInstance.post(
            `${baseUrl}/${ADD_PRODUCT_IMAGE}`,
            fd,
            configReq(token)
          );

          completedItems++;
          setUploadProgress(Math.round((completedItems / totalItems) * 100));
        }
      }

      if (data.selectedProductImage?.length > 0) {
        for (let i = 0; i < data.selectedProductImage.length; i++) {
          let fd = new FormData();
          fd.append("productId", id);
          const imageId = data.selectedProductImage[i];
          fd.append("fromGallery", imageId.id);

          await axiosInstance.post(
            `${baseUrl}/${ADD_PRODUCT_IMAGE}`,
            fd,
            configReq(token)
          );

          completedItems++;
          setUploadProgress(Math.round((completedItems / totalItems) * 100));
        }
      }

      setIsUploading(false);
      toast.success("تمامی تصاویر با موفقیت ثبت شدند");
      navigate("/groupProduct");
    } catch (error) {
      setIsUploading(false);
      toast.error(error.response?.data?.message);
    }
  };

  const handleSumbit = async () => {
    var temp = [];
    setLoading(true);
    selectedProducts?.map((item) => {
      temp.push({
        propertyId: item?.id,
        num: item?.num,
        showStock: item?.showStock,
        showPrice: item?.showPrice,
        showProperty: item?.showProperty,
        isGroup: item?.isGroup,
        /*       FixPrice: item?.FixPrice, */
        /*       PercentDiscount: item?.PercentDiscount, */
        priceAmount: item?.priceAmount,
        bundleType: item?.bundleType,
      });
    });
    let fd = new FormData();
    fd.append("weightWithPackage", data.weightWithPackage);
    fd.append("totalLength", data.totalLength);
    fd.append("totalWidth", data.totalWidth);
    fd.append("totalDepth", data.totalDepth);
    fd.append("slug", data.slug);
    fd.append("weight", Number(String(data?.weight).replace(/,/g, "")));
    fd.append("title", data?.title);
    fd.append("id", id);
    fd.append("brandId", data?.brandId);
    fd.append("code", data?.code);
    fd.append("categoryiId", data?.categoryiId);
    fd.append("bundleQty", data?.bundleQty);
    fd.append("minBuy", data?.minBuy);
    fd.append("maxBuy", data?.maxBuy);
    fd.append("bundleCustomWeight", data?.bundleCustomWeight ? true : false);
    fd.append("active", data?.active ? true : false);
    if (data?.bundleFromDate) fd.append("bundleFromDate", data?.bundleFromDate);
    if (data?.bundleToDate) fd.append("bundleToDate", data?.bundleToDate);
    fd.append("bundles", JSON?.stringify(temp));
    fd.append("timedBundle", data?.timedBundle);
    fd.append("hasSaleAbility", data?.hasSaleAbility ? true : false);

    fd.append("description", data?.description);
    fd.append("seo", data?.seo /* .replace(/[\r\n]/gm, "") */);

    try {
      await axiosInstance.put(
        `${baseUrl}/${EDIT_BUNDLE_PRODUCT}`,
        fd,
        configReq(token)
      );
      toast.success("با موفقیت ویرایش شد");

      if (selectedPublics?.length > 0) {
        await submitPublicAttrsLoop(id);
      }

      if (data?.selectedProductImage?.length > 0 || data?.files?.length > 0) {
        await submitImages();
      } else {
        setLoading(false);
        navigate("/groupProduct");
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
      setLoading(false);
    }
  };
  const deleteProduct = () => {
    setLoading(true);
    axiosInstance
      .delete(`${baseUrl}/${DELETE_BUNDLE_PRODUCT}?id=${id}`, configReq(token))
      .then((res) => {
        setLoading(false);
        setConfirmDelete(false);
        navigate("/groupProduct");
        toast.success("با موفقیت حذف شد");
      })
      .catch((err) => {
        setLoading(false);
        setConfirmDelete(false);
        toast.error(err.response?.data?.message);
      });
  };
  const submitPublicAttrsLoop = async (id) => {
    var temp = [];
    selectedPublics.map((item) => {
      temp.push({
        publicAttributeId: item.publicAttributeId,
        value: item.value,
      });
    });
    axiosInstance
      .put(
        `${baseUrl}/${EDIT_MULTIPLE_PTODUCT_PUBLIC}`,
        { productId: id, publicAttributes: JSON.stringify(temp) },
        configReq(token)
      )
      .then((res) => {})
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };

  if (!userPermissions?.bundle?.update) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        title={`ویرایش  ${data?.title}`}
        broadCrumb={[
          {
            title: "مدیریت محصولات",
            path: "/products",
          },
          {
            title: "محصولات تجمیعی",
            path: "/groupProduct",
          },
        ]}
      />
      <div className="px-3 biggerButton">
        <Box
          sx={{
            width: "100%",
            my: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Stepper
            activeStep={currentStep - 1}
            alternativeLabel
            sx={{
              direction: "ltr",
              mb: 2,
              width: "100%",
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? "#fff"
                  : theme.palette.background.paper,
            }}
            className=" rounded-lg border border-[#dbdfea] py-3"
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
          <>
            {currentStep === 1 && (
              <>
                <div className="flex justify-between flex-wrap gap-5 w-full border-b border-dashed mb-3 pb-3 items-center">
                  <div>
                    {userPermissions?.bundle?.delete && (
                      <>
                        {" "}
                        <IconButton
                          size="medium"
                          color="error"
                          onClick={() => setConfirmDelete(true)}
                        >
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-bold">
                      ویرایش {data?.title}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {" "}
                    <Button
                      target={"_blank"}
                      href={
                        process.env.REACT_APP_DOMAIN_URL +
                        `/products/${id}/${data?.slug}`
                      }
                      variant="outlined"
                    >
                      مشاهده محصول
                    </Button>{" "}
                    <Button
                      onClick={() => setCurrentStep(2)}
                      variant="contained"
                    >
                      مرحله بعد
                    </Button>
                  </div>
                </div>
                <Paper
                  elevation={0}
                  className="rounded-lg  border-[#dbdfea] border w-full py-6 md:px-5 px-2 flex flex-col gap-6"
                >
                  {loading1 ? (
                    <div className="grid md:grid-cols-3 gap-4">
                      <Skeleton variant="rounded" width={"100%"} height={50} />
                      <Skeleton variant="rounded" width={"100%"} height={50} />
                      <Skeleton variant="rounded" width={"100%"} height={50} />
                    </div>
                  ) : (
                    <StepOneGroupProduct
                      data={data}
                      editModa={true}
                      setData={setData}
                      error={error}
                      loading={loading1}
                      submitHandler={() => setCurrentStep(2)}
                      resizing={resizing}
                      setresizing={setresizing}
                    />
                  )}
                </Paper>
              </>
            )}
            {currentStep === 2 && (
              <>
                <div className="flex justify-between flex-wrap gap-5 w-full border-b border-dashed mb-3 pb-3 items-center">
                  <Button onClick={() => setCurrentStep(1)} variant="contained">
                    مرحله قبل
                  </Button>
                  <div>
                    <span className="text-sm font-bold">انتخاب محصول</span>
                  </div>
                  <Button
                    disabled={selectedProducts?.length === 0}
                    onClick={() => setCurrentStep(3)}
                    variant="contained"
                  >
                    مرحله بعد
                  </Button>
                </div>
                <Paper
                  elevation={0}
                  className="rounded-lg  border-[#dbdfea] border w-full py-6 md:px-5 px-2 flex flex-col gap-6"
                >
                  <Step2GroupProduct
                    nextStep={() => setCurrentStep(3)}
                    selectedProducts={selectedProducts}
                    setSelectedProducts={setSelectedProducts}
                    data={data}
                    setData={setData}
                  />
                </Paper>
                <div className="flex justify-between w-full my-5 items-center">
                  <Button onClick={() => setCurrentStep(1)} variant="outlined">
                    بازگشت
                  </Button>
                  <Button onClick={() => setCurrentStep(3)} variant="contained">
                    مرحله بعد
                  </Button>
                </div>
              </>
            )}
            {currentStep === 3 && (
              <>
                <div className="flex justify-between flex-wrap gap-5 w-full border-b border-dashed mb-3 pb-3 items-center">
                  <Button onClick={() => setCurrentStep(2)} variant="contained">
                    مرحله قبل
                  </Button>
                  <div>
                    <span className="text-sm font-bold">
                      {" "}
                      قیمت گذاری و تنظیمات
                    </span>
                  </div>
                  <Button onClick={() => setCurrentStep(4)} variant="contained">
                    مرحله بعد
                  </Button>
                </div>
                <Step3ProductGroup
                  selectedProducts={selectedProducts}
                  setSelectedProduct={setSelectedProducts}
                  data={data}
                  setData={setData}
                  editMode={true}
                />
              </>
            )}{" "}
            {currentStep === 4 && (
              <>
                <div className="flex justify-between flex-wrap gap-5 w-full border-b border-dashed mb-3 pb-3 items-center">
                  <Button onClick={() => setCurrentStep(3)} variant="contained">
                    مرحله قبل
                  </Button>
                  <div>
                    <span className="text-sm font-bold">ویژگیهای عمومی</span>
                  </div>
                  <Button onClick={() => setCurrentStep(5)} variant="contained">
                    مرحله بعد
                  </Button>
                </div>
                <PublicAttributesBundles
                  selectedPublics={selectedPublics}
                  setSelectedPublics={setSelectedPublics}
                />
              </>
            )}
            {currentStep === 5 && (
              <>
                <div className="flex justify-between flex-wrap gap-5 w-full border-b border-dashed mb-3 pb-3 items-center">
                  <Button onClick={() => setCurrentStep(4)} variant="contained">
                    مرحله قبل
                  </Button>
                  <div>
                    <span className="text-sm font-bold">
                      {" "}
                      قیمت ، تعداد و تنظیمات
                    </span>
                  </div>
                  <Button
                    onClick={handleSumbit}
                    variant="contained"
                    color="success"
                    disabled={loading || isUploading}
                  >
                    {loading || isUploading ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1 }} />
                        {isUploading && `${uploadProgress}%`}
                      </>
                    ) : (
                      <> تایید و ثبت</>
                    )}
                  </Button>
                </div>
                <Step4ProductGroup
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
                />
              </>
            )}
          </>
        </Box>
      </div>

      <Confirm
        message="آیا از حذف این محصول اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteProduct}
        open={confirmDelete}
      />
    </>
  );
};

export default EditProductBundle;
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
