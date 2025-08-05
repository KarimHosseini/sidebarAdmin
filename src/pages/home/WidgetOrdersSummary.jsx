
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  Collapse,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import WidgetMenu from './components/WidgetMenu';
import { Box } from "@mui/system";
import { AnimatePresence, motion } from "framer-motion";
import momentJalaali from "moment-jalaali";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, WidgetOrdersSummaryData } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const Counter = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const countUp = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * end);

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(countUp);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(countUp);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}</span>;
};

const SvgIcon = ({ svgString }) => {
  if (!svgString) return null;
  
  return (
    <Box
      component="span"
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        "& svg": {
          width: 20,
          height: 20,
        }
      }}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
};

const WidgetOrdersSummary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(momentJalaali());
  const [refresh, setRefresh] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const { themeColor } = useSelector((state) => state.themeColor);
  const isDark = themeColor === "dark";
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    setData([]);
    axiosInstance(`${baseUrl}/${WidgetOrdersSummaryData}`, configReq(token))
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      });
  }, [time, refresh, dispatch, token]);

  const handleToggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Grid container spacing={2}>
      <AnimatePresence>
        {loading
          ? Array.from(Array(8).keys()).map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${item}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.1 }}
                >
                  <Paper
                    elevation={0}
                    className="border rounded p-4 flex flex-col items-center gap-3 relative w-full h-[130px]"
                  >
                    <Box className="w-full flex items-center justify-between">
                      <Skeleton variant="circular" width={40} height={40} />
                      <Skeleton width="60%" height={24} />
                    </Box>
                    <Skeleton width="80%" height={60} />
                  </Paper>
                </motion.div>
              </Grid>
            ))
          : data?.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`category-${index}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Paper
                    elevation={0}
                    className="border rounded px-4 py-3 flex flex-col items-center relative w-full overflow-hidden"
                    sx={{
                      background: isDark ? category.darkModeColor : category.color,
                      boxShadow:
                        expandedIndex === index
                          ? "0px 0px 11px #8b8b8b4f"
                          : "none",
                      transition: "all 0.3s ease",
                      minHeight: "130px",
                    }}
                  >
                    <Box className="w-full flex items-center justify-between mb-2">
                      <Box className="flex items-center">
                        <Box
                          component={motion.div}
                          whileHover={{ rotate: 15 }}
                          sx={{
                            color: "#fff",
                            background: isDark ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.15)",
                            borderRadius: "3px",
                            padding: "8px",
                            mr: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <SvgIcon svgString={category.icon} />
                        </Box>
                        <Typography
                          variant="subtitle1"
                          className=" !text-sm !font-semibold"
                        >
                          {category.title}
                        </Typography>
                      </Box>

                      <Box className="flex items-center">
                        <WidgetMenu
                          onRefresh={() => setRefresh((r) => r + 1)}
                          onExport={() => {
                            // Implement export functionality
                            console.log('Export orders summary data');
                          }}
                          customMenuItems={[
                            {
                              label: 'نمایش جزئیات',
                              onClick: () => handleToggleExpand(index)
                            }
                          ]}
                        />
                      </Box>
                    </Box>

                    <Paper
                      elevation={0}
                      className="w-full"
                      sx={{
                        borderRadius: "5px",
                        border: "1px solid #d6d6d6",
                        padding: "10px",
                        background:isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      <Box className="flex items-center justify-around">
                        {category.children.map((child, childIndex) => (
                          <Box
                            key={`child-${index}-${childIndex}`}
                            className="text-center"
                          >
                            <Typography
                              variant="caption"
                              className="block mb-1"
                            >
                              {child.title}
                            </Typography>
                            <Typography
                              variant="h6"
                              className="font-bold"
                              sx={{
                                color: (theme) =>
                                  theme.palette.mode === "light"
                                    ? "#1a63c5"
                                    : "#ff9999",
                              }}
                            >
                              <Counter end={child.count} />
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Paper>

                    <Collapse
                      in={expandedIndex === index}
                      timeout="auto"
                      unmountOnExit
                      className="w-full mt-2"
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: "5px",
                          border: "1px solid #d6d6d6",
                          padding: "10px",
                          background: "rgba(255, 255, 255, 0.9)",
                        }}
                      >
                        <Box className="flex items-center justify-around">
                          {category.children.map((child, childIndex) => (
                            <Box
                              key={`detail-${index}-${childIndex}`}
                              className="text-center"
                              component={motion.div}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: childIndex * 0.1 }}
                            >
                              <Typography variant="body2">
                                {child.title}
                              </Typography>
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 260,
                                  damping: 20,
                                  delay: 0.1 + childIndex * 0.1,
                                }}
                              >
                                <Typography
                                  variant="h5"
                                  className="font-bold"
                                  sx={{
                                    color: ["#007fd4", "#b86e00", "#954c22"][
                                      childIndex % 3
                                    ],
                                  }}
                                >
                                  <Counter end={child.count} duration={1} />
                                </Typography>
                              </motion.div>
                            </Box>
                          ))}
                        </Box>
                      </Paper>
                    </Collapse>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
      </AnimatePresence>
    </Grid>
  );
};

export default WidgetOrdersSummary;
