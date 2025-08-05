/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Paper } from "@mui/material";

import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, PageTitle } from "../../../components/common";
import Exports from "../../../components/common/export";
import Uploader from "../../../components/common/uploader";
import CustomeLayout from "../../../components/customeTable";
import DataFetcher from "../../../components/dataFetch";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import Filters from "../../../components/filters";
import NoAccess from "../../../components/noAccess";
import {
  ALL_USERS,
  baseUrl,
  COMPANY_IMPORT_USER,
  COMPANY_IMPORT_USER_BY_ID,
  COMPANY_REMOVE_USER_BY_ID,
  EXPORT_ALL_USERS,
  GET_COMPANY_SINGLE,
  importPrices,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import AddUsersCompany from "./addUser";
import DeleteUsers from "./deleteUser";
import SyncButton from "../../../components/sync";
const UsersCompany = () => {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalNewUser, setOpenModalNewUser] = useState(false);
  const [openModalRemoveUser, setOpenModalRemoveUser] = useState(false);

  const [files, setFiles] = useState();

  const [editingData, setEditingData] = useState({});
  const { userPermissions } = useSelector((state) => state.relationals);

  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const { id } = useParams();
  const [data, setData] = useState({});

  const [refreshData, setRefresh] = useState(0);
  const [filter, setFilter] = useState([]);
  const [filterApplied, setFilterApplied] = useState([]);
  const [sort, setSort] = useState({});
  const [allRows, setAllRows] = useState([]);
  const { token } = useSelector((state) => state.user);

  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      ALL_USERS,
      filterApplied,
      true,
      refreshData,
      sumbitSearch
    );
  useLayoutEffect(() => {
    var temp = filter;
    if (!filter.find((fil) => fil.name === "companyId")) {
      temp.push({
        name: "companyId",
        value: id,
        type: "eq",
      });
    }

    setFilterApplied(temp);
  }, [filter, id]);
  const getData = () => {
    axiosInstance
      .get(`${baseUrl}/${GET_COMPANY_SINGLE}?id=${id}`, configReq(token))
      .then((res) => {
        setData(res?.data?.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };
  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  const importCsv = () => {
    const formData = new FormData();
    formData.append("companyId", id);
    formData.append("files", files);
    axiosInstance
      .post(`${baseUrl}/${COMPANY_IMPORT_USER}`, formData, configReq(token))
      .then((res) => {
        setRefresh((r) => r + 1);
        setOpenModal(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };
  const setNewUser = (ids) => {
    const formData = new FormData();
    formData.append("companyId", id);
    formData.append("users", ids);
    axiosInstance
      .post(
        `${baseUrl}/${COMPANY_IMPORT_USER_BY_ID}`,
        formData,
        configReq(token)
      )
      .then((res) => {
        setRefresh((r) => r + 1);
        setOpenModalNewUser(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };
  const setDeleteUser = (ids) => {
    const formData = new FormData();
    formData.append("companyId", id);
    formData.append("users", ids);
    axiosInstance
      .post(
        `${baseUrl}/${COMPANY_REMOVE_USER_BY_ID}`,
        formData,
        configReq(token)
      )
      .then((res) => {
        setRefresh((r) => r + 1);
        setOpenModalRemoveUser(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };
  if (!userPermissions?.user?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        title={" کابران سازمان " + (data?.title ? data?.title : "")}
        broadCrumb={[
          {
            title: "    باشگاه مشتریان",
            path: "/discounts",
          },
          {
            title: "سازمان",
            path: "/company",
          },
        ]}
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          <>
            <div className="flex md:gap-4 gap-1 flex-wrap justify-end">
              {/*     <Filters
                limit={limit}
                setLimit={setLimit}
                headers={header}
                setFilter={setFilter}
                filter={filter}
                setPage={setPage}
                loading={loading}
              /> */}
              <div className="flex items-center gap-4 col-span-4 justify-end">
                <Button
                  onClick={() => setOpenModalRemoveUser(true)}
                  variant="outlined"
                  color="error"
                >
                  حذف اعضا
                </Button>
                <Button onClick={() => setOpenModal(true)} variant="outlined">
                  ورود از اکسل
                </Button>
                <Button
                  onClick={() => setOpenModalNewUser(true)}
                  variant="contained"
                >
                  ثبت عضو جدید
                </Button>
                <SyncButton setRefresh={setRefresh} setting={setting} />
                {userPermissions?.user?.export && (
                  <Exports
                    sumbitSearch={sumbitSearch}
                    filter={filter}
                    header={header}
                    data={allData}
                    selectedData={selected}
                    title="اعضا"
                    api={EXPORT_ALL_USERS}
                    param={`&filter[0][key]=companyId&filter[0][value]=${id}&filter[0][operator]=eq`}
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
          editApi={false}
          title={"  اعضا "  + data?.title}
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
          actions={false}
          length={metaData?.total}
          name={"  کاربر"}
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
        />
      </div>
      <Modal
        open={openModal}
        close={() => {
          setOpenModal(false);
        }}
        title=" ورود کاربر از اکسل"
        autoWidth={true}
      >
        <div className="flex flex-col items-center justify-between gap-5">
          <Uploader
            setFiles={(e) => {
              setFiles(e);
            }}
          />
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
      <Modal
        open={openModalNewUser}
        close={() => {
          setOpenModalNewUser(false);
        }}
        title=" کاربران مورد نظر جهت افزودن را انتخاب کنید "
        autoWidth={true}
      >
        <div>
          <AddUsersCompany setIds={(e) => setNewUser(e)} />
        </div>
      </Modal>
      <Modal
        open={openModalRemoveUser}
        close={() => {
          setOpenModalRemoveUser(false);
        }}
        title=" کاربران مورد نظر جهت حذف را انتخاب کنید "
        autoWidth={true}
      >
        <div>
          <DeleteUsers setIds={(e) => setDeleteUser(e)} />
        </div>
      </Modal>
    </>
  );
};

export default UsersCompany;
