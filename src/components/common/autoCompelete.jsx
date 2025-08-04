import { Autocomplete, Chip, TextField } from "@mui/material";
import React from "react";

const AutocompleteTag = ({ disable, label, data, value, change }) => {
  return (
    <>
      {" "}
      <Autocomplete
        sx={{
          ".MuiOutlinedInput-root ": {
            padding: "7px !important",
          },
        }}
        disablePortal
        id="combo-box-demo"
        fullWidth
        options={data}
        disabled={disable}
        getOptionLabel={(option) => option.title}
        renderInput={(params) => <TextField {...params} label={label} />}
        value={value}
        onChange={(event, newValue) => {
          change(newValue);
        }}
      />
    </>
  );
};

export default AutocompleteTag;
