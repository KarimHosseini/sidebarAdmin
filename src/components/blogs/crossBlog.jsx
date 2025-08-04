/* eslint-disable react-hooks/exhaustive-deps */
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  baseUrl,
  DOWNLOAD_FILE,
  EDIT_ACTIVE_BLOG,
  EDIT_BLOG,
  GET_BLOG,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import CustomeLayout from "../customeTable";
import DataFetcher from "../dataFetch";
import axiosInstance from "../dataFetch/axiosInstance";
import Filters from "../filters";

const CrosBlog = ({ createdId, data, nextStep }) => {
  const navigate = useNavigate();

  const [loading2, setLoading2] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [page, setPage] = useState(1);

  const [refreshData, setRefresh] = useState(0);
  const [filter, setFilter] = useState([]);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [sort, setSort] = useState({});
  const { token } = useSelector((state) => state.user);
  const [editingData, setEditingData] = useState({});
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_BLOG,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  const [allRows, setAllRows] = useState([]);
  useEffect(() => {
    if (data?.crossed) {
      setSelectedProducts(data?.crossed);
    }
  }, [data]);
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  const submitLoop = () => {
    if (selectedProducts.length > 0) {
      setLoading2(true);
      var items = "";
      selectedProducts.map((item) => {
        items += item.id + ",";
      });
      const formData = new FormData();
      formData.append("id", createdId);

      formData.append("title", data?.title);
      formData.append("url", data?.url);
      formData.append("blogCategoryId", data?.blogCategoryId);
      formData.append("active", data?.active);
      formData.append("selected", data?.selected);
 
      formData.append("blogContent", data?.blogContent);
      formData.append("crossBlog", items.substring(0, items.length - 1));
      formData.append("summery", data?.summery);
      if (data?.galleryId) formData.append("fromGallery", data?.galleryId);
      if (data?.userId) formData.append("userId", data?.userId);
      axiosInstance
        .put(`${baseUrl}/${EDIT_BLOG}`, formData, configReq(token))
        .then((res) => {
          setLoading2(false);
          toast.success("با موفقیت اضافه شد");
          nextStep();
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading2(false);
        });
    } else {
      nextStep();
    }
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <Typography variant="body1">انتخاب بلاگ های مرتبط </Typography>{" "}
        <div className="flex items-center justify-end gap-3">
          <Link to={`/blog/${createdId}`}>
            <Button variant="outlined">بازگشت</Button>
          </Link>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              disabled={loading || loading2}
              variant="contained"
              onClick={submitLoop}
            >
              {loading2 ? (
                <>
                  <CircularProgress />
                </>
              ) : (
                <> ثبت اطلاعات</>
              )}
            </Button>
          </Box>
        </div>
      </div>
      {selectedProducts.length > 0 && (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 mb-4 grid-cols-1 gap-4">
          {selectedProducts.map((product, i) => (
            <Fragment key={i + "producCard"}>
              <Card
                sx={{
               
                  border: "1px solid green",
                  maxWidth: "400px",
                  height: 85,
                  position: "relative",
                }}
                className="grid grid-cols-4"
              >
                <a
                  href={`${process.env.REACT_APP_DOMAIN_URL}/blog${product.url}`}
                  target={"_blank"}
                  rel="noreferrer"
                  className="h-full w-full"
                >
                  {product?.galleryId || product?.image ? (
                    <CardMedia
                      component="img"
                      sx={{ width: "100%" , height:"100%"}}
                      src={`${baseUrl}/${DOWNLOAD_FILE}/${
                        product?.galleryId || product?.image
                      }?size=tiny`}
                      alt=""
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      sx={{ width: 80 }}
                      src={"/images/no_image.svg"}
                      alt=""
                      className=" opacity-40"
                    />
                  )}
                </a>

                <Box className="col-span-3" sx={{ display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography
                      sx={{ fontSize: "1rem" }}
                      component="div"
                      variant="body2"
                    >
                      {product?.crossProduct || product?.title}
                    </Typography>
                    {/*   <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      component="div"
                      sx={{ fontSize: { md: "1rem" } }}
                    >
                      {product?.url || product?.code}
                    </Typography> */}
                  </CardContent>
                </Box>
                <div className="absolute top-0 left-0">
                  <IconButton
                    onClick={() => {
                      var temp = [...selectedProducts];
                      var newS = temp.filter((p) => p.id !== product.id);
                      setSelectedProducts(newS);
                    }}
                  >
                    <HighlightOffIcon color="error" />
                  </IconButton>
                </div>
              </Card>
            </Fragment>
          ))}
        </div>
      )}

      <>
        <>
          <div className="flex md:gap-4 gap-1 flex-wrap mb-4 justify-between">
            <Filters
              limit={limit}
              setLimit={setLimit}
              headers={header}
              setFilter={setFilter}
              filter={filter}
              setPage={setPage}
              loading={loading}
            />{" "}
          </div>{" "}
          <CustomeLayout
            limit={limit}
            setLimit={setLimit}
            setAllRows={setAllRows}
            editApi={EDIT_ACTIVE_BLOG}
            title="  بلاگ"
            headers={header}
            setSearch={setsearch}
            search={search}
            page={page}
            total_pages={metaData?.total_pages}
            setApplySearch={(e) => {
              setPage(1);
              setSumbitSearch(e);
            }}
            rows={allRows || []}
            hasMore={hasMore}
            loading={loading}
            setPage={setPage}
            setting={setting}
            CurrentPage={CurrentPage}
            actions={false}
            length={metaData?.total}
            name={"  محصول"}
            maxHeight={{ lg: "69.5vh", md: "68vh", xl: "74vh" }}
            setSort={(e) => {
              setSort({ ...e });

              setPage(1);
            }}
            setSelected={setSelectedProducts}
            selected={selectedProducts}
            currentRow={(data) => {
              setEditingData(data);
            }}
            setRefresh={setRefresh}
          />
        </>
      </>
    </>
  );
};

export default CrosBlog;
