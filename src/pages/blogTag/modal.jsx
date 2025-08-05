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
import { Modal, TextInput, UploadImage } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_BLOG_Tag,
  DELETE_BLOG_Tag,
  EDIT_BLOG_Tag,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
const BlogTagModal = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
  setNewRow
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [active, setActive] = useState(false);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");

  const [avatar, setAvatar] = useState();

  const [openDelete, setOpenDelete] = useState(false);

  // set data
  useEffect(() => {
    if (forEdit) {
      setTitle(data.title);
      setAvatar(data.avatar);
      setActive(data.preview);
    } else {
      resetData();
    }
  }, [allRows, data, forEdit]);
  const resetData = () => {
    setTitle("");

    setAvatar();
    setActive(false);
  };
  const deleteCategory = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(`${baseUrl}/${DELETE_BLOG_Tag}?id=${data.id}`, configReq(token))
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
      /*   link: data.link, */
      /*       parentId: parent?.id, */
      title,
      /*     description, */
/*       files: avatar || null,
      fromGallery: selectedProductImage ? selectedProductImage : "", */
      preview: active,
    };
    if (forEdit) {
      sendingData = { ...sendingData, id: data.id };
    }
    var temp = [...allRows];
    if (title) {
      setLoading(true);
      if (forEdit) {
        axiosInstance
          .put(`${baseUrl}/${EDIT_BLOG_Tag}`, sendingData, configReq(token))
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
          .post(`${baseUrl}/${CREATE_BLOG_Tag}`, sendingData, configReq(token))
          .then((res) => {
            temp.unshift(res.data.data);
          
            setAllRows(temp);
            setLoading(false);
            toast.success("با موفقیت اضافه شد");
            setNewRow(res.data.data)
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
      toast.error("نام تگ را وارد کنید");
    }
  };

  return (
    <Modal
      open={open}
      close={close}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  تگ ها
    `}
    >
      <TextInput
        label="نام تگ جدید"
        change={setTitle}
        currentValue={title}
      />
      {/*       <Dropdown
        value={parent}
        change={setParent}
        data={allRows}
        title="والد تگ"
        emptyValue={true}
      /> */}
      {/*       <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Typography variant="caption">توضیحات</Typography>
        <TextField
          multiline
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ width: "100%" }}
          rows={2}
        />
      </Box>{" "} */}
      <div className="flex flex-wrap items-center gap-3">
        {" "}
   {/*      <UploadImage
          file={avatar}
          change={setAvatar}
          address={data.galleryId ? data.galleryId : false}
          selectedProductImage={selectedProductImage}
          setselectedProductImage={setselectedProductImage}
        /> */}
        <span>پیش نمایش : </span>
        <Switch checked={active} onChange={() => setActive(!active)} />
      </div>

      <Box sx={{ display: "flex" }}>
        {userPermissions?.blogTag?.delete && forEdit && (
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
        message="آیا از حذف این تگ اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteCategory}
        open={openDelete}
      />
    </Modal>
  );
};

export default BlogTagModal;
