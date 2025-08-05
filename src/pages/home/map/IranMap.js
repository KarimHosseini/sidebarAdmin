// core libraries
import PropTypes from "prop-types";
import React, { useState } from "react";

// constants
import { useSelector } from "react-redux";
import { iransIslandsProperties } from "./constants/iransIslands";
import { iransSeasProperties } from "./constants/iransSeas";
import { iransStatesProperties } from "./constants/iransStates";

const IranMap = (props) => {
  const { themeColor } = useSelector((state) => state.themeColor);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: null,
  });

  // Find region by id in the regions data
  const isSelected = (pn) => {
    return props.reg?.find((item) => item.id === pn);
  };

  // Function to determine color based on sales count (not sale amount)
  const getSalesColor = (region) => {
    if (!region || !region.count)
      return `rgba(${props.defaultAreasColor}, 0.1)`;

    const count = region.count;

    // Define color ranges based on count
    if (count <= 10) {
      // Yellow (1-10) with gradation
      const intensity = 0.5 + (count / 10) * 0.5; // 0.5 to 1.0 intensity
      return `rgba(255, 215, 0, ${intensity})`;
    } else if (count <= 20) {
      // Orange (11-20) with gradation
      const intensity = 0.5 + ((count - 10) / 10) * 0.5; // 0.5 to 1.0 intensity
      return `rgba(255, 140, 0, ${intensity})`;
    } else if (count <= 30) {
      // Green (21-30) with gradation
      const intensity = 0.5 + ((count - 20) / 10) * 0.5; // 0.5 to 1.0 intensity
      return `rgba(50, 205, 50, ${intensity})`;
    } else if (count <= 50) {
      // Purple (31-50)
      const intensity = 0.5 + ((count - 30) / 20) * 0.5; // 0.5 to 1.0 intensity
      return `rgba(138, 43, 226, ${intensity})`;
    } else {
      // Red (50+)
      return `rgba(220, 20, 60, 1)`;
    }
  };

  // Handle mouse enter on map elements
  const handleMouseEnter = (e, region, name) => {
    if (region) {
      setTooltip({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        content: {
          title: name,
          sale: region.sale,
          count: region.count,
        },
      });
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  // Handle mouse move to update tooltip position
  const handleMouseMove = (e) => {
    if (tooltip.visible) {
      setTooltip({
        ...tooltip,
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  // Legend items for color ranges
  const legendItems = [
    { label: "1-10", color: "rgba(255, 215, 0, 0.8)" },
    { label: "11-20", color: "rgba(255, 140, 0, 0.8)" },
    { label: "21-30", color: "rgba(50, 205, 50, 0.8)" },
    { label: "31-50", color: "rgba(138, 43, 226, 0.8)" },
    { label: "50+", color: "rgba(220, 20, 60, 1)" },
  ];

  return (
    <div
      style={{
        height: props.height,
        width: "100%",
        backgroundColor: props.backgroundColor,
        position: "relative",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        version="1.1"
        id="iran"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 1200 1070.6"
        enableBackground="new 0 0 1200 1070.6"
        style={{ width: "100%", height: "100%" }}
      >
        <g id="provinces">
          {iransStatesProperties.map((iranState, index) => {
            const region = isSelected(iranState.id);
            return (
              <path
                key={index}
                id={iranState.persianName}
                onMouseEnter={(e) =>
                  handleMouseEnter(e, region, iranState.persianName)
                }
                fill={
                  region
                    ? getSalesColor(region)
                    : `rgba(${props.defaultAreasColor},${
                        props.data[iranState.name] / props.maxValue
                      }`
                }
                stroke="#9B9B9B"
                style={{ cursor: region ? "pointer" : "default" }}
                d={iranState.d}
              />
            );
          })}
          {iransSeasProperties.map((iranSea, index) => {
            const region = isSelected(iranSea.id);
            return (
              <path
                key={index}
                id={iranSea.persianName}
                onMouseEnter={(e) =>
                  handleMouseEnter(e, region, iranSea.persianName)
                }
                fill={region ? getSalesColor(region) : "#00BDFF"}
                stroke="#9B9B9B"
                style={{ cursor: region ? "pointer" : "default" }}
                d={iranSea.d}
              />
            );
          })}
        </g>

        <g id="islands">
          {iransIslandsProperties.map((iranIsland, index) => {
            const region = isSelected(iranIsland.id);
            return (
              <polygon
                key={index}
                id={iranIsland.persianName}
                onMouseEnter={(e) =>
                  handleMouseEnter(e, region, iranIsland.persianName)
                }
                fill={
                  region
                    ? getSalesColor(region)
                    : `rgba(${props.defaultAreasColor},${
                        props.data[iranIsland.name] / props.maxValue
                      }`
                }
                stroke="#9B9B9B"
                style={{ cursor: region ? "pointer" : "default" }}
                points={iranIsland.points}
              />
            );
          })}
        </g>
        {iransStatesProperties.map((iranState, index) => (
          <text
            key={index}
            textAnchor="start"
            x={`${iranState.ltrX}`}
            y={`${iranState.ltrY}`}
            fill={
              isSelected(iranState.id)
                ? props.selectedAreaTextColor
                : themeColor === "dark"
                ? "#fff"
                : "#000"
            }
            style={{
              fontSize: 16,
              fontWeight: "bold",
              transform: `rotate(${iranState.ltrRotate}deg)`,
              letterSpacing: "normal",
              pointerEvents: "none",
            }}
          >
            {iranState.persianNickName}
          </text>
        ))}

        {iransSeasProperties.map((iranSea, index) => (
          <text
            key={index}
            textAnchor="start"
            x={`${iranSea.ltrX}`}
            y={`${iranSea.ltrY}`}
            fill={isSelected(iranSea.id) ? props.selectedAreaTextColor : "#000"}
            style={{
              fontSize: 16,
              fontWeight: "bold",
              transform: `rotate(${iranSea.ltrRotate}deg)`,
              letterSpacing: "normal",
              pointerEvents: "none",
            }}
          >
            {iranSea.persianNickName}
          </text>
        ))}
      </svg>

      {/* Custom Tooltip */}
      {tooltip.visible && tooltip.content && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y + 10,
            left: tooltip.x + 10,
            backgroundColor:
              themeColor === "dark"
                ? "rgba(0,0,0,0.8)"
                : "rgba(255,255,255,0.9)",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            zIndex: 1000,
            direction: "rtl",
            fontSize: "14px",
            color: themeColor === "dark" ? "#fff" : "#000",
            minWidth: "150px",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "5px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "3px",
            }}
          >
            {tooltip.content.title}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "3px 0",
            }}
          >
            <span>تعداد فروش:</span>
            <span style={{ fontWeight: "bold" }}>
              {tooltip.content.count || 0}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>مبلغ فروش:</span>
            <span style={{ fontWeight: "bold" }}>
              {tooltip.content.sale
                ? `${tooltip.content.sale.toLocaleString("fa-IR")} تومان`
                : "0"}
            </span>
          </div>
        </div>
      )}

      {/* Color Legend */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          backgroundColor:
            themeColor === "dark" ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "5px",
          display: "flex",
          flexDirection: "column",
          fontSize: "12px",
        }}
      >
        <div
          style={{
            marginBottom: "5px",
            textAlign: "center",
            fontWeight: "bold",
            color: themeColor === "dark" ? "#fff" : "#000",
          }}
        >
          تعداد فروش
        </div>
        {legendItems.map((item, index) => (
          <div
            key={index}
            style={{ display: "flex", alignItems: "center", margin: "2px 0" }}
          >
            <div
              style={{
                width: "15px",
                height: "15px",
                backgroundColor: item.color,
                marginLeft: "5px",
                border: "1px solid #666",
              }}
            />
            <span style={{ color: themeColor === "dark" ? "#fff" : "#000" }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

IranMap.propTypes = {
  height: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  selectedArea: PropTypes.string.isRequired,
  defaultAreasColor: PropTypes.string,
  selectedAreaColor: PropTypes.string,
  selectedAreaTextColor: PropTypes.string,
  unselectedAreaTextColor: PropTypes.string,
};

// IranMap.defaultProps = {
//   defaultAreasColor: '255,0,0',
//   selectedAreaColor: '#00f',
//   selectedAreaTextColor: '#fff',
//   unselectedAreaTextColor: '#000',
//   backgroundColor: '#fff'
// }

export default IranMap;
