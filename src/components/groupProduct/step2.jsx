/* eslint-disable react-hooks/exhaustive-deps */
import { Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import CustomeLayout from "../customeTable";
import DataFetcher from "../dataFetch";
import Filters from "../filters";
import { ALL_PRICES } from "../../helpers/api-routes";
import ProductCard from "../add-product/ProductCard";

const Step2GroupProduct = ({
  createdId,
  selectedProducts,
  setSelectedProducts,
}) => {
  const [page, setPage] = useState(1);

  const [refreshData, setRefresh] = useState(0);
  const [filter, setFilter] = useState([]);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [sort, setSort] = useState({});
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

  return (
    <>
      <div className="flex items-center justify-between">
        <Typography variant="body1">
          محصولات مورد نظر را انتخاب نمایید
        </Typography>{" "}
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
            setSelected={(e) => {
              var temp = [...e];
              var temp2 = [];
              temp?.map((item) => {
                var finded = temp?.find(
                  (tm) =>
                    tm?.productId === item?.productId && tm?.id !== item?.id
                );
                temp2.push({
                  ...item,
                  bundleType: 0,
                  num: 1,
                  priceAmount: item?.discount ? item?.discount : item?.price,
                  isGroup: finded
                    ? finded
                    : item?.isGroup !== undefined
                    ? item?.isGroup
                    : 0,
                  showPrice: true,
                  showProperty: true,
                });
              });
              setSelectedProducts(temp2);
            }}
            selected={selectedProducts}
            currentRow={(data) => {
              setEditingData(data);
            }}
            setRefresh={setRefresh}
          />
        </>
      </>
    </>
  );
};

export default Step2GroupProduct;
