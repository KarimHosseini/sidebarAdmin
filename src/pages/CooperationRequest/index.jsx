/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Paper } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { PageTitle } from "../../components/common";
import Exports from "../../components/common/export";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import Filters from "../../components/filters";
import NoAccess from "../../components/noAccess";
import { EXPORT_SUM_COOPERATION, GET_SUM_COOPERATION } from "../../helpers/api-routes";
import SyncButton from "../../components/sync";
import { useNavigate } from "react-router-dom";
const ReportCooperation = () => {
  const [page, setPage] = useState(1);

  const { userPermissions } = useSelector((state) => state.relationals);
  const [selected, setSelected] = useState([]);
  const [refreshData, setRefresh] = useState(0);
    const navigate = useNavigate()
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [editingData, setEditingData] = useState({});

  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState({});

  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_SUM_COOPERATION,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  if (!userPermissions?.CooperationRequest?.view) {
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
        title="گزارش در خواست نمایندگی "
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
                {userPermissions?.CooperationRequest.export && (
                  <Exports
                  sumbitSearch={sumbitSearch}
                    filter={filter}
                    header={header}
                    data={allData}
                    selectedData={selected}
                    title="گزارش در خواست نمایندگی "
                    api={EXPORT_SUM_COOPERATION}
                  />
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
          title="گزارش در خواست نمایندگی "
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
            [
                {
                  title: "جزییات",
                  handler: (
                    <>
                     <Button onClick={() => navigate(`/CooperationRequest/${editingData?.id ? editingData?.id : editingData?.Id}?UI=${editingData.UserId}`)} variant="outlined">
                        مشاهده
                     </Button>
                    </>
                  ),
                },
              ]
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
    </>
  );
};

export default ReportCooperation;
