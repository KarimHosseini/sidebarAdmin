/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import PhonelinkOffIcon from "@mui/icons-material/PhonelinkOff";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, PageTitle, TextInput } from "../../components/common";
import Exports from "../../components/common/export";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Filters from "../../components/filters";
import NoAccess from "../../components/noAccess";
import SyncButton from "../../components/sync";
import {
  ALL_PRODUCTS,
  baseUrl,
  BRANDS,
  CATEGORIES,
  disableAllProducts,
  EDIT_ACTIVE_PRODUCTS,
  EXPORT_ALL_PRODUCTS,
  SYNC_WITH_PAY,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { setBrands, setCategories } from "../../redux/slices/relationals";
import { logout } from "../../redux/slices/user";

const Products = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const navigate = useNavigate();
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [disabledModal, setdisabledModal] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [loadingSync, setLoadingSync] = useState(false);
  const [open, setOpen] = useState(false);
  const [percent, setPercent] = useState(0);
  const [syncNumber, setSyncNumber] = useState(false);

  const [refreshData, setRefresh] = useState(0);
  const [filter, setFilter] = useState([]);

  const [sort, setSort] = useState({});
  const [editingData, setEditingData] = useState({});
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      ALL_PRODUCTS,
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
      `${baseUrl}/${BRANDS}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        if (data.code === 200) {
          dispatch(setBrands(data.data));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  }, []);

  useEffect(() => {
    axiosInstance(
      `${baseUrl}/${CATEGORIES}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;

        if (data.code === 200) {
          dispatch(setCategories(data.data));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  }, []);

  const disabledAll = () => {
    setdisabledModal(true);
    axiosInstance
      .put(`${baseUrl}/${disableAllProducts}`, {}, configReq(token))
      .then((res) => {
        setRefresh((r) => r + 1);
        setdisabledModal(false);
      })
      .catch((err) => {
        setdisabledModal(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const handleSync = () => {
    setLoadingSync(true);
    axiosInstance
      .get(
        `${baseUrl}/${SYNC_WITH_PAY}?priceChangePercent=${
          percent || 0
        }&syncProductCount=${syncNumber}`,
        configReq(token)
      )
      .then((res) => {
        setRefresh((r) => r + 1);
        setPercent(0);
        setLoadingSync(false);
        setOpen(false);
        toast.success("با موفقیت اعمال شد");
      })
      .catch((err) => {
        setLoadingSync(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  if (!userPermissions?.product?.view) {
    return <NoAccess />;
  }

  return (
    <>
      <PageTitle
        title="محصولات"
        broadCrumb={[
          {
            title: "مدیریت محصولات",
            path: "/products",
          },
        ]}
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
              />{" "}
              <div className="flex flex-wrap md:justify-end justify-start items-center gap-3 col-span-4">
                {userPermissions?.product?.insert && (
                  <Button
                    onClick={() => navigate("/products/create")}
                    variant="contained"
                  >
                    <AddIcon />
                    افزودن محصول جدید
                  </Button>
                )}
                {userPermissions?.product?.disableall && (
                  <Button
                    onClick={() => setdisabledModal(true)}
                    variant="contained"
                    color="error"
                  >
                    {" "}
                    <PhonelinkOffIcon /> غیر فعال کردن کلیه محصولات
                  </Button>
                )}
                <SyncButton setRefresh={setRefresh} setting={setting} />
                {userPermissions?.product?.export && (
                  <Exports
                    sumbitSearch={sumbitSearch}
                    filter={filter}
                    header={header}
                    data={allData}
                    selectedData={selected}
                    title="محصولات"
                    api={EXPORT_ALL_PRODUCTS}
                  />
                )}
                {userPermissions?.product?.SyncProducts && (
                  <Button
                    onClick={() => setOpen(true)}
                    variant="contained"
                    disabled={loadingSync}
                  >
                    {loadingSync ? <CircularProgress /> : "سینک با سایت دوم"}
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
            userPermissions?.product?.update ? EDIT_ACTIVE_PRODUCTS : false
          }
          title="  محصولات"
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
            userPermissions?.product?.update || userPermissions?.seoAssign?.view
              ? [
                  userPermissions?.product?.update && {
                    title: "ویرایش",
                    handler: (
                      <IconButton
                        onClick={(rowData) => {
                          const data = rowData?.id ? rowData : editingData;
                          if (data?.isBundle) {
                            toast.error(
                              "    اجازه ویرایش این محصول را در این بخش ندارید "
                            );
                          } else {
                            if (localStorage.getItem("redirectType") === "2") {
                              navigate(`/products/${data.id}`);
                            } else {
                              window.open(
                                `/products/${data.id}`,
                                "_blank"
                              );
                            }
                          }
                        }}
                      >
                        <Edit sx={{ color: "#ff2000" }} />
                      </IconButton>
                    ),
                  },
                  userPermissions?.seoAssign?.view && {
                    title: "seo",
                    handler: (
                      <Button
                        onClick={(rowData) =>
                        {
                          const data = rowData?.id ? rowData : editingData;
                          window.open(
                            `/seoGenrator?id=${data.id}&name=product&slug=${data.slug}`
                          )
                        }}
                        variant="outlined"
                      >
                        ویرایش seo
                      </Button>
                    ),
                  },
                ].filter((item) => item)
              : false
          }
          length={metaData?.total}
          name={"  محصول"}
          maxHeight={{ lg: "69.5vh", md: "68vh", xl: "74vh" }}
          setSort={(e) => {
            setSort({ ...e });

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
          title="آیا از غیر فعال کردن تمام محصولات اطمینان دارید؟"
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
            setPercent(0);
          }}
          title="در صورتی که میخواهید تغییر قیمت داشته باشید درصد را وارد کنید"
          autoWidth={true}
        >
          <TextInput
            currentValue={percent}
            change={(e) => setPercent(e)}
            label="درصد تغییرات قیمت"
          />
          <div className="flex items-center my-5 gap-5">
            <Switch
              checked={syncNumber}
              onClick={() => setSyncNumber(!syncNumber)}
            />
            <span>سینک تعداد محصول</span>
          </div>
          <div className="flex items-center justify-between gap-5">
            <Button
              onClick={handleSync}
              disabled={loadingSync}
              variant="contained"
              color="primary"
            >
              {loadingSync ? <CircularProgress /> : "اعمال تغییرات"}
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                setPercent(0);
              }}
              variant="outlined"
              color="error"
            >
              انصراف
            </Button>
          </div>
          <Alert variant="outlined" severity="info">
            در صورت وارد نکردن عدد درصد ، قیمتها بدون تغییر سینک می گردد.
          </Alert>
        </Modal>
      </div>
    </>
  );
};

export default Products;
