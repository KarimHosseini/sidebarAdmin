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
  CREATE_LEND_TECH,
  DELETE_LEND_TECH,
  EDIT_LEND_TECH,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const LendTechModal = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
  allBanks,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(prevData || {});
  useEffect(() => {
    if (forEdit) {
      setData({
        ...prevData,
      });
    }
  }, [prevData, forEdit, allBanks]);
  const resetData = () => {
    setData({});
  };
  const submitData = () => {
    setLoading(true);
    var temp = [...allRows];

    if (forEdit) {
      axiosInstance
        .put(`${baseUrl}/${EDIT_LEND_TECH}`, data, configReq(token))
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
        .post(`${baseUrl}/${CREATE_LEND_TECH}`, data, configReq(token))
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
  };
  const deleteAttr = () => {
    setLoading(true);
    axiosInstance
      .delete(`${baseUrl}/${DELETE_LEND_TECH}?id=${data.id}`, configReq(token))
      .then((res) => {
        var temp = [...allRows];
        var newData = temp.filter((item) => item.id !== data.id);
        setAllRows(newData);
        setLoading(false);
        setConfirmDelete(false);
        toast.success("با موفقیت حذف شد");
        close();
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
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  لنتک `}
    >
      <TextInput
        currentValue={data?.title}
        label=" نام "
        change={(e) => setData({ ...data, title: e })}
      />
      <Dropdown
        value={allBanks?.find((item) => item.id === data?.bankId)}
        change={(e) => setData({ ...data, bankId: e.id })}
        data={allBanks}
        title="   بانک"
      />
      <TextInput
        currentValue={data?.maxRequest || ""}
        label=" بیشترین تسهیلات "
        change={(e) => setData({ ...data, maxRequest: e })}
        price
        number
      />{" "}
      <TextInput
        currentValue={data?.minRequest || ""}
        label=" کمترین تسهیلات "
        change={(e) => setData({ ...data, minRequest: e })}
        price
        number
      />{" "}
      <TextField
        value={data?.description}
        label=" توضیحات "
        onChange={(e) => setData({ ...data, description: e.target.value })}
        rows={3}
        multiline
      />
      <div className="flex flex-wrap items-center gap-3">
        <span>فعال/غیر فعال : </span>
        <Switch
          checked={data?.active}
          onChange={() => setData({ ...data, active: !data?.active })}
        />
      </div>{" "}
      <UploadImage
        file={data.files}
        change={(e) => setData({ ...data, files: e })}
        address={data.galleryId ? data.galleryId : false}
        selectedProductImage={data.fromGallery}
        setselectedProductImage={(e) => setData({ ...data, fromGallery: e })}
      />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {userPermissions?.lendTech?.delete && forEdit && (
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
        message="آیا از حذف این پیام اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
    </Modal>
  );
};

export default LendTechModal;
