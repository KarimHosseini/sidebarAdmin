/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../components/common";
import Exports from "../../components/common/export";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import Filters from "../../components/filters";
import NoAccess from "../../components/noAccess";
import SyncButton from "../../components/sync";
import {
  EDIT_ACTIVE_BLOG,
  EXPORT_BLOG,
  GET_BLOG,
} from "../../helpers/api-routes";

const Blogs = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

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
  const navigate = useNavigate();
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
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);

  if (!userPermissions?.blog?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        title=" بلاگ"
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
              {userPermissions?.blog?.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title=""
                  api={EXPORT_BLOG}
                />
              )}

              {userPermissions?.blog?.insert && (
                <Button
                  onClick={() => navigate("/blog/create")}
                  variant="contained"
                > 
                  <AddIcon />
                  افزودن بلاگ جدید
                </Button>
              )}
            </div>
          </div>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={userPermissions?.blog?.update ? EDIT_ACTIVE_BLOG : false}
          title=" بلاگ"
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
            userPermissions?.blog?.update || userPermissions?.seoAssign?.view
              ? [
                  userPermissions?.blog?.update && {
                    title: "ویرایش",
                    handler: (
                      <>
                        <IconButton
                          onClick={() => navigate(`/blog/${editingData.id}`)}
                        >
                          <Edit sx={{ color: "#ff2000" }} />
                        </IconButton>
                      </>
                    ),
                  },
                  userPermissions?.seoAssign?.view && {
                    title: "seo",
                    handler: (
                      <Button
                        onClick={(rowData) =>
                        {
                          const data = rowData?.id ? rowData : editingData;
                          window.open(
                            `/seoGenrator?id=${
                              data?.id
                            }&name=blog&slug=${data?.url.slice(1)}`
                          )
                        }
                        }
                        variant="outlined"
                      >
                        ویرایش seo
                      </Button>
                    ),
                  },
                ].filter((item) => item)
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
    </>
  );
};

export default Blogs;
