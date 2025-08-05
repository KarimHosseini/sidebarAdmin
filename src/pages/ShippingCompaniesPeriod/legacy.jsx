/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import AddIcon from "@mui/icons-material/Add";

import { Edit } from "@mui/icons-material";
import AddchartIcon from "@mui/icons-material/Addchart";
import { Button, IconButton, Paper, Switch } from "@mui/material";
import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, PageTitle } from "../../components/common";
import Exports from "../../components/common/export";
import Uploader from "../../components/common/uploader";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Filters from "../../components/filters";
import NoAccess from "../../components/noAccess";
import {
  ALL_SHIPPING_CSV,
  ALL_SHIPPING_PERIOD,
  baseUrl,
  DELETE_ALL_SHIPPING_PERIOD,
  EDIT_ACTIVE_ALL_SHIPPING_PERIOD,
  EDIT_ACTIVE_SHIPPING_PERIOD,
  EXPORT_SHIPPING_PERIOD,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import EditShipingPeriodModal from "./modal";

const ShippingCompanyPeriod = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [selected, setSelected] = useState([]);
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState();
  const { token } = useSelector((state) => state.user);

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
  const [allShippingClass, setAllShippingClass] = useState([]);
  const [filterApplied, setFilterApplied] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);

  const [sort, setSort] = useState({});
  useLayoutEffect(() => {
    var temp = filter;
    if (!filter.find((fil) => fil.name === "shippingCompanyId")) {
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
      ALL_SHIPPING_PERIOD,
      filterApplied,
      true,
      refreshData,
      sumbitSearch,
      1
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  const importCsv = () => {
    const formData = new FormData();

    formData.append("companyId", id);

    formData.append("files", files);
    if (isUpdate) {
      formData.append("isUpdate", isUpdate);
    }
    axiosInstance
      .post(`${baseUrl}/${ALL_SHIPPING_CSV}`, formData, configReq(token))
      .then((res) => {
        setRefresh((r) => r + 1);
        toast.success("با موفقیت اضافه شد");
        setOpen(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };
  if (!userPermissions?.shippingPeriod?.view) {
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
        title={"   بازه ارسالی " + searchParams.get("name")}
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
                {userPermissions?.shippingPeriod.export && (
                  <Exports
                    sumbitSearch={sumbitSearch}
                    filter={filter}
                    header={header}
                    data={allData}
                    selectedData={selected}
                    title="بازه ارسالی  "
                    api={EXPORT_SHIPPING_PERIOD}
                    extraParams={{ name: "shippingCompanyId", value: id }}
                    param={`&filter[0][key]=shippingCompanyId&filter[0][value]=${id}&filter[0][operator]=eq`}
                  />
                )}
                {userPermissions?.shippingPeriod?.insert && (
                  <Button
                    onClick={() => setOpenCreate(true)}
                    variant="contained"
                  >
                    <AddIcon />
                    افزودن بازه ارسالی جدید
                  </Button>
                )}{" "}
                {userPermissions?.shippingPeriod?.import && (
                  <Button
                    variant="outlined"
                    onClick={() => setOpen(true)}
                    color="success"
                  >
                    <AddchartIcon className="mx-1" />
                    ورود یا آپدیت از اکسل
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
          editApi={EDIT_ACTIVE_SHIPPING_PERIOD}
          title={" بازه ارسالی  " + searchParams.get("name")}
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
          alart={
            <>
              اپدیت از اکسل : بمعنای آپدیت اطلاعات کنونی بر اساس خروجی اکسل می
              باشد ( بدون درج ردیف جدید ) <br />
              ورود از اکسل : بمعنای ورود اطلاعات جدید در ردیف های جدید می باشد
            </>
          }
          setting={setting}
          CurrentPage={CurrentPage}
          actions={
            userPermissions?.shippingPeriod?.update
              ? [
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
            userPermissions?.shippingPeriod?.deleteAll
              ? DELETE_ALL_SHIPPING_PERIOD
              : null
          }
          editActiveAllApi={
            userPermissions?.shippingPeriod?.activeAll
              ? EDIT_ACTIVE_ALL_SHIPPING_PERIOD
              : null
          }
        />
      </div>
      <EditShipingPeriodModal
        open={openEdit || openCreate}
        forEdit={openEdit}
        data={editingData}
        setAllRows={setAllRows}
        allRows={allRows}
        close={() => {
          setOpenCreate(false);
          setOpenEdit(false);
          setEditingData({});
        }}
      />{" "}
      <Modal
        open={open}
        close={() => {
          setOpen(false);
        }}
        title=" ورود  از اکسل"
        autoWidth={true}
      >
        <div className="flex flex-col items-center justify-between gap-5">
          <Uploader
            setFiles={(e) => {
              setFiles(e);
            }}
          />
          <div className="flex items-center gap-4">
            <span className="text-xs"> به روز رسانی: </span>
            <Switch
              onChange={() => setIsUpdate(!isUpdate)}
              defaultChecked={isUpdate}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => importCsv()}
            disabled={!files}
          >
            ثبت اطلاعات
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ShippingCompanyPeriod;
