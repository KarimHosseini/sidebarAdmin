import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import React, { useEffect, useState, useCallback } from "react";
import { getFilterValueFromUrl } from "../../utils/filterUtils";

const TextFilter = ({ changeFilter, item, refresh, defualtValue }) => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  
  useEffect(() => {
    if (refresh > 0) {
      setInputValue("");
      setDebouncedValue("");
    }
  }, [refresh]);
  
  // Load existing filter value from URL
  useEffect(() => {
    const urlValue = getFilterValueFromUrl(item?.name);
    if (urlValue && urlValue !== 'null' && urlValue !== 'undefined') {
      setInputValue(urlValue);
      setDebouncedValue(urlValue);
    } else if (!inputValue && defualtValue && defualtValue[item?.name]) {
      setInputValue(defualtValue[item?.name]);
      setDebouncedValue(defualtValue[item?.name]);
    }
  }, [defualtValue, item?.name, inputValue]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 300);
    
    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);
  
  useEffect(() => {
    if (debouncedValue !== "") {
      changeFilter({
        name: item.name,
        value: debouncedValue,
        type: "lk",
      });
    }
  }, [debouncedValue, changeFilter, item.name]);
  
  const handleClear = useCallback(() => {
    setInputValue("");
    setDebouncedValue("");
  }, []);
  
  return (
    <TextField
      label={item.title}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      fullWidth
      variant="outlined"
      size="medium"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" fontSize="small" />
          </InputAdornment>
        ),
        endAdornment: inputValue ? (
          <InputAdornment position="end">
            <ClearIcon 
              color="action" 
              fontSize="small" 
              sx={{ cursor: "pointer" }}
              onClick={handleClear}
            />
          </InputAdornment>
        ) : null
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
        },
      }}
    />
  );
};

export default React.memo(TextFilter);
