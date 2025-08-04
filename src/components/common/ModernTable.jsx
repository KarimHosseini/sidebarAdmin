import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  IconButton,
  TablePagination,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ModernTable = ({
  columns = [],
  data = [],
  title,
  subtitle,
  actions,
  pagination = false,
  page = 0,
  rowsPerPage = 10,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50],
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const getTableStyles = () => {
    return {
      background: isDark
        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(100, 181, 246, 0.01) 100%)'
        : 'linear-gradient(135deg, rgba(248, 249, 255, 0.8) 0%, rgba(227, 242, 253, 0.4) 100%)',
      borderRadius: '20px',
      border: isDark 
        ? '1px solid rgba(255, 255, 255, 0.1)' 
        : '1px solid rgba(100, 181, 246, 0.1)',
      backdropFilter: 'blur(10px)',
      boxShadow: isDark
        ? '0 8px 32px rgba(0, 0, 0, 0.3)'
        : '0 4px 20px rgba(100, 181, 246, 0.1)',
      overflow: 'hidden',
      position: 'relative',
      
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
      
      ...sx,
    };
  };

  const renderCellContent = (value, column) => {
    if (column.render) {
      return column.render(value);
    }
    
    if (column.type === 'chip') {
      return (
        <Chip
          label={value}
          size="small"
          sx={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.2) 0%, rgba(63, 81, 181, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(100, 181, 246, 0.1) 0%, rgba(63, 81, 181, 0.05) 100%)',
            color: isDark ? '#64b5f6' : '#1976d2',
            border: isDark 
              ? '1px solid rgba(100, 181, 246, 0.3)'
              : '1px solid rgba(100, 181, 246, 0.2)',
            fontWeight: 600,
          }}
        />
      );
    }
    
    if (column.type === 'actions') {
      return (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {value.map((action, index) => (
            <IconButton
              key={index}
              onClick={action.onClick}
              size="small"
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
              {action.icon}
            </IconButton>
          ))}
        </Box>
      );
    }
    
    return value;
  };

  return (
    <Paper sx={getTableStyles()}>
      {/* Header */}
      {(title || subtitle || actions) && (
        <Box
          sx={{
            padding: '24px 32px 16px',
            background: isDark
              ? 'linear-gradient(90deg, rgba(100, 181, 246, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)'
              : 'linear-gradient(90deg, rgba(100, 181, 246, 0.05) 0%, rgba(255, 255, 255, 0.8) 100%)',
            borderBottom: isDark 
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(100, 181, 246, 0.1)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                    fontWeight: 700,
                    mb: subtitle ? 1 : 0,
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
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
            {actions && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {actions}
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Table */}
      <TableContainer sx={{ position: 'relative', zIndex: 1 }}>
        <Table {...props}>
          <TableHead>
            <TableRow
              sx={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.1) 0%, rgba(63, 81, 181, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(100, 181, 246, 0.08) 0%, rgba(63, 81, 181, 0.04) 100%)',
              }}
            >
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  align={column.align || 'right'}
                  sx={{
                    color: isDark ? '#64b5f6' : '#1976d2',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    borderBottom: isDark 
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : '1px solid rgba(100, 181, 246, 0.1)',
                    padding: '16px 20px',
                    background: 'transparent',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{
                  '&:hover': {
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
                      : 'linear-gradient(135deg, rgba(100, 181, 246, 0.03) 0%, rgba(255, 255, 255, 0.5) 100%)',
                    transform: 'scale(1.005)',
                    transition: 'all 0.2s ease',
                  },
                  '&:last-child td': {
                    borderBottom: 'none',
                  },
                }}
              >
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    align={column.align || 'right'}
                    sx={{
                      color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                      borderBottom: isDark 
                        ? '1px solid rgba(255, 255, 255, 0.05)'
                        : '1px solid rgba(100, 181, 246, 0.05)',
                      padding: '16px 20px',
                      fontSize: '0.875rem',
                    }}
                  >
                    {renderCellContent(row[column.field], column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <Box
          sx={{
            background: isDark
              ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.02) 0%, rgba(100, 181, 246, 0.05) 100%)'
              : 'linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(100, 181, 246, 0.03) 100%)',
            borderTop: isDark 
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(100, 181, 246, 0.1)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={onPageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange}
            rowsPerPageOptions={rowsPerPageOptions}
            labelRowsPerPage="تعداد در صفحه:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} از ${count}`}
            sx={{
              color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
              '& .MuiTablePagination-toolbar': {
                padding: '16px 24px',
              },
              '& .MuiTablePagination-selectIcon': {
                color: isDark ? '#64b5f6' : '#1976d2',
              },
              '& .MuiIconButton-root': {
                color: isDark ? '#64b5f6' : '#1976d2',
                '&:hover': {
                  background: isDark
                    ? 'rgba(100, 181, 246, 0.1)'
                    : 'rgba(25, 118, 210, 0.1)',
                },
              },
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default ModernTable;