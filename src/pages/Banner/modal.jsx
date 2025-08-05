import { Delete } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import "@neshan-maps-platform/react-openlayers/dist/style.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
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
  CREATE_BANNER,
  DELETE_BANNER,
  EDIT_BANNER,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const BannerModal = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
  brands,
}) => {
  const { token } = useSelector((state) => state.user);
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProductImage, setselectedProductImage] = useState();
  const [avatar, setAvatar] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);
  const { categories } = useSelector((state) => state.relationals);

  const { id } = useParams();

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
        .delete(`${baseUrl}/${DELETE_BANNER}?id=${data.id}`, configReq(token))
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
      files: avatar,
      fromGallery: selectedProductImage ? selectedProductImage : "",
    };
    Object.keys(sendingData).forEach((key) => {
      if (sendingData[key] === null || sendingData[key] === "") {
        delete sendingData[key];
      }
    });
    if (selectedProductImage) {
      delete sendingData.galleryId;
    }
    if (!sendingData.link) {
      toast.error("وارد کردن لینک اجباری است");
      return;
    }
    setLoading(true);
    var temp = [...allRows];
    if (forEdit) {
      axiosInstance
        .put(`${baseUrl}/${EDIT_BANNER}`, sendingData, configReq(token))
        .then((res) => {
          setLoading(false);
          toast.success("با موفقیت ویرایش شد");
          var index = temp.findIndex((item) => item.id === data.id);
          temp[index] = res.data.data;
          setAllRows(temp);
          close();
          reset();
          setAllData({});
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading(false);
        });
    } else {
      axiosInstance
        .post(`${baseUrl}/${CREATE_BANNER}`, sendingData, configReq(token))
        .then((res) => {
          temp.unshift(res.data.data);

          setAllRows(temp);
          setLoading(false);
          toast.success("با موفقیت اضافه شد");
          close();
          reset();
          setAllData({});
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading(false);
        });
    }
  };
  const reset = () => {};
  return (
    <Modal
      open={open}
      close={() => {
        close();
        reset();
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"}   بنر`}
    >
      {" "}
      <TextInput
        label=" نام "
        change={(e) => setAllData({ ...allData, title: e })}
        currentValue={allData?.title}
      />
      <TextInput
        label=" لینک "
        change={(e) => setAllData({ ...allData, link: e })}
        currentValue={allData?.link}
        ltr
      />
      <TextInput
        label=" توضیحات "
        change={(e) => setAllData({ ...allData, description: e })}
        currentValue={allData?.description}
      />
      <Dropdown
        title=" محل قرار گیری عکس"
        change={(e) => setAllData({ ...allData, linkType: e?.id })}
        value={LINK_TYPE.find((item) => item.id === allData?.linkType)}
        data={LINK_TYPE}
      />
      <Dropdown
        title=" نمایش در "
        change={(e) => setAllData({ ...allData, moduleNumber: e?.id })}
        value={MODULE.find((item) => item.id === allData?.moduleNumber)}
        data={MODULE}
      />{" "}
      {allData?.moduleNumber === 3 && (
        <>
          {" "}
          <Dropdown
            value={categories.find((item) => item.id === allData?.categoryId)}
            change={(e) => setAllData({ ...allData, categoryId: e?.id })}
            data={[{ id: null, title: "بدون دسته بندی" }, ...categories]}
            title="دسته بندی"
          />
          <Dropdown
            value={brands.find((item) => item.id === allData?.brandId)}
            change={(e) => setAllData({ ...allData, brandId: e?.id })}
            data={[{ id: null, title: "بدون برند" }, ...brands]}
            title="برند"
          />
        </>
      )}
      <UploadImage
        file={avatar}
        change={setAvatar}
        address={data.galleryId ? data.galleryId : false}
        selectedProductImage={selectedProductImage}
        setselectedProductImage={setselectedProductImage}
      />
      <Box sx={{ display: "flex" }}>
        {userPermissions?.banner?.delete && data.id && (
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
        message="آیا از حذف این بنر اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

export default BannerModal;
const LINK_TYPE = [
  {
    id: 1,
    title: "برای موبایل",
  },
  {
    id: 2,
    title: "برای دسکتاپ",
  },
];
const MODULE = [
  {
    id: 1,
    title: "پرداخت موفق در صفحه برگشت بانک",
  },
  {
    id: 2,
    title: "پرداخت ناموفق در صفحه برگشت بانک",
  },
  {
    id: 3,
    title: "    بنر تبلیغاتی صفحه محصول",
  },
  {
    id: 4,
    title: "    سرچ باکس",
  },
  {
    id: 5,
    title: "    صفحه 500",
  },
  {
    id: 6,
    title: "    صفحه 502",
  },
  {
    id: 7,
    title: "    صفحه 410",
  },
  {
    id: 8,
    title: "    صفحه 404",
  },
];
