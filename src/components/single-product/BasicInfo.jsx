/* eslint-disable react-hooks/exhaustive-deps */
import { Delete } from "@mui/icons-material";
import {
  Box,
  IconButton,
  LinearProgress,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Resizer from "react-image-file-resizer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  ADD_PRODUCT_IMAGE,
  baseUrl,
  BRANDS,
  CATEGORIES,
  CREATE_REDIRECT_GENRALL,
  DELETE_PRODUCT,
  EDIT_PRODUCTS,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { setBrands, setCategories } from "../../redux/slices/relationals";
import {
  ActionButton,
  Dropdown,
  Loading,
  MultipleImages,
  TextEditor,
  TextInput,
} from "../common";
import CategoryBrands from "../common/CategoryBrands";
import axiosInstance from "../dataFetch/axiosInstance";
import { Confirm } from "../modals";
import ShowImage2 from "./ShowImage2";

const BasicInfo = ({ data, refresh, supplierData, setSupplierData }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { brands, categories } = useSelector((state) => state.relationals);
  const { userPermissions } = useSelector((state) => state.relationals);
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [resizing, setresizing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [cover, setCover] = useState();

  const [loading, setLoading] = useState(false);
  const [catChanged, setcatChanged] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);

  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [productCode, setProductCode] = useState("");
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedProductImage, setselectedProductImage] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  /*   const [seo, setSeo] = useState("");
   */ const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [supplier, setSupplier] = useState("");
  const [editModeRedirect, seteditModeRedirect] = useState(false);
  const [redirectAll, setRedirectAll] = useState(false);

  const [newData, setNewData] = useState({ notChecked: true });
  const [redirect, setRedirect] = useState({ url: "" });

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setBrand([...brands].find((brand) => brand.id === data.brandId));
      setCategory([...categories].find((cat) => cat.id === data.categoryiId));
      setSupplier([...supplierData].find((s) => s.id === data.supplierId));
      /*   setSeo(data.seo || ""); */
      setProductCode(data.code);
      setDescription(data.description || "");
      setWeight(data.weight);
      setActive(data.active);
      setRedirect({ url: `${data.slug}` });
      setNewData({
        length: data.length,
        slug: data.slug,
        width: data.width,
        height: data.height,
        weightWithPackage: data.weightWithPackage,
        notChecked: false,
        isFake: data.isFake,
        shortDescription: data.shortDescription,
      });
      setCover(data?.defaultImageId);
      setComingSoon(data.comingSoon);
    }
  }, [
    data,
    data?.title,
    data?.brandId,
    data?.categoryId,
    /*   data?.seo, */
    data?.code,
    data?.description,
    data?.weight,
    categories,
    data?.depth,
    data?.width,
    data?.height,
    data?.weightWithPackage,
    brands,
  ]);
  const submit = () => {
    if (!weight) {
      toast.error("وزن خالص را وارد کنید");
    }
    if (!newData.weightWithPackage) {
      toast.error("وزن با بسته بندی  را وارد کنید");
    } else if (!newData.height) {
      toast.error("ارتفاع محصول را وارد کنید");
    } else if (!newData.width) {
      toast.error("عرض محصول را وارد کنید");
    } else if (!newData.length) {
      toast.error("طول محصول را وارد کنید");
    } else if (!title) {
      toast.error("نام محصول را وارد کنید");
    } else if (!productCode) {
      toast.error("کد تجاری را وارد کنید");
    } else if (!brand) {
      toast.error("برند را وارد کنید");
    } else if (!category) {
      toast.error("دسته بندی را وارد کنید");
    } else if (!supplier) {
      toast.error(" تامیین کننده را وارد کنید");
    } else if (!weight) {
      toast.error(" وزن را وارد کنید");
    } else {
      const sendingData = {
        id: parseInt(id),
        title,
        brandId: brand?.id,
        categoryiId: category?.id,
        active: active,
        description,
        score: data.score,
        code: productCode,
        weight: Number(String(weight).replace(/,/g, "")),
        Supplier: supplier?.id,
        length: newData.length,
        width: newData.width,
        height: newData.height,
        weightWithPackage: newData.weightWithPackage,
        slug: redirect.url.replace(/\/+/g, "/").replace(/\s+/g, "-"),
        isFake: Boolean(newData.isFake),
        DefaultImageId: cover,
        shortDescription: newData?.shortDescription,
        comingSoon: comingSoon,
      };
      if (title && productCode && brand && category && supplier && weight) {
        setLoading(true);
        axiosInstance
          .put(`${baseUrl}/${EDIT_PRODUCTS}`, sendingData, configReq(token))
          .then((res) => {
            setLoading(false);
            toast.success("با موفقیت ویرایش شد");
            // handleRedirect(redirect);
            refresh();
          })
          .catch((err) => {
            toast.error(err.response?.data?.message);
            setLoading(false);
          });
      }
    }
  };

  const submitImages = async () => {
    try {
      const totalItems = files.length + selectedProductImage.length;
      let completedItems = 0;

      setIsUploading(true);
      setUploadProgress(0);

      if (files.length > 0) {
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

        for (let i = 0; i < resizedFiles.length; i++) {
          const file = resizedFiles[i];
          const originalFile = files[i];

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

      if (selectedProductImage.length > 0) {
        for (let i = 0; i < selectedProductImage.length; i++) {
          let fd = new FormData();
          fd.append("productId", id);

          const imageId = selectedProductImage[i].fullObject
            ? selectedProductImage[i].id
            : selectedProductImage[i];

          fd.append("fromGallery", imageId);

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
      setFiles([]);
      setselectedProductImage([]);
      toast.success("تمامی تصاویر با موفقیت ثبت شدند");
      refresh();
    } catch (error) {
      setIsUploading(false);
      setFiles([]);
      setselectedProductImage([]);
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    var b = data?.brandId;
    if (b) {
      axiosInstance(
        `${baseUrl}/${BRANDS}?Page=${1}&Limit=${2000}`,
        configReq(token)
      )
        .then((res) => {
          const { data } = res;
          setLoading(false);
          if (data.code === 200) {
            dispatch(setBrands(data.data));

            setBrand([...data.data].find((brand) => brand.id === b));
          }
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [data?.brandId]);
  const deleteProduct = (e) => {
    axiosInstance
      .post(
        `${baseUrl}/${CREATE_REDIRECT_GENRALL}`,
        {
          Title: data.title,
          EntityId: data.id,
          EntityName: "product",
          FromUrl: `/products/${data.id}/${data.slug}`,
          ToUrl: "/410",
          RedirectType: "301",
          IsActive: true,
          LastSlug: data.slug,
        },
        configReq(token)
      )
      .then((res) => {
        setLoading(true);
        axiosInstance
          .delete(`${baseUrl}/${DELETE_PRODUCT}?id=${id}`, configReq(token))
          .then((res) => {
            setLoading(false);
            setConfirmDelete(false);
            navigate("/products");
            toast.success("با موفقیت حذف شد");
          })
          .catch((err) => {
            setLoading(false);
            setConfirmDelete(false);
            toast.error(err.response?.data?.message);
          });
      });
  };

  useEffect(() => {
    if (categories.length === 0) {
      setLoading(true);
      axiosInstance(
        `${baseUrl}/${CATEGORIES}?Page=${1}&Limit=${2000}`,
        configReq(token)
      )
        .then((res) => {
          const { data } = res;
          setLoading(false);
          if (data.code === 200) {
            dispatch(setCategories(data.data));
          }
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [categories, brands]);
  const handleRedirect = (e) => {
    if (`${data.slug}` !== e.url) {
      axiosInstance
        .post(
          `${baseUrl}/${CREATE_REDIRECT_GENRALL}`,
          {
            Title: data.title,
            EntityId: data.id,
            EntityName: "product",
            FromUrl: `/${id}/${data.slug}`,
            ToUrl: `/${id}/${e.url}`,
            RedirectType: e.redirectType,
            IsActive: data.active,
            LastSlug: data.slug,
          },
          configReq(token)
        )
        .then((res) => {
          setRedirectAll(false);
        })
        .catch((err) => {
          setRedirectAll(false);
        });
    } else {
      setRedirectAll(false);
    }
  };
  const setCoverHandler = (img) => {
    setCover(img);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 1,
        width: "100%",
      }}
      className="px-4 md:px-0 pb-5"
    >
      {loading && <Loading />}
      <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 gap-x-8 gap-y-4 ">
        <div className="lg:col-span-2 md:col-span-2">
          {" "}
          <TextInput
            label="عنوان محصول"
            change={setTitle}
            currentValue={title}
          />
        </div>
        <div
          /*     onClick={() => seteditModeRedirect(true)} */
          className="lg:col-span-2 md:col-span-2 leftInput"
        >
          <TextField
            fullWidth
            label="نشانی محصول"
            InputLabelProps={{ shrink: true }}
            value={redirect.url}
            onChange={(e) => {
              setRedirect({ ...redirect, url: e.target.value });
            }}
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
        <div className="w-full leftInput">
          <TextInput
            label="کد تجاری"
            change={setProductCode}
            currentValue={productCode}
          />
        </div>
        <div className="lg:col-span-2 md:col-span-2">
          <CategoryBrands
            categoriesData={categories}
            brandsData={brands}
            selectedCategory={category}
            selectedBrand={brand}
            onCategoryChange={setCategory}
            onBrandChange={setBrand}
          />
        </div>
        {!newData.notChecked && (
          <>
            {" "}
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
                  toast.error("وزن با بسته بندی باید از وزن خالص بیشتر باشد");
                } else {
                }
              }}
            />
            <TextField
              label="وزن با بسته بندی  (گرم)"
              onChange={(e) =>
                setNewData({ ...newData, weightWithPackage: e.target.value })
              }
              value={newData.weightWithPackage}
              type="number"
              onInput={(e) => {
                e.target.value = e.target.value
                  .replace(/[^0-9]/g, "")
                  .replace(/(\..*?)\..*/g, "$1");
              }}
              onBlur={(e) => {
                if (weight && Number(weight) > Number(e.target.value)) {
                  toast.error("وزن با بسته بندی باید از وزن خالص بیشتر باشد");
                }
              }}
            />
            <TextField
              label="ارتفاع  بسته بندی (سانتی متر )"
              onChange={(e) => {
                if (Number(e.target.value) <= 200) {
                  setNewData({ ...newData, height: e.target.value });
                } else {
                  toast.error(
                    "حداکثر مقدار مورد مجاز برای وارد کردن ۲۰۰ می باشد"
                  );
                }
              }}
              value={newData.height}
              type="number"
              onInput={(e) => {
                e.target.value = e.target.value
                  .replace(/[^0-9]/g, "")
                  .replace(/(\..*?)\..*/g, "$1");
              }}
            />
            <TextField
              label="عرض بسته بندی (سانتی متر )"
              onChange={(e) => {
                if (Number(e.target.value) <= 200) {
                  setNewData({ ...newData, width: e.target.value });
                } else {
                  toast.error(
                    "حداکثر مقدار مورد مجاز برای وارد کردن ۲۰۰ می باشد"
                  );
                }
              }}
              value={newData.width}
              type="number"
              onInput={(e) => {
                e.target.value = e.target.value
                  .replace(/[^0-9]/g, "")
                  .replace(/(\..*?)\..*/g, "$1");
              }}
            />
            <TextField
              label=" طول بسته بندی (سانتی متر )"
              onChange={(e) => {
                if (Number(e.target.value) <= 200) {
                  setNewData({ ...newData, length: e.target.value });
                } else {
                  toast.error(
                    "حداکثر مقدار مورد مجاز برای وارد کردن ۲۰۰ می باشد"
                  );
                }
              }}
              value={newData.length}
              type="number"
              onInput={(e) => {
                e.target.value = e.target.value
                  .replace(/[^0-9]/g, "")
                  .replace(/(\..*?)\..*/g, "$1");
              }}
            />{" "}
            <TextField
              label="توضیحات کوتاه برای اسکیما"
              onChange={(e) => {
                setNewData({ ...newData, shortDescription: e.target.value });
              }}
              InputLabelProps={{
                shrink: true,
              }}
              value={newData.shortDescription}
            />
            <Box className="flex items-center">
              <span style={{ fontFamily: "IRANSansFa" }}>کالای غیر اصل:</span>
              <Switch
                checked={newData.isFake}
                onChange={() =>
                  setNewData({ ...newData, isFake: !newData.isFake })
                }
              />
            </Box>
          </>
        )}
        {userPermissions?.supplier?.view && (
          <Dropdown
            title="  تامین کننده"
            data={supplierData}
            value={supplier}
            change={setSupplier}
          />
        )}{" "}
        <Box className="flex items-center">
          <span style={{ fontFamily: "IRANSansFa" }}>به زودی:</span>
          <Switch
            checked={comingSoon}
            onChange={() => setComingSoon(!comingSoon)}
          />
        </Box>
      </div>
      <>
        <Box>
          <Typography>تصاویر فعلی:</Typography>
          <Box sx={{ display: "flex", mt: 2, gap: 2, flexWrap: "wrap" }}>
            {data?.images?.map((image, index) => (
              <Box className="relative" key={image + index}>
                <Box
                  onClick={() => setCoverHandler(image)}
                  className="rounded-md border-[3px] p-2 cursor-pointer"
                  sx={{
                    borderColor: (theme) =>
                      image === cover
                        ? `${theme.palette.primary.main} !important`
                        : "#fff",
                  }}
                >
                  {image && (
                    <ShowImage2
                      refresh={refresh}
                      address={image}
                      deleteId={image}
                      id={id}
                    />
                  )}
                </Box>

                {image === cover ? <small>کاور محصول</small> : <></>}
              </Box>
            ))}
            {data?.images?.length === 0 || !data?.images ? (
              <i className="text-red-600"> بدون تصویر</i>
            ) : (
              <></>
            )}
          </Box>
        </Box>
        {userPermissions?.product?.addGallery && (
          <Box>
            <Typography sx={{ mb: 2 }}>افزودن تصاویر جدید:</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <MultipleImages
                setFiles={setFiles}
                files={files}
                setResizing={setresizing}
                resizing={resizing}
                selectedProductImage={selectedProductImage}
                setselectedProductImage={setselectedProductImage}
                returnArrayGallery={true}
              />
              <div className="flex sm:justify-start justify-end w-full sm:w-auto">
                <ActionButton
                  disable={
                    (files.length === 0 && selectedProductImage.length === 0) ||
                    isUploading
                  }
                  click={submitImages}
                  title="ثبت تغییرات تصاویر"
                />
              </div>
            </Box>
            {isUploading && (
              <Box sx={{ width: "100%", mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography
                  align="center"
                  variant="body2"
                  color="text.secondary"
                >
                  {uploadProgress}% آپلود شده
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </>
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
      )}
 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {userPermissions?.product?.delete && (
          <IconButton
            size="medium"
            color="error"
            onClick={() => setConfirmDelete(true)}
          >
            <Delete />
          </IconButton>
        )}
        {/*   <div className="flex gap-2">
          <Button
            onClick={() => {
              setRedirectAll(true);
            }}
            variant="contained"
            color="warning"
          >
            ریدایرکت کلی
          </Button>
   
        </div> */}{" "}
        <ActionButton click={submit} title="ثبت تغییرات" />
      </Box>

      {/*      <RedirectModal
        open={editModeRedirect || confirmDelete}
        deleteMode={confirmDelete}
        close={(e) => {
          seteditModeRedirect(false);
          setConfirmDelete(false);
        }}
        prevData={redirect}
        name="url"
        handleDelete={(e) => deleteProduct(e)}
        setPrevData={setRedirect}
      /> */}
      <Confirm
        message="آیا از حذف این محصول اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteProduct}
        open={confirmDelete}
      />
    </Box>
  );
};

export default BasicInfo;
