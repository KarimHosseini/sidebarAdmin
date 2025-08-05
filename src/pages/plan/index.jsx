/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, IconButton, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../components/common";
import Exports from "../../components/common/export";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import Filters from "../../components/filters";
import NoAccess from "../../components/noAccess";
import {
  EDIT_ACTIVE_PLAN,
  EXPORT_PLAN,
  GET_PLAN,
} from "../../helpers/api-routes";
import SyncButton from "../../components/sync";

const Plans = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [sort, setSort] = useState({});
  const [editingData, setEditingData] = useState({});
  const [page, setPage] = useState(1);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const navigate = useNavigate();
  const [filter, setFilter] = useState([]);
  const [refreshData, setRefresh] = useState(0);
  const [selected, setSelected] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_PLAN,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  if (!userPermissions?.plan?.view) {
    return <NoAccess />;
  }

  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "    باشگاه مشتریان",
            path: "/discounts",
          },
        ]}
        title=" طرح فروش و تخفیفات"
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          <Box className="flex md:gap-4 gap-1 flex-wrap justify-between">
            <Filters
              limit={limit}
              setLimit={setLimit}
              headers={header}
              setFilter={setFilter}
              filter={filter}
              setPage={setPage}
              loading={loading}
            />{" "}
            <div className="flex justify-end flex-wrap gap-4 items-center">
              <SyncButton setRefresh={setRefresh} setting={setting} />
              {userPermissions?.plan?.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title="طرح فروش و تخفیفات"
                  api={EXPORT_PLAN}
                />
              )}

              {userPermissions?.plan?.insert && (
                <Button
                  onClick={() => navigate("/plan/create")}
                  variant="contained"
                >
                  <AddIcon />
                  افزودن طرح فروش و تخفیفات جدید
                </Button>
              )}
            </div>
          </Box>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={userPermissions?.plan?.update ? EDIT_ACTIVE_PLAN : false}
          title="طرح فروش و تخفیفات ها"
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
            userPermissions?.plan?.update
              ? [
                  {
                    title: "ویرایش",
                    handler: (
                      <>
                        <IconButton
                          onClick={(rowData) => {
                            const data = rowData?.id ? rowData : editingData;
                            if (localStorage.getItem("redirectType") === "2") {
                              navigate(`/plan/${data.id}`)
                            } else {
                              window.open(`/plan/${data.id}`, "_blank");
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
          name={"طرح فروش و تخفیفات"}
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
      </div>
    </>
  );
};

export default Plans;
