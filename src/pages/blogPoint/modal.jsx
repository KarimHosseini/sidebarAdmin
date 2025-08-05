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
import { Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_BLOG_CATEGORY,
  DELETE_BLOG_CATEGORY,
  EDIT_BLOG_CATEGORY,
  EDIT_BLOG_POINT,
  EDIT_BLOG_POINT_VERIFY,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
const BlogPointModal = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [description, setDescription] = useState("");

  const [openDelete, setOpenDelete] = useState(false);

  // set data
  useEffect(() => {
    if (forEdit) {
      setDescription(data.point);
    } else {
      resetData();
    }
  }, [allRows, data, forEdit]);
  const resetData = () => {
    setDescription("");
  };
  const deleteCategory = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_BLOG_CATEGORY}?id=${data.id}`,
          configReq(token)
        )
        .then((res) => {
          setLoading(false);
          setOpenDelete(false);
          var temp = [...allRows];
          var newData = temp.filter((item) => item.id !== data.id);
          setAllRows(newData);
          close();
          toast.success("با موفقیت حذف شد");
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
          setOpenDelete(false);
          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
    }
  };

  const editItem = () => {
    var sendingData = {
      id: data.id,
      point: description,
    };
    if (forEdit) {
      sendingData = { ...sendingData, id: data.id };
    }
    var temp = [...allRows];

    setLoading(true);
    if (forEdit) {
      axiosInstance
        .put(`${baseUrl}/${EDIT_BLOG_POINT}`, sendingData, configReq(token))
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
        .post(
          `${baseUrl}/${CREATE_BLOG_CATEGORY}`,
          sendingData,
          configReq(token)
        )
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
  const editVerify = () => {
    setLoading2(true);
    var temp = [...allRows];

    axiosInstance
      .put(
        `${baseUrl}/${EDIT_BLOG_POINT_VERIFY}`,
        { pointId: data?.id },
        configReq(token)
      )
      .then((res) => {
        setLoading2(false);
        toast.success("با موفقیت تایید شد");
        var index = temp.findIndex((item) => item.id === data.id);
        temp[index] = { ...temp[index], verified: !data?.verified };
        setAllRows(temp);
        close();
        resetData();
      })
      .catch((err) => {
        setLoading2(false);
        toast.error(err.response?.data?.message);

        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  return (
    <Modal
      open={open}
      close={close}
      title={` ${forEdit ? "ویرایش" : "افزودن"}   نظر 
    `}
    >
      {/*   <TextInput label="   عنوان" change={setTitle} currentValue={title} /> */}
      <TextField
        rows={3}
        multiline
        label="   متن نظر"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
      />

      <Box sx={{ display: "flex" }}>
        {userPermissions?.blogPoint?.delete && forEdit && (
          <IconButton onClick={() => setOpenDelete(true)}>
            <Delete color="error" />
          </IconButton>
        )}
        <div style={{ flexGrow: 1 }} />
        {!data?.verified ? (
          <Button
            variant="contained"
            color="success"
            onClick={editVerify}
            disabled={loading2}
            s
            sx={{ mx: "10px" }}
          >
            {loading2 ? <CircularProgress /> : <> تایید نظر</>}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="error"
            onClick={editVerify}
            disabled={loading2}
            s
            sx={{ mx: "10px" }}
          >
            {loading2 ? <CircularProgress /> : <> رد نظر</>}
          </Button>
        )}

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
        message="آیا از حذف این دسته بندی اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteCategory}
        open={openDelete}
      />
    </Modal>
  );
};

export default BlogPointModal;
