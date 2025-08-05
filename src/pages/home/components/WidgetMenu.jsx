import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Divider } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import SettingsIcon from '@mui/icons-material/Settings';

const WidgetMenu = ({ 
  onRefresh, 
  onExport, 
  onFullscreen, 
  onSettings,
  customMenuItems = [] 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (callback) => {
    return () => {
      handleClose();
      if (callback) callback();
    };
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
          backgroundColor: 'background.paper',
          boxShadow: 1,
          '&:hover': {
            backgroundColor: 'action.hover',
          }
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {onRefresh && (
          <MenuItem onClick={handleMenuItemClick(onRefresh)}>
            <RefreshIcon fontSize="small" sx={{ mr: 1 }} />
            بازخوانی
          </MenuItem>
        )}
        
        {onExport && (
          <MenuItem onClick={handleMenuItemClick(onExport)}>
            <FileDownloadIcon fontSize="small" sx={{ mr: 1 }} />
            خروجی اکسل
          </MenuItem>
        )}
        
        {onFullscreen && (
          <MenuItem onClick={handleMenuItemClick(onFullscreen)}>
            <FullscreenIcon fontSize="small" sx={{ mr: 1 }} />
            تمام صفحه
          </MenuItem>
        )}
        
        {(onRefresh || onExport || onFullscreen) && customMenuItems.length > 0 && (
          <Divider />
        )}
        
        {customMenuItems.map((item, index) => (
          <MenuItem key={index} onClick={handleMenuItemClick(item.onClick)}>
            {item.icon && <span style={{ marginRight: 8 }}>{item.icon}</span>}
            {item.label}
          </MenuItem>
        ))}
        
        {onSettings && (
          <>
            {(onRefresh || onExport || onFullscreen || customMenuItems.length > 0) && (
              <Divider />
            )}
            <MenuItem onClick={handleMenuItemClick(onSettings)}>
              <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
              تنظیمات
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default WidgetMenu;