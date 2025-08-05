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
import { Delete } from "@mui/icons-material";

import {
  baseUrl,
  DELETE_SMS_ACCESS,
  EDIT_ACTIVE_SMS_ACCESS,
  EXPORT_GET_SMS_ACCESS,
  GET_SMS_ACCESS,
  GET_SMS_CENTER_TYPES,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import EditSmsAccess from "./modal";
import { Confirm } from "../../components/modals";
import { toast } from "react-toastify";
import SyncButton from "../../components/sync";
const SmsAccess = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [selected, setSelected] = useState([]);
  // modals
  const [openCreate, setOpenCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [editingData, setEditingData] = useState({});
  const [page, setPage] = useState(1);
  const [refreshData, setRefresh] = useState(0);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [filter, setFilter] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [sort, setSort] = useState({});
  const [smsType, setSmsType] = useState([]);
  const { token } = useSelector((state) => state.user);

  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_SMS_ACCESS,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  useEffect(() => {
    axiosInstance(`${baseUrl}/${GET_SMS_CENTER_TYPES}`, configReq(token))
      .then((res) => {
        setSmsType(res?.data.data);
      })
      .catch((err) => {});
  }, []);
  const deleteAttr = () => {
    /*   setLoading(true); */
    axiosInstance
      .delete(
        `${baseUrl}/${DELETE_SMS_ACCESS}?id=${editingData.id}`,
        configReq(token)
      )
      .then((res) => {
        var temp = [...allRows];
        var newData = temp.filter((item) => item.id !== editingData.id);
        setAllRows(newData);
        /*  setLoading(false); */
        setConfirmDelete(false);
        toast.success("با موفقیت حذف شد");
        /*   close();
        resetData(); */
      })
      .catch((err) => {
        /*         setLoading(false);
         */ toast.error(err.response?.data?.message);
      });
  };
  if (!userPermissions?.smsLogAccess?.view) {
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
        title=" دسترسی نمایش پیام ادمین"
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
              {userPermissions?.smsLogAccess.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title=" دسترسی نمایش پیام ادمین"
                  api={EXPORT_GET_SMS_ACCESS}
                />
              )}

              {userPermissions?.smsLogAccess?.insert && (
                <Button onClick={() => setOpenCreate(true)} variant="contained">
                  <AddIcon />
                  افزودن دسترسی نمایش پیام ادمین جدید
                </Button>
              )}
            </div>
          </div>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={userPermissions?.smsLogAccess?.update  ? EDIT_ACTIVE_SMS_ACCESS : false}
          title="دسترسی نمایش پیام ادمین"
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
            userPermissions?.smsLogAccess?.delete
              ? [
                  {
                    title: "حذف",
                    handler: (
                      <>
                        <IconButton onClick={() => setConfirmDelete(true)}>
                          <Delete sx={{ color: "red" }} />
                        </IconButton>
                      </>
                    ),
                  },
                ]
              : false
          }
          length={metaData?.total}
          name={"دسترسی نمایش پیام ادمین"}
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
      <Confirm
        message="آیا از حذف این دسترسی نمایش پیام ادمین اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />{" "}
      <EditSmsAccess
        open={openCreate}
        forEdit={false}
        prevData={editingData}
        setAllRows={setAllRows}
        allRows={allRows}
        smsType={smsType}
        close={() => {
          setOpenCreate(false);
          setEditingData({});
        }}
      />
    </>
  );
};

export default SmsAccess;
