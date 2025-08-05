import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, TextInput } from "../../components/common";
import MapInput from "../../components/common/map";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_SITE_ADDRESS,
  DELETE_SITE_ADDRESS,
  EDIT_SITE_ADDRESS,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const AddressModal = ({
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
  const [datas, setDatas] = useState({});
  const [avatar, setAvatar] = useState();
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setDatas({
        ...data,
        linkType: allType.find((item) => item?.id === data?.linkType),
      });
      setAvatar(data.avatar);
    } else {
      resetData();
    }
  }, [data, forEdit]);

  const resetData = () => {
    setDatas({});
    setselectedProductImage();

    setAvatar();
  };

  const deleteBrand = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_SITE_ADDRESS}?id=${data.id}`,
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
      ...datas,
    };
    if (forEdit) {
      sendingData = { ...sendingData, id: data.id };
    }

    var temp = [...allRows];
    if (datas?.title) {
      setLoading(true);
      if (forEdit) {
        axiosInstance
          .put(`${baseUrl}/${EDIT_SITE_ADDRESS}`, sendingData, configReq(token))
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
            `${baseUrl}/${CREATE_SITE_ADDRESS}`,
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
    } else if (!datas?.title) {
      toast.error("نام  را وارد کنید");
    }
  };

  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"}   آدرس 
      `}
    >
      <TextInput
        label="نام  "
        change={(e) => setDatas({ ...datas, title: e })}
        currentValue={datas?.title}
      />
      <TextInput
        label="آدرس  "
        change={(e) => setDatas({ ...datas, address: e })}
        currentValue={datas?.address}
      />
      <TextInput
        label="تلفن  "
        change={(e) => setDatas({ ...datas, tel: e })}
        currentValue={datas?.tel}
      />
      <TextInput
        label="تلفن 2 "
        change={(e) => setDatas({ ...datas, tel2: e })}
        currentValue={datas?.tel2}
      />
      <TextInput
        label="کد پستی"
        change={(e) => setDatas({ ...datas, postalCode: e })}
        currentValue={datas?.postalCode}
      />
      <TextInput
        label="اولویت  "
        change={(e) => setDatas({ ...datas, showPriority: e })}
        currentValue={datas?.showPriority || ""}
        number
      />
      <TextInput
        label="توضیحات  "
        change={(e) => setDatas({ ...datas, description: e })}
        currentValue={datas?.description}
      />
      <div className="flex gap-1 items-center">
        <span className="text-sm ">وضعیت :</span>
        <Switch
          checked={datas.active}
          onClick={() => setDatas({ ...datas, active: !datas.active })}
        />
        <Typography
          sx={{ color: datas.active ? "#2ab32a" : "red" }}
          variant="body2"
        >
          {datas.active ? "فعال" : "غیر فعال"}
        </Typography>
      </div>{" "}
      <div className="flex gap-1 items-center">
        <span className="text-sm ">آدرس پیش فرض:</span>
        <Switch
          checked={datas.isDefault}
          onClick={() => setDatas({ ...datas, isDefault: !datas.isDefault })}
        />
      </div>
      <MapInput
        onLocationSelect={(e) => {
          setDatas({
            ...datas,
            longitude: e.longitude,
            latitude: e.latitude,
          });
        }}
        longitude={data.longitude}
        latitude={data.latitude}
      />
      <Box sx={{ display: "flex" }}>
        {
          /* userPermissions?.brand?.delete && */ forEdit && (
            <IconButton onClick={() => setOpenDelete(true)}>
              <Delete color="error" />
            </IconButton>
          )
        }
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

export default AddressModal;
const allType = [
  /*   { id: 2, title: " تصاویر راهنمای فوتر" },
   */
  { id: 2, title: " تصاویر راهنمای فوتر" },
  { id: 1, title: "دانلود اپلیکیشن" },
  { id: 0, title: "دانلود pwa" },
];
