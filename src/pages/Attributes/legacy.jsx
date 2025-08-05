/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, IconButton, Paper } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageTitle } from "../../components/common";
import Exports from "../../components/common/export";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Filters from "../../components/filters";
import NoAccess from "../../components/noAccess";
import {
  ATTRIBUTES,
  ATTR_GROUPS,
  baseUrl,
  EDIT_ACTIVE_ATTR,
  EXPORT_ATTRIBUTES,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { setAttrGroups } from "../../redux/slices/relationals";
import { logout } from "../../redux/slices/user";
import EditAttribute from "./modal";
import SyncButton from "../../components/sync";
const Attributes = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [selected, setSelected] = useState([]);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [refreshData, setRefresh] = useState(0);
  const [page, setPage] = useState(1);
  // modals
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [allRows, setAllRows] = useState([]);
  const [filter, setFilter] = useState([]);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [sort, setSort] = useState({});
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      ATTRIBUTES,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);

  useEffect(() => {
    axiosInstance(`${baseUrl}/${ATTR_GROUPS}?Limit=2000`, configReq(token))
      .then((res) => {
        const { data } = res;
        if (data.code === 200) {
          dispatch(setAttrGroups(data.data));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  }, []);

  if (!userPermissions?.attributes?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        title="ویژگی ها"
        broadCrumb={[
          {
            title: "مدیریت محصولات",
            path: "/products",
          },
          {
            title: "ویژگی ها",
            path: "/attributes",
          },
        ]}
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          {" "}
          <Box className="flex md:gap-4 gap-1 flex-wrap justify-between">
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
              {userPermissions?.attributes?.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title="ویژگی"
                  api={EXPORT_ATTRIBUTES}
                />
              )}

              {userPermissions?.attributes?.insert && (
                <Button onClick={() => setOpenCreate(true)} variant="contained">
                  <AddIcon />
                  افزودن ویژگی
                </Button>
              )}
            </div>
          </Box>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={userPermissions?.attributes?.update  ? EDIT_ACTIVE_ATTR : false}
          title="    ویژگی ها"
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
            userPermissions?.attributes?.update
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
          name={" ویژگی "}
          maxHeight={{ lg: "68vh", md: "68vh", xl: "73vh" }}
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
      <EditAttribute
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
    </>
  );
};

export default Attributes;
