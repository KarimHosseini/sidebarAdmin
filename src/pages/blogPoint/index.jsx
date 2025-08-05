/* eslint-disable react-hooks/exhaustive-deps */
import { Delete } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PageTitle } from "../../components/common";
import Exports from "../../components/common/export";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Filters from "../../components/filters";
import { Confirm } from "../../components/modals";
import NoAccess from "../../components/noAccess";
import {
  baseUrl,
  DELETE_BLOG_POINT,
  EDIT_BLOG_POINT,
  EXPORT_BLOG_POINT,
  GET_BLOG_POINT,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { Edit } from "@mui/icons-material";
import BlogPointModal from "./modal";
import SyncButton from "../../components/sync";

const BlogsPoint = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [editingData, setEditingData] = useState({});
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState({});
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [allRows, setAllRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [refreshData, setRefresh] = useState(0);
  const { token } = useSelector((state) => state.user);
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_BLOG_POINT,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);

  if (!userPermissions?.blogPoint?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        title=" نظرات کاربران"
        broadCrumb={[
          {
            title: "مدیریت بلاگ",
            path: "/blog",
          },
        ]}
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          <div className="flex md:gap-4 gap-1 flex-wrap justify-between">
            <Filters
              limit={limit}
              setLimit={setLimit}
              headers={header}
              setFilter={setFilter}
              filter={filter}
              setPage={setPage}
              loading={loading}
            />
            <div className="flex justify-end flex-wrap gap-4 items-center">
            <SyncButton setRefresh={setRefresh} setting={setting} />
              {userPermissions?.blogPoint?.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title=""
                  api={EXPORT_BLOG_POINT}
                />
              )}

              {/*          {userPermissions?.blog?.insert && (
                <Button
                  onClick={() => navigate("/blog/create")}
                  variant="contained"
                >
                  <AddIcon />
                  افزودن بلاگ جدید
                </Button>
              )} */}
            </div>
          </div>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={userPermissions?.blogPoint?.update ? EDIT_BLOG_POINT : false}
          title=" نظرات کاربران"
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
          rows={allRows || []}
          hasMore={hasMore}
          loading={loading}
          setPage={setPage}
          setting={setting}
          CurrentPage={CurrentPage}
          actions={
            userPermissions?.blogPoint?.update
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
          name={" "}
          maxHeight={{ lg: "69.5vh", md: "68vh", xl: "74vh" }}
          setSort={(e) => {
            setPage(1);
            setSort({ ...sort, ...e });
          }}
          currentRow={(data) => {
            setEditingData(data);
          }}
          setRefresh={setRefresh}
          setSelected={setSelected}
          selected={selected}
        />
      </div>
      <BlogPointModal
        open={openEdit}
        forEdit={openEdit}
        data={editingData}
        setAllRows={setAllRows}
        allRows={allRows}
        close={() => {
          setOpenEdit(false);
          setEditingData({});
        }}
      />
    </>
  );
};

export default BlogsPoint;
