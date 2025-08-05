import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { ShowImage } from "../../components/common";

const Details = ({ value, orderData, orderItems }) => {
  if (!orderData) return <></>;
  return (
    <>
      {" "}
      {value === 0 && (
        <div className="overflow-x-auto border-t py-5 pt-1 px-5 mb-5 mt-1">
          <span className="text-lg font-bold">اقلام سفارش</span>
          <div className="min-w-[900px] bigTable">
            <Table sx={{ minWidth: 650, mt: 3 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {orderData.mode === 1 ? (
                    <>
                      {" "}
                      {[
                        "نام محصول",
                        "توضیحات محصول",
                        "تعداد",
                     /*    "تخفیف", */
                        "نوع تخفیف",
                   /*      "قیمت قبل از تخفیف", */
                        "مبلغ کالا",
                        "مبلغ کالا با ارزش افزوده",
                        " موجود در انبار همکار",
                      ].map((item) => (
                        <TableCell key={item}>{item}</TableCell>
                      ))}
                    </>
                  ) : orderData?.type === 1 ? (
                    <>
                      {" "}
                      {[
                        "عکس محصول",

                        "کد محصول",
                        "نام محصول",
                        "کد ویژگی",
                        "ویژگی محصول",
                        "تعداد",
                    /*     "تخفیف", */
                        "نوع تخفیف",
                   /*      "قیمت قبل از تخفیف", */
                        "مبلغ کالا",
                        "قیمت  تسهیلاتی بدون پیش پرداخت",
                        "تامین کننده",
                        " موجود در انبار همکار",
                      ].map((item) => (
                        <TableCell key={item}>{item}</TableCell>
                      ))}
                    </>
                  ) : (
                    <>
                      {[
                        "عکس محصول",

                        "کد محصول",
                        "نام محصول",
                        "کد ویژگی",
                        "ویژگی محصول",
                        "تعداد",
                      /*   "تخفیف", */
                        "نوع تخفیف",
                     /*    "قیمت قبل از تخفیف", */
                        "مبلغ کالا",
                        "مبلغ کالا با ارزش افزوده",
                        "تامین کننده",
                        " موجود در انبار همکار",
                      ].map((item) => (
                        <TableCell key={item}>{item}</TableCell>
                      ))}
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {orderItems?.map((orderItem, i) => {
                  const {
                    price,
                    discount,
                    qty,
                    productProperty,
                    final,
                    supplier,
                    total,
                    productId,
                    productBundleId,
                    saleType,
                    isFake,
                    inColleagueStoke,
                    insuranceVat,
                  } = orderItem;
                  var productProperties = productProperty
                    ? productProperty
                    : [];
                  const { title, code, image, arrtib1, arrtib2, description } =
                    productProperties;
                  var at2 = arrtib2?.title ? "/" + arrtib2?.title : "";
                  const insurance = orderItem.insurance
                    ? JSON.parse(orderItem.insurance)
                    : null;
                  const services = orderItem.OrderDetailsService;
                  const att =
                    orderData.mode !== 1
                      ? arrtib1?.title + at2
                      : orderItem.title;
                  return (
                    <Fragment key={i}>
                      <TableRow>
                        {orderData.mode !== 1 ? (
                          <>
                            {" "}
                            <TableCell>
                              <ShowImage address={image} />
                            </TableCell>
                            <TableCell>
                              {" "}
                              <Link
                                target={"_blank"}
                                to={
                                  productBundleId
                                    ? `/groupProduct/${productBundleId}`
                                    : `/products/${productId}`
                                }
                              >
                                <Typography
                                  sx={{
                                    textAlign: "center",
                                    p: 1,
                                    background: (theme) =>
                                      theme.palette.mode === "light"
                                        ? "#fdf2f2"
                                        : "#47402b",
                                    width: "100%",
                                    cursor: "pointer",
                                    fontWeight: "400 !important",
                                    "&:hover": {
                                      background: (theme) =>
                                        theme.palette.mode === "light"
                                          ? "rgb(253 224 71)"
                                          : "#A75707",
                                    },
                                  }}
                                  /*    component="mark" */
                                  variant="body2"
                                  className=" rounded-md"
                                >
                                  {productId}
                                </Typography>
                              </Link>
                            </TableCell>
                            <TableCell>
                              {" "}
                              {productBundleId && (
                                <> محصول تجمیعی - آیدی ‌ {productBundleId} - </>
                              )}{" "}
                              {title} {isFake ? "(غیر اصلی)" : ""}
                            </TableCell>{" "}
                            {[
                              code,
                              `${att} ${description ? `/${description}` : ""}`,
                              qty,

/*                               discount.toLocaleString() || "",
 */                              saleType === 1 ? "promotion" : "عادی",
/*                               basePrice.toLocaleString() || "",
 */                              total.toLocaleString() || "",
                              final.toLocaleString() || "",
                              supplier,
                            ].map((val, i) => (
                              <TableCell key={i}>{val}</TableCell>
                            ))}{" "}
                            <TableCell>
                              {inColleagueStoke ? "بلی" : "خیر"}
                            </TableCell>
                          </>
                        ) : (
                          <>
                            {" "}
                            {[
                              `${att} ${description ? `/${description}` : ""}`,
                              orderItem.description,
                              qty,

/*                               discount.toLocaleString() || "",
 */                              saleType === 1 ? "promotion" : "عادی",
/*                               basePrice.toLocaleString() || "",
 */                              total.toLocaleString() || "",
                              orderItem.finalPrice.toLocaleString() || "",
                            ].map((val, i) => (
                              <TableCell key={i}>{val}</TableCell>
                            ))}
                            <TableCell>
                              {inColleagueStoke ? "بلی" : "خیر"}
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                      {insurance && (
                        <TableRow>
                          <>
                            <TableCell>
                              <ShowImage address={insurance.galleryId} />
                            </TableCell>
                            <TableCell> {insurance.id}</TableCell>
                            <TableCell>
                              {insurance.title} برای {title}
                            </TableCell>{" "}
                            <TableCell>{insurance.code}</TableCell>
                            <TableCell>{insurance.description}</TableCell>
                            <TableCell>{insurance.qty}</TableCell>
                    {/*         <TableCell>
                              {insurance.discount.toLocaleString()}
                            </TableCell> */}
                            <TableCell>عادی</TableCell>
                  {/*           <TableCell>
                              {insurance.totalPrice.toLocaleString()}
                            </TableCell> */}
                            <TableCell>
                              {insurance.priceWithDiscount
                                ? insurance.priceWithDiscount.toLocaleString()
                                : insurance.totalPrice.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {insurance.priceWithDiscount
                                ? (
                                    insurance.priceWithDiscount + insuranceVat
                                  ).toLocaleString()
                                : (
                                    insurance.totalPrice + insuranceVat
                                  ).toLocaleString()}
                            </TableCell>
                            <TableCell>{insurance.type}</TableCell>
                          </>
                        </TableRow>
                      )}
                      {
                        services?.map((service,i)=>{
                          return (
                            <TableRow key={i}>
                           <>
                            <TableCell>
                              <ShowImage address={service.galleryId} />
                            </TableCell>
                            <TableCell> {service.id}</TableCell>
                            <TableCell>
                              {service.title} برای {title}
                            </TableCell>{" "}
                            <TableCell>{service.code}</TableCell>
                            <TableCell>{service.description}</TableCell>
                            <TableCell>{service.qty}</TableCell>
                           {/*  <TableCell>
                              {service.discount.toLocaleString()}
                            </TableCell> */}
                            <TableCell>عادی</TableCell>
                       {/*      <TableCell>
                              {service.totalPrice.toLocaleString()}
                            </TableCell> */}
                            <TableCell>
                              {service.priceWithDiscount
                                ? service.priceWithDiscount.toLocaleString()
                                : service.totalPrice.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {service.priceWithDiscount
                                ? (
                                    service.priceWithDiscount
                                  ).toLocaleString()
                                : (
                                    service.totalPrice
                                  ).toLocaleString()}
                            </TableCell>
                            <TableCell>{service.type}</TableCell>
                          </>
                            </TableRow>
                          )
                        })
                      }
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
};

export default Details;
