# Selection Manager Usage Guide

## Overview
The Selection Manager provides a pure JavaScript-based selection system that avoids React re-renders while maintaining reactive UI updates.

## Key Features
1. **Zero React Re-renders** for selection operations
2. **Event-based notifications** to inform React when updates are needed
3. **DOM-direct manipulation** for optimal performance
4. **Persistent selection** across pagination

## How It Works

### Selection Flow
1. User clicks checkbox → DOM event
2. `selectionManager.handleCheckboxClick` processes the click
3. Internal Set is updated with selected IDs
4. DOM elements are updated directly (checkbox state, row styling)
5. **Selection change event is emitted**
6. React component listens for this event and updates a counter
7. Counter change triggers React re-render
8. Components that use `selectionManager.getSelected()` get fresh data

### Implementation Example

```jsx
// In your page component (e.g., Orders)
const MyPage = () => {
  // Define selection actions with the new signature
  const handleBulkAction = (selectedItems, selectedIds) => {
    // selectedItems: Array of full item objects
    // selectedIds: Array of just the IDs (more reliable)
    console.log('Selected IDs:', selectedIds);
    
    // Use selectedIds for API calls
    const formData = new FormData();
    formData.append('ids', selectedIds);
    
    // Make your API call
  };

  const selectionActions = [
    {
      title: "Bulk Action",
      icon: <SomeIcon />,
      onClick: handleBulkAction, // Will receive (selectedItems, selectedIds)
      variant: "outlined",
      color: "primary",
      permissions: ["module.action"],
      loading: isLoading,
      requiresSelection: true, // Disabled when nothing selected
    }
  ];

  return (
    <CustomePage
      title="My Page"
      apis={{ ... }}
      selectionActions={selectionActions}
    />
  );
};
```

### Key Points

1. **Always use both parameters** in selection action handlers:
   ```jsx
   const myAction = (selectedItems, selectedIds) => {
     // selectedIds is more reliable for IDs
     // selectedItems has full objects if you need other data
   };
   ```

2. **Selection state is always fresh** at click time - no stale closures

3. **Export component** automatically re-renders when selection changes

4. **Selection counter** updates in real-time at the bottom of the table

## Troubleshooting

### Issue: Selection one state behind
**Solution**: This is now fixed by the event system. The selection manager emits events that trigger React re-renders.

### Issue: Selection actions not working
**Solution**: Make sure your onClick handlers accept both `selectedItems` and `selectedIds` parameters.

### Issue: Export showing wrong count
**Solution**: The Export component now has a `key` prop that forces re-render when selection changes.

## Performance Notes
- Checkbox clicks are handled directly in the DOM
- React only re-renders when necessary (selection count changes)
- Large tables (1000+ rows) maintain smooth performance
- Selection persists across pagination without performance impact 