/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import AddchartIcon from "@mui/icons-material/Addchart";
import { Button, CircularProgress, IconButton, Paper } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dropdown, Modal, PageTitle } from "../../../components/common";
import Exports from "../../../components/common/export";
import Uploader from "../../../components/common/uploader";
import CustomeLayout from "../../../components/customeTable";
import DataFetcher from "../../../components/dataFetch";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import Filters from "../../../components/filters";
import { Confirm } from "../../../components/modals";
import NoAccess from "../../../components/noAccess";
import SyncButton from "../../../components/sync";
import {
  ALL_PRICES,
  baseUrl,
  disableAllProductProperties,
  EDIT_ACTIVE_PRODUCT_PROPERTIES,
  export6,
  EXPORT_AALL_PRICES,
  importPrices,
  RESCALEALL_PRICE,
  suppliers,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import { logout } from "../../../redux/slices/user";
import EditPrice from "./modal";
import SyncProducts from "./syncButton";
const ProductProperties = () => {
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [percent, setPercent] = useState();

  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);

  const [disabledModal, setdisabledModal] = useState(false);

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [supplierData, setSupplierData] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [files, setFiles] = useState();
  const [openEdit, setOpenEdit] = useState(false);
  const [loadingP, setlLoadingP] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [csvRender2, setCsvRender2] = useState(0);
  const csvLink2 = useRef();
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState({});
  const [refreshData, setRefresh] = useState(0);
  const dispatch = useDispatch();
  const [editingData, setEditingData] = useState({});

  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      ALL_PRICES,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  const [allRows, setAllRows] = useState([]);
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  useEffect(() => {
    axiosInstance(
      `${baseUrl}/${suppliers}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        if (data.code === 200) {
          setSupplierData(data.data);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  }, []);

  const disabledAll = () => {
    axiosInstance
      .put(`${baseUrl}/${disableAllProductProperties}`, {}, configReq(token))
      .then((res) => {
        setdisabledModal(false);
        setRefresh((r) => r + 1);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };


  const importCsv = () => {
    const formData = new FormData();
    formData.append("supplierId", supplier?.id);
    formData.append("files", files);
    axiosInstance
      .post(`${baseUrl}/${importPrices}`, formData, configReq(token))
      .then((res) => {
        setRefresh((r) => r + 1);
        setOpen(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };
  const handlePrice = () => {
    const formData = new FormData();
    var ids = [];
    selected.map((items) => {
      ids.push(items?.id);
    });
    setlLoadingP(true);
    var datas = { ChangePercent: percent || 0 };
    if (ids.length > 0) {
      datas = { ...datas, Ids: ids };
    } else {
      var temp = "";
      filter.map((item, index) => {
        temp += `&filter[${index}][key]=${item?.name}&filter[${index}][value]=${item?.value}&filter[${index}][operator]=${item?.type}`;
      });
      if (sumbitSearch) temp += `&search=${sumbitSearch}`;
      datas = { ...datas, FilterValue: temp.slice(1) };
    }

    axiosInstance
      .put(
        `${baseUrl}/${RESCALEALL_PRICE}`,
        { ...datas },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setPercent("");
        setOpenConfirm(false);
        setRefresh((r) => r + 1);
        setlLoadingP(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setlLoadingP(false);
      });
  };

  useEffect(() => {
    if (csvRender2 > 0) {
      csvLink2.current.link.click();
      setCsvRender2(0);
    }
  }, [csvRender2]);
  if (!userPermissions?.productProperties?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        title="لیست کالاها"
        broadCrumb={[
          {
            title: "مدیریت محصولات",
            path: "/products",
          },
        ]}
      />

      <div className="px-3 relative">
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
              <div className="flex items-center col-span-5  flex-wrap md:justify-end justify-start gap-5">
                {/*      {userPermissions?.productcrm?.export && (
                  <Button
                    variant="outlined"
                    color="warning"
                    sx={{ boxShadow: "none" }}
                    onClick={crmExels}
                  >
                    {csvLoading2 ? (
                      <CircularProgress
                        sx={{
                          width: "20px !important",
                          height: "20px !important",
                          mx: 1,
                        }}
                      />
                    ) : (
                      <FileDownloadIcon />
                    )}
                    خروجی CRM
                  </Button>
                )} */}
                <SyncButton setRefresh={setRefresh} setting={setting} />
                {userPermissions?.productProperties?.import && (
                  <Button
                    variant="outlined"
                    onClick={() => setOpen(true)}
                    color="success"
                  >
                    <AddchartIcon className="mx-1" />
                    ورودی از اکسل
                  </Button>
                )}
                {userPermissions?.productProperties?.disableAll && (
                  <Button
                    onClick={() => setdisabledModal(true)}
                    variant="contained"
                    color="error"
                  >
                    غیر فعال کردن کلیه ویژگی های
                  </Button>
                )}
                {userPermissions?.productProperties?.syncAccounting && (
                  <SyncProducts
                    sumbitSearch={sumbitSearch}
                    filter={filter}
                    header={header}
                    data={allData}
                    selectedData={selected}
                    handleReload={() => setRefresh((r) => r + 1)}
                  />
                )}
                {userPermissions?.productProperties?.export && (
                  <Exports
                    sumbitSearch={sumbitSearch}
                    filter={filter}
                    header={header}
                    data={allData}
                    selectedData={selected}
                    title="لیست کالا "
                    api={EXPORT_AALL_PRICES}
                  />
                )}{" "}
                {userPermissions?.productProperties?.editBulkPrices && (
                  <div className="flex flex-col  md:gap-1 gap-2">
                    <span className="text-[#495057] text-xs font-medium mr-5 label">
                      تغییر قیمت به درصد تجمیعی -+
                    </span>{" "}
                    <Box
                      sx={{
                        fieldset: {
                          border: "none !important",
                        },
                      }}
                      className="flex border rounded-[30px] pr-2  h-[3rem]"
                    >
                      <Box
                        component={"input"}
                        type={"number"}
                        sx={{
                          background: (theme) => theme.palette.background.paper,
                        }}
                        className="w-full h-[75%] my-[6px] p-3 border-0  md:max-w-[6rem] "
                        onChange={(e) => setPercent(e.target.value)}
                        value={percent || ""}
                      />
                      <Box
                        sx={{
                          background: (theme) => theme.palette.primary.main,
                        }}
                        onClick={() => setOpenConfirm(true)}
                        display={loading}
                        className="flex cursor-pointer justify-center items-center h-[2.9rem] w-[4rem] rounded-l-[30px] text-white"
                      >
                        {loadingP ? (
                          <>
                            {" "}
                            <CircularProgress />{" "}
                          </>
                        ) : (
                          <>اعمال</>
                        )}
                      </Box>
                    </Box>
                  </div>
                )}
              </div>{" "}
            </div>
          </>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={
            userPermissions?.productProperties?.update
              ? EDIT_ACTIVE_PRODUCT_PROPERTIES
              : false
          }
          title="  لیست کالا ها"
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
            userPermissions?.productProperties?.update
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
          name={"  محصول"}
          maxHeight={{ lg: "69.5vh", md: "68vh", xl: "74vh" }}
          setSort={(e) => {
            setSort({ ...sort, ...e });
            setPage(1);
          }}
          setSelected={setSelected}
          selected={selected}
          currentRow={(data) => {
            setEditingData(data);
          }}
          setRefresh={setRefresh}
        />
        <Modal
          open={disabledModal}
          close={() => {
            setdisabledModal(false);
          }}
          title="آیا از غیر فعال کردن تمام ویژگی های محصولات اطمینان دارید؟"
          autoWidth={true}
        >
          <div className="flex items-center justify-between gap-5">
            <Button onClick={disabledAll} variant="contained" color="primary">
              بله
            </Button>
            <Button
              onClick={() => {
                setdisabledModal(false);
              }}
              variant="outlined"
              color="error"
            >
              انصراف
            </Button>
          </div>
        </Modal>
        <Modal
          open={open}
          close={() => {
            setOpen(false);
          }}
          title=" ورود محصول از اکسل"
          autoWidth={true}
        >
          <div className="flex flex-col items-center justify-between gap-5">
            <Dropdown
              title="  تامین کننده"
              data={supplierData}
              value={supplier}
              change={setSupplier}
            />
            <Uploader
              setFiles={(e) => {
                setFiles(e);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => importCsv()}
              disabled={!files || !supplier}
            >
              ثبت اطلاعات
            </Button>
          </div>
        </Modal>
      </div>
      <EditPrice
        open={openEdit}
        forEdit={true}
        prevData={editingData}
        setAllRows={setAllRows}
        allRows={allRows}
        close={() => {
          setOpenEdit(false);
          setEditingData({});
        }}
      />
      <Confirm
        message={`ایا از تغییر قیمت اطمینان دارید ؟ `}
        close={() => setOpenConfirm(false)}
        submit={handlePrice}
        open={openConfirm}
        loading={loadingP}
      />
    </>
  );
};

export default ProductProperties;
