/* eslint-disable array-callback-return */
/* eslint-disable no-extend-native */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Alert,
  Box,
  Button,
  Divider,
  Skeleton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ALL_PRICES,
  baseUrl,
  EDIT_MULTIPLE_PRODUCT_PROPERTIES,
  GET_PRODUCT_ATTR,
} from "../../helpers/api-routes";
import { configReq, snackMaker } from "../../helpers/functions";
import { addSnack } from "../../redux/slices/snacks";
import SetPricesAccordion from "../add-product/SetPricesAccordion";
import { ActionButton, Dropdown } from "../common";
import axiosInstance from "../dataFetch/axiosInstance";
import CurrentPrice from "./CurrentPrice";

const Pricing = ({ data, atterbuiteData, refresh, images }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [firstAttrs, setFirstAttrs] = useState([]);
  const [firstAttrsChoosen, setFirstAttrsChoosen] = useState([]);
  const [secondAttrs, setSecondAttrs] = useState([]);
  const [secondAttrsChoosen, setSecondAttrsChoosen] = useState([]);
  const [firstAttr, setFirstAttr] = useState("");
  const [secondAttr, setSecondAttr] = useState("");
  const [optionLength, setOptionLength] = useState(null);

  const [allValues, setAllValues] = useState([]);
  const [firstValues, setFirstValues] = useState([]);
  const [secondValues, setSecondValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [disableSubmit, setDisableSubmit] = useState(false);

  const [currentProperties, setCurrentProperties] = useState([]);
  const [properties, setProperties] = useState([]);

  const [forceUpdate, setForceUpdate] = useState(false);

  Array.prototype.contains = function (v) {
    for (var i = 0; i < this.length; i++) {
      if (this[i].attributeId === v.attributeId) return true;
    }
    return false;
  };

  Array.prototype.unique = function () {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
      if (!arr.contains(this[i])) {
        arr.push(this[i]);
      }
    }
    return arr;
  };

  useEffect(() => {
    setLoading(true);
    axiosInstance(
      `${baseUrl}/${ALL_PRICES}?Page=1&Limit=20&filter[0][key]=productId&filter[0][value]=${id}&filter[0][operator]=eq`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data.code === 200) {
          setCurrentProperties(data.data);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
    axiosInstance(
      `${baseUrl}/${GET_PRODUCT_ATTR}?productId=${id}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data.code === 200) {
          setAllValues(data.data);
          setFirstAttrs(data.data.unique());
        }
      })
      .catch((err) => {});
  }, [data, forceUpdate]);
  const submit = () => {
    let fd = new FormData();
    fd.append("productId", parseInt(id));
    fd.append("productProperties", JSON.stringify(properties));

    axiosInstance
      .put(
        `${baseUrl}/${EDIT_MULTIPLE_PRODUCT_PROPERTIES}`,
        fd,
        configReq(token)
      )
      .then((res) => {
        toast.success("با موفقیت انجام شد");
        refresh();
        setForceUpdate(!forceUpdate);
        setProperties([]);
        setStep(1);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        refresh();
      });
  };

  useEffect(() => {
    if (firstAttr && allValues) {
      const allIds = allValues
        ?.filter((item) => item?.attributeType === 2)
        ?.map((it) => it.subAttributeId);
      const finding = allIds?.every((ids) =>
        currentProperties.some(
          (pr) => pr.productAttribute2?.subAttribId === ids
        )
      );
      if (finding) {
        setFirstValues(
          allValues
            .filter((val) => val.attributeId === firstAttr.attributeId)
            .filter(
              (ar) =>
                !currentProperties.find(
                  (rm) => rm.productAttribute?.subAttribId === ar.subAttributeId
                )
            )
            .map((item) => ({ ...item, title: item.subAttributeTitle }))
        );
      } else {
        setFirstValues(
          allValues
            .filter((val) => val.attributeId === firstAttr.attributeId)
            .map((item) => ({ ...item, title: item.subAttributeTitle }))
        );
      }
    }
  }, [firstAttr]);

  useEffect(() => {
    if (secondAttr && allValues) {
      setSecondValues(
        allValues
          .filter((val) => val.attributeId === secondAttr.attributeId)
          .map((item) => ({ ...item, title: item.subAttributeTitle }))
      );
    }
  }, [secondAttr]);

  useEffect(() => {
    if (currentProperties.length > 0) {
      currentProperties?.map((item) => {
        if (item?.productAttribute) {
          const options1 = firstAttrs.find(
            (itm) => itm?.attributeTitle === item?.productAttribute?.attrib
          );
          setFirstAttrsChoosen([
            { ...options1, title: options1?.attributeTitle },
          ]);
        }
        if (item?.productAttribute2) {
          const options1 = firstAttrs.find(
            (itm) => itm?.attributeTitle === item?.productAttribute2?.attrib
          );
          setSecondAttrsChoosen([options1]);
        }
      });
    } else {
      setFirstAttrsChoosen(firstAttrs);
      /*       setSecondAttrsChoosen(firstAttrs);
       */
    }
  }, [currentProperties, firstAttrs]);

  return (
    <>
      <Box sx={{ mt: 2 }} className="px-4 md:px-0">
        <Typography>قیمت های فعلی:</Typography>
        <Box sx={{ pt: 2 }}>
          {loading ? (
            <>
              <div className="flex flex-col gap-4">
                <Skeleton width={"100%"} height={250} />
                <Skeleton width={"100%"} height={250} />
                <Skeleton width={"100%"} height={250} />
              </div>
            </>
          ) : (
            <>
              {" "}
              {currentProperties.map((property, i) => (
                <CurrentPrice
                  key={`${property.code} ${i}`}
                  property={property}
                  refresh={() => {
                    refresh();
                    setForceUpdate(!forceUpdate);
                  }}
                  currentProperties={currentProperties}
                  index={i}
                  images={images}
                />
              ))}
              {currentProperties.length === 0 && <i>قیمت گذاری نشده است</i>}
            </>
          )}
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      {step === 1 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            gap: 3,
            flexDirection: "column",
          }}
          className="px-4 md:px-0 pb-3"
        >
          <Box
            sx={{
              width: "100%",
            }}
            className="grid md:grid-cols-3 gap-5"
          >
            <div>
              {firstAttrsChoosen?.length > 0 && (
                <Dropdown
                  title="متغیر اول"
                  data={firstAttrsChoosen}
                  value={firstAttr}
                  click={(item) => {
                    setFirstAttr(item);
                    setSecondAttrs(
                      [...firstAttrs].filter(
                        (attr) => attr.attributeId !== item.attributeId
                      )
                    );
                    if (secondAttrsChoosen?.length === 0) {
                      setSecondAttrsChoosen(
                        [...firstAttrs].filter(
                          (attr) => attr.attributeId !== item.attributeId
                        )
                      );
                    }
                  }}
                />
              )}
            </div>

            <div>
              {" "}
              {secondAttrsChoosen?.length > 0 && (
                <Dropdown
                  title="متغیر دوم"
                  data={secondAttrsChoosen}
                  value={secondAttr}
                  click={(item) => {
                    setSecondAttr(item);
                  }}
                  disabled={!firstAttr}
                />
              )}
            </div>

            {firstAttrs?.length > 0 && (
              <Box sx={{ display: "flex", justifyContent: "end" }}>
                <Button
                  onClick={() => {
                    if (firstAttr) {
                      setStep(2);
                    } else {
                      dispatch(
                        addSnack(
                          snackMaker("info", "حداقل یک متغیر را انتخاب کنید")
                        )
                      );
                    }
                  }}
                  variant="contained"
                >
                  انتخاب
                </Button>
              </Box>
            )}
          </Box>

          {firstAttrs?.length === 0 && (
            <Typography
              sx={{ textAlign: "center", fontStyle: "italic", width: "100%" }}
            >
              هیچ ویژگی برای این محصول انتخاب نشده
            </Typography>
          )}
        </Box>
      )}
      {step === 2 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
          }}
          className="px-4 md:px-0 pb-4"
        >
          <SetPricesAccordion
            firstVals={firstValues}
            secondVals={secondValues}
            properties={properties}
            setDisableSubmit={setDisableSubmit}
            addItem={(item) => setProperties([...properties, item])}
            setProperties={setProperties}
            currentProperties={currentProperties}
            optionLength={(e) => setOptionLength(e)}
            images={images}
          />{" "}
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <ActionButton
              click={submit}
              title="ثبت نهایی"
              disable={
                firstValues?.length === 0 || optionLength
                  ? optionLength !== properties?.length
                  : disableSubmit ||
                    (secondValues.length === 0
                      ? properties?.length < firstValues.length
                      : properties?.length <
                        firstValues.length * secondValues.length)
              }
            />
          </Box>
        </Box>
      )}
      <Alert sx={{ my: 1 }} variant="outlined" severity="info">
        قیمت گذاری بدون مالیات درنظر گرفته شود
      </Alert>{" "}
      <Alert sx={{ my: 1 }} variant="outlined" severity="info">
        رنگ بندی اولین گزینه انتخاب شود
      </Alert>
      <Alert sx={{ my: 1 }} variant="outlined" severity="info">
        درصورتی محصول با یک ویژگی قیمتی مانند رنگبندی ساخته شده ، و پس از اگر می
        خواهید ویژگی دومی را پس از ساخت محصول به محصول بیافزایید ، باید ویژگی
        تکی را در صورتی که سفارش نخورده باشد ، حذف کنید و مجداد ویژگی های جدید
        را اضافه کنید
      </Alert>
    </>
  );
};

export default Pricing;
