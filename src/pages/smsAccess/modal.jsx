import { Delete } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, TextInput } from "../../components/common";
import SearchInput2 from "../../components/common/searchInput2";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  ALL_USERS,
  baseUrl,
  CREATE_SMS_ACCESS,
  DELETE_SMS_ACCESS,
  EDIT_SMS_ACCESS,
} from "../../helpers/api-routes";

import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const EditSmsAccess = ({
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
  const [target, setTarget] = useState({});
  useEffect(() => {
    if (forEdit) {
      setTarget(smsType.find((item) => item.id === prevData.target));
    }
  }, [prevData, forEdit, smsType]);
  const resetData = () => {
    setTarget({});
    setValue();
  };

  const submitData = () => {
    setLoading(true);
    var temp = [...allRows];
    var sData = {
      target: target?.id,
      userId: value ? value.id : prevData?.userId,
    };
    if (forEdit) {
      sData = { ...sData, id: prevData?.id };
      axiosInstance
        .put(`${baseUrl}/${EDIT_SMS_ACCESS}`, sData, configReq(token))
        .then((res) => {
          setLoading(false);
          toast.success("با موفقیت ویرایش شد");
          var index = temp.findIndex((item) => item.id === prevData.id);
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
        .post(`${baseUrl}/${CREATE_SMS_ACCESS}`, sData, configReq(token))
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
      .delete(
        `${baseUrl}/${DELETE_SMS_ACCESS}?id=${prevData.id}`,
        configReq(token)
      )
      .then((res) => {
        var temp = [...allRows];
        var newData = temp.filter((item) => item.id !== prevData.id);
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
      title="افزودن  دسترسی پیام  "
    >
      <Autocomplete
        options={smsType || []}
        getOptionLabel={(option) => option.title || ""}
        value={target || null}
        onChange={(e, newValue) => setTarget(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="انتخاب پیام هدف"
            variant="outlined"
            fullWidth
            margin="0"
          />
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
      <SearchInput2
        url={ALL_USERS}
        value={value}
        setValue={(e) => {
          setValue(e);
          setvalueChanges(true);
        }}
        label={"جست و جو کاربر"}
        defualtValue={prevData?.user}
      />
      {valueChanges && value?.mobile ? (
        <TextField value={value?.mobile} label=" شماره همراه" disabled />
      ) : (
        <TextInput
          currentValue={prevData?.mobile}
          label=" شماره همراه"
          disabled
        />
      )}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {userPermissions?.smsLogAccess?.delete && forEdit && (
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
        message="آیا از حذف این دسترسی پیام اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
    </Modal>
  );
};

export default EditSmsAccess;
