/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, CircularProgress, Paper, TextField } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, PageTitle } from "../../components/common";
import Exports from "../../components/common/export";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Filters from "../../components/filters";
import NoAccess from "../../components/noAccess";
import SyncButton from "../../components/sync";
import {
  baseUrl,
  EXPORT_REFAHINSTALLMENT_REPORT,
  GET_REFAHINSTALLMENT_REPORT,
  REFAHINSTALLMENT_MANUL,
  REFAHINSTALLMENT_SEND,
  REFAHINSTALLMENT_UPDATE_ALL,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
const RefahInstallment = () => {
  const [page, setPage] = useState(1);
  const { token } = useSelector((state) => state.user);
  const [editingData, setEditingData] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const { userPermissions } = useSelector((state) => state.relationals);
  const [selected, setSelected] = useState([]);
  const [refreshData, setRefresh] = useState(0);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [openOverDue, setOpenOverDue] = useState(false);
  const [loadingSms, setLoadingSms] = useState(false);
  const [loadingUpdateAll, setLoadingUpdateAll] = useState(false);

  const [filter, setFilter] = useState([]);
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
    GET_REFAHINSTALLMENT_REPORT,
    filter,
    true,
    refreshData,
    sumbitSearch,
    1,
    {
      name: "userId",
      value: searchParams.get("userId"),
    }
  );

  const handleSend = () => {
    setLoadingSms(true);

    var temp = [];
    selected.forEach((item) => {
      temp.push(item.requestId);
    });
    axiosInstance
      .post(`${baseUrl}/${REFAHINSTALLMENT_SEND}?message=${title}`, [...temp], {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success(res.data.message || "");
        setOpen(false);
        setLoadingSms(false);
        setTitle("");
        setSelected([]);
        setRefresh((r) => r + 1);
      })
      .catch((err) => {
        setLoadingSms(false);

        toast.error(err.response?.data?.message);
      });
  };
  const handleSendDue = () => {
    setLoadingSms(true);
    axiosInstance
      .post(
        `${baseUrl}/${REFAHINSTALLMENT_MANUL}`,
        { refahInstallmentId: editingData.refahInstallmentId, message: title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message || "");
        setOpenOverDue(false);
        setLoadingSms(false);
        setSelected([]);
        setTitle("");
        setRefresh((r) => r + 1);
      })
      .catch((err) => {
        setLoadingSms(false);

        toast.error(err.response?.data?.message);
      });
  };
  const updateAll = () => {
    setLoadingUpdateAll(true);
    axiosInstance
      .get(`${baseUrl}/${REFAHINSTALLMENT_UPDATE_ALL}`, configReq(token))
      .then((res) => {
        toast.success(res.data.message || "");
        setLoadingUpdateAll(false);
        setRefresh((r) => r + 1);
      })
      .catch((err) => {
        setLoadingUpdateAll(false);

        toast.error(err.response?.data?.message);
      });
  };

  if (!userPermissions?.RefahInstallment?.view) {
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
        title={
          " گزارش اقساط رفاه  " +
          `${
            searchParams.get("userFullName")
              ? searchParams.get("userFullName")
              : ""
          }`
        }
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          <>
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
              <div className="flex items-center gap-4 col-span-4 md:justify-end">
                <SyncButton setRefresh={setRefresh} setting={setting} />
                <div className="w-full min-w-fit flex">
                  {" "}
                  جمع بر اساس فیلتر{" "}
                  <span className="font-bold mx-3">
                    {extraObject?.sumOfFilteredData?.toLocaleString()} تومان
                    {"  "}
                  </span>
                  {extraObject?.lastUpdate && (
                    <>
                      {" "}
                      - تاریخ آخرین آپدیت{"  "}:
                      <div className="flex items-center gap-2 ">
                        {" "}
                        <div className="flex">
                          <div>
                            {String(
                              new Date(extraObject?.lastUpdate).getMinutes()
                            ).padStart(2, "0")}
                            :
                          </div>
                          <div>
                            {String(
                              new Date(extraObject?.lastUpdate).getHours()
                            ).padStart(2, "0")}
                          </div>
                        </div>
                        <span className="text-base font-bold">
                          {new Date(extraObject?.lastUpdate).toLocaleDateString(
                            "fa-IR"
                          )}
                        </span>
                      </div>
                    </>
                  )}
                </div>{" "}
                {userPermissions?.RefahInstallment.export && (
                  <>
                    {searchParams.get("userId") ? (
                      <Exports
                        filter={filter}
                        header={header}
                        data={allData}
                        selectedData={selected}
                        title="  گزارش اقساط رفاه"
                        api={EXPORT_REFAHINSTALLMENT_REPORT}
                        extraParams={{
                          name: "userId",
                          value: searchParams.get("userId"),
                        }}
                      />
                    ) : (
                      <Exports
                        filter={filter}
                        header={header}
                        data={allData}
                        selectedData={selected}
                        title="  گزارش اقساط رفاه"
                        api={EXPORT_REFAHINSTALLMENT_REPORT}
                      />
                    )}
                  </>
                )}
                {selected?.length > 0 &&
                  userPermissions?.RefahInstallment?.SendOverdueSms && (
                    <Button variant="contained" onClick={() => setOpen(true)}>
                      {" "}
                      ارسال گزارش اقساط معوق{" "}
                    </Button>
                  )}
                {userPermissions?.RefahInstallment?.updateAll && (
                  <Button
                    disabled={loadingUpdateAll}
                    variant="contained"
                    onClick={updateAll}
                  >
                    {loadingUpdateAll ? (
                      <CircularProgress size={20} />
                    ) : (
                      "بروزرسانی همه"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          /*           setAllRows={setAllRows}
          editApi={EDIT_PRODUCTS} */
          title={
            " گزارش اقساط رفاه " +
            `${
              searchParams.get("userFullName")
                ? searchParams.get("userFullName")
                : ""
            }`
          }
          headers={header}
          setSearch={setsearch}
          search={search}
          page={page}
          total_pages={metaData?.total_pages}
          setApplySearch={(e) => {
            setPage(1);
            setSumbitSearch(e);
          }}
          rows={allData || []}
          hasMore={hasMore}
          loading={loading}
          setPage={setPage}
          setting={setting}
          CurrentPage={CurrentPage}
          actions={
            userPermissions?.RefahInstallment?.ManualSettleOverDueInstallment
              ? [
                  {
                    title: "ارسال پیام معوقه",
                    handler: (
                      <>
                        <Button
                          onClick={() => {
                            if (editingData.isOverDue) {
                              setOpenOverDue(true);
                            } else {
                              toast.error("این مورد معوق نیست");
                            }
                          }}
                          variant="contained"
                          color="primary"
                        >
                          تسویه دستی{" "}
                        </Button>
                      </>
                    ),
                  },
                ]
              : false
          }
          length={metaData?.total}
          name={"  کاردکس"}
          maxHeight={{ lg: "69.5vh", md: "68vh", xl: "74vh" }}
          setSort={(e) => {
            setSort({ ...sort, ...e });
            setPage(1);
          }}
          currentRow={(data) => {
            setEditingData(data);
          }}
          setRefresh={setRefresh}
          setSelected={setSelected}
          selected={selected}
        />
      </div>
      <Modal
        open={open}
        close={() => setOpen(false)}
        title={"متن پیام را وارد کنید"}
      >
        <div className="flex flex-col gap-4">
          {[...new Set(selected.map((item) => item.userFullName))].map(
            (uniqueName) => (
              <span className="font-semibold" key={uniqueName}>
                {uniqueName}
              </span>
            )
          )}
        </div>
        <div className="p-3 border-t mt-3">
          {" "}
          <TextField
            multiline
            rows={3}
            value={title}
            fullWidth
            label="پیام"
            disabled={!userPermissions?.siteNotification?.update}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex justify-end mt-5 gap-2">
            <Button
              disabled={loadingSms}
              onClick={() => handleSend()}
              variant="contained"
            >
              {" "}
              {loadingSms ? <CircularProgress /> : "  ثبت اطلاعات"}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={openOverDue}
        close={() => setOpenOverDue(false)}
        title={"متن پیام را وارد کنید"}
      >
        <div className="p-6">
          <TextField
            multiline
            value={title}
            fullWidth
            label="پیام"
            disabled={!userPermissions?.siteNotification?.update}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex  mt-5 justify-end gap-2">
            <Button
              disabled={loadingSms}
              onClick={() => handleSendDue()}
              variant="contained"
            >
              {loadingSms ? <CircularProgress /> : "  ثبت اطلاعات"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RefahInstallment;
