/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { baseUrl } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
import axiosInstance from "./axiosInstance";
const DataFetcher = (
  limit,
  page,
  sort,
  url,
  filter,
  filterTypeIsArray = false,
  refreshData,
  sumbitSearch,
  viewType = 1,
  moreFilter = false,
  hasExtraParamsOnLink = false,
) => {
  const [loading, setLoading] = useState(true);
  const [errors, setError] = useState(false);
  const [allData, setData] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [CurrentPage, setCurrentPage] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const dispatch = useDispatch();
  const [header, setHeaders] = useState([]);
  const [setting, setSettings] = useState({});
  const [extraObject, setExtraObject] = useState({});
  const { token } = useSelector((state) => state.user);
  const location = window.location.pathname;
  const { infinteLoop } = useSelector((state) => state.relationals);

  // Removed: applyDefaultFilters function - no longer needed

  // Effect to clear data when filters/sort change
  useEffect(() => {
    setData([]);
  }, [sort, filter, refreshData, sumbitSearch, limit]);
  
  useEffect(() => {
    if (viewType === 1) {
      if (!infinteLoop[location]) {
        setData([]);
      }
    }
  }, [page, viewType, infinteLoop, location]);

  // Main data fetching effect
  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    const params = new URLSearchParams();
    page !== null && params.append("Page", page);
    limit && params.append("Limit", limit);
    sumbitSearch && params.append("search", sumbitSearch);
    if (moreFilter && moreFilter.value) {
      params.append(moreFilter.name, moreFilter.value);
    }
  
    var temp = "";
    if (sort) {
      var counter = 0;
      for (var prop in sort) {
        temp += `&sort[${counter}][key]=${prop}&sort[${counter}][direction]=${
          sort[prop] ? "asc" : "desc"
        }`;
        counter++;
      }
    }
    
    // Fixed: Filter out invalid filters before sending to API
    if (filterTypeIsArray && filter && filter.length > 0) {
      const validFilters = filter.filter(item => 
        item && 
        item.name && 
        item.value !== undefined && 
        item.value !== null && 
        item.value !== ""
      );
      
      validFilters.forEach((item, index) => {
        temp += `&filter[${index}][key]=${item.name}&filter[${index}][value]=${item.value}&filter[${index}][operator]=${item.type}`;
      });
    }

    axiosInstance(
      `${baseUrl}/${url}${!hasExtraParamsOnLink ? "?" : "&"}${params}${
        temp ? `${temp}` : ""
      }`,
      {
        ...configReq(token),
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      }
    )
      .then((res) => {
        setData((prev) => {
          return [...new Set([...prev, ...res.data.data])];
        });
        setMetaData(res.data.meta);
        setHeaders(res.data.header);
        setSettings(res.data.setting);
        setExtraObject(res.data.extraObject);
        setCurrentPage(page);
        setHasMore(
          res.data.meta.total_pages === 0
            ? false
            : res.data.meta.total_pages !== page
        );
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        toast.error(e.response?.data?.message);
        if (e.response?.status === 401 || e.response?.status === 403) {
          dispatch(logout());
        }
        setLoading(false);
        setError(true);
      });
    return () => cancel();
  }, [
    dispatch,
    filter,
    page,
    sort,
    token,
    url,
    refreshData,
    sumbitSearch,
    limit,
    moreFilter,
    hasExtraParamsOnLink
  ]);

  return {
    hasMore,
    loading,
    errors,
    allData,
    CurrentPage,
    metaData,
    header,
    setting,
    extraObject,
  };
};

export default DataFetcher;
