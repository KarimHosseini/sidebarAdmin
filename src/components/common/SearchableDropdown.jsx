/* eslint-disable react-hooks/exhaustive-deps */
import { Autocomplete, Box, Chip, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const SearchableDropdown = ({
  data,
  change,
  multiple = true,
  disable = false,
  label = "",
  rerenderAfterChange = false,
  values = [],
}) => {
  const [defualtValues, setDefualtValues] = useState([]);
  useEffect(() => {
    if (rerenderAfterChange) {
      setDefualtValues([]);
    }
  }, [data]);
  useEffect(() => {
    if (defualtValues.length === 0 && values.length > 0) {
      setDefualtValues(values);
    }
  }, [values]);
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="caption">{label}</Typography>
      <Autocomplete
        size="small"
        disabled={disable}
        sx={{ width: "100%", mouseEvents: "none" }}
        multiple={multiple}
        getOptionLabel={(option) => option.title}
        options={data}
        defaultValue={[data[0], data[1]]}
        value={defualtValues}
        onChange={(e, newValue) => {
          if (!multiple) {
            change(data.find((item) => item.title === e.target.innerText));
          }

          setDefualtValues(newValue);
          change(newValue);
        }}
        renderTags={(value, getTagProps) => {
          return value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option.title}
              {...getTagProps({ index })}
              sx={{ direction: "ltr" }}
            />
          ));
        }}
        renderInput={(params) => <TextField {...params} variant="standard" />}
      />
    </Box>
  );
};

export default SearchableDropdown;
