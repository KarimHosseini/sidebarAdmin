import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  InputAdornment
} from '@mui/material';
import { Close, Search, Add } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import DataFetcher from '../dataFetch';
import CustomeLayout from '../customeTable';
import { createSelectionManager } from '../../utils/selectionManager';
import axiosInstance from '../dataFetch/axiosInstance';
import { baseUrl } from '../../helpers/api-routes';
import { configReq } from '../../helpers/functions';

const SelectFromTables = ({
  open,
  onClose,
  title = 'انتخاب از جدول',
  tableApi,
  tableName,
  selected = [],
  onSelect,
  multiple = true,
  displayField = 'title',
  valueField = 'id',
  searchable = true,
  filters = [],
  maxSelection = null,
  minSelection = null,
  customHeaders = null,
  hideColumns = [],
  additionalParams = {},
  renderChip,
  onRemove,
  allowCreate = false,
  createApi = null,
  createFields = [],
  width = 'lg',
  height = '80vh'
}) => {
  const { token } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [refreshData, setRefresh] = useState(0);
  const [search, setSearch] = useState('');
  const [submitSearch, setSubmitSearch] = useState('');
  const [limit, setLimit] = useState(20);
  const [filter, setFilter] = useState(filters);
  const [sort, setSort] = useState({});
  const [allRows, setAllRows] = useState([]);
  const [internalSelected, setInternalSelected] = useState(selected);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createData, setCreateData] = useState({});

  // Create selection manager
  const selectionManager = React.useRef(
    createSelectionManager({
      defaultSelected: selected.map(item => 
        typeof item === 'object' ? item[valueField] : item
      ),
      multiple,
      maxSelection,
      debug: process.env.NODE_ENV === 'development'
    })
  ).current;

  // Fetch data using DataFetcher
  const {
    hasMore,
    loading,
    allData,
    CurrentPage,
    metaData,
    header,
    setting,
  } = DataFetcher(
    limit,
    page,
    sort,
    tableApi,
    filter,
    true,
    refreshData,
    submitSearch,
    1,
    additionalParams
  );

  // Update rows when data changes
  useEffect(() => {
    setAllRows(allData);
  }, [allData]);

  // Update internal selected when external selected changes
  useEffect(() => {
    setInternalSelected(selected);
    // Update selection manager
    const selectedIds = selected.map(item => 
      typeof item === 'object' ? item[valueField] : item
    );
    selectionManager.clear();
    selectedIds.forEach(id => selectionManager.select(id));
  }, [selected, valueField, selectionManager]);

  // Handle selection changes
  const handleSelectionChange = useCallback(() => {
    const selectedIds = selectionManager.getSelected();
    const selectedItems = allRows.filter(row => 
      selectedIds.includes(row[valueField])
    );
    
    if (multiple) {
      setInternalSelected(selectedItems);
    } else {
      setInternalSelected(selectedItems.length > 0 ? [selectedItems[0]] : []);
    }
  }, [selectionManager, allRows, valueField, multiple]);

  // Subscribe to selection changes
  useEffect(() => {
    const unsubscribe = selectionManager.subscribe(handleSelectionChange);
    return unsubscribe;
  }, [selectionManager, handleSelectionChange]);

  // Filter headers if custom headers provided
  const displayHeaders = customHeaders || header.filter(h => 
    !hideColumns.includes(h.name)
  );

  // Handle confirm selection
  const handleConfirm = () => {
    if (minSelection && internalSelected.length < minSelection) {
      alert(`حداقل ${minSelection} مورد باید انتخاب شود`);
      return;
    }
    
    onSelect(internalSelected);
    onClose();
  };

  // Handle remove item
  const handleRemoveItem = (item) => {
    const itemId = typeof item === 'object' ? item[valueField] : item;
    selectionManager.deselect(itemId);
    
    const newSelected = internalSelected.filter(selectedItem => {
      const selectedId = typeof selectedItem === 'object' 
        ? selectedItem[valueField] 
        : selectedItem;
      return selectedId !== itemId;
    });
    
    setInternalSelected(newSelected);
    
    if (onRemove) {
      onRemove(item);
    }
  };

  // Handle create new item
  const handleCreate = async () => {
    if (!createApi) return;
    
    setCreateLoading(true);
    try {
      const res = await axiosInstance.post(
        `${baseUrl}/${createApi}`,
        createData,
        configReq(token)
      );
      
      if (res.data.code === 200) {
        const newItem = res.data.data;
        setAllRows([newItem, ...allRows]);
        
        // Auto-select the new item
        selectionManager.select(newItem[valueField]);
        setInternalSelected([...internalSelected, newItem]);
        
        setShowCreateDialog(false);
        setCreateData({});
        setRefresh(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error creating item:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  // Render selected items chips
  const renderSelectedChips = () => {
    return internalSelected.map((item, index) => {
      const label = typeof item === 'object' 
        ? item[displayField] 
        : item;
      
      if (renderChip) {
        return renderChip(item, () => handleRemoveItem(item), index);
      }
      
      return (
        <Chip
          key={index}
          label={label}
          onDelete={() => handleRemoveItem(item)}
          size="small"
          sx={{ m: 0.5 }}
        />
      );
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={width}
      fullWidth
      PaperProps={{
        sx: {
          height: height,
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <span>{title}</span>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        overflow: 'hidden' 
      }}>
        {/* Selected items display */}
        {internalSelected.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1,
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            maxHeight: '100px',
            overflowY: 'auto'
          }}>
            {renderSelectedChips()}
          </Box>
        )}
        
        {/* Search and actions */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {searchable && (
            <TextField
              placeholder="جستجو..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setSubmitSearch(search);
                  setPage(1);
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              size="small"
              sx={{ flexGrow: 1 }}
            />
          )}
          
          {allowCreate && createApi && (
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setShowCreateDialog(true)}
              size="small"
            >
              ایجاد جدید
            </Button>
          )}
        </Box>
        
        {/* Selection info */}
        {(maxSelection || minSelection) && (
          <Alert severity="info" sx={{ py: 0.5 }}>
            {maxSelection && `حداکثر ${maxSelection} مورد`}
            {maxSelection && minSelection && ' - '}
            {minSelection && `حداقل ${minSelection} مورد`}
            {` (${internalSelected.length} مورد انتخاب شده)`}
          </Alert>
        )}
        
        {/* Table */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <CustomeLayout
            limit={limit}
            setLimit={setLimit}
            setAllRows={setAllRows}
            title={tableName}
            headers={displayHeaders}
            setSearch={setSearch}
            search={search}
            page={page}
            total_pages={metaData?.total_pages}
            setApplySearch={(e) => {
              setPage(1);
              setSubmitSearch(e);
            }}
            rows={allRows}
            hasMore={hasMore}
            loading={loading}
            setPage={setPage}
            setting={setting}
            CurrentPage={CurrentPage}
            length={metaData?.total}
            name={tableName}
            setSort={(e) => {
              setPage(1);
              setSort({ ...sort, ...e });
            }}
            currentRow={() => {}}
            selectionManager={selectionManager}
            setRefresh={setRefresh}
            canSelect={true}
          />
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          انصراف
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained"
          disabled={minSelection && internalSelected.length < minSelection}
        >
          تایید انتخاب ({internalSelected.length})
        </Button>
      </DialogActions>
      
      {/* Create Dialog */}
      {showCreateDialog && (
        <Dialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>ایجاد {tableName} جدید</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              {createFields.map((field) => (
                <TextField
                  key={field.name}
                  label={field.label}
                  value={createData[field.name] || ''}
                  onChange={(e) => setCreateData({
                    ...createData,
                    [field.name]: e.target.value
                  })}
                  required={field.required}
                  multiline={field.multiline}
                  rows={field.rows}
                  type={field.type || 'text'}
                  fullWidth
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCreateDialog(false)}>
              انصراف
            </Button>
            <Button 
              onClick={handleCreate} 
              variant="contained"
              disabled={createLoading}
            >
              {createLoading ? <CircularProgress size={24} /> : 'ایجاد'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Dialog>
  );
};

export default SelectFromTables;