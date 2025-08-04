/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl, DOWNLOAD_FILE, PUBLIC_ATTRS } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

import { useEffect, useState } from "react";
import { logout } from "../../redux/slices/user";
import axiosInstance from "../dataFetch/axiosInstance";

const PublicAttributesBundles = ({ selectedPublics, setSelectedPublics }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [publics, setPublics] = useState([]);

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

  const isMd = useMediaQuery("(min-width:900px)");
  return (
    <Paper elevation={0} className="p-4 border border-[#dbdfea] w-full mb-4">
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
                  checked={selectedPublics?.find(
                    (pb) => pb.publicAttributeId === item?.id
                  ) ? true : false}
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
    </Paper>
  );
};

export default PublicAttributesBundles;
