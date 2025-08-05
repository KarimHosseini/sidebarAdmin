import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Modal,
  NumberInput,
  TextInput,
  UploadImage,
} from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_SLIDER,
  DELETE_SLIDER,
  EDIT_SLIDER,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const EditSliderModal = ({
  open,
  close,
  data,
  forEdit,
  setAllRows,
  allRows,
}) => {
  const { token } = useSelector((state) => state.user);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);

  const [loading, setLoading] = useState(false);

  // form fields
  const [files, setFiles] = useState([]);
  const [link, setLink] = useState("");
  const [priority, setPriority] = useState(1);
  const [mobileView, setMobileView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  useEffect(() => {
    if (data && forEdit) {
      setLink(data.link);
      setMobileView(data.mobileView);
      setPriority(data.priority);
    } else {
      resetData();
    }
  }, [data, forEdit]);

  const resetData = () => {
    setFiles([]);
    setLink("");
    setPriority(1);
    setMobileView(false);
    setselectedProductImage();
  };

  const submitData = () => {
    var fd = {
      link,
      priority,
      files,
      mobileView,
      fromGallery: selectedProductImage ? selectedProductImage : "",
    };
    var temp = [...allRows];
    setLoading(true);
    if (forEdit) {
      fd = { ...fd, id: data.id };
      axiosInstance
        .put(`${baseUrl}/${EDIT_SLIDER}`, fd, configReq(token))
        .then((res) => {
          var index = temp.findIndex((item) => item.id === data.id);
          temp[index] = res.data.data;
          setAllRows(temp);
          setLoading(false);
          close();
          resetData();
          toast.success("با موفقیت ویرایش شد");
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);

          setLoading(false);
        });
    } else {
      axiosInstance
        .post(`${baseUrl}/${CREATE_SLIDER}`, fd, configReq(token))
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
  };

  const deleteItem = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(`${baseUrl}/${DELETE_SLIDER}?id=${data.id}`, configReq(token))
        .then((res) => {
          var temp = [...allRows];
          var newData = temp.filter((item) => item.id !== data.id);
          setAllRows(newData);
          setLoading(false);
          setOpenDelete(false);
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

  return (
    <Modal
      open={open}
      close={close}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  اسلایدر`}
    >
      <TextInput label="لینک تصویر" ltr change={setLink} currentValue={link} />
      <NumberInput label="اولویت نمایش" change={setPriority} value={priority} />
      <UploadImage
        file={files}
        change={setFiles}
        address={data?.galleryId}
        selectedProductImage={selectedProductImage}
        setselectedProductImage={setselectedProductImage}
      />
      <Box>
        <span style={{ fontFamily: "IRANSansFa" }}>برای نمایش در موبایل:</span>
        <Switch
          checked={mobileView}
          onChange={() => setMobileView(!mobileView)}
        />
      </Box>
      <Box sx={{ display: "flex" }}>
        {userPermissions?.sliders?.delete && forEdit && (
          <IconButton onClick={() => setOpenDelete(true)}>
            <Delete color="error" />
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
        </Button>
      </Box>
      <Confirm
        message="آیا از حذف این اسلایدر اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

export default EditSliderModal;
