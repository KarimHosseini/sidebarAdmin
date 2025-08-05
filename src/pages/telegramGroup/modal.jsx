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
  CREATE_TELEGRAM_GROUP,
  DELETE_TELEGRAM_GROUP,
  EDIT_TELEGRAM_GROUP,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const EditTelegramGroup = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
}) => {
  const { token } = useSelector((state) => state.user);
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [avatar, setAvatar] = useState([]);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);
  const { themeColor } = useSelector((state) => state.themeColor);
  const [files, setFiles] = useState([]);

  // set data
  useEffect(() => {
    if (data && forEdit) {
      setAllData(data);
    } else {
      setAllData({});
      setFiles([]);
      setselectedProductImage();
    }
  }, [data, forEdit]);

  const deleteItem = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_TELEGRAM_GROUP}?id=${data.id}`,
          configReq(token)
        )
        .then((res) => {
          var temp = [...allRows];
          var newData = temp.filter((item) => item.id !== data.id);
          setAllRows(newData);
          setLoading(false);
          toast.success("با موفقیت حذف شد");
          setOpenDelete(false);
          close();
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
          setOpenDelete(false);
        });
    }
  };

  const editItem = () => {
    var sendingData = {
      ...allData,
    };
    if (forEdit) {
      sendingData = { ...sendingData, id: data?.id };
    }
    if (files) {
      sendingData = { ...sendingData, files };
    }
    if (selectedProductImage) {
      sendingData = { ...sendingData, fromGallery: selectedProductImage };
    }

    setLoading(true);
    var temp = [...allRows];
    if (forEdit) {
      axiosInstance
        .put(`${baseUrl}/${EDIT_TELEGRAM_GROUP}`, sendingData, configReq(token))
        .then((res) => {
          setLoading(false);
          toast.success("با موفقیت ویرایش شد");
          var index = temp.findIndex((item) => item.id === data.id);
          temp[index] = res.data.data;
          setAllRows(temp);
          close();
          setAllData({});
          setAvatar([]);
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading(false);
        });
    } else {
      axiosInstance
        .post(
          `${baseUrl}/${CREATE_TELEGRAM_GROUP}`,
          sendingData,
          configReq(token)
        )
        .then((res) => {
          temp.unshift(res.data.data);

          setAllRows(temp);
          setLoading(false);
          toast.success("با موفقیت اضافه شد");
          close();
          setAllData({});
          setAvatar([]);
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading(false);
        });
    }
  };
  return (
    <Modal
      open={open}
      close={close}
      title={` ${forEdit ? "ویرایش" : "افزودن"} گروه تلگرام`}
    >
      <TextInput
        label="نام "
        change={(e) => setAllData({ ...allData, title: e })}
        currentValue={allData?.title}
      />
      <TextInput
        label="توضیحات"
        change={(e) => setAllData({ ...allData, description: e })}
        currentValue={allData?.description}
      />
      <TextInput
        label="توکن"
        change={(e) => setAllData({ ...allData, token: e })}
        currentValue={allData?.token}
      />{" "}
      <TextInput
        label="آیدی چت"
        change={(e) => setAllData({ ...allData, chatId: e })}
        currentValue={allData?.chatId}
      />
      <UploadImage
        file={files}
        change={setFiles}
        address={data?.galleryId}
        selectedProductImage={selectedProductImage}
        setselectedProductImage={setselectedProductImage}
      />
      <Box sx={{ display: "flex" }}>
        {userPermissions?.telegramGroup?.delete && (
          <IconButton onClick={() => setOpenDelete(true)}>
            <Delete color="error" />
          </IconButton>
        )}
        <div style={{ flexGrow: 1 }} />{" "}
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
        message="آیا از حذف این   بسته بندی اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

export default EditTelegramGroup;
