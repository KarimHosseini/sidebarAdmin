/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  GET_BLOG_Tag,
  baseUrl,
  EDIT_BLOG_Tag,
  EDIT_BLOG_RELATED_TAG,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import CustomeLayout from "../customeTable";
import DataFetcher from "../dataFetch";
import axiosInstance from "../dataFetch/axiosInstance";
import Filters from "../filters";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddIcon from "@mui/icons-material/Add";
import BlogTagModal from "../../pages/blogTag/modal";

const CrosBlogTag = ({ createdId, data }) => {
  const navigate = useNavigate();

  const [loading2, setLoading2] = useState(false);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [openCreate, setOpenCreate] = useState(false);
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
      GET_BLOG_Tag,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  const [allRows, setAllRows] = useState([]);
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  useEffect(() => {
    if (data) {
      var temp = [];
      data.map((item) => {
        temp.push({ title: item?.tag, id: item.tagId });
      });
      setSelectedProducts(temp);
    }
  }, [data]);

  const submitLoop = () => {
    if (selectedProducts.length > 0) {
      setLoading2(true);
      var items = "";
      selectedProducts.map((item) => {
        items += item.id + ",";
      });

      const formData = new FormData();
      formData.append("blogId", createdId);
      formData.append("tags", items.substring(0, items.length - 1));
      axiosInstance
        .put(`${baseUrl}/${EDIT_BLOG_RELATED_TAG}`, formData, configReq(token))
        .then((res) => {
          setLoading2(false);
          toast.success("با موفقیت اضافه شد");
          navigate("/blog");
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading2(false);

        
        });
    } else {
      navigate("/blog");
    }
  };
  return (
    <>
      <div className="flex items-center justify-between md:px-0 px-3">
        <Typography variant="body1">انتخاب تگ</Typography>{" "}
        <div className="flex items-center justify-end gap-3 flex-wrap">
          {userPermissions?.blogCategory?.insert && (
            <Button onClick={() => setOpenCreate(true)} variant="contained">
              <AddIcon />
              افزودن تگ بلاگ جدید
            </Button>
          )}
          <Link to={`/blog/${createdId}`}>
            <Button variant="outlined">بازگشت</Button>
          </Link>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              disabled={loading || loading2}
              variant="contained"
              onClick={submitLoop}
              color="secondary"
            >
              {loading2 ? (
                <>
                  <CircularProgress />
                </>
              ) : (
                <> ثبت و برگشت به بلاگ</>
              )}
            </Button>
          </Box>
        </div>
      </div>
      {selectedProducts.length > 0 && (
        <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 mb-4 mt-6 gap-4">
          {selectedProducts.map((product, i) => (
            <Fragment key={i + "producCard"}>
              <Card
                sx={{
                  display: "flex",
                  border: "1px solid green",

                  height: 45,
                  position: "relative",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography
                      sx={{ fontSize: "1.2rem" }}
                      component="div"
                      variant="h2"
                    >
                      {product?.title}
                    </Typography>
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
          <div className="flex md:gap-4 gap-1 flex-wrap justify-between mt-5">
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
            editApi={EDIT_BLOG_Tag}
            title="  تگ ها"
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
        <BlogTagModal
          open={openCreate}
          forEdit={false}
          data={editingData}
          setAllRows={setAllRows}
          allRows={allRows}
          setNewRow={(e) => {
            var temp = [...selectedProducts];
            if (e) temp.push(e);
            setSelectedProducts(temp);
          }}
          close={() => {
            setOpenCreate(false);
            setEditingData({});
          }}
        />
      </>
    </>
  );
};

export default CrosBlogTag;
