import { Button, CircularProgress, Modal, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../../../components/dataFetch/axiosInstance";
import { baseUrl, REVOKE_PLAN_LOAN } from "../../../../helpers/api-routes";
import { configReq } from "../../../../helpers/functions";
import CloseIcon from "@mui/icons-material/Close";

const Revoke = ({ data, setData }) => {
  const [open, setOpen] = useState(false);
  const [loadingStatus2, setLoadingStatus2] = useState(false);
  const { token } = useSelector((state) => state.user);
  const [desc, setDesc] = useState("");
  const revonke = () => {
    if (desc) {
      setLoadingStatus2(true);
      const datas = {
        id: parseInt(data?.id),
        /*   : desc, */
      };
      axiosInstance
        .post(
          `${baseUrl}/${REVOKE_PLAN_LOAN}?description=${desc}`,
          { ...datas },
          configReq(token)
        )
        .then((res) => {
          setOpen(false);
          setDesc("");
          setLoadingStatus2(false);
          toast.success("با موفقیت باطل شد");
          setData(res?.data?.data);
        })
        .catch((err) => {
          setLoadingStatus2(false);
          toast.error(err.response?.data?.message);
        });
    } else {
      toast.error("لطفا توضیخات ابطال را کامل کنید");
    }
  };
  return (
    <>
      <Button
        disabled={data?.step > 8 || data?.state === 2}
        fullWidth
        onClick={() => setOpen(true)}
        variant="contained"
        color="error"
      >
        رد و بسته شدن
      </Button>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setDesc("");
        }}
        sx={{zIndex:"999999999999 !important"}}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "95%",
            bgcolor: "background.paper",
            borderRadius: 2,
            maxWidth: "400px",
            p: 2,
            border: "none",
            outline: "none",
            overflowY: "auto",
            height: { xs: "auto", md: "auto" },
            zIndex: 99999999999999,
            /*  my:3 */
          }}
        >
          <div className="flex justify-between border-b mb-5 pb-5">
            <h4 className="font-semibold text-lg">
              آیا مطمئن به بسته شدن این درخواست هستید ؟{" "}
            </h4>
            <Box
              className=" justify-center items-center cursor-pointer"
              sx={{
                background: "#d32f2f",
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                display: "flex",
              }}
              onClick={() => {
                setOpen(false);
                setDesc("");
              }}
            >
              <CloseIcon sx={{ color: "#fff" }} />
            </Box>
          </div>
          <h4 className=" mb-4">
            علت ابطال را در کادر توضیحات ابطال زیر وارد نمایید .{" "}
          </h4>
          <TextField
            multiline
            fullWidth
            rows={2}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            variant="outlined"
          />
          <div className="flex items-center mt-5 justify-between">
            {" "}
            <Button
              sx={{ width: "100px" }}
              onClick={() => {
                setOpen(false);
                setDesc("");
              }}
              variant="contained"
              color="error"
            >
              انصراف
            </Button>
            <Button
              sx={{ width: "100px" }}
              onClick={revonke}
              variant="contained"
              disabled={loadingStatus2}
            >
              {loadingStatus2 ? (
                <>
                  {" "}
                  <CircularProgress
                    sx={{
                      width: "20px !important",
                      height: "20px !important",
                    }}
                  />
                </>
              ) : (
                <> ثبت اطلاعات </>
              )}
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Revoke;
