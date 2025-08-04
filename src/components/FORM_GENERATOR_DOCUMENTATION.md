# Form Generator System Documentation

## Overview

The Form Generator system provides a complete solution for creating dynamic forms in the CustomePage component. It supports all major field types, validation, permissions, and CRUD operations.

## Key Components

### 1. FormGenerator
- **Location**: `src/components/common/FormGenerator.jsx`
- **Purpose**: Renders dynamic forms based on field configuration
- **Features**: Validation, permissions, custom components, error handling

### 2. DynamicModal
- **Location**: `src/components/modals/DynamicModal.jsx`
- **Purpose**: Wraps FormGenerator in a modal for CRUD operations
- **Features**: Create, edit, delete, redirect handling, API integration

### 3. CustomePage (Enhanced)
- **Location**: `src/components/customePage.jsx`
- **Purpose**: Complete page component with integrated form generator
- **Features**: Table display, form modal, permissions, selection management

## Usage Guide

### Basic Usage

```jsx
import CustomePage from "../components/customePage";
import { API_ENDPOINTS } from "../helpers/api-routes";

const MyPage = () => {
  // Define form fields
  const fields = [
    {
      name: 'title',
      label: 'عنوان',
      type: 'textInput',
      required: true
    },
    {
      name: 'description',
      label: 'توضیحات',
      type: 'editor',
      required: false
    }
  ];

  // Define APIs
  const apis = {
    GET_DATA: API_ENDPOINTS.GET_ITEMS,
    CREATE_DATA: API_ENDPOINTS.CREATE_ITEM,
    EDIT_DATA: API_ENDPOINTS.EDIT_ITEM,
    DELETE_DATA: API_ENDPOINTS.DELETE_ITEM,
    EXPORT_DATA: API_ENDPOINTS.EXPORT_ITEMS,
    EDIT_ACTIVE_DATA: API_ENDPOINTS.TOGGLE_ACTIVE
  };

  return (
    <CustomePage
      apis={apis}
      title="آیتم"
      canAdd={true}
      canEdit={true}
      permissionsTag="items"
      feilds={fields}
      customeModal={false}
    />
  );
};
```

### Supported Field Types

#### 1. TextInput
```jsx
{
  name: 'title',
  label: 'عنوان',
  type: 'textInput',
  required: true,
  validation: (value) => {
    if (value.length < 3) return 'حداقل 3 کاراکتر';
    return true;
  },
  props: {
    number: false,
    price: false,
    ltr: false
  }
}
```

#### 2. Dropdown
```jsx
{
  name: 'category',
  label: 'دسته‌بندی',
  type: 'dropdown',
  required: true,
  options: [
    { id: 1, title: 'دسته اول' },
    { id: 2, title: 'دسته دوم' }
  ]
}
```

#### 3. Text Editor
```jsx
{
  name: 'description',
  label: 'توضیحات',
  type: 'editor',
  required: false
}
```

#### 4. File Uploader
```jsx
{
  name: 'image',
  label: 'تصویر',
  type: 'uploader',
  required: false
}
```

#### 5. Switch
```jsx
{
  name: 'isActive',
  label: 'فعال/غیرفعال',
  type: 'switch',
  required: false,
  defaultValue: true
}
```

#### 6. Radio Button
```jsx
{
  name: 'status',
  label: 'وضعیت',
  type: 'radio',
  required: true,
  options: [
    { value: 'draft', label: 'پیش‌نویس' },
    { value: 'published', label: 'منتشر شده' }
  ],
  defaultValue: 'draft'
}
```

#### 7. Checkbox
```jsx
{
  name: 'isHighlighted',
  label: 'برجسته',
  type: 'checkbox',
  required: false,
  defaultValue: false
}
```

#### 8. Number Input
```jsx
{
  name: 'price',
  label: 'قیمت',
  type: 'number',
  required: true,
  defaultValue: 0
}
```

#### 9. Color Input
```jsx
{
  name: 'color',
  label: 'رنگ',
  type: 'color',
  required: false,
  defaultValue: '#000000'
}
```

### CustomePage Props

#### Core Props
- `apis`: Object containing API endpoints
- `title`: Page title
- `permissionsTag`: Permission module name
- `feilds`: Array of field configurations
- `canAdd`: Enable add functionality
- `canEdit`: Enable edit functionality

#### Modal Control Props
- `customeModal`: Use custom modal instead of form generator
- `createOrEditPageUsingOtherPage`: Redirect to separate page for add/edit
- `addLink`: Link for add page (when using redirect)
- `editLink`: Link for edit page (when using redirect)

#### Advanced Props
- `redirectModal`: Custom redirect modal component
- `redirectModalProps`: Props for redirect modal
- `extraButtons`: Additional action buttons
- `selectionActions`: Actions for selected items
- `broadCrumb`: Breadcrumb navigation

### Field Configuration Options

