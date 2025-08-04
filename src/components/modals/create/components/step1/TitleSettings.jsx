import { FormControl, MenuItem, Paper, Select, Switch } from "@mui/material";
import React from "react";
import { TextInput } from "../../../../common";

const TITLE_POSITIONS = [
  { id: 1, title: "right", label: "راست" },
  { id: 2, title: "left", label: "چپ" },
  { id: 3, title: "center", label: "وسط" },
];

const TitleSettings = ({ data, onUpdate, trigger }) => {
  if (!trigger[1]) return null;

  const handleTitleChange = (value) => {
    onUpdate("title", value);
  };

  const handleShowTitleChange = () => {
    onUpdate("showTitle", !data.showTitle);
  };

  const handleTitlePositionChange = (value) => {
    onUpdate(
      "titlePosition",
      TITLE_POSITIONS.find((pos) => pos.id === value)
    );
  };

  const handleTitleColorChange = (color) => {
    onUpdate("titleColor", color);
  };

  return (
    <Paper
      sx={{
        border: "1px solid #dbdfea",
        mb: 1,
        padding: "25px 16px 15px 16px",
        position: "relative",
      }}
      elevation={0}
      className="md:col-span-4"
    >
      <div className="grid md:grid-cols-4 gap-4">
        <div className="col-span-3">
          <TextInput
            label="عنوان ویترین"
            change={handleTitleChange}
            currentValue={data.title}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs">نمایش عنوان:</span>
          <Switch
            checked={data.showTitle}
            size="small"
            onChange={handleShowTitleChange}
          />
        </div>

        <FormControl fullWidth>
          <Select
            size="small"
            value={data.titlePosition?.id || 1}
            onChange={(e) => handleTitlePositionChange(e.target.value)}
          >
            {TITLE_POSITIONS.map((position) => (
              <MenuItem key={position.id} value={position.id}>
                {position.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/*      <div className="col-span-2">
          <ColorInput
            label="رنگ عنوان"
            value={data.titleColor}
            onChange={handleTitleColorChange}
          />
        </div> */}
      </div>

      <div className="bg-[#198DFF] text-white flex justify-center items-center px-4 py-2 absolute -top-5 right-3 text-sm">
        تنظیمات عنوان
      </div>
    </Paper>
  );
};

export default React.memo(TitleSettings);
