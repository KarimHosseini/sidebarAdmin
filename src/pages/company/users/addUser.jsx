/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Paper } from "@mui/material";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PageTitle } from "../../../components/common";
import CustomeLayout from "../../../components/customeTable";
import DataFetcher from "../../../components/dataFetch";
import Filters from "../../../components/filters";
import NoAccess from "../../../components/noAccess";
import { ALL_USERS } from "../../../helpers/api-routes";
const AddUsersCompany = ({setIds}) => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [selected, setSelected] = useState([]);
  const [refreshData, setRefresh] = useState(0);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [allRows, setAllRows] = useState([]);
  const [editingData, setEditingData] = useState({});
  const [sort, setSort] = useState({});
  const [filter, setFilter] = useState([]);
  const [actions, setActions] = useState([]);

  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      ALL_USERS,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  const handleSendUserId = () => {
    var id = "";
    selected.map((items) => {
      id += `,${items?.id}`;
    });
    setIds(id.slice(1))
  }
  if (!userPermissions?.user?.view) {
    return <NoAccess />;
  }
  return (
    <>
  
      <>
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
              <div className="flex items-center gap-4 col-span-4 justify-end">
                <Button onClick={handleSendUserId} variant="contained">ثبت اطلاعات</Button>
              </div>
            </div>
          </>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={false}
          title="  کاربران"
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
          actions={false}
          length={metaData?.total}
          name={"  کاربر"}
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
      </>
    </>
  );
};

export default AddUsersCompany;
