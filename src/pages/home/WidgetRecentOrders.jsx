import { IconButton, Paper, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, WidgetRecentOrders } from "../../helpers/api-routes";
import OrderTable from "./orderTable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
import { useDispatch } from "react-redux";
import RefreshIcon from "@mui/icons-material/Refresh";
import HourglassBottomOutlinedIcon from "@mui/icons-material/HourglassBottomOutlined";
const WidgetRecentOrder = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [refresh, setRefresh] = useState(0);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    axiosInstance(`${baseUrl}/${WidgetRecentOrders}`, configReq(token))
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      });
  }, [refresh]);

  return (
    <>
      <Paper
        elevation={0}
        className="border rounded px-4 py-6 flex flex-col justify-center items-center gap-3 relative w-full orderTable"
        sx={{
          ":hover": {
            ".refreshButton": {
              opacity: "100 !important",
            },
            boxShadow: "0px 0px 11px #8b8b8b4f",
          },
        }}
      >
        <div className="flex w-full pb-2 items-center justify-between ">
          <div className="flex items-center gap-3 mr-10">
            {" "}
            <HourglassBottomOutlinedIcon
              sx={{
                color: "#d0d0ff",
                /* background: "#fff", */
                borderRadius: "3px",
                fontSize: "2rem",
                padding: "1px",
              }}
            />
          </div>
          <div className="text-sm text-center"> سفارش هاي در حال بررسی</div>
          <Link to="/orders">
            <div className="flex items-center gap-2">
              <span className="text-xs md:block hidden">مشاهده همه</span>
              <ArrowBackIcon sx={{ fontSize: "0.9rem !important" }} />
            </div>
          </Link>
          <IconButton
            sx={{
              position: "absolute",
              top: "30px",
              right: { sm: "85px", xs: "30px" },
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
        </div>

        <>
          <OrderTable data={data} loading={loading} />
        </>
      </Paper>
    </>
  );
};

export default WidgetRecentOrder;
