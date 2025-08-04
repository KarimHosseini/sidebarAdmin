import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const SortingDropDown = ({ headers, sort, setSort }) => {
  const [options, setOptions] = useState([]);
  const [choosen, setChoosen] = useState([]);
  useEffect(() => {
    if (options.length > 0) return;
    var temp = [];
    headers?.map((item) => {
      if (item.hasOrder) {
        temp.push(
          {
            id: "+," + item.name,
            title: item.title + " - صعودی",
          },
          {
            id: "-," + item.name,
            title: item.title + " - نزولی",
          }
        );
      }
    });
    setOptions(temp);
  }, [headers]);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSort(typeof value === "string" ? value.split(",") : value);
  };
  const handleClick = (item) => {
    var temp = [...choosen];
    if (sort.indexOf(item.id) > -1) {
      temp = temp.filter((f) => f !== item.title);
    } else {
      temp.push(item.title);
    }
    setChoosen(temp);
  };

  return (
    <div>
      <FormControl sx={{ width: { sm: "13rem" } }}>
        <InputLabel id="demo-multiple-checkbox-label">
          مرتب سازی بر اساس
        </InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={sort}
          onChange={handleChange}
          input={<OutlinedInput label="مرتب سازی بر اساس" />}
          renderValue={(choosen) => choosen.join(", ")}
          MenuProps={MenuProps}
        >
          {options.map((name) => (
            <MenuItem
              onClick={() => handleClick(name)}
              key={name.id}
              value={name.id}
            >
              <Checkbox checked={sort.indexOf(name.id) > -1} />
              <ListItemText primary={name.title} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default React.memo(SortingDropDown);
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
