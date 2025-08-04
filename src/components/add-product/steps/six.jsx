import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ADD_PRODUCT_FACILITY,
  baseUrl,
  DELETE_PRODUCT_FACILITY,
  DOWNLOAD_FILE,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import axiosInstance from "../../dataFetch/axiosInstance";

const StepSixProduct = ({ facilties, createdId, id, currentFacilities }) => {
  const [loading, setLoading] = useState(false);
  const [selectedPublics, setSelectedPublics] = useState([]);
  const isMd = useMediaQuery("(min-width:900px)");
  const { token } = useSelector((state) => state.user);

  const submitLoop = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("ProductId", id ? id : createdId);
    selectedPublics.map((item) => {
      formData.append("FacilityId", item);
    });
    axiosInstance
      .post(`${baseUrl}/${ADD_PRODUCT_FACILITY}`, formData, configReq(token))
      .then((res) => {
        setLoading(false);
        toast.success("با موفقیت انجام شد");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };
  const DeleteFirst = () => {
    setLoading(true);
    const formData = new FormData();

    formData.append("ProductId", id ? id : createdId);

    currentFacilities.map((item) =>
      formData.append("ProductFacilityIds", item.id)
    );
    axiosInstance
      .delete(`${baseUrl}/${DELETE_PRODUCT_FACILITY}`, {
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        submitLoop();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };
  useEffect(() => {
    if (currentFacilities) {
      var temp = [];
      currentFacilities.map((item) => temp.push(item.id));
      setSelectedPublics(temp);
    }
  }, [currentFacilities]);
  return (
    <div>
      {" "}
      <div className="flex items-center justify-between">
        <Typography variant="body1">انتخاب تسهیلات</Typography>{" "}
        <div className="flex items-center justify-end gap-3">
          {createdId && (
            <Link to={`/products/${createdId}#step5`}>
              <Button variant="outlined">بازگشت</Button>
            </Link>
          )}

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              disabled={loading}
              variant="contained"
              onClick={() => {
                if (currentFacilities?.length > 0) {
                  DeleteFirst();
                } else {
                  submitLoop();
                }
              }}
            >
              {loading ? (
                <>
                  <CircularProgress />
                </>
              ) : (
                <> ثبت و برگشت به محصول</>
              )}
            </Button>
          </Box>
        </div>
      </div>
      <FormGroup sx={{ columnGap: 2, rowGap: 2, mt: 3 }} row={isMd}>
        {facilties.map((item, index) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(selectedPublics.find((it) => it === item.id))}
                onChange={(e) => {
                  var temp = [...selectedPublics];
                  if (!e.target.checked) {
                    temp = temp.filter((ff) => ff !== item.id);
                  } else {
                    temp.push(item?.id);
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
    </div>
  );
};

export default StepSixProduct;
