/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, TableCell, TableRow } from "@mui/material";

import React, { forwardRef, Fragment, useEffect, useState, useRef } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TableCelldata from "./TableCelldata";

// Create motion-enhanced TableRow

const TableRowdata = forwardRef(
  (
    {
      setting,
      row,
      justForceDisabled,
      headers,
      getSync,
      currentRow,
      setOpen,
      setAllRows,
      editApi,
      editInputApi,
      actions,
      rows,
      index,
      canSelect,
      open,
      isInitiallySelected,
      selectionManager,
      accordionManager,
      neededFields = [],
      performanceManager,
    },
    ref
  ) => {
    const checkboxRef = useRef(null);
    const rowRef = useRef(null);
    
    // Set data-row-id attribute for performance manager
    useEffect(() => {
      if (rowRef.current && row.id) {
        rowRef.current.setAttribute('data-row-id', row.id);
      }
    }, [row.id]);
    
    useEffect(() => {
      if (!canSelect || !checkboxRef.current || !row.id) return;
      
      // If initialized already, skip
      if (checkboxRef.current.getAttribute('data-sm-initialized') === 'true') return;
      
      // Mark as initialized to prevent duplicate listeners
      checkboxRef.current.setAttribute('data-sm-initialized', 'true');
      
      // Set initial state
      const isSelected = selectionManager.isSelected(row.id);
      checkboxRef.current.checked = isSelected || isInitiallySelected;
      
      // Add to selection manager if initially selected
      if (isInitiallySelected && !isSelected) {
        selectionManager.select(row.id);
      }
      
      // Attach event listener
      checkboxRef.current.addEventListener('click', (e) => {
        selectionManager.handleCheckboxClick(e);
        // Update performance manager
        if (performanceManager) {
          performanceManager.updateRowSelection(row.id, e.target.checked);
        }
      });
    }, [canSelect, row.id, selectionManager, performanceManager]);


    return (
      <>
        <TableRow
          ref={rowRef}
          sx={{
            "& > *": {
              borderBottom:
                setting?.TableType === "accordian" ? "unset !important" : "",
            },
          }}
          className={selectionManager.isSelected(row.id) ? "Mui-selected" : ""}
          hover
          onMouseDown={() => currentRow(row)}
          key={index + "bdy"}
      
        >
          {canSelect && (
            <TableCell padding="checkbox">
              <input
                type="checkbox"
                id={`checkbox-${row.id}`}
                ref={checkboxRef}
                defaultChecked={selectionManager.isSelected(row.id) || isInitiallySelected}
                disabled={
                  justForceDisabled
                    ? row.isPayed ||
                      !row.transferToWallet ||
                      row.refoundWalletPaymentId ||
                      row.finalAmount === 0
                    : false
                }
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: '#1976d2'
                }}
              />
            </TableCell>
          )}
          {headers.map((item, i) => {
            if (item.showInList && !item.showInExtra) {
              return (
                <Fragment key={i + "TableRowdataTableCelldata"}>
                  <TableCelldata
                    row={row}
                    item={item}
                    index={i}
                    rows={rows}
                    setAllRows={setAllRows}
                    editApi={editApi}
                    editInputApi={editInputApi}
                    performanceManager={performanceManager}
                    onCellUpdate={(value) => {
                      if (performanceManager) {
                        performanceManager.updateCell(row.id, i, value);
                      }
                    }}
                  />
              {/*     {Array.from(Array(item.colSpan - 1).keys()).map(
                    (item, index) => (
                      <TableCell
                        key={index + "EmptyTableCell"}
                        sx={{ padding: "0px !important" }}
                      >
                        <></>
                      </TableCell>
                    )
                  )} */}
                </Fragment>
              );
            }
          })}

          {actions &&
            actions.map((action, index) => (
              <TableCell align="center" key={index + "ActionTableCell"}>
              {/*   {typeof action.handler === "function"
                  ? action.handler(row)
                  : React.cloneElement(action.handler, {
                      onClick: action?.handler?.props?.onClick?.bind(null, row),
                    })} */}
              </TableCell>
            ))}
          {setting?.sync && (
            <TableCell align="center" key={index + "SyncTableCell"}>
              <Box sx={{ width: 100 }} onClick={() => getSync(row.id)}>
                آخرین بروزرسانی همگام سازی
              </Box>
            </TableCell>
          )}
          {setting?.TableType === "accordian" && (
            <TableCell sx={{ padding: 0 }}>
              <button
                className="accordion-toggle-btn"
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  accordionManager.toggle(row.id);
                }}
              >
                <ArrowDropDownIcon 
                  sx={{ 
                    transition: 'transform 0.3s',
                    transform: accordionManager.isOpen(row.id) ? 'rotate(180deg)' : 'rotate(0deg)'
                  }} 
                />
              </button>
            </TableCell>
          )}
        </TableRow>
        {setting?.TableType === "accordian" && (
          <TableRow>
            <TableCell
              sx={{ padding: "0px !important" }}
              colSpan={headers.filter(h => h.showInList).length + (actions ? actions.length : 0) + (canSelect ? 1 : 0) + 2}
            >
              <div 
                className="accordion-content" 
                data-accordion-id={row.id}
                style={{
                  maxHeight: '0px',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease-out'
                }}
              >
                <Box sx={{ p: 2 }}>
                  {/* Render extra fields that are not shown in the main table */}
                  {headers.map((item, index) => {
                    if (item.showInExtra) {
                      return (
                        <Box key={index} sx={{ mb: 1 }}>
                          <strong>{item.title}: </strong>
                          {row[item.name] || '-'}
                        </Box>
                      );
                    }
                    return null;
                  })}
                </Box>
              </div>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  }
);

export default TableRowdata;
