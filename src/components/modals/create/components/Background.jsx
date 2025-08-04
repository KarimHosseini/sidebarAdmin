import React, { useState } from 'react';
import { Box, Button, Typography, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

const Background = ({
  type,
  settings,
  onSettingsChange,
  data,
  setData
}) => {
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSettingsChange({
          ...settings,
          image: file,
          imageUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onSettingsChange({
      ...settings,
      image: null,
      imageUrl: ''
    });
  };

  const handleRefresh = () => {
    onSettingsChange({
      ...settings,
      opacity: 100,
      color: '#ffffff'
    });
  };

  const handleContainerChange = (event) => {
    setData({
      ...data,
      inContainer: event.target.checked
    });
  };

  const handlePositionChange = (position) => {
    onSettingsChange({
      ...settings,
      position
    });
  };

  const handleSizeChange = (size) => {
    onSettingsChange({
      ...settings,
      size
    });
  };

  return (
    <Box className="p-4 border rounded-lg">
      <Typography variant="h6" className="mb-4">
        {type === 'desktop' ? 'تنظیمات پس زمینه دسکتاپ' : 'تنظیمات پس زمینه موبایل'}
      </Typography>

      <div className="space-y-4">
        {/* Image Upload */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4">
          {settings?.imageUrl ? (
            <div className="relative w-full">
              <img
                src={settings.imageUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <IconButton
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-white"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ) : (
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              className="w-full h-48"
            >
              آپلود تصویر
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageSelect}
              />
            </Button>
          )}
        </div>

        {/* Image Settings */}
        {settings?.imageUrl && (
          <>
            {/* Position Settings */}
            <div className="space-y-2">
              <Typography variant="body2">موقعیت تصویر</Typography>
              <div className="grid grid-cols-3 gap-2">
                {['top', 'center', 'bottom'].map((position) => (
                  <Button
                    key={position}
                    variant={settings.position === position ? 'contained' : 'outlined'}
                    onClick={() => handlePositionChange(position)}
                    size="small"
                  >
                    {position === 'top' ? 'بالا' : position === 'center' ? 'وسط' : 'پایین'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Size Settings */}
            <div className="space-y-2">
              <Typography variant="body2">اندازه تصویر</Typography>
              <div className="grid grid-cols-3 gap-2">
                {['cover', 'contain', 'auto'].map((size) => (
                  <Button
                    key={size}
                    variant={settings.size === size ? 'contained' : 'outlined'}
                    onClick={() => handleSizeChange(size)}
                    size="small"
                  >
                    {size === 'cover' ? 'پوشش کامل' : size === 'contain' ? 'متناسب' : 'خودکار'}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Opacity Settings */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Typography variant="body2">شفافیت</Typography>
            <IconButton onClick={handleRefresh} size="small">
              <RefreshIcon />
            </IconButton>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings?.opacity || 100}
            onChange={(e) => onSettingsChange({
              ...settings,
              opacity: parseInt(e.target.value)
            })}
            className="w-full"
          />
          <div className="flex justify-between">
            <span>0%</span>
            <span>{settings?.opacity || 100}%</span>
          </div>
        </div>

        {/* Container Option */}
        <FormControlLabel
          control={
            <Checkbox
              checked={data?.inContainer || false}
              onChange={handleContainerChange}
            />
          }
          label="نمایش در کانتینر"
        />

        {/* Repeat Option */}
        <FormControlLabel
          control={
            <Checkbox
              checked={settings?.repeat || false}
              onChange={(e) => onSettingsChange({
                ...settings,
                repeat: e.target.checked
              })}
            />
          }
          label="تکرار تصویر"
        />
      </div>
    </Box>
  );
};

export default Background;
