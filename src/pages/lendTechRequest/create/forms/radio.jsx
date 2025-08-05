import { FormControlLabel, Radio } from "@mui/material";
import React from "react";

const CustomeRadio = ({ item, data, setData }) => {
  return (
    <>
      {" "}
      <div className="flex gap-3 items-center">
        <span className="text-xs text-blue-700">{item.title} </span>
        <FormControlLabel
          onClick={() => {
            setData({ ...data, [item.id]: true });
          }}
          value="male"
          control={<Radio size="small" checked={data[item.id]} />}
          label=" بله"
          sx={{ zIndex: 200 }}
        />{" "}
        <FormControlLabel
          onClick={() => {
            setData({ ...data, [item.id]: false });
          }}
          value="male"
          control={<Radio size="small" checked={!data[item.id]} />}
          label=" خیر"
          sx={{ zIndex: 200 }}
        />
      </div>
    </>
  );
};

export default CustomeRadio;
