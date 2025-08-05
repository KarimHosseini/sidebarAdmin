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
import {
  Dropdown,
  Modal,
  TextInput,
  UploadImage,
} from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_LOGIN_IMAGES,
  DELETE_LOGIN_IMAGES,
  EDIT_LOGIN_IMAGES,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const LoginImageModal = ({
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
          `${baseUrl}/${DELETE_LOGIN_IMAGES}?id=${data.id}`,
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
      title: datas?.title,
      files: avatar,
      fromGallery: selectedProductImage ? selectedProductImage : "",
      linkType: datas?.linkType?.id,
      /*       description: datas?.description,
       */ link: datas?.link,
      forMobile: datas?.forMobile,
    };
    if (forEdit) {
      sendingData = { ...sendingData, id: data.id };
    }

    var temp = [...allRows];
    if (datas?.title) {
      setLoading(true);
      if (forEdit) {
        axiosInstance
          .put(`${baseUrl}/${EDIT_LOGIN_IMAGES}`, sendingData, configReq(token))
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
            `${baseUrl}/${CREATE_LOGIN_IMAGES}`,
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
      title={` ${forEdit ? "ویرایش" : "افزودن"}   لینک 
      `}
    >
      <Dropdown
        value={datas?.linkType}
        change={(e) => setDatas({ ...datas, linkType: e })}
        data={allType}
        title="  تایپ"
        emptyValue={true}
      />{" "}
      <TextInput
        label="نام  "
        change={(e) => setDatas({ ...datas, title: e })}
        currentValue={datas?.title}
      />
      <div className="leftInput">
        <TextInput
          label="لینک  "
          change={(e) => setDatas({ ...datas, link: e })}
          currentValue={datas?.link}
          ltr
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span>نمایش در موبایل : </span>
        <Switch
          checked={datas.forMobile}
          onChange={() => setDatas({ ...datas, forMobile: !datas.forMobile })}
        />
      </div>{" "}
      <UploadImage
        file={avatar}
        change={setAvatar}
        address={data.galleryId}
        selectedProductImage={selectedProductImage}
        setselectedProductImage={setselectedProductImage}
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

export default LoginImageModal;
const allType = [
  { id: 5, title: "   تعیین رمز عبور" },
  { id: 4, title: "   فراموشی رمز عبور" },
  { id: 3, title: "  ثبت نام " },
  { id: 2, title: "  وارد کردن اس ام اس  " },
  { id: 1, title: "وارد کردن رمز عبور " },
  { id: 0, title: " ثبت شماره همراه" },
];
