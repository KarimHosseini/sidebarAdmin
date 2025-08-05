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
import { Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  DELETE_PRODUCY_SCORE,
  EDIT_PRODUCY_SCORE,
} from "../../helpers/api-routes";

import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const EditComments = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { userPermissions } = useSelector((state) => state.relationals);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(prevData || {});
  useEffect(() => {
    if (forEdit) {
      setData(prevData || {});
    }
  }, [prevData, forEdit]);
  const resetData = () => {
    setData({});
  };

  const submitData = () => {
    setLoading(true);
    var temp = [...allRows];
    if (forEdit) {
      axiosInstance
        .put(`${baseUrl}/${EDIT_PRODUCY_SCORE}`, data, configReq(token))
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
    }
  };
  const deleteAttr = () => {
    setLoading(true);
    axiosInstance
      .delete(
        `${baseUrl}/${DELETE_PRODUCY_SCORE}?id=${data.id}`,
        configReq(token)
      )
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
      title="ویرایش  نظر "
    >
      <TextInput
        label=" متن "
        change={(e) => setData({ ...data, title: e })}
        currentValue={data.title || ""}
      />
      <TextInput
        label=" توضیحات "
        change={(e) => setData({ ...data, description: e })}
        currentValue={data.description || ""}
      />
      {/*    <NumberInput
        label=" امتیاز "
        change={(e) => setData({ ...data, score: e })}
        value={data.score}
      /> */}
      <div>
        <span>توصیه می کند/نمی کند : </span>
        <Switch
          checked={data?.suggest}
          onChange={() => setData({ ...data, suggest: !data?.suggest })}
        />
      </div>
      <div>
        <span>تایید نمایش نظر : </span>
        <Switch
          checked={data?.verified}
          onChange={() => setData({ ...data, verified: !data?.verified })}
        />
      </div>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {forEdit && userPermissions?.productScores?.delete  && (
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
        message="آیا از حذف این نظر اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
    </Modal>
  );
};

export default EditComments;
