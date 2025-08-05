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
import Map from "../../components/common/map";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_BRANCHES,
  DELETE_BRANCHES,
  EDIT_BRANCHES,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const BrandModal = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
  province,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [cities, setCities] = useState();
  const [pd, setPd] = useState({});
  const [loading, setLoading] = useState(false);

  const [avatar, setAvatar] = useState({});
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setPd({ ...data });
      setCities(province?.find((item) => item.id === data.provinceId)?.cities);
    } else {
    }
  }, [data, forEdit]);

  const resetData = () => {
    setPd({});
    setAvatar({});
  };

  const deleteBrand = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(`${baseUrl}/${DELETE_BRANCHES}?id=${data.id}`, configReq(token))
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
      title: pd.title,
      files: avatar,
      fromGallery: selectedProductImage ? selectedProductImage : "",
      active: Boolean(pd.active),
      address: pd.address,
      provinceId: pd.provinceId,
      cityId: pd.cityId,
      latitude: pd.latitude,
      longitude: pd.longitude,
    };
    if (forEdit) {
      sendingData = { ...sendingData, id: data.id };
    }
    var temp = [...allRows];

    if (pd.title) {
      setLoading(true);
      if (forEdit) {
        axiosInstance
          .put(`${baseUrl}/${EDIT_BRANCHES}`, sendingData, configReq(token))
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
          .post(`${baseUrl}/${CREATE_BRANCHES}`, sendingData, configReq(token))
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
    } else if (!pd.title) {
      toast.error("نام شعبه را وارد کنید");
    }
  };
  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      autoWidth
      title={` ${forEdit ? "ویرایش" : "افزودن"}  شعبه`}
    >
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="نام شعبه"
          change={(e) => {
            setPd({ ...pd, title: e });
          }}
          currentValue={pd.title}
        />
        <TextInput
          label="نشانی شعبه"
          change={(e) => {
            setPd({ ...pd, address: e });
          }}
          currentValue={pd.address}
        />
        <Dropdown
          title=" استان"
          data={province}
          value={province?.find((item) => item.id === pd.provinceId)}
          change={(e) => {
            setCities(e?.cities);
            setPd({ ...pd, provinceId: e?.id });
          }}
        />
        <Dropdown
          title="شهر "
          data={cities}
          value={cities?.find((item) => item.id === pd.cityId)}
          change={(e) => setPd({ ...pd, cityId: e?.id })}
        />
      </div>
      <Map
        setData={(e) => {
          setPd({ ...pd, latitude: e.lat, longitude: e.lon });
        }}
        longitude={pd.longitude}
        setAddress={() => {}}
        latitude={pd.latitude}
      />
      <div className="flex items-center gap-3">
        <span>فعال/غیر فعال : </span>
        <Switch
          checked={pd.active}
          onChange={() => setPd({ ...pd, active: !pd.active })}
        />
      </div>
      <UploadImage
        file={avatar}
        change={setAvatar}
        address={data.galleryId}
        selectedProductImage={selectedProductImage}
        setselectedProductImage={setselectedProductImage}
      />

      <Box sx={{ display: "flex" }}>
        {userPermissions?.branch?.delete && forEdit && (
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
        message="آیا از حذف این شعبه اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteBrand}
        open={openDelete}
      />
    </Modal>
  );
};

export default BrandModal;
