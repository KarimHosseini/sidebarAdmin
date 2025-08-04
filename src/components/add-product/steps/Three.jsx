/* eslint-disable no-extend-native */
/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Box, Button, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  baseUrl,
  EDIT_MULTIPLE_PRODUCT_PROPERTIES,
  GET_PRODUCT_ATTR,
  SINGLE_PRODUCT,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";

import { ActionButton, Dropdown } from "../../common";
import axiosInstance from "../../dataFetch/axiosInstance";
import SetPricesAccordion from "../SetPricesAccordion";
const StepThree = ({ nextStep, createdId, createdName }) => {
  const { token } = useSelector((state) => state.user);

  const [firstAttrs, setFirstAttrs] = useState([]);
  const [secondAttrs, setSecondAttrs] = useState([]);
  const [firstAttr, setFirstAttr] = useState("");
  const [secondAttr, setSecondAttr] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [properties, setProperties] = useState([]);
  const [images, setImages] = useState([]);
  const [allValues, setAllValues] = useState([]);
  const [firstValues, setFirstValues] = useState([]);
  const [secondValues, setSecondValues] = useState([]);

  const [disableSubmit, setDisableSubmit] = useState(false);

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
  const getAttributes = () => {
    axiosInstance(
      `${baseUrl}/${GET_PRODUCT_ATTR}?productId=${createdId}`,
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
    axiosInstance(
      `${baseUrl}/${SINGLE_PRODUCT}?id=${createdId}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setImages(data.data.images);
      })
      .catch((err) => {});
  };
  const submit = () => {
    let fd = new FormData();
    fd.append("productId", parseInt(createdId));
    fd.append("productProperties", JSON.stringify(properties));
    setLoading(true);
    axiosInstance
      .put(
        `${baseUrl}/${EDIT_MULTIPLE_PRODUCT_PROPERTIES}`,
        fd,
        configReq(token)
      )
      .then((res) => {
        setLoading(false);

        toast.success("با موفقیت انجام شد");

        nextStep();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 405) {
          setDisableSubmit(true);
        } else {
        }
      });
  };

  useEffect(() => {
    getAttributes();
  }, []);
  useEffect(() => {
    if (firstAttr && allValues) {
      setFirstValues(
        allValues
          .filter(
            (val) => Number(val.attributeId) === Number(firstAttr.attributeId)
          )
          .map((item) => ({ ...item, title: item.subAttributeTitle }))
      );
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
  return (
    <>
      <div className="flex items-center justify-between">
        <Typography variant="body1" className="text-[#262626]">
          قیمت گذاری ویژگی محصول
        </Typography>
      </div>
      <Divider sx={{ borderStyle: "dashed !important" }} />
      {step === 1 && (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "flex-end",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              width: "100%",
            }}
            className="grid md:grid-cols-3 gap-3"
          >
            <div>
              {firstAttrs?.length > 0 && (
                <Dropdown
                  title="متغیر اول"
                  data={firstAttrs}
                  value={firstAttr}
                  change={(item) => {
                    setFirstAttr({ ...item, title: item.attributeTitle });
                    setSecondAttrs(
                      [...firstAttrs].filter(
                        (attr) => attr.attributeId !== item.attributeId
                      )
                    );
                  }}
                />
              )}
            </div>
            <div>
              {firstAttrs?.length > 1 && (
                <Dropdown
                  title="متغیر دوم"
                  data={secondAttrs}
                  value={secondAttr}
                  click={(item) => {
                    setSecondAttr({ ...item, title: item.attributeTitle });
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
                      toast.error("حداقل یک متغیر را انتخاب کنید");
                    }
                  }}
                  variant="contained"
                >
                  انتخاب ویژگی ها
                </Button>
              </Box>
            )}
          </Box>

          {firstAttrs?.length === 0 && (
            <Typography sx={{ textAlign: "center" }}>
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
        >
          <SetPricesAccordion
            firstVals={firstValues}
            secondVals={secondValues}
            properties={properties}
            setDisableSubmit={setDisableSubmit}
            addItem={(item) => setProperties([...properties, item])}
            setProperties={setProperties}
            images={images}
          />
        </Box>
      )}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Link to={`/products/${createdId}#step3`}>
          <Button variant="outlined">بازگشت</Button>
        </Link>

        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <ActionButton
            click={submit}
            title="ثبت نهایی"
            disable={
              disableSubmit ||
              (secondValues.length === 0
                ? properties?.length < firstValues.length
                : properties?.length < firstValues.length * secondValues.length)
            }
          />
        </Box>
      </Box>
      <Alert sx={{ my: 3 }} variant="outlined" severity="info">
        قیمت گذاری بدون مالیات درنظر گرفته شود
      </Alert>{" "}
      <Alert sx={{ my: 3 }} variant="outlined" severity="info">
        رنگ بندی اولین گزینه انتخاب شود
      </Alert>{" "}
      <Alert sx={{ my: 3 }} variant="outlined" severity="info">
        درصورتی محصول با یک ویژگی قیمتی مانند رنگبندی ساخته شده ، و پس از اگر می
        خواهید ویژگی دومی را پس از ساخت محصول به محصول بیافزایید ، باید ویژگی
        تکی را در صورتی که سفارش نخورده باشد ، حذف کنید و مجداد ویژگی های جدید
        را اضافه کنید
      </Alert>
    </>
  );
};

export default StepThree;
