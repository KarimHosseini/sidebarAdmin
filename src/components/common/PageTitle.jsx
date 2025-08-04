import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PageTitle = ({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  actions, 
  icon: Icon,
  gradient = true 
}) => {
  const navigate = useNavigate();
  const { themeColor } = useSelector((state) => state.themeColor);
  const dark = themeColor === "dark";

  return (
    <Box 
      className="page-title-container"
      sx={{
        mb: 4,
        p: 3,
        borderRadius: "16px",
        background: dark 
          ? "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)"
          : "linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)",
        border: dark 
          ? "1px solid rgba(255, 255, 255, 0.08)" 
          : "1px solid rgba(0, 0, 0, 0.05)",
        backdropFilter: "blur(10px)",
        boxShadow: dark
          ? "0 8px 32px rgba(31, 38, 135, 0.1)"
          : "0 4px 20px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: dark
            ? "0 16px 48px rgba(31, 38, 135, 0.15)"
            : "0 8px 30px rgba(0, 0, 0, 0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" sx={{ color: "var(--sidebar-dark-text-secondary)" }} />}
          sx={{ mb: 2 }}
        >
          <Link
            underline="hover"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: "var(--sidebar-dark-text-secondary)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "var(--gradient-primary-start)",
              }
            }}
            onClick={() => navigate('/')}
          >
            <Home sx={{ mr: 0.5, fontSize: "1.2rem" }} />
            خانه
          </Link>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast ? (
              <Typography 
                key={crumb.title} 
                sx={{ 
                  color: "var(--sidebar-dark-text)",
                  fontWeight: 600,
                }}
              >
                {crumb.title}
              </Typography>
            ) : (
              <Link
                key={crumb.title}
                underline="hover"
                sx={{ 
                  color: "var(--sidebar-dark-text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "var(--gradient-primary-start)",
                  }
                }}
                onClick={() => crumb.path && navigate(crumb.path)}
              >
                {crumb.title}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}

      {/* Title Section */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {Icon && (
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "16px",
                background: "linear-gradient(135deg, var(--gradient-primary-start), var(--gradient-primary-end))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "rotate(10deg) scale(1.1)",
                  boxShadow: "0 12px 32px rgba(99, 102, 241, 0.5)",
                },
              }}
            >
              <Icon sx={{ color: "#fff", fontSize: "1.8rem" }} />
            </Box>
          )}

          <Box>
            <Typography
              variant="h4"
              className={gradient ? "fancy-page-title" : ""}
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.5rem", md: "2rem" },
                mb: subtitle ? 0.5 : 0,
                ...(!gradient && {
                  color: dark ? "#fff" : "#000",
                }),
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="subtitle1"
                sx={{
                  color: "var(--sidebar-dark-text-secondary)",
                  fontSize: "0.95rem",
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Actions */}
        {actions && (
          <Box sx={{ display: "flex", gap: 2 }}>
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PageTitle;
