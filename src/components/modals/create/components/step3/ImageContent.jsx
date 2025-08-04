import { Button, Paper, TextField } from "@mui/material";
import React from "react";
import { ImageUploader } from "../../../../common";

const ImageContent = ({
  data,
  setData,
  selectedImage,
  setSelectedImage,
  avatar,
  setAvatar,
  onSave,
}) => {
  const handleChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Paper className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-4">
        <TextField
          label="عنوان"
          value={data.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          fullWidth
          size="small"
        />

        <TextField
          label="توضیحات"
          value={data.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          multiline
          rows={4}
          fullWidth
          size="small"
        />

        <TextField
          label="لینک"
          ltr
          value={data.link || ""}
          onChange={(e) => handleChange("link", e.target.value)}
          fullWidth
          size="small"
        />

        <TextField
          label="اولویت"
          type="number"
          value={data.priority || ""}
          onChange={(e) => handleChange("priority", e.target.value)}
          fullWidth
          size="small"
        />
      </div>

      <div className="flex flex-col gap-4">
        <ImageUploader
          avatar={avatar}
          setAvatar={setAvatar}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={onSave}
          disabled={!data.title || (!avatar && !selectedImage)}
        >
          ذخیره
        </Button>
      </div>
    </Paper>
  );
};

export default React.memo(ImageContent);
