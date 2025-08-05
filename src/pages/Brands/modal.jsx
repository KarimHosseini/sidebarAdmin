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
import RedirectModal from "../../components/blogs/redirect";
import {
  Modal,
  TextEditor,
  TextInput,
  UploadImage,
} from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  CREATE_BRAND,
  CREATE_REDIRECT_GENRALL,
  DELETE_BRAND,
  EDIT_BRAND,
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
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [active, setActive] = useState(null);
  const [newData, setNewData] = useState({ slug: "" });
  const [editModeRedirect, seteditModeRedirect] = useState(false);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [avatar, setAvatar] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  useEffect(() => {
    if (forEdit) {
      setTitle(data.title);
      setAvatar(data.avatar);
      setActive(data.active);
      setDescription(data.description);
      setSlug(data.slug);
      setNewData({ slug: data.slug });
    } else {
      setTitle();
      setAvatar();
      setDescription("");
      setActive(true);
      setSlug("");
    }
  }, [data, forEdit]);

  const resetData = () => {
    setTitle("");
    setselectedProductImage();
    setDescription("");
    setAvatar({});
    setSlug("");
  };

  const deleteBrand = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .post(
          `${baseUrl}/${CREATE_REDIRECT_GENRALL}`,
          {
            Title: data.title,
            EntityId: data.id,
            EntityName: "category",
            FromUrl: `${data.slug.replace(/\//g, "")}`,
            ToUrl: `${newData.slug.replace(/\//g, "")}`,
            RedirectType: newData.redirectType,
            IsActive: true,
            LastSlug: data.slug.replace(/\//g, ""),
          },
          configReq(token)
        )
        .then((r) => {
          axiosInstance
            .delete(
              `${baseUrl}/${DELETE_BRAND}?id=${data.id}`,
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
          setLoading(false);
          toast.success("با موفقیت ویرایش شد");
        });
    }
  };

  const editItem = () => {
    if (!newData.slug) {
      toast.error("اسلاگ را وارد کنید");
      return;
    }
    let cleanSlug = newData.slug
      .replace(/^\/+/, "")
      .trim()
      .replace(/\s+/g, "-");

    const englishSlugRegex = /^[a-zA-Z0-9\-_]+$/;
    if (!englishSlugRegex.test(cleanSlug)) {
      toast.error("اسلاگ باید فقط شامل حروف انگلیسی، اعداد یا - و _ باشد");
      return;
    }
    var sendingData = {
      title,
      files: avatar,
      fromGallery: selectedProductImage ? selectedProductImage : "",
      active,
      description,
      slug: cleanSlug,
    };
    if (forEdit) {
      sendingData = { ...sendingData, id: data.id };
    }
    var temp = [...allRows];

    if (title) {
      setLoading(true);
      if (forEdit) {
        axiosInstance
          .put(`${baseUrl}/${EDIT_BRAND}`, sendingData, configReq(token))
          .then((res) => {
            if (data.slug !== newData.slug) {
              axiosInstance
                .post(
                  `${baseUrl}/${CREATE_REDIRECT_GENRALL}`,
                  {
                    Title: data.title,
                    EntityId: data.id,
                    EntityName: "brand",
                    FromUrl: `${data.slug.replace(/\//g, "")}`,
                    ToUrl: `${cleanSlug}`,
                    RedirectType: newData.redirectType,
                    IsActive: true,
                    LastSlug: data.slug.replace(/\//g, ""),
                  },
                  configReq(token)
                )
                .then((r) => {
                  setLoading(false);
                  toast.success("با موفقیت ویرایش شد");
                });
            } else {
              setLoading(false);
              toast.success("با موفقیت ویرایش شد");
            }
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
          .post(`${baseUrl}/${CREATE_BRAND}`, sendingData, configReq(token))
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
    } else if (!title) {
      toast.error("نام برند را وارد کنید");
    }
  };

  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  برند`}
    >
      <TextInput label="نام برند" change={setTitle} currentValue={title} />
      <div
        onClick={() => {
          if (forEdit) {
            seteditModeRedirect(true);
          }
        }}
      >
        {" "}
        <TextInput
          label=" نشانی"
          change={(e) => {
            if (!forEdit) {
              setNewData({ ...newData, slug: e });
            }
          }}
          currentValue={newData.slug}
          ltr
        />
      </div>
      <Box className="mt-4" sx={{ direction: "ltr !important" }}>
        <span className="text-xs"> توضیحات (صفحه شاپ)</span>
        <TextEditor
          value={description || ""}
          noBorder
          change={(e) => setDescription(e)}
          smaller
        />
      </Box>
      <div className="flex items-center gap-3">
        <span>فعال/غیر فعال : </span>
        <Switch checked={active} onChange={() => setActive(!active)} />
      </div>
      <UploadImage
        file={avatar}
        change={setAvatar}
        address={data.galleryId}
        selectedProductImage={selectedProductImage}
        setselectedProductImage={setselectedProductImage}
      />
      <Box sx={{ display: "flex" }}>
        {userPermissions?.brand?.delete && forEdit && (
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
      {/*      <Confirm
        message="آیا از حذف این برند اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteBrand}
        open={openDelete}
      />{" "} */}
      <RedirectModal
        open={editModeRedirect || openDelete}
        deleteMode={openDelete}
        close={() => {
          setOpenDelete(false);
          seteditModeRedirect(false);
        }}
        prevData={newData}
        name="slug"
        handleDelete={(e) => deleteBrand(e)}
        setPrevData={setNewData}
      />
    </Modal>
  );
};

export default BrandModal;
