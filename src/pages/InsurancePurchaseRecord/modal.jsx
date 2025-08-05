import { Box, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { ACTIVE_INSURANCE_PURCHASED, baseUrl } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const InsurancePurchasedModal = ({
  open,
  close,
  prevData = {},
  forEdit,

  setRefresh,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(prevData || {});
  const [avatar, setAvatar] = useState([]);
  useEffect(() => {
    setData(prevData || {});
  }, [prevData]);
  const resetData = () => {
    setData({});
    setAvatar([]);
    setselectedProductImage();
  };

  const submitData = () => {
    var sendingData = {
      id: data.id,
    };
    if (data.serialNumber) {
      setLoading(true);
      if (forEdit) {
        axiosInstance
          .put(
            `${baseUrl}/${ACTIVE_INSURANCE_PURCHASED}?serialNumber=${data.serialNumber}&policyNumber=${data.policyDraftNo}`,
            sendingData,
            configReq(token)
          )
          .then((res) => {
            setLoading(false);
            toast.success("با موفقیت ثبت شد");
            setRefresh((r) => r + 1);
            close();
            resetData();
          })
          .catch((err) => {
            setLoading(false);
            toast.error(err.response?.data?.message);
            if (err.response.status === 401) {
              dispatch(logout());
            }
          });
      }
    } else {
      toast.error("سریال   را وارد کنید");
    }
  };

  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title={` فعال سازی`}
    >
      <TextInput
        label="سریال   "
        change={(e) => setData({ ...data, serialNumber: e })}
        currentValue={data.serialNumber}
      />
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "left" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={submitData}
          disabled={loading}
          sx={{ width: { xs: "50%", md: "auto" } }}
        >
          {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
        </Button>{" "}
      </Box>
    </Modal>
  );
};

export default InsurancePurchasedModal;
