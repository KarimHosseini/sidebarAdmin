import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";

const CheckBox = ({ item, data, setData }) => {
  return (
    <div>
      {" "}
      <FormControlLabel
        control={<Checkbox checked={data[item.id]} />}
        onChange={() => {
          setData({ ...data, [item.id]: !data[item.id] });
        }}
        label={<h2 className=" text-[0.78rem]">{item.title}</h2>}
      />
    </div>
  );
};

export default CheckBox;
