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
import Resizer from "react-image-file-resizer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PageTitle } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import PublicAttributesBundles from "../../components/groupProduct/publicStep";
import StepOneGroupProduct from "../../components/groupProduct/step1";
import Step2GroupProduct from "../../components/groupProduct/step2";
import Step3ProductGroup from "../../components/groupProduct/step3";
import Step4ProductGroup from "../../components/groupProduct/step4";
import NoAccess from "../../components/noAccess";
import {
  ADD_PRODUCT_IMAGE,
  baseUrl,
  CREATE_BUNDLE_PRODUCT,
  EDIT_MULTIPLE_PTODUCT_PUBLIC,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const CreateProductGroup = () => {
  const [loading1, setLoading1] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const [startTimeD, setStartTimeD] = useState();
  const [endTimeD, setendTimeD] = useState();
  const [createdName, setCreatedName] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [resizing, setresizing] = useState(false);
  const [selectedPublics, setSelectedPublics] = useState([]);
  const [createdId, setCreatedId] = useState(null);

  const [data, setData] = useState({
    seo: ' <title></title> \n <meta name="description" content=""/> \n <meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large"/> \n <link rel="canonical" href="" /> \n <meta property="og:locale" content="fa_IR" /> \n <meta property="og:type" content="article" /> \n <meta property="og:title" content="" /> \n <meta property="og:description" content="" /> \n <meta property="og:url" content="" /> \n <meta property="og:site_name" content="" /> \n <meta property="article:tag" content="" /> \n <meta property="article:section" content="" /> \n <meta property="og:updated_time" content="" /> \n <meta property="og:image" content="" /> \n <meta property="og:image:secure_url" content="" /> \n <meta property="og:image:width" content="" /> \n <meta property="og:image:height" content="" /> \n <meta property="og:image:alt" content="" /> \n <meta property="og:image:type" content="" /> \n <meta property="article:published_time" content="" /> \n <meta property="article:modified_time" content="" /> \n <meta name="twitter:card" content="" /> \n <meta name="twitter:title" content="" /> \n <meta name="twitter:description" content="" /> \n <meta name="twitter:image" content="" /> \n <meta name="twitter:label1" content="" /> \n <meta name="twitter:data1" content="" /> \n <meta name="twitter:label2" content="" /> \n <meta name="twitter:data2" content="" /> \n ',
    active: false,
    files: [],
    selectedProductImage: [],
    bundleQty: 1,
    minBuy: 0,
    maxBuy: 1,
  });
  const addProductSteps = [
    "تعریف محصول",
    "   انتخاب محصول ",

    "   قیمت گذاری و تنظیمات  اصلی",
    " ویژگیهای عمومی    ",
    "    بازه زمانی",
  ];
  const submit = (e) => {
    e.preventDefault();

    if (!data?.title) {
      toast.error("نام محصول را وارد کنید");
      setError("title");
      scrollToTop();
    } else if (!data?.brandId) {
      toast.error("برند محصول را وارد کنید");
      setError("brand");
      scrollToTop();
    } else if (!data?.categoryiId) {
      toast.error("دسته بندی محصول را وارد کنید");
      setError("category");
      scrollToTop();
    } else if (!data?.code) {
      toast.error("کد محصول را وارد کنید");
      setError("code");
      scrollToTop();
    } else if (!data?.Supplier) {
      toast.error("تامین کننده  را وارد کنید");
      setError("Supplier");
      scrollToTop();
    } else {
      setError("");
      setCurrentStep(2);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    var startDate = new Date();
    var endDate = new Date();
    var date = { startTime: new Date(), endDate: new Date() };
    if (startTime) {
      date = {
        ...date,
        bundleFromDate: toIsoString(
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
        bundleToDate: toIsoString(
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

    /*     setDuration2(remainingTime 2);
     */
  }, [timeStart, timeEnd, endTime, startTime]);
  const handleChange = (newValue) => {
    setTimeStart(newValue);
  };
  const handleChangeEnd = (newValue) => {
    setTimeEnd(newValue);
  };

  const submitImages = async (productId) => {
    try {
      const totalItems = (data.files?.length || 0) + (data.selectedProductImage?.length || 0);
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
          fd.append("productId", productId);
          
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
          fd.append("productId", productId);
          const imageId = data.selectedProductImage[i];
          fd.append("fromGallery", imageId.id || imageId);
          
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
        isGroup: item?.isGroup ? true : false,
        /*       FixPrice: item?.FixPrice, */
        /*       PercentDiscount: item?.PercentDiscount, */
        priceAmount: item?.priceAmount,
        bundleType: item?.bundleType,
      });
    });
    
    try {
      let fd = new FormData();
      fd.append("weightWithPackage", data.weightWithPackage);
      fd.append("totalLength", data.totalLength);
      fd.append("totalWidth", data.totalWidth);
      fd.append("totalDepth", data.totalDepth);
      fd.append("slug", data.slug);
      
      if (data?.weight)
        fd.append("weight", Number(String(data?.weight).replace(/,/g, "")));
      fd.append("title", data?.title);
      fd.append("brandId", data?.brandId);
      fd.append("code", data?.code);
      fd.append("categoryiId", data?.categoryiId);
      fd.append("bundleQty", data?.bundleQty);
      fd.append("bundleCustomWeight", data?.bundleCustomWeight ? true : false);
      fd.append("minBuy", data?.minBuy);
      fd.append("maxBuy", data?.maxBuy);
      fd.append("Supplier", data?.Supplier);
      fd.append("hasSaleAbility", data?.hasSaleAbility ? true : false);
      fd.append("timedBundle", data?.timedBundle ? true : false);
      
      fd.append("active", data?.active ? true : false);
      if (data?.bundleFromDate) fd.append("bundleFromDate", data?.bundleFromDate);
      if (data?.bundleToDate) fd.append("bundleToDate", data?.bundleToDate);
      fd.append("bundles", JSON?.stringify(temp));
      fd.append("description", data?.description);
      fd.append("seo", data?.seo);
      
      const response = await axiosInstance.post(
        `${baseUrl}/${CREATE_BUNDLE_PRODUCT}`, 
        fd, 
        configReq(token)
      );
      
      const productId = response?.data?.data?.id;
      setCreatedId(productId);
      
      toast.success("محصول با موفقیت ساخته شد");
      
      if (selectedPublics?.length > 0) {
        await submitPublicAttrsLoop(productId);
      }
      
      if ((data.files?.length > 0) || (data.selectedProductImage?.length > 0)) {
        await submitImages(productId);
      } else {
        setLoading(false);
        navigate("/groupProduct");
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
      setLoading(false);
    }
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
  if (!userPermissions?.bundle?.insert) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        title={
          currentStep === 1
            ? "افزودن محصول تجمیعی"
            : `ثبت ${addProductSteps[currentStep - 1]} ${createdName}`
        }
        broadCrumb={[
          {
            title: "مدیریت محصولات",
            path: "/products",
          },
          {
            title: "محصولات",
            path: "/products",
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
                  <div></div>
                  <div>
                    <span className="text-sm font-bold">افزودن محصول</span>
                  </div>
                  <Button onClick={submit} variant="contained">
                    مرحله بعد
                  </Button>
                </div>
                <Paper
                  elevation={0}
                  className="rounded-lg  border-[#dbdfea] border w-full py-6 md:px-5 px-2 flex flex-col gap-6"
                >
                  <StepOneGroupProduct
                    resizing={resizing}
                    setresizing={setresizing}
                    data={data}
                    setData={setData}
                    error={error}
                    loading={loading1}
                    submitHandler={submit}
                  />
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
                />
              </>
            )}
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
                    <span className="text-sm font-bold">بازه زمانی</span>
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
                  durations={durations}
                  startTime={startTime}
                  setstartTime={setstartTime}
                  handleChange={handleChange}
                  endTime={endTime}
                  setendTime={setendTime}
                  handleChangeEnd={handleChangeEnd}
                  data={data}
                  setData={setData}
                />
              </>
            )}
          </>
        </Box>
      </div>
    </>
  );
};

export default CreateProductGroup;
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
