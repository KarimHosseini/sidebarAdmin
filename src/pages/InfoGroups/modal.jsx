import { Delete } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
  CREATE_INFOGROUP,
  DELETE_INFOGROUP,
  EDIT_INFOGROUP,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const EditInfogroupModal = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
  brands,
}) => {
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);

  const { categories } = useSelector((state) => state.relationals);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedProductImage, setselectedProductImage] = useState();

  const [openDelete, setOpenDelete] = useState(false);
  const resetData = () => {
    setTitle("");
    setFile({});
    setselectedProductImage();

    setSelectedCategory("");
  };

  const deleteAttr = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_INFOGROUP}?id=${data.id}`,
          configReq(token)
        )
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

  const submitData = () => {
    const sumbitData = {
      id: data?.id,
      title,
      categoryId: selectedCategory?.id || null,
      files: file,
      fromGallery: selectedProductImage ? selectedProductImage : "",
      brandId: selectedBrand?.id || null,
    };
    var temp = [...allRows];
    if (title) {
      setLoading(true);
      if (forEdit) {
        axiosInstance
          .put(`${baseUrl}/${EDIT_INFOGROUP}`, sumbitData, configReq(token))
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
          .post(`${baseUrl}/${CREATE_INFOGROUP}`, sumbitData, configReq(token))
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
    } else {
    }
  };

  useEffect(() => {
    if (data && categories && forEdit) {
      setTitle(data.title);
      setFile(data.avatar);
      setSelectedCategory(categories.find((cat) => cat.id === data.categoryId));
      setSelectedBrand(brands.find((cat) => cat.id === data.brandId));
    } else {
      setTitle();
      setFile();
      setSelectedCategory();
      setSelectedBrand();
    }
  }, [categories, data, forEdit]);

  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"} توضیحات وندور
      `}
    >
      <TextInput label="متن توضیحات" change={setTitle} currentValue={title} />
      <Dropdown
        value={selectedCategory}
        change={setSelectedCategory}
        data={categories}
        title="دسته بندی"
      />
      <Dropdown
        value={selectedBrand}
        change={setSelectedBrand}
        data={[{ id: null, title: "بدون برند" }, ...brands]}
        title="برند"
      />
      <UploadImage
        selectedProductImage={selectedProductImage}
        setselectedProductImage={setselectedProductImage}
        file={file}
        change={setFile}
        address={data?.galleryId}
      />

      <Box sx={{ display: "flex" }}>
        {userPermissions?.categoryAbilities?.delete && forEdit && (
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
        message="آیا از حذف این توضیحات اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteAttr}
        open={openDelete}
      />
    </Modal>
  );
};

export default EditInfogroupModal;
