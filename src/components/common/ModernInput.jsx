import React from 'react';
import { TextField, InputAdornment, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ModernInput = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  variant = 'outlined',
  size = 'medium',
  fullWidth = true,
  disabled = false,
  error = false,
  helperText,
  startIcon,
  endIcon,
  multiline = false,
  rows = 4,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const getInputStyles = () => {
    return {
      '& .MuiOutlinedInput-root': {
        background: isDark 
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(100, 181, 246, 0.05) 100%)'
          : 'linear-gradient(135deg, rgba(248, 249, 255, 0.8) 0%, rgba(227, 242, 253, 0.6) 100%)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        border: isDark 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : '1px solid rgba(100, 181, 246, 0.2)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? 'linear-gradient(45deg, rgba(100, 181, 246, 0.02) 0%, transparent 100%)'
            : 'linear-gradient(45deg, rgba(100, 181, 246, 0.05) 0%, transparent 100%)',
          pointerEvents: 'none',
        },

        '& fieldset': {
          borderColor: 'transparent',
          borderWidth: '1px',
        },
        
        '&:hover': {
          background: isDark 
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(100, 181, 246, 0.08) 100%)'
            : 'linear-gradient(135deg, rgba(248, 249, 255, 0.9) 0%, rgba(227, 242, 253, 0.8) 100%)',
          border: isDark 
            ? '1px solid rgba(100, 181, 246, 0.3)' 
            : '1px solid rgba(100, 181, 246, 0.4)',
          transform: 'translateY(-1px)',
          boxShadow: isDark
            ? '0 4px 20px rgba(100, 181, 246, 0.15)'
            : '0 4px 20px rgba(100, 181, 246, 0.2)',
            
          '& fieldset': {
            borderColor: 'transparent',
          },
        },
        
        '&.Mui-focused': {
          background: isDark 
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(100, 181, 246, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(248, 249, 255, 1) 0%, rgba(227, 242, 253, 0.9) 100%)',
          border: isDark 
            ? '1px solid #64b5f6' 
            : '1px solid #1976d2',
          transform: 'translateY(-2px)',
          boxShadow: isDark
            ? '0 8px 30px rgba(100, 181, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 8px 30px rgba(25, 118, 210, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            
          '& fieldset': {
            borderColor: 'transparent',
          },
        },

        '&.Mui-error': {
          border: '1px solid #f44336',
          background: isDark 
            ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(244, 67, 54, 0.05) 0%, rgba(248, 249, 255, 0.8) 100%)',
            
          '&:hover, &.Mui-focused': {
            boxShadow: '0 4px 20px rgba(244, 67, 54, 0.2)',
          },
        },

        '&.Mui-disabled': {
          background: isDark 
            ? 'rgba(255, 255, 255, 0.02)' 
            : 'rgba(0, 0, 0, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          opacity: 0.6,
        },
      },

      '& .MuiInputBase-input': {
        color: isDark ? '#ffffff' : '#000000',
        fontSize: size === 'small' ? '0.875rem' : '1rem',
        padding: size === 'small' ? '12px 14px' : '14px 16px',
        position: 'relative',
        zIndex: 1,
        
        '&::placeholder': {
          color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
          opacity: 1,
        },
      },

      '& .MuiInputLabel-root': {
        color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        fontSize: '1rem',
        transform: 'translate(16px, 16px) scale(1)',
        
        '&.Mui-focused': {
          color: isDark ? '#64b5f6' : '#1976d2',
        },
        
        '&.MuiInputLabel-shrink': {
          transform: 'translate(16px, -9px) scale(0.75)',
          background: isDark 
            ? 'linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(26, 26, 46, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 255, 0.9) 100%)',
          padding: '0 8px',
          borderRadius: '4px',
        },
      },

      '& .MuiFormHelperText-root': {
        color: error 
          ? '#f44336' 
          : isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
        fontSize: '0.75rem',
        marginTop: '8px',
        marginLeft: '16px',
      },

      ...sx,
    };
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={type}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled}
        error={error}
        helperText={helperText}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        InputProps={{
          startAdornment: startIcon && (
            <InputAdornment position="start">
              <Box
                sx={{
                  color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {startIcon}
              </Box>
            </InputAdornment>
          ),
          endAdornment: endIcon && (
            <InputAdornment position="end">
              <Box
                sx={{
                  color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {endIcon}
              </Box>
            </InputAdornment>
          ),
        }}
        sx={getInputStyles()}
        {...props}
      />
    </Box>
  );
};

export default ModernInput;