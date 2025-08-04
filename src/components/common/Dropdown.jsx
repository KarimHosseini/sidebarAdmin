import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

const Dropdown = ({
  change = () => {
    return null;
  },
  data = [],
  title,
  value = "",
  search = null,
  searchValue = null,
  click = () => {
    return null;
  },
  disabled = false,
  emptyValue = false,
  readOnly,
  err,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!value) {
      setSelectedOption(null);
      setInputValue("");
      return;
    }

    if (typeof value === "string" || typeof value === "number") {
      setSelectedOption(value);
      setInputValue(String(value));
      return;
    }

    if (value && value.id !== undefined && data && data.length > 0) {
      const matchingOption = data.find((item) => item.id === value.id);
      if (matchingOption) {
        setSelectedOption(matchingOption);
        setInputValue(matchingOption.title || "");
      } else {
        setSelectedOption(value);
        setInputValue(value.title || "");
      }
    } else {
      setSelectedOption(value);
      setInputValue(value.title || "");
    }
  }, [value, data]);

  const getOptionLabel = (option) => {
    if (!option) return "";
    if (typeof option === "string" || typeof option === "number") {
      return String(option);
    }
    return option?.title || option?.attributeTitle || "";
  };

  const isOptionEqualToValue = (option, value) => {
    if (!option && !value) return true;
    if (!option || !value) return false;

    if (option.id !== undefined && value.id !== undefined) {
      return option.id === value.id;
    }

    if (typeof option === "string" && typeof value === "string") {
      return option === value;
    }

    if (option.title && value.title) {
      return option.title === value.title;
    }

    return JSON.stringify(option) === JSON.stringify(value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        width: "100%",
        ".MuiAutocomplete-clearIndicator": {
          display: "none !important",
        },
      }}
    >
      <FormControl disabled={disabled} variant="outlined" error={err} fullWidth>
        <Autocomplete
          disabled={disabled || readOnly}
          options={data || []}
          value={selectedOption}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
            if (search) {
              search(newInputValue);
            }
          }}
          onChange={(event, newValue) => {
            setSelectedOption(newValue);
            if (newValue) {
              setInputValue(getOptionLabel(newValue));
            } else {
              setInputValue("");
            }
            change(newValue);
            click(newValue);
          }}
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={isOptionEqualToValue}
          renderInput={(params) => (
            <TextField
              {...params}
              label={title}
              variant="outlined"
              error={err}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "48px",
                  fontSize: "0.83rem !important",
                },
              }}
            />
          )}
          renderOption={(props, option) => (
            <MenuItem
              {...props}
              key={option?.id || props?.id || Math.random()}
              sx={{ direction: "rtl", fontSize: "0.83rem !important" }}
              disabled={option?.disabled}
            >
              <div className="flex gap-2 items-center">
                {option?.image && (
                  <img src={option?.image} alt="" className="w-8" />
                )}
                {getOptionLabel(option)}
              </div>
            </MenuItem>
          )}
          filterOptions={(options, state) => {
            if (search) {
              return options;
            }

            return options.filter((option) =>
              getOptionLabel(option)
                .toLowerCase()
                .includes(state.inputValue.toLowerCase())
            );
          }}
          noOptionsText="موردی یافت نشد"
          fullWidth
        />
        {err && (
          <FormHelperText sx={{ textAlign: "left" }}>
            این فیلد را به درستی پر کنید
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};

const styles = {
  container: {
    height: "40px",
    direction: "rtl",
    width: "100%",
    minWidth: "230px",
  },
  selectBox: { height: "48px", fontSize: "0.83rem !important" },
  helper: { textAlign: "center" },
};

export default Dropdown;
