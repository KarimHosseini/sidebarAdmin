import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Switch,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";

import CollectionsIcon from "@mui/icons-material/Collections";
import { useState } from "react";
import { baseUrl, DOWNLOAD_FILE } from "../../helpers/api-routes";

import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Dropdown, Modal, NumberInput, TextInput } from "../common";

const SetPriceForm = ({
  setDisableSubmit,
  submit,
  first,
  second = null,
  properties,
  setProperties,
  images,
}) => {
  const [checked, setChecked] = useState(false);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [accountingStockId, setAccountingStockId] = useState(0);

  const [price, setPrice] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [active, setActive] = useState(true);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1);
  const [stack, setStack] = useState(0);
  const [productImage, setProductImage] = useState(undefined);
  const [priceId, setPriceId] = useState();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [inColleagueStoke, setInColleagueStoke] = useState(false);
  const [hasSaleAbility, setHasSaleAbility] = useState(true);

  const [openAccordian, setOpenAccordian] = useState(true);
  const [changed, setChanged] = useState(false);
  const [selectedProductImage, setselectedProductImage] = useState(null);
  const sumbitHandler = () => {
    if (
      Number(String(discount).replace(/,/g, "")) <=
        Number(String(price).replace(/,/g, "")) &&
      parseInt(min) <= parseInt(max)
    ) {
      setDisableSubmit(false);
      const item = {
        productAttributeId: first?.subAttributeId,
        productAttribute2Id: second?.subAttributeId || null,

        price: Number(String(price)?.replace(/,/g, "")),
        discount: Number(String(discount)?.replace(/,/g, "")),
        maxBuy: max,
        minBuy: 0,
        qty: stack,
        active: active,
        fromGallery: productImage,
        inColleagueStoke: inColleagueStoke,
        description,
        hasSaleAbility: Boolean(hasSaleAbility),
        accountingStockId,
      };
      if (
        !!properties.find(
          (property) =>
            property.productAttributeId === item.productAttributeId &&
            property.productAttribute2Id === item.productAttribute2Id
        )
      ) {
        setProperties([
          ...properties.filter(
            (property) =>
              property.productAttributeId !== item.productAttributeId ||
              property.productAttribute2Id !== item.productAttribute2Id
          ),
          item,
        ]);
      } else {
        setChecked(true);
        submit(item);
      }
    } else if (parseInt(min) > parseInt(max)) {
      toast.error("محدودیت پایین ترین تعداد خرید باید از حداکثر کمتر باشد");
    } else if (
      Number(String(discount)?.replace(/,/g, "")) >
      Number(String(price)?.replace(/,/g, ""))
    ) {
      toast.error("تخفیف باید از قیمت کمتر باشد");
    } else {
      toast.error("کد تجاری را وارد کنید");
    }
  };
  return (
    <Accordion
      elevation={0}
      sx={{
        backgroundColor: checked && green[50],
        border: "1px solid rgba(0, 0, 0, 0.12)",
      }}
      expanded={openAccordian}
    >
      <AccordionSummary
        sx={{
          ".MuiAccordionSummary-content": {
            display: "flex",
            alignItems: "center !important",
            rowGap: 2,
            columnGap: 1,
          },
        }}
        expandIcon={<ExpandMore />}
        onClick={() => setOpenAccordian(!openAccordian)}
      >
        <Checkbox sx={{ ml: 2 }} checked={checked} color="success" />
        {first?.attributeTitle === "رنگبندی" && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: first?.subAttributeValue,
            }}
          ></Box>
        )}
        <Typography sx={{ fontSize: { md: "1rem", xs: "1rem" } }}>
          {first?.title} {`${second ? "/" + second?.title : ""}`}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Box className="grid md:grid-cols-6 gap-5">
            {/*         <div className="max-w-xs">
              <TextInput
                currentValue={code}
                change={(e) => {
                  setCode(e);
                  setChanged(true);
                }}
                label="کد حسابداری"
     
              />
            </div> */}
            <div className="max-w-xs">
              {" "}
              <TextInput
                currentValue={price}
                label="قیمت"
                number={true}
                change={(e) => {
                  setPrice(e);
                  setChanged(true);
                }}
                price={true}
                /*  allowZero={true} */
              />
            </div>
            <div className="max-w-xs">
              {" "}
              <TextInput
                label="قیمت با تخفیف"
                currentValue={discount}
                number={true}
                smallerthan={price}
                errors={"قیمت بعد تخفیف باید از قیمت اصلی کوچیک تر باشد"}
                allowZero={true}
                change={(e) => {
                  setDiscount(e);
                  setChanged(true);
                }}
                price={true}
              />
            </div>
            <NumberInput
              label="موجودی کل "
              change={(e) => {
                setStack(e);
                setChanged(true);
              }}
              disabled={!userPermissions?.productProperties.updateStock}
              value={stack}
            />
       {/*      <NumberInput
              label="محدودیت پایین ترین تعداد خرید"
              change={(e) => {
                setMin(e);
                setChanged(true);
              }}
              value={min}
            /> */}
            <NumberInput
              label="محدودیت بالاترین تعداد خرید"
              value={max}
              change={(e) => {
                setMax(e);
                setChanged(true);
              }}
            />
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
              <Switch checked={active} onClick={() => setActive(!active)} />
              <Typography
                sx={{ color: active ? "#2ab32a" : "red" }}
                variant="body2"
              >
                {active ? "فعال" : "غیر فعال"}
              </Typography>
            </div>{" "}
            <div className="flex gap-1 items-center">
              <span className="text-sm text-gray-700">قابل فروش : </span>
              <Switch
                checked={hasSaleAbility}
                onClick={() => setHasSaleAbility(!hasSaleAbility)}
              />
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-sm text-gray-700">
                موجود در انبار همکار :
              </span>
              <Switch
                checked={inColleagueStoke}
                onClick={() => {
                  setInColleagueStoke(!inColleagueStoke);
                  setAccountingStockId(inColleagueStoke ? 0 : 2);
                }}
              />
            </div>
            <div className="md:col-span-1">
              <Dropdown
                value={STOCKS_TYPE.find(
                  (item) => item?.id === accountingStockId
                )}
                change={(e) => {
                  setAccountingStockId(e.id);
                  inColleagueStoke(e.id === 2 ? true : false);
                }}
                data={STOCKS_TYPE}
                disabled={inColleagueStoke}
                title="موجود در انبار"
              />
            </div>
            <div className="md:col-span-6">
              {" "}
              <TextInput
                label="توضیحات"
                currentValue={description}
                change={(e) => {
                  setDescription(e);
                }}
              />
            </div>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button
              onClick={sumbitHandler}
              variant="contained"
              disabled={
                Number(String(discount).replace(/,/g, "")) >=
                  Number(String(price).replace(/,/g, "")) ||
                Number(String(price).replace(/,/g, "")) === 0 ||
                !changed
              }
            >
              ثبت تغییرات
            </Button>
          </Box>
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
    </Accordion>
  );
};

export default SetPriceForm;
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
