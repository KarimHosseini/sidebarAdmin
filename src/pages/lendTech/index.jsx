/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
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
  baseUrl,
  EDIT_ACTIVE_LEND_TECH_DOCUMENT,
  EXPORT_LEND_TECH,
  GET_BANK,
  GET_LEND_TECH,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import LendTechModal from "./modal";
const LendTech = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [refreshData, setRefresh] = useState(0);
  const navigate = useNavigate();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [editingData, setEditingData] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState({});
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const { token } = useSelector((state) => state.user);

  const [limit, setLimit] = useState(20);
  const [allRows, setAllRows] = useState([]);
  const [allBanks, setAllBanks] = useState([]);
  const [selected, setSelected] = useState([]);
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_LEND_TECH,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    getAllBanks();
  }, []);
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  const getAllBanks = () => {
    axiosInstance
      .get(
        `${baseUrl}/${GET_BANK}?Page=1&Limit=10000`,

        configReq(token)
      )
      .then((res) => {
        setAllBanks(res.data.data);
      })
      .catch((err) => {});
  };
  if (!userPermissions?.lendTech?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <>
        {" "}
        <PageTitle
          broadCrumb={[
            {
              title: "  مدیریت تسهیلات",
              path: "/plan-loan",
            },
          ]}
          title="  لنتک "
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
              />{" "}
              <div className="flex justify-end flex-wrap gap-4 items-center">
                <SyncButton setRefresh={setRefresh} setting={setting} />
                {userPermissions?.lendTech?.export && (
                  <Exports
                    sumbitSearch={sumbitSearch}
                    filter={filter}
                    header={header}
                    data={allData}
                    selectedData={selected}
                    title="  لنتک"
                    api={EXPORT_LEND_TECH}
                  />
                )}

                {userPermissions?.lendTech?.insert && (
                  <Button
                    onClick={() => setOpenCreate(true)}
                    variant="contained"
                  >
                    <AddIcon />
                    افزودن لنتک جدید
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
              userPermissions?.lendTech?.update
                ? EDIT_ACTIVE_LEND_TECH_DOCUMENT
                : false
            }
            title="  لنتک"
            headers={header}
            setSearch={setsearch}
            search={search}
            setApplySearch={(e) => {
              setPage(1);
              setSumbitSearch(e);
              /* setFilter({ ...filter, search: { value: e, type: "lk" } }); */
            }}
            rows={allRows}
            hasMore={hasMore}
            loading={loading}
            setPage={setPage}
            CurrentPage={CurrentPage}
            actions={
              userPermissions?.lendTech?.update
                ? [
                    {
                      title: " مراحل",
                      handler: (
                        <>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              navigate(
                                `/lendTech/${editingData?.id}?name=${editingData.title}`
                              );
                            }}
                          >
                            مشاهده
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
            name={" دسترسی"}
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
          />

          <LendTechModal
            open={openEdit || openCreate}
            forEdit={openEdit}
            prevData={editingData}
            setAllRows={setAllRows}
            allRows={allRows}
            allBanks={allBanks}
            close={() => {
              setOpenCreate(false);
              setOpenEdit(false);
              setEditingData({});
            }}
          />
        </div>
      </>
    </>
  );
};

export default LendTech;
