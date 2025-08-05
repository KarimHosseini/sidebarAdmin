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
  ALL_GUARANTOR,
  baseUrl,
  CATEGORIES,
  EDIT_ACTIVE_FACILITIES_PARENT,
  EXPORT_FACILITIES_PARENT,
  GET_FACILITIES_PARENT,
  GET_Financier,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import InsuranceModal from "./insuranceModal";
import FaciltyParentModal from "./modal";
const FacilityParent = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // modals
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);

  const [refreshData, setRefresh] = useState(0);
  const [editingData, setEditingData] = useState({});
  const [page, setPage] = useState(1);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [filter, setFilter] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [gateWays, setGateWays] = useState([]);
  const [financier, setFinancier] = useState([]);
  const [guarantors, setGuarantors] = useState([]);
  const { token } = useSelector((state) => state.user);

  const [sort, setSort] = useState({});
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_FACILITIES_PARENT,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  useEffect(() => {
    getAllGateWays();
  }, []);
  const getAllGateWays = () => {
    axiosInstance
      .get(
        `${baseUrl}/${CATEGORIES}?Page=1&Limit=10000`,

        configReq(token)
      )
      .then((res) => {
        setGateWays(res.data.data);
      })
      .catch((err) => {});
    axiosInstance
      .get(
        `${baseUrl}/${GET_Financier}?Page=1&Limit=10000`,

        configReq(token)
      )
      .then((res) => {
        setFinancier(res.data.data);
      })
      .catch((err) => {});
    axiosInstance
      .get(
        `${baseUrl}/${ALL_GUARANTOR}?Page=1&Limit=10000`,

        configReq(token)
      )
      .then((res) => {
        setGuarantors(res.data.data);
      })
      .catch((err) => {});
  };
  if (!userPermissions?.LoanSettings?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "  تسهیلات",
            path: "/facilitySetting",
          },
        ]}
        title=" تنظیمات تسهیلات  "
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          {" "}
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
              {userPermissions?.LoanSettings?.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title="تنظیمات تسهیلات"
                  api={EXPORT_FACILITIES_PARENT}
                />
              )}

              {userPermissions?.LoanSettings?.add && (
                <Button onClick={() => setOpenCreate(true)} variant="contained">
                  <AddIcon />
                  افزودن تنظیمات تسهیلات جدید
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
            userPermissions?.LoanSettings?.update
              ? EDIT_ACTIVE_FACILITIES_PARENT
              : false
          }
          title="تنظیمات تسهیلات "
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
            userPermissions?.LoanSettings?.edit
              ? [
                  {
                    title: "خدمات های اجباری ",
                    handler: (
                      <>
                        <Button
                          onClick={() => setOpen(true)}
                          variant="outlined"
                          color="secondary"
                        >
                          مشاهده
                        </Button>
                      </>
                    ),
                  },
                  {
                    title: "تسهیلات ",
                    handler: (
                      <>
                        <Button
                          onClick={(rowData) => {
                            const data = rowData?.id ? rowData : editingData;
                            window.open(
                              `/facilitySetting/${data.id}?title=${data.title}`
                            );
                          }}
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
          name={"تسهیلات"}
          maxHeight={{ lg: "69.5vh", md: "68vh", xl: "74vh" }}
          setSelected={setSelected}
          selected={selected}
          setSort={(e) => {
            setPage(1);
            setSort({ ...sort, ...e });
          }}
          currentRow={(data) => {
            setEditingData(data);
          }}
          setRefresh={setRefresh}
        />
      </div>
      <FaciltyParentModal
        open={openEdit || openCreate}
        forEdit={openEdit}
        setAllRows={setAllRows}
        allRows={allRows}
        financier={financier}
        guarantors={guarantors}
        prevData={editingData}
        close={() => {
          setOpenCreate(false);
          setOpenEdit(false);
          setEditingData({});
        }}
        GATES={gateWays}
      />
      <InsuranceModal
        open={open}
        prevData={editingData}
        categroies={gateWays}
        reset={() => setRefresh((r) => r + 1)}
        close={() => {
          setOpen(false);
          setEditingData({});
        }}
      />
    </>
  );
};

export default FacilityParent;
