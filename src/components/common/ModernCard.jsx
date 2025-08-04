import React from 'react';
import { Paper, Box, Typography, IconButton, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MoreVert } from '@mui/icons-material';

const ModernCard = ({
  children,
  title,
  subtitle,
  icon,
  actions,
  variant = 'default',
  elevation = 0,
  sx = {},
  headerSx = {},
  contentSx = {},
  ...props
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const getCardStyles = () => {
    const baseStyles = {
      borderRadius: '20px',
      border: isDark 
        ? '1px solid rgba(255, 255, 255, 0.1)' 
        : '1px solid rgba(100, 181, 246, 0.1)',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isDark
          ? 'linear-gradient(45deg, rgba(100, 181, 246, 0.02) 0%, transparent 50%, rgba(63, 81, 181, 0.01) 100%)'
          : 'linear-gradient(45deg, rgba(100, 181, 246, 0.03) 0%, transparent 50%, rgba(63, 81, 181, 0.02) 100%)',
        pointerEvents: 'none',
      },

      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: isDark
          ? '0 12px 40px rgba(0, 0, 0, 0.4)'
          : '0 8px 30px rgba(100, 181, 246, 0.15)',
      },
    };

    switch (variant) {
      case 'gradient':
        return {
          ...baseStyles,
          background: isDark
            ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.1) 0%, rgba(63, 81, 181, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(100, 181, 246, 0.08) 0%, rgba(63, 81, 181, 0.04) 100%)',
          boxShadow: isDark
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 4px 20px rgba(100, 181, 246, 0.1)',
        };

      case 'glass':
        return {
          ...baseStyles,
          background: isDark
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(255, 255, 255, 0.7)',
          boxShadow: isDark
            ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 4px 20px rgba(100, 181, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        };

      case 'outlined':
        return {
          ...baseStyles,
          background: 'transparent',
          border: isDark 
            ? '2px solid rgba(100, 181, 246, 0.3)' 
            : '2px solid rgba(100, 181, 246, 0.2)',
          boxShadow: 'none',
          '&:hover': {
            ...baseStyles['&:hover'],
            borderColor: isDark ? '#64b5f6' : '#1976d2',
            boxShadow: isDark
              ? '0 4px 20px rgba(100, 181, 246, 0.2)'
              : '0 4px 20px rgba(100, 181, 246, 0.15)',
          },
        };

      case 'elevated':
        return {
          ...baseStyles,
          background: isDark
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(100, 181, 246, 0.03) 100%)'
            : 'linear-gradient(135deg, rgba(248, 249, 255, 0.9) 0%, rgba(227, 242, 253, 0.6) 100%)',
          boxShadow: isDark
            ? '0 12px 40px rgba(0, 0, 0, 0.4)'
            : '0 8px 30px rgba(100, 181, 246, 0.2)',
          '&:hover': {
            ...baseStyles['&:hover'],
            boxShadow: isDark
              ? '0 16px 50px rgba(0, 0, 0, 0.5)'
              : '0 12px 40px rgba(100, 181, 246, 0.25)',
          },
        };

      default:
        return {
          ...baseStyles,
          background: isDark
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(100, 181, 246, 0.02) 100%)'
            : 'linear-gradient(135deg, rgba(248, 249, 255, 0.8) 0%, rgba(227, 242, 253, 0.4) 100%)',
          boxShadow: isDark
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 4px 20px rgba(100, 181, 246, 0.1)',
        };
    }
  };

  return (
    <Paper
      elevation={elevation}
      sx={{
        ...getCardStyles(),
        ...sx,
      }}
      {...props}
    >
      {/* Header */}
      {(title || subtitle || icon || actions) && (
        <>
          <Box
            sx={{
              padding: '20px 24px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 1,
              ...headerSx,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {icon && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.15) 0%, rgba(63, 81, 181, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(100, 181, 246, 0.2) 0%, rgba(63, 81, 181, 0.1) 100%)',
                    border: isDark 
                      ? '1px solid rgba(100, 181, 246, 0.2)'
                      : '1px solid rgba(100, 181, 246, 0.3)',
                    '& .MuiSvgIcon-root': {
                      color: isDark ? '#64b5f6' : '#1976d2',
                      fontSize: '1.25rem',
                    },
                  }}
                >
                  {icon}
                </Box>
              )}
              
              <Box>
                {title && (
                  <Typography
                    variant="h6"
                    sx={{
                      background: isDark
                        ? 'linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)'
                        : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      mb: subtitle ? 0.5 : 0,
                    }}
                  >
                    {title}
                  </Typography>
                )}
                {subtitle && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Box>

            {actions && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {actions}
              </Box>
            )}
          </Box>
          
          <Divider
            sx={{
              borderColor: isDark 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(100, 181, 246, 0.1)',
              mx: 3,
            }}
          />
        </>
      )}

      {/* Content */}
      <Box
        sx={{
          padding: (title || subtitle || icon || actions) ? '16px 24px 24px' : '24px',
          position: 'relative',
          zIndex: 1,
          ...contentSx,
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

export default ModernCard;