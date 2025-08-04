import React, { useState } from 'react';
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton } from "@mui/material";
import CustomePage from '../customePage';
import DynamicModal from '../modals/DynamicModal';
import { getPageConfig } from '../../config/pageConfigs';

/**
 * Dynamic Page Component
 * 
 * Converts page configurations into CustomePage props automatically.
 * This eliminates the need for repetitive boilerplate code in every page.
 * 
 * Usage: <DynamicPage pageName="brands" />
 * 
 * This will automatically:
 * - Load the brands configuration
 * - Set up APIs, permissions, modal, etc.
 * - Handle create/edit modal state
 * - Generate standard CRUD actions
 */
const DynamicPage = ({ pageName }) => {
  const config = getPageConfig(pageName);
  
  // Modal state management
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [allRows, setAllRows] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (!config) {
    console.error(`Page configuration for '${pageName}' not found`);
    return <div>Page configuration not found: {pageName}</div>;
  }

  // Generate extra actions (row actions like edit button)
  const extraActions = [];
  
  if (config.hasEdit && config.hasModal) {
    extraActions.push({
      title: "ویرایش",
      handler: (
        <IconButton
          onClick={(event) => {
            // Get row data from the closest tr element with data attributes
            const target = event.currentTarget.closest('[data-id]') || 
                          event.currentTarget.closest('tr');
            
            if (target) {
              const rowData = {};
              
              // Extract data from data attributes
              Array.from(target.attributes).forEach(attr => {
                if (attr.name.startsWith('data-')) {
                  const key = attr.name.replace('data-', '');
                  rowData[key] = attr.value;
                }
              });
              
              // Find full row data from allRows if available
              const id = target.getAttribute('data-id');
              const fullRowData = allRows.find(row => row.id == id);
              
              setEditingData(fullRowData || rowData);
              setOpenEdit(true);
            }
          }}
          color="primary"
        >
          <Edit />
        </IconButton>
      ),
    });
  }

  // Generate extra buttons (header buttons like add button)
  const extraButtons = [];
  
  if (config.hasCreate && config.hasModal) {
    extraButtons.push(
      <Button
        key="add-button"
        onClick={() => setOpenCreate(true)}
        variant="contained"
        startIcon={<AddIcon />}
      >
        افزودن {config.title} جدید
      </Button>
    );
  }

  return (
    <>
      <CustomePage
        title={config.title}
        apis={config.apis}
        permissionsTag={config.permissionsTag}
        neededFields={config.neededFields || []}
        broadCrumb={config.breadcrumb || []}
        selectionActions={config.selectionActions || []}
        extraActions={extraActions}
        extraButtons={<>{extraButtons}</>}
        extraDetails={config.extraDetails}
        defaultSelected={config.defaultSelected || []}
        // Dynamic extra actions support
        dynamicExtraButtons={config.extraButtons || []}
        dynamicRowActions={config.rowActions || []}
        customModals={config.customModals || {}}
        extraData={config.extraData || null}
        // Pass callback to get allRows data for modal
        onDataChange={(data) => setAllRows(data)}
        // Force refresh when forms are submitted
        key={`page-${refreshTrigger}`}
      />

      {/* Create Modal */}
      {config.hasModal && (
        <DynamicModal
          modalConfig={config.modal}
          open={openCreate}
          onClose={() => {
            setOpenCreate(false);
            setEditingData({});
          }}
          data={{}}
          forEdit={false}
          setAllRows={setAllRows}
          allRows={allRows}
          apis={config.apis}
          onRefresh={() => setRefreshTrigger(prev => prev + 1)}
        />
      )}

      {/* Edit Modal */}
      {config.hasModal && (
        <DynamicModal
          modalConfig={config.modal}
          open={openEdit}
          onClose={() => {
            setOpenEdit(false);
            setEditingData({});
          }}
          data={editingData}
          forEdit={true}
          setAllRows={setAllRows}
          allRows={allRows}
          apis={config.apis}
          onRefresh={() => setRefreshTrigger(prev => prev + 1)}
        />
      )}
    </>
  );
};

/**
 * HOC to create dynamic pages easily
 * 
 * Usage:
 * export default createDynamicPage('brands');
 * 
 * This creates a complete page component with all CRUD functionality
 */
export const createDynamicPage = (pageName) => {
  return () => <DynamicPage pageName={pageName} />;
};

export default DynamicPage; 