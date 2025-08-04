import RefreshIcon from "@mui/icons-material/Refresh";
import {
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { ImageUploader } from "../../../../common";

const Background = ({
  avatar,
  setAvatar,
  selectedImage,
  setSelectedImage,
  settings,
  setSettings,
  setNeedPreview,
  id,
  onRemove,
}) => {
  const handlePositionChange = (axis, value) => {
    setSettings((prev) => ({
      ...prev,
      [`position${axis}`]: value,
    }));
    setNeedPreview(true);
  };

  const handleSizeChange = (value) => {
    setSettings((prev) => ({
      ...prev,
      size: value,
    }));
    setNeedPreview(true);
  };

  const handleOpacityChange = (value) => {
    setSettings((prev) => ({
      ...prev,
      opacity: value,
    }));
    setNeedPreview(true);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded">
      <ImageUploader
        avatar={avatar}
        setAvatar={setAvatar}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        id={id}
        onRemove={onRemove}
      />

      <FormControl fullWidth>
        <Select
          value={settings.positionY}
          onChange={(e) => handlePositionChange("Y", e.target.value)}
          size="small"
        >
          <MenuItem value="top">بالا</MenuItem>
          <MenuItem value="center">وسط</MenuItem>
          <MenuItem value="bottom">پایین</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <Select
          value={settings.possitionX}
          onChange={(e) => handlePositionChange("X", e.target.value)}
          size="small"
        >
          <MenuItem value="left">چپ</MenuItem>
          <MenuItem value="center">وسط</MenuItem>
          <MenuItem value="right">راست</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <Select
          value={settings.size}
          onChange={(e) => handleSizeChange(e.target.value)}
          size="small"
        >
          <MenuItem value="cover">Cover</MenuItem>
          <MenuItem value="contain">Contain</MenuItem>
          <MenuItem value="auto">Auto</MenuItem>
        </Select>
      </FormControl>

      <TextField
        type="number"
        label="Opacity (%)"
        value={settings.opacity}
        onChange={(e) => handleOpacityChange(e.target.value)}
        inputProps={{ min: 0, max: 100 }}
        size="small"
      />

      <IconButton onClick={() => setNeedPreview(true)} color="primary">
        <RefreshIcon />
      </IconButton>
    </div>
  );
};

export default React.memo(Background);
