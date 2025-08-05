import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Dropdown,
  Modal,
  SearchInput,
  TextInput,
} from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  ALL_USERS,
  baseUrl,
  CREATE_USER_NOTIFICATION_TARGET,
  DELETE_USER_NOTIFICATION_TARGET,
  EDIT_USER_NOTIFICATION_TARGET,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const SmsModal = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
  smsType,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [valueChanges, setvalueChanges] = useState(false);

  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(prevData || {});
  useEffect(() => {
    if (forEdit) {
      setData({
        ...prevData,
        type: smsType.find((item) => String(item.id) === String(prevData.type)),
      });
    } else {
      setData({});
    }
  }, [prevData, forEdit, smsType]);
  const resetData = () => {
    setData({});
  };
  const submitData = () => {
    setLoading(true);
    var temp = [...allRows];
    var s_data = {
      target: data?.type?.id,
      type: 0,
    };
    if (forEdit) {
      s_data = { ...s_data, id: data.id };
      axiosInstance
        .put(`${baseUrl}/${EDIT_USER_NOTIFICATION_TARGET}`, s_data, configReq(token))
        .then((res) => {
          setLoading(false);
          toast.success("با موفقیت ویرایش شد");
          var index = temp.findIndex((item) => item.id === data.id);
          temp[index] = res.data.data;
          setAllRows(temp);
          close();
          resetData();
          setValue();
          setvalueChanges(false);
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
        .post(`${baseUrl}/${CREATE_USER_NOTIFICATION_TARGET}`, s_data, configReq(token))
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
      .delete(`${baseUrl}/${DELETE_USER_NOTIFICATION_TARGET}?id=${data.id}`, configReq(token))
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
        setValue();
        setvalueChanges(false);
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  نوع هدف نوتیفیکیش کاربر`}
    >


      <Dropdown
        value={data?.type}
        change={(e) => setData({ ...data, type: e })}
        data={smsType}
        title=" انتخاب پیام هدف"
      />

      <Box sx={{ display: "flex", alignItems: "center" }}>
        {userPermissions?.userNotification?.delete && forEdit && (
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

export default SmsModal;
