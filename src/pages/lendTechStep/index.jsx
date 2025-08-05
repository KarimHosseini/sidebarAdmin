/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton, Paper } from "@mui/material";
import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  EDIT_ACTIVE_LEND_TECH_STEP,
  EXPORT_LEND_TECH_STEP,
  GET_LEND_TECH_STEP,
  GET_SMS,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import LandTechStepModal from "./modal";

const LandTechStep = () => {
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [editingData, setEditingData] = useState({});
  const { userPermissions } = useSelector((state) => state.relationals);
  const [selected, setSelected] = useState([]);
  const [refreshData, setRefresh] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [allRows, setAllRows] = useState([]);
  const [smsTypes, setSmsTypes] = useState([]);

  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const { id } = useParams();
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState({});
  const { token } = useSelector((state) => state.user);
  const [filterApplied, setFilterApplied] = useState([]);
  const navigate = useNavigate();
  useLayoutEffect(() => {
    var temp = filter;
    temp.push({
      name: "lenTechId",
      value: id,
      type: "eq",
    });
    setFilterApplied(temp);
  }, [filter]);
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_LEND_TECH_STEP,
      filterApplied,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  useEffect(() => {
    getAllSmsTypes();
  }, []);
  const getAllSmsTypes = () => {
    axiosInstance
      .get(
        `${baseUrl}/${GET_SMS}?Page=1&Limit=10000`,

        configReq(token)
      )
      .then((res) => {
        setSmsTypes(res.data.data);
      })
      .catch((err) => {});
  };
  if (!userPermissions?.lendTechStep?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "  مدیریت تسهیلات",
            path: "/plan-loan",
          },
          {
            title: " لنتک ها",
            path: "/lendTech",
          },
        ]}
        title={`  مراحل لنتک   ${searchParams.get("name")}`}
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          <>
            <div className="flex md:gap-4 gap-4 flex-wrap justify-between">
              <Filters
                limit={limit}
                setLimit={setLimit}
                headers={header}
                setFilter={setFilter}
                filter={filter}
                setPage={setPage}
                loading={loading}
              />
              <div className="flex items-end gap-4 col-span-4 md:justify-end">
                {userPermissions?.lendTechStep?.insert && (
                  <Button
                    onClick={() => setOpenCreate(true)}
                    variant="contained"
                  >
                    <AddIcon />
                    افزودن مراحل لنتک جدید
                  </Button>
                )}
                <SyncButton setRefresh={setRefresh} setting={setting} />
                {userPermissions?.lendTechStep.export && (
                  <Exports
                    sumbitSearch={sumbitSearch}
                    filter={filter}
                    header={header}
                    data={allData}
                    selectedData={selected}
                    title={`  مراحل لنتک   ${searchParams.get("name")}`}
                    api={EXPORT_LEND_TECH_STEP}
                    extraParams={{ name: "lenTechId", value: id }}
                  />
                )}
              </div>
            </div>
          </>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          /*        
          editApi={EDIT_PRODUCTS} */
          editApi={
            userPermissions?.lendTechStep?.update
              ? EDIT_ACTIVE_LEND_TECH_STEP
              : false
          }
          title={`  مراحل لنتک   ${searchParams.get("name")}`}
          headers={header}
          setSearch={setsearch}
          search={search}
          page={page}
          total_pages={metaData?.total_pages}
          setApplySearch={(e) => {
            setPage(1);
            setSumbitSearch(e);
          }}
          rows={allRows || []}
          hasMore={hasMore}
          loading={loading}
          setPage={setPage}
          setting={setting}
          CurrentPage={CurrentPage}
          actions={
            userPermissions?.lendTechStep?.update
              ? [
                  {
                    title: " فیلد ها",
                    handler: (
                      <>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            navigate(
                              `/lendTech/${id}/${editingData?.id}?name=${
                                editingData.title
                              }&pt=${searchParams.get("name")}&pi=${id}`
                            );
                          }}
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
          name={"  شعبه بانک"}
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
        <LandTechStepModal
          open={openEdit || openCreate}
          forEdit={openEdit}
          prevData={editingData}
          setAllRows={setAllRows}
          allRows={allRows}
          smsTypes={smsTypes}
          close={() => {
            setOpenCreate(false);
            setOpenEdit(false);
            setEditingData({});
          }}
        />
      </div>
    </>
  );
};

export default LandTechStep;
