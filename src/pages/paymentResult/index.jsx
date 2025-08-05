/* eslint-disable array-callback-return */
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
  baseUrl,
  DELETE_ALL_PAYMENT_RESULT_GROUP,
  EDIT_ACTIVE_ALL_PAYMENT_RESULT_GROUP,
  EDIT_ACTIVE_PAYMENT_RESULT_GROUP,
  EXPORT_PAYMENT_RESULT_REPORT,
  GET_GATEWAYS_ENUM,
  GET_PAYMENT_RESULT_REPORT,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import PaymentModal from "./modal";
const Payment = () => {
  const [page, setPage] = useState(1);
  const [editingData, setEditingData] = useState({});

  const { userPermissions } = useSelector((state) => state.relationals);
  const [selected, setSelected] = useState([]);
  const [refreshData, setRefresh] = useState(0);
  const [allRows, setAllRows] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [gateWays, setGateWays] = useState([]);
  const { token } = useSelector((state) => state.user);

  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState({});

  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_PAYMENT_RESULT_REPORT,
      filter,
      true,
      refreshData,
      sumbitSearch
    );

  useEffect(() => {
    getAllGateWays();
  }, []);
  const getAllGateWays = () => {
    axiosInstance
      .get(
        `${baseUrl}/${GET_GATEWAYS_ENUM}?Page=1&Limit=10000&showBasicGateWay=true`,

        configReq(token)
      )
      .then((res) => {
        setGateWays(res.data.data);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  if (!userPermissions?.paymentResult?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: " عملیات بانکی",
            path: "/refund",
          },
        ]}
        title="  تراکنش های بانکی"
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
                {userPermissions?.paymentResult?.export && (
                  <Exports
                    sumbitSearch={sumbitSearch}
                    filter={filter}
                    header={header}
                    data={allData}
                    selectedData={selected}
                    title="   تراکنش های بانکی "
                    api={EXPORT_PAYMENT_RESULT_REPORT}
                  />
                )}{" "}
                {userPermissions?.paymentResult?.insert && (
                  <Button
                    onClick={() => setOpenCreate(true)}
                    variant="contained"
                  >
                    <AddIcon />
                    افزودن تراکنش بانکی
                  </Button>
                )}
              </div>
            </div>
          </>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={
            userPermissions?.paymentResult?.update
              ? EDIT_ACTIVE_PAYMENT_RESULT_GROUP
              : false
          }
          title="    تراکنش های بانکی"
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
            userPermissions?.paymentResult?.update
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
            userPermissions?.paymentResult?.deleteAll
              ? DELETE_ALL_PAYMENT_RESULT_GROUP
              : null
          }
          editActiveAllApi={
            userPermissions?.paymentResult?.activeAll
              ? EDIT_ACTIVE_ALL_PAYMENT_RESULT_GROUP
              : null
          }
        />
      </div>{" "}
      <PaymentModal
        open={openEdit || openCreate}
        forEdit={openEdit}
        prevData={editingData}
        setAllRows={setAllRows}
        allRows={allRows}
        gateWays={gateWays}
        close={() => {
          setOpenCreate(false);
          setOpenEdit(false);
          setEditingData({});
        }}
      />
    </>
  );
};

export default Payment;
