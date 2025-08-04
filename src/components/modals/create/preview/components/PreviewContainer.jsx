import React from 'react';
import { Paper, Box, IconButton, Typography, Tabs, Tab } from '@mui/material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import RefreshIcon from '@mui/icons-material/Refresh';

const PreviewContainer = ({ 
  children, 
  isMobile,
  onViewChange,
  currentView,
  title = "پیش نمایش"
}) => {
  return (
    <Paper elevation={0} className="col-span-3 mb-5 border pb-7 rounded-md">
      <Box
        sx={{
          background: (theme) => theme.palette.background.paper,
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle1" component="div">
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => onViewChange('desktop')}
            color={currentView === 'desktop' ? 'primary' : 'default'}
          >
            <DesktopWindowsIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onViewChange('mobile')}
            color={currentView === 'mobile' ? 'primary' : 'default'}
          >
            <PhoneIphoneIcon />
          </IconButton>
          <IconButton size="small">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          p: 2,
          maxWidth: isMobile ? '375px' : '100%',
          margin: '0 auto',
          transition: 'all 0.3s ease',
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

export default PreviewContainer;
