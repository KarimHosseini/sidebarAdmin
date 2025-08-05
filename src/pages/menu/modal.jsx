import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dropdown, Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_MENU,
  EDIT_MENU,
  REMOVE_MENU,
} from "../../helpers/api-routes";

import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const EditMenu = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(prevData || {});
  useEffect(() => {
    if (forEdit) {
      setData({ ...prevData, position: SMSTYPE[prevData.position - 1] });
    }
  }, [prevData, forEdit]);
  const resetData = () => {
    setData({});
  };

  const submitData = () => {
    setLoading(true);
    var temp = [...allRows];
    const datas = {
      id: data.id,
      title: data?.title,
      active: data?.active,
      mobileView: data?.mobileView ? true : false,
      position: SMSTYPE.findIndex((item) => item === data?.position) + 1,
    };
    if (forEdit) {
      axiosInstance
        .put(`${baseUrl}/${EDIT_MENU}`, datas, configReq(token))
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
        .post(`${baseUrl}/${CREATE_MENU}`, datas, configReq(token))
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
      .delete(`${baseUrl}/${REMOVE_MENU}?id=${data.id}`, configReq(token))
      .then((res) => {
        var temp = [...allRows];
        var newData = temp.filter((item) => item.id !== data.id);
        setAllRows(newData);
        setLoading(false);
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
      title={` ${forEdit ? "ویرایش" : "افزودن"}  منو `}
    >
      <TextInput
        label="عنوان"
        change={(e) => setData({ ...data, title: e })}
        currentValue={data?.title}
      />
      <Dropdown
        value={data?.position}
        change={(e) => setData({ ...data, position: e })}
        data={SMSTYPE}
        title="موقعیت "
      />
      <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <span>نمایش در موبایل:</span>
        <Switch
          onChange={(e) =>
            setData({
              ...data,
              mobileView: !data?.mobileView,
            })
          }
          checked={data?.mobileView}
        />
      </Box>
      <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <span> فعال/غیرفعال :</span>
        <Switch
          onChange={(e) =>
            setData({
              ...data,
              active: !data?.active,
            })
          }
          checked={data?.active}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {userPermissions?.menu?.delete && forEdit && (
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
        message="آیا از حذف این  اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
    </Modal>
  );
};

export default EditMenu;
const SMSTYPE = ["هدر", "فوتر"];
