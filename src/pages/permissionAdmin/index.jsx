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
  ALL_ADMIN_PERMISSIONS,
  DELETE_ALL_ADMIN_PERMISSIONS,
  EDIT_ACTIVE_ALL_ADMIN_PERMISSIONS,
  EDIT_ADMIN_PERMISSIONS,
  EXPORT_ADMIN_PERMISSIONS,
} from "../../helpers/api-routes";
import PermissionAdminModal from "./modal";

const PermissionsAdmin = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [selected, setSelected] = useState([]);
  const { token } = useSelector((state) => state.user);

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
  const [allShippingClass, setAllShippingClass] = useState([]);

  const [sort, setSort] = useState({});
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      ALL_ADMIN_PERMISSIONS,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);

  if (!userPermissions?.permissionAdmin?.view) {
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
        ]}
        title=" پرمیژن های ادمین"
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
              {userPermissions?.permissionAdmin.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title=" پرمیژن های ادمین"
                  api={EXPORT_ADMIN_PERMISSIONS}
                />
              )}

              {userPermissions?.permissionAdmin?.add && (
                <Button onClick={() => setOpenCreate(true)} variant="contained">
                  <AddIcon />
                  افزودن پرمیژن جدید
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
            userPermissions?.permissionAdmin?.update
              ? EDIT_ADMIN_PERMISSIONS
              : false
          }
          title=" پرمیژن های ادمین"
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
            userPermissions?.permissionAdmin?.update
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
            userPermissions?.permissionAdmin?.deleteAll
              ? DELETE_ALL_ADMIN_PERMISSIONS
              : null
          }
          editActiveAllApi={
            userPermissions?.permissionAdmin?.activeAll
              ? EDIT_ACTIVE_ALL_ADMIN_PERMISSIONS
              : null
          }
        />
      </div>{" "}
      <PermissionAdminModal
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
      />
    </>
  );
};

export default PermissionsAdmin;
