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
  EDIT_ACTIVE_MENU,
  EXPORT_GET_MENU,
  GET_MENU,
} from "../../helpers/api-routes";
import EditMenu from "./modal";

const Menu = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [selected, setSelected] = useState([]);
  // modals
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

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
      GET_MENU,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  const navigate = useNavigate();
  if (!userPermissions?.menu?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "  مدیریت فرانت ",
            path: "/menu",
          },
        ]}
        title="منو های ناوبری          "
      />{" "}
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
              {userPermissions?.menu?.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title="منو"
                  api={EXPORT_GET_MENU}
                />
              )}

              {userPermissions?.menu?.insert && (
                <Button onClick={() => setOpenCreate(true)} variant="contained">
                  <AddIcon />
                  افزودن منو جدید
                </Button>
              )}
            </div>
          </div>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={userPermissions?.menu?.update ? EDIT_ACTIVE_MENU : false}
          title="منو های ناوبری           "
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
            userPermissions?.menu?.update
              ? [
                  {
                    title: "مشاهده",
                    handler: (
                      <>
                        <Button
                            onClick={(rowData) =>
                          {
                            const data = rowData?.id ? rowData : editingData;
                            window.open(
                              `/menu/${data.id}?name=${data.title}&firstParent=${data.title}`
                            )
                          }
                          }
                          variant="outlined"
                        >
                          مشاهده
                        </Button>
                      </>
                    ),
                  },
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
          name={"منو"}
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
      <EditMenu
        open={openEdit || openCreate}
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

export default Menu;
