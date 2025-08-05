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
  CREATE_ATTR,
  DELETE_ATTR,
  EDIT_ATTR,
} from "../../helpers/api-routes";
import { productsPropertiesTypes } from "../../helpers/constants";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
const EditAttribute = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { attrGroups } = useSelector((state) => state.relationals);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [type, setType] = useState();
  const [showInShop, setshowInShop] = useState(false);
  const [showInProduct, setshowInProduct] = useState(false);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [avatar, setAvatar] = useState({});
  const [group, setGroup] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProductImage, setselectedProductImage] = useState();

  const [confirmDelete, setConfirmDelete] = useState(false);

  const resetData = () => {
    setName("");
    setTitle("");
    setshowInProduct("");
    setAvatar();
    setGroup("");
    setshowInShop("");
    setselectedProductImage();
  };

  useEffect(() => {
    if (data && forEdit) {
      setTitle(data.title);
      setName(data.name);
      setAvatar(data.avatar);
      setshowInShop(data.showInShop);
      setshowInProduct(data.showInProduct);
      setType(productsPropertiesTypes.find((item) => item.value === data.type));
      let currentGroup = [...attrGroups].find((grp) => grp.id === data.groupId);
      setGroup(currentGroup || "");
    } else {
      resetData();
    }
  }, [data, attrGroups, forEdit]);

  const submitData = () => {
    if (!name) {
      toast.error("نام ویژگی به انگلیسی را وارد کنید");
      return;
    }
    if (!title) {
      toast.error("عنوان ویژگی را وارد کنید");
      return;
    }
    var sendingData = {
      title,
      name: name.trim().replace(/\s+/g, "-"),
      files: avatar,
      groupId: group.id,
      type: type ? type.value : data.type,
      fromGallery: selectedProductImage ? selectedProductImage : "",
      showInShop: Boolean(showInShop),
      showInProduct: Boolean(showInProduct),
    };
    if (forEdit) {
      sendingData = { ...sendingData, id: data.id };
    }
    var temp = [...allRows];
    setLoading(true);
    if (forEdit) {
      axiosInstance
        .put(`${baseUrl}/${EDIT_ATTR}`, sendingData, configReq(token))
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

          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
    } else {
      axiosInstance
        .post(`${baseUrl}/${CREATE_ATTR}`, sendingData, configReq(token))
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

          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
    }
  };

  const deleteAttr = () => {
    setLoading(true);
    axiosInstance
      .delete(`${baseUrl}/${DELETE_ATTR}?id=${data.id}`, configReq(token))
      .then((res) => {
        var temp = [...allRows];
        var newData = temp.filter((item) => item.id !== data.id);
        setAllRows(newData);
        setLoading(false);
        setConfirmDelete(false);
        toast.success("با موفقیت حذف شد");
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
  };

  return (
    <Modal
      close={() => {
        close();
        resetData();
      }}
      open={open}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  ویژگی`}
    >
      <TextInput change={setTitle} currentValue={title} label="نام ویژگی" />
      <TextInput ltr change={setName} currentValue={name} label="به انگلیسی" />
      <Dropdown
        value={type}
        change={setType}
        data={productsPropertiesTypes}
        title="انتخاب نوع مقادیر"
      />
      <Dropdown
        value={group}
        change={setGroup}
        data={[
          {
            title: "بدون دسته",
          },
          ...attrGroups,
        ]}
        title="انتخاب دسته بندی ویژگی"
      />
      <div className="flex justify-between items-center">
        <span>نمایش در مشخصات : </span>
        <Switch
          checked={showInProduct}
          onChange={() => setshowInProduct(!showInProduct)}
        />
      </div>
      <div className="flex justify-between items-center">
        <span>نمایش در فروشگاه : </span>
        <Switch
          checked={showInShop}
          onChange={() => setshowInShop(!showInShop)}
        />
      </div>
      <UploadImage
        file={avatar}
        change={setAvatar}
        address={data.galleryId ? data.galleryId : false}
        selectedProductImage={selectedProductImage}
        setselectedProductImage={setselectedProductImage}
      />

      <Box sx={{ display: "flex", alignItems: "center" }}>
        {data?.values?.length === 0 &&
          forEdit &&
          userPermissions?.attributes?.delete && (
            <IconButton size="large" onClick={() => setConfirmDelete(true)}>
              <Delete color="error" />
            </IconButton>
          )}{" "}
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
      {data?.values?.length === 0 && forEdit && (
        <Confirm
          message="آیا از حذف این ویژگی اطمینان دارید؟"
          close={() => setConfirmDelete(false)}
          submit={deleteAttr}
          open={confirmDelete}
        />
      )}
    </Modal>
  );
};

export default EditAttribute;
