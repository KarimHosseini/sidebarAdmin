import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { ALL_PRODUCTS, baseUrl } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const ProductData = (
  page,
  limit,
  brandFilter,
  catFilter,
  applySearch,
  sort
) => {
  const [loading, setLoading] = useState(true);
  const [errors, setError] = useState(false);
  const [allData, setData] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [CurrentPage, setCurrentPage] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [header, setHeaders] = useState([]);
  useEffect(() => {
    setData([]);
  }, [brandFilter, catFilter, applySearch, sort]);
  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    const params = new URLSearchParams();
    page !== null && params.append("Page", page);
    limit !== null && params.append("Limit", limit);
    brandFilter !== "" &&
      brandFilter.id &&
      params.append("brand", brandFilter.id);
    catFilter !== "" &&
      catFilter.id &&
      params.append("categorywithchilds", catFilter.id);
    applySearch !== "" && params.append("search", applySearch);
    var temp = "";

    if (sort) {
      var counter = 0;
      for (var prop in sort) {
        temp += `&sort[${counter}][key]=${prop}&sort[${counter}][direction]=${sort[prop]}`;
        counter++;
      }
    }
    axiosInstance(`${baseUrl}/${ALL_PRODUCTS}?${params}${temp ? `${temp}` : ""}`, {
      ...configReq(token),
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setData((prev) => {
          return [...new Set([...prev, ...res.data.data])];
        });
        setHeaders(res.data.header);
        setMetaData(res.data.meta);
        setCurrentPage(page);
        setHasMore(res.data.meta.total_pages !== page);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        toast.error(e.response?.data?.message);
        setError(true);
      });
    return () => cancel();
  }, [applySearch, brandFilter, catFilter, limit, page, token, sort]);
  return { hasMore, loading, errors, allData, CurrentPage, metaData, header };
};

export default ProductData;
