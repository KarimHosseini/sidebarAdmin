/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";

import { Button, IconButton, Paper } from "@mui/material";
import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PageTitle } from "../../components/common";
import Exports from "../../components/common/export";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Filters from "../../components/filters";
import { Confirm } from "../../components/modals";
import NoAccess from "../../components/noAccess";
import {
  ALL_SHIPPING_HOLIDAY,
  baseUrl,
  DELETE_ALL_SHIPPING_HOLIDAY,
  DELETE_SHIPPING_HOLIDAY,
  EDIT_ACTIVE_ALL_SHIPPING_HOLIDAY,
  EDIT_ACTIVE_SHIPPING_HOLIDAY,
  EXPORT_SHIPPING_HOLIDAY,
  GET_CALENDER,
} from "../../helpers/api-routes";
import { configReq, toIsoString } from "../../helpers/functions";
import ShippingCalenderHOliday from "./modal";
const ShippingCompanyHoliday = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [selected, setSelected] = useState([]);
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = useSelector((state) => state.user);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [page, setPage] = useState(1);
  const [refreshData, setRefresh] = useState(0);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [filter, setFilter] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [allCalenders, setAllCalenders] = useState([]);
  const [filterApplied, setFilterApplied] = useState([]);

  const [sort, setSort] = useState({});
  useLayoutEffect(() => {
    var temp = filter;
    if (!filter.find((fil) => fil.name === "op")) {
      temp.push({
        name: "shippingCompanyId",
        value: id,
        type: "eq",
      });
    }

    setFilterApplied(temp);
  }, [filter]);
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      ALL_SHIPPING_HOLIDAY,
      filterApplied,
      true,
      refreshData,
      sumbitSearch,
      1
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  useEffect(() => {
    axiosInstance
      .get(
        `${baseUrl}/${GET_CALENDER}?Page=1&Limit=10000&filter[0][key]=date&filter[0][value]=%22${toIsoString(
          new Date()
        )}%22&filter[0][operator]=ge`,

        configReq(token)
      )
      .then((res) => {
        const temp = [];

        setAllCalenders(res.data.data);
      })
      .catch((err) => {});
  }, []);
  const deleteAttr = () => {
    axiosInstance
      .delete(
        `${baseUrl}/${DELETE_SHIPPING_HOLIDAY}?id=${editingData.id}`,
        configReq(token)
      )
      .then((res) => {
        var temp = [...allRows];
        var newData = temp.filter((item) => item.id !== editingData.id);
        setAllRows(newData);
        setConfirmDelete(false);
        toast.success("با موفقیت حذف شد");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };
  if (!userPermissions?.shippingCompanyHoliday?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "    ارسال کالا ",
            path: "/shippingSetting",
          },
          {
            title: "شرکتهای حمل",
            path: "/shipping-companies",
          },
        ]}
        title={"  فعال کردن فروش در روزهای تعطیل " + searchParams.get("name")}
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
                {userPermissions?.shippingCompanyHoliday.export && (
                  <Exports
                    sumbitSearch={sumbitSearch}
                    filter={filter}
                    header={header}
                    data={allData}
                    selectedData={selected}
                    title="فعال کردن فروش در روزهای تعطیل  "
                    api={EXPORT_SHIPPING_HOLIDAY}
                    extraParams={{ name: "shippingCompanyId", value: id }}
                    param={`&filter[0][key]=shippingCompanyId&filter[0][value]=${id}&filter[0][operator]=eq`}
                  />
                )}

                {userPermissions?.shippingCompanyHoliday?.insert && (
                  <Button
                    onClick={() => setOpenCreate(true)}
                    variant="contained"
                  >
                    <AddIcon />
                    افزودن تعیین روز های تعطیل جدید
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
            userPermissions?.shippingCompanyHoliday?.update
              ? EDIT_ACTIVE_SHIPPING_HOLIDAY
              : false
          }
          title={"فعال کردن فروش در روزهای تعطیل " + searchParams.get("name")}
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
            userPermissions?.shippingCompanyHoliday?.update
              ? [
                  {
                    title: "حذف",
                    handler: (
                      <>
                        <IconButton
                          onClick={() => {
                            setConfirmDelete(true);
                          }}
                        >
                          <Delete sx={{ color: "red" }} />
                        </IconButton>
                      </>
                    ),
                  },
                ]
              : false
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
          deleteAllApi={
            userPermissions?.shippingCompanyHoliday?.deleteAll
              ? DELETE_ALL_SHIPPING_HOLIDAY
              : null
          }
          editActiveAllApi={
            userPermissions?.shippingCompanyHoliday?.activeAll
              ? EDIT_ACTIVE_ALL_SHIPPING_HOLIDAY
              : null
          }
        />
      </div>
      <Confirm
        message="آیا از حذف این فعال کردن فروش در روزهای تعطیل اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
      <ShippingCalenderHOliday
        open={openEdit || openCreate}
        forEdit={openEdit}
        data={editingData}
        setAllRows={setAllRows}
        allRows={allRows}
        allCalenders={allCalenders}
        close={() => {
          setOpenCreate(false);
          setOpenEdit(false);
          setEditingData({});
        }}
      />
    </>
  );
};

export default ShippingCompanyHoliday;
