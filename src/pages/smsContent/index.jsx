/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PageTitle } from "../../components/common";
import Exports from "../../components/common/export";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Filters from "../../components/filters";
import NoAccess from "../../components/noAccess";
import SyncButton from "../../components/sync";
import {
  ALL_TELEGRAM_GROUP,
  baseUrl,
  EDIT_ACTIVE_SMS,
  EXPORT_GET_SMS,
  GET_SMS,
  GET_SMS_CENTER_TYPES,
  GET_SMS_PROVIDERS,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import SmsContentModal from "./modal";
const SmsContent = () => {
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
  const [allRows, setAllRows] = useState([]);
  const [allTelegrams, setAllTelegrams] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selected, setSelected] = useState([]);
  const [refreshData, setRefresh] = useState(0);
  const [smsType, setSmsType] = useState([]);
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    axiosInstance(`${baseUrl}/${GET_SMS_CENTER_TYPES}`, configReq(token))
      .then((res) => {
        setSmsType(res?.data.data);
      })
      .catch((err) => {});
    axiosInstance(`${baseUrl}/${ALL_TELEGRAM_GROUP}`, configReq(token))
      .then((res) => {
        setAllTelegrams(res?.data.data);
      })
      .catch((err) => {});
    axiosInstance(`${baseUrl}/${GET_SMS_PROVIDERS}`, configReq(token))
      .then((res) => {
        setProviders(res?.data.data);
      })
      .catch((err) => {});
  }, []);
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_SMS,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  if (!userPermissions?.sms?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "      پیام ها",
            path: "/sms",
          },
        ]}
        title="   مدیریت متون پیام ها"
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
            />{" "}
            <div className="flex justify-end flex-wrap gap-4 items-center">
              <SyncButton setRefresh={setRefresh} setting={setting} />
              {userPermissions?.sms.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title="پیام "
                  api={EXPORT_GET_SMS}
                />
              )}

              {userPermissions?.sms?.insert && (
                <Button onClick={() => setOpenCreate(true)} variant="contained">
                  <AddIcon />
                  افزودن پیام جدید
                </Button>
              )}
            </div>
          </div>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={userPermissions?.sms?.update ? EDIT_ACTIVE_SMS : false}
          title=" مدیریت متون پیام ها "
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
            userPermissions?.sms?.update
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
          name={"پیام"}
          maxHeight={{ lg: "69.5vh", md: "68vh", xl: "74vh" }}
          setSort={(e) => {
            setPage(1);
            setSort({ ...sort, ...e });
          }}
          setSelected={setSelected}
          selected={selected}
          currentRow={(data) => {
            setEditingData(data);
          }}
          setRefresh={setRefresh}
        />
      </div>
      <SmsContentModal
        open={openEdit || openCreate}
        forEdit={openEdit}
        prevData={editingData}
        setAllRows={setAllRows}
        allRows={allRows}
        providers={providers}
        allTelegrams={allTelegrams}
        smsType={smsType}
        close={() => {
          setOpenCreate(false);
          setOpenEdit(false);
          setEditingData({});
        }}
      />
    </>
  );
};

export default SmsContent;
