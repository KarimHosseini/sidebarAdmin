import React from 'react';
import { Box, Typography, Breadcrumbs, Link, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ArrowBack, Home, ChevronLeft } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const PageHeader = ({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  showBackButton = false, 
  actions,
  icon
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme.palette.mode === 'dark';

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        background: isDark 
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(100, 181, 246, 0.02) 100%)'
          : 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)',
        borderRadius: '20px',
        padding: '24px 32px',
        margin: '20px 0',
        border: isDark 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : '1px solid rgba(100, 181, 246, 0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: isDark
          ? '0 8px 32px rgba(0, 0, 0, 0.3)'
          : '0 4px 20px rgba(100, 181, 246, 0.1)',
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
            ? 'linear-gradient(45deg, rgba(100, 181, 246, 0.03) 0%, transparent 50%, rgba(63, 81, 181, 0.02) 100%)'
            : 'linear-gradient(45deg, rgba(100, 181, 246, 0.05) 0%, transparent 50%, rgba(63, 81, 181, 0.03) 100%)',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: isDark
            ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.1) 0%, rgba(63, 81, 181, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(100, 181, 246, 0.2) 0%, rgba(63, 81, 181, 0.1) 100%)',
          filter: 'blur(20px)',
        }}
      />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator={<ChevronLeft sx={{ fontSize: '1rem', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }} />}
            sx={{ 
              mb: 2,
              '& .MuiBreadcrumbs-separator': {
                transform: 'rotate(180deg)',
              }
            }}
          >
            <Link
              color="inherit"
              href="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                '&:hover': {
                  color: isDark ? '#64b5f6' : '#1976d2',
                },
              }}
            >
              <Home sx={{ mr: 0.5, fontSize: '1.1rem' }} />
              خانه
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <Link
                key={index}
                color="inherit"
                href={crumb.path}
                sx={{
                  color: index === breadcrumbs.length - 1 
                    ? (isDark ? '#64b5f6' : '#1976d2')
                    : (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'),
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: index === breadcrumbs.length - 1 ? 600 : 400,
                  '&:hover': {
                    color: isDark ? '#64b5f6' : '#1976d2',
                  },
                }}
              >
                {crumb.label}
              </Link>
            ))}
          </Breadcrumbs>
        )}

        {/* Header content */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {showBackButton && (
              <IconButton
                onClick={handleBack}
                sx={{
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(100, 181, 246, 0.1) 0%, rgba(255, 255, 255, 0.8) 100%)',
                  border: isDark 
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(100, 181, 246, 0.2)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(100, 181, 246, 0.15) 0%, rgba(255, 255, 255, 0.9) 100%)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <ArrowBack sx={{ color: isDark ? '#64b5f6' : '#1976d2' }} />
              </IconButton>
            )}

            {icon && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.15) 0%, rgba(63, 81, 181, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(100, 181, 246, 0.2) 0%, rgba(63, 81, 181, 0.1) 100%)',
                  border: isDark 
                    ? '1px solid rgba(100, 181, 246, 0.2)'
                    : '1px solid rgba(100, 181, 246, 0.3)',
                  '& .MuiSvgIcon-root': {
                    color: isDark ? '#64b5f6' : '#1976d2',
                    fontSize: '1.5rem',
                  },
                }}
              >
                {icon}
              </Box>
            )}

            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  background: isDark
                    ? 'linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)'
                    : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    width: '60px',
                    height: '3px',
                    background: isDark
                      ? 'linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)'
                      : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    borderRadius: '2px',
                  },
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body1"
                  sx={{
                    color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                    mt: 1,
                    fontSize: '1rem',
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Actions */}
          {actions && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {actions}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PageHeader;