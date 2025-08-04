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
    },
    ref
  ) => {
    const checkboxRef = useRef(null);
    


    
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
      });
    }, [canSelect, row.id, selectionManager]);


    return (
      <>
        <TableRow
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
            if (
              row[item.name] !== undefined &&
              item.showInList &&
              !item.showInExtra
            ) {
              return (
                <Fragment key={i + "condi"}>
                  <TableCell
                    onClick={() => {
                      // No longer needed - accordion state is managed by the accordionManager
                    }}
                    colSpan={item.colSpan || 1}
                  >
                    <TableCelldata
                      row={row}
                      item={item}
                      rows={rows}
                      setAllRows={setAllRows}
                      editApi={editApi}
                      editInputApi={editInputApi}
                    />
                  </TableCell>
                </Fragment>
              );
            } else {
              return (
                <Fragment key={i + "vdsvsd"}>
                  <TableCell
                    sx={{
                      width: "0px !important",
                      padding: "0px !important",
                    }}
                  ></TableCell>
                </Fragment>
              );
            }
          })}
                    {actions && (
            <>
              {actions?.map((action, idx) => {
                // Create data attributes object from neededFields
                const dataAttributes = {};
                neededFields.forEach(field => {
                  if (row[field] !== undefined) {
                    dataAttributes[`data-${field.toLowerCase()}`] = row[field];
                  }
                });

                return (
                  <TableCell id={`action-cell-${index}`} key={idx + "actionBody"}>
                    <div {...dataAttributes} style={{ display: 'inline-block' }}>
                      {action?.handler}
                    </div>
                  </TableCell>
                );
              })}
            </>
          )}
          {setting?.TableType === "accordian" ? (
            <TableCell>
              <button
                className="accordion-toggle-btn"
                data-row-id={row.id}
                data-index={index}
                aria-label="expand row"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '8px'
                }}
              >
                <ArrowDropDownIcon />
              
              </button>
            </TableCell>
          ) : (
            <></>
          )}
        </TableRow>

        {setting?.TableType === "accordian" ? (
          <TableRow 
            id={`accordion-row-${row.id}`}
            onMouseDown={() => currentRow(row)}
          >
            <TableCell style={{ padding: 0 }} colSpan={500}>
              {/* The display property will be controlled by the accordionManager directly in the DOM */}
              <div 
                id={`accordion-content-${row.id}`}
                style={{ display: 'none' }}
              >
                <Box
                  sx={{
                    background: (theme) =>
                      theme.palette.mode === "light"
                        ? "rgb(239 246 255)"
                        : "rgb(32 44 85)",
                  }}
                  className="flex gap-8 mb-4 p-4 border-t border-dashed"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    {headers.map((item, i) => {
                      if (
                        row[item.name] !== undefined &&
                        item.showInList &&
                        item.showInExtra
                      ) {
                        return (
                          <Fragment key={i + "dsvsdvds11"}>
                            <span className="text-[#8c8c8c]">
                              {item.title} :{" "}
                            </span>
                            <span className="font-bold">
                              {" "}
                              <TableCelldata
                                row={row}
                                item={item}
                                rows={rows}
                                setAllRows={setAllRows}
                                editApi={editApi}
                                editInputApi={editInputApi}
                              />
                            </span>
                          </Fragment>
                        );
                      }
                    })}
                  </div>
                </Box>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          <></>
        )}
      </>
    );
  }
);

// Custom comparison function that ignores selectionManager and accordionManager changes
const areEqual = (prevProps, nextProps) => {
  // Never re-render when selections or accordion states change
  // Instead, we'll directly manipulate the DOM without React
  
  // We only care about:
  // 1. Changes to the data itself
  // 2. Other props that would legitimately require a re-render
  return (
    prevProps.row.id === nextProps.row.id &&
    prevProps.index === nextProps.index
    // We don't check selectionManager, accordionManager, or open state on purpose
  );
};

// Use React.memo with our custom comparison function to prevent unnecessary re-renders
export default React.memo(TableRowdata, areEqual);
