/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Alert,
  FormControlLabel,
  Paper,
  Radio,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../../../components/add-product/ProductCard";
import CustomeLayout from "../../../components/customeTable";
import DataFetcher from "../../../components/dataFetch";
import Filters from "../../../components/filters";
import NoAccess from "../../../components/noAccess";
import { ALL_PRICES } from "../../../helpers/api-routes";

const Step5 = ({
  selected,
  setSelected,
  data,
  setData,
  filter,
  setFilter,
  sort,
  setSort,
  planStarted,
}) => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);

  const [refreshData, setRefresh] = useState(0);

  const [editingData, setEditingData] = useState({});
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      ALL_PRICES,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  const [allRows, setAllRows] = useState([]);
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);

  if (!userPermissions?.product?.view) {
    return <NoAccess />;
  }

  return (
    <div className="relative">
      {" "}
      {/*    {planStarted ? (
        <div className="absolute z-20 cursor-not-allowed bg-gray-100 opacity-40 w-full h-full top-0 right-0"></div>
      ) : (
        <div></div>
      )} */}
      {selected.length > 0 && data?.productChoosen && (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 mt-3 sm:grid-cols-2 grid-cols-1 gap-4 mb-4">
          {selected.map((product, i) => (
            <Fragment key={i + "producCard"}>
              <ProductCard
                product={product}
                selected={true}
                unselect={(prdct) => {
                  var temp = [...selected];
                  var newS = temp.filter((p) => p.id !== product.id);
                  setSelected(newS);
                }}
              />
            </Fragment>
          ))}
        </div>
      )}
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
              withDefualtValue={true}
            />{" "}
            <div className="flex justify-between flex-wrap lg:grid-col-7 border-t border-[#dbdfea] pt-4 mt-1 md:grid-cols-6 sm:grid-cols-5 gap-3 w-full">
              <div className="flex items-center gap-3">
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
                    maxWidth: "160px",
                  }}
                  control={
                    <Radio
                      checked={
                        data?.fitler !== undefined &&
                        data?.productChoosen !== true &&
                        !data?.allProducts
                      }
                    />
                  }
                  onClick={(e) => {
                    setData({
                      ...data,

                      allProducts: undefined,
                      fitler: true,
                      productChoosen: undefined,
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
                      اعمال بر روی موارد فیلتر شده
                    </Typography>
                  }
                />

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
                    maxWidth: "160px",
                  }}
                  control={
                    <Radio
                      checked={
                        data?.productChoosen !== undefined &&
                        !data?.allProducts &&
                        !data?.fitler
                      }
                    />
                  }
                  onClick={(e) => {
                    setData({
                      ...data,
                      allProducts: undefined,
                      productChoosen: true,
                      fitler: undefined,
                      productFilter: undefined,
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
                      اعمال بر روی محصولات انتخابی
                    </Typography>
                  }
                />
              </div>
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
                  maxWidth: "160px",
                }}
                control={
                  <Radio
                    checked={
                      data?.allProducts &&
                      data?.productChoosen !== true &&
                      !data?.fitler
                    }
                  />
                }
                onClick={(e) => {
        
                  setData({
                    ...data,
                    allProducts: true,
                    productFilter: undefined,
                    fitler: false,
                    productChoosen: undefined,
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
                    اعمال بر روی کلیه محصولات
                  </Typography>
                }
              />
            </div>
          </div>
        </>
      </Paper>
      <div className="relative">
        {" "}
        {!data?.productChoosen ? (
          <div className="absolute z-20 cursor-not-allowed bg-gray-100 opacity-40 w-full h-full top-0 right-0"></div>
        ) : (
          <div></div>
        )}{" "}
        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={false}
          title="  محصولات"
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
      </div>
    </div>
  );
};

export default Step5;
