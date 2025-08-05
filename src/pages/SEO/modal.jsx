import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Dropdown, PageTitle, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { Confirm } from "../../components/modals";
import NoAccess from "../../components/noAccess";
import {
  ALL_STATIC_PAGES,
  baseUrl,
  CREATE_SEO,
  DELETE_PAGE_SEO,
  EDIT_PAGE_SEO,
  GET_SEO,
  GET_SHOWCASES_URLS,
  GET_SINGLE_PAGE_SEO,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const SeoTagEditor = ({ tags, setTags }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [tagType, setTagType] = useState("meta");
  const [tagName, setTagName] = useState("");
  const [tagContent, setTagContent] = useState("");
  const [tagHref, setTagHref] = useState("");

  const handleOpenDialog = (index = null) => {
    if (index !== null) {
      const tag = tags[index];
      if (tag.type === "title") {
        setTagType("title");
        setTagContent(tag.content || "");
      } else if (tag.type === "meta") {
        setTagType("meta");
        setTagName(tag.name || "");
        setTagContent(tag.content || "");
      } else if (tag.type === "link") {
        setTagType("link");
        setTagName(tag.rel || "");
        setTagHref(tag.href || "");
      }
      setEditIndex(index);
    } else {
      setTagType("meta");
      setTagName("");
      setTagContent("");
      setTagHref("");
      setEditIndex(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveTag = () => {
    let newTag = {};

    if (tagType === "title") {
      newTag = { type: "title", content: tagContent };
    } else if (tagType === "meta") {
      newTag = { type: "meta", name: tagName, content: tagContent };
    } else if (tagType === "link") {
      newTag = { type: "link", rel: tagName, href: tagHref };
    }

    if (editIndex !== null) {
      const newTags = [...tags];
      newTags[editIndex] = newTag;
      setTags(newTags);
    } else {
      setTags([...tags, newTag]);
    }

    handleCloseDialog();
  };

  const handleDeleteTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const renderTagContent = (tag) => {
    if (tag.type === "title") {
      return `<title>${tag.content}</title>`;
    } else if (tag.type === "meta") {
      return `<meta name="${tag.name}" content="${tag.content}"/>`;
    } else if (tag.type === "link") {
      return `<link rel="${tag.rel}" href="${tag.href}" />`;
    }
    return "";
  };

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <h3>تگ های SEO</h3>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          افزودن تگ
        </Button>
      </Box>

      <List>
        {tags.map((tag, index) => (
          <React.Fragment key={index}>
            <ListItem
              sx={{
                ".MuiTypography-root": {
                  textAlign: "right !important",
                },
                ".MuiListItemSecondaryAction-root": {
                  left: "16px !important",
                  right: "unset !important",
                },
              }}
            >
              <ListItemText
                primary={
                  tag.type === "title"
                    ? "Title"
                    : tag.type === "meta"
                    ? `Meta: ${tag.name}`
                    : `Link: ${tag.rel}`
                }
                secondary={renderTagContent(tag)}
              />
              <ListItemSecondaryAction
                sx={{ left: "16px !important", right: "unset !important" }}
              >
                <IconButton edge="end" onClick={() => handleOpenDialog(index)}>
                  <Edit color="warning" />
                </IconButton>
                <IconButton
                  sx={{ mx: 3 }}
                  edge="end"
                  onClick={() => handleDeleteTag(index)}
                >
                  <Delete color="error" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editIndex !== null ? "ویرایش تگ" : "افزودن تگ جدید"}
        </DialogTitle>
        <DialogContent className="leftInput">
          <FormControl fullWidth margin="normal">
            <InputLabel>نوع تگ</InputLabel>
            <Select
              value={tagType}
              onChange={(e) => setTagType(e.target.value)}
              label="نوع تگ"
            >
              <MenuItem value="meta">Meta</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="link">Link</MenuItem>
            </Select>
          </FormControl>

          {tagType === "title" ? (
            <TextField
              fullWidth
              margin="normal"
              label="محتوای عنوان"
              value={tagContent}
              onChange={(e) => setTagContent(e.target.value)}
            />
          ) : tagType === "meta" ? (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="نام متا (name)"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="محتوا (content)"
                value={tagContent}
                onChange={(e) => setTagContent(e.target.value)}
              />
            </>
          ) : (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="نوع لینک (rel)"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="آدرس (href)"
                value={tagHref}
                onChange={(e) => setTagHref(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>انصراف</Button>
          <Button onClick={handleSaveTag} variant="contained" color="primary">
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const CreateSeo = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [data, setData] = useState({});
  const [seoTags, setSeoTags] = useState([]);
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();
  const [loading2, setLoading2] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [allUrl, setAllUrl] = useState([]);
  const [allUrlStatic, setAllUrlStatic] = useState([]);
  const [noIndex, setNoIndex] = useState(false);

  // Parse SEO content string to array of tag objects
  const parseContentToTags = (content) => {
    if (!content) return [];

    const tags = [];
    const lines = content.split("\n").filter((line) => line.trim());

    lines.forEach((line) => {
      line = line.trim();

      if (line.startsWith("<title>")) {
        const content = line.replace(/<\/?title>/g, "").trim();
        tags.push({ type: "title", content });
      } else if (line.startsWith("<meta")) {
        const nameMatch = line.match(/name="([^"]+)"/);
        const contentMatch = line.match(/content="([^"]*)"/);

        if (nameMatch && contentMatch) {
          tags.push({
            type: "meta",
            name: nameMatch[1],
            content: contentMatch[1],
          });
        }
      } else if (line.startsWith("<link")) {
        const relMatch = line.match(/rel="([^"]+)"/);
        const hrefMatch = line.match(/href="([^"]*)"/);

        if (relMatch && hrefMatch) {
          tags.push({
            type: "link",
            rel: relMatch[1],
            href: hrefMatch[1],
          });
        }
      }
    });

    return tags;
  };

  // Convert array of tag objects to content string
  const convertTagsToContent = (tags) => {
    return tags
      .map((tag) => {
        if (tag.type === "title") {
          return `<title>${tag.content}</title>`;
        } else if (tag.type === "meta") {
          return `<meta name="${tag.name}" content="${tag.content}"/>`;
        } else if (tag.type === "link") {
          return `<link rel="${tag.rel}" href="${tag.href}" />`;
        }
        return "";
      })
      .join(" \n ");
  };

  useEffect(() => {
    var tempUrl = [...allUrl];

    /*     axiosInstance(
      `${baseUrl}/${GET_BLOG_URL}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading(false);

        data?.data.map((item) => {
          if (item.url?.slice(0, 1) === "/") {
            tempUrl.push(`weblog${item.url}`);
          } else {
            tempUrl.push(`weblog/${item.url}`);
          }
        });


      })
      .catch((err) => {
        setLoading(false);
      }); */

    axiosInstance(
      `${baseUrl}/${GET_SHOWCASES_URLS}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;

        data?.data.map((item) => {
          if (item !== "/") {
            if (item.slice(0, 1) === "/") {
              tempUrl.push(item.substring(1));
            } else {
              tempUrl.push(item);
            }
          }
        });
      })
      .catch((err) => {});
    setAllUrl(tempUrl);

    axiosInstance(
      `${baseUrl}/${ALL_STATIC_PAGES}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        var tempUrlStatic = [];
        res.data.data.map((item) => {
          tempUrlStatic.push(item.url);
        });
        setAllUrlStatic(tempUrlStatic);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosInstance(
        `${baseUrl}/${GET_SINGLE_PAGE_SEO}?id=${id}`,
        configReq(token)
      )
        .then((res) => {
          setLoading(false);
          const seoData = {
            ...res?.data.data,
            url: res?.data.data?.url?.slice(1),
          };
          setData(seoData);

          // Parse content string to tags array
          const parsedTags = parseContentToTags(seoData.content);
          setSeoTags(parsedTags);

          // Fetch noIndex value using the same logic as seoGenrator
          axiosInstance(
            `${baseUrl}/${GET_SEO}?entityId=${id}&entityName=showCase`,
            configReq(token)
          )
            .then((seoRes) => {
              if (seoRes?.data.data) {
                setNoIndex(Boolean(seoRes.data.data.noIndex));
              }
            })
            .catch((err) => {
              // If no SEO data exists, keep default noIndex as false
              console.log("No SEO data found for this entity");
            });
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      const defaultContent =
        ' <title></title> \n <meta name="description" content=""/> \n <meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large"/> \n <link rel="canonical" href="" /> \n <meta property="og:locale" content="fa_IR" /> \n <meta property="og:type" content="article" /> \n <meta property="og:title" content="" /> \n <meta property="og:description" content="" /> \n <meta property="og:url" content="" /> \n <meta property="og:site_name" content="" /> \n <meta property="article:tag" content="" /> \n <meta property="article:section" content="" /> \n <meta property="og:updated_time" content="" /> \n <meta property="og:image" content="" /> \n <meta property="og:image:secure_url" content="" /> \n <meta property="og:image:width" content="" /> \n <meta property="og:image:height" content="" /> \n <meta property="og:image:alt" content="" /> \n <meta property="og:image:type" content="" /> \n <meta property="article:published_time" content="" /> \n <meta property="article:modified_time" content="" /> \n <meta name="twitter:card" content="" /> \n <meta name="twitter:title" content="" /> \n <meta name="twitter:description" content="" /> \n <meta name="twitter:image" content="" /> \n <meta name="twitter:label1" content="" /> \n <meta name="twitter:data1" content="" /> \n <meta name="twitter:label2" content="" /> \n <meta name="twitter:data2" content="" /> \n ';
      setData({ content: defaultContent });

      // Parse default content to tags array
      const parsedTags = parseContentToTags(defaultContent);
      setSeoTags(parsedTags);
    }
  }, [id]);

  const saveSeo = () => {
    if (!data.title) {
      toast.error("تگ h1 را وارد کنید");
    } else {
      setLoading2(true);
      const formattedUrl = `/${data.url.replace(/^\/+/, "")}`;

      // Convert tags array to content string before saving
      const contentString = convertTagsToContent(seoTags);

      // Save SEO page data
      axiosInstance
        .patch(
          `${baseUrl}/${EDIT_PAGE_SEO}`,
          { ...data, content: contentString, url: formattedUrl, id: id || 0 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          // After saving page SEO, save noIndex data using the same logic as seoGenrator
          const seoEntityId = id || res?.data?.data?.id;
          if (seoEntityId) {
            axiosInstance
              .patch(
                `${baseUrl}/${CREATE_SEO}`,
                {
                  Id: 0, // Always 0 for new/update
                  NoIndex: Boolean(noIndex),
                  EntityId: Number(seoEntityId),
                  EntityName: "showCase",
                  Url: formattedUrl,
                  SeoEntityTags: [],
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((seoRes) => {
                setLoading2(false);
                navigate("/seo");
                toast.success("با موفقیت ذخیره شد");
              })
              .catch((seoErr) => {
                setLoading2(false);
                toast.error(
                  seoErr.response?.data?.message || "خطا در ذخیره تنظیمات SEO"
                );
              });
          } else {
            setLoading2(false);
            navigate("/seo");
            toast.success("با موفقیت ذخیره شد");
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading2(false);
        });
    }
  };

  const deleteSeo = () => {
    axiosInstance
      .delete(`${baseUrl}/${DELETE_PAGE_SEO}?id=${data.id}`, configReq(token))
      .then((res) => {
        setLoading(false);
        setConfirmDelete(false);
        toast.success("با موفقیت حذف شد");
        navigate("/seo");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };

  if (!userPermissions?.seo?.view) {
    return <NoAccess />;
  }

  return (
    <div>
      <PageTitle
        broadCrumb={[
          {
            title: "   تنظیمات سایت",
            path: "/companyInfo",
          },
          {
            title: "   تنظیمات SEO",
            path: "/seo",
          },
        ]}
        title={id ? `ویرایش seo صفحه ${data?.url || ""}` : "افزودن SEO  "}
      />{" "}
      <div className="md:mx-3 mx-1">
        {" "}
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
          className="flex flex-col gap-5"
        >
          {loading ? (
            <>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton variant="rectangular" height={600} sx={{ mt: 2 }} />
            </>
          ) : (
            <>
              {" "}
              <div className="md:grid grid-cols-4 gap-3">
                {" "}
                <Dropdown
                  value={TYPES?.find((g) => g.id === data?.type)}
                  change={(e) => setData({ ...data, type: e.id })}
                  data={TYPES}
                  title="نوع"
                />{" "}
                <div className="leftInput relative col-span-1">
                  <div className="relative ">
                    {" "}
                    <Autocomplete
                      value={data.url || ""}
                      onChange={(event, newValue) => {
                        setData({ ...data, url: newValue });
                      }}
                      fullWidth
                      freeSolo
                      inputValue={data.url || ""}
                      onInputChange={(event, newInputValue) => {
                        setData({
                          ...data,
                          url: newInputValue,
                        });
                      }}
                      getOptionLabel={(option) => option}
                      id="controllable-states-demo"
                      options={data?.type === 1 ? allUrlStatic : allUrl}
                      renderInput={(params) => (
                        <TextField
                          focused
                          {...params}
                          sx={{
                            input: {
                              paddingRight: "20px !important",
                            },
                          }}
                          label="انتخاب صفحه"
                        />
                      )}
                    />
                  </div>
                </div>
                <TextInput
                  label="تگ h1"
                  change={(e) => setData({ ...data, title: e })}
                  currentValue={data?.title}
                />
                {/*   <div className="flex items-center gap-4">
                  <span className="text-sm">No Robot (No Index):</span>
                  <Switch
                    checked={noIndex}
                    onChange={(e) => setNoIndex(e.target.checked)}
                    color="primary"
                  />
                  <span className="text-xs text-gray-500">
                    فعال کردن این گزینه باعث می‌شود این صفحه توسط موتورهای جستجو ایندکس نشود
                  </span>
                </div> */}
              </div>
              {/* SEO Tag Editor Component */}
              <SeoTagEditor tags={seoTags} setTags={setSeoTags} />
            </>
          )}

          <div
            className={`flex ${id ? "justify-between" : "justify-end "} w-full`}
          >
            {id && userPermissions?.seoSite?.delete && (
              <IconButton size="large" onClick={() => setConfirmDelete(true)}>
                <Delete sx={{ color: "red" }} />
              </IconButton>
            )}
            <Button onClick={saveSeo} variant="contained">
              {loading2 ? <CircularProgress /> : <>ثبت اطلاعات</>}
            </Button>
          </div>
        </Paper>
      </div>
      <Confirm
        message="آیا از حذف این seo اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteSeo}
        open={confirmDelete}
      />
    </div>
  );
};

export default CreateSeo;
const TYPES = [
  { id: 0, title: "شوکیس" },
  { id: 1, title: "استاتیک" },
];
