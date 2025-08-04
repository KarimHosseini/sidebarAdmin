/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ALL_USERS,
  baseUrl,
  CREATE_BLOG,
  CREATE_REDIRECT_GENRALL,
  DELETE_BLOG,
  EDIT_BLOG,
  GET_BLOG_CATEGORY,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import BlogCategoryModal from "../../pages/blogCategory/modal";
import { logout } from "../../redux/slices/user";
import { TextEditor, TextInput, UploadImage } from "../common";
import AutocompleteTag from "../common/autoCompelete";
import SearchInput2 from "../common/searchInput2";
import axiosInstance from "../dataFetch/axiosInstance";
import RedirectModal from "./redirect";

const Forms = ({
  nextStep,
  setCreatedId,
  setCreatedName,
  data,
  setCreated,
  editMode,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const [selectedProductImage, setselectedProductImage] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [showingCats, setShowingCats] = useState([]);

  const [catSearchWord, setCatSearchWord] = useState("");
  const [editModeRedirect, seteditModeRedirect] = useState(false);
  const [category, setCategory] = useState("");
  const [productCode, setProductCode] = useState("");
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState(false);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [summery, setSummery] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [newData, setNewData] = useState({});
  const [files, setFiles] = useState();
  const [userName, setUserName] = useState();
  const [value, setValue] = useState();
  /*   const [seo, setSeo] = useState(
      ' <title></title> \n <meta name="description" content=""/> \n <meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large"/> \n <link rel="canonical" href="" /> \n <meta property="og:locale" content="fa_IR" /> \n <meta property="og:type" content="article" /> \n <meta property="og:title" content="" /> \n <meta property="og:description" content="" /> \n <meta property="og:url" content="" /> \n <meta property="og:site_name" content="" /> \n <meta property="article:tag" content="" /> \n <meta property="article:section" content="" /> \n <meta property="og:updated_time" content="" /> \n <meta property="og:image" content="" /> \n <meta property="og:image:secure_url" content="" /> \n <meta property="og:image:width" content="" /> \n <meta property="og:image:height" content="" /> \n <meta property="og:image:alt" content="" /> \n <meta property="og:image:type" content="" /> \n <meta property="article:published_time" content="" /> \n <meta property="article:modified_time" content="" /> \n <meta name="twitter:card" content="" /> \n <meta name="twitter:title" content="" /> \n <meta name="twitter:description" content="" /> \n <meta name="twitter:image" content="" /> \n <meta name="twitter:label1" content="" /> \n <meta name="twitter:data1" content="" /> \n <meta name="twitter:label2" content="" /> \n <meta name="twitter:data2" content="" /> \n '
    );
   */
  const navigate = useNavigate();
  useEffect(() => {
    axiosInstance(
      `${baseUrl}/${GET_BLOG_CATEGORY}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setShowingCats(data?.data);
        if (!editMode) {
          setCategory(data?.data[0]);
        } else {
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          dispatch(logout());
        }
      });
  }, []);

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setCategory(
        [...showingCats].find((cat) => cat.id === data.blogCategoryId)
      );
      /*   setSeo(data.seo || ""); */
      setSelected(data.selected || "");
      setNewData({ url: data.url });
      setDescription(data.blogContent || "");
      setActive(data.active);
      setSummery(data.summery);
      setUserName(data.userFullName);
      setselectedProductImage(data?.galleryId);
    }
  }, [
    showingCats,
    data,
    data?.title,
    data?.brandId,
    data?.categoryId,
    /*  data?.seo, */
    data?.code,
    data?.description,
    data?.weight,
  ]);
  useEffect(() => {
    const notFilteredRows = [...showingCats];
    let afterFilterRows = notFilteredRows.filter((row) =>
      row.title.toLowerCase().includes(catSearchWord.toLowerCase())
    );

    setShowingCats(afterFilterRows);
  }, [catSearchWord]);
  const submit = (e) => {
    e.preventDefault();

    if (!title) {
      toast.error("نام بلاگ را وارد کنید");
      setError("title");
      scrollToTop();
    } /* else if (files.length === 0 && fromGallery === "") {
        toast.error("تصویر شاخص محصول را وارد کنید");
        setError("files");
        scrollToTop();
      } */ else if (!newData.url) {
      toast.error("   نشانی بلاگ را وراد کنید");
      setError("productCode");
      scrollToTop();
    } else if (!category) {
      toast.error("دسته بندی بلاگ را وارد کنید");
      setError("category");
      scrollToTop();
    } else if (!value && !data?.userId) {
      toast.error("  نام نویسنده را وارد کنید");
      scrollToTop();
    } else {
      let fd = new FormData();

      fd.append("title", title);
      fd.append("userId", value?.id || data?.userId);
      fd.append(
        "url",
        newData.url.slice(0, 1) === "/"
          ? newData.url.replace(/ /g, "-")
          : `/${newData.url.replace(/ /g, "-")}`
      );
      fd.append("blogCategoryId", category?.id);
      fd.append("active", active);
      fd.append("selected", selected ? true : false);
      fd.append("summery", summery);

      if (selectedProductImage) fd.append("fromGallery", selectedProductImage);

      fd.append("blogContent", description);
      /*       fd.append("seo", seo.replace(/[\r\n]/gm, ""));
       */
      if (files) fd.append("files", files);

      if (id) fd.append("id", id);
      setError();
      setLoading(true);
      if (id) {
        axiosInstance
          .put(`${baseUrl}/${EDIT_BLOG}`, fd, configReq(token))
          .then((res) => {
            setLoading(false);
            if (res.data.code === 200) {
              if (data.url !== newData.url) {
                axiosInstance
                  .post(
                    `${baseUrl}/${CREATE_REDIRECT_GENRALL}`,
                    {
                      Title: data.title,
                      EntityId: data.id,
                      EntityName: "blog",
                      FromUrl: `/blog${
                        data.url.slice(0, 1) === "/"
                          ? data.url.replace(/ /g, "-")
                          : `/${data.url.replace(/ /g, "-")}`
                      }`,
                      ToUrl: `/blog${
                        newData.url.slice(0, 1) === "/"
                          ? newData.url.replace(/ /g, "-")
                          : `/${newData.url.replace(/ /g, "-")}`
                      }`,
                      RedirectType: newData.redirectType,
                      IsActive: true,
                      LastSlug: `${data.url.replace(/ /g, "-")}`,
                    },
                    configReq(token)
                  )
                  .then((res) => {
                    toast.success("با موفقیت ویرایش شد");

                    nextStep();
                  });
              } else {
                toast.success("با موفقیت ویرایش شد");

                nextStep();
              }
            } else {
              toast.error("مشکلی در درخواست شما وجود دارد");
            }
          })
          .catch((err) => {
            toast.error(err.response?.data?.message);
            setLoading(false);

            if (err?.response?.status === 401) {
              dispatch(logout());
            }
          });
      } else {
        axiosInstance
          .post(`${baseUrl}/${CREATE_BLOG}`, fd, configReq(token))
          .then((res) => {
            setLoading(false);
            if (res.data.code === 200) {
              toast.success("با موفقیت اضافه شد");
              setCreatedId(res.data.data.id);
              setCreated(res.data.data);
              setCreatedName(title);
              nextStep();
            } else {
              toast.error("مشکلی در درخواست شما وجود دارد");
            }
          })
          .catch((err) => {
            toast.error(err.response?.data?.message);
            setLoading(false);

            if (err?.response?.status === 401) {
              dispatch(logout());
            }
          });
      }
    }
  };
  const deleteProduct = (e) => {
    axiosInstance
      .post(
        `${baseUrl}/${CREATE_REDIRECT_GENRALL}`,
        {
          Title: data.title,
          EntityId: data.id,
          EntityName: "blog",
          FromUrl: `/blog${
            data.url.slice(0, 1) === "/"
              ? data.url.replace(/ /g, "-")
              : `/${data.url.replace(/ /g, "-")}`
          }`,
          ToUrl: `/blog${
            e.url.slice(0, 1) === "/"
              ? e.url.replace(/ /g, "-")
              : `/${e.url.replace(/ /g, "-")}`
          }`,
          RedirectType: e.redirectType,
          IsActive: true,
          LastSlug: `${data.url.replace(/ /g, "-")}`,
        },
        configReq(token)
      )
      .then((res) => {
        setLoading(true);
        axiosInstance
          .delete(`${baseUrl}/${DELETE_BLOG}?id=${id}`, {
            data: {
              blogId: data?.id,
              url: "",
              redirectType: 301,
            },
            headers: {
              /*   "Content-Type": "multipart/form-data", */
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setLoading(false);
            setConfirmDelete(false);
            navigate("/blog");
            toast.success("با موفقیت حذف شد");
          })
          .catch((err) => {
            setLoading(false);
            setConfirmDelete(false);
            toast.error(err.response?.data?.message);
          });
      });
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <form className="flex flex-col gap-3 md:px-0 px-2" onSubmit={submit}>
      <Alert severity={"info"} variant={"filled"}>
        نشانی بلاگ حتما به انگلیسی وارد شود
      </Alert>
      <div className="flex justify-between items-center flex-wrap gap-4 md:mb-0 mb-2">
        <Typography variant="body2" className="text-[#262626]">
          اطلاعات بلاگ جدید را تکمیل نمائید.
        </Typography>
        <div className="flex items-center gap-2">
          {editMode && (
            <div className="md:ml-8 flex items-center gap-3">
              <span className="text-sm"> لایک : {data?.liked}</span>
              <span className="text-sm"> بازدید : {data?.viewCount}</span>
            </div>
          )}
          {editMode && (
            <Button
              target={"_blank"}
              href={`${process.env.REACT_APP_DOMAIN_URL}/blog${
                newData?.url?.slice(0, 1) === "/"
                  ? newData?.url?.replace(/ /g, "-")
                  : `/${newData?.url?.replace(/ /g, "-")}`
              }`}
              variant="outlined"
            >
              نمایش نوشته
            </Button>
          )}
          <Button type="submit" disabled={loading} variant="contained">
            {editMode ? (
              <> {loading ? <CircularProgress /> : <> ثبت اطلاعات</>}</>
            ) : (
              <> {loading ? <CircularProgress /> : <> مرحله بعد</>}</>
            )}
          </Button>
        </div>
      </div>
      <Divider sx={{ borderStyle: "dashed !important" }} />
      <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 gap-x-8 md:gap-y-4 gap-y-7 md:mt-0 mt-4">
        <div className="">
          {" "}
          <TextInput
            label="عنوان بلاگ"
            change={setTitle}
            currentValue={title}
          />
        </div>
        <SearchInput2
          url={ALL_USERS}
          value={value}
          setValue={setValue}
          defualtValue={userName}
          label={"انتخاب نویسنده "}
        />
        <div
          onClick={() => {
            if (editMode) {
              seteditModeRedirect(true);
            }
          }}
        >
          <Box
            sx={{
              input: {
                paddingRight: "20px !important",
              },
            }}
            className="leftInput relative"
          >
            <TextField
              label=" نشانی بلاگ "
              onChange={(e) => {
                if (!editMode) {
                  setNewData({ ...newData, url: e.target.value });
                }
              }}
              value={
                newData.url?.slice(0, 1) === "/"
                  ? newData.url?.substring(1)
                  : newData.url
              }
              InputLabelProps={{ shrink: true }}
              err={error === "newData.url"}
              fullWidth
            />
            <div className="absolute left-4 top-3">/</div>
          </Box>
        </div>
        <div className="flex items-start gap-2">
          <AutocompleteTag
            label="انتخاب دسته بندی"
            data={showingCats}
            value={category}
            change={setCategory}
          />
          <IconButton onClick={() => setOpenCreate(true)}>
            <AddIcon />
          </IconButton>
        </div>{" "}
        <UploadImage
          file={files}
          change={(e) => {
            setFiles(e);
          }}
          address={null}
          selectedProductImage={selectedProductImage}
          setselectedProductImage={setselectedProductImage}
        />
        <div className="flex items-center">
          {" "}
          <Box className="flex items-center">
            <span className="text-xs">فعال/غیر فعال:</span>
            <Switch
              size="small"
              checked={active}
              onChange={() => setActive(!active)}
            />
          </Box>
          <Box className="flex items-center">
            <span className="text-xs"> منتخب سردیبر :</span>
            <Switch
              size="small"
              checked={selected}
              onChange={() => setSelected(!selected)}
            />
          </Box>
        </div>
      </div>
      <TextField
        multiline={true}
        rows={2}
        onChange={(e) => setSummery(e.target.value)}
        label=" چکیده مطلب"
        value={summery}
        InputProps={{
          inputProps: {
            maxlength: 250,
            min: 0,
          },
        }}
      />
      <Box sx={{ pt: 1 }}>
        <TextEditor
          value={description}
          change={setDescription}
          hint=" محتوا بلاگ"
        />
      </Box>
      {/*
      <Box className="leftTextArea">
        <Typography sx={{ direction: "rtl", mb: "5px" }}>
          متاتگ های SEO :
        </Typography>
        <TextField
          multiline
          value={seo}
          onChange={(e) => setSeo(e.target.value)}
          sx={{
            width: "100%",
            textarea: {
              resize: "vertical !important",
            },
          }}
          rows={3}
        />
      </Box>
 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: editMode ? "space-between" : "end",
        }}
      >
        {editMode && userPermissions?.blog?.delete && (
          <IconButton
            size="medium"
            color="error"
            onClick={() => setConfirmDelete(true)}
          >
            <Delete />
          </IconButton>
        )}

        <Button type="submit" disabled={loading} variant="contained">
          {editMode ? (
            <> {loading ? <CircularProgress /> : <> ثبت اطلاعات</>}</>
          ) : (
            <> {loading ? <CircularProgress /> : <> مرحله بعد</>}</>
          )}
        </Button>
      </Box>
      <RedirectModal
        open={editModeRedirect || confirmDelete}
        deleteMode={confirmDelete}
        close={() => {
          setConfirmDelete(false);
          seteditModeRedirect(false);
        }}
        prevData={newData}
        name="url"
        setPrevData={setNewData}
        handleDelete={(e) => deleteProduct(e)}
      />{" "}
      <BlogCategoryModal
        open={openCreate}
        setAllRows={setShowingCats}
        allRows={showingCats}
        data={{}}
        close={() => {
          setOpenCreate(false);
        }}
      />
    </form>
  );
};

export default Forms;
