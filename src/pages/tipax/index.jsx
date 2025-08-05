import AddIcon from "@mui/icons-material/Add";
import { Button, CircularProgress, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, PageTitle } from "../../components/common";
import Exports from "../../components/common/export";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Filters from "../../components/filters";
import NoAccess from "../../components/noAccess";
import SyncButton from "../../components/sync";
import {
  ALL_TIPAX,
  baseUrl,
  EDIT_ACTIVE_ALL_TIPAX,
  EDIT_ACTIVE_TIPAX,
  EXPORT_TIPAX,
  TRACKING_TIPAX,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import EditTipaxModel from "./modal";

const Tipax = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [selected, setSelected] = useState([]);
  // modals
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [trackResualt, setTrackResualt] = useState([]);

  const { token } = useSelector((state) => state.user);
  const [loadingButton, setLoadingButton] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [page, setPage] = useState(1);
  const [refreshData, setRefresh] = useState(0);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [filter, setFilter] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [sort, setSort] = useState({});
  const {
    hasMore,
    loading,
    allData,
    CurrentPage,
    metaData,
    header,
    setting,
    extraObject,
  } = DataFetcher(
    limit,
    page,
    sort,
    ALL_TIPAX,
    filter,
    true,
    refreshData,
    sumbitSearch
  );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  const handleCheck = (id) => {
    setLoadingButton(true);
    axiosInstance(
      `${baseUrl}/${TRACKING_TIPAX}?orderId=${id}`,
      configReq(token)
    )
      .then((res) => {
        setLoadingButton(false);
        setTrackResualt(res.data);
      })
      .catch((err) => {
        setLoadingButton(false);
      });
  };
  if (!userPermissions?.tipax?.view) {
    return <NoAccess />;
  }

  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: " گزارشات",
            path: "/reports",
          },
        ]}
        title=" مشاهده سفارشات به تیپاکس"
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
              {extraObject && (
                <div className="flex gap-4 items-center">
                  <span> آخرین بروزرسانی :‌</span>
                  <span className="font-bold">
                    {" "}
                    {String(new Date(extraObject).getMinutes()).padStart(
                      2,
                      "0"
                    )}
                    :{" "}
                    {String(new Date(extraObject).getHours()).padStart(2, "0")}{" "}
                  </span>
                  <span className="font-bold">
                    {new Date(extraObject)?.toLocaleDateString("fa-ir")}
                  </span>
                </div>
              )}
              {userPermissions?.tipax.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title=" مشاهده سفارشات به تیپاکس"
                  api={EXPORT_TIPAX}
                />
              )}

              {userPermissions?.tipax?.insert && (
                <Button onClick={() => setOpenCreate(true)} variant="contained">
                  <AddIcon />
                  افزودن مشاهده سفارشات به تیپاکس جدید
                </Button>
              )}
            </div>
          </div>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={userPermissions?.tipax?.update ? EDIT_ACTIVE_TIPAX : false}
          title=" مشاهده سفارشات به تیپاکس"
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
            userPermissions?.tipax?.track
              ? [
                  {
                    title: "استعلام",
                    handler: (
                      <>
                        <Button
                          variant="contained"
                          disabled={loadingButton}
                          onClick={() => {
                            handleCheck(editingData.tipaxWayBill);
                            setOpen(true);
                          }}
                        >
                          استعلام
                        </Button>
                      </>
                    ),
                  },
                ]
              : false
          }
          length={metaData?.total}
          name={"تیپاکس"}
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
            userPermissions?.tipax?.deleteAll ? EDIT_ACTIVE_ALL_TIPAX : null
          }
          editActiveAllApi={
            userPermissions?.tipax?.activeAll ? EDIT_ACTIVE_TIPAX : null
          }
        />
      </div>
      <EditTipaxModel
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
      <Modal
        open={open}
        close={() => {
          setOpen(false);
          setTrackResualt([]);
        }}
        title={"استعلام تیپاکس"}
      >
        <div>
          {loadingButton ? (
            <CircularProgress />
          ) : (
            <div className="flex my-4 flex-col gap-2">
              {trackResualt?.map((item) => (
                <span>
                  {" "}
                  - {item.status} / {item.trackingCode}
                </span>
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setOpen(false);
                setTrackResualt([]);
              }}
              variant="contained"
              color="info"
            >
              متوجه شدم
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Tipax;
