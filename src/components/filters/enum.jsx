import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { filterExistsInUrl, getFilterValueFromUrl } from "../../utils/filterUtils";

const Enums = ({
  item,
  data,
  changeFilter,
  removeFilter,
  refresh,
  defualtValue,
}) => {
  const [value, setValue] = useState();
  const [checked, setChecked] = useState(false);
  const [removed, setremoved] = useState(false);

  useEffect(() => {
    // First check URL for filter value
    const urlValue = getFilterValueFromUrl(item?.name);
    if (urlValue) {
      setValue(urlValue);
      setChecked(true);
      return;
    }
    
    // Then check default filter
    if (item?.defaultFilter && !checked) {
      setValue(item?.defaultFilter);
      setChecked(true);
    } else if (
      defualtValue &&
      defualtValue[item?.name] &&
      !checked &&
      !value &&
      !removed
    ) {
      setValue(defualtValue[item?.name]);
    }
  }, [item, checked, defualtValue, value, removed]);

  useEffect(() => {
    if (refresh > 0) {
      setValue();
    }
  }, [refresh]);

  // Find the current selected option
  const selectedOption =
    value !== undefined ? item.enums?.find((i) => i.value === value) : null;

  // Options for Autocomplete
  const options = [{ value: undefined, title: "هیج کدام" }, ...item.enums];

  return (
    <>
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.title || ""}
        value={selectedOption || null}
        sx={{
          ".MuiFormControl-root": {
            margin: "0px !important",
          },
          ".MuiInputBase-root": {
            padding: "7px 9px !important",
          },
        }}
        onChange={(event, newValue) => {
          if (!newValue || newValue.value === undefined) {
            removeFilter();
            setValue();
            setremoved(true);
          } else {
            changeFilter({
              name: item.name,
              value: newValue.value,
              type: "eq",
            });
            setValue(newValue.value);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={item.title}
            variant="outlined"
            fullWidth
            margin="normal"
          />
        )}
        isOptionEqualToValue={(option, value) => option.value === value.value}
      />
    </>
  );
};

export default React.memo(Enums);
