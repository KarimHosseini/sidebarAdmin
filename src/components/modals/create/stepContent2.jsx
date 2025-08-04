import { Box, Paper } from "@mui/material";
import React, { useState } from "react";
import { Dropdown } from "../../common";
import PulbicAtterbutites from "../dnd/pulbicAtterbutites";

const StepContent2 = ({
  currentValue,
  categories,
  attributes,
  setAllData,
  data,
  brands,
  blogcategories,
}) => {
  return (
    <Paper
    sx={{
      border: "1px solid #dbdfea",
      mb: 1,
      padding: "15px 16px 15px 16px",
    }}
      className="fle flex-col gap-10"
    >
      <div className="w-full md:w-[70%] mx-auto">
        <PulbicAtterbutites
          data={
            currentValue
              ? currentValue
              : data?.filter?.id === "0"
              ? categories
              : data?.filter?.id === "6"
              ? attributes
              : data?.filter?.id === "7"
              ? blogcategories
              : brands
          }
          sendData={setAllData}
          limit={data?.showCaseLimit}
        />
      </div>
    </Paper>
  );
};

export default React.memo(StepContent2);
