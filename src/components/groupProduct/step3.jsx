import { Paper } from "@mui/material";
import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import { NumberInput } from "../common";
import PriceCart from "./priceCart";
const Step3ProductGroup = ({
  selectedProducts,
  data,
  setData,
  setSelectedProduct,
  editMode = false,
}) => {
  const [allProduct, setAllProduct] = useState([[]]);
  const [price, setPrice] = useState("");
  const [hasBunble, setHasBundle] = useState(false);
  const [discount, setDiscount] = useState("");
  useEffect(() => {
    const groupedProducts = selectedProducts.reduce((acc, product) => {
      const foundGroup = acc.find(
        (group) => group[0]?.productId === product.productId
      );
      if (foundGroup) {
        foundGroup.push(product);
        setHasBundle(true);
      } else {
        acc.push([{...product }]);
       
      }
      return acc;
    }, []);
    setAllProduct(groupedProducts);
  }, [selectedProducts]);
  useEffect(() => {
    var a = 0;
    var b = 0;
    selectedProducts?.map((item) => {
      a += Number(item?.discount ? item?.discount : item?.price);
      if (item?.bundleType === 0) {
        b += Number(item?.priceAmount);
      } else if (item?.bundleType === 1) {
        b +=
          Number(item?.discount ? item?.discount : item?.price) -
          Number(item?.priceAmount);
      } else if (item?.bundleType === 2) {
        b +=
          Number(item?.discount ? item?.discount : item?.price) -
          Number(item?.discount ? item?.discount : item?.price) *
            (Number(item?.priceAmount) / 100);
      }
    });
    setDiscount(b);
    setPrice(a);
  }, [selectedProducts]);

  return (
    <div className="flex flex-col gap-6">
      {!hasBunble && (
        <div className="grid grid-cols-10 gap-6">
          <>
            <div className="w-full h-full md:flex justify-start items-center">
              {" "}
              <span className="text-sm text-[#3663CC] font-bold">
                قیمت نهایی محصول تجمیعی
              </span>
            </div>

            <div className="col-span-9 flex flex-wrap gap-6">
              <Paper
                elevation={0}
                className="rounded-lg  border-[#dbdfea] border md:w-80 w-full py-6 md:px-5 px-2 flex flex-col gap-6"
              >
                <span className="text-xs">قیمت اصلی</span>
                <div className="flex items-end gap-1">
                  <span className="text-base font-bold">
                    {price?.toLocaleString()}{" "}
                  </span>
                  <span className="text-sm">تومان </span>
                </div>
              </Paper>
              <Paper
                elevation={0}
                className="rounded-lg  border-[#dbdfea] border md:w-80 w-full py-6 md:px-5 px-2 flex flex-col gap-6"
              >
                <span className="text-xs"> قیمت پس از تخفیف</span>
                <div className="flex items-end gap-1">
                  <span className="text-base font-bold">
                    {" "}
                    {discount?.toLocaleString()}
                  </span>
                  <span className="text-sm">تومان </span>
                </div>
              </Paper>
            </div>
          </>
        </div>
      )}

      <div className="grid md:grid-cols-10 gap-4 b">
        <div className="w-full h-full md:flex justify-start items-center">
          {" "}
          <span className="text-sm  text-[#3663CC] font-bold">
            تعداد و موجودی
          </span>
        </div>
        <div className="col-span-9 flex gap-8 flex-wrap">
          <Paper
            elevation={0}
            className="rounded-lg  border-[#dbdfea] border md:w-auto w-full py-6 md:px-5 px-2 flex flex-col gap-6"
          >
            <div className="flex gap-5 items-center">
              <span className="text-sm">
                محدودیت تعداد فروش این محصول تجمیعی
              </span>{" "}
              <div className="w-20 ">
                <NumberInput
                  value={data?.bundleQty}
                  change={(e) => setData({ ...data, bundleQty: e })}
                />
              </div>
            </div>
          </Paper>
          <Paper
            elevation={0}
            className="rounded-lg  border-[#dbdfea] border md:w-auto w-full py-6 md:px-5 px-2 flex flex-col gap-6"
          >
            <div className="flex gap-5 items-center">
              <span className="text-sm">حداقل تعداد خرید</span>{" "}
              <div className="w-20 ">
                <NumberInput
                  value={data?.minBuy}
                  change={(e) => setData({ ...data, minBuy: e })}
                />
              </div>
            </div>
          </Paper>{" "}
          <Paper
            elevation={0}
            className="rounded-lg  border-[#dbdfea] border md:w-auto w-full py-6 md:px-5 px-2 flex flex-col gap-6"
          >
            <div className="flex gap-5 items-center">
              <span className="text-sm">حداکثر تعداد خرید</span>{" "}
              <div className="w-20 ">
                <NumberInput
                  value={data?.maxBuy}
                  change={(e) => setData({ ...data, maxBuy: e })}
                />
              </div>
            </div>
          </Paper>
          {editMode && (
            <Paper
              elevation={0}
              className="rounded-lg  border-[#dbdfea] border md:w-80 w-full py-6 md:px-5 px-2 flex justify-center flex-col gap-6"
            >
              <div className="flex items-center gap-6">
                <span className="text-sm"> تعداد فروش رفته تا به این لحظه</span>
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-bold">{data?.bundleStock}</span>
                  <span className="text-xs">عدد</span>
                </div>
              </div>
            </Paper>
          )}
        </div>
      </div>

      <div className="md:grid grid-cols-10 gap-6 mt-10 relative">
        <>
          <div className="sticky top-2 h-full">
            {" "}
            <span className="text-sm  text-[#3663CC] font-bold">
              محصولات و تنظیمات
            </span>
          </div>
          <Paper
            elevation={0}
            className="col-span-9  rounded-lg  border-[#dbdfea] md:px-10 gap-5 py-6 flex flex-col"
          >
            {allProduct?.map((arr, index) => (
              <Box
                sx={{
                  ":before": {
                    height: {
                      md: 515 * arr.length - 515 + (arr.length - 1) * 10 + "px",
                      xs: 0,
                      borderColor: COLORS[index],
                    },
                  },
                }}
                className={arr?.length > 1 ? "cart" : ""}
                key={index + "br"}
              >
                {arr?.map((item, i) => (
                  <Fragment key={index + 1 * i + "0j9rg" * (8 + i + index)}>
                    <PriceCart
                      index={index}
                      item={item}
                      setData={(e) => {
                        var temp = [...selectedProducts];
                        var fi = temp?.findIndex((ite) => ite?.id === e.id);
                        temp[fi] = e;
                        setSelectedProduct(temp);
                      }}
                      data={
                        editMode
                          ? selectedProducts?.find(
                              (pr) => pr?.propertyId === item?.propertyId
                            )
                          : selectedProducts?.find(
                              (pr) => pr?.id === item?.id
                            ) || {}
                      }
                      showLine={arr?.length > 1}
                    />
                  </Fragment>
                ))}
              </Box>
            ))}
          </Paper>
        </>
      </div>
    </div>
  );
};

export default Step3ProductGroup;
const COLORS = ["#FF0000", "#5e1ec0", "#c07c1e", "#c07c1e"];
