import { Delete } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_TIPAX,
  DELETE_TIPAX,
  EDIT_TIPAX,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const EditTipaxModel = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
}) => {
  const { token } = useSelector((state) => state.user);
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [avatar, setAvatar] = useState([]);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);
  const { themeColor } = useSelector((state) => state.themeColor);
  const useDarkMode = themeColor === "dark";
  // set data
  useEffect(() => {
    if (data && forEdit) {
      setAllData(data);
    } else {
      setAllData({});
    }
  }, [data, forEdit]);

  const deleteItem = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(`${baseUrl}/${DELETE_TIPAX}?id=${data.id}`, configReq(token))
        .then((res) => {
          var temp = [...allRows];
          var newData = temp.filter((item) => item.id !== data.id);
          setAllRows(newData);
          setLoading(false);
          toast.success("با موفقیت حذف شد");
          setOpenDelete(false);
          close();
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
          setOpenDelete(false);
        });
    }
  };

  const editItem = () => {
    var sendingData = {
      ...allData,
    };
    if (forEdit) {
      sendingData = { ...sendingData, id: data?.id };
    }

    setLoading(true);
    var temp = [...allRows];
    if (forEdit) {
      axiosInstance
        .put(`${baseUrl}/${EDIT_TIPAX}`, sendingData, configReq(token))
        .then((res) => {
          setLoading(false);
          toast.success("با موفقیت ویرایش شد");
          var index = temp.findIndex((item) => item.id === data.id);
          temp[index] = res.data.data;
          setAllRows(temp);
          close();
          setAllData({});
          setAvatar([]);
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading(false);
        });
    } else {
      axiosInstance
        .post(`${baseUrl}/${CREATE_TIPAX}`, sendingData, configReq(token))
        .then((res) => {
          temp.unshift(res.data.data);

          setAllRows(temp);
          setLoading(false);
          toast.success("با موفقیت اضافه شد");
          close();
          setAllData({});
          setAvatar([]);
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading(false);
        });
    }
  };
  return (
    <Modal
      open={open}
      close={close}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  تیپاکس`}
    >
      <TextInput
        label="کد رهگیری"
        change={(e) => setAllData({ ...allData, traceCode: e })}
        currentValue={allData?.traceCode}
      />
      <TextInput
        label="کد رهگیری ثانویه"
        change={(e) => setAllData({ ...allData, secondaryTraceCode: e })}
        currentValue={allData?.secondaryTraceCode}
      />
      <TextInput
        label="کد مشتری"
        change={(e) => setAllData({ ...allData, customerSubstationCode: e })}
        currentValue={allData?.customerSubstationCode}
      />
      <TextInput
        label="کد تخفیف"
        change={(e) => setAllData({ ...allData, discountCode: e })}
        currentValue={allData?.discountCode}
      />

      <TextInput
        label="شماره سفارش"
        change={(e) => setAllData({ ...allData, orderId: e })}
        currentValue={allData?.orderId}
      />

      <Box sx={{ display: "flex" }}>
        {userPermissions?.tipax?.delete && (
          <IconButton onClick={() => setOpenDelete(true)}>
            <Delete color="error" />
          </IconButton>
        )}
        <div style={{ flexGrow: 1 }} />{" "}
        <Button
          variant="contained"
          color="primary"
          onClick={editItem}
          disabled={loading}
        >
          {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
        </Button>
      </Box>
      <Confirm
        message="آیا از حذف این   بسته بندی اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

export default EditTipaxModel;
