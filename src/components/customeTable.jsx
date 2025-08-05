/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Alert,
  Box,
  Pagination,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Modal } from "./common";

import SyncModel from "./syncModal";
import TableHeadData from "./TableHeadData";
import TableRowdata from "./TableRowdata";
import TableSearch from "./tableSearch";
import { createAccordionManager } from "../utils/accordionManager";
import { createCellManager } from "../utils/cellManager";
import { createTablePerformanceManager } from "../utils/tablePerformanceManager";

const CustomeLayout = ({
  title,
  children,
  headers,
  search,
  rows,
  actions = false,
  length,
  name,
  maxHeight,
  setSort,
  currentRow,
  loading,
  hasMore,
  CurrentPage,
  setPage,
  setSearch,
  setApplySearch,
  total_pages,
  page,
  selectionManager,
  setRefresh,
  setAllRows,
  editApi,
  setting,
  limit,
  setLimit,
  canSelect = true,
  alart,
  editInputApi,
  defualtSort,
  justForceDisabled,
  deleteAllApi,
  editActiveAllApi,
  neededFields = [],
}) => {
  // Get infinteLoop state from Redux
  const { infinteLoop } = useSelector((state) => state.relationals);
  const location = window.location.pathname;
  
  // Create the accordion manager
  const accordionManager = useRef(
    createAccordionManager({
      debug: process.env.NODE_ENV === 'development'
    })
  ).current;
  
  // Create the cell manager for header resizing and column hiding
  const cellManager = useRef(
    createCellManager({
      debug: process.env.NODE_ENV === 'development',
      minWidth: 80,
      maxWidth: 800
    })
  ).current;

  // Create the performance manager for optimized rendering
  const performanceManager = useRef(
    createTablePerformanceManager({
      enableVirtualScrolling: rows.length > 100,
      batchSize: rows.length > 1000 ? 100 : 50,
      rowHeight: setting?.TableType === "accordian" ? 60 : 53
    })
  ).current;

  const tableRef = useRef(null);

  // Infinite scroll observer setup
  const observer = useRef();
  const lastRowElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      console.log(infinteLoop[location], hasMore, "hasMore");
      if (infinteLoop[location]) {
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prevPage) => prevPage + 1);
          }
        });
        if (node) observer.current.observe(node);
      }
    },
    [loading, hasMore, infinteLoop, location, setPage]
  );

  //sorting
  const [isAsc, setIsAsc] = useState({});
  const [rowLenght, setRowLenght] = useState([]);
  const [allSync, setallSync] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Initialize performance manager when table is mounted
  useEffect(() => {
    if (tableRef.current) {
      performanceManager.initialize(tableRef.current);
    }
    
    return () => {
      performanceManager.destroy();
    };
  }, [performanceManager]);

  // Initialize DOM event listeners after component is mounted
  useEffect(() => {
    // Reference to track if we're currently in an initialization cycle
    let isInitializing = false;
    
    // Wait for checkboxes to be rendered
    const initializeCheckboxes = () => {
      // Prevent recursive calls
      if (isInitializing) return;
      isInitializing = true;
      
      console.log("Initializing checkbox listeners");
      
      try {
        // The important step: First restore the checked state of all checkboxes
        // before initializing listeners
        const selectedIds = selectionManager.getSelected();
        selectedIds.forEach(id => {
          const checkbox = document.getElementById(`checkbox-${id}`);
          if (checkbox) {
            checkbox.checked = true;
            const row = checkbox.closest('tr');
            if (row) row.classList.add('Mui-selected');
          }
        });
        
        // Then initialize listeners on these correctly-checked checkboxes
        // but ONLY for checkboxes that don't already have listeners
        document.querySelectorAll('input[id^="checkbox-"]').forEach(checkbox => {
          // Mark checkboxes as initialized to avoid adding listeners multiple times
          if (!checkbox.dataset.initialized) {
            if (checkbox.id === 'select-all-checkbox') {
              checkbox.addEventListener('click', (e) => {
                selectionManager.handleSelectAllClick(e);
              });
            } else {
              checkbox.addEventListener('click', (e) => {
                selectionManager.handleCheckboxClick(e);
              });
            }
            checkbox.dataset.initialized = 'true';
          }
        });
        
        console.log("Checkbox listeners initialized");
      } finally {
        isInitializing = false;
      }
    };
    
    // Multiple strategies to ensure initialization happens
    // 1. Immediate check (for when checkboxes are already in DOM)
    if (document.querySelector('input[id^="checkbox-"]')) {
      initializeCheckboxes();
    }
    
    // 2. After a short delay (backup for slow renders)
    const timerId = setTimeout(() => {
      console.log("Delayed initialization check");
      initializeCheckboxes();
    }, 100);
    
    // 3. MutationObserver for dynamic content
    const tableContainer = document.querySelector('.MuiTableContainer-root');
    if (tableContainer) {
      const observer = new MutationObserver(() => {
        // Only initialize if we find checkboxes that aren't initialized
        if (document.querySelector('input[id^="checkbox-"]:not([data-initialized])')) {
          console.log("MutationObserver triggered initialization");
          initializeCheckboxes();
        }
      });
      
      observer.observe(tableContainer, { 
        childList: true, 
        subtree: true 
      });
      
      return () => {
        clearTimeout(timerId);
        observer.disconnect();
      };
    }
    
    return () => {
      clearTimeout(timerId);
    };
  }, [selectionManager, accordionManager, cellManager]); // Depend on all managers

  useEffect(() => {
    if (defualtSort && !loaded) {
      setIsAsc(defualtSort);
      setLoaded(true);
    }
  }, [defualtSort]);

  useEffect(() => {
    if (headers?.length > 0) {
      var l = [{ display: true }];

      headers.map((item) => {
        if (item.showInList && !item.showInExtra) {
          Array.from(Array(item.colSpan).keys()).map((item, i) => {
            l.push({ display: true });
          });
          /*  l.push({ display: true }); */
        } else {
          l.push({ display: false });
        }
      });
      if (actions) {
        actions.map((item) => {
          l.push({ display: true });
        });
      }
      setRowLenght(l);
    }
  }, [headers]);

  const isMd = useMediaQuery("(min-width:900px)");

  // When data changes, close all accordions
  useEffect(() => {
    if (accordionManager && setting?.TableType === "accordian") {
      accordionManager.closeAll();
    }
  }, [loading, accordionManager, setting]);

  const getSync = (id) => {
    setallSync({ id, tableName: setting?.Sync });
    setOpenModal(true);
  };

  // Helper function to force restore selection state - can be called from anywhere
  const forceRestoreSelectionState = useCallback(() => {
    if (!rows?.length || !selectionManager) return;
    
    console.log('Manually restoring selection state');
    
    // Use the syncUI method from the selection manager
    selectionManager.syncUI(rows.map(row => row.id));
    
    // Update performance manager with selection states
    const selectedIds = selectionManager.getSelected();
    rows.forEach(row => {
      performanceManager.updateRowSelection(row.id, selectedIds.includes(row.id));
    });
  }, [rows, selectionManager, performanceManager]);
  
  // Call restore after data changes (sorting, filtering, pagination)
  useEffect(() => {
    if (!rows?.length || !selectionManager) return;
    
    // Use a small delay to ensure the DOM is ready
    const restoreSelectionTimeout = setTimeout(() => {
      forceRestoreSelectionState();
      
      // Reinitialize accordion buttons after data changes
      if (accordionManager && setting?.TableType === "accordian") {
        accordionManager.initializeAccordions();
      }
      
      // Reinitialize cell manager after data changes
      cellManager.initialize();
    }, 100);
    
    return () => clearTimeout(restoreSelectionTimeout);
  }, [rows, forceRestoreSelectionState, accordionManager, cellManager, setting]);

  // Optimize row updates using performance manager
  const handleCellUpdate = useCallback((rowId, cellIndex, value) => {
    performanceManager.updateCell(rowId, cellIndex, value);
  }, [performanceManager]);

  return (
    <Paper
      sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
      elevation={0}
    >
      {loading && rowLenght.length === 0 ? (
        <div>
          <Skeleton width={"100%"} height={100} />
          <Skeleton width={"100%"} sx={{ mt: "-122px" }} height={600} />
        </div>
      ) : (
        <>
          {" "}
          <TableSearch
            title={title}
            length={length}
            accordionManager={accordionManager}
            setApplySearch={setApplySearch}
            setSearch={setSearch}
            headers={headers}
            search={search}
            selectionManager={selectionManager}
            setSort={setSort}
            setIsAsc={setIsAsc}
            setRefresh={(e) => {
              setRefresh(e);
              setSort({});
              setIsAsc({});
              // Close all accordions when refreshing data
              if (accordionManager && setting?.TableType === "accordian") {
                accordionManager.closeAll();
              }
            }}
            setLimit={setLimit}
            limit={limit}
            deleteAllApi={deleteAllApi}
            editActiveAllApi={editActiveAllApi}
          />
          <Box
            sx={{
              overflowX: "auto",
              mt: "10px",
            }}
          >
            <TableContainer
              sx={{
                minHeight: "70vh",
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
              }}
            >
              <Table
                ref={tableRef}
                stickyHeader
                sx={{
                  minWidth: 950,
                  transform: {
                    md: "none",
                  },
                  /*        mt: 1, */
                  tableLayout: {
                    md: setting?.TableType !== "accordian" ? "fixed" : "auto",
                  },
                }}
                size="small"
              >
                <TableHeadData
                  selectionManager={selectionManager}
                  rows={rows}
                  headers={headers}
                  setSort={setSort}
                  setIsAsc={setIsAsc}
                  actions={actions}
                  setting={setting}
                  canSelect={canSelect}
                  isAsc={isAsc}
                />
                <TableBody>
                  {rows?.map((row, index) => {
                    // Apply ref to last row if infinite scroll is enabled
                    const isLastRow = index === rows.length - 1;
                    const rowRef =
                      isLastRow && infinteLoop[location]
                        ? lastRowElementRef
                        : null;

                    // We'll render the initial checkbox state but never update it through React
                    const isInitiallySelected = selectionManager.isSelected(row.id);

                    return (
                      <Fragment key={index + "bdy"}>
                        <TableRowdata
                          ref={rowRef}
                          setting={setting}
                          performanceManager={performanceManager}
                          row={row}
                          selectionManager={selectionManager}
                          accordionManager={accordionManager}
                          justForceDisabled={justForceDisabled}
                          headers={headers}
                          getSync={getSync}
                          currentRow={currentRow}
                          setAllRows={setAllRows}
                          editApi={editApi}
                          editInputApi={editInputApi}
                          actions={actions}
                          rows={rows}
                          index={index}
                          canSelect={canSelect}
                          isInitiallySelected={isInitiallySelected}
                          neededFields={neededFields}
                        />
                      </Fragment>
                    );
                  })}
                  {loading && (
                    <>
                      {Array.from(Array(3).keys()).map((item, i) => (
                        <TableRow key={i + "TableRowLoading"}>
                          <>
                            {rowLenght.map((item, index) => (
                              <TableCell
                                sx={{
                                  padding: item.display
                                    ? "4px"
                                    : "0px !important",
                                }}
                                /*    colSpan={item.display ? item.colSpan : 1} */
                                key={index + "TableCellLoadingChild"}
                              >
                                {item.display ? (
                                  <Skeleton height={30} />
                                ) : (
                                  <></>
                                )}
                              </TableCell>
                            ))}
                          </>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
              {/* Only show pagination if infinite scroll is disabled */}
              {total_pages > 1 && !infinteLoop[location] && (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isMd ? (
                    <Pagination
                      count={total_pages}
                      variant="outlined"
                      color="primary"
                      page={page}
                      /*     siblingCount={1}
                    boundaryCount={0} */
                      onChange={(_e, value) => {
                        setPage(value);
                        // Close all accordions when changing page
                        if (accordionManager && setting?.TableType === "accordian") {
                          accordionManager.closeAll();
                        }
                      }}
                      sx={{ my: 2 }}
                    />
                  ) : (
                    <Pagination
                      count={total_pages}
                      variant="outlined"
                      color="primary"
                      page={page}
                      siblingCount={1}
                      boundaryCount={0}
                      onChange={(_e, value) => {
                        setPage(value);
                        // Close all accordions when changing page
                        if (accordionManager && setting?.TableType === "accordian") {
                          accordionManager.closeAll();
                        }
                      }}
                      sx={{ my: 2 }}
                    />
                  )}
                </Box>
              )}
            </TableContainer>
          </Box>
        </>
      )}
      {alart && (
        <Alert variant="outlined" severity="info">
          {alart}
        </Alert>
      )}
      <Modal
        open={openModal}
        close={() => {
          setOpenModal(false);
          setallSync([]);
        }}
        title="تاریخچه سینک "
        autoWidth
      >
        <SyncModel id={allSync.id} tableName={allSync?.tableName} />
      </Modal>
    </Paper>
  );
};

export default CustomeLayout;
