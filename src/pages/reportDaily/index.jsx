/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Paper, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
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
  EXPORT_DAILY_REPORT,
  GET_DAILY_REPORT,
  GET_SUM_INVOICE_DAILY,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
const ReportDaily = () => {
  const [page, setPage] = useState(1);

  const { userPermissions } = useSelector((state) => state.relationals);
  const [selected, setSelected] = useState([]);
  const [refreshData, setRefresh] = useState(0);

  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);

  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState({});
  const [loading2, setLoading2] = useState(false);
  const [walletSum, setWalletSum] = useState({});
  const { token } = useSelector((state) => state.user);
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_DAILY_REPORT,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setLoading2(true);
    var temp = "";
    if (sort) {
      var counter = 0;
      for (var prop in sort) {
        temp += `&sort[${counter}][key]=${prop}&sort[${counter}][direction]=${
          sort[prop] ? "asc" : "desc"
        }`;
        counter++;
      }
    }
    if (filter) {
      filter.map((item, index) => {
        temp += `&filter[${index}][key]=${item?.name}&filter[${index}][value]=${item?.value}&filter[${index}][operator]=${item?.type}`;
      });
    }
    axiosInstance(
      `${baseUrl}/${GET_SUM_INVOICE_DAILY}${temp ? `?${temp.slice(1)}` : ""}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading2(false);
        if (data.code === 200) {
          setWalletSum(data.data);
        }
      })
      .catch((err) => {
        setLoading2(false);
        toast.error(err.response?.data?.message);
      });
  }, [filter, sort]);
  if (!userPermissions?.ReportDisaggregatedDailySales?.view) {
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
        title="  گزارشات فروش روزانه تفکیک شده"
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
                <SyncButton setRefresh={setRefresh} setting={setting} />{" "}
                <div className="flex-wrap flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="text-xs"> مبلغ کل: </div>
                    {loading2 ? (
                      <Skeleton width={95} height={10} variant="rounded" />
                    ) : (
                      <div className="text-xs">
                        <strong>
                          {walletSum?.totalAmount?.toLocaleString("en-US")}
                        </strong>{" "}
                        تومان
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs"> تعداد: </div>
                    {loading2 ? (
                      <Skeleton width={95} height={10} variant="rounded" />
                    ) : (
                      <div className="text-xs">
                        <strong>
                          {" "}
                          {walletSum?.totalCount?.toLocaleString("en-US")}
                        </strong>{" "}
                      </div>
                    )}
                  </div>
                </div>
                {userPermissions?.ReportDisaggregatedDailySales?.export && (
                  <Exports
                    sumbitSearch={sumbitSearch}
                    filter={filter}
                    header={header}
                    data={allData}
                    selectedData={selected}
                    title="  گزارشات فروش روزانه تفکیک شده"
                    api={EXPORT_DAILY_REPORT}
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
          title="  گزارشات فروش روزانه تفکیک شده"
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
          actions={[]}
          length={metaData?.total}
          name={"  کاردکس"}
          maxHeight={{ lg: "69.5vh", md: "68vh", xl: "74vh" }}
          setSort={(e) => {
            setSort({ ...sort, ...e });
            setPage(1);
          }}
          currentRow={(data) => {
            /*   setEditingData(data); */
          }}
          setRefresh={setRefresh}
          setSelected={setSelected}
          selected={selected}
        />
      </div>
    </>
  );
};

export default ReportDaily;
