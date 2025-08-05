import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../components/common";
import Exports from "../../components/common/export";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Filters from "../../components/filters";
import NoAccess from "../../components/noAccess";
import SyncButton from "../../components/sync";

import {
  ALL_SHIPPING_COMPANIES,
  ALL_SHIPPINGCLASS,
  baseUrl,
  DELETE_SHIPPING_ALL_COMPANY,
  EDIT_ACTIVE_ALL_SHIPPING_COMPANY,
  EDIT_ACTIVE_SHIPPING_COMPANY,
  EXPORT_ALL_SHIPPING_COMPANIES,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const ShippingComapanies = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [selected, setSelected] = useState([]);
  const { token } = useSelector((state) => state.user);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const navigate = useNavigate();
  const [editingData, setEditingData] = useState({});
  const [page, setPage] = useState(1);
  const [refreshData, setRefresh] = useState(0);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [filter, setFilter] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [allShippingClass, setAllShippingClass] = useState([]);

  const [sort, setSort] = useState({});
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      ALL_SHIPPING_COMPANIES,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  useEffect(() => {
    getAllGateWays();
  }, []);
  const getAllGateWays = () => {
    axiosInstance
      .get(
        `${baseUrl}/${ALL_SHIPPINGCLASS}?Page=1&Limit=10000`,

        configReq(token)
      )
      .then((res) => {
        const temp = [];
        res.data.data
          .filter((it) => it.active)
          .map((item) => {
            temp.push({ ...item, title: item.name });
          });
        setAllShippingClass(temp);
      })
      .catch((err) => {});
  };
  if (!userPermissions?.shippingCompany?.view) {
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
        ]}
        title="شرکتهای حمل"
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
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
            <div className="flex justify-end flex-wrap gap-4 items-center">
              <SyncButton setRefresh={setRefresh} setting={setting} />
              {userPermissions?.shippingCompany.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title="شرکتهای حمل"
                  api={EXPORT_ALL_SHIPPING_COMPANIES}
                />
              )}

              {userPermissions?.shippingCompany?.insert && (
                <Button
                  onClick={() => navigate(`/shipping-companies-items`)}
                  variant="contained"
                >
                  <AddIcon />
                  افزودن شرکت جدید
                </Button>
              )}
            </div>
          </div>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={
            userPermissions?.shippingCompany?.update
              ? EDIT_ACTIVE_SHIPPING_COMPANY
              : false
          }
          title=" شرکتهای حمل"
          headers={header}
          setSearch={setsearch}
          search={search}
          page={page}
          total_pages={metaData?.total_pages}
          setApplySearch={(e) => {
            setPage(1);
            setSumbitSearch(e);
            /* setFilter({ ...filter, search: { value: e, type: "lk" } }); */
          }}
          rows={allRows}
          hasMore={hasMore}
          loading={loading}
          setPage={setPage}
          setting={setting}
          CurrentPage={CurrentPage}
          actions={
            userPermissions?.shippingCompany?.update
              ? [
                  userPermissions?.shippingCost?.view && {
                    title: "مشاهده",
                    handler: (
                      <>
                        <Button
                          variant="outlined"
                          onClick={(rowData) => {
                            const data = rowData?.id ? rowData : editingData;
                            window.open(
                              `/shipping-companies/${data.id}?title=${data.title}`
                            );
                          }}
                        >
                          مشاهده هزینه های ارسال
                        </Button>
                      </>
                    ),
                  },
                  userPermissions?.shippingPeriod?.view && {
                    title: "بازه ارسال",
                    handler: (
                      <>
                        <Button
                          variant="outlined"
                          disabled={!userPermissions?.shippingPeriod?.view}
                          onClick={(rowData) => {
                            const data = rowData?.id ? rowData : editingData;
                            window.open(
                              `/shipping-companies/period/${data.id}?name=${data.title}`
                            );
                          }}
                        >
                          مشاهده بازه زمانی
                        </Button>
                      </>
                    ),
                  },
                  userPermissions?.shippingCompanyHoliday?.view && {
                    title: "روز های تعطیلی",
                    handler: (
                      <>
                        <Button
                          variant="outlined"
                          disabled={
                            !userPermissions?.shippingCompanyHoliday?.view
                          }
                          onClick={(rowData) => {
                            const data = rowData?.id ? rowData : editingData;
                            window.open(
                              `/shippingCompanyHoliday/${data.id}?name=${data.title}`
                            );
                          }}
                        >
                          مشاهده روز های تعطیلی فعال
                        </Button>
                      </>
                    ),
                  },
                  {
                    title: "ویرایش",
                    handler: (
                      <>
                        <IconButton
                          onClick={() => {
                            window.open(
                              `/shipping-companies-items/${editingData.id}`
                            );
                          }}
                        >
                          <Edit sx={{ color: "#ff2000" }} />
                        </IconButton>
                      </>
                    ),
                  },
                ].filter((it) => it)
              : false
          }
          length={metaData?.total}
          name={"شرکت"}
          maxHeight={{ lg: "69.5vh", md: "68vh", xl: "74vh" }}
          setSort={(e) => {
            setPage(1);
            setSort({ ...sort, ...e });
          }}
          currentRow={(data) => {
            setEditingData(data);
          }}
          setSelected={setSelected}
          selected={selected}
          setRefresh={setRefresh}
          deleteAllApi={
            userPermissions?.shippingCompany?.deleteAll
              ? DELETE_SHIPPING_ALL_COMPANY
              : null
          }
          editActiveAllApi={
            userPermissions?.shippingCompany?.activeAll
              ? EDIT_ACTIVE_ALL_SHIPPING_COMPANY
              : null
          }
        />
      </div>
    </>
  );
};

export default ShippingComapanies;
