/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
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
  EDIT_ACTIVE_CATEGORY_INSURANCE,
  EXPORT_CATEGORY_INSURANCE,
  GET_CATEGORY_INSURANCE,
  GET_INSURANCE,
  TYPES_CATEGORY_INSURANCE,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import CategoryInsuranceForceModal from "./forceModal";
import CategoryInsuranceModal from "./modal";
const CategoryInsurance = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [searchParams, setSearchParams] = useSearchParams();

  // modals
  const [openCreate, setOpenCreate] = useState(false);
  const [openForce, setOpenForce] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [refreshData, setRefresh] = useState(0);
  const [editingData, setEditingData] = useState({});
  const [page, setPage] = useState(1);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [filter, setFilter] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [gateWays, setGateWays] = useState([]);
  const [types, setTypes] = useState([]);
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();
  const [sort, setSort] = useState({});
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_CATEGORY_INSURANCE,
      filter,
      true,
      refreshData,
      sumbitSearch,
      1,
      {
        name: "categoryId",
        value: id,
      }
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
        `${baseUrl}/${GET_INSURANCE}?Page=1&Limit=10000&filter[0][key]=active&filter[0][value]=true&filter[0][operator]=e`,

        configReq(token)
      )
      .then((res) => {
        setGateWays(res.data.data);
      })
      .catch((err) => {});
    axiosInstance
      .get(
        `${baseUrl}/${TYPES_CATEGORY_INSURANCE}?Page=1&Limit=10000`,

        configReq(token)
      )
      .then((res) => {
        setTypes(res.data.data);
      })
      .catch((err) => {});
  };
  if (!userPermissions?.categoryInsurance?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "مدیریت محصولات",
            path: "/products",
          },
          {
            title: "دسته بندی ها",
            path: "/categories",
          },
        ]}
        title={"   دسته بندی   خدمات " + searchParams.get("title")}
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          {" "}
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
              {userPermissions?.categoryInsurance?.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title={"  دسته بندی  خدمات" + searchParams.get("title")}
                  api={EXPORT_CATEGORY_INSURANCE}
                  extraParams={{ name: "categoryId", value: id }}
                />
              )}

              {userPermissions?.categoryInsurance?.insert && (
                <>
                  <Button
                    onClick={() => setOpenForce(true)}
                    variant="contained"
                    color="secondary"
                  >
                    انتخاب خدمات اجباری
                  </Button>
                  <Button
                    onClick={() => setOpenCreate(true)}
                    variant="contained"
                  >
                    <AddIcon />
                    افزودن خدمات دسته بندی {searchParams.get("title")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={
            userPermissions?.categoryInsurance?.update
              ? EDIT_ACTIVE_CATEGORY_INSURANCE
              : false
          }
          title={"  دسته بندی   خدمات " + searchParams.get("title")}
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
            userPermissions?.categoryInsurance?.update
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
          name={"دسته بندی "}
          maxHeight={{ lg: "69.5vh", md: "68vh", xl: "74vh" }}
          setSelected={setSelected}
          selected={selected}
          setSort={(e) => {
            setPage(1);
            setSort({ ...sort, ...e });
          }}
          currentRow={(data) => {
            setEditingData(data);
          }}
          setRefresh={setRefresh}
        />
      </div>
      <CategoryInsuranceModal
        open={openEdit || openCreate}
        forEdit={openEdit}
        setAllRows={setAllRows}
        allRows={allRows}
        prevData={editingData}
        close={() => {
          setOpenCreate(false);
          setOpenEdit(false);
          setEditingData({});
        }}
        GATES={gateWays}
        TYPES={types}
      />
      <CategoryInsuranceForceModal
        prevData={allRows}
        open={openForce}
        reset={() => setRefresh((r) => r + 1)}
        close={() => setOpenForce(false)}
      />
    </>
  );
};

export default CategoryInsurance;
