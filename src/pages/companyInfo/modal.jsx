import { Delete } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, TextInput, UploadImage } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_FOOTER_LOGOES,
  DELETE_FOOTER_LOGOES,
  EDIT_FOOTER_LOGOES,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const FooterModal = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [avatar, setAvatar] = useState({});
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setTitle(data.title);
      setUrl(data.url);
      setAvatar(data.avatar);
    } else {
      resetData();
    }
  }, [data, forEdit]);

  const resetData = () => {
    setTitle("");
    setUrl("");
    setselectedProductImage();

    setAvatar({});
  };

  const deleteBrand = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_FOOTER_LOGOES}?id=${data.id}`,
          configReq(token)
        )
        .then((res) => {
          var temp = [...allRows];
          var newData = temp.filter((item) => item.id !== data.id);
          setAllRows(newData);
          setLoading(false);
          setOpenDelete(false);
          close();
          if (data.code === 200) {
            toast.success("با موفقیت حذف شد");
          }
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
      title,
      files: avatar,
      fromGallery: selectedProductImage ? selectedProductImage : "",
      url: url,
    };
    if (forEdit) {
      sendingData = { ...sendingData, id: data.id };
    }
    var temp = [...allRows];
    if (title) {
      setLoading(true);
      if (forEdit) {
        axiosInstance
          .put(
            `${baseUrl}/${EDIT_FOOTER_LOGOES}`,
            sendingData,
            configReq(token)
          )
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
            `${baseUrl}/${CREATE_FOOTER_LOGOES}`,
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
    } else if (!title) {
      toast.error("نام برند را وارد کنید");
    }
  };

  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  عکس فوتر`}
    >
      <TextInput label="نام عکس " change={setTitle} currentValue={title} />
      <TextInput ltr label="لینک عکس " change={setUrl} currentValue={url} />
      {/*     <div className="flex items-center gap-3">
        <span>فعال/غیر فعال : </span>
        <Switch checked={active} onChange={() => setActive(!active)} />
      </div> */}
      <UploadImage
        file={avatar}
        change={setAvatar}
        address={data.galleryId}
        selectedProductImage={selectedProductImage}
        setselectedProductImage={setselectedProductImage}
      />

      <Box sx={{ display: "flex" }}>
        {userPermissions?.brand?.delete && forEdit && (
          <IconButton onClick={() => setOpenDelete(true)}>
            <Delete color="error" />
          </IconButton>
        )}
        <div style={{ flexGrow: 1 }} />
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
        message="آیا از حذف این برند اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteBrand}
        open={openDelete}
      />
    </Modal>
  );
};

export default FooterModal;
