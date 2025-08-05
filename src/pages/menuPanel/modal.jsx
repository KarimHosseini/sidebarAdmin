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
import { Modal, TextInput, UploadImage } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_PANEL_MENU,
  DELETE_PANEL_MENU,
  EDIT_PANEL_MENU,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const EditMenuPanel = ({
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
  const [avatar, setAvatar] = useState();
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);
  const { themeColor } = useSelector((state) => state.themeColor);
  const useDarkMode = themeColor === "dark";
  // set data
  useEffect(() => {
    if (data && forEdit) {
      setAllData(data);
    } else {
      setAllData({});
    }
  }, [data, forEdit]);

  const deleteItem = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_PANEL_MENU}?id=${data.id}`,
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
      Title: allData.title,
      Order: allData.order,
      Url: allData.url,

      Active: allData.active ? true : false,
    };
    if (forEdit) {
      sendingData = { ...sendingData, id: data?.id };
    }
    if (selectedProductImage) {
      sendingData = { ...sendingData, FromGallery: selectedProductImage };
    }
    if (avatar) {
      sendingData = { ...sendingData, Files: avatar };
    }
    setLoading(true);
    var temp = [...allRows];
    if (forEdit) {
      axiosInstance
        .put(`${baseUrl}/${EDIT_PANEL_MENU}`, sendingData, configReq(token))
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
        .post(`${baseUrl}/${CREATE_PANEL_MENU}`, sendingData, configReq(token))
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
      title={` ${forEdit ? "ویرایش" : "افزودن"}   منو  پنل کاربری`}
    >
      <TextInput
        label="نام "
        change={(e) => setAllData({ ...allData, title: e })}
        currentValue={allData?.title}
      />{" "}
      <TextInput
        label="اولویت"
        change={(e) => setAllData({ ...allData, order: e })}
        currentValue={allData?.order}
      />{" "}
      <TextInput
        label="نشانی"
        change={(e) => setAllData({ ...allData, url: e })}
        currentValue={allData?.url}
        ltr
      />{" "}
      <div className="flex items-center">
        <div className="flex items-center gap-4">
          <span className="text-xs"> فعال/غیرفعال : </span>
          <Switch
            onChange={() =>
              setAllData({ ...allData, active: !allData?.active })
            }
            defaultChecked={data?.active}
          />
        </div>
      </div>
      <UploadImage
        file={avatar}
        change={setAvatar}
        address={data?.icon}
        selectedProductImage={selectedProductImage}
        setselectedProductImage={setselectedProductImage}
      />
      <Box sx={{ display: "flex" }}>
        {userPermissions?.menuPanel?.delete && (
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
        message="آیا از حذف این   منو اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

export default EditMenuPanel;
