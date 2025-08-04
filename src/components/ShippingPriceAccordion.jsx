import {
  Box,
  Button,
  CircularProgress,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { baseUrl, SET_SHIPPING_PRICE } from "../helpers/api-routes";
import { configReq } from "../helpers/functions";
import { Loading, TextInput } from "./common";
import axiosInstance from "./dataFetch/axiosInstance";

const ShippingPriceAccordion = ({ i, city, id, currentPrices, province }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [cost, setCost] = useState("");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (currentPrices && city) {
      setCurrent(
        currentPrices.find((currentData) => currentData.cityId === city.id)
      );
    }
  }, [currentPrices, city]);

  useEffect(() => {
    if (current) {
      setActive(current.active);
      setCost(current.cost);
    }
  }, [current]);

  const setPrice = () => {
    const data = {
      companyId: id,
      cityId: city.id,
      cost: parseInt(cost),
      active,
    };
    setLoading(true);
    axiosInstance
      .put(`${baseUrl}/${SET_SHIPPING_PRICE}`, data, configReq(token))
      .then((res) => {
        setLoading(false);
        toast.success("با موفقیت ویرایش شد");
        // nextStep();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };

  return (
    <Box
      sx={{
        display: "grid",
        width: "100%",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        py: 1,
      }}
      className="gap-5"
    >
      {loading && <Loading />}
      <Typography>
        {i} . {province} . {city.title}
      </Typography>
      <Box sx={{ textAlign: "center" }}>
        <TextInput
          label="هزینه ارسال"
          number
          allowZero
          currentValue={cost}
          change={setCost}
        />
      </Box>
      <Box className="flex items-center gap-2" sx={{ textAlign: "center" }}>
        <span className="text-xs">فعال/غیرفعال : </span>
        <Switch checked={active} onChange={() => setActive(!active)} />
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Button onClick={setPrice} variant="contained">
          {loading ? (
            <>
              <CircularProgress
                sx={{
                  color: "#fff",
                  width: "17px !important",
                  height: "17px !important",
                }}
              />
            </>
          ) : (
            <>ثبت اطلاعات</>
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default ShippingPriceAccordion;
