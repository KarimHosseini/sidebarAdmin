import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Dropdown,
  Modal,
  TextInput,
  UploadImage,
} from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_LEASING,
  DELETE_LEASING,
  EDIT_LEASING,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const EditLeasingModal = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
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
      title: data.title,
      files: avatar,
      primaryCost: data.primaryCost,
      active: data.active,
      provider: data.provider,
      fromGallery: selectedProductImage ? selectedProductImage : "",
      message: data.message,
    };
    if (forEdit) {
      sendingData = { ...sendingData, id: data.id };
    }
    var temp = [...allRows];
    if (data.title) {
      setLoading(true);
      if (forEdit) {
        axiosInstance
          .put(`${baseUrl}/${EDIT_LEASING}`, sendingData, configReq(token))
          .then((res) => {
            setLoading(false);
            toast.success("با موفقیت ویرایش شد");
            var index = temp.findIndex((item) => item.id === data.id);
            temp[index] = res.data.data;
            setAllRows(temp);
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
      } else {
        axiosInstance
          .post(`${baseUrl}/${CREATE_LEASING}`, sendingData, configReq(token))
          .then((res) => {
            temp.unshift(res.data.data);

            setAllRows(temp);
            setLoading(false);
            toast.success("با موفقیت اضافه شد");
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
    } else if (!data.title) {
      toast.error("نام شرکت را وارد کنید");
    }
  };
  const deleteAttr = () => {
    setLoading(true);
    axiosInstance
      .delete(`${baseUrl}/${DELETE_LEASING}?id=${data.id}`, configReq(token))
      .then((res) => {
        setLoading(false);
        var temp = [...allRows];
        var newData = temp.filter((item) => item.id !== data.id);
        setAllRows(newData);
        setConfirmDelete(false);
        toast.success("با موفقیت حذف شد");
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
  };
  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  لیزینگ`}
    >
      <TextInput
        label="نام  "
        change={(e) => setData({ ...data, title: e })}
        currentValue={data.title}
      />
      <TextInput
        label="  مبلغ"
        change={(e) => setData({ ...data, primaryCost: e })}
        currentValue={data.primaryCost || ""}
        number
      />
      <Dropdown
        value={data?.provider}
        change={(e) => setData({ ...data, provider: e })}
        data={PROVIDER}
        title="تامین کننده"
      />
      <TextField
        label="شرح پیام  "
        rows={2}
        multiline
        onChange={(e) => setData({ ...data, message: e.target.value })}
        value={data.message || ""}
      />
      <div className="flex items-center gap-3">
        <span>فعال/غیر فعال : </span>
        <Switch
          checked={data?.active}
          onChange={() => setData({ ...data, active: !data?.active })}
        />
      </div>
      <UploadImage
        file={avatar}
        change={setAvatar}
        address={data.galleryId}
        selectedProductImage={selectedProductImage}
        setselectedProductImage={setselectedProductImage}
      />
      <Box sx={{ display: "flex", alignItems: "center" }}> 
        {userPermissions?.leasing?.delete && (
          <IconButton size="large" onClick={() => setConfirmDelete(true)}>
            <Delete sx={{ color: "red" }} />
          </IconButton>
        )}
        <div style={{ flexGrow: 1 }} />
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
      <Confirm
        message="آیا از حذف این لیزینگ اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
    </Modal>
  );
};
const PROVIDER = ["آینده", "پارسیان"];

export default EditLeasingModal;
