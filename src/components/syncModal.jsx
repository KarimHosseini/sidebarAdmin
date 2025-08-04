/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GET_SINGLE_SYNC } from "../helpers/api-routes";
import CustomeLayout from "./customeTable";
import DataFetcher from "./dataFetch";


const SyncHistory = ({ id, tableName }) => {
  const [page, setPage] = useState(1);
  const [editingData, setEditingData] = useState({});
  const { userPermissions } = useSelector((state) => state.relationals);
  const [selected, setSelected] = useState([]);
  const [refreshData, setRefresh] = useState(0);

  const [allRows, setAllRows] = useState([]);

  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(5);
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState({});
  const { token } = useSelector((state) => state.user);
  const [filterApplied, setFilterApplied] = useState([]);

  useLayoutEffect(() => {
    var temp = filter;
    temp.push(
      {
        name: "tableName",
        value: tableName,
        type: "eq",
      },
      {
        name: "rowId",
        value: id,
        type: "eq",
      }
    );
    setFilterApplied(temp);
  }, [filter]);
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_SINGLE_SYNC,
      filterApplied,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);

  return (
    <>
      <div className="md:mx-3 mx-1">
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          title={" تاریخچه سینک"}
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
          name={"تاریخچه سینک"}
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

export default SyncHistory;
