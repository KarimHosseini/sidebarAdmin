/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  baseUrl,
  DOWNLOAD_FILE,
  EDIT_MULTIPLE_PTODUCT_PUBLIC,
  PUBLIC_ATTRS,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import axiosInstance from "../dataFetch/axiosInstance";

const PublicAttributes = ({ data, refresh }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const [publics, setPublics] = useState([]);
  const [allpublics, setallPublics] = useState([]);
  const [selectedPublics, setSelectedPublics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  const getPublicAttrs = () => {
    setLoading(true);
    axiosInstance(`${baseUrl}/${PUBLIC_ATTRS}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data.code === 200) {
          checkFilters(data.data);
          setallPublics(data.data);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getPublicAttrs();
  }, [token]);

  const submitPublicAttrsLoop = () => {
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
        { productId: id, publicAttributes: JSON.stringify(temp) },
        configReq(token)
      )
      .then((res) => {
        setLoadingButton(false);
        toast.success("با موفقیت ویرایش  شد");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoadingButton(false);
      });
  };
  const checkFilters = (publicsData) => {
    var temp = [...publicsData];
    data.map((item) => {
      const f = temp.filter((i) => i.id !== item.id);
      temp = f;
    });
    setPublics(temp);
  };
  useEffect(() => {
    setSelectedPublics(data);
  }, [data]);
  const isMd = useMediaQuery("(min-width:900px)");
  return (
    <Box className="px-4 md:px-0">
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ mb: "50px", color: "#198dff" }}>
          انتخاب ویژگی های عمومی
        </Typography>
        {loading ? (
          <div className="flex items-center flex-wrap">
            <Skeleton height={30} width={200} />
            <Skeleton height={30} width={200} />
            <Skeleton height={30} width={200} />
            <Skeleton height={30} width={200} />
            <Skeleton height={30} width={200} />
          </div>
        ) : (
          <FormGroup sx={{ columnGap: 3, rowGap: 3 }} row={isMd}>
            {allpublics.map((item, index) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedPublics?.find(
                      (items) => items.publicAttributeId === item.id
                    )}
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
                  ml: { md: 0, xs: 1 },
                  mr: 0,
                  borderColor: (theme) =>
                    theme.palette.mode === "light" ? "#ccc" : "#ccc",
                }}
              />
            ))}
          </FormGroup>
        )}
      </Box>
      <Box className="flex justify-end my-5 mx-2">
        <Button
          onClick={() => {
            submitPublicAttrsLoop();
          }}
          variant="contained"
          size="large"
          disabled={loadingButton}
        >
          {loadingButton ? <CircularProgress /> : <> ثبت اطلاعات</>}
        </Button>
      </Box>
    </Box>
  );
};

export default PublicAttributes;
