import { Paper, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  ALL_PRODUCTS,
  baseUrl,
  DELETE_SHOWCASE_IMAGE,
  GET_BLOG,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import CustomeLayout from "../../customeTable";
import DataFetcher from "../../dataFetch";
import axiosInstance from "../../dataFetch/axiosInstance";
import Filters from "../../filters";
import ImageContent from "./imageContent";

const StepContent = ({
  selected,
  setSelected,
  data,
  filter,
  setFilter,
  sort,
  setSort,
  valueTab,
  setValueTab,
  setAllProducts,
  forEdit,
  banner,
  setBanner,
}) => {
  const [editingData, setEditingData] = useState({});
  const [page, setPage] = useState(1);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [changedTab, setChangedTab] = useState(false);
  const [refreshData, setRefresh] = useState(0);
  const { token } = useSelector((state) => state.user);
  const handleChange = (event, newValue) => {
    setValueTab(newValue);
    setChangedTab(true);
  };
  const [allRows, setAllRows] = useState([]);
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,

      data?.filter?.id === "2" ? ALL_PRODUCTS : GET_BLOG,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  useEffect(() => {
    setAllProducts(allData);
  }, [allData]);
  useEffect(() => {
    if (changedTab) {
      setSelected([]);
      setFilter([]);
      setSumbitSearch("");
      setsearch("");
      setPage(1);
      setSort({});
    }
  }, [valueTab]);
  return (
    <>
      {data?.viewType?.id === 1 && (
        <div className="flex gap-3 mt-4">
          <Paper
            sx={{
              border: "1px solid #dbdfea",
              mb: 1,
              padding: "25px 16px 15px 16px",
            }}
            elevation={0}
            className="grid md:grid-cols-3 gap-3 relative"
          >
            <div className="bg-[#673AB7] text-white flex justify-center items-center px-4 py-2 absolute -top-5 right-3 text-sm">
              تنظیمات بنر
            </div>
            <div className="col-span-3 md:w-[200px]">
              {" "}
              <ImageContent
                data={banner.find((item) => item.screenSize === 1200)}
                index={0}
                setData={(e) => {
                  var temp = [...banner];
                  const index =
                    banner.findIndex((item) => item.screenSize === 1200) !== -1;
                  if (index) {
                    temp[index] = { ...e, screenSize: 1200 };
                  } else {
                    temp.push({ ...e, screenSize: 1200 });
                  }

                  setBanner(temp);
                }}
                forEdit={forEdit}
                deleteHandler={() => {
                  if (forEdit) {
                    const img = banner.find((item) => item.screenSize === 1200);

                    axiosInstance
                      .delete(
                        `${baseUrl}/${DELETE_SHOWCASE_IMAGE}?id=${img.id}`,
                        configReq(token)
                      )
                      .then((res) => {
                        var temp = [...banner];
                        temp = temp.filter((tmp) => tmp?.id !== img?.id);
                        setBanner(temp);
                        if (data.code === 200) {
                          toast.success("با موفقیت حذف شد");
                        }
                      })
                      .catch((err) => {
                        toast.error(err.response?.data?.message);
                      });
                  } else {
                    var temp = [...banner];
                    temp = temp.filter((tmp) => tmp?.id !== banner?.id);
                    setBanner(temp);
                  }
                }}
              />
            </div>
          </Paper>{" "}
          <Paper
            sx={{
              border: "1px solid #dbdfea",
              mb: 1,
              padding: "25px 16px 15px 16px",
            }}
            elevation={0}
            className="grid md:grid-cols-3 gap-3 relative"
          >
            <div className="bg-[#673AB7] text-white flex justify-center items-center px-4 py-2 absolute -top-5 right-3 text-sm">
              تنظیمات بنر گوشی
            </div>
            <div className="col-span-3 md:w-[200px]">
              <ImageContent
                data={banner.find((item) => item.screenSize === 0)}
                index={1}
                mobile
                setData={(e) => {
                  var temp = [...banner];
                  const index =
                    banner.findIndex((item) => item.screenSize === 0) !== -1;
                  if (index) {
                    temp[index] = { ...e, screenSize: 0 };
                  } else {
                    temp.push({ ...e, screenSize: 0 });
                  }

                  setBanner(temp);
                }}
                forEdit={forEdit}
                deleteHandler={() => {
                  if (forEdit) {
                    const img = banner.find((item) => item.screenSize === 0);
                    axiosInstance
                      .delete(
                        `${baseUrl}/${DELETE_SHOWCASE_IMAGE}?id=${img.id}`,
                        configReq(token)
                      )
                      .then((res) => {
                        var temp = [...banner];
                        temp = temp.filter((tmp) => tmp?.id !== img?.id);
                        setBanner(temp);
                        if (data.code === 200) {
                          toast.success("با موفقیت حذف شد");
                        }
                      })
                      .catch((err) => {
                        toast.error(err.response?.data?.message);
                      });
                  } else {
                    var temp = [...banner];
                    temp = temp.filter((tmp) => tmp?.id !== banner?.id);
                    setBanner(temp);
                  }
                }}
              />
            </div>
          </Paper>
        </div>
      )}

      <Paper
        sx={{
          border: "1px solid #dbdfea",
          mb: 1,
          padding: "15px 16px 15px 16px",
        }}
        className="col-span-3 "
      >
        <Tabs
          value={valueTab}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            flexGrow: 1,
            height: "3.07rem",
            minHeight: "40px !important",
            ".MuiTab-root": {
              minHeight: "40px !important",
            },
            background: (theme) =>
              theme.palette.mode === "light"
                ? "rgba(0,0,0,0.04) !important"
                : "rgba(0,0,0,0.7)  !important",
          }}
        >
          {" "}
          <Tab label="انتخاب بر اساس فیلتر" {...a11yProps(0)} />
          <Tab label="انتخاب موردی" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={valueTab} index={1}>
          <div>
            <div className="mb-5">
              {" "}
              <Filters
                limit={limit}
                setLimit={setLimit}
                headers={header}
                setFilter={setFilter}
                filter={filter}
                setPage={setPage}
                loading={loading}
              />
            </div>
            <CustomeLayout
              limit={limit}
              setLimit={setLimit}
              setAllRows={setAllRows}
              editApi={false}
              title={data?.filter?.title}
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
              rows={allData || []}
              hasMore={hasMore}
              loading={loading}
              setPage={setPage}
              setting={setting}
              CurrentPage={CurrentPage}
              actions={false}
              length={metaData?.total}
              name={" "}
              maxHeight={{ lg: "69.5vh", md: "68vh", xl: "74vh" }}
              setSort={(e) => {
                setPage(1);
                setSort({ ...sort, ...e });
              }}
              currentRow={(data) => {
                setEditingData(data);
              }}
              setRefresh={setRefresh}
              setSelected={setSelected}
              selected={selected}
            />
          </div>
        </TabPanel>
        <TabPanel value={valueTab} index={0}>
          <div>
            <div className="mb-5">
              {" "}
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
            </div>
            <CustomeLayout
              limit={limit}
              setLimit={setLimit}
              setAllRows={setAllRows}
              editApi={false}
              title={data?.filter?.title}
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
              rows={allData || []}
              hasMore={hasMore}
              loading={loading}
              setPage={setPage}
              setting={setting}
              CurrentPage={CurrentPage}
              actions={false}
              length={metaData?.total}
              name={" "}
              maxHeight={{ lg: "69.5vh", md: "68vh", xl: "74vh" }}
              setSort={(e) => {
                setPage(1);
                setSort({ ...sort, ...e });
              }}
              defualtSort={sort}
              currentRow={(data) => {
                setEditingData(data);
              }}
              setRefresh={setRefresh}
              setSelected={setSelected}
              selected={selected}
              canSelect={false}
            />
          </div>
        </TabPanel>
      </Paper>
    </>
  );
};

export default React.memo(StepContent);
function a11yProps(index) {
  return {
    id: `company-tab-${index}`,
    "aria-controls": `company-tabpanel-${index}`,
  };
}
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      className="py-5"
    >
      {value === index && (
        <>
          <>{children}</>
        </>
      )}
    </div>
  );
}
