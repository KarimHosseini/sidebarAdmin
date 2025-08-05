import { Delete } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import RedirectModal from "../../components/blogs/redirect";
import {
  CategoryTree,
  PageTitle,
  TextEditor,
  TextInput,
  UploadImage,
} from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  CATEGORIES,
  CATEGORIES_GET_BY_ONE,
  CREATE_CATEGORY,
  CREATE_REDIRECT_GENRALL,
  DELETE_CATEGORY,
  EDIT_CATEGORY,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

import { logout } from "../../redux/slices/user";
const CategoryForm = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [active, setActive] = useState(null);
  const [insurance, setInsurance] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [newData, setNewData] = useState({ slug: "" });
  const { themeColor } = useSelector((state) => state.themeColor);
  const [editModeRedirect, seteditModeRedirect] = useState(false);
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState();
  const [parent, setParent] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [loadingCategories, setloadingCategories] = useState(false);

  const { id } = useParams();
  // set data
  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`${baseUrl}/${CATEGORIES_GET_BY_ONE}?id=${id}`, configReq(token))
        .then((res) => {
          setData(res.data.data);
          setTitle(res.data.data.title);
          setDescription(res.data.data.description);
          setAvatar(res.data.data.avatar);
          setNewData({ slug: res.data.data.slug });

          setParent(res.data.data.parentId);
          setActive(res.data.data.active);
          setInsurance(res.data.data.insurance);
        })
        .catch((err) => {});
    } else {
    }
  }, [id]);
  useEffect(() => {
    setloadingCategories(true);
    axiosInstance
      .get(`${baseUrl}/${CATEGORIES}?page=1&Limit=1000`, configReq(token))
      .then((res) => {
        setAllCategories(res.data.data);
        setloadingCategories(false);
      })
      .catch((err) => {
        setloadingCategories(false);
      });
  }, []);
  const deleteCategory = (e) => {
    if (data) {
      axiosInstance
        .post(
          `${baseUrl}/${CREATE_REDIRECT_GENRALL}`,
          {
            Title: data.title,
            EntityId: data.id,
            EntityName: "category",
            FromUrl: `/shop/${data.slug.replace(/\//g, "")}`,
            ToUrl: `/shop/${e.slug.replace(/\//g, "")}`,
            LastSlug: data.slug,
            RedirectType: e.redirectType,
            IsActive: true,
          },
          configReq(token)
        )
        .then((r) => {
          setLoading(true);
          axiosInstance
            .delete(
              `${baseUrl}/${DELETE_CATEGORY}?id=${data.id}`,
              configReq(token)
            )
            .then((res) => {
              setLoading(false);
              setOpenDelete(false);
              navigate("/categories");
              toast.success("با موفقیت حذف شد");
            })
            .catch((err) => {
              setLoading(false);
              toast.error(err.response?.data?.message);
              setOpenDelete(false);
              if (err.response.status === 401) {
                dispatch(logout());
              }
            });
        });
    }
  };
  const editItem = () => {
    if (!newData.slug) {
      toast.error("اسلاگ را وارد کنید");
      return;
    }
    let cleanSlug = newData.slug.replace(/^\/+/, "").trim().replace(/\s+/g, "-");

    var sendingData = {
      //link: data.//,
      parentId: parent || null,
      title: title.trim(),
      description,
      files: avatar || null,
      fromGallery: selectedProductImage ? selectedProductImage : "",
      active: Boolean(active),
      insurance: Boolean(insurance),
      slug: cleanSlug,
    };
    if (id) {
      sendingData = { ...sendingData, id: data.id };
    }
    if (title && newData.slug) {
      setLoading(true);
      if (id) {
        axiosInstance
          .put(`${baseUrl}/${EDIT_CATEGORY}`, sendingData, configReq(token))
          .then((res) => {
            if (data.slug !== newData.slug) {
              axiosInstance
                .post(
                  `${baseUrl}/${CREATE_REDIRECT_GENRALL}`,
                  {
                    Title: data.title,
                    EntityId: data.id,
                    EntityName: "category",
                    FromUrl: `/shop/${data.slug.replace(/\//g, "")}`,
                    ToUrl: `/shop/${cleanSlug.replace(/\//g, "")}`,
                    RedirectType: newData.redirectType,
                    IsActive: true,
                    LastSlug: data.slug,
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
          .post(`${baseUrl}/${CREATE_CATEGORY}`, sendingData, configReq(token))
          .then((res) => {
            navigate("/categories");
            setLoading(false);
            toast.success("با موفقیت اضافه شد");
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
      toast.error("نام و نشانی دسته بندی را وارد کنید");
    }
  };
  return (
    <>
      <PageTitle
        title={id ? `ویرایش دسته بندی ${title || ""}` : `ساخت دسته بندی جدید`}
        broadCrumb={[
          {
            title: "مدیریت محصولات",
            path: "/products",
          },
          {
            title: "دسته بندی ها",
            path: "/categories",
          },
        ]}
      />
      {loadingCategories ? (
        <CircularProgress />
      ) : (
        <Paper className="mx-3 p-8 flex flex-col gap-5">
          <TextInput
            label="نام دسته بندی جدید"
            change={setTitle}
            currentValue={title}
          />
          <div
            onClick={() => {
              if (id) {
                seteditModeRedirect(true);
              }
            }}
          >
            <TextInput
              label="نشانی دسته بندی جدید"
              change={(e) => {
                if (!id) {
                  setNewData({ ...newData, slug: e });
                }
              }}
              ltr={true}
              currentValue={newData.slug}
            />
          </div>
          <Alert severity="info">نشانی دسته بندی را به انگلیسی وارد کنید</Alert>
          <CategoryTree
            value={allCategories.find((item) => item.id === parent)}
            change={(e) => setParent(e ? e.id : null)}
            data={allCategories}
            title="والد دسته بندی"
            emptyValue={true}
          />
          <Box className="mt-4" sx={{ direction: "ltr !important" }}>
            <span className="text-xs"> توضیحات </span>
            <TextEditor
              value={description || ""}
              noBorder
              change={(e) => setDescription(e)}
            />
          </Box>{" "}
          <div className="flex flex-wrap items-center gap-3">
            <span>فعال سازی خدمات: </span>
            <Switch
              checked={insurance}
              onChange={() => setInsurance(!insurance)}
            />

            <span>فعال/غیر فعال : </span>
            <Switch checked={active} onChange={() => setActive(!active)} />
          </div>{" "}
          <UploadImage
            file={avatar}
            change={setAvatar}
            address={data.galleryId ? data.galleryId : false}
            selectedProductImage={selectedProductImage}
            setselectedProductImage={setselectedProductImage}
          />{" "}
          <Box sx={{ display: "flex" }}>
            {userPermissions?.categories?.delete && id && (
              <IconButton onClick={() => setOpenDelete(true)}>
                <Delete color="error" />
              </IconButton>
            )}
            <div style={{ flexGrow: 1 }} />
            {id && (
              <Button
                variant="contained"
                color="warning"
                onClick={() => {
                  if (id) {
                    seteditModeRedirect(true);
                  }
                }}
                sx={{ mx: 1 }}
              >
                افزودن ریدارکت
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={editItem}
              disabled={loading}
            >
              {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
            </Button>
          </Box>
          <RedirectModal
            open={editModeRedirect || openDelete}
            deleteMode={openDelete}
            close={() => {
              setOpenDelete(false);
              seteditModeRedirect(false);
            }}
            prevData={newData}
            name="slug"
            handleDelete={(e) => deleteCategory(e)}
            setPrevData={setNewData}
          />
        </Paper>
      )}
    </>
  );
};

export default CategoryForm;
