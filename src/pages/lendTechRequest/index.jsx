/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, IconButton, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dropdown, Modal, PageTitle } from "../../components/common";
import Exports from "../../components/common/export";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Filters from "../../components/filters";
import NoAccess from "../../components/noAccess";
import SyncButton from "../../components/sync";
import {
  baseUrl,
  EDIT_ACTIVE_LEND_TECH_REQUEST,
  EXPORT_LEND_TECH_REQUEST,
  GET_LEND_TECH,
  GET_LEND_TECH_REQUEST,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const LendTechRequest = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  const [sort, setSort] = useState({});
  const [editingData, setEditingData] = useState({});
  const [page, setPage] = useState(1);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const navigate = useNavigate();
  const [filter, setFilter] = useState([]);
  const [refreshData, setRefresh] = useState(0);
  const [selected, setSelected] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [lendTechId, setlendTechId] = useState();
  const [allLendTech, setAllLendTech] = useState([]);
  const { token } = useSelector((state) => state.user);

  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_LEND_TECH_REQUEST,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  useEffect(() => {
    getAllBanks();
  }, []);
  const getAllBanks = () => {
    axiosInstance
      .get(
        `${baseUrl}/${GET_LEND_TECH}?Page=1&Limit=10000`,

        configReq(token)
      )
      .then((res) => {
        setAllLendTech(res.data.data);
      })
      .catch((err) => {});
  };
  if (!userPermissions?.lendTechRequest?.view) {
    return <NoAccess />;
  }

  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "  تسهیلات",
            path: "/facilites",
          },
        ]}
        title=" درخواست تسهیلات لنتک"
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          <Box className="flex md:gap-4 gap-1 flex-wrap justify-between">
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
              {userPermissions?.lendTechRequest?.export && (
                <Exports
                  sumbitSearch={sumbitSearch}
                  filter={filter}
                  header={header}
                  data={allData}
                  selectedData={selected}
                  title="تسهیلات لنتک"
                  api={EXPORT_LEND_TECH_REQUEST}
                />
              )}

              {userPermissions?.lendTechRequest?.update && (
                <Button onClick={() => setOpenCreate(true)} variant="contained">
                  <AddIcon />
                  افزودن تسهیلات لنتک جدید
                </Button>
              )}
            </div>
          </Box>
        </Paper>
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={
            userPermissions?.lendTechRequest?.update
              ? EDIT_ACTIVE_LEND_TECH_REQUEST
              : false
          }
          title="  درخواست تسهیلات لنتک"
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
            userPermissions?.lendTechRequest?.update
              ? [
                  {
                    title: "ویرایش",
                    handler: (
                      <>
                        <IconButton
                          onClick={() => {
                            if (localStorage.getItem("redirectType") === "2") {
                              navigate(`/plan-loan/${editingData?.id}`);
                            } else {
                              window.open(
                                `/plan-loan/${editingData?.id}`,
                                "_blank"
                              );
                            }
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
          name={"تسهیلات لنتک"}
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
        <Modal
          open={openCreate}
          close={() => {
            setOpenCreate(false);
            setlendTechId();
          }}
          title={`ابتدا طرح مورد نظر را انتخاب کنید`}
        >
          {" "}
          <Dropdown
            value={allLendTech?.find((item) => item.id === lendTechId)}
            change={(e) => setlendTechId(e.id)}
            data={allLendTech}
            title="   لنتک ها"
          />
          <Button
            disabled={!lendTechId}
            onClick={() => navigate(`/lendTechRequest/create?li=${lendTechId}`)}
            variant="contained"
          >
            تایید و ادامه
          </Button>
        </Modal>
      </div>
    </>
  );
};

export default LendTechRequest;
