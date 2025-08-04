/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Resizer from "react-image-file-resizer";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import {
  baseUrl,
  BRANDS,
  CATEGORIES,
  CREATE_PRODUCT,
  suppliers,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import { logout } from "../../../redux/slices/user";
import {
  Dropdown,
  Loading,
  MultipleImages,
  TextEditor,
  TextInput,
} from "../../common";
import CategoryBrands from "../../common/CategoryBrands";
import axiosInstance from "../../dataFetch/axiosInstance";

const StepOne = ({ nextStep, setCreatedId, setCreatedName }) => {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const { brands, categories } = useSelector((state) => state.relationals);
  const { companyInfo } = useSelector((state) => state.relationals);

  const [selectedProductImage, setselectedProductImage] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [showingCats, setShowingCats] = useState([]);
  const [showingBrands, setShowingBrands] = useState([]);
  const [catSearchWord, setCatSearchWord] = useState("");
  const [brandSearchWord, setBrandSearchWord] = useState("");
  const [brand, setBrand] = useState(null);
  const [category, setCategory] = useState("");
  const [productCode, setProductCode] = useState("");
  const [active, setActive] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);

  const [resizing, setresizing] = useState(false);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  /*   const [seo, setSeo] = useState(
    ' <title></title> \n <meta name="description" content=""/> \n <meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large"/> \n <link rel="canonical" href="" /> \n <meta property="og:locale" content="fa_IR" /> \n <meta property="og:type" content="article" /> \n <meta property="og:title" content="" /> \n <meta property="og:description" content="" /> \n <meta property="og:url" content="" /> \n <meta property="og:site_name" content="" /> \n <meta property="article:tag" content="" /> \n <meta property="article:section" content="" /> \n <meta property="og:updated_time" content="" /> \n <meta property="og:image" content="" /> \n <meta property="og:image:secure_url" content="" /> \n <meta property="og:image:width" content="" /> \n <meta property="og:image:height" content="" /> \n <meta property="og:image:alt" content="" /> \n <meta property="og:image:type" content="" /> \n <meta property="article:published_time" content="" /> \n <meta property="article:modified_time" content="" /> \n <meta name="twitter:card" content="" /> \n <meta name="twitter:title" content="" /> \n <meta name="twitter:description" content="" /> \n <meta name="twitter:image" content="" /> \n <meta name="twitter:label1" content="" /> \n <meta name="twitter:data1" content="" /> \n <meta name="twitter:label2" content="" /> \n <meta name="twitter:data2" content="" /> \n '
  ); */

  const [weight, setWeight] = useState("");
  const [supplier, setSupplier] = useState("");
  const [supplierData, setSupplierData] = useState([]);
  const [newData, setNewData] = useState({});
  const [slug, setSlug] = useState("");

  useEffect(() => {
    if (brands.length === 0 || categories.length === 0) {
      axiosInstance(
        `${baseUrl}/${BRANDS}?Page=${1}&Limit=${2000}`,
        configReq(token)
      )
        .then((res) => {
          const { data } = res;
          setShowingBrands(data?.data);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
      axiosInstance(
        `${baseUrl}/${CATEGORIES}?Page=${1}&Limit=${2000}`,
        configReq(token)
      )
        .then((res) => {
          const { data } = res;
          setShowingCats(data?.data);
          setCategory(data?.data[0]);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
    } else {
      setShowingBrands(brands);
      setShowingCats(categories);
      setCategory(categories[0]);
    }
  }, [categories, brands]);
  useEffect(() => {
    axiosInstance(
      `${baseUrl}/${suppliers}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        if (data.code === 200) {
          setSupplierData(data.data);
          setSupplier(data.data[0]);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  }, []);

  useEffect(() => {
    const notFilteredRows = [...categories];
    let afterFilterRows = notFilteredRows.filter((row) =>
      row.title.toLowerCase().includes(catSearchWord.toLowerCase())
    );

    setShowingCats(afterFilterRows);
  }, [catSearchWord, categories]);

  useEffect(() => {
    const notFilteredRows = [...brands];
    let afterFilterRows = notFilteredRows.filter((row) =>
      row.title.toLowerCase().includes(catSearchWord.toLowerCase())
    );
    setShowingBrands(afterFilterRows);
  }, [brandSearchWord, brands]);

  const submit = async (e) => {
    e.preventDefault();
    var fromGallery = "";
    selectedProductImage.map((item) => {
      fromGallery += `,${item}`;
    });
    if (!title) {
      toast.error("نام محصول را وارد کنید");
      setError("title");
      scrollToTop();
    }
    if (!slug) {
      toast.error("نشانی محصول را وارد کنید");
      setError("slug");
      scrollToTop();
    } else if (!weight) {
      toast.error("وزن خالص را وارد کنید");
      setError("weight");
      scrollToTop();
    } else if (!newData.weightWithPackage) {
      toast.error("وزن با بسته بندی  را وارد کنید");
      setError("weightWithPackage");
      scrollToTop();
    } else if (!newData.height) {
      toast.error("ارتفاع محصول را وارد کنید");
      setError("height");
      scrollToTop();
    } else if (!newData.width) {
      toast.error("عرض محصول را وارد کنید");
      setError("width");
      scrollToTop();
    } else if (!newData.length) {
      toast.error("طول محصول را وارد کنید");
      setError("length");
      scrollToTop();
    } else if (!brand) {
      toast.error("برند محصول را وارد کنید");
      setError("brand");
      scrollToTop();
    } /* else if (!productCode) {
      toast.error("کد ویژگی را وارد کنید");
      setError("productCode");
      scrollToTop();
    } */ else if (!category) {
      toast.error("دسته بندی محصول را وارد کنید");
      setError("category");
      scrollToTop();
    } else {
      let fd = new FormData();

      fd.append("weight", Number(String(weight).replace(/,/g, "")));
      fd.append("title", title);
      fd.append("weightWithPackage", newData.weightWithPackage);
      fd.append("length", newData.length);
      fd.append("width", newData.width);
      fd.append("height", newData.height);
      fd.append("isFake", Boolean(newData.isFake));
      fd.append("brandId", brand?.id);
      fd.append("code", productCode);
      fd.append("categoryiId", category?.id);
      fd.append("active", active);
      fd.append("comingSoon", comingSoon);

      fd.append("slug", slug.replace(/\s+/g, "-"));
      fd.append("shortDescription", newData?.shortDescription);
      if (supplier) {
        fd.append("Supplier", supplier?.id);
      }

      if (fromGallery !== "") fd.append("fromGallery", fromGallery.slice(1));

      fd.append("description", description);
      /*       fd.append("seo", seo.replace(/[\r\n]/gm, ""));
       */ if (files?.length > 0) {
        var resizedFiles = [];
        for (let x = 0; x < files.length; x++) {
          if (
            files[x].type === "image/svg+xml" ||
            files[x].type === "image/gif" ||
            !resizing
          ) {
            resizedFiles.push(files[x]);
          } else {
            const resizedFile = await new Promise((resolve) => {
              Resizer.imageFileResizer(
                files[x],
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

        resizedFiles.forEach((file, index) => {
          if (
            files[index].type === "image/svg+xml" ||
            files[index].type === "image/gif"
          ) {
            fd.append(
              "files",
              file,
              files[index].name?.split(".")[0] +
                (files[index].type === "image/svg+xml" ? ".svg" : ".gif")
            );
          } else if (!resizing) {
            fd.append("files", file, files[index].name);
          } else {
            fd.append(
              "files",
              file,
              files[index].name?.split(".")[0] + ".webp"
            );
          }
        });
      }

      setError();
      setLoading(true);
      axiosInstance
        .post(`${baseUrl}/${CREATE_PRODUCT}`, fd, configReq(token))
        .then((res) => {
          setLoading(false);
          if (res.data.code === 200) {
            toast.success("با موفقیت اضافه شد");
            setCreatedId(res.data.data.id);
            setCreatedName(title);
            nextStep();
          } else {
            toast.error("مشکلی در درخواست شما وجود دارد");
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading(false);

          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <form className="flex flex-col gap-3">
      {loading && <Loading />}
      <Typography variant="body2" className="text-[#262626]">
        اطلاعات کالای جدید را تکمیل نمائید.
      </Typography>
      <Divider sx={{ borderStyle: "dashed !important" }} />
      <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 gap-x-8 gap-y-4">
        <div className="lg:col-span-2 md:col-span-2">
          {" "}
          <TextInput
            label="عنوان محصول"
            change={(e) => {
              setTitle(e);
              setNewData({ ...newData, shortDescription: e });
            }}
            currentValue={title}
          />
        </div>
        <div className="lg:col-span-2 md:col-span-2 leftInput">
          {" "}
          <TextInput
            label="نشانی محصول"
            change={setSlug}
            currentValue={slug}
            err={error === "slug"}
          />
        </div>

        {userPermissions?.product?.updateEditActive && (
          <Box className="flex items-center">
            <span style={{ fontFamily: "IRANSansFa" }}>فعال/غیر فعال:</span>
            <Switch checked={active} onChange={() => setActive(!active)} />
          </Box>
        )}
      </div>

      <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 gap-x-8 gap-y-4">
        <TextInput
          label="کد تجاری کالا"
          change={setProductCode}
          currentValue={productCode}
          err={error === "productCode"}
        />
        <TextField
          label="وزن خالص  (گرم)"
          onChange={(e) => setWeight(e.target.value)}
          value={weight}
          type="number"
          onInput={(e) => {
            e.target.value = e.target.value
              .replace(/[^0-9]/g, "")
              .replace(/(\..*?)\..*/g, "$1");
          }}
          onBlur={(e) => {
            if (
              newData.weightWithPackage &&
              Number(newData.weightWithPackage) < Number(e.target.value)
            ) {
              setError("weight");
              toast.error("وزن با بسته بندی باید از وزن خالص بیشتر باشد");
            } else {
              setError("");
            }
          }}
          error={error === "weight"}
        />
        <TextField
          label="وزن با بسته بندی  (گرم)"
          onChange={(e) => {
            setNewData({ ...newData, weightWithPackage: e.target.value });
          }}
          value={newData.weightWithPackage}
          type="number"
          onBlur={(e) => {
            if (weight && Number(weight) > Number(e.target.value)) {
              toast.error("وزن با بسته بندی باید از وزن خالص بیشتر باشد");
              setError("weightWithPackage");
            } else {
              setError("");
            }
          }}
          onInput={(e) => {
            e.target.value = e.target.value
              .replace(/[^0-9]/g, "")
              .replace(/(\..*?)\..*/g, "$1");
          }}
          error={error === "weightWithPackage"}
        />
        <TextField
          label="ارتفاع  بسته بندی (سانتی متر )"
          onChange={(e) => {
            if (Number(e.target.value) <= 200) {
              setNewData({ ...newData, height: e.target.value });
            } else {
              toast.error("حداکثر مقدار مورد مجاز برای وارد کردن ۲۰۰ می باشد");
            }
          }}
          value={newData.height}
          type="number"
          onInput={(e) => {
            e.target.value = e.target.value
              .replace(/[^0-9]/g, "")
              .replace(/(\..*?)\..*/g, "$1");
          }}
          error={error === "height"}
        />
        <TextField
          label="عرض بسته بندی (سانتی متر )"
          onChange={(e) => {
            if (Number(e.target.value) <= 200) {
              setNewData({ ...newData, width: e.target.value });
            } else {
              toast.error("حداکثر مقدار مورد مجاز برای وارد کردن ۲۰۰ می باشد");
            }
          }}
          value={newData.width}
          type="number"
          onInput={(e) => {
            e.target.value = e.target.value
              .replace(/[^0-9]/g, "")
              .replace(/(\..*?)\..*/g, "$1");
          }}
          error={error === "width"}
        />
        <TextField
          label="طول بسته بندی (سانتی متر )"
          onChange={(e) => {
            if (Number(e.target.value) <= 200) {
              setNewData({ ...newData, length: e.target.value });
            } else {
              toast.error("حداکثر مقدار مورد مجاز برای وارد کردن ۲۰۰ می باشد");
            }
          }}
          value={newData.length}
          type="number"
          onInput={(e) => {
            e.target.value = e.target.value
              .replace(/[^0-9]/g, "")
              .replace(/(\..*?)\..*/g, "$1");
          }}
          error={error === "length"}
        />
        <div className="lg:col-span-2 md:col-span-2">
          <CategoryBrands
            categoriesData={showingCats}
            brandsData={showingBrands}
            selectedCategory={category}
            selectedBrand={brand}
            onCategoryChange={setCategory}
            onBrandChange={setBrand}
            categoryError={error === "category"}
            brandError={error === "brand"}
          />
        </div>
        {userPermissions?.supplier?.view && supplierData.length > 0 && (
          <Dropdown
            title="  تامین کننده"
            data={supplierData}
            value={supplierData?.find((item) => item?.id === supplier?.id)}
            change={setSupplier}
          />
        )}{" "}
        <TextField
          label="توضیحات کوتاه برای متاتگ"
          onChange={(e) => {
            setNewData({ ...newData, shortDescription: e.target.value });
          }}
          InputLabelProps={{ shrink: true }}
          value={newData.shortDescription}
          error={error === "shortDescription"}
        />
        <Box className="flex items-center">
          <span style={{ fontFamily: "IRANSansFa" }}>کالای غیر اصل:</span>
          <Switch
            checked={newData.isFake}
            onChange={() => setNewData({ ...newData, isFake: !newData.isFake })}
          />
        </Box>
        <Box className="flex items-center">
          <span style={{ fontFamily: "IRANSansFa" }}>به زودی:</span>
          <Switch
            checked={comingSoon}
            onChange={() => setComingSoon(!comingSoon)}
          />
        </Box>
      </div>
      {userPermissions?.product?.addGallery && (
        <MultipleImages
          files={files}
          setFiles={setFiles}
          selectedProductImage={selectedProductImage}
          setselectedProductImage={setselectedProductImage}
          setResizing={setresizing}
          resizing={resizing}
        />
      )}

      <Box sx={{ pt: 1 }}>
        <TextEditor
          value={description}
          change={setDescription}
          hint="مشخصات نوشتاری"
        />
      </Box>
      {/*       {userPermissions?.seoProduct?.update && (
        <Box className="leftTextArea">
          <Typography sx={{ direction: "rtl", mb: "5px" }}>
            متاتگ های SEO :
          </Typography>
          <TextField
            multiline
            value={seo}
            disabled={!userPermissions?.seoProduct?.update}
            onChange={(e) => setSeo(e.target.value)}
            sx={{
              width: "100%",
              textarea: {
                resize: "vertical !important",
              },
            }}
            rows={3}
          />
        </Box>
      )} */}
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Button
          type="button"
          onClick={submit}
          disabled={loading}
          variant="contained"
        >
          {loading ? <CircularProgress /> : <> مرحله بعد</>}
        </Button>
      </Box>
    </form>
  );
};

export default StepOne;
