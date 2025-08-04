import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ModernButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const getVariantStyles = () => {
    const baseStyles = {
      borderRadius: '12px',
      textTransform: 'none',
      fontWeight: 600,
      fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.1rem' : '1rem',
      padding: size === 'small' ? '8px 16px' : size === 'large' ? '12px 24px' : '10px 20px',
      minHeight: size === 'small' ? '36px' : size === 'large' ? '48px' : '42px',
      border: 'none',
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
        background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
      },
      '&:hover::before': {
        opacity: 1,
      },
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
      },
      '&:active': {
        transform: 'translateY(0px)',
      },
      '&:disabled': {
        transform: 'none',
        opacity: 0.6,
        cursor: 'not-allowed',
      },
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            ...baseStyles['&:hover'],
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.6)',
          },
        };

      case 'secondary':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 15px rgba(240, 147, 251, 0.4)',
          '&:hover': {
            ...baseStyles['&:hover'],
            background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
            boxShadow: '0 8px 25px rgba(240, 147, 251, 0.6)',
          },
        };

      case 'success':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
          '&:hover': {
            ...baseStyles['&:hover'],
            background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
            boxShadow: '0 8px 25px rgba(79, 172, 254, 0.6)',
          },
        };

      case 'warning':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 15px rgba(250, 112, 154, 0.4)',
          '&:hover': {
            ...baseStyles['&:hover'],
            background: 'linear-gradient(135deg, #fee140 0%, #fa709a 100%)',
            boxShadow: '0 8px 25px rgba(250, 112, 154, 0.6)',
          },
        };

      case 'error':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
          '&:hover': {
            ...baseStyles['&:hover'],
            background: 'linear-gradient(135deg, #ee5a24 0%, #ff6b6b 100%)',
            boxShadow: '0 8px 25px rgba(255, 107, 107, 0.6)',
          },
        };

      case 'outline':
        return {
          ...baseStyles,
          background: 'transparent',
          color: isDark ? '#64b5f6' : '#1976d2',
          border: `2px solid ${isDark ? '#64b5f6' : '#1976d2'}`,
          boxShadow: 'none',
          '&:hover': {
            ...baseStyles['&:hover'],
            background: isDark 
              ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.1) 0%, rgba(63, 81, 181, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(21, 101, 192, 0.05) 100%)',
            borderColor: isDark ? '#42a5f5' : '#1565c0',
            boxShadow: `0 4px 15px ${isDark ? 'rgba(100, 181, 246, 0.3)' : 'rgba(25, 118, 210, 0.3)'}`,
          },
        };

      case 'ghost':
        return {
          ...baseStyles,
          background: 'transparent',
          color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
          border: 'none',
          boxShadow: 'none',
          '&:hover': {
            ...baseStyles['&:hover'],
            background: isDark 
              ? 'rgba(255,255,255,0.1)' 
              : 'rgba(0,0,0,0.05)',
            color: isDark ? '#ffffff' : '#000000',
            boxShadow: 'none',
          },
        };

      default:
        return baseStyles;
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      startIcon={loading ? null : startIcon}
      endIcon={loading ? null : endIcon}
      sx={{
        ...getVariantStyles(),
        ...sx,
      }}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress
            size={20}
            sx={{
              color: 'currentColor',
              mr: 1,
            }}
          />
          {children}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default ModernButton;