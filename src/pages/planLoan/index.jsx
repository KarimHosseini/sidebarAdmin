/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, IconButton, Paper } from "@mui/material";
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
  EDIT_ACTIVE_PLAN_LOAN,
  EXPORT_PLAN_LOAN,
  GET_PLAN_LOAN,
} from "../../helpers/api-routes";

const PlanLoan = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

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

  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_PLAN_LOAN,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  /*   useLayoutEffect(() => {
    var temp = filter;
    if (
      !filter.find((fil) => fil.name === "state") &&
      filter.find((fil) => fil.name === "step")
    ) {
      temp.push({
        name: "state",
        value: 0,
        type: "eq",
      });
    }

    setFilterApplied(temp);
  }, [filter]); */
  if (!userPermissions?.planLoanRequest?.view) {
    return <NoAccess />;
  }

  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "  تسهیلات",
            path: "/facilites",
          },
        ]}
        title=" تسهیلات طرح بانک آینده"
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          <Box className="flex md:gap-4 gap-1 flex-wrap justify-between">
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
              {userPermissions?.planLoanRequest?.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title="تسهیلات طرح"
                  api={EXPORT_PLAN_LOAN}
                />
              )}

              {userPermissions?.planLoanRequest?.update && (
                <Button
                  onClick={() => navigate("/plan-loan/create")}
                  variant="contained"
                >
                  <AddIcon />
                  افزودن تسهیلات طرح جدید
                </Button>
              )}
            </div>
          </Box>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={
            userPermissions?.planLoanRequest?.update
              ? EDIT_ACTIVE_PLAN_LOAN
              : false
          }
          title="  تسهیلات طرح بانک آینده"
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
            userPermissions?.planLoanRequest?.update
              ? [
                  {
                    title: "ویرایش",
                    handler: (
                      <>
                        <IconButton
                          onClick={(rowData) => {
                            const data = rowData?.id ? rowData : editingData;
                            if (localStorage.getItem("redirectType") === "2") {
                              navigate(`/plan-loan/${data.id}`);
                            } else {
                              window.open(
                                `/plan-loan/${data.id}`,
                                "_blank"
                              );
                            }
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
          name={"تسهیلات طرح"}
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
    </>
  );
};

export default PlanLoan;
