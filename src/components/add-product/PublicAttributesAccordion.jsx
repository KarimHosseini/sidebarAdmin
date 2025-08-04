/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  baseUrl,
  DOWNLOAD_FILE,
  EDIT_MULTIPLE_PTODUCT_PUBLIC,
  PUBLIC_ATTRS,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../../redux/slices/user";
import axiosInstance from "../dataFetch/axiosInstance";

const PublicAttributesAccordion = ({ createdId, nextStep }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const getPublicAttrs = () => {
    setLoading(true);
    axiosInstance(`${baseUrl}/${PUBLIC_ATTRS}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data.code === 200) {
          setPublics(data.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };

  useEffect(() => {
    getPublicAttrs();
  }, [token]);

  // public attrs
  const [publics, setPublics] = useState([]);
  const [selectedPublics, setSelectedPublics] = useState([]);

  const submitPublicAttrsLoop = async () => {
    setLoadingButton(true);
    var temp = [];
    selectedPublics.map((item) => {
      temp.push({
        publicAttributeId: item.publicAttributeId,
        value: item.value,
      });
    });
    axiosInstance
      .put(
        `${baseUrl}/${EDIT_MULTIPLE_PTODUCT_PUBLIC}`,
        { productId: createdId, publicAttributes: JSON.stringify(temp) },
        configReq(token)
      )
      .then((res) => {
        setLoadingButton(false);
        toast.success("با موفقیت ویرایش  شد");
        nextStep(2);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoadingButton(false);
      });
  };
  const isMd = useMediaQuery("(min-width:900px)");

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ mb: "50px", color: "#198dff" }}>
          {" "}
          انتخاب ویژگی های عمومی
        </Typography>

        <FormGroup sx={{ columnGap: 2, rowGap: 2 }} row={isMd}>
          {publics.map((item, index) => (
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    var temp = [...selectedPublics];
                    if (!e.target.checked) {
                      temp = temp.filter(
                        (ff) => ff.publicAttributeId !== item.id
                      );
                    } else {
                      temp.push({
                        publicAttributeId: item?.id,
                        value: item.name,
                      });
                    }
                    setSelectedPublics(temp);
                  }}
                />
              }
              label={
                <div className="text-sm flex items-center gap-2">
                  <img
                    style={{ width: "1.3rem", height: "1.3rem" }}
                    alt=""
                    src={`${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}?size=tiny`}
                  />{" "}
                  {item?.title}
                </div>
              }
              sx={{
                border: "1px solid",
                borderRadius: 1,
                px: 2,
                py: 1,
                borderColor: (theme) =>
                  theme.palette.mode === "light" ? "#ccc" : "#ccc",
              }}
            />
          ))}
        </FormGroup>
      </Box>
      <Box className="flex justify-between mt-5">
        <Link to={`/products/${createdId}`}>
          <Button variant="outlined">بازگشت</Button>
        </Link>
        <Button
          onClick={() => {
            submitPublicAttrsLoop();
          }}
          variant="contained"
          size="large"
          disabled={loading}
        >
          {loadingButton ? <CircularProgress /> : <> ثبت اطلاعات</>}
        </Button>
      </Box>
    </>
  );
};

export default PublicAttributesAccordion;