#### Required Properties
- `name`: Field identifier (string)
- `label`: Display label (string)
- `type`: Field type (string)

#### Optional Properties
- `required`: Field is required (boolean)
- `disabled`: Field is disabled (boolean)
- `defaultValue`: Default value (any)
- `options`: Options for dropdown/radio (array)
- `validation`: Custom validation function
- `permissions`: Required permissions (array)
- `props`: Additional props for field component
- `customRender`: Custom render function

### Validation

#### Built-in Validation
- Required field validation
- Field type validation

#### Custom Validation
```jsx
{
  name: 'email',
  label: 'ایمیل',
  type: 'textInput',
  validation: (value, allFormData) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'ایمیل معتبر نیست';
    }
    return true;
  }
}
```

### Permissions

#### Field-Level Permissions
```jsx
{
  name: 'secretField',
  label: 'فیلد محرمانه',
  type: 'textInput',
  permissions: ['admin.view', 'manager.read']
}
```

#### Page-Level Permissions
```jsx
<CustomePage
  permissionsTag="products"
  // This will check userPermissions.products.view, insert, update, delete
/>
```

### Custom Components

#### Register Custom Field Type
```jsx
const customComponents = {
  myCustomType: ({ value, onChange, label, ...props }) => (
    <div>
      <label>{label}</label>
      <input 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  )
};

<CustomePage
  customComponents={customComponents}
  feilds={[
    {
      name: 'customField',
      label: 'Custom Field',
      type: 'myCustomType'
    }
  ]}
/>
```

### Advanced Features

#### Custom Form Actions
```jsx
const extraActions = [
  <Button key="custom" onClick={handleCustomAction}>
    Custom Action
  </Button>
];

<CustomePage
  extraActions={extraActions}
/>
```

#### Selection Actions
```jsx
const selectionActions = [
  {
    title: 'Bulk Delete',
    icon: <Delete />,
    onClick: (selectedItems, selectedIds) => {
      // Handle bulk delete
    },
    permissions: ['admin.delete'],
    requiresSelection: true
  }
];

<CustomePage
  selectionActions={selectionActions}
/>
```

#### Redirect Modal Integration
```jsx
import RedirectModal from "../components/blogs/redirect";

<CustomePage
  redirectModal={RedirectModal}
  redirectModalProps={{
    name: "slug"
  }}
/>
```

## Migration Guide

### From Old Modal to Form Generator

#### Before (Old Modal)
```jsx
// Custom modal component with manual form handling
const MyModal = ({ open, close, data, forEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Manual form submission, validation, etc.
  
  return (
    <Modal>
      <TextInput value={title} onChange={setTitle} />
      <TextEditor value={description} onChange={setDescription} />
      <Button onClick={handleSubmit}>Submit</Button>
    </Modal>
  );
};
```

#### After (Form Generator)
```jsx
// Just define fields configuration
const fields = [
  {
    name: 'title',
    label: 'عنوان',
    type: 'textInput',
    required: true
  },
  {
    name: 'description',
    label: 'توضیحات',
    type: 'editor',
    required: false
  }
];

<CustomePage
  feilds={fields}
  // All form handling is automatic
/>
```

### Performance Optimizations

#### 1. Memoization
- FormGenerator uses React.memo for field components
- Selection manager is optimized for large datasets
- Accordion and cell managers handle DOM efficiently

#### 2. Lazy Loading
- Modal components are loaded only when needed
- Field components are rendered on-demand

#### 3. Efficient Updates
- Only modified rows are updated in the table
- Form state is managed efficiently with minimal re-renders

## Troubleshooting

### Common Issues

#### 1. Form Not Showing
- Check if `feilds` prop has values
- Ensure `customeModal` is not set to true
- Verify permissions for the page

#### 2. Field Not Rendering
- Check field type spelling
- Verify field configuration
- Check console for errors

#### 3. Validation Not Working
- Ensure validation function returns true for valid values
- Check validation function syntax
- Verify required fields are properly configured

#### 4. API Calls Failing
- Check API endpoint configuration
- Verify token and permissions
- Check network requests in browser dev tools

### Debug Mode

Enable debug mode for detailed logging:

```jsx
// Development environment automatically enables debug mode
// Check console for selection manager, accordion, and cell manager logs
```

## Best Practices

### 1. Field Configuration
- Use descriptive field names
- Provide clear labels
- Set appropriate default values
- Add validation for data integrity

### 2. Performance
- Minimize the number of fields per form
- Use appropriate field types
- Implement proper validation
- Use memoization for expensive operations

### 3. User Experience
- Group related fields logically
- Use appropriate field types for data
- Provide clear error messages
- Implement proper loading states

### 4. Code Organization
- Keep field configurations in separate files
- Use consistent naming conventions
- Document custom validation functions
- Implement proper error handling

## Examples

See `src/pages/Brands/index.jsx` for a complete implementation example.
See `src/components/test/FormGeneratorTest.jsx` for field type examples. 