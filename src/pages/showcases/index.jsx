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
  ALL_SHOWCASES,
  DELETE_ALL_SHOWCASE,
  EDIT_ACTIVE_SHOWCASE,
  EditPriority_SHOWCASES_TYPE,
  EXPORT_ALL_SHOWCASES,
} from "../../helpers/api-routes";
const ShowCases = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  const [refreshData, setRefresh] = useState(0);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);

  const [editingData, setEditingData] = useState(null);

  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [filter, setFilter] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [sort, setSort] = useState({});
  const navigete = useNavigate();
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      ALL_SHOWCASES,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);

  if (!userPermissions?.showcases?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "   تنظیمات",
            path: "/companyInfo",
          },
          {
            title: "  مدیریت فرانت ",
            path: "/menu",
          },
        ]}
        title="ویترین ها"
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
              {userPermissions?.showcases.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title="ویترین"
                  api={EXPORT_ALL_SHOWCASES}
                />
              )}

              {userPermissions?.showcases?.insert && (
                <Button
                  onClick={() => navigete("/showcases/create")}
                  variant="contained"
                >
                  <AddIcon />
                  افزودن ویترین جدید
                </Button>
              )}
            </div>
          </div>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={
            userPermissions?.showcases?.update ? EDIT_ACTIVE_SHOWCASE : false
          }
          title="ویترین ها"
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
          editInputApi={EditPriority_SHOWCASES_TYPE}
          actions={
            userPermissions?.showcases?.update
              ? [
                  {
                    title: "ویرایش",
                    handler: (
                      <>
                        <IconButton
                          onClick={(rowData) => {
                            const data = rowData?.id ? rowData : editingData;
                            if (localStorage.getItem("redirectType") === "2") {
                              navigete(`/showcases/${data.id}`);
                            } else {
                              window.open(
                                  `/showcases/${data.id}`,
                                "_blank"
                              );
                            }
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
          name={"ویترین"}
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
          deleteAllApi={
            userPermissions?.showcases?.deleteAll ? DELETE_ALL_SHOWCASE : null
          }
          setRefresh={setRefresh}
        />
      </div>
    </>
  );
};

export default ShowCases;
