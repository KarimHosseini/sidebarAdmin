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
import Filters from "../../components/filters";
import NoAccess from "../../components/noAccess";
import SyncButton from "../../components/sync";
import {
  EDIT_ACTIVE_FACILITIES,
  EXPORT_FACILITIES,
  GET_FACILITIES,
} from "../../helpers/api-routes";
const FacilitySetting = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [searchParams, setSearchParams] = useSearchParams();

  // modals
  const [openCreate, setOpenCreate] = useState(false);
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
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();
  const [sort, setSort] = useState({});
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_FACILITIES,
      filter,
      true,
      refreshData,
      sumbitSearch,
      1,
      {
        name: "parentId",
        value: id,
      }
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);

  if (!userPermissions?.LoanSettings?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "  تسهیلات",
            path: "/facilitySetting",
          },
          {
            title: "   تنظیمات تسهیلات ",
            path: "/facilitySetting",
          },
        ]}
        title={"  تسهیلات  " + searchParams.get("title")}
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
              {userPermissions?.LoanSettings?.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title={"  تسهیلات " + searchParams.get("title")}
                  api={EXPORT_FACILITIES}
                  extraParams={{ name: "parentId", value: id }}
                />
              )}

              {userPermissions?.LoanSettings?.add && (
                <Button
                  onClick={(rowData) => {
                    window.open(
                      `/facilitySetting/${id}/form?title=${searchParams.get(
                        "title"
                      )}`
                    );
                  }}
                  variant="contained"
                >
                  <AddIcon />
                  افزودن تسهیلات {searchParams.get("title")}
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
            userPermissions?.LoanSettings?.update
              ? EDIT_ACTIVE_FACILITIES
              : false
          }
          title={"  تسهیلات  " + searchParams.get("title")}
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
            userPermissions?.LoanSettings?.edit
              ? [
                  {
                    title: "ویرایش",
                    handler: (
                      <>
                        <IconButton
                          onClick={(rowData) => {
                            const data = rowData?.id ? rowData : editingData;
                            window.open(
                              `/facilitySetting/${id}/form/${
                                data.id
                              }?title=${searchParams.get("title")}`
                            );
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
          name={"تسهیلات"}
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
    </>
  );
};

export default FacilitySetting;
