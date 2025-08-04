/* eslint-disable react-hooks/exhaustive-deps */
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { baseUrl } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import axiosInstance from "../dataFetch/axiosInstance";

export default function SearchInput({
  url,
  value,
  setValue,
  label,
  defualtValue,
}) {
  const [inputValue, setInputValue] = useState("");
  const [inputChanged, setinputChanged] = useState(false);
  const [options, setOptions] = useState([]);
  const { token } = useSelector((state) => state.user);
  useEffect(() => {
    axiosInstance(
      `${baseUrl}/${url}?page=1&Limit=${
        inputValue ? 200 : 20
      }&search=${inputValue}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;

        setOptions(data?.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
        }
      });
    if (inputValue !== "") {
      setinputChanged(true);
    }
  }, [url, inputValue]);

  return (
    <div>
      {/*    {options[0]?.fname} */}
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        inputValue={!inputChanged && defualtValue ? defualtValue : inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        sx={{
          ".MuiOutlinedInput-root": {
            padding: "7px !important",
          },
        }}
        getOptionLabel={(option) => `${option.fname} ${option.lname}`}
        id="controllable-states-demo"
        options={options}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </div>
  );
}
