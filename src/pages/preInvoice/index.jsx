/* eslint-disable react-hooks/exhaustive-deps */
import AddIcon from "@mui/icons-material/Add";
import { Button, Paper } from "@mui/material";
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
import { EXPORT_PREINVOICE, GET_PREINVOICE } from "../../helpers/api-routes";
const PreFactor = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // modals
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [refreshData, setRefresh] = useState(0);
  const [editingData, setEditingData] = useState({});
  const [page, setPage] = useState(1);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [filter, setFilter] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [sort, setSort] = useState({});
  const navigate = useNavigate();
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_PREINVOICE,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);

  if (!userPermissions?.PreFactor?.GetAllPreFactor) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle title=" سفارشات نماینده ها " />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          {" "}
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
              {userPermissions?.PreFactor?.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title="سفارشات نماینده"
                  api={EXPORT_PREINVOICE}
                />
              )}

              {userPermissions?.PreFactor?.AddPreFactorWithOutDependency && (
                <Button
                  onClick={() => navigate("/preFactor/create")}
                  variant="contained"
                >
                  <AddIcon />
                  افزودن سفارش جدید
                </Button>
              )}
            </div>
          </div>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={false}
          title="سفارشات نماینده ها"
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
          /*     actions={[
            {
              title: "جزییات",
              handler: (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => window.open(`/preFactor/${editingData.id}`)}
                  >
                    مشاهده
                  </Button>
                </>
              ),
            },
          ]} */
          length={metaData?.total}
          name={"سفارشات نماینده"}
          maxHeight={{ lg: "69.5vh", md: "68vh", xl: "74vh" }}
          setSelected={setSelected}
          selected={selected}
          setSort={(e) => {
            setPage(1);
            setSort({ ...sort, ...e });
          }}
          currentRow={(data) => {
            setEditingData(data);
          }}
          setRefresh={setRefresh}
        />
      </div>
    </>
  );
};

export default PreFactor;
