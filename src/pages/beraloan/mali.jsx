/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Modal } from "../../components/common";
import Exports from "../../components/common/export";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import Filters from "../../components/filters";
import NoAccess from "../../components/noAccess";
import {
  EXPORT_USER_FACILITY_TURN_OVER,
  GET_USER_FACILITY_TURN_OVER,
} from "../../helpers/api-routes";

const ReportAdminTurnover = ({ close, open }) => {
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [editingData, setEditingData] = useState({});
  const { userPermissions } = useSelector((state) => state.relationals);
  const [selected, setSelected] = useState([]);
  const [refreshData, setRefresh] = useState(0);
  const [userInfo, setuserInfo] = useState({});

  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState({});
  const { token, userId } = useSelector((state) => state.user);
  useEffect(() => {
    if (localStorage.getItem("s")) {
      setuserInfo(JSON.parse(localStorage.getItem("s")));
    }
  }, [localStorage.getItem("s")]);

  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_USER_FACILITY_TURN_OVER,
      filter,
      true,
      refreshData,
      sumbitSearch,
      1,
      {
        name: "userId",
        value: userId,
      }
    );

  if (!userPermissions?.ReportFacilityUserTurnover?.view) {
    return <NoAccess />;
  }
  return (
    <Modal autoWidth open={open} close={close}>
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
                {allData && allData[0] ? (
                  <>
                    {" "}
                    <div className="flex gap-1 items-center">
                      <span> جمع اعتبار کیف پول :‌</span>
                      <span className="font-bold">
                        {allData[0].remain?.toLocaleString()}
                      </span>
                      تومان
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {userPermissions?.ReportFacilityUserTurnover.export && (
                  <Exports
                    sumbitSearch={sumbitSearch}
                    filter={filter}
                    header={header}
                    data={allData}
                    selectedData={selected}
                    title=" گزارش  مالی  تسهیلاتی  "
                    api={EXPORT_USER_FACILITY_TURN_OVER}
                    extraParams={{ name: "userId", value: userId }}
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
          title={
            "  گزارش  مالی  تسهیلاتی  " +
            userInfo?.fname +
            " " +
            userInfo?.lname
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
    </Modal>
  );
};

export default ReportAdminTurnover;
