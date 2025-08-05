import { useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import IranMap from "./IranMap";
import testData from "./test-data.js";
const InteractiveIranMap = ({
  data = testData,
  height = 400,
  defaultAreasColor = "255,255,255",
  selectedAreaColor = "#00f",
  selectedAreaTextColor = "#000",
  unselectedAreaTextColor = "#000",
  backgroundColor = "transparent",
  defaultSelectedArea = "tehran",
  setSelected,
  reg,
}) => {
  const [state, setState] = React.useState({
    selectedArea: defaultSelectedArea,
  });
  const { themeColor } = useSelector((state) => state.themeColor);

  const selectAreaHandler = (area) => {
    setState((prevState) => ({ ...prevState, selectedArea: area.name }));
  };

  useEffect(() => {
    setSelected(state);
  }, [state, setSelected]);

  let arr = Object.values(data);
  let max = Math.max(...arr);
  const isMd = useMediaQuery("(min-width:900px)");

  return (
    <div>
      <IranMap
        onClick={selectAreaHandler}
        height={isMd ? height : 300}
        data={data}
        maxValue={max}
        reg={reg}
        selectedArea={state.selectedArea}
        defaultAreasColor={themeColor === "dark" ? "0,0,0" : "255,255,255"}
        selectedAreaColor={selectedAreaColor}
        selectedAreaTextColor={selectedAreaTextColor}
        unselectedAreaTextColor={themeColor === "dark" ? "#fff" : "#000"}
        backgroundColor={backgroundColor}
      />
    </div>
  );
};

export default InteractiveIranMap;
