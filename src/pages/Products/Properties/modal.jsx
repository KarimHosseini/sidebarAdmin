import { Delete } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Dropdown,
  Modal,
  NumberInput,
  TextInput,
} from "../../../components/common";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import Confirm from "../../../components/modals/Confirm";
import Promotion from "../../../components/single-product/promotion";
import {
  baseUrl,
  CREATE_WORK,
  DOWNLOAD_FILE,
  EDIT_PRODUCT_PROPERTIES,
  REMOVE_PRODUCT_PROPERTIES,
  SINGLE_PRODUCT,
} from "../../../helpers/api-routes";

import CollectionsIcon from "@mui/icons-material/Collections";
import { configReq } from "../../../helpers/functions";
import { logout } from "../../../redux/slices/user";

const EditPrice = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(prevData || {});
  const [selectedProductImage, setselectedProductImage] = useState(null);
  const [opens, setOpen] = useState(false);
  const [productImage, setProductImage] = useState(undefined);

  useEffect(() => {
    if (forEdit) {
      setselectedProductImage(prevData.galleryId);
      setData(prevData || {});

      axiosInstance(
        `${baseUrl}/${SINGLE_PRODUCT}?id=${prevData.productId}`,
        configReq(token)
      )
        .then((res) => {
          const { data } = res;
          setImages(data.data.images);
        })
        .catch((err) => {});
    }
  }, [prevData, forEdit]);
  const resetData = () => {
    setData({});
  };

  const submitData = () => {
    if (data.discount > data.price) {
      toast.error("قیمت کل باید از قیمت پس از تخفیف بزرگتر باشد");
    } else if (data.title) {
      setLoading(true);
      var temp = [...allRows];
      var sumbitData = {
        ...data,
        fromGallery: selectedProductImage,
        qty: data.stock,
        productAttributeId: data.productAttribute?.attribId,
        productAttribute2Id: data.productAttribute2?.attribId,
      };
      delete sumbitData.productAttribute;
      delete sumbitData.productAttribute2;
      if (forEdit) {
        axiosInstance
          .put(
            `${baseUrl}/${EDIT_PRODUCT_PROPERTIES}`,
            sumbitData,
            configReq(token)
          )
          .then((res) => {
            setLoading(false);
            toast.success("با موفقیت ویرایش شد");
            var index = temp.findIndex((item) => item.id === data.id);
            temp[index] =
              res.data.data; /* ?.find((item) => item.id === data.id); */
            setAllRows(temp);
            close();
            resetData();
          })
          .catch((err) => {
            setLoading(false);
            toast.error(err.response?.data?.message);
            if (err.response.status === 401) {
              dispatch(logout());
            }
          });
      } else {
        axiosInstance
          .post(`${baseUrl}/${CREATE_WORK}`, data, configReq(token))
          .then((res) => {
            temp.unshift(res.data.data);

            setAllRows(temp);
            setLoading(false);
            toast.success("با موفقیت اضافه شد");
            close();
            resetData();
          })
          .catch((err) => {
            setLoading(false);
            toast.error(err.response?.data?.message);
            if (err.response.status === 401) {
              dispatch(logout());
            }
          });
      }
    } else if (!data.title) {
      toast.error("نام شرکت را وارد کنید");
    }
  };
  const deleteAttr = () => {
    setLoading(true);
    axiosInstance
      .delete(
        `${baseUrl}/${REMOVE_PRODUCT_PROPERTIES}?id=${data.id}`,
        configReq(token)
      )
      .then((res) => {
        var temp = [...allRows];
        var newData = temp.filter((item) => item.id !== data.id);
        setAllRows(newData);
        setLoading(false);
        setConfirmDelete(false);
        toast.success("با موفقیت حذف شد");
        close();
        resetData();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);

        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title="ویرایش  قیمت "
      autoWidth
    >
      <div className="flex flex-wrap gap-2 items-center text-sm">
        <div className="flex items-center justify-between w-full">
          <span className="text-base">{data?.title}</span>
          <div className="flex gap-1 items-center justify-end">
            <span className="text-sm text-gray-700">آیدی ویژگی :</span>
            <span className="text-sm text-gray-700 font-bold">{data?.id}</span>
          </div>
        </div>

        {data?.productAttribute?.type === 1 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {" "}
            {data?.productAttribute?.galleryId ? (
              <img
                src={
                  data?.productAttribute?.galleryId
                    ? `${baseUrl}/${DOWNLOAD_FILE}/${data?.productAttribute?.galleryId}?size=tiny`
                    : null
                }
                style={{ width: "18px", height: "18px" }}
                alt=""
              />
            ) : (
              <Avatar
                sx={{
                  background: data?.productAttribute?.value,
                  border: "1px solid gray",
                  width: "18px",
                  height: "18px",
                }}
              >
                &nbsp;
              </Avatar>
            )}
            {data?.productAttribute?.title}
          </Box>
        ) : (
          <>
            {data.productAttribute && (
              <>
                {data?.productAttribute?.attrib} /
                {data?.productAttribute?.title}
              </>
            )}
          </>
        )}
        {data?.productAttribute2?.type === 1 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Avatar
              sx={{
                background: data?.productAttribute2?.value,
                border: "1px solid gray",
                width: "18px",
                height: "18px",
              }}
            >
              &nbsp;
            </Avatar>
            {data?.productAttribute2?.title}
          </Box>
        ) : (
          <>
            {data.productAttribute2 && (
              <>
                {data?.productAttribute2?.attrib} /
                {data?.productAttribute2?.title}
              </>
            )}
          </>
        )}
      </div>
      {data.discount && data.discount !== data.price ? (
        <div className="flex items-center justify-end">
          درصد تخفیف :‌
          <mark>
            {(((data.price - data.discount) / data.price) * 100).toFixed(1)} %{" "}
          </mark>
        </div>
      ) : (
        <></>
      )}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
        <>
          <TextInput
            currentValue={data.code || ""}
            change={(e) => setData({ ...data, code: e })}
            label="کد حسابداری"
            readOnly={true}
          />{" "}
        </>
        <>
          {" "}
          <TextInput
            price={true}
            number={true}
            currentValue={String(data.price).toLocaleString()}
            change={(e) => setData({ ...data, price: e })}
            label="قیمت"
            readOnly={!userPermissions?.productProperties?.update}

            /*  allowZero={true} */
          />
        </>
        <>
          {" "}
          <TextInput
            currentValue={data.discount}
            label="قیمت با تخفیف"
            change={(e) => setData({ ...data, discount: e })}
            number={true}
            smallerthan={data.price}
            errors={"قیمت بعد تخفیف باید از قیمت اصلی کوچیک تر باشد"}
            allowZero={true}
            readOnly={!userPermissions?.productProperties?.update}
            price={true}
          />
        </>
  {/*       <NumberInput
          disabled={!userPermissions?.productProperties?.update}
          label="محدودیت پایین ترین تعداد خرید"
          change={(e) => setData({ ...data, minBuy: e })}
          value={data.minBuy}
        /> */}
        <NumberInput
          label="محدودیت بالاترین تعداد خرید"
          change={(e) => setData({ ...data, maxBuy: e })}
          value={data.maxBuy}
          disabled={!userPermissions?.productProperties?.update}
        />
        <NumberInput
          disabled={
            !userPermissions?.productProperties?.updateStock ||
            !userPermissions?.productProperties.update
          }
          label="تعداد موجودی"
          change={(e) => setData({ ...data, stock: e })}
          value={data.stock}
        />
        <Dropdown
          value={STOCKS_TYPE.find(
            (item) => item?.id === data?.accountingStockId
          )}
          change={(e) =>
            setData({
              ...data,
              accountingStockId: e?.id,
              inColleagueStoke: e.id === 2 ? true : false,
            })
          }
          data={STOCKS_TYPE}
          title="  موجود در انبار"
          disabled={data.inColleagueStoke}
        />{" "}
        <div className="flex gap-1 items-center">
          <span className="text-sm ">موجود در انبار همکار :</span>
          <Switch
            checked={data.inColleagueStoke}
            onClick={() =>
              setData({
                ...data,
                inColleagueStoke: !data.inColleagueStoke,
                accountingStockId: data.inColleagueStoke ? 0 : 2,
              })
            }
          />
          <Typography
            sx={{ color: data.inColleagueStoke ? "#2ab32a" : "red" }}
            variant="body2"
          >
            {data.inColleagueStoke ? "فعال" : "غیر فعال"}
          </Typography>
        </div>{" "}
        <div className="md:col-span-3">
          {" "}
          <TextInput
            label="توضیحات"
            currentValue={data.description}
            change={(e) => setData({ ...data, description: e })}
          />
        </div>{" "}
        {selectedProductImage ? (
          <div className="flex">
            <img
              src={`${baseUrl}/${DOWNLOAD_FILE}/${selectedProductImage}?size=tiny`}
              alt=""
              className="w-20"
            />
            <div className="flex flex-col">
              <Button
                onClick={() => setselectedProductImage(null)}
                variant="text"
                color="error"
              >
                حذف
              </Button>
              <Button
                onClick={() => setOpen(true)}
                variant="text"
                color="warning"
              >
                ویرایش
              </Button>
            </div>
          </div>
        ) : (
          <>
            {" "}
            {userPermissions?.product?.addGallery && (
              <div
                onClick={() => setOpen(true)}
                className="border rounded-md cursor-pointer py-2 px-5 flex items-center justify-center gap-2"
              >
                <CollectionsIcon className="text-sm text-green-600" />
                <span className="text-xs text-gray-600">انتخاب عکس</span>
              </div>
            )}
          </>
        )}
        <div className="flex gap-1 items-center">
          <span className="text-sm text-gray-700">وضعیت :</span>
          <Switch
            disabled={!userPermissions?.productProperties?.update}
            checked={data.active}
            onClick={() => setData({ ...data, active: !data.active })}
          />
          <Typography
            sx={{ color: data.active ? "#2ab32a" : "red" }}
            variant="body2"
          >
            {data.active ? "فعال" : "غیر فعال"}
          </Typography>
        </div>
        <div className="flex gap-1 items-center">
          <span className="text-sm ">تخفیف زمان دار :</span>
          <Switch
            checked={data.promotion}
            onClick={() => setData({ ...data, promotion: !data.promotion })}
          />
          <Typography
            sx={{ color: data.promotion ? "#2ab32a" : "red" }}
            variant="body2"
          >
            {data.promotion ? "فعال" : "غیر فعال"}
          </Typography>
        </div>
        <div className="flex gap-1 items-center">
          <span className="text-sm text-gray-700">قابل فروش : </span>
          <Switch
            checked={data.hasSaleAbility}
            onClick={() =>
              setData({ ...data, hasSaleAbility: !data.hasSaleAbility })
            }
          />
          <Typography
            sx={{ color: data.hasSaleAbility ? "#2ab32a" : "red" }}
            variant="body2"
          >
            {data.hasSaleAbility ? "فعال" : "غیر فعال"}
          </Typography>
        </div>
      </div>
      <Collapse
        className="col-span-6 "
        sx={{
          ".MuiCollapse-wrapperInner": {
            display: {
              md: "grid",
            },
            borderTop: "1px solid #cccccc !important",
            pt: 3,
          },
        }}
        in={data.promotion}
      >
        <Fragment>
          <Promotion
            data={data}
            setPromotionPrice={(e) => setData({ ...data, promotionPrice: e })}
            setPromotionStock={(e) => setData({ ...data, promotionStock: e })}
            setPromotionTo={(e) => setData({ ...data, promotionTo: e })}
            setPromotionFrom={(e) => setData({ ...data, promotionFrom: e })}
            rerender={data.promotion}
          />
        </Fragment>
      </Collapse>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {userPermissions?.productProperties?.delete && forEdit && (
          <IconButton size="large" onClick={() => setConfirmDelete(true)}>
            <Delete sx={{ color: "red" }} />
          </IconButton>
        )}
        <div style={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          color="primary"
          onClick={submitData}
          disabled={loading}
          sx={{ width: { xs: "50%", md: "auto" } }}
        >
          {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
        </Button>{" "}
      </Box>
      <Confirm
        message="آیا از حذف این شغل اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />{" "}
      <Modal
        open={opens}
        close={() => {
          setOpen(false);
        }}
        title="انتخاب عکس از گالری"
        autoWidth={true}
      >
        <div className="flex flex-col md:w-[60vw]">
          <div className=" flex flex-wrap mb-4">
            {images?.map((item, index) => (
              <Box
                sx={{
                  border:
                    productImage === item
                      ? "2px solid green"
                      : "2px solid white",
                }}
                key={`PRO___${index}`}
                className="flex rounded-md flex-wrap cursor-pointer "
                onClick={() => setProductImage(item)}
              >
                <img
                  src={`${baseUrl}/${DOWNLOAD_FILE}/${item}?size=tiny`}
                  alt=""
                  className="w-24 h-24"
                />
              </Box>
            ))}
          </div>
          <div className="flex justify-end items-center mt-3">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setselectedProductImage(productImage);
                setOpen(false);
              }}
            >
              ثبت اطلاعات
            </Button>
          </div>
          {/*   <MultipleImages setFiles={setFiles} files={files} />
        <Button sx={{mt:2 , maxWidth:"200px"}} onClick={submitImages} color="info" variant="contained">
          آپلود
        </Button> */}
        </div>
      </Modal>
    </Modal>
  );
};

export default EditPrice;
const STOCKS_TYPE = [
  {
    id: 0,
    title: " انبار رسمی",
  },
  {
    id: 1,
    title: " انبار غیررسمی   ",
  },
  {
    id: 2,
    title: " انبار همکار   ",
  },
];
