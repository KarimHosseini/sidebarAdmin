/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
  BRANDS,
  CATEGORIES,
  disableAllProducts,
  EDIT_ACTIVE_BUNDLE_PRODUCT,
  EXPORT_BUNDLE_PRODUCT,
  GET_BUNDLE_PRODUCT,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { setBrands, setCategories } from "../../redux/slices/relationals";
import { logout } from "../../redux/slices/user";

const ProductsGroup = () => {
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

  const [refreshData, setRefresh] = useState(0);
  const [filter, setFilter] = useState([]);

  const [sort, setSort] = useState({});
  const [editingData, setEditingData] = useState({});
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_BUNDLE_PRODUCT,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  const [allRows, setAllRows] = useState([]);
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);



  if (!userPermissions?.bundle?.view) {
    return <NoAccess />;
  }

  return (
    <>
      <PageTitle
        title=" محصولات تجمیعی"
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
                {userPermissions?.bundle?.insert && (
                  <Button
                    onClick={() => navigate("/groupProduct/create")}
                    variant="contained"
                  >
                    <AddIcon />
                    افزودن محصول تجمیعی جدید
                  </Button>
                )}
                {/*               {userPermissions?.bundle?.disableall && (
                  <Button
                    onClick={() => setdisabledModal(true)}
                    variant="contained"
                    color="error"
                  >
                    {" "}
                    <PhonelinkOffIcon /> غیر فعال کردن کلیه محصولات
                  </Button>
                )} */}
                <SyncButton setRefresh={setRefresh} setting={setting} />
                {userPermissions?.bundle?.export && (
                  <Exports
                    sumbitSearch={sumbitSearch}
                    filter={filter}
                    header={header}
                    data={allData}
                    selectedData={selected}
                    title="محصولات تجمیعی"
                    api={EXPORT_BUNDLE_PRODUCT}
                  />
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
            userPermissions?.bundle?.update ? EDIT_ACTIVE_BUNDLE_PRODUCT : false
          }
          title="   محصولات تجمیعی"
          headers={header}
          setSearch={setsearch}
          search={search}
          page={page}
          total_pages={metaData?.total_pages}
          setApplySearch={(e) => {
            setPage(1);
            setSumbitSearch(e);
          }}
          rows={allRows}
          hasMore={hasMore}
          loading={loading}
          setPage={setPage}
          setting={setting}
          CurrentPage={CurrentPage}
          actions={[
            userPermissions?.bundle?.update && {
              title: "ویرایش",
              handler: (
                <Link to={`/groupProduct/${editingData?.id}`} target="_blank">
                  <IconButton>
                    <Edit sx={{ color: "#ff2000" }} />
                  </IconButton>
                </Link>
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
          ].filter((item) => item)}
          length={/* metaData?.total */ 0}
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
        {/*         <Modal
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
        </Modal> */}
      </div>
    </>
  );
};

export default ProductsGroup;
