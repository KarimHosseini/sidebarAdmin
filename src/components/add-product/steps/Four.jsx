/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ALL_PRODUCTS,
  baseUrl,
  EDIT_ACTIVE_PRODUCTS,
  EDIT_CROSS_SELL,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import CustomeLayout from "../../customeTable";
import DataFetcher from "../../dataFetch";
import axiosInstance from "../../dataFetch/axiosInstance";
import Filters from "../../filters";
import NoAccess from "../../noAccess";
import ProductCard from "../ProductCard";

const StepFour = ({ createdId, nextStep }) => {
  const navigate = useNavigate();
  const { userPermissions } = useSelector((state) => state.relationals);

  const [loading2, setLoading2] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [page, setPage] = useState(1);

  const [refreshData, setRefresh] = useState(0);
  const [filter, setFilter] = useState([]);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [sort, setSort] = useState({});
  const { token } = useSelector((state) => state.user);
  const [editingData, setEditingData] = useState({});
  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      ALL_PRODUCTS,
      filter,
      true,
      refreshData,
      sumbitSearch
    );
  const [allRows, setAllRows] = useState([]);
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  const submitLoop = () => {
    if (selectedProducts.length > 0) {
      setLoading2(true);
      var items = [];
      selectedProducts.map((item) => {
        if (!items.find((m) => m.crossProductId === item.id)) {
          items.push({ crossProductId: item.id });
        }
      });
      const formData = new FormData();
      formData.append("productId", createdId);
      formData.append("crossIds", JSON.stringify(items));
      axiosInstance
        .put(`${baseUrl}/${EDIT_CROSS_SELL}`, formData, configReq(token))
        .then((res) => {
          setLoading2(false);
          toast.success("با موفقیت اضافه شد");
          nextStep("");
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading2(false);

          if (err.response.status === 401) {
          }
        });
    } else {
      nextStep("");
    }
  };

  if (!userPermissions?.crossCells?.view) {
    return <NoAccess />;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Typography variant="body1">انتخاب محصولات فروش جانبی</Typography>{" "}
        <div className="flex items-center justify-end gap-3">
          <Link to={`/products/${createdId}#step4`}>
            <Button variant="outlined">بازگشت</Button>
          </Link>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              disabled={loading || loading2}
              variant="contained"
              onClick={submitLoop}
            >
              {loading2 ? (
                <>
                  <CircularProgress />
                </>
              ) : (
                <> مرحله بعد</>
              )}
            </Button>
          </Box>
        </div>
      </div>
      {selectedProducts.length > 0 && (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
          {selectedProducts.map((product, i) => (
            <Fragment key={i + "producCard"}>
              <ProductCard
                product={product}
                selected={true}
                unselect={(prdct) => {
                  var temp = [...selectedProducts];
                  var newS = temp.filter((p) => p.id !== product.id);
                  setSelectedProducts(newS);
                }}
              />
            </Fragment>
          ))}
        </div>
      )}

      <>
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
            />{" "}
          </div>{" "}
          {(userPermissions?.crossCells?.insert ||
            userPermissions?.crossCells?.update) && (
            <CustomeLayout
              limit={limit}
              setLimit={setLimit}
              setAllRows={setAllRows}
              editApi={EDIT_ACTIVE_PRODUCTS}
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
              rows={allRows?.filter((itm) => itm.id !== createdId) || []}
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
              setSelected={setSelectedProducts}
              selected={selectedProducts}
              currentRow={(data) => {
                setEditingData(data);
              }}
              setRefresh={setRefresh}
            />
          )}
        </>
      </>
    </>
  );
};

export default StepFour;
