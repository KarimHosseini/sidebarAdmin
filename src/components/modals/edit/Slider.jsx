import { Delete } from "@mui/icons-material";
import { Box, IconButton, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  baseUrl,
  DELETE_SLIDER,
  EDIT_SLIDER,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import {
  ActionButton,
  Loading,
  Modal,
  NumberInput,
  TextInput,
  UploadImage,
} from "../../common";
import axiosInstance from "../../dataFetch/axiosInstance";
import Confirm from "../Confirm";

const EditSliderModal = ({ open, close, data }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);

  const [loading, setLoading] = useState(false);

  // form fields
  const [files, setFiles] = useState([]);
  const [link, setLink] = useState("");
  const [priority, setPriority] = useState(1);
  const [mobileView, setMobileView] = useState(false);
  useEffect(() => {
    if (data) {
      setLink(data.link);
      setMobileView(data.mobileView);
      setPriority(data.priority);
    }
  }, [data]);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    setFiles([]);
    setLink("");
    setPriority(1);
    setMobileView(false);
    setselectedProductImage();
  }, []);

  const submitData = () => {
    const fd = {
      id: data.id,
      link,
      priority,
      files,
      mobileView,
      fromGallery: selectedProductImage ? selectedProductImage : "",
    };
    setLoading(true);
    axiosInstance
      .put(`${baseUrl}/${EDIT_SLIDER}`, fd, configReq(token))
      .then((res) => {
        setLoading(false);
        toast.success("با موفقیت ویرایش شد");
        close();
        setselectedProductImage();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };

  const deleteItem = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(`${baseUrl}/${DELETE_SLIDER}/${data.id}`, configReq(token))
        .then((res) => {
          setLoading(false);
          setOpenDelete(false);
          close();
          toast.success("با موفقیت ویرایش شد");
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
          setOpenDelete(false);
        });
    }
  };

  return (
    <Modal open={open} close={close} title="ویرایش اسلایدر">
      {loading && <Loading />}
      <TextInput label="لینک تصویر" ltr change={setLink} currentValue={link} />
      <NumberInput label="اولویت نمایش" change={setPriority} value={priority} />
      <UploadImage
        file={files}
        change={setFiles}
        address={data?.image}
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
        {userPermissions?.sliders?.delete && (
          <IconButton onClick={() => setOpenDelete(true)}>
            <Delete color="error" />
          </IconButton>
        )}
        <div style={{ flexGrow: 1 }} />
        <ActionButton click={submitData} />
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
