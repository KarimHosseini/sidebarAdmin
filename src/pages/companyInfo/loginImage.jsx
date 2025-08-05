/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, IconButton, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Exports from "../../components/common/export";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import Filters from "../../components/filters";
import SyncButton from "../../components/sync";
import {
  EDIT_ACTIVE_LOGIN_IMAGES,
  EXPORT_LOGIN_IMAGES,
  GET_LOGIN_IMAGES,
} from "../../helpers/api-routes";
import LoginImageModal from "./loginImageModal";

const LoginImage = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [sort, setSort] = useState({});
  const [editingData, setEditingData] = useState({});
  const [page, setPage] = useState(1);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);

  const [filter, setFilter] = useState([]);
  const [refreshData, setRefresh] = useState(0);
  const [selected, setSelected] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_LOGIN_IMAGES,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);

  return (
    <>
      <>
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
              {userPermissions?.brand?.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title="عکس لاگین "
                  api={EXPORT_LOGIN_IMAGES}
                />
              )}

              <Button onClick={() => setOpenCreate(true)} variant="contained">
                <AddIcon />
                افزودن عکس لاگین جدید
              </Button>
            </div>
          </Box>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={EDIT_ACTIVE_LOGIN_IMAGES}
          title="عکس لاگین  "
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
          actions={[
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
          ]}
          length={metaData?.total}
          name={"عکس لاگین "}
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
      {userPermissions?.companyInfo?.update && (
        <LoginImageModal
          open={openEdit || openCreate}
          forEdit={openEdit}
          data={editingData}
          setAllRows={setAllRows}
          allRows={allRows}
          close={() => {
            setOpenCreate(false);
            setOpenEdit(false);
            setEditingData({});
          }}
        />
      )}
    </>
  );
};

export default LoginImage;
