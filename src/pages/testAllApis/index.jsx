import {
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import NoAccess from "../../components/noAccess";
import * as apiRoutes from "../../helpers/api-routes";
import { baseUrl } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const TestAllApis = () => {
  const [apiResults, setApiResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);

  const getAllApiEndpoints = () => {
    const endpoints = [];

    for (const key in apiRoutes) {
      const route = apiRoutes[key];
      if (typeof route === "string" && route.includes("GetAll")) {
        endpoints.push({
          name: key,
          endpoint: route,
          status: null,
          headerLength: null,
          dataLength: null,
          error: null,
          loading: false,
        });
      }
    }

    return endpoints;
  };

  useEffect(() => {
    const endpoints = getAllApiEndpoints();
    setApiResults(endpoints);
    setFilteredResults(endpoints);

    const autoTest = async () => {
      setLoading(true);
      for (let i = 0; i < endpoints.length; i++) {
        await testApi(endpoints[i], i);
      }
      setLoading(false);
    };

    autoTest();
  }, []);

  useEffect(() => {
    let filtered = [...apiResults];

    if (search) {
      filtered = filtered.filter(
        (api) =>
          api.name.toLowerCase().includes(search.toLowerCase()) ||
          api.endpoint.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((api) => api.status === statusFilter);
    }

    setFilteredResults(filtered);
  }, [search, statusFilter, apiResults]);

  const testApi = async (api, index) => {
    try {
      setApiResults((prevResults) => {
        const newResults = [...prevResults];
        newResults[index] = {
          ...newResults[index],
          loading: true,
          error: null,
        };
        return newResults;
      });

      const config = {
        ...configReq(token),
        params: { page: 1, limit: 10 },
      };

      const response = await axiosInstance.get(
        `${baseUrl}/${api.endpoint}`,
        config
      );

      const headerLength = response?.data?.header?.length ?? 0;
      const dataLength = response?.data?.data?.length ?? 0;

      setApiResults((prevResults) => {
        const newResults = [...prevResults];
        newResults[index] = {
          ...newResults[index],
          status: response.status,
          headerLength,
          dataLength,
          loading: false,
          error: null,
          lastTested: new Date().toLocaleTimeString(),
        };
        return newResults;
      });
    } catch (error) {
      setApiResults((prevResults) => {
        const newResults = [...prevResults];
        newResults[index] = {
          ...newResults[index],
          status: error.response?.status || 500,
          headerLength: 0,
          dataLength: 0,
          loading: false,
          error: error.message || "خطای ناشناخته",
          lastTested: new Date().toLocaleTimeString(),
        };
        return newResults;
      });
    }
  };

  const testAllApis = async () => {
    setLoading(true);

    const resetResults = apiResults.map((api) => ({
      ...api,
      status: null,
      headerLength: null,
      dataLength: null,
      error: null,
      loading: true,
    }));

    setApiResults(resetResults);

    for (let i = 0; i < resetResults.length; i++) {
      await testApi(resetResults[i], i);
    }

    setLoading(false);
  };

  const testSingleApi = (api, index) => {
    testApi(api, index);
  };

  const getStatusColor = (status) => {
    if (!status) return "default";
    if (status === 200) return "success";
    if (status >= 400 && status < 500) return "warning";
    if (status >= 500) return "error";
    return "primary";
  };

  const getStatusLabel = (status) => {
    if (!status) return "نامشخص";
    if (typeof status === "number") return `${status}`;
    return "خطا";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const statusCounts = apiResults.reduce((acc, api) => {
    if (api.status) {
      const statusKey = typeof api.status === "number" ? api.status : "error";
      acc[statusKey] = (acc[statusKey] || 0) + 1;
    }
    return acc;
  }, {});
  if (!userPermissions?.apiTest?.view) {
    return <NoAccess />;
  }
  return (
    <Box sx={{ padding: 2, maxWidth: "1200px", margin: "0 auto" }}>
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
          داشبورد تست API
        </Typography>

        <Paper elevation={1} sx={{ p: 1.5, mb: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  color="primary"
                  onClick={testAllApis}
                  disabled={loading}
                  size="small"
                >
                  <RefreshIcon />
                </IconButton>
              </motion.div>
              <Typography variant="body2">
                {apiResults.length} مورد API با "GetAll" یافت شد
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                size="small"
                placeholder="جستجوی APIها..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "rgba(0, 0, 0, 0.54)" }} />
                  ),
                  sx: { height: 36 },
                }}
                sx={{ minWidth: 180 }}
              />

              <Stack direction="row" spacing={0.5}>
                <Chip
                  icon={<FilterIcon sx={{ fontSize: "0.9rem" }} />}
                  label="همه"
                  size="small"
                  color={statusFilter === null ? "primary" : "default"}
                  onClick={() => setStatusFilter(null)}
                  clickable
                />
                <Chip
                  label="200"
                  size="small"
                  color={statusFilter === 200 ? "success" : "default"}
                  onClick={() => setStatusFilter(200)}
                  clickable
                />
                <Chip
                  label="خطا"
                  size="small"
                  color={statusFilter === 500 ? "error" : "default"}
                  onClick={() => setStatusFilter(500)}
                  clickable
                />
              </Stack>
            </Stack>
          </Stack>

          {/* Status summary */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ mt: 1.5, flexWrap: "wrap" }}
          >
            {Object.entries(statusCounts).map(([status, count]) => (
              <motion.div
                key={status}
                whileHover={{ scale: 1.05 }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Chip
                  label={`${status}: ${count}`}
                  size="small"
                  color={getStatusColor(parseInt(status))}
                  variant="outlined"
                />
              </motion.div>
            ))}
          </Stack>
        </Paper>

        {loading && <LinearProgress sx={{ mb: 1 }} />}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {filteredResults.map((api, index) => (
              <motion.div
                key={api.name}
                variants={itemVariants}
                exit={{ opacity: 0, y: -10 }}
                layout
              >
                <Card
                  sx={{
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    boxShadow: 1,
                    position: "relative",
                    overflow: "visible",
                    "&:hover": {
                      boxShadow: 3,
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography
                        variant="subtitle2"
                        component="div"
                        sx={{ fontWeight: "bold" }}
                      >
                        {api.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          wordBreak: "break-all",
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        {api.endpoint}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ flexWrap: "wrap" }}
                      >
                        {api.status !== null && (
                          <Chip
                            label={`وضعیت: ${getStatusLabel(api.status)}`}
                            size="small"
                            color={getStatusColor(api.status)}
                            sx={{ height: 22, fontSize: "0.7rem" }}
                          />
                        )}
                        {api.headerLength !== null && (
                          <Chip
                            label={`هدر: ${api.headerLength}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ height: 22, fontSize: "0.7rem" }}
                          />
                        )}
                        {api.dataLength !== null && (
                          <Chip
                            label={`داده: ${api.dataLength}`}
                            size="small"
                            color="secondary"
                            variant="outlined"
                            sx={{ height: 22, fontSize: "0.7rem" }}
                          />
                        )}
                        {api.lastTested && (
                          <Chip
                            label={`${api.lastTested}`}
                            size="small"
                            color="default"
                            variant="outlined"
                            sx={{ height: 22, fontSize: "0.7rem" }}
                          />
                        )}
                      </Stack>

                      {api.error && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          خطا: {api.error}
                        </Typography>
                      )}
                    </Box>

                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconButton
                        onClick={() => testSingleApi(api, index)}
                        disabled={api.loading}
                        color="primary"
                        size="small"
                      >
                        {api.loading ? (
                          <CircularProgress size={18} />
                        ) : (
                          <RefreshIcon fontSize="small" />
                        )}
                      </IconButton>
                    </motion.div>
                  </Stack>

                  {api.loading && (
                    <LinearProgress
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        borderBottomLeftRadius: 4,
                        borderBottomRightRadius: 4,
                      }}
                    />
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Chip
              label={loading ? "در حال تست APIها..." : "تست همه APIها"}
              color="primary"
              onClick={testAllApis}
              disabled={loading}
              icon={
                loading ? (
                  <CircularProgress size={14} />
                ) : (
                  <RefreshIcon fontSize="small" />
                )
              }
              clickable
            />
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  );
};

export default TestAllApis;
