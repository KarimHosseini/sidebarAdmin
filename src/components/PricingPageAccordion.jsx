import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Checkbox,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  baseUrl,
  disableAllProductProperties,
  EDIT_PRICE,
} from "../helpers/api-routes";
import { configReq, separate } from "../helpers/functions";
import {
  ActionButton,
  Loading,
  NumberInput,
  ShowImage,
  TextInput,
} from "./common";
import axiosInstance from "./dataFetch/axiosInstance";

const PricingPageAccordion = ({
  property,
  refresh,
  setExpent,
  index,
  expent,
  allProperties,
  setallProperties,
  selected,
  setSelected,
}) => {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { userPermissions } = useSelector((state) => state.relationals);

  const [code, setCode] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1);
  const [stock, setStock] = useState(1);
  const [image, setImage] = useState(null);
  const [active, setActive] = useState(false);
  const [edited, setedited] = useState(false);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setCode(property.code || "");
    setPrice(Number(property.price).toLocaleString() || "");
    setDiscount(Number(property.discount).toLocaleString() || "");
    setMin(property.minBuy || 0);
    setMax(property.maxBuy);
    setStock(property.qty !== undefined ? property.qty : property.stock);
    setActive(property.active || false);
  }, [property, expent]);
  /*   useEffect(() => {

  } ,[expent]) */
  const editPrice = () => {
    if (property) {
      const data = {
        productId: property.productId,
        productAttributeId: property.arrtib1.subAttribId,
        productAttribute2Id: property.arrtib2
          ? property.arrtib2.subAttribId
          : null,
        code,
        price: Number(String(price).replace(/,/g, "")),
        discount: Number(String(discount).replace(/,/g, "")),
        maxBuy: max,
        minBuy: min || 0,
        qty: stock,
        active: active,
        files: image,
        id: property.id,
      };
      setLoading(true);
      axiosInstance
        .put(`${baseUrl}/${EDIT_PRICE}`, data, configReq(token))
        .then((res) => {
          setLoading(false);
          toast.success("با موفقیت ویرایش شد");
          refresh();
          setedited({ [property.id]: true });
          const index = allProperties.findIndex(
            (item) => item.id === property.id
          );

          allProperties[index] = {
            ...allProperties[index],
            price: Number(String(price).replace(/,/g, "")),
            discount: Number(String(discount).replace(/,/g, "")),
            maxBuy: max,
            minBuy: min || 0,
            qty: stock,
            active: active,
          };
          setallProperties(allProperties);
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
        });
    }
  };
  const disabledAll = () => {
    setLoading(true);
    axiosInstance
      .put(
        `${baseUrl}/${disableAllProductProperties}`,
        { productId: property.productId },
        configReq(token)
      )
      .then((res) => {
        refresh();
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 401) {
          /*    dispatch(logout()); */
        }
      });
  };
  const isSelected = (row) => selected.indexOf(row) !== -1;

  // const deletePrice = (data) => {
  //   const url = data.productAttribute2Id
  //     ? `${baseUrl}/${DELETE_PRICE}/${data.productId}/${data.productAttributeId}/${data.productAttribute2Id}`
  //     : `${baseUrl}/${DELETE_PRICE}/${data.productId}/${data.productAttributeId}/0`;
  //   if (data) {
  //     setLoading(true);
  //     axios
  //       .delete(url, configReq(token))
  //       .then((res) => {
  //         setLoading(false);
  //         dispatch(addSnack(snackMaker("success", "با موفقیت حذف شد")));
  //         refresh();
  //       })
  //       .catch((err) => {
  //         setLoading(false);
  //         toast.error(err.response?.data?.message);
  //       });
  //   }
  // };
  const handleClick = (name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  return (
    <Accordion elevation={1} expanded={expent === property.id}>
      {loading && <Loading />}
      <AccordionSummary
        sx={{
          display: "flex",
          alignItems: "center",
        }}
        onClick={() => setExpent(expent === property.id ? null : property.id)}
        expandIcon={<ExpandMore />}
      >
        <Checkbox
          onClick={() => handleClick(property)}
          checked={isSelected(property)}
        />
        <Box
          sx={{
            width: "20%",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <a
            href={`/products/${property?.productId}`}
            target="_blank"
            rel="noreferrer"
          >
            <Typography
              sx={{
                textAlign: "center",
                p: 1,
                background: "#fdf2f2",
                width: "fit-content",
              }}
              /*    component="mark" */
              variant="body2"
              className="hover:bg-yellow-300 rounded-md"
            >
              {property?.productId}
            </Typography>
          </a>
        </Box>
        <Box
          sx={{
            width: "20%",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ShowImage address={property?.image} />
        </Box>
        <Typography
          sx={{ width: "20%", textAlign: "start", mx: "4px" }}
          variant="body2"
        >
          {property?.title}
        </Typography>
        <Box sx={{ width: "20%", ml: "40px", fontSize: "0.875rem" }}>
          {property?.arrtib1?.type === 1 ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "start",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: property?.arrtib1?.value,
                  border: "1px solid gray",
                  width: "18px",
                  height: "18px",
                }}
              >
                &nbsp;
              </Avatar>
              {property?.arrtib1?.title}
            </Box>
          ) : (
            `${property?.arrtib1?.attrib} / ${property?.arrtib1?.title}`
          )}
        </Box>
        <Typography
          sx={{ width: "20%", textAlign: "start", mx: "4px" }}
          variant="body2"
        >
          {property?.arrtib2?.attrib ? (
            <>
              {property?.arrtib2?.attrib} / {property?.arrtib2?.title}
            </>
          ) : (
            "..."
          )}
        </Typography>
        <Typography sx={{ width: "20%", textAlign: "center" }} variant="body2">
          {property?.discount
            ? separate(property?.discount)
            : separate(property?.price)}
        </Typography>
        <Typography sx={{ width: "20%", textAlign: "center" }} variant="body2">
          {property?.supplier}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Grid sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
            <div className="max-w-xs">
              <TextInput
                currentValue={code}
                change={setCode}
                label="کد ویژگی"
                readOnly={true}
              />
            </div>
            <div className="max-w-xs">
              <TextInput
                currentValue={String(price).toLocaleString()}
                change={setPrice}
                label="قیمت"
                number={true}
                readOnly={!userPermissions?.productProperties?.update}
                price={true}
                /*  allowZero={true} */
              />
            </div>
            <div className="max-w-xs">
              <TextInput
                currentValue={discount}
                label="قیمت با تخفیف"
                change={setDiscount}
                number={true}
                smallerthan={price.replace(",", "")}
                errors={"قیمت بعد تخفیف باید از قیمت اصلی کوچیک تر باشد"}
                allowZero={true}
                readOnly={!userPermissions?.productProperties?.update}
                price={true}
              />
            </div>
            <NumberInput
              disabled={!userPermissions?.productProperties?.update}
              label="محدودیت پایین ترین تعداد خرید"
              change={setMin}
              value={min}
            />
            <NumberInput
              label="محدودیت بالاترین تعداد خرید"
              change={setMax}
              value={max}
              disabled={!userPermissions?.productProperties?.update}
            />
            <NumberInput
              disabled={!userPermissions?.productProperties?.update}
              label="تعداد موجودی"
              change={setStock}
              value={stock}
            />
            <div className="flex gap-1 items-center">
              <span className="text-sm text-gray-700">وضعیت :</span>
              <Switch
                disabled={!userPermissions?.productProperties?.update}
                checked={active}
                onClick={() => setActive(!active)}
              />
              <Typography
                sx={{ color: active ? "#2ab32a" : "red" }}
                variant="body2"
              >
                {active ? "فعال" : "غیر فعال"}
              </Typography>
            </div>
          </Grid>
          {/*           <UploadImage file={image} change={setImage} />
           */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "end",
              mr: "10px",
            }}
            className="gap-3"
          >
            <ActionButton
              disable={
                Number(String(discount).replace(/,/g, "")) >=
                  Number(String(price).replace(/,/g, "")) ||
                Number(String(price).replace(/,/g, "")) === 0 ||
                !userPermissions?.productProperties?.update
              }
              title="ثبت تغییرات"
              click={editPrice}
            />
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default PricingPageAccordion;
