import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Paper,
  CircularProgress,
  Icon,
  IconButton,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "./common";
import Exports from "./common/export";
import CustomeLayout from "./customeTable";
import DataFetcher from "./dataFetch";
import Filters from "./filters";
import NoAccess from "./noAccess";
import SyncButton from "./sync";
import DynamicModal from "./modals/DynamicModal";
import { createSelectionManager } from "../utils/selectionManager";
import { getFiltersFromUrl } from "../utils/filterUtils";
import { Edit } from "@mui/icons-material";

const CustomePage = ({
  apis,
  title,
  canAdd,
  canEdit,
  permissionsTag,
  addLink,
  editLink,
  customeModal = false,
  feilds = [],
  createOrEditPageUsingOtherPage = false,
  extraButtons,
  broadCrumb = [],
  extraActions = [],
  extraDetails,
  defaultSelected = [],
  neededFields = [],
  selectionActions = [], // Array of action objects: { title, icon, onClick, variant, color, permissions, loading, requiresSelection, sx }
  redirectModal,
  redirectModalProps = {},
  onRowClick,
  onRowDoubleClick,
  columnsOverride,
  filterConfig,
  defaultFilter = [],
  rowIdField = "id",
  modalProps = {},
  showSync = true,
  showExport = true,
  onDataChange,
  customModalComponent,
  validateBeforeSubmit,
  onAfterSubmit,
  onAfterDelete,
  onFormChange,
  extraFormActions = [],
  customComponents = {},
  extraParams = {},
}) => {
  const {
    GET_DATA,
    EXPORT_DATA,
    EDIT_ACTIVE_DATA,
    DELETE_ALL_DATA,
    EDIT_ACTIVE_ALL_DATA,
    EDIT_DATA,
    DELETE_DATA,
    CREATE_DATA,
  } = apis;
  const { userPermissions } = useSelector((state) => state.relationals);

  const selectionManager = useRef(
    createSelectionManager({
      defaultSelected: defaultSelected,
      debug: process.env.NODE_ENV === "development",
      persistSelection: true,
    })
  ).current;

  // State to trigger re-renders when selection changes
  const [selectedCount, setSelectedCount] = useState(defaultSelected.length);

  const navigate = useNavigate();
  const [openCreate, setOpenCreate] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [forEdit, setForEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshData, setRefresh] = useState(0);
  const [search, setsearch] = useState("");
  const [sumbitSearch, setSumbitSearch] = useState("");
  const [limit, setLimit] = useState(20);

  // Fixed: Initialize with URL filters or empty array (no defaultFilter)
  const [filter, setFilter] = useState(() => {
    const urlFilters = getFiltersFromUrl();
    // Filter out defaultFilter=false from being passed to API
    const baseFilters = urlFilters.filter((f) => f.name !== "defaultFilter");

    // Add any additional filters passed as props
    if (apis.initialFilter) {
      return [...baseFilters, ...apis.initialFilter];
    }

    // Add defaultFilter prop if provided
    if (defaultFilter.length > 0) {
      return [...baseFilters, ...defaultFilter];
    }

    return baseFilters;
  });

  const [allRows, setAllRows] = useState([]);
  const [sort, setSort] = useState({});

  // Fixed: Handle URL changes properly
  useEffect(() => {
    const handleUrlChange = () => {
      const urlFilters = getFiltersFromUrl();
      // Filter out defaultFilter=false from being passed to API
      setFilter(urlFilters.filter((f) => f.name !== "defaultFilter"));
    };

    window.addEventListener("popstate", handleUrlChange);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  const { hasMore, loading, allData, CurrentPage, metaData, header, setting } =
    DataFetcher(
      limit,
      page,
      sort,
      GET_DATA,
      filter,
      true,
      refreshData,
      sumbitSearch,
      extraParams
    );

  useEffect(() => {
    if (refreshData > 0) {
      selectionManager.deselectAll();
    }
  }, [refreshData]);

  // Listen for selection changes
  useEffect(() => {
    const handleSelectionChange = (event) => {
      setSelectedCount(event.detail.count);
    };

    selectionManager.addEventListener("selectionChange", handleSelectionChange);

    return () => {
      selectionManager.removeEventListener(
        "selectionChange",
        handleSelectionChange
      );
    };
  }, [selectionManager]);

  const hasInitialRender = useRef(false);
  useEffect(() => {
    if (!hasInitialRender.current) {
      hasInitialRender.current = true;
      return;
    }

    if (allData.length === 0) return;

    let isRestoring = false;
    const restoreSelectionStates = () => {
      if (isRestoring) return;
      isRestoring = true;

      try {
        const selectedIds = selectionManager.getSelected();

        selectedIds.forEach((id) => {
          const checkbox = document.getElementById(`checkbox-${id}`);
          if (checkbox) {
            checkbox.checked = true;

            const row = checkbox.closest("tr");
            if (row) {
              row.classList.add("Mui-selected");
            }
          }
        });
      } finally {
        isRestoring = false;
      }
    };

    const timerId = setTimeout(restoreSelectionStates, 150);

    return () => {
      clearTimeout(timerId);
    };
  }, [allData]);

  useEffect(() => {
    setAllRows(allData);
    // Notify parent component of data changes
    if (onDataChange) {
      onDataChange(allData);
    }
  }, [allData, onDataChange]);

  // Handle modal close
  const handleModalClose = () => {
    setOpenCreate(false);
    setForEdit(false);
    setEditingData({});
  };
  const editModals = useMemo(() => {
    return canEdit &&
      feilds.length > 0 &&
      !customeModal &&
      userPermissions[permissionsTag]?.update
      ? {
          title: "ویرایش",
          handler: (
            <>
              <IconButton
                onClick={() => {
                  setOpenCreate(true);
                }}
                variant="outlined"
              >
                <Edit sx={{ color: "#ff2000" }} />
              </IconButton>
            </>
          ),
        }
      : {};
  }, [feilds]);

  if (
    !userPermissions ||
    !userPermissions[permissionsTag] ||
    !userPermissions[permissionsTag].view
  ) {
    return <NoAccess />;
  }

  const actionButtons = (
    <>
      {showSync && <SyncButton setRefresh={setRefresh} setting={setting} />}
      {showExport && userPermissions?.tipax?.export && (
        <Exports
          key={`export-${selectedCount}`} // Force re-render when selection changes
          sumbitSearch={sumbitSearch}
          filter={filter}
          header={header}
          data={allData}
          selectedData={selectionManager.getSelected()} // This will now re-render when selectedCount changes
          title={title}
          api={EXPORT_DATA} 
          extraParams={extraParams}
        />
      )}
      {selectionActions.map((action, index) => {
        // Check permissions if specified
        const hasPermission =
          !action.permissions ||
          action.permissions.every((permission) => {
            const [module, operation] = permission.split(".");
            return userPermissions?.[module]?.[operation];
          });

        if (!hasPermission) return null;

        // Check if action requires selection
        const requiresSelection = action.requiresSelection !== false;
        const hasSelection = selectionManager.getSelected().length > 0;
        const isDisabled =
          action.disabled || (requiresSelection && !hasSelection);

        return (
          <Button
            key={index}
            onClick={() => {
              // Always get fresh selected IDs at click time
              const currentSelectedIds = selectionManager.getSelected();
              const selectedItems = currentSelectedIds
                .map((id) =>
                  allData.find(
                    (item) => item.id === id || item.id === parseInt(id)
                  )
                )
                .filter(Boolean);
              action.onClick(selectedItems, currentSelectedIds); // Pass both items and IDs
            }}
            variant={action.variant || "contained"}
            color={action.color || "primary"}
            sx={action.sx || {}}
            disabled={isDisabled}
          >
            {action.loading ? (
              <CircularProgress size={20} />
            ) : (
              <>
                {action.icon}
                {action.title}
              </>
            )}
          </Button>
        );
      })}
      {userPermissions[permissionsTag]?.insert &&
        feilds.length > 0 &&
        !customeModal && (
          <Button
            onClick={() => {
              if (createOrEditPageUsingOtherPage && addLink) {
                navigate(addLink);
              } else {
                setForEdit(false);
                setEditingData({});
                setOpenCreate(true);
              }
            }}
            variant="contained"
            startIcon={<AddIcon />}
          >
            افزودن {title} جدید
          </Button>
        )}
      {extraButtons}
    </>
  );

  return (
    <>
      <PageTitle broadCrumb={broadCrumb} title={title} />
      <div className="md:mx-3 mx-1 relative">
        <Filters
          limit={limit}
          setLimit={setLimit}
          headers={header}
          setFilter={setFilter}
          filter={filter}
          setPage={setPage}
          loading={loading}
          extraButtons={actionButtons}
          extraDetails={extraDetails}
        />

        <CustomeLayout
          limit={limit}
          setLimit={setLimit}
          setAllRows={setAllRows}
          editApi={
            userPermissions[permissionsTag]?.update ? EDIT_ACTIVE_DATA : false
          }
          title={title}
          headers={columnsOverride || header}
          setSearch={setsearch}
          search={search}
          page={page}
          total_pages={metaData?.total_pages}
          setApplySearch={(e) => {
            setPage(1);
            setSumbitSearch(e);
          }}
          rows={allRows}
          hasMore={hasMore}
          loading={loading}
          setPage={setPage}
          setting={setting}
          CurrentPage={CurrentPage}
          actions={[...extraActions,editModals].filter((it) => it)}
          length={metaData?.total}
          name={title}
          maxHeight={{ lg: "69.5vh", md: "68vh", xl: "74vh" }}
          setSort={(e) => {
            setPage(1);
            setSort({ ...sort, ...e });
          }}
          currentRow={(data) => {
            setEditingData(data);
            // Handle row click events
            if (onRowClick) {
              onRowClick(data);
            }
            // Handle edit modal opening
            if (feilds.length > 0 && !customeModal) {
              setForEdit(true);
            }
          }}
          onRowDoubleClick={onRowDoubleClick}
          selectionManager={selectionManager}
          setRefresh={setRefresh}
          deleteAllApi={
            userPermissions[permissionsTag]?.deleteAll ? DELETE_ALL_DATA : null
          }
          editActiveAllApi={
            userPermissions[permissionsTag]?.activeAll
              ? EDIT_ACTIVE_ALL_DATA
              : null
          }
          neededFields={neededFields}
          rowIdField={rowIdField}
        />

        <div
          id="selection-counter"
          className="absolute -bottom-2 right-2 text-[0.7rem] text-[#001ee4]"
          style={{ display: "none" }}
        ></div>
      </div>

      {/* Dynamic Modal - Only show if fields are provided and not using custom modal */}
      {feilds.length > 0 && !customeModal && openCreate && (
        <DynamicModal
          open={openCreate}
          close={handleModalClose}
          title={title}
          fields={feilds}
          data={editingData}
          forEdit={forEdit}
          setAllRows={setAllRows}
          allRows={allRows}
          apis={{
            CREATE_API: CREATE_DATA,
            EDIT_API: EDIT_DATA,
            DELETE_API: DELETE_DATA,
            REDIRECT_API: apis.REDIRECT_API, // Use redirect API from props
          }}
          permissionsTag={permissionsTag}
          showDeleteButton={userPermissions[permissionsTag]?.delete}
          redirectModal={redirectModal}
          redirectModalProps={redirectModalProps}
          validateBeforeSubmit={validateBeforeSubmit}
          onAfterSubmit={onAfterSubmit}
          onAfterDelete={onAfterDelete}
          onFormChange={onFormChange}
          extraActions={extraFormActions}
          customComponents={customComponents}
          {...modalProps}
        />
      )}

      {/* Custom Modal Component if provided */}
      {customModalComponent && customModalComponent}
    </>
  );
};

export default CustomePage;
