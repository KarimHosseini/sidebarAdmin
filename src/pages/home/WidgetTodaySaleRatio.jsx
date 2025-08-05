import { Box, IconButton, Paper, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, WidgetTodaySaleRatio } from "../../helpers/api-routes";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useSelector } from "react-redux";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
import { useDispatch } from "react-redux";
import RefreshIcon from "@mui/icons-material/Refresh";
import CompareArrowsOutlinedIcon from "@mui/icons-material/CompareArrowsOutlined";
const WidgetTodaySaleRatios = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setLoading(true);
    axiosInstance(`${baseUrl}/${WidgetTodaySaleRatio}`, configReq(token))
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
        setLoading(false);
      });
  }, [refresh]);
  return (
    <>
      <Paper
        elevation={0}
        className="border rounded px-4 py-6 flex flex-col  items-center gap-3 relative w-full"
        sx={{
          ":hover": {
            ".refreshButton": {
              opacity: "100 !important",
            },
            boxShadow: "0px 0px 11px #8b8b8b4f",
          },
        }}
      >
        <span className="text-sm"> نسبت فروش امروز به ديروز</span>

        {loading ? (
          <>
            <Skeleton width={50} />
          </>
        ) : (
          <>
            {Number(data?.ratio) > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-lg text-green-600 font-bold mt-5">
                  {data?.ratio} برابر
                </span>
                 {" "}
              </div>
            ) : Number(data?.ratio) === 0 ? (
              <>
                <Paper
                  elevation={0}
                  sx={{
                    mt: 2,
                    padding: "3px 10px",
                    borderRadius: "5px",
                    border: "1px solid #d6d6d6",
                  }}
                >
                  <Box
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === "light" ? "#1a63c5" : "#ff9999",
                    }}
                    className="text-lg font-bold "
                  >
                    {data?.ratio}
                  </Box>
                </Paper>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg text-red-600 font-bold mt-5">
                  {data?.ratio}برابر
                </span>
                
              </div>
            )}
          </>
        )}
        <IconButton
          sx={{
            position: "absolute",
            top: "30px",
            right: "25px",
            transform: "translateY(-50%)",
            color: "#b9b9b9",
            opacity: { md: "0", xs: "100" },
            transition: "opacity 400ms",
          }}
          className="refreshButton "
          onClick={() => {
            setRefresh((r) => r + 1);
          }}
        >
          <RefreshIcon />
        </IconButton>
        <CompareArrowsOutlinedIcon
          sx={{
            position: "absolute",
            top: "30px",
            left: "45px",
            transform: "translateY(-50%)",
            color: "#d0d0ff",
            /*      background: "#fff", */
            borderRadius: "3px",
            fontSize: "2rem",
            padding: "1px",
          }}
        />
      </Paper>
    </>
  );
};

export default WidgetTodaySaleRatios;
