import React from "react";

/**
 * A component that displays a professional grid overlay for precise widget positioning
 */
const GridOverlay = ({ columns = 12, rows = 36 }) => {
  const columnArray = Array.from({ length: columns - 1 });
  const rowArray = Array.from({ length: rows - 1 });

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      {/* Column lines */}
      <div className="h-full w-full relative">
        {/* Main grid columns */}
        {columnArray.map((_, index) => (
          <div
            key={`col-${index}`}
            className={`absolute top-0 bottom-0 ${
              (index + 1) % 3 === 0
                ? "border-l border-blue-400 opacity-40"
                : "border-l border-blue-200 opacity-25"
            }`}
            style={{
              left: `${((index + 1) / columns) * 100}%`,
            }}
          >
            <div className="absolute top-0 bg-blue-600 text-white text-xs px-1 rounded-br-sm opacity-80">
              {index + 1}
            </div>
          </div>
        ))}

        {/* Row lines with primary/secondary styling */}
        {rowArray.map((_, index) => (
          <div
            key={`row-${index}`}
            className={`absolute left-0 right-0 ${
              (index + 1) % 4 === 0
                ? "border-t border-blue-400 opacity-40"
                : "border-t border-blue-200 opacity-25"
            }`}
            style={{
              top: `${((index + 1) / rows) * 100}%`,
            }}
          >
            <div className="absolute left-0 bg-blue-600 text-white text-xs px-1 rounded-tr-sm opacity-80">
              {index + 1}
            </div>
          </div>
        ))}

        {/* Column headers at top */}
        <div className="absolute top-0 left-0 right-0 flex justify-between px-0 text-xs bg-blue-900/20 py-1">
          {Array.from({ length: columns }).map((_, index) => (
            <div
              key={`col-number-${index}`}
              className={`flex-1 text-center font-medium ${
                index % 3 === 0 ? "text-blue-700" : "text-blue-500"
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* Zone markers for common layouts */}
        <div className="absolute top-8 left-0 right-0 flex justify-between opacity-30 pointer-events-none">
          <div className="border-r border-red-500 h-16 w-1/4 flex items-center justify-end pr-1">
            <span className="text-xs bg-red-500 text-white px-1 rotate-90">
              هدر
            </span>
          </div>
          <div className="border-l border-green-500 h-16 w-1/4 flex items-center justify-start pl-1">
            <span className="text-xs bg-green-500 text-white px-1 rotate-90">
              ساید‌بار
            </span>
          </div>
        </div>

        {/* Grid info panel */}
        <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs p-2 rounded shadow-md opacity-85">
          <div className="font-bold mb-1">شبکه طراحی داشبورد</div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-300 rounded-sm mr-1"></div>
            <span>
              {columns}×{rows} ستون و سطر
            </span>
          </div>
          <div className="text-blue-100 mt-1 text-[10px]">
            کلیک راست برای نمایش/مخفی کردن
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridOverlay;
