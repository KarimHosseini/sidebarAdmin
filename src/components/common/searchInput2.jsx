import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  CircularProgress,
  ClickAwayListener,
  MenuItem,
  Paper,
  Popper,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { baseUrl } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import axiosInstance from "../dataFetch/axiosInstance";

export default function SearchInput2({
  url,
  value,
  setValue,
  label,
  defualtValue,
}) {
  const [inputValue, setInputValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const { token } = useSelector((state) => state.user);
  const refContainer = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0 });
  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (refContainer.current) {
      setDimensions({ width: refContainer.current.offsetWidth });
    }
  }, []);

  const fetchOptions = useCallback(
    async (searchValue) => {
      setLoading(true);
      try {
        const res = await axiosInstance(
          `${baseUrl}/${url}?page=1&Limit=${searchValue ? 200 : 20}&search=${
            searchValue || ""
          }`,
          configReq(token)
        );
        if (res.data?.data?.length > 0) setOptions(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    },
    [url, token]
  );

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      if (inputValue) fetchOptions(inputValue);
    }, 500);
    return () => clearTimeout(debounceTimeout.current);
  }, [inputValue, fetchOptions]);
  useEffect(() => {
    if (value?.fname) {
      setInputValue(`${value.fname} ${value.lname}`);
    }
  }, [value]);
  useEffect(() => {
    if (defualtValue) {
      setInputValue(defualtValue);
    }
  }, [defualtValue]);
  const handleClose = () => {
    setAnchorEl(null);
    if (!value) {
      setInputValue("");
    }
  };
  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div ref={refContainer}>
        <TextField
          label={label}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          fullWidth
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          onBlur={() => {
            if (!value) {
              setInputValue("");
            }
          }}
          autoComplete="off"
          InputProps={{
            endAdornment: (
              <>
                {loading && <CircularProgress size={18} />}
                <ArrowDropDownIcon color="inherit" size={20} />
              </>
            ),
          }}
        />
        <Popper
          sx={{ zIndex: 20000 }}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
        >
          <Paper
            sx={{
              p: 1,
              width: dimensions.width,
              maxHeight: 400,
              overflowY: "auto",
            }}
          >
            {options.map((item, index) => (
              <MenuItem
                key={index}
                sx={{ borderBottom: "1px solid #f3e3e3", padding: "8px 4px" }}
                onClick={() => {
                  setValue(item);
                  handleClose();
                }}
              >
                {item?.fname} {item?.lname}
              </MenuItem>
            ))}
          </Paper>
        </Popper>
      </div>
    </ClickAwayListener>
  );
}
