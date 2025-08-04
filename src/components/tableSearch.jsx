/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Fade from "@mui/material/Fade";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import React, { useState } from "react";
import { IoIosInfinite } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { baseUrl } from "../helpers/api-routes";
import { configReq } from "../helpers/functions";
import { setInfinteLoop } from "../redux/slices/relationals";
import { Modal } from "./common";
import Search from "./common/search";
import axiosInstance from "./dataFetch/axiosInstance";
import { Confirm } from "./modals";

const TableSearch = ({
  title,
  length,
  setApplySearch,
  setSearch,
  search,
  selectionManager,
  accordionManager,
  setRefresh,
  setLimit,
  limit,
  deleteAllApi,
  editActiveAllApi,
  setSort,
  setIsAsc,
  headers,
}) => {
  const [openC, setOpenC] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openA, setOpenA] = useState(false);
  const [status, setStatus] = useState(false);
  const [infiniteScroll, setInfiniteScroll] = useState(false);
  const dispatch = useDispatch();
  const { infinteLoop } = useSelector((state) => state.relationals);
  const location = window.location.pathname;

  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const [openCustome, setOpenCustome] = useState(false);
  const [sortRules, setSortRules] = useState([
    { headerName: "id", direction: "desc" },
  ]);

  const handleOpen = () => setOpenCustome(true);
  const handleClose = () => setOpenCustome(false);

  const updateSortRule = (index, key, value) => {
    const updatedRules = [...sortRules];
    updatedRules[index][key] = value;
    setSortRules(updatedRules);
  };

  const addSortRule = () => {
    setSortRules([...sortRules, { headerName: "", direction: "asc" }]);
  };

  const removeSortRule = (index) => {
    setSortRules(sortRules.filter((_, i) => i !== index));
  };

  const applyCustomSort = () => {
    const newSort = {};
    const newIsAsc = {};

    sortRules.forEach(({ headerName, direction }) => {
      if (headerName) {
        newSort[headerName] = direction === "asc";
        newIsAsc[headerName] = direction === "asc";
      }
    });

    setSort(newSort);
    setIsAsc(newIsAsc);
    handleClose();
    
    // Close all accordions when applying sort
    if (accordionManager) {
      accordionManager.closeAll();
    }
  };

  const handleDelete = () => {
    setLoading(true);
    const formData = new FormData();
    const selectedIds = selectionManager.getSelected();
    selectedIds.forEach((id) => {
      formData.append("ids", id);
    });
    if (id) formData.append("parentId", id);
    axiosInstance
      .post(`${baseUrl}/${deleteAllApi}`, formData, configReq(token))
      .then((res) => {
        setSearch("");
        setApplySearch("");
        setRefresh((r) => r + 1);
        selectionManager.deselectAll();
        setLoading(false);
        toast.success("با موفقیت حذف شد");
        setOpenC(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
        setOpenC(false);
      });
  };

  const handleActive = (status) => {
    setLoading(true);
    const formData = new FormData();
    const selectedIds = selectionManager.getSelected();
    selectedIds.forEach((id) => {
      formData.append("ids", id);
    });
    if (id) formData.append("parentId", id);
    formData.append("activeValue", status);
    axiosInstance
      .post(`${baseUrl}/${editActiveAllApi}`, formData, configReq(token))
      .then((res) => {
        setSearch("");
        setApplySearch("");
        setRefresh((r) => r + 1);
        selectionManager.deselectAll();
        setLoading(false);
        toast.success("با موفقیت اپدیت شد");
        setOpenA(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
        setOpenC(false);
      });
  };

  const handleScroll = () => {
    const infiniteScrollState = { [location]: !infinteLoop[location] };
    dispatch(setInfinteLoop(infiniteScrollState));
  };
  console.log("render table head search ....");

  return (
    <Box className="relative grid md:grid-cols-2 gap-y-4 md:px-3">
      <div className="flex items-center md:justify-start justify-between">
        <div className="flex items-center gap-2 md:min-w-[800px]">
          <Typography
            sx={{ fontSize: { md: "1rem !important", xs: "0.8rem" } }}
            variant="h6"
          >
            {title}
          </Typography>
          <Typography
            sx={{
              borderLeft: "1px solid #dbdfea",
              fontSize: { md: "0.83rem !important" },
              color: (theme) =>
                theme.palette.mode === "light" ? "#001ee4" : "#90caf9",
            }}
            className="px-2 mx-2"
            variant="body2"
          >
            تعداد نتایج : {length} مورد
          </Typography>
          <div className="w-[150px]">
            <Typography
              id="selection-counter"
              sx={{
                fontSize: { md: "0.75rem !important", xs: "0.7rem" },
                color: (theme) =>
                  theme.palette.mode === "light" ? "#001ee4" : "#90caf9",
                display: "none",
                fontWeight: "bold",
                borderLeft: "1px solid #dbdfea",
                paddingLeft: "8px",
                marginLeft: "8px",
                whiteSpace: "nowrap"
              }}
              className="px-2"
              variant="body2"
              component="div"
            ></Typography>
          </div>

          <div className="hidden mx-5 md:flex justify-center">
            {" "}
            <div className="md:w-[350px] md:mb-0 mb-4 w-full ">
              <Search
                setSearch={setSearch}
                search={search}
                setApplySearch={(e) => {
                  // Close all accordions when applying search
                  if (accordionManager) {
                    accordionManager.closeAll();
                  }
                  setApplySearch(e);
                }}
              />
            </div>
          </div>
        </div>{" "}
        <div className="flex md:hidden  justify-end">
          <IconButton
            sx={{
              background: "#f0f0f0 !important",
              width: "1.3rem !important",
              padding: "2px !important",
              height: "1.3rem !important",
              fontSize: "1.5rem !important",
            }}
            onClick={() => {
              setSearch("");
              setApplySearch("");
              setRefresh((r) => r + 1);
              selectionManager.deselectAll();
              
              // Close all accordions when refreshing
              if (accordionManager) {
                accordionManager.closeAll();
              }
            }}
          >
            <RefreshIcon sx={{ color: "#001ee4" }} />
          </IconButton>
        </div>
      </div>
      <div className="flex md:hidden justify-center">
        {" "}
        <div className="md:w-[350px] md:mb-0 mb-4 w-full ">
          <Search
            setSearch={setSearch}
            search={search}
            setApplySearch={(e) => {
              // Close all accordions when applying search
              if (accordionManager) {
                accordionManager.closeAll();
              }
              setApplySearch(e);
            }}
          />
        </div>
      </div>
      <div className="hidden md:flex items-center justify-end gap-2 ">
        {editActiveAllApi && (
          <Button
            onClick={() => {
              setOpenA(true);
              setStatus(true);
            }}
            variant="outlined"
            color="success"
          >
            <>فعال سازی تجمیعی</>
          </Button>
        )}
        {editActiveAllApi && (
          <Button
            onClick={() => {
              setOpenA(true);
              setStatus(false);
            }}
            variant="outlined"
            color="warning"
            title={<>غیر فعال سازی تجمیعی</>}
          >
            <>غیر فعال سازی تجمیعی</>
          </Button>
        )}
        {deleteAllApi && (
          <Button
            onClick={() => setOpenC(true)}
            variant="outlined"
            color="error"
          >
            <>حذف تجمیعی</>
          </Button>
        )}
        <Button variant="outlined" onClick={handleOpen}>
          مرتب سازی پیش رفته
        </Button>
        <Tooltip title="تنظیمات ستون‌ها" arrow>
          <IconButton
            id="column-settings-button"
            sx={{
              background: "#f0f0f0 !important",
              width: "30px !important",
              height: "30px !important",
              padding: "4px !important",
              marginRight: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => {
              // Used by cellManager to toggle settings panel
              const event = new CustomEvent('toggleColumnSettings');
              document.dispatchEvent(event);
            }}
          >
            ⚙️
          </IconButton>
        </Tooltip>
        <div className="flex gap-2 border rounded-md p-2 items-center mx-7">
          <span className="text-xs">تعداد سطر :‌</span>
          <Box
            component={"select"}
            value={limit}
            onChange={(e) => {
              setLimit(e.target.value);
              
              // Close all accordions when changing limit
              if (accordionManager) {
                accordionManager.closeAll();
              }
            }}
            sx={{
              background: (theme) => theme.palette.background.paper,
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
               <option value={1000}>1000</option>
          </Box>
        </div>{" "}
        <Tooltip title="حالت اسکرول بی‌نهایت" arrow>
          <IconButton
            sx={{
              background: infinteLoop[location]
                ? "#001ee4 !important"
                : "#f0f0f0 !important",
              width: "1.3rem !important",
              padding: "2px !important",
              height: "1.3rem !important",
              fontSize: "1.5rem !important",
              transition: "background-color 0.3s ease",
              marginRight: "8px",
            }}
            onClick={() => handleScroll()}
          >
            <IoIosInfinite
              style={{
                color: infinteLoop[location] ? "#fff" : "#001ee4",
                fontSize: "1.5rem !important",
              }}
            />
          </IconButton>
        </Tooltip>
        <IconButton
          sx={{
            background: "#f0f0f0 !important",
            width: "1.3rem !important",
            padding: "2px !important",
            height: "1.3rem !important",
            fontSize: "1.5rem !important",
          }}
          onClick={() => {
            selectionManager.deselectAll();
            setSearch("");
            setApplySearch("");
            setRefresh((r) => r + 1);
            setSortRules([{ headerName: "", direction: "asc" }]);
            
            // Close all accordions when refreshing
            if (accordionManager) {
              accordionManager.closeAll();
            }
          }}
        >
          <RefreshIcon sx={{ color: "#001ee4" }} />
        </IconButton>
      </div>
      {/* The counter will be updated through pure JS DOM manipulation */}
      <Confirm
        message={`آیا از حذف موارد انتخاب شده اطمینان دارید ؟‌`}
        close={() => setOpenC(false)}
        submit={handleDelete}
        open={openC}
        loading={loading}
      />
      <Confirm
        message={`آیا از  ${
          status ? `فعال کردن` : "غیر فعال کردن"
        } اطمینان دارید ؟‌`}
        close={() => setOpenA(false)}
        submit={() => handleActive(status)}
        open={openA}
        loading={loading}
      />
      <Modal
        open={openCustome}
        title="انتخاب نحو مرتب سازی"
        close={handleClose}
      >
        <div className="mx-3">
          {sortRules.map((rule, index) => (
            <div key={index} className="grid grid-cols-3 gap-3 my-3">
              {/* Dropdown for selecting header */}
              <FormControl sx={{ flex: 1, marginRight: "1rem" }}>
                <InputLabel>ستون</InputLabel>
                <Select
                  value={rule.headerName}
                  onChange={(e) =>
                    updateSortRule(index, "headerName", e.target.value)
                  }
                  label="ستون"
                >
                  {headers
                    .filter(
                      (header) => header.showInList && !header.showInExtra
                    )
                    .map((header) => (
                      <MenuItem key={header.name} value={header.name}>
                        {header.title}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              {/* Dropdown for selecting sort direction */}
              <FormControl sx={{ flex: 1, marginRight: "1rem" }}>
                <InputLabel>نوع</InputLabel>
                <Select
                  value={rule.direction}
                  onChange={(e) =>
                    updateSortRule(index, "direction", e.target.value)
                  }
                  label="نوع"
                >
                  <MenuItem value="asc">asc</MenuItem>
                  <MenuItem value="desc">desc</MenuItem>
                </Select>
              </FormControl>

              {/* Add/Remove rule buttons */}
              <div className="flex justify-end items-center">
                <IconButton onClick={() => removeSortRule(index)}>
                  <RemoveCircle color="error" />
                </IconButton>
                {index === sortRules.length - 1 && (
                  <IconButton onClick={addSortRule}>
                    <AddCircle color="info" />
                  </IconButton>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <Button onClick={handleClose}>انصراف</Button>
          <Button onClick={applyCustomSort} variant="contained" color="primary">
            ثبت اطلاعات
          </Button>
        </div>
      </Modal>
    </Box>
  );
};

export default React.memo(TableSearch);
const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip
    TransitionProps={{ timeout: 300 }}
    TransitionComponent={Fade}
    arrow
    disableInteractive
    {...props}
    classes={{ popper: className }}
  ></Tooltip>
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    boxShadow: "0 1px 3px 2px rgba(0, 0, 0, 0.3)",
  },
}));
