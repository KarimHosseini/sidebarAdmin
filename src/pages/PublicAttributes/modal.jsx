import { Delete } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, TextInput, UploadImage } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_PUBLIC_ATTR,
  DELETE_PUBLIC_ATTR,
  EDIT_PUBLIC_ATTR,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const EditPublicAttr = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
}) => {
  const { token } = useSelector((state) => state.user);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);

  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState([]);
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // set data
  useEffect(() => {
    if (data && forEdit) {
      setTitle(data.title);
      setName(data.name);
      setAvatar(data.avatar);
      setSlug(data.slug);
    } else {
      resetData();
    }
  }, [data, forEdit]);
  const resetData = () => {
    setTitle("");
    setAvatar();
    setName("");
    setselectedProductImage();
    setSlug("");
  };
  const deleteItem = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_PUBLIC_ATTR}?id=${data.id}`,
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
        });
    }
  };

  const editItem = () => {
    if (!slug) {
      toast.error("اسلاگ را وارد کنید");
      return;
    }
    let cleanSlug = slug.replace(/^\/+/, "").trim().replace(/\s+/g, "-");

    const englishSlugRegex = /^[a-zA-Z0-9\-_]+$/;
    if (!englishSlugRegex.test(cleanSlug)) {
      toast.error("اسلاگ باید فقط شامل حروف انگلیسی، اعداد یا - و _ باشد");
      return;
    }

    var sendingData = {
      title,
      name,
      type: 1,
      files: avatar || null,
      fromGallery: selectedProductImage ? selectedProductImage : "",
      slug: cleanSlug,
    };

    if (forEdit) {
      sendingData = {
        ...sendingData,
        id: data.id,
      };
    }
    if (title && name) {
      setLoading(true);
      var temp = [...allRows];
      if (forEdit) {
        axiosInstance
          .put(`${baseUrl}/${EDIT_PUBLIC_ATTR}`, sendingData, configReq(token))
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
            toast.error(err.response?.data?.message);
            setLoading(false);
          });
      } else {
        axiosInstance
          .post(
            `${baseUrl}/${CREATE_PUBLIC_ATTR}`,
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
            toast.error(err.response?.data?.message);
            setLoading(false);
          });
      }
    } else if (!title) {
      toast.error("نام دسته بندی را وارد کنید");
    } else if (!name) {
      toast.error("نام انگلیسی را وارد کنید");
    }
  };
  return (
    <Modal
      open={open}
      close={close}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  ویژگی های عمومی

    `}
    >
      <TextInput
        readOnly={data?.id === 3}
        label="نام ویژگی عمومی"
        change={setTitle}
        currentValue={title}
      />
      <TextInput label="به انگلیسی" ltr change={setName} currentValue={name} />

      <TextInput label="اسلاگ" ltr  change={setSlug} currentValue={slug} />
      <UploadImage
        selectedProductImage={selectedProductImage}
        setselectedProductImage={setselectedProductImage}
        file={avatar}
        change={setAvatar}
        address={data.galleryId ? data.galleryId : false}
      />
      <Box sx={{ display: "flex" }}>
        {userPermissions?.publicAttributes?.delete && forEdit && (
          <>
            {data?.id !== 3 && (
              <IconButton onClick={() => setOpenDelete(true)}>
                <Delete color="error" />
              </IconButton>
            )}
          </>
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
        message="آیا از حذف این دسته بندی اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

export default EditPublicAttr;
