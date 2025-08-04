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
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  baseUrl,
  BRANDS,
  CATEGORIES,
  suppliers,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
import { Dropdown, MultipleImages, TextEditor, TextInput } from "../common";
import CategoryBrands from "../common/CategoryBrands";
import axiosInstance from "../dataFetch/axiosInstance";
import ShowImage2 from "../single-product/ShowImage2";

const StepOneGroupProduct = ({
  error,
  data,
  setData,
  loading,
  submitHandler,
  editModa = false,
  setresizing,
  resizing,
}) => {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.user);
  const { brands, categories } = useSelector((state) => state.relationals);
  const [showingCats, setShowingCats] = useState([]);
  const [showingBrands, setShowingBrands] = useState([]);

  const [supplier, setSupplier] = useState("");
  const [supplierData, setSupplierData] = useState([]);

  useEffect(() => {
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

        /*           setData({ ...data, category: data?.data[0] });
         */
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
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

  return (
    <form className="flex flex-col gap-3" onSubmit={submitHandler}>
      <Divider sx={{ borderStyle: "dashed !important" }} />
      <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 gap-x-8 gap-y-4">
        <div className="lg:col-span-3 md:col-span-2">
          {" "}
          <TextInput
            label="عنوان محصول"
            change={(e) => setData({ ...data, title: e })}
            currentValue={data?.title}
            /*   err={error === "title"} */
          />
        </div>{" "}
        <div className="lg:col-span-3 md:col-span-2">
          {" "}
          <TextInput
            label="نشانی محصول"
            change={(e) => setData({ ...data, slug: e })}
            currentValue={data?.slug}
            /*   err={error === "title"} */
          />
        </div>
      </div>

      <div
        style={{ marginBottom: error === "code" ? "10px" : "" }}
        className="sm:grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 gap-x-8 flex flex-col gap-y-4"
      >
        <TextInput
          label="کد تجاری کالا"
          change={(e) => setData({ ...data, code: e })}
          currentValue={data?.code}
          err={error === "code"}
        />
        <div className="lg:col-span-2 md:col-span-2">
          <CategoryBrands
            categoriesData={showingCats}
            brandsData={showingBrands}
            selectedCategory={showingCats.find(
              (item) => item.id === data?.categoryiId
            )}
            selectedBrand={showingBrands.find(
              (item) => item.id === data?.brandId
            )}
            onCategoryChange={(e) => {
              setData({ ...data, categoryiId: e.id });
            }}
            onBrandChange={(e) => setData({ ...data, brandId: e.id })}
          />
        </div>
        <Dropdown
          title="  تامین کننده"
          data={supplierData}
          value={supplierData?.find((item) => item?.id === data?.Supplier)}
          change={(e) => setData({ ...data, Supplier: e?.id })}
          err={error === "Supplier"}
        />
        <div className="flex gap-5 items-center col-span-2 md:px-0 px-4">
          {/*       <FormControlLabel
            onChange={() =>
              setData({
                ...data,
                bundleCustomWeight: !data?.bundleCustomWeight,
              })
            }
            control={
              <Checkbox checked={data?.bundleCustomWeight} size="small" />
            }
            label={<span className="text-xs  ">وزن داخواه</span>}
          />{" "} */}
          <Box className="flex items-center">
            <span style={{ fontFamily: "IRANSansFa" }}>فعال/غیر فعال:</span>
            <Switch
              checked={data?.active}
              onChange={(e) => setData({ ...data, active: !data?.active })}
            />
          </Box>{" "}
          <Box className="flex items-center">
            <span style={{ fontFamily: "IRANSansFa" }}>نمایش زمان دار:</span>
            <Switch
              checked={data?.timedBundle}
              onChange={(e) =>
                setData({ ...data, timedBundle: !data?.timedBundle })
              }
            />
          </Box>{" "}
          <Box className="flex items-center">
            <span style={{ fontFamily: "IRANSansFa" }}>قابل فروش:</span>
            <Switch
              checked={data?.hasSaleAbility}
              onChange={(e) =>
                setData({ ...data, hasSaleAbility: !data?.hasSaleAbility })
              }
            />
          </Box>
        </div>
        <TextField
          label="وزن(گرم)"
          onChange={(e) => setData({ ...data, weight: e.target.value })}
          value={data.weight}
          type="number"
          error={error === "weight"}
        />{" "}
        <TextField
          label="وزن با بسته بندی  (گرم)"
          onChange={(e) => {
            setData({ ...data, weightWithPackage: e.target.value });
          }}
          value={data.weightWithPackage}
          type="number"
          onBlur={(e) => {
            if (data.weight && Number(data.weight) > Number(e.target.value)) {
              toast.error("وزن با بسته بندی باید از وزن خالص بیشتر باشد");
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
          label="ارتفاع  بسته بندی"
          onChange={(e) => {
            if (Number(e.target.value) <= 200) {
              setData({ ...data, totalDepth: e.target.value });
            } else {
              toast.error("حداکثر مقدار مورد مجاز برای وارد کردن ۲۰۰ می باشد");
            }
          }}
          value={data.totalDepth}
          type="number"
          onInput={(e) => {
            e.target.value = e.target.value
              .replace(/[^0-9]/g, "")
              .replace(/(\..*?)\..*/g, "$1");
          }}
          error={error === "totalDepth"}
        />
        <TextField
          label="عرض بسته بندی"
          onChange={(e) => {
            if (Number(e.target.value) <= 200) {
              setData({ ...data, totalWidth: e.target.value });
            } else {
              toast.error("حداکثر مقدار مورد مجاز برای وارد کردن ۲۰۰ می باشد");
            }
          }}
          value={data.totalWidth}
          type="number"
          onInput={(e) => {
            e.target.value = e.target.value
              .replace(/[^0-9]/g, "")
              .replace(/(\..*?)\..*/g, "$1");
          }}
          error={error === "totalWidth"}
        />
        <TextField
          label="طول بسته بندی"
          onChange={(e) => {
            if (Number(e.target.value) <= 200) {
              setData({ ...data, totalLength: e.target.value });
            } else {
              toast.error("حداکثر مقدار مورد مجاز برای وارد کردن ۲۰۰ می باشد");
            }
          }}
          value={data.totalLength}
          type="number"
          onInput={(e) => {
            e.target.value = e.target.value
              .replace(/[^0-9]/g, "")
              .replace(/(\..*?)\..*/g, "$1");
          }}
          error={error === "totalLength"}
        />
        {/*         {userPermissions?.supplier?.view && (
            <Dropdown
              title="  تامین کننده"
              data={supplierData}
              value={supplier}
              change={setSupplier}
            />
          )} */}
      </div>

      <>
        {editModa && (
          <Box>
            <Typography>تصاویر فعلی:</Typography>
            <Box sx={{ display: "flex", mt: 2, gap: 2, flexWrap: "wrap" }}>
              {data?.images?.map((image, index) => (
                <Fragment key={image + index}>
                  {image && (
                    <ShowImage2
                      refresh={() => {
                        var temp = [...data?.images];
                        temp = temp?.filter((item) => item !== image);
                        setData({ ...data, images: temp });
                      }}
                      address={image}
                      deleteId={image}
                      id={data?.id}
                    />
                  )}
                </Fragment>
              ))}
              {data?.images?.length === 0 || !data?.images ? (
                <i className="text-red-600"> بدون تصویر</i>
              ) : (
                <></>
              )}
            </Box>
          </Box>
        )}

        <Box>
          <>
            <MultipleImages
              setFiles={(e) => setData({ ...data, files: e })}
              files={data?.files || []}
              setselectedProductImage={(e) =>
                setData({ ...data, selectedProductImage: e })
              }
              setResizing={setresizing}
              resizing={resizing}
              selectedProductImage={data?.selectedProductImage || []}
              returnArrayGallery={true}
            />
          </>
        </Box>
      </>
      <Box sx={{ pt: 1 }}>
        <TextEditor
          change={(e) => setData({ ...data, description: e })}
          value={data?.description}
          hint="مشخصات نوشتاری"
          noBorder={true}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Button type="submit" disabled={loading} variant="contained">
          {loading ? <CircularProgress /> : <> مرحله بعد</>}
        </Button>
      </Box>
    </form>
  );
};

export default StepOneGroupProduct;
