import { Alert, Button, CircularProgress } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, REORDER } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const Errors = ({ orderData, refresh }) => {
  const [loading, setLoading] = React.useState(false);
  const { token } = useSelector((state) => state.user);

  const handleReOrder = (errorMessageId) => {
    const formData = new FormData();
    formData.append("orderId", orderData.id);
    formData.append("errorMessageId", errorMessageId);
    setLoading(true);

    axiosInstance
      .post(`${baseUrl}/${REORDER}`, formData, configReq(token))
      .then((res) => {
        setLoading(false);
        toast.success(res.data.message);
        refresh();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };
  return (
    <div>
      {orderData?.warningMessages && (
        <div className="flex flex-col gap-1">
          {orderData.warningMessages.map((item) => (
            <Alert
              sx={{
                color: "#fff !important",
                alignItems: "center !important",
                width: "100%",
                ".MuiAlert-message": {
                  width: "100%",
                },
              }}
              variant="filled"
              severity="warning"
              key={item.message}
            >
              <div className="flex w-full justify-between items-center">
                <div className="flex flex-col gap-2">
                  <span>{item.message}</span>
                  <span>{item.reason}</span>{" "}
                </div>
                <Button
                  onClick={() => handleReOrder(item.id)}
                  disabled={loading}
                  variant="outlined"
                  color="inherit"
                >
                  {loading ? <CircularProgress /> : "درخواست مجدد"}
                </Button>
              </div>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
};

export default Errors;
