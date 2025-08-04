/* eslint-disable react-hooks/exhaustive-deps */
import { ExpandMore } from "@mui/icons-material";
import CollectionsIcon from "@mui/icons-material/Collections";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  Collapse,
  Divider,
  Switch,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  baseUrl,
  DOWNLOAD_FILE,
  EDIT_PRODUCT_PROPERTIES,
  REMOVE_PRODUCT_PROPERTIES,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { Dropdown, Modal, NumberInput, ShowImage, TextInput } from "../common";
import axiosInstance from "../dataFetch/axiosInstance";
import Promotion from "./promotion";

const CurrentPrice = ({
  property,
  refresh,
  index,
  images,
  currentProperties,
}) => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [stock, setStock] = useState("");
  const [open, setOpen] = useState(false);
  const [disable, setDisable] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [active, setActive] = useState(true);
  const [productImage, setProductImage] = useState(null);
  const [selectedProductImage, setselectedProductImage] = useState(null);
  const [openAccordian, setOpenAccordian] = useState(false);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [promotion, setPromotion] = useState("");
  const [promotionFrom, setPromotionFrom] = useState("");
  const [promotionTo, setPromotionTo] = useState("");
  const [promotionPrice, setPromotionPrice] = useState("");
  const [rerender, setRerender] = useState(false);
  const [description, setDescription] = useState("");
  const [inColleagueStoke, setInColleagueStoke] = useState(false);
  const [hasSaleAbility, setHasSaleAbility] = useState(true);
  const [accountingStockId, setAccountingStockId] = useState(0);
  const isFirstRender = useRef(true);
  const promotionChangesPending = useRef(false);

  const [promotionStock, setPromotionStock] = useState("");

  const isPromotionActive = () => {
    return (
      promotion &&
      promotionStock > 0 &&
      new Date(promotionFrom) <= new Date() &&
      new Date(promotionTo) >= new Date()
    );
  };

  useEffect(() => {
    if (property) {
      setCode(property.code);
      setPrice(property.price.toLocaleString());
      setDiscount(property.discount.toLocaleString());
      setMin(property.minBuy);
      setMax(property.maxBuy);
      setStock(property.stock);
      setActive(property.active);
      setPromotion(property.promotion);
      setDescription(property.description);
      setInColleagueStoke(property.inColleagueStoke);
      setHasSaleAbility(property.hasSaleAbility);
      setPromotionFrom(property.promotionFrom);
      setPromotionTo(property.promotionTo);
      setPromotionPrice(property.promotionPrice);
      setPromotionStock(property.promotionStock);
      setAccountingStockId(property.accountingStockId);
      setProductImage(property.galleryId);
      setselectedProductImage(property.galleryId);
      if (!isFirstRender.current) {
        setRerender((prev) => !prev);
      }
      isFirstRender.current = false;
    }
  }, [property]);

  useEffect(() => {
    if (isFirstRender.current) {
      return;
    }

    const hasChanges =
      code !== property.code ||
      price !== property.price.toLocaleString() ||
      discount !== property.discount.toLocaleString() ||
      min !== property.minBuy ||
      max !== property.maxBuy ||
      stock !== property.stock ||
      active !== property.active ||
      promotionFrom !== property.promotionFrom ||
      promotionTo !== property.promotionTo ||
      promotionPrice !== property.promotionPrice ||
      promotionStock !== property.promotionStock ||
      promotion !== property.promotion ||
      description !== property.description ||
      inColleagueStoke !== property.inColleagueStoke ||
      hasSaleAbility !== property.hasSaleAbility ||
      accountingStockId !== property.accountingStockId;

    setDisable(!hasChanges);

    if (
      promotionFrom !== property.promotionFrom ||
      promotionTo !== property.promotionTo
    ) {
      promotionChangesPending.current = true;
    }
  }, [
    code,
    min,
    price,
    discount,
    max,
    active,
    stock,
    promotionFrom,
    promotionTo,
    promotionPrice,
    promotionStock,
    promotion,
    description,
    inColleagueStoke,
    hasSaleAbility,
    accountingStockId,
    property,
  ]);

  const handlePromotionFromChange = useCallback(
    (newDate) => {
      if (newDate !== promotionFrom) {
        setPromotionFrom(newDate);
      }
    },
    [promotionFrom]
  );

  const handlePromotionToChange = useCallback(
    (newDate) => {
      if (newDate !== promotionTo) {
        setPromotionTo(newDate);
      }
    },
    [promotionTo]
  );

  const handlePromotionPriceChange = useCallback(
    (newPrice) => {
      if (newPrice !== promotionPrice) {
        setPromotionPrice(newPrice);
      }
    },
    [promotionPrice]
  );

  const handlePromotionStockChange = useCallback(
    (newStock) => {
      if (newStock !== promotionStock) {
        setPromotionStock(newStock);
      }
    },
    [promotionStock]
  );

  const editPrice = () => {
    var data = {
      ...property,
      productId: parseInt(id),
      productAttributeId: property.productAttribute.subAttribId,
      productAttribute2Id: property.productAttribute2
        ? property.productAttribute2.subAttribId
        : undefined,
      code,
      price: Number(price.replace(/,/g, "")),
      discount: Number(discount.replace(/,/g, "")),
      maxBuy: max,
      minBuy: min,
      qty: stock,
      active: active,
      fromGallery: selectedProductImage,
      inColleagueStoke: inColleagueStoke,
      description,
      hasSaleAbility: hasSaleAbility,
      accountingStockId,
    };
    if (promotion) {
      data = {
        ...data,
        promotion,
        promotionFrom,
        promotionTo,
        promotionPrice,
        promotionStock,
      };
    } else {
      data = { ...data, promotion: false };
    }
    delete data.productAttribute;
    delete data.productAttribute2;
    setLoading(true);

    promotionChangesPending.current = false;

    axiosInstance
      .put(`${baseUrl}/${EDIT_PRODUCT_PROPERTIES}`, data, configReq(token))
      .then((res) => {
        setLoading(false);
        toast.success("با موفقیت ثبت  شد");
        refresh();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };

  const deletePrice = () => {
    setLoading(true);
    axiosInstance
      .delete(
        `${baseUrl}/${REMOVE_PRODUCT_PROPERTIES}?id=${property.id}`,
        configReq(token)
      )
      .then((res) => {
        setLoading(false);
        toast.success("با موفقیت حذف شد");
        refresh();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };

  return (
    <Accordion
      sx={{
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderTop: index !== 0 ? "none !important" : "",
      }}
      expanded={openAccordian}
    >
      <AccordionSummary
        onClick={() => setOpenAccordian(!openAccordian)}
        expandIcon={<ExpandMore />}
      >
        <div className=" flex flex-wrap md:flex-nowrap items-center justify-between gap-3 w-full pr-3 rounded-lg px-4">
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2 col-span-2 ">
            <div className="w-12 ">
              {property.galleryId && (
                <img
                  src={`${baseUrl}/${DOWNLOAD_FILE}/${property.galleryId}?size=tiny`}
                  alt=""
                  className="w-12 "
                />
              )}
            </div>
            {property.productAttribute?.type === 1 && (
              <>
                {property.productAttribute?.galleryId ? (
                  <ShowImage
                    smallImage={true}
                    address={property.productAttribute?.galleryId}
                  />
                ) : (
                  <div className="bg-slate-200 w-[14px] h-[14px] flex items-center justify-center rounded-lg">
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: property.productAttribute?.value,
                      }}
                    ></div>
                  </div>
                )}
              </>
            )}
            <div className="flex gap-5 items-center">
              <span className="md:text-base text-xs">
                <span className="font-bold">
                  {property.productAttribute?.title}{" "}
                </span>
                <span className="text-slate-300"> | </span>
                <span className="font-bold">
                  {property.productAttribute2?.title}
                </span>
              </span>

              {!(Number(discount) !== 0 || isPromotionActive()) && (
                <span className="text-base rounded-lg p-2 border-gray-100 border-solid border-2">
                  <span className="text-xs text-slate-500"> پایه قیمت </span>
                  <strong> {price.toLocaleString()}</strong>
                  <span className="text-xs text-slate-500"> تومان </span>
                </span>
              )}

              {Number(discount) !== 0 && (
                <span className="text-base rounded-lg p-2 border-orange-100 border-solid border-2">
                  <span className="text-xs text-slate-500">
                    {" "}
                    قیمت با تخفیف{" "}
                  </span>
                  <strong>{discount.toLocaleString()}</strong>
                  <span className="text-xs text-slate-500"> تومان </span>
                </span>
              )}

              {isPromotionActive() && (
                <span className="text-xs rounded-lg p-2">
                  <strong className="text-orange-600 font-bold">
                    دارای تخفیف زمان دار
                  </strong>
                </span>
              )}

              {promotionPrice > 0 && isPromotionActive() && (
                <div className="text-base rounded-lg p-2 border-orange-100 border-solid border-2">
                  <span className="text-xs text-slate-500">
                    {" "}
                    قیمت در پروموشن{" "}
                  </span>
                  <span className="font-bold">
                    {promotionPrice.toLocaleString()}
                    <span className="text-xs text-slate-500 font-normal">
                      {" "}
                      تومان{" "}
                    </span>
                  </span>
                </div>
              )}

              <span className="text-xs rounded-lg p-2">
                {"           "}
                {stock === 0 ? (
                  <span className="font-bold text-red-600">اتمام موجودی</span>
                ) : stock === 1 ? (
                  <span className="font-bold text-orange-500">
                    در حال اتمام
                  </span>
                ) : (
                  <>
                    <span className="text-xs text-slate-500 font-normal">
                      موجودی کل{" "}
                    </span>

                    <strong> {stock.toLocaleString()} </strong>
                    <span className="text-xs text-slate-500 font-normal">
                      عدد
                    </span>
                  </>
                )}
              </span>

              {inColleagueStoke && (
                <span className="text-xs rounded-lg p-2">
                  <strong className="text-blue-600 font-bold">
                    موجود در انبار همکار
                  </strong>
                </span>
              )}
            </div>
          </div>

          <div className=" text-xs md:flex grid  grid-cols-2 gap-6 md:gap-2 items-center">
            <span className="text-xs rounded-lg p-2">
              <span className="text-xs text-slate-500 font-normal">
                وضعیت کلی{" "}
              </span>
              {active ? (
                <span className="font-bold text-green-600">فعال</span>
              ) : (
                <span className="font-bold text-red-600">غیر فعال</span>
              )}
            </span>
            <span className="text-xs rounded-lg p-2">
              <strong
                className={
                  hasSaleAbility
                    ? "text-green-600 font-bold"
                    : "text-red-600 font-bold"
                }
              >
                {hasSaleAbility ? "قابل فروش" : "غیر قابل فروش"}
              </strong>
            </span>
            <div className=" text-xs  flex items-center">
              <span className="text-xs text-slate-500 font-normal">
                کد ویژگی :
              </span>
              {property.code}
            </div>
            <span className="text-xs text-slate-500 font-normal">
              آیدی ویژگی :
            </span>
            {property.id}
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          my: 1,
          justifyContent: "flex-end",
        }}
      >
        <Box className="md:grid md:grid-cols-6 flex flex-col gap-4">
          <div className="">
            <TextInput
              currentValue={code}
              change={setCode}
              label="کد حسابداری"
              disabled
              /*           number={true}
            noSepreate={true} */
            />
          </div>
          <div className="">
            <TextInput
              number={true}
              currentValue={price}
              change={setPrice}
              label="قیمت پایه"
              price={true}
              /*  allowZero={true} */
            />
          </div>
          <div className="">
            <TextInput
              currentValue={discount}
              label="قیمت با تخفیف"
              change={setDiscount}
              number={true}
              smallerthan={price.replace(",", "")}
              errors={"قیمت بعد تخفیف باید از قیمت اصلی کوچیک تر باشد"}
              allowZero={true}
              price={true}
            />
          </div>
          <NumberInput
            label="موجودی کل"
            disabled={!userPermissions?.productProperties.updateStock}
            value={stock}
            change={setStock}
          />
       {/*    <NumberInput
            label="محدودیت پایین ترین تعداد خرید"
            value={min}
            change={setMin}
          /> */}
          <NumberInput
            label="محدودیت بالاترین تعداد خرید"
            value={max}
            change={setMax}
          />{" "}
          <Dropdown
            value={STOCKS_TYPE.find((item) => item?.id === accountingStockId)}
            change={(e) => {
              setAccountingStockId(e.id);
              inColleagueStoke(e.id === 2 ? true : false);
            }}
            data={STOCKS_TYPE}
            title="  موجود در انبار"
          />{" "}
          <div className="flex gap-1 items-center">
            <span className="text-sm min-w-max">موجود در انبار همکار :</span>
            <Switch
              checked={inColleagueStoke}
              onClick={() => {
                setInColleagueStoke(!inColleagueStoke);
                setAccountingStockId(inColleagueStoke ? 0 : 2);
              }}
            />
          </div>
          <div className="md:col-span-4">
            <TextInput
              label="توضیحات"
              currentValue={description}
              change={(e) => {
                setDescription(e);
              }}
            />
          </div>
          {selectedProductImage ? (
            <div className="flex">
              <img
                src={`${baseUrl}/${DOWNLOAD_FILE}/${selectedProductImage}?size=tiny`}
                alt=""
                className="w-20"
              />
              <div className="flex flex-col">
                <Button
                  onClick={() => {
                      setProductImage(null)
                setDisable(false);
                setselectedProductImage(null);
                setOpen(false);
                  }}
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
              {userPermissions?.product?.addGallery && (
                <div
                  onClick={() => setOpen(true)}
                  className="border rounded-md cursor-pointer py-2 px-5 flex items-center justify-center gap-2"
                >
                  <CollectionsIcon className="text-sm text-green-600" />
                  <span className="text-xs ">انتخاب عکس </span>
                </div>
              )}
            </>
          )}
          <div className="flex gap-1 items-center">
            <span className="text-sm ">وضعیت :</span>
            <Switch checked={active} onClick={() => setActive(!active)} />
            <Typography
              sx={{ color: active ? "#2ab32a" : "red" }}
              variant="body2"
            >
              {active ? "فعال" : "غیر فعال"}
            </Typography>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-sm ">تخفیف زمان دار :</span>
            <Switch
              checked={promotion}
              onClick={() => setPromotion(!promotion)}
            />
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-sm min-w-max"> قابل فروش :</span>
            <Switch
              checked={hasSaleAbility}
              onClick={() => setHasSaleAbility(!hasSaleAbility)}
            />
          </div>
          {!promotion && (
            <div className="flex flex-wrap col-span-3 justify-end gap-4">
              {userPermissions?.productProperties?.delete && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setOpenDeleteModal(true)}
                >
                  حذف
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={editPrice}
                disabled={
                  Number(String(discount).replace(/,/g, "")) >=
                    Number(String(price).replace(/,/g, "")) ||
                  Number(price.replace(/,/g, "")) === 0 ||
                  loading ||
                  disable
                }
              >
                {loading ? <CircularProgress /> : <> ثبت تغییرات</>}
              </Button>
            </div>
          )}
          <Collapse
            className="col-span-6 "
            sx={{
              ".MuiCollapse-wrapperInner": {
                display: {
                  md: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
                  rowGap: "20px",
                },
              },
            }}
            in={promotion}
          >
            <Fragment>
              <Divider
                sx={{
                  mb: { md: "30px !important" },
                  ".MuiDivider-wrapper": {
                    marginBottom: "-10px !important",
                  },
                }}
                className="col-span-6 "
              >
                مشخصات تخفیف زمان دار
              </Divider>
              <Promotion
                data={{
                  promotionStock,
                  promotionFrom,
                  promotionTo,
                  promotionPrice,
                  price: property.price,
                  stock: property.stock,
                }}
                setPromotionPrice={handlePromotionPriceChange}
                setPromotionStock={handlePromotionStockChange}
                setPromotionTo={handlePromotionToChange}
                setPromotionFrom={handlePromotionFromChange}
                setRerender={setRerender}
                rerender={rerender}
              />
              {promotion && (
                <div className="flex flex-wrap col-span-2 justify-end gap-4">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setOpenDeleteModal(true)}
                  >
                    حذف
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={editPrice}
                    disabled={
                      Number(String(discount).replace(/,/g, "")) >=
                        Number(String(price).replace(/,/g, "")) ||
                      Number(price.replace(/,/g, "")) === 0 ||
                      loading ||
                      disable
                    }
                  >
                    {loading ? <CircularProgress /> : <> ثبت تغییرات</>}
                  </Button>
                </div>
              )}
            </Fragment>
          </Collapse>
        </Box>
      </AccordionDetails>
      <Modal
        open={open}
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
          <div className="flex justify-center gap-4 items-center mt-3">
            <Button
              variant="contained"
              disabled={!productImage}
              color="error"
              onClick={() => {
                setProductImage(null);
                setDisable(false);
                setselectedProductImage(null);
                setOpen(false);
              }}
            >
              حذف عکس
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setDisable(false);
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
      <Modal
        open={openDeleteModal}
        close={() => {
          setOpenDeleteModal(false);
        }}
        title={`آیا از خذف این محصول با ویژگی ${
          property.productAttribute?.title
        } / ${property.productAttribute2?.title || ""} مطمعن هستید ؟`}
      >
        <div className="flex justify-center gap-3 items-center">
          <Button
            onClick={deletePrice}
            sx={{ width: "250px" }}
            variant="contained"
            color="error"
          >
            بله حذف شود
          </Button>
          <Button
            onClick={() => setOpenDeleteModal(false)}
            sx={{ width: "250px" }}
            variant="outlined"
            color="primary"
          >
            انصراف
          </Button>
        </div>
      </Modal>
    </Accordion>
  );
};

export default CurrentPrice;
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
