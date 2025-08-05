import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageTitle } from "../../components/common";
import Exports from "../../components/common/export";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import Filters from "../../components/filters";
import NoAccess from "../../components/noAccess";
import SyncButton from "../../components/sync";
import {
  ALL_WHITE_LIST_HISTORY,
  DELETE_ALL_WHITE_LIST_HISTORY,
  EDIT_ACTIVE_ALL_WHITE_LIST_HISTORY,
  EDIT_ACTIVE_WHITE_LIST_HISTORY,
  EXPORT_WHITE_LIST_HISTORY,
} from "../../helpers/api-routes";
import WhiteListHistoryModal from "./modal";

const WhiteListHistory = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [selected, setSelected] = useState([]);
  const { token } = useSelector((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const guarantorId = searchParams.get("guarantorId");
  const guarantorName = searchParams.get("guarantorName");
  const whiteListUserName = searchParams.get("whiteListUserName");
  const whiteListId = searchParams.get("whiteListId");

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const navigate = useNavigate();
  const [editingData, setEditingData] = useState({});
  const [page, setPage] = useState(1);
  const [refreshData, setRefresh] = useState(0);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [filter, setFilter] = useState([]);
  const [allRows, setAllRows] = useState([]);

  const [sort, setSort] = useState({});
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      ALL_WHITE_LIST_HISTORY,
      filter,
      true,
      refreshData,
      sumbitSearch,
      1,
      {
        name: "whiteListUserId",
        value: whiteListId,
      }
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);

  if (!userPermissions?.whiteListHistory?.view) {
    return <NoAccess />;
  }

  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "  تسهیلات",
            path: "/facilitySetting",
          },
          {
            title: "تضمین کننده ها",
            path: "/guarantor",
          },
          {
            title: `لیست کاربران سفید ${
              guarantorName ? `برای ${guarantorName}` : ""
            }`,
            path: `/whiteListUser?guarantorId=${guarantorId}&guarantorName=${guarantorName}`,
          },
        ]}
        title={`تاریخچه فعالیت ${
          whiteListUserName ? `برای ${whiteListUserName}` : ""
        }`}
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
              {userPermissions?.whiteListHistory.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title={`تاریخچه فعالیت ${
                    whiteListUserName ? `برای ${whiteListUserName}` : ""
                  }`}
                  api={EXPORT_WHITE_LIST_HISTORY}
                />
              )}

              {userPermissions?.whiteListHistory?.insert && (
                <Button onClick={() => setOpenCreate(true)} variant="contained">
                  <AddIcon />
                  افزودن تاریخچه جدید
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
            userPermissions?.whiteListHistory?.update
              ? EDIT_ACTIVE_WHITE_LIST_HISTORY
              : false
          }
          title={`تاریخچه فعالیت ${
            whiteListUserName ? `برای ${whiteListUserName}` : ""
          }`}
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
            userPermissions?.whiteListHistory?.update
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
          name={"شرکت"}
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
          deleteAllApi={
            userPermissions?.whiteListHistory?.deleteAll
              ? DELETE_ALL_WHITE_LIST_HISTORY
              : null
          }
          editActiveAllApi={
            userPermissions?.whiteListHistory?.activeAll
              ? EDIT_ACTIVE_ALL_WHITE_LIST_HISTORY
              : null
          }
        />{" "}
        <WhiteListHistoryModal
          open={openEdit || openCreate}
          forEdit={openEdit}
          setAllRows={setAllRows}
          allRows={allRows}
          data={editingData}
          close={() => {
            setOpenCreate(false);
            setOpenEdit(false);
            setEditingData({});
          }}
          whiteListUserId={whiteListId}
        />
      </div>{" "}
    </>
  );
};

export default WhiteListHistory;
