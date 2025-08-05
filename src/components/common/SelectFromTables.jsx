import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Chip,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomePage from '../customePage';

/**
 * SelectFromTables Component
 * 
 * A reusable component for selecting items from tables using CustomePage
 * 
 * @param {Object} props
 * @param {Object} props.apis - API endpoints for table data (GET_DATA, etc.)
 * @param {string} props.tableName - Name of the table for display
 * @param {Array} props.selected - Currently selected items
 * @param {Function} props.setSelected - Function to update selected items
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Function to close dialog
 * @param {boolean} props.multiple - Allow multiple selection (default: true)
 * @param {string} props.title - Dialog title
 * @param {Array} props.fields - Fields configuration for CustomePage
 * @param {string} props.permissionsTag - Permissions tag for CustomePage
 * @param {Object} props.filterConfig - Filter configuration
 * @param {Array} props.defaultFilter - Default filters
 * @param {string} props.rowIdField - Field to use as row ID (default: 'id')
 * @param {Function} props.onConfirm - Optional callback when selection is confirmed
 */
const SelectFromTables = ({
  apis,
  tableName,
  selected = [],
  setSelected,
  open = false,
  onClose,
  multiple = true,
  title,
  fields = [],
  permissionsTag,
  filterConfig,
  defaultFilter = [],
  rowIdField = 'id',
  onConfirm,
  ...otherProps
}) => {
  const [tempSelected, setTempSelected] = useState([]);
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
    if (open) {
      // Initialize temp selection with current selection
      setTempSelected([...selected]);
    }
  }, [open, selected]);

  const handleClose = () => {
    setTempSelected([]);
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleConfirm = () => {
    setSelected(tempSelected);
    if (onConfirm) {
      onConfirm(tempSelected);
    }
    handleClose();
  };

  const handleSelectionChange = (newSelection) => {
    if (multiple) {
      setTempSelected(newSelection);
    } else {
      // For single selection, only keep the last selected item
      setTempSelected(newSelection.slice(-1));
    }
  };

  const dialogTitle = title || `انتخاب ${tableName}`;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          pb: 2,
        }}
      >
        <Typography variant="h6">{dialogTitle}</Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ flex: 1, overflow: 'hidden', p: 0 }}>
        {/* Selected items display */}
        {tempSelected.length > 0 && (
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" sx={{ mr: 1 }}>
              انتخاب شده:
            </Typography>
            {tempSelected.map((item) => (
              <Chip
                key={item[rowIdField]}
                label={item.title || item.name || `آیتم ${item[rowIdField]}`}
                onDelete={() => {
                  setTempSelected(tempSelected.filter(
                    (selected) => selected[rowIdField] !== item[rowIdField]
                  ));
                }}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        )}

        {/* Table with CustomePage */}
        <Box sx={{ height: '100%', overflow: 'auto' }}>
          <CustomePage
            apis={apis}
            title=""
            canAdd={false}
            canEdit={false}
            permissionsTag={permissionsTag}
            feilds={fields}
            defaultSelected={tempSelected}
            onDataChange={handleSelectionChange}
            filterConfig={filterConfig}
            defaultFilter={defaultFilter}
            rowIdField={rowIdField}
            showExport={false}
            showSync={false}
            selectionActions={[]}
            customComponents={{
              PageTitle: () => null, // Hide page title in dialog
            }}
            {...otherProps}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          p: 2,
        }}
      >
        <Button onClick={handleClose} color="inherit">
          انصراف
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={tempSelected.length === 0}
        >
          تایید انتخاب ({tempSelected.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectFromTables;