/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Paper } from "@mui/material";

import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { PageTitle } from "../../../components/common";
import CustomeLayout from "../../../components/customeTable";
import DataFetcher from "../../../components/dataFetch";
import NoAccess from "../../../components/noAccess";
import { ALL_USERS } from "../../../helpers/api-routes";
const DeleteUsers = ({ setIds }) => {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);



  const [editingData, setEditingData] = useState({});
  const { userPermissions } = useSelector((state) => state.relationals);

  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const { id } = useParams();

  const [refreshData, setRefresh] = useState(0);
  const [filter, setFilter] = useState([]);
  const [filterApplied, setFilterApplied] = useState([]);
  const [sort, setSort] = useState({});
  const [allRows, setAllRows] = useState([]);
  const { token } = useSelector((state) => state.user);

  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      ALL_USERS,
      filterApplied,
      true,
      refreshData,
      sumbitSearch
    );
  useLayoutEffect(() => {
    var temp = filter;
    temp.push({
        name: "companyId",
        value: id,
        type: "eq",
      });

    setFilterApplied(temp);
  }, [filter, id]);
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  const handleSendUserId = () => {
    var id = "";
    selected.map((items) => {
      id += `,${items?.id}`;
    });
    setIds(id.slice(1));
  };
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
            <div className="flex md:gap-4 gap-1 flex-wrap justify-end">
              {/*     <Filters
                limit={limit}
                setLimit={setLimit}
                headers={header}
                setFilter={setFilter}
                filter={filter}
                setPage={setPage}
                loading={loading}
              /> */}
              <div className="flex items-center gap-4 col-span-4 justify-end">
                <Button
                  onClick={handleSendUserId}
                  variant="contained"
                  color="error"
                >
                  حذف کاربر
                </Button>
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

export default DeleteUsers;
