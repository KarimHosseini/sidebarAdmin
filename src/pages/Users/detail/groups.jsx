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

const GroupsUser = ({ groups, data, setData }) => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState([]);
  const [hasChanged, setHasChanged] = useState(false);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategory(typeof value === "string" ? value.split(",") : value);
    setHasChanged(true);
  };

  useEffect(() => {
    var temp = [];
    selectedCategory.map((item) => {
      temp.push(groups.find((it) => it.id === item).title);
    });
    setSelectedCategoryTitle(temp);
    setData({ ...data, userGroups: selectedCategory });
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory.length === 0 && !hasChanged) {
      var temp = [];
      data.userGroups?.map((item) => temp.push(item.id));
      setSelectedCategory(temp);
    }
  }, [data]);
  return (
    <div>
      <FormControl fullWidth sx={{ maxWidth: "435px" }}>
        <InputLabel id="demo-multiple-checkbox-label">گروه کاربران</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedCategory}
          onChange={handleChange}
          input={<OutlinedInput label=" گروه کاربران " />}
          renderValue={(selected) => selectedCategoryTitle.join(", ")}
        >
          {groups.map((name) => (
            <MenuItem key={name.id} value={name.id}>
              <Checkbox checked={selectedCategory.indexOf(name.id) > -1} />
              <ListItemText primary={name.title} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default GroupsUser;
