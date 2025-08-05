/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, PageTitle } from "../../components/common";
import Exports from "../../components/common/export";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Filters from "../../components/filters";
import { Confirm } from "../../components/modals";
import NoAccess from "../../components/noAccess";
import SyncButton from "../../components/sync";
import {
  baseUrl,
  DELETE_EXPIREDT_LOANS,
  EDIT_ACTIVE_REFAHLOAN,
  EXPORT_REFAHLOAN,
  GET_REFAHLOAN,
  UPDATE_ALL_REFAH,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import ReportAdminTurnover from "./mali";
import ShowLogs from "./showLogs";

const BetaLoan = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [loadingUpdate, setloadingUpdate] = useState(false);
  const [openMali, setOpenMali] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteConfirmAll, setDeleteConfirmAll] = useState(false);
  const [openLog, setOpenLog] = useState(false);
  const [openLog2, setOpenLog2] = useState(false);

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
  const { token, userId } = useSelector((state) => state.user);

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
    GET_REFAHLOAN,
    filter,
    true,
    refreshData,
    sumbitSearch
  );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  const deleteItemAllClick = () => {
    setLoadingDelete(true);
    axiosInstance
      .get(`${baseUrl}/${DELETE_EXPIREDT_LOANS}`, configReq(token))
      .then((res) => {
        setDeleteConfirmAll(false);
        setRefresh((r) => r + 1);
        setAllRows([]);
        toast.success("با موفقیت انجام شد");
        setLoadingDelete(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoadingDelete(false);
      });
  };
  const handleUpdate = () => {
    setloadingUpdate(true);
    axiosInstance
      .get(`${baseUrl}/${UPDATE_ALL_REFAH}`, configReq(token))
      .then((res) => {
        setRefresh((r) => r + 1);
        setloadingUpdate(false);

        toast.success(res.data.message);
      })
      .catch((err) => {
        setloadingUpdate(false);

        toast.error(err.response?.data?.message);
      });
  };
  if (!userPermissions?.RefahLoans?.view) {
    return <NoAccess />;
  }

  return (
    <>
      <PageTitle
        title="تسهیلات دارای تضمین کننده           "
        broadCrumb={[
          {
            title: "  تسهیلات",
            path: "/facilites",
          },
        ]}
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          <Box className="flex md:gap-4 gap-4 flex-wrap justify-between">
            <Filters
              limit={limit}
              setLimit={setLimit}
              headers={header}
              setFilter={setFilter}
              filter={filter}
              setPage={setPage}
              loading={loading}
            />
            <div className="flex md:justify-end justify-center flex-wrap gap-4 items-end">
              <SyncButton setRefresh={setRefresh} setting={setting} />
              {userPermissions?.RefahLoans?.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title="تسهیلات دارای تضمین کننده           "
                  api={EXPORT_REFAHLOAN}
                />
              )}
              {userPermissions?.RefahLoans?.deleteExpired && (
                <Button
                  onClick={() => setDeleteConfirmAll(true)}
                  variant="contained"
                  color="error"
                >
                  حذف تسهیلات منقضی شده
                </Button>
              )}
              {/*            {userPermissions?.RefahLoans?.insert && (
                <>
                  <Button
                    onClick={() => navigate("/betaloan/create")}
                    variant="contained"
                  >
                    <AddIcon />
                    افزودن تسهیلات جدید 
                  </Button>
                </>
              )} */}
              {userPermissions?.ReportFacilityUserTurnover?.view && (
                <>
                  <Button
                    onClick={() => setOpenMali(true)}
                    variant="contained"
                    color="secondary"
                  >
                    گزارش مالی
                  </Button>
                </>
              )}
              <Button
                disabled={loadingUpdate}
                onClick={handleUpdate}
                variant="outlined"
                color="inherit"
              >
                {loadingUpdate ? <CircularProgress /> : <> بروزرسانی همه</>}
              </Button>
              {userPermissions?.RefahLoans?.shareBlueBank && (
                <Button
                  disabled={loadingUpdate}
                  onClick={() => window.open("/shareBlueBank")}
                  variant="contained"
                  color="info"
                >
                  تسهیم تجمیعی
                </Button>
              )}
              {userPermissions?.RefahLoans?.chargeBlueBank && (
                <Button
                  disabled={loadingUpdate}
                  onClick={() => window.open("/chargeBlueBank")}
                  variant="outlined"
                  color="secondary"
                >
                  شارژ تجمیعی
                </Button>
              )}
              {userPermissions?.RefahLoans?.chargeBlueBankLogs && (
                <Button
                  disabled={loadingUpdate}
                  onClick={() => setOpenLog(true)}
                  variant="contained"
                  color="primary"
                >
                  لاگ شارژ تجمیعی
                </Button>
              )}
              {userPermissions?.RefahLoans?.shareBlueBankLogs && (
                <Button
                  disabled={loadingUpdate}
                  onClick={() => setOpenLog2(true)}
                  variant="outlined"
                  color="secondary"
                >
                  لاگ تسهیم تجمیعی
                </Button>
              )}
            </div>{" "}
            <div className="flex gap-7 flex-wrap items-center justify-between w-full">
              {" "}
              {extraObject?.updatedAt && (
                <span className=" flex gap-2 items-center ">
                  {" "}
                  <span> اخرین بروزرسانی </span>
                  <span className="font-bold">
                    {" "}
                    {` ${String(
                      new Date(extraObject.updatedAt).getMinutes()
                    ).padStart(2, "0")}: ${String(
                      new Date(extraObject.updatedAt).getHours()
                    ).padStart(2, "0")}`}{" "}
                    -{" "}
                    {new Date(extraObject.updatedAt).toLocaleDateString(
                      "fa-IR"
                    )}{" "}
                  </span>
                </span>
              )}
              <fieldset className="flex gap-3 items-center border rounded-md px-3 py-2 flex-wrap">
                <legend className="text-center mx-2 px-2 text-sm font-bold">
                  گزارش نماینده
                </legend>
                {(extraObject?.allSums || extraObject?.allSums === 0) && (
                  <span className=" flex gap-2 items-center mb-3">
                    {" "}
                    <span>جمع کل اعتبار</span>
                    <span className="font-bold">
                      {Number(extraObject.allSums).toLocaleString()}
                    </span>
                  </span>
                )}{" "}
                {(extraObject?.monthlySum || extraObject?.monthlySum === 0) && (
                  <span className=" flex gap-2 border-r px-3 border-l items-center mb-3">
                    {" "}
                    <span> جمع اعتبار ماه جاری</span>
                    <span className="font-bold">
                      {Number(extraObject.monthlySum).toLocaleString()}
                    </span>
                  </span>
                )}{" "}
                {(extraObject?.dailySum || extraObject?.dailySum === 0) && (
                  <span className=" flex gap-2 items-center mb-3">
                    {" "}
                    <span> جمع اعتبار روزانه</span>
                    <span className="font-bold">
                      {Number(extraObject.dailySum).toLocaleString()}
                    </span>
                  </span>
                )}{" "}
              </fieldset>
              {(extraObject?.filteredSumLoans ||
                extraObject?.filteredSumLoans === 0) && (
                <fieldset className="flex gap-3 items-center border rounded-md px-3 py-2 flex-wrap">
                  <legend className="text-center mx-2 px-2 text-sm font-bold">
                    گزارش ادمین
                  </legend>
                  <span className=" flex gap-2 items-center mb-3">
                    {" "}
                    <span>جمع کل اعتبار</span>
                    <span className="font-bold">
                      {Number(extraObject.filteredSumLoans).toLocaleString()}
                    </span>
                  </span>
                </fieldset>
              )}
            </div>
          </Box>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={
            userPermissions?.RefahLoans?.edit ? EDIT_ACTIVE_REFAHLOAN : false
          }
          title="تسهیلات دارای تضمین کننده           "
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
            userPermissions?.RefahLoans?.view
              ? [
                  {
                    title: "ویرایش",
                    handler: (
                      <>
                        <IconButton
                          onClick={(rowData) =>
                          {
                            const data = rowData?.id ? rowData : editingData;
                            window.open(
                              `/betaloan/${data.id || data.Id}`
                            )
                          }
                          }
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
          name={"برند"}
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
      {/*     <BankModel
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
      /> */}
      <Confirm
        message="آیا از حذف تسهیلات منقضی شده  اطمینان دارید؟"
        close={() => setDeleteConfirmAll(false)}
        submit={deleteItemAllClick}
        open={deleteConfirmAll}
        loading={loadingDelete}
      />
      <ReportAdminTurnover open={openMali} close={() => setOpenMali(false)} />
      <Modal
        open={openLog || openLog2}
        autoWidth
        title={` لاگ ${openLog2 ? "تسهیم" : "شارژ"} تجمیعی `}
        close={() => {
          setOpenLog2(false);
          setOpenLog(false);
        }}
      >
        <ShowLogs isShare={openLog2} />
      </Modal>
    </>
  );
};

export default BetaLoan;
