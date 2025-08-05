/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PageTitle } from "../../../components/common";
import CustomeLayout from "../../../components/customeTable";
import DataFetcher from "../../../components/dataFetch";
import Filters from "../../../components/filters";
import NoAccess from "../../../components/noAccess";
import { ALL_USERS } from "../../../helpers/api-routes";
const Users = ({
  selected,
  setSelected,
  setData,
  data,
  filter,
  setFilter,
  sort,
  setSort,
}) => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [refreshData, setRefresh] = useState(0);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [allRows, setAllRows] = useState([]);
  const [editingData, setEditingData] = useState({});

  const [actions, setActions] = useState([]);

  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      ALL_USERS,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  if (!userPermissions?.user?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <>
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
          className="relative"
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
                withDefualtValue={true}
              />
              <div className="flex items-center gap-4 col-span-4 justify-end">
                <FormControlLabel
                  sx={{
                    border: (theme) =>
                      theme.palette.mode === "light"
                        ? "1px solid rgba(0, 0, 0, 0.23)"
                        : "1px solid rgba(55, 255, 255, 0.23)",
                    borderRadius: "4px",
                    height: "3.07rem",
                    marginLeft: "0px !important",
                    marginRight: "0px !important",
                    width: "100%",
                    paddingRight: "10px",
                  }}
                  control={<Checkbox checked={data?.allUsers} />}
                  onChange={(e) => {
                    setData({
                      ...data,
                      allUsers: !data?.allUsers,
                    });
                  }}
                  label={
                    <Typography
                      sx={{
                        color: (theme) =>
                          theme.palette.mode === "light"
                            ? "rgba(0, 0, 0, 0.6)"
                            : "rgba(255, 255, 255, 0.7)",
                        fontSize: { md: "0.75rem !important" },
                        fontWeight: "400 !important",
                      }}
                    >
                      اعمال بر روی همه کاربران
                    </Typography>
                  }
                />
              </div>
            </div>
          </>
        </Paper>
        <div className="relative">
          {" "}
          {data?.allUsers ? (
            <div className="absolute z-20 cursor-not-allowed bg-gray-100 opacity-40 w-full h-full top-0 right-0"></div>
          ) : (
            <div></div>
          )}{" "}
          <CustomeLayout
            limit={limit}
            setLimit={setLimit}
            setAllRows={setAllRows}
            editApi={false}
            title="  کاربران"
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
            selected={selected || []}
          />
        </div>
      </>
    </>
  );
};

export default Users;
