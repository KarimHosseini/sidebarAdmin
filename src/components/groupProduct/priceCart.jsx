import {
  Checkbox,
  FormControlLabel,
  Paper,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { toast } from "react-toastify";
import { baseUrl, DOWNLOAD_FILE } from "../../helpers/api-routes";
import { NumberInput, ShowImage, TextInput } from "../common";
const COLORS = ["#FF0000", "#5e1ec0", "#c07c1e", "#c07c1e"];
const PriceCart = ({ item, showLine, index, setData, data, qty, setQty }) => {
  return (
    <Paper
      elevation={0}
      sx={{ borderColor: COLORS[index > 4 ? 0 : index] }}
      className="col-span-9 relative border-2 rounded-md border-dashed py-3 px-5 md:h-[515px]"
    >
      {showLine && (
        <>
          <div
            style={{ borderColor: COLORS[index > 4 ? 0 : index] }}
            className="absolute md:block hidden top-[199px] border-t-2 border-dashed w-[20px] left-[-20px] h-[2px]"
          ></div>
          <img
            src="/images/bundle.svg"
            alt="d"
            className="w-[50px] absolute   top-[70px] left-[-15px]"
          />
        </>
      )}
      <div className="flex justify-between items-center py-2">
        <div className="flex gap-2">
          <img
            src={
              item?.galleryId
                ? `${baseUrl}/${DOWNLOAD_FILE}/${item?.galleryId}?size=tiny`
                : "/images/no_image.svg"
            }
            className="md:w-[72px] w-[40px]"
            alt="img"
          />{" "}
          <div className="flex flex-col gap-3">
            <span className="text-[1.3rem] font-semibold ">{item?.title} </span>
            <div className="text-xs text-[1rem] flex gap-1 ">
              {item?.productAttribute?.type === 1 && (
                <>
                  {item?.productAttribute?.galleryId ? (
                    <ShowImage
                      smallImage={true}
                      address={item?.productAttribute?.galleryId}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: item?.productAttribute?.value,
                      }}
                    ></Box>
                  )}
                </>
              )}
              {item?.productAttribute ? (
                <>{item?.productAttribute?.title}</>
              ) : (
                <></>
              )}{" "}
              {item?.productAttribute2 ? (
                <>{item?.productAttribute2?.title}</>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <a
          href={`/products/${item?.productId}`}
          target="_blank"
          className="flex  flex-col gap-2"
          rel="noreferrer"
        >
          <Box
            sx={{ background: COLORS[index > 4 ? 0 : index] }}
            className="px-2 py-1 text-white rounded-2xl text-xs"
          >
            کد محصول : {item?.productId}
          </Box>
          <span className="text-xs">آیدی ویژگی : {item?.id}</span>
        </a>
      </div>
      <Box className="md:grid md:grid-cols-6 gap-8 flex-col flex justify-between items-center gap-6mt-6 py-4 px-4">
        {" "}
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
          onChange={() => setData({ ...data, showStock: !data?.showStock })}
          control={<Checkbox size="small" checked={data?.showStock} />}
          label={<span className="text-xs  "> نمایش تعداد انبار</span>}
        />
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
          onChange={() => setData({ ...data, showPrice: !data?.showPrice })}
          control={<Checkbox size="small" checked={data?.showPrice} />}
          label={<span className="text-xs  ">نمایش قیمت</span>}
        />
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
          onChange={() =>
            setData({ ...data, showProperty: !data?.showProperty })
          }
          control={<Checkbox size="small" checked={data?.showProperty} />}
          label={<span className="text-xs  ">نمایش ویژگی های قیمتی</span>}
        />{" "}
        {showLine && (
          <div className="col-span-2">
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
              onChange={() =>
                setData({ ...data, isGroup: data?.isGroup ? false : true })
              }
              control={<Checkbox checked={data?.isGroup} size="small" />}
              label={
                <span className="text-xs  ">
                  "گروه بندی با محصول اصلی " قابلیت انتخاب ویژگی قیمتی درون
                  محصولی
                </span>
              }
            />
          </div>
        )}
      </Box>
      <div className="flex flex-col gap-2 px-4 py-5">
        <div className="flex md:items-center md:flex-row flex-col md:gap-5 gap-8 pb-6 mb-0 ">
          <span className="text-xs"> تعداد فروش در هر بار</span>
          <div className="md:max-w-[80px]">
            {" "}
            <NumberInput
              change={(e) => setData({ ...data, num: e })}
              value={data?.num || ""}
              label="محدودیت"
            />
          </div>{" "}
          <div className="md:max-w-[180px] boldError">
            <TextField
              InputLabelProps={{ shrink: true }}
              value={data?.stock}
              disabled
              fullWidth
              error={data?.stock === 0}
              label="تعداد موجود در انبار"
            />
          </div>
        </div>{" "}
        <TextField
          InputLabelProps={{ shrink: true }}
          value={data?.description}
          fullWidth
          error={data?.description === 0}
          label="  توضیحات "
        />
        <div className="flex flex-col gap-1 border border-[#3663CC] rounded-lg">
          <Box
            sx={{
              background: (theme) =>
                data?.bundleType === 0
                  ? theme.palette.mode === "dark"
                    ? "#423e1f"
                    : "#eef3acbd"
                  : "",
            }}
            className="p-3"
          >
            <div className="md:grid grid-cols-4 flex flex-col gap-4 ">
              {" "}
              <FormControlLabel
                value="sabet"
                control={<Radio checked={data?.bundleType === 0} />}
                label="اعمال قیمت    ثابت "
                onChange={() =>
                  setData({
                    ...data,
                    bundleType: 0,
                    priceAmount: "",
                  })
                }
              />{" "}
              <div className="flex flex-col gap-2">
                <Typography
                  sx={{
                    color: (theme) => theme.palette.primary.dark,
                    fontSize: "0.7rem !important",
                  }}
                  className="text-xs"
                >
                  قیمت اصلی سایت
                </Typography>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {item?.discount
                      ? item?.discount?.toLocaleString()
                      : item?.price?.toLocaleString()}
                  </span>
                  <span className="text-xs">تومان</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <TextInput
                  change={(e) => {
                    if (Number(e) === 0) {
                      toast.error("قیمت نمی تواند صفر باشد");
                    } else {
                      setData({ ...data, priceAmount: e });
                    }
                  }}
                  currentValue={data?.bundleType === 0 ? data?.priceAmount : ""}
                  label="قیمت   جدید  در باندل"
                  price
                  number
                  disabled={data?.bundleType !== 0}
                  full
                />
              </div>
              <div className="flex flex-col gap-2">
                {/*   <TextInput
                change={(e) => setData({ ...data, FixDiscount: e })}
                currentValue={data?.bundleType === 0 ? data?.FixDiscount : ""}
                label="  قیمت با تخفیف"
                price
                disabled={data?.bundleType !== 0}
              /> */}
              </div>
            </div>
          </Box>
          <Box
            sx={{
              background: (theme) =>
                data?.bundleType === 1
                  ? theme.palette.mode === "dark"
                    ? "#423e1f"
                    : "#eef3acbd"
                  : "",
            }}
            className="p-3"
          >
            <div className="md:grid grid-cols-4 gap-4 flex flex-col">
              <FormControlLabel
                value="female"
                onChange={() =>
                  setData({
                    ...data,
                    bundleType: 1,
                    priceAmount: "",
                  })
                }
                control={<Radio checked={data?.bundleType === 1} />}
                label="  قیمت گذاری تکی با 
            تخفیف مقداری   "
              />
              <div className="flex flex-col gap-2">
                <Typography
                  sx={{
                    color: (theme) => theme.palette.primary.dark,
                    fontSize: "0.7rem !important",
                  }}
                  className="text-xs"
                >
                  قیمت اصلی سایت
                </Typography>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {item?.discount
                      ? item?.discount?.toLocaleString()
                      : item?.price?.toLocaleString()}
                  </span>
                  <span className="text-xs">تومان</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <TextInput
                  disabled={data?.bundleType !== 1}
                  change={(e) => {
                    if (e >= (item?.discount ? item?.discount : item?.price)) {
                      toast.error(
                        "مبلغ تخفیف نمی تواند با مبلغ محصول برابر یا بیشتر باشد"
                      );
                    } else {
                      setData({ ...data, priceAmount: e });
                    }
                  }}
                  currentValue={data?.bundleType === 1 ? data?.priceAmount : ""}
                  label="    مبلغ تخفیف"
                  price
                  smallerthan={
                    (item?.discount ? item?.discount : item?.price) - 1
                  }
                  number
                  errors=" تخفیف نباید از مبلغ اصلی مساوی یا بیشتر باشد"
                />
              </div>{" "}
              <TextField
                disabled
                value={
                  data?.bundleType === 1
                    ? (
                        (item?.discount ? item?.discount : item?.price) -
                        data?.priceAmount
                      )?.toLocaleString()
                    : ""
                }
                label="قیمت پس از تخفیف"
                InputLabelProps={{ shrink: true }}
                fullWidth
                number
              />
            </div>
          </Box>
          <Box
            sx={{
              background: (theme) =>
                data?.bundleType === 2
                  ? theme.palette.mode === "dark"
                    ? "#423e1f"
                    : "#eef3acbd"
                  : "",
            }}
            className="p-3"
          >
            <div className="grid md:grid-cols-4 gap-4 ">
              <FormControlLabel
                value="female"
                onChange={() =>
                  setData({
                    ...data,
                    bundleType: 2,
                    priceAmount: "",
                  })
                }
                control={<Radio checked={data?.bundleType === 2} />}
                label=" اعمال تخفیف درصدی "
              />
              <div className="flex flex-col gap-2">
                <Typography
                  sx={{
                    color: (theme) => theme.palette.primary.dark,
                    fontSize: "0.7rem !important",
                  }}
                  className="text-xs"
                >
                  قیمت اصلی سایت
                </Typography>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {item?.discount
                      ? item?.discount?.toLocaleString()
                      : item?.price?.toLocaleString()}
                  </span>
                  <span className="text-xs">تومان</span>
                </div>
              </div>
              <div>
                {" "}
                <NumberInput
                  disabled={data?.bundleType !== 2}
                  value={data?.bundleType === 2 ? data?.priceAmount : ""}
                  change={(e) => {
                    if (e >= 100) {
                      toast.error("درصد تخفیف نمی تواند بیشتر از ۹۹ باشد");
                    } else {
                      setData({ ...data, priceAmount: e });
                    }
                  }}
                  label="درصد تخفیف"
                  max={99}
                  min={0}
                />
                {/*      <div className="border  flex items-center justify-between w-full px-2 gap-5 py-1">
                  <span className="text-xs">درصد تخفیف</span>
                  <div className="max-w-[100px]">
                    {" "}
                    <NumberInput
                      disabled={data?.bundleType !== 2}
                      value={data?.bundleType === 2 ? data?.priceAmount : ""}
                      change={(e) => setData({ ...data, priceAmount: e })}
                      label="درصد تخفیف"
                      max={100}
                      min={0}
                    />
                  </div>
                </div> */}
              </div>

              <TextField
                disabled
                value={
                  data?.bundleType === 2 && data?.priceAmount
                    ? (
                        Number(item?.discount ? item?.discount : item?.price) -
                        Number(item?.discount ? item?.discount : item?.price) *
                          (Number(data?.priceAmount) / 100)
                      )?.toLocaleString()
                    : ""
                }
                label="قیمت پس از تخفیف"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </div>
          </Box>
        </div>
      </div>
    </Paper>
  );
};

export default PriceCart;
