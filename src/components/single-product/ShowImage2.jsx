import { Close } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  baseUrl,
  DELETE_PRODUCT_IMAGE,
  DOWNLOAD_FILE,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { Loading } from "../common";
import axiosInstance from "../dataFetch/axiosInstance";

const ShowImage2 = ({ address, deleteId, refresh, id }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const { userPermissions } = useSelector((state) => state.relationals);

  const deleteImage = () => {
    setLoading(true);
    axiosInstance
      .delete(
        `${baseUrl}/${DELETE_PRODUCT_IMAGE}?galleryId=${deleteId}&productId=${id}`,
        configReq(token)
      )
      .then((res) => {
        setLoading(false);
        toast.success("با موفقیت حذف شد");
        refresh();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };

  return (
    <Box sx={{ position: "relative" }}>
      {loading && <Loading />}
      {userPermissions?.product?.deleteGallery && (
        <Close
          onClick={deleteImage}
          sx={{
            backgroundColor: "error.main",
            color: "#FFF",
            fontSize: "16px",
            borderRadius: "10px",
            position: "absolute",
            top: "-5px",
            right: "-5px",
            cursor: "pointer",
            "&:hover": {
              transform: "scale(1.2)",
            },
            zIndex: "2",
          }}
        />
      )}

      <img
        src={
          address ? `${baseUrl}/${DOWNLOAD_FILE}/${address}?size=small` : null
        }
        alt=""
        style={{
          height: "60px",
          borderRadius: "5px",
        }}
      />
    </Box>
  );
};

export default ShowImage2;
