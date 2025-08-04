/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import React, { Fragment, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const TableHeadData = ({
  selectionManager,
  rows,
  headers,
  setSort,
  setIsAsc,
  actions,
  setting,
  canSelect,
  isAsc,
}) => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const selectAllRef = useRef(null);
  
  // Initialize select-all checkbox
  useEffect(() => {
    if (!canSelect || !selectAllRef.current) return;
    
    // If already initialized, skip
    if (selectAllRef.current.getAttribute('data-sm-initialized') === 'true') return;
    
    // Mark as initialized
    selectAllRef.current.setAttribute('data-sm-initialized', 'true');
    
    // Attach event listener
    selectAllRef.current.addEventListener('click', (e) => {
      selectionManager.handleSelectAllClick(e);
    });
    
    // Sync UI state based on currently visible rows
    selectionManager.syncUI(rows.map(row => row.id));
  }, [canSelect, selectionManager, rows]);
  
  // Update select-all state when rows or selection changes
  useEffect(() => {
    if (!canSelect || !rows.length || !selectAllRef.current) return;
    
    // Get current selection
    const selectedIds = selectionManager.getSelected();
    
    // Calculate if all or some visible rows are selected
    const visibleIds = rows.map(row => row.id);
    const selectedVisibleIds = visibleIds.filter(id => selectedIds.includes(id));
    
    if (selectedVisibleIds.length === 0) {
      // None selected
      selectAllRef.current.checked = false;
      selectAllRef.current.indeterminate = false;
    } else if (selectedVisibleIds.length === visibleIds.length) {
      // All selected
      selectAllRef.current.checked = true;
      selectAllRef.current.indeterminate = false;
    } else {
      // Some selected
      selectAllRef.current.indeterminate = true;
    }
  }, [canSelect, rows, selectionManager]);
  
  console.log("render table head data ....");

  return (
    <TableHead>
      <TableRow>
        {canSelect && (
          <TableCell padding="checkbox">
            <input
              type="checkbox"
              id="select-all-checkbox"
              ref={selectAllRef}
              style={{
                width: '18px',
                height: '18px',
                border: '1px solid #bdbdbd',
                borderRadius: '2px',
                cursor: 'pointer',
                accentColor: '#1976d2'
              }}
            />
          </TableCell>
        )}

        {headers?.map((header, i) => (
          <Fragment key={header.title + "body"}>
            {header.showInList && !header.showInExtra ? (
              <>
                <TableCell
                  colSpan={header.colSpan || 1}
                  sx={{ fontSize: "0.7rem !important" }}
                >
                  {header.hasOrder ? (
                    <TableSortLabel
                      sx={{
                        svg: {
                          height: "0.6em",
                          width: "0.6em",
                        },
                        fontSize: "0.73rem !important",
                        "&:hover": {
                          svg: {
                            color: "#001ee4!important",
                          },
                        },
                        color: (theme) =>
                          theme.palette.mode === "light"
                            ? "#000 !important"
                            : "#fff  !important",
                      }}
                      active={true}
                      direction={isAsc[header.name] ? "asc" : "desc"}
                      onClick={() => {
                        var temp = { ...isAsc };
                        delete temp[header.name];
                        setSort({
                          ...temp,
                          [header.name]: !isAsc[header.name],
                        });
                        setIsAsc({
                          ...isAsc,
                          [header.name]: !isAsc[header.name],
                        });
                      }}
                    >
                      {header.title}
                    </TableSortLabel>
                  ) : (
                    header.title
                  )}
                </TableCell>
              </>
            ) : (
              <Fragment key={i + "ss"}>
                <TableCell
                  sx={{
                    width: "0px !important",
                    padding: "0px !important",
                  }}
                ></TableCell>
              </Fragment>
            )}
          </Fragment>
        ))}
        {actions && (
          /* setting?.TableType !== "accordian" && */ <>
            {setting?.Sync && (
              <>
                {userPermissions?.Sync?.update && (
                  <TableCell sx={{ fontSize: "0.7rem !important" }}>
                    سینک
                  </TableCell>
                )}
                {userPermissions?.Sync?.view && (
                  <TableCell sx={{ fontSize: "0.7rem !important" }}>
                    تاریخچه سینک
                  </TableCell>
                )}
              </>
            )}
            {actions?.map((action) => (
              <TableCell
                sx={{ fontSize: "0.7rem !important" }}
                key={action.title + "action"}
              >
                {action?.title}
              </TableCell>
            ))}
          </>
        )}
        {setting?.TableType === "accordian" ? <TableCell></TableCell> : <></>}
      </TableRow>
    </TableHead>
  );
};

export default React.memo(TableHeadData);
