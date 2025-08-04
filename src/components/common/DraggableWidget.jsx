import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import GridViewIcon from "@mui/icons-material/GridView";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import {
  getColSpanClass,
  getGridPositionStyle,
  getRowSpanClass,
} from "../../utils/widgetLayout";

/**
 * A professional grid positioning dialog
 */
const GridPositioningDialog = ({
  open,
  onClose,
  colStart,
  colSpan,
  rowStart,
  rowSpan,
  onColStartChange,
  onColSpanChange,
  onRowStartChange,
  onRowSpanChange,
  onSave,
}) => {
  // Create a visual representation of the grid with the current position
  const renderGridPreview = () => {
    const cells = [];
    const gridSize = 12;
    const rowSize = 5;

    // Create the grid preview cells
    for (let row = 0; row < rowSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const isSelected =
          col >= colStart - 1 &&
          col < colStart - 1 + colSpan &&
          row >= rowStart - 1 &&
          row < rowStart - 1 + Math.min(rowSpan, rowSize - rowStart + 1);

        const isMajorCell = (col + 1) % 3 === 0;

        cells.push(
          <div
            key={`preview-${row}-${col}`}
            className={`
              ${
                isSelected
                  ? "bg-blue-500 text-white border-blue-600"
                  : isMajorCell
                  ? "bg-gray-100 text-gray-600 border-gray-300"
                  : "bg-gray-50 text-gray-500 border-gray-200"
              } 
              border flex items-center justify-center text-xs
              ${row === 0 ? "rounded-t" : ""}
              ${row === rowSize - 1 ? "rounded-b" : ""}
              transition-all duration-200
            `}
            style={{ aspectRatio: "1" }}
          >
            {col + 1}
          </div>
        );
      }
    }

    return (
      <div className="grid grid-cols-12 gap-px bg-gray-200 p-1 rounded">
        {cells}
      </div>
    );
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-opacity duration-300
        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
      onClick={onClose}
    >
      <div
        className="rounded-lg  p-4 max-w-md w-full mx-4 max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            تنظیم موقعیت در شبکه
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">بستن</span>
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Grid preview */}
          <div className="mb-3">
            {renderGridPreview()}
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
              پیش‌نمایش موقعیت
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Column controls */}
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ستون‌ها
              </div>

              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    ستون شروع
                  </label>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {colStart}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={13 - colSpan}
                  value={colStart}
                  onChange={(e) => onColStartChange(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-gray-700"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    عرض (تعداد ستون)
                  </label>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {colSpan}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={13 - colStart}
                  value={colSpan}
                  onChange={(e) => onColSpanChange(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-gray-700"
                />
              </div>
            </div>

            {/* Row controls */}
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                سطرها
              </div>

              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    سطر شروع
                  </label>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {rowStart}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={37 - rowSpan}
                  value={rowStart}
                  onChange={(e) => onRowStartChange(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-gray-700"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    ارتفاع (تعداد سطر)
                  </label>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {rowSpan}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={37 - rowStart}
                  value={rowSpan}
                  onChange={(e) => onRowSpanChange(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center text-xs text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
            <div>
              <span className="font-medium">موقعیت ستون: </span>
              {colStart} / {colStart + colSpan}
            </div>
            <div>
              <span className="font-medium">موقعیت سطر: </span>
              {rowStart} / {rowStart + rowSpan}
            </div>
          </div>

          <div className="flex justify-end pt-2 space-x-2 rtl:space-x-reverse border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              انصراف
            </button>
            <button
              onClick={onSave}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              اعمال تغییرات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Draggable widget component with positioning capabilities
 */
const DraggableWidget = ({
  id,
  index,
  cols,
  children,
  onResize,
  isDragMode,
  className,
  gridColumn,
  gridRow,
  onPositionChange,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [positionAnchorEl, setPositionAnchorEl] = useState(null);
  const [showPositionDialog, setShowPositionDialog] = useState(false);

  // Column positioning
  const [colStart, setColStart] = useState(
    gridColumn ? parseInt(gridColumn.split(" / ")[0]) : 1
  );
  const [colSpan, setColSpan] = useState(cols || 1);

  // Row positioning
  const [rowStart, setRowStart] = useState(
    gridRow ? parseInt(gridRow.split(" / ")[0]) : 1
  );
  const [rowSpan, setRowSpan] = useState(
    gridRow
      ? parseInt(gridRow.split(" / ")[1]) - parseInt(gridRow.split(" / ")[0])
      : 1
  );

  const widgetRef = useRef(null);

  const open = Boolean(anchorEl);
  const positionOpen = Boolean(positionAnchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePositionClick = (event) => {
    setPositionAnchorEl(event.currentTarget);
  };

  const handlePositionClose = () => {
    setPositionAnchorEl(null);
  };

  const handleGridClick = (event) => {
    // Initialize with current values
    if (gridColumn) {
      const parts = gridColumn.split(" / ");
      if (parts.length === 2) {
        setColStart(parseInt(parts[0]));
        setColSpan(parseInt(parts[1]) - parseInt(parts[0]));
      }
    }

    if (gridRow) {
      const parts = gridRow.split(" / ");
      if (parts.length === 2) {
        setRowStart(parseInt(parts[0]));
        setRowSpan(parseInt(parts[1]) - parseInt(parts[0]));
      }
    } else {
      setRowStart(1);
      setRowSpan(1);
    }

    setShowPositionDialog(true);
  };

  const handleResize = (newSize) => {
    onResize(id, newSize);
    handleClose();
  };

  const handlePositionSave = () => {
    // Convert slider values to grid CSS format
    const newGridColumn = `${colStart} / ${colStart + colSpan}`;
    const newGridRow = `${rowStart} / ${rowStart + rowSpan}`;

    if (onPositionChange) {
      onPositionChange(id, newGridColumn, newGridRow);
    }

    setShowPositionDialog(false);
  };

  // Handle changes to sliders
  const handleColStartChange = (value) => {
    setColStart(value);
    if (value + colSpan > 13) {
      setColSpan(13 - value);
    }
  };

  const handleColSpanChange = (value) => {
    setColSpan(value);
  };

  const handleRowStartChange = (value) => {
    setRowStart(value);
    if (value + rowSpan > 37) {
      setRowSpan(37 - value);
    }
  };

  const handleRowSpanChange = (value) => {
    setRowSpan(value);
  };

  // Calculate inline styles for grid positioning
  const gridStyle = getGridPositionStyle({ gridColumn, gridRow });

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={!isDragMode}>
      {(provided, snapshot) => (
        <div
          ref={(el) => {
            provided.innerRef(el);
            widgetRef.current = el;
          }}
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            ...gridStyle,
          }}
          className={`relative ${getColSpanClass(cols)} ${
            gridRow
              ? getRowSpanClass(
                  Number(gridRow.split(" / ")[1]) -
                    Number(gridRow.split(" / ")[0])
                )
              : ""
          } ${snapshot.isDragging ? "z-50 dragging" : ""} ${className || ""}`}
        >
          <Box className="rounded-md relative overflow-hidden h-full">
            {isDragMode && (
              <div
                className="absolute top-0 right-0 left-0 z-10 bg-blue-50 dark:bg-blue-900/20 h-8 flex items-center justify-between px-2"
                {...provided.dragHandleProps}
              >
                <div className="flex items-center">
                  <DragIndicatorIcon
                    fontSize="small"
                    className="text-blue-500 mr-1"
                  />
                  <span className="text-xs text-blue-500">برای حرکت بکشید</span>
                </div>

                <div className="flex items-center gap-1">
                  <Tooltip title="تنظیم موقعیت در شبکه">
                    <IconButton size="small" onClick={handleGridClick}>
                      <GridViewIcon
                        fontSize="small"
                        className="text-blue-500"
                      />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="تغییر اندازه">
                    <IconButton size="small" onClick={handleClick}>
                      {cols === 4 ? (
                        <FullscreenExitIcon
                          fontSize="small"
                          className="text-blue-500"
                        />
                      ) : (
                        <FullscreenIcon
                          fontSize="small"
                          className="text-blue-500"
                        />
                      )}
                    </IconButton>
                  </Tooltip>
                </div>

                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <MenuItem
                    onClick={() => handleResize(1)}
                    disabled={cols === 1}
                  >
                    کوچک (۱ ستون)
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleResize(2)}
                    disabled={cols === 2}
                  >
                    متوسط (۲ ستون)
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleResize(3)}
                    disabled={cols === 3}
                  >
                    بزرگ (۳ ستون)
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleResize(4)}
                    disabled={cols === 4}
                  >
                    عرض کامل (۴ ستون)
                  </MenuItem>
                </Menu>

                <Menu
                  anchorEl={positionAnchorEl}
                  open={positionOpen}
                  onClose={handlePositionClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                >
                  <div
                    className="p-3 flex flex-col gap-2"
                    style={{ width: "250px" }}
                  >
                    <div className="text-xs text-blue-500 mb-1">
                      تنظیم موقعیت دقیق
                    </div>
                    <TextField
                      size="small"
                      label="موقعیت ستون"
                      fullWidth
                      placeholder="مثال: 1 / 3"
                      value={gridColumn || ""}
                      onChange={(e) =>
                        onPositionChange(id, e.target.value, gridRow)
                      }
                      helperText="ستون شروع / ستون پایان"
                    />
                    <TextField
                      size="small"
                      label="موقعیت سطر"
                      fullWidth
                      placeholder="مثال: 1 / 3"
                      value={gridRow || ""}
                      onChange={(e) =>
                        onPositionChange(id, gridColumn, e.target.value)
                      }
                      helperText="سطر شروع / سطر پایان"
                    />
                  </div>
                </Menu>
              </div>
            )}

            <div className={isDragMode ? "mt-8 h-full" : "h-full"}>
              {children}
            </div>
          </Box>

          {/* Enhanced position dialog */}
          <GridPositioningDialog
            open={showPositionDialog}
            onClose={() => setShowPositionDialog(false)}
            colStart={colStart}
            colSpan={colSpan}
            rowStart={rowStart}
            rowSpan={rowSpan}
            onColStartChange={handleColStartChange}
            onColSpanChange={handleColSpanChange}
            onRowStartChange={handleRowStartChange}
            onRowSpanChange={handleRowSpanChange}
            onSave={handlePositionSave}
          />
        </div>
      )}
    </Draggable>
  );
};

export default DraggableWidget;
