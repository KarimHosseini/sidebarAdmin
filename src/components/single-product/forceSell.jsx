/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, CircularProgress, Typography } from "@mui/material";

import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ALL_PRICES, baseUrl, EDIT_BULK_SELL } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import PropertyCard from "../add-product/propertyCard";
import CustomeLayout from "../customeTable";
import DataFetcher from "../dataFetch";
import axiosInstance from "../dataFetch/axiosInstance";
import Filters from "../filters";
import NoAccess from "../noAccess";
const ForceSell = ({ data, createdId }) => {
  const { id } = useParams();
  const { userPermissions } = useSelector((state) => state.relationals);

  const [loading2, setLoading2] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProductsMain, setSelectedProductsMain] = useState([]);

  const [open, setOpen] = useState(true);
  const [refreshData, setRefresh] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState([]);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const navigate = useNavigate();
  const [sort, setSort] = useState({});
  const [editingData, setEditingData] = useState({});
  const [currentIds, setCurrentIds] = useState([]);
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
    axiosInstance(
      `${baseUrl}/${ALL_PRICES}?Page=1&Limit=20&filter[0][key]=productId&filter[0][value]=${id}&filter[0][operator]=eq`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;

        if (data.code === 200) {
          setCurrentIds(data.data);
        }
      })
      .catch((err) => {});
  }, []);
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);
  useEffect(() => {
    setSelectedProducts(data);
    setSelectedProductsMain(data);
  }, [data]);
  const { token } = useSelector((state) => state.user);
  const submitLoop = async () => {
    if (createdId && selectedProducts.length === 0) {
      navigate("/products");
      return;
    }
    setLoading2(true);
    var items = [];

    selectedProducts.map((item) => {
      items.push({
        forcedProductPropertyId: item.id,
        activeSellIfZero: item.activeSellIfZero,
        productId: createdId ? createdId : Number(id),
      });
    });

    axiosInstance
      .put(
        `${baseUrl}/${EDIT_BULK_SELL}?productId=${
          createdId ? createdId : Number(id)
        }`,
        items,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading2(false);
        toast.success("با موفقیت اضافه شد");
        if (createdId) {
          navigate("/products");
        }
        /*  */
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading2(false);

        if (err.response.status === 401) {
        }
      });
  };

  if (!userPermissions?.productCrossForcedSell?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between cursor-pointer border-b pb-2 px-4 md:px-0"
      >
        <div className="flex items-center gap-2">
          <Typography>فروش اجباری های فعلی:</Typography>
          <Typography variant="body2">
            {selectedProducts.length} کالا انتخاب شده
          </Typography>
        </div>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            disabled={
              loading ||
              loading2 ||
              !userPermissions?.productCrossForcedSell?.update
            }
            variant="contained"
            onClick={submitLoop}
          >
            {loading2 ? (
              <>
                <CircularProgress />
              </>
            ) : (
              <> ثبت و برگشت </>
            )}
          </Button>
        </Box>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mt-3 pt-3  px-4 md:px-0">
        {selectedProducts.map((product, i) => (
          <Fragment key={i + "producCards"}>
            <PropertyCard
              product={product}
              selected={true}
              unselect={(prdct) => {
                var temp = [...selectedProducts];
                var newS = temp.filter((p) => p.id !== product.id);
                setSelectedProducts(newS);
              }}
              handleChange={() => {
                var temp = [...selectedProducts];
                temp[i].activeSellIfZero = !temp[i].activeSellIfZero;
                setSelectedProducts(temp);
              }}
            />
          </Fragment>
        ))}
      </div>
      <div className="flex gap-4 flex-wrap justify-between mt-3 py-3 border-t  px-4 md:px-0">
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
          title="  لیست کالا ها"
          headers={header}
          setSearch={setsearch}
          search={search}
          page={page}
          total_pages={metaData?.total_pages}
          setApplySearch={(e) => {
            setPage(1);
            setSumbitSearch(e);
          }}
          rows={allRows.filter(
            (row) => !currentIds.some((ci) => ci.id === row.id)
          )}
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
  );
};

export default ForceSell;
