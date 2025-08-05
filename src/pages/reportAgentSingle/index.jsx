/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PageTitle } from "../../components/common";
import Exports from "../../components/common/export";
import CustomeLayout from "../../components/customeTable";
import DataFetcher from "../../components/dataFetch";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Filters from "../../components/filters";
import {
  baseUrl,
  EXPORT_AGENT_TURNOVER_SINGLE,
  GET_AGENT_TURNOVER_SINGLE,
  GET_CHILD_FACILITIES,
  SINGLE_USER,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import WalletAgentModal from "../reportAgentTurnover/modal";

const SingleLoanAgentTurnover = () => {
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [editingData, setEditingData] = useState({});
  const { userPermissions } = useSelector((state) => state.relationals);
  const [selected, setSelected] = useState([]);
  const [refreshData, setRefresh] = useState(0);
  const [userData, setUserData] = useState();
  const [allRows, setAllRows] = useState([]);
  const [type, setType] = useState(0);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(100);
  const { id } = useParams();
  const [filter, setFilter] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [sort, setSort] = useState({});
  const { token } = useSelector((state) => state.user);
  const [openModal, setOpenModal] = useState(false);
  const [facility, setFacility] = useState([]);

  const {
    hasMore,
    loading,
    allData,
    CurrentPage,
    metaData,
    header,
    setting,
    extraObject,
  } = DataFetcher(
    limit,
    page,
    sort,
    GET_AGENT_TURNOVER_SINGLE,
    filter,
    true,
    refreshData,
    sumbitSearch,
    1,
    {
      name: "agentId",
      value: id,
    }
  );
  useEffect(() => {
    var temp = 0;
    selected.map((item) => (temp += item.finalAmount));
    setSelectedPrice(temp);
  }, [selected]);
  useEffect(() => {
    axiosInstance(`${baseUrl}/${SINGLE_USER}?id=${id}`, configReq(token))
      .then((res) => {
        const { data } = res;
        if (data && data.code === 200 && data.data) {
          setUserData(data.data);
        }
      })
      .catch((err) => {});
  }, [id]);

  useEffect(() => {
    axiosInstance
      .get(`${baseUrl}/${GET_CHILD_FACILITIES}`, configReq(token))
      .then((res) => {
        var temp = [];

        res.data.data
          .filter((item) => item.children?.length > 0)
          .map((item) => {
            temp.push({
              title: `↓ - ${item.title} - ↓ `,
              id: -1,
              disabled: true,
            });
            item.children.map((ch) => {
              temp.push({ title: ch.title, id: ch.id });
            });
          });
        setFacility(temp);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  }, []);
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  const handleSetSelected = (e) => {
    const newSelected = [...e];

    const facilityIds = newSelected.map((item) => item.facilityId);

    const allSameFacility = facilityIds.every((id) => id === facilityIds[0]);

    if (allSameFacility) {
      setSelected(newSelected);
    } else {
      toast.error("جهت تسویه فقط تسهیلات های یکسان را می توانید انتخاب کنید ");
    }
  };
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: " گزارش",
            path: "/reports",
          },
          {
            title: " گزارش تسویه نماینده",
            path: "/AgentSummary",
          },
        ]}
        title="    گزارش  مالی  نماینده"
      />
      {/*     <div className="flex justify-end w-full md:px-3 mx-1 mb-3">
        <Link to="/AgentSummary">
          <Button variant="contained">بازگشت</Button>
        </Link> 
      </div> */}
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
                {" "}
                {selected.length > 0 ? (
                  <div className="flex gap-1 items-center border-l pl-2 ">
                    <span> جمع موارد انتخابی :‌</span>
                    <span className="font-bold">
                      {selectedPrice?.toLocaleString()}
                    </span>
                    تومان
                  </div>
                ) : (
                  <></>
                )}
                <> </>
                {extraObject ? (
                  <>
                    {" "}
                    {/*        <div className="flex gap-1 items-center">
                      <span> جمع اعتبار کیف پول :‌</span>
                      <span className="font-bold">
                        {extraObject?.sumOfAll?.toLocaleString()}
                      </span>
                      تومان
                    </div> */}
                    {extraObject?.lastClearedDate && (
                      <div className="flex gap-1 items-center">
                        <span> تاریخ اخرین تسویه:‌</span>
                        <span className="font-bold">
                          {new Date(
                            extraObject?.lastClearedDate
                          )?.toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <></>
                )}{" "}
                {selected.length > 0 &&
                userPermissions?.walletPaymentRefund?.insert ? (
                  <Button
                    onClick={() => {
                      setType(1);
                      setOpenModal(selectedPrice);
                    }}
                    variant="outlined"
                  >
                    تسویه موارد انتخاب شده
                  </Button>
                ) : (
                  <></>
                )}
                {/*     {userPermissions?.walletPaymentRefund?.insert && (
                  <Button
                 onClick={() => {
                      getAll();
                    }}
                    disabled={loadingData}
                    variant="outlined"
                  >
                    {loadingData ? <CircularProgress /> : <> تسویه کل</>}
                  </Button>
                )} */}
                {userPermissions?.singleLoanAgentTurnover.export && (
                  <Exports
                    sumbitSearch={sumbitSearch}
                    filter={filter}
                    header={header}
                    data={allData}
                    selectedData={selected}
                    title=" گزارش  مالی "
                    api={EXPORT_AGENT_TURNOVER_SINGLE}
                    extraParams={{ name: "agentId", value: id }}
                  />
                )}
              </div>
            </div>
          </>
        </Paper>
        <CustomeLayout
          limit={limit}
          justForceDisabled={true}
          setLimit={setLimit}
          /*           setAllRows={setAllRows}
          editApi={EDIT_PRODUCTS} */
          title={"  گزارش  مالی  " + searchParams.get("name")}
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
          /*          actions={[
            {
              title: "استعلام  بانک",
              handler: (
                <>
                  <IconButton onClick={() => setOpen()}>
                    <RemoveRedEyeOutlinedIcon color="primary" />
                  </IconButton>
                </>
              ),
            },
          ]} */
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
          setSelected={(e) => {
            handleSetSelected(e);
          }}
          selected={selected}
        />
      </div>
      <WalletAgentModal
        open={openModal}
        prevData={editingData}
        value={userData}
        setAllRows={setAllRows}
        allRows={allRows}
        selected={selected}
        price={openModal}
        close={() => {
          setOpenModal(false);
          setEditingData({});
          setSelected([]);
        }}
        setRefresh={setRefresh}
        facility={facility}
        setFacilityId
      />
    </>
  );
};

export default SingleLoanAgentTurnover;
