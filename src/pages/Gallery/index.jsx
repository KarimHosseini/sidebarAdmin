/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Edit } from "@mui/icons-material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  ImageListItem,
  ImageListItemBar,
  Paper,
  Popover,
  Skeleton,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dropdown, Modal, PageTitle } from "../../components/common";
import Search from "../../components/common/search";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Filters from "../../components/filters";
import ImageGallery from "../../components/imageGallery";
import NoAccess from "../../components/noAccess";

import {
  ALL_IMAGES,
  baseUrl,
  DOWNLOAD_FILE,
  EDIT_ACTIVE_GALLERY,
  RESET_GALLERY,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
import ImageGalleryEdit from "./modal";
import UploadImageGallery from "./uploadModal";
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};
const Gallery = ({
  choosable = false,
  setSelceted,
  multiSelect = false,
  returnArrayGallery = false,
}) => {
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);

  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [viewType, setViewType] = useState("پنجره ای");

  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [reset, setReset] = useState(1);
  const [selected, setSelected] = useState([]);
  const [applySearch, setApplySearch] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const [editingData, setEditingData] = useState({});
  const [applyfilter, setApplyfilter] = useState("");
  const [loading2, setLoading2] = useState(false);
  const [refreshData, setRefresh] = useState(0);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [filter, setFilter] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [sort, setSort] = useState({});
  const [anchorEl, setAnchorEl] = useState({});
  const handlePopoverOpen = (event, index) => {
    setAnchorEl({ [index]: event.currentTarget });
  };
  const handlePopoverClose = () => {
    setAnchorEl({});
  };
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      ALL_IMAGES,
      filter,
      true,
      refreshData,
      sumbitSearch,
      viewType === "پنجره ای" ? 2 : 1
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);

  const observer = useRef();
  const lastInvoiceElement = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((page) => page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, CurrentPage]
  );

  const handleReset = () => {
    setLoading2(true);
    axiosInstance
      .delete(`${baseUrl}/${RESET_GALLERY}`, configReq(token))
      .then((res) => {
        setLoading2(false);
        setPage(1);
        toast.success("با موفقیت حذف شد");
        setReset((r) => r + 1);
        setOpenDelete(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading2(false);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };

  const handleImageSelection = (imageId) => {
    if (returnArrayGallery) {
      const isSelected = selectedImages.some((img) => img === imageId);
      if (isSelected) {
        setSelectedImages(selectedImages.filter((img) => img !== imageId));
      } else {
        setSelectedImages([...selectedImages, imageId]);
      }
    } else {
      if (setSelceted) {
        setSelceted(imageId);
      }
    }
  };

  const submitSelectedImages = () => {
    if (setSelceted && selectedImages.length > 0) {
      setSelceted(selectedImages);
    }
  };

  if (!userPermissions?.gallery?.view) {
    return <NoAccess />;
  }
  return (
    <>
      {!choosable && (
        <PageTitle title={"گالری تصاویر"} hideTitle={!choosable} />
      )}

      <div className="md:mx-3 mx-1">
        <Paper
          sx={{
            border: "1px solid #dbdfea",
            mb: 1,
            px: choosable ? 1 : 2,
            pb: 1,
            pt: "12px",
            width: "100% !important",
          }}
          elevation={0}
        >
          <div className="flex md:gap-4 gap-1 flex-wrap justify-between">
            <div className="flex flex-wrap gap-4 items-center first-line">
              {" "}
              {!choosable && (
                <div className="sm:w-[13rem] w-full">
                  <Dropdown
                    title=" نمایش به صورت"
                    data={["پنجره ای", "ردیفی"]}
                    value={viewType}
                    change={(e) => {
                      setViewType(e);
                      setPage(1);
                      setRefresh((r) => r + 1);
                      setSort({});
                    }}
                  />
                </div>
              )}{" "}
              <Filters
                limit={limit}
                setLimit={setLimit}
                headers={header}
                setFilter={setFilter}
                filter={filter}
                setPage={setPage}
                loading={loading}
              />{" "}
              {choosable && returnArrayGallery && (
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={selectedImages.length === 0}
                    onClick={submitSelectedImages}
                  >
                    انتخاب {selectedImages.length} تصویر
                  </Button>
                </Box>
              )}
            </div>{" "}
            {!choosable && (
              <div className="flex  gap-3 flex-wrap justify-end">
                {userPermissions?.gallery?.cleanup && !choosable && (
                  <Button
                    onClick={() => setOpenDelete(true)}
                    color="error"
                    variant="contained"
                  >
                    حذف تصاویر بدون استفاده
                  </Button>
                )}
                {userPermissions?.gallery?.insert && !choosable && (
                  <Button
                    onClick={() => setOpenCreate(true)}
                    color="primary"
                    variant="contained"
                  >
                    <AddAPhotoIcon sx={{ mr: "4px" }} />
                    افزودن تصویر جدید
                  </Button>
                )}
              </div>
            )}
          </div>
        </Paper>
        <Paper
          sx={{
            border: "1px solid #dbdfea",
            py: 2,
            width: "100% !important",
            mt: 1,
          }}
          elevation={0}
        >
          {viewType === "پنجره ای" ? (
            <>
              <Box className="relative grid md:grid-cols-2 gap-y-2 px-3 pb-5">
                <div className="flex items-center md:justify-start justify-between">
                  <div className="flex items-center gap-2">
                    <Typography
                      sx={{ fontSize: { md: "1rem !important", xs: "0.8rem" } }}
                      variant="h6"
                    >
                      گالری تصاویر
                    </Typography>
                    <Typography
                      sx={{
                        borderLeft: "1px solid #dbdfea",
                        fontSize: "0.83rem !important",
                        color: "#001ee4",
                      }}
                      className="px-2 mx-2"
                      variant="body2"
                    >
                      تعداد نتایج : {metaData?.total} مورد
                    </Typography>
                    <div className="hidden md:flex justify-center mr-4">
                      {" "}
                      <div className="md:w-[350px] md:mb-0 mb-4 w-full ">
                        <Search
                          setSearch={setsearch}
                          search={search}
                          setApplySearch={(e) => {
                            setSumbitSearch(e);
                            setPage(1);
                          }}
                        />
                      </div>
                    </div>
                  </div>{" "}
                  <div className="flex md:hidden  justify-end">
                    <IconButton
                      sx={{
                        background: "#f0f0f0 !important",
                        width: "1.3rem !important",
                        padding: "2px !important",
                        height: "1.3rem !important",
                        fontSize: "1.5rem !important",
                      }}
                      onClick={() => {
                        setsearch("");
                        setSumbitSearch("");
                        setRefresh((r) => r + 1);
                        setPage(1);
                      }}
                    >
                      <RefreshIcon sx={{ color: "#001ee4" }} />
                    </IconButton>
                  </div>
                </div>

                <div className="flex md:hidden justify-center">
                  {" "}
                  <div className="md:w-[350px] md:mb-0 mb-4 w-full ">
                    <Search
                      setSearch={setsearch}
                      search={search}
                      setApplySearch={setSumbitSearch}
                    />
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-end gap-2">
                  <IconButton
                    sx={{
                      background: "#f0f0f0 !important",
                      width: "1.3rem !important",
                      padding: "2px !important",
                      height: "1.3rem !important",
                      fontSize: "1.5rem !important",
                    }}
                    onClick={() => {
                      setsearch("");
                      setSumbitSearch("");
                      setRefresh((r) => r + 1);
                      setPage(1);
                    }}
                  >
                    <RefreshIcon sx={{ color: "#001ee4" }} />
                  </IconButton>
                </div>
              </Box>
              <motion.div
                className={`gap-5 px-3 grid xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 ${
                  choosable
                    ? "h-[calc(100vh-200px)] overflow-y-auto"
                    : "min-h-[100vh]"
                }`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {allRows?.map((item, index) => {
                  const isLast = allRows.length === index + 1;
                  return (
                    <Fragment key={index}>
                      <motion.div
                        variants={itemVariants}
                        className="overflow-hidden rounded-xl  !h-[200px] shadow-sm hover:shadow-lg transition-shadow"
                      >
                        <ImageListItem
                          ref={isLast ? lastInvoiceElement : null}
                          className="w-full  relative !h-[200px] rounded-xl overflow-hidden"
                          key={item.id}
                        >
                          {choosable && returnArrayGallery && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-0 right-0 z-10"
                            >
                              <Checkbox
                                checked={selectedImages.some(
                                  (img) => img === item.id
                                )}
                                onChange={() => handleImageSelection(item.id)}
                                sx={{
                                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                                  borderRadius: "4px",
                                  "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                  },
                                }}
                              />
                            </motion.div>
                          )}

                          <div
                            onClick={() => handleImageSelection(item.id)}
                            style={{
                              cursor: choosable ? "pointer" : "default",
                            }}
                          >
                            <ImageGallery
                              setSelceted={
                                choosable
                                  ? () => handleImageSelection(item.id)
                                  : null
                              }
                              choosable={choosable}
                              item={item}
                              reset={() => setReset((r) => r + 1)}
                            />
                          </div>

                          <ImageListItemBar
                            sx={{ textAlign: "left", px: 1 }}
                            title={
                              <div>
                                <div className="flex justify-between items-center">
                                  <span className="truncate">{item.id}</span>
                                  <div className="flex  items-center justify-end">
                                    <IconButton
                                      size="small"
                                      onClick={(e) =>
                                        handlePopoverOpen(e, index)
                                      }
                                      sx={{ cursor: "pointer" }}
                                    >
                                      <InfoOutlinedIcon
                                        sx={{ color: "#fff" }}
                                      />
                                    </IconButton>{" "}
                                    {userPermissions?.gallery?.update && (
                                      <MoreVertIcon
                                        onClick={() => {
                                          setEditingData(item);
                                          setOpenEdit(true);
                                        }}
                                        sx={{ cursor: "pointer" }}
                                      />
                                    )}
                                  </div>
                                </div>
                                <>
                                  <Popover
                                    open={Boolean(anchorEl[index])}
                                    anchorEl={anchorEl[index]}
                                    onClose={handlePopoverClose}
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "left",
                                    }}
                                    transformOrigin={{
                                      vertical: "top",
                                      horizontal: "left",
                                    }}
                                    PaperProps={{
                                      sx: {
                                        p: 2,
                                        maxWidth: 300,
                                        border: "1px solid",
                                      },
                                    }}
                                  >
                                    <div className="flex flex-col gap-2 text-sm">
                                      <div className="flex gap-1">
                                        <span className="font-semibold">
                                          نام عکس :
                                        </span>
                                        <span className="truncate">
                                          {item.originalFileName}
                                        </span>
                                      </div>
                                      <div className="flex gap-1">
                                        <span className="font-semibold">
                                          alt عکس :
                                        </span>
                                        <span>{item.alt}</span>
                                      </div>
                                      <div className="flex gap-1">
                                        <span className="font-semibold">
                                          نوع ارتباط :
                                        </span>
                                        <span>{item.source}</span>
                                      </div>
                                      {item.fileSize && (
                                        <div className="flex gap-1">
                                          <span className="font-semibold">
                                            حجم :
                                          </span>
                                          <span>
                                            {item.fileSize > 100000
                                              ? `${(
                                                  item.fileSize / 1000000
                                                ).toFixed(2)} mb`
                                              : item.fileSize > 1000
                                              ? `${(
                                                  item.fileSize / 1000
                                                ).toFixed(2)} kb`
                                              : `${item.fileSize} byte`}
                                          </span>
                                        </div>
                                      )}
                                      <div
                                        onClick={() => {
                                          navigator.clipboard
                                            .writeText(
                                              `${baseUrl}/${DOWNLOAD_FILE}/${item.id}`
                                            )
                                            .then(() =>
                                              toast.success("کپی شد!")
                                            )
                                            .catch((err) =>
                                              console.error(
                                                "Failed to copy:",
                                                err
                                              )
                                            );
                                        }}
                                        className="text-blue-600 hover:underline cursor-pointer break-all"
                                      >
                                        {baseUrl}/{DOWNLOAD_FILE}/{item.id}
                                      </div>
                                    </div>
                                  </Popover>
                                </>
                              </div>
                            }
                          />
                        </ImageListItem>
                      </motion.div>
                    </Fragment>
                  );
                })}

                {loading && (
                  <>
                    {Array.from(Array(30).keys()).map((_, i) => (
                      <Skeleton
                        key={i}
                        variant="rounded"
                        animation="wave"
                        height={230}
                        sx={{
                          width: "100%",
                          borderRadius: "1rem",
                          backgroundColor: "rgba(0,0,0,0.05)",
                        }}
                      />
                    ))}
                  </>
                )}
              </motion.div>
            </>
          ) : (
            <>
              <CustomeLayout
                limit={limit}
                setLimit={setLimit}
                setAllRows={setAllRows}
                editApi={
                  userPermissions?.gallery?.update ? EDIT_ACTIVE_GALLERY : false
                }
                title=" گالری تصاویر"
                headers={header}
                setSearch={setsearch}
                search={search}
                page={page}
                total_pages={metaData?.total_pages}
                setApplySearch={(e) => {
                  setPage(1);
                  setSumbitSearch(e);
                  /* setFilter({ ...filter, search: { value: e, type: "lk" } }); */
                }}
                rows={allRows}
                hasMore={hasMore}
                loading={loading}
                setPage={setPage}
                setting={setting}
                CurrentPage={CurrentPage}
                actions={
                  userPermissions?.gallery?.update
                    ? [
                        {
                          title: "ویرایش",
                          handler: (
                            <>
                              <IconButton
                                onClick={() => {
                                  setOpenEdit(true);
                                }}
                              >
                                <Edit sx={{ color: "#ff2000" }} />
                              </IconButton>
                            </>
                          ),
                        },
                      ]
                    : false
                }
                length={metaData?.total}
                maxHeight={{ lg: "69.5vh", md: "68vh", xl: "74vh" }}
                setSort={(e) => {
                  setPage(1);
                  setSort({ ...sort, ...e });
                }}
                currentRow={(data) => {
                  setEditingData(data);
                }}
                setSelected={setSelected}
                selected={selected}
                setRefresh={setRefresh}
              />
            </>
          )}
        </Paper>
        <Modal
          open={openCreate}
          close={() => {
            setOpenCreate(false);
          }}
          title="افزودن تصویر جدید"
          autoWidth={true}
        >
          <UploadImageGallery
            setAllRows={setAllRows}
            allRows={allRows}
            setOpen={(e) => setOpenCreate(e)}
          />
        </Modal>

        <Modal
          open={openDelete}
          close={() => {
            setOpenDelete(false);
          }}
          title="آیا از حذف تمام عکس های بدون استفاده  اطمینان دارید ؟"
          autoWidth={true}
        >
          <div className="flex items-center flex-wrap justify-between gap-2">
            <Button
              onClick={() => setOpenDelete(false)}
              color="error"
              variant="outlined"
            >
              انصراف
            </Button>{" "}
            <Button onClick={handleReset} color="primary" variant="contained">
              بله
            </Button>
          </div>
        </Modal>
      </div>
      <ImageGalleryEdit
        open={openEdit}
        forEdit={openEdit}
        prevData={editingData}
        setAllRows={setAllRows}
        allRows={allRows}
        close={() => {
          setOpenCreate(false);
          setOpenEdit(false);
          setEditingData({});
        }}
      />
    </>
  );
};

export default Gallery;
