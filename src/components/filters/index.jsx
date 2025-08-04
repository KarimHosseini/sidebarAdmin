/* eslint-disable array-callback-return */
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TuneIcon from "@mui/icons-material/Tune";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Paper,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState, useMemo ,Fragment} from "react";
import AvailableFilter from "./active";
import CheckBoxFilter from "./checkBox";
import DateFilter from "./date";
import Enums from "./enum";
import QtyFilter from "./qty";
import TextFilter from "./text";
import ToDateFilter from "./toDate";
import NumberFilter from "./number";
import {
  getFiltersFromUrl,
  setFilterInUrl,
  removeFilterFromUrl,
  resetFiltersInUrl,
  addFiltersToUrl,
} from "../../utils/filterUtils";

const Filters = ({
  headers,
  setFilter,
  filter,
  setPage,
  loading,
  limit,
  setLimit,
  withDefualtValue,
  extraButtons,
  extraDetails,
}) => {
  const [data, setData] = useState({});
  const [hasFilter, sethasFilter] = useState({});
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [headLoad, setheadLoad] = useState(false);
  const [defualtLoaded, setdefualtLoaded] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [defualt, setDefualt] = useState([]);
  const [defualtValue, setDefualtValue] = useState({});
  const [sortedHeader, setsortedHeader] = useState([]);
  const [appliedFilterCount, setAppliedFilterCount] = useState(0);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.up("xl"));

  const visibleFilterCount = useMemo(() => {
    if (isXs) return 1;
    if (isSm) return 2;
    if (isMd) return 3;
    if (isLg) return 7;
    if (isXl) return 7;
    return 4;
  }, [isXs, isSm, isMd, isLg, isXl]);

  useEffect(() => {
    const urlFilters = getFiltersFromUrl();
    if (urlFilters.length > 0) {
      setFilter(urlFilters);

      const dataObj = {};
      urlFilters.forEach((filter) => {
        dataObj[filter.name] = filter.value;
      });
      setData(dataObj);
    }
  }, [setFilter]);

  useEffect(() => {
    const count = filter.length;
    setAppliedFilterCount(count);
  }, [filter]);

  useEffect(() => {
    var temp = [...headers];
    setsortedHeader(
      temp?.sort(
        (a, b) => parseFloat(a.filterOrder) - parseFloat(b.filterOrder)
      )
    );
  }, [headers]);

  const changeFilter = (value) => {
    setFilterInUrl(value, (updatedFilters) => {
      setFilter(updatedFilters);
      setPage(1);
      setData((prev) => ({ ...prev, [value.name]: value.value }));
    });
  };

  // Fixed: Reset with defaultFilter=false to prevent showing default filters
  const resetFilter = () => {
    setData({});
    // Add defaultFilter=false to indicate user has reset filters
    const resetFilters = [{
      name: 'defaultFilter',
      value: 'false',
      type: 'eq'
    }];
    
    resetFiltersInUrl(() => {
      // Set the defaultFilter=false instead of empty array
      setFilter(resetFilters);
      setPage(1);
    }, resetFilters);
    setRefresh((r) => r + 1);
  };

  useEffect(() => {
    var has = headers.find((item) => item.hasFilter);
    sethasFilter(has ? true : false);
    if (loading === false && headers.length > 0) {
      setheadLoad(true);
    }
  }, [headers, loading]);

  // Fixed: Remove filter without defaultFilter fallback
  const removeFilter = (item) => {
    removeFilterFromUrl(item, (updatedFilters) => {
      setFilter(updatedFilters);
      
      var d = { ...data };
      delete d[item.name];
      setData(d);
      setPage(1);
    });
  };

  // Fixed: Apply default filters only when no existing filters and no defaultFilter=false
  useEffect(() => {
    if (!defualtLoaded && headers?.length > 0) {
      var temp = [];
      if (withDefualtValue) {
        temp = [...filter];
        var t = {};
        temp?.map((item) => {
          t = { ...t, [item?.name]: item?.value };
        });
        setDefualtValue(t);
      } else {
        const existingUrlFilters = getFiltersFromUrl();
        
        // Check if user has reset filters (defaultFilter=false exists)
        const hasResetFilter = existingUrlFilters.some(
          filter => filter.name === 'defaultFilter' && filter.value === 'false'
        );
        
        if (existingUrlFilters.length === 0 || (existingUrlFilters.length === 1 && hasResetFilter)) {
          // Only apply default filters if no reset filter is present
          if (!hasResetFilter) {
            const defaultFilters = headers
              .filter((item) => item.defaultFilter && item.hasFilter)
              .map((item) => ({
                name: item.name,
                value: item.defaultFilter,
                type: "eq",
              }));

            if (defaultFilters.length > 0) {
              addFiltersToUrl(defaultFilters, (updatedFilters) => {
                setFilter(updatedFilters);

                const dataObj = { ...data };
                defaultFilters.forEach((filter) => {
                  dataObj[filter.name] = filter.value;
                });
                setData(dataObj);
              });
            }

            temp = defaultFilters;
          } else {
            // User has reset filters, keep only the defaultFilter=false
            temp = existingUrlFilters;
          }
        } else {
          // Use existing filters from URL
          temp = existingUrlFilters.filter(filter => filter.name !== 'defaultFilter');
        }
      }

      setdefualtLoaded(true);
      setDefualt(temp);
    }
  }, [headers, defualtLoaded, filter, data, withDefualtValue]);

  function objStyle(i) {
    if (i?.filterStyle) {
      var jsonStrW = i.filterStyle.replace(/(\w+:)|(\w+ :)/g, function (s) {
        return '"' + s.substring(0, s.length - 1) + '":';
      });

      return JSON.parse(jsonStrW);
    } else {
      return {};
    }
  }

  const getPrimaryFilters = () => {
    return sortedHeader
      .filter((item) => item.hasFilter)
      .slice(0, !expandedFilters ? visibleFilterCount : 1000);
  };
  const getSecondaryFilters = () => {
    return sortedHeader
      .filter((item) => item.hasFilter)
      .slice(visibleFilterCount);
  };
  const renderFilterComponent = (item) => {
    switch (item.type) {
      case "date":
        return (
          <DateFilter
            refresh={refresh}
            changeFilter={changeFilter}
            item={item}
          />
        );
      case "toDate":
        return (
          <ToDateFilter
            refresh={refresh}
            changeFilter={changeFilter}
            item={item}
          />
        );
      case "enum":
      case "urlLink":
        return (
          <Enums
            data={data}
            changeFilter={changeFilter}
            item={item}
            removeFilter={() => removeFilter(item)}
            refresh={refresh}
            defualtValue={defualtValue}
          />
        );
      case "string":
        return (
          <TextFilter
            refresh={refresh}
            changeFilter={changeFilter}
            item={item}
            defualtValue={defualtValue}
          />
        );
      case "available":
        return (
          <AvailableFilter
            refresh={refresh}
            changeFilter={changeFilter}
            item={item}
            removeFilter={() => removeFilter(item)}
          />
        );
      case "bool":
      case "active":
        return (
          <CheckBoxFilter
            refresh={refresh}
            changeFilter={changeFilter}
            item={item}
            removeFilter={() => removeFilter(item)}
            defualtValue={defualtValue}
          />
        );
      case "qty":
        return (
          <QtyFilter
            refresh={refresh}
            changeFilter={changeFilter}
            item={item}
            removeFilter={() => removeFilter(item)}
          />
        );
      case "number":
        return (
          <NumberFilter
            refresh={refresh}
            changeFilter={changeFilter}
            item={item}
          />
        );
      default:
        return (
          <CheckBoxFilter
            refresh={refresh}
            changeFilter={changeFilter}
            item={item}
            removeFilter={() => removeFilter(item)}
            defualtValue={defualtValue}
          />
        );
    }
  };

  const gridCols = isXs ? 1 : isSm ? 2 : isMd ? 3 : isLg ? 4 : 6;

  if (!headLoad && loading) {
    return (
      <Paper sx={{ p: 2, mb: 2 }} elevation={0}>
        <div className={`grid grid-cols-${Math.min(gridCols, 3)} gap-4`}>
          <Skeleton className="h-[56px]"></Skeleton>
          <Skeleton className="h-[56px]"></Skeleton>
          <Skeleton className="h-[56px]"></Skeleton>
        </div>
      </Paper>
    );
  }

  if (!hasFilter) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={0}>
      <Box className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-2">
            <TuneIcon color="primary" />
            <Typography variant="subtitle1" fontWeight="medium">
              فیلترها
              {appliedFilterCount > 0 && (
                <span className="mr-2 bg-primary text-white text-xs rounded-full px-2 py-1">
                  {appliedFilterCount}
                </span>
              )}
            </Typography>
          </div>

          <div className="flex gap-2 flex-wrap">
            {extraButtons && (
              <div className="flex gap-2 flex-wrap">{extraButtons}</div>
            )}

            <Button
              size="small"
              variant="outlined"
              onClick={resetFilter}
              startIcon={<RestartAltIcon />}
            >
              ریست
            </Button>

            {getSecondaryFilters().length > 0 && (
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => setExpandedFilters(!expandedFilters)}
                endIcon={
                  <ArrowDropDownIcon
                    className="transition-transform duration-300"
                    sx={{
                      transform: expandedFilters
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                }
              >
                {expandedFilters ? "بستن فیلترها" : "فیلترهای بیشتر"}
              </Button>
            )}
          </div>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7 gap-4`}
        >
          {getPrimaryFilters().map((item, index) => (
            <Fragment key={`primary-filter-${index}`}>
              {renderFilterComponent(item)}
            </Fragment>
          ))}
        </div>

        {/* Extra Details */}
        {extraDetails && (
          <div className="mt-2">
            <Divider />
            <div className="py-2">{extraDetails}</div>
          </div>
        )}

  
      </Box>
    </Paper>
  );
};

export default React.memo(Filters);
