import React, { useState, useEffect, memo, useCallback, useMemo } from "react";
import { 
  Box, 
  Switch, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  FormLabel, 
  FormControl,
  Button,
  CircularProgress,
  IconButton,
  TextField
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import TextInput from "./TextInput";
import Dropdown from "./Dropdown";
import TextEditor from "./TextEditor";
import UploadImage from "./UploadImage";
import Checkbox from "./Checkbox";
import ColorInput from "./ColorInput";
import NumberInput from "./NumberInput";
import MultipleImages from "./MultipleImages";
import CategoryTree from "./CategoryTree";
import SearchableDropdown from "./SearchableDropdown";
import DatePicker from "react-datepicker2";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Calendar } from "react-datepicker2";

// Dynamic import for Monaco Editor
const Editor = React.lazy(() => import('@monaco-editor/react'));

const FormGenerator = memo(({ 
  fields = [], 
  initialData = {}, 
  onSubmit,
  onDelete,
  loading = false,
  forEdit = false,
  submitLabel = "ثبت اطلاعات",
  showDeleteButton = false,
  onReset,
  extraActions = [],
  customComponents = {}
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedImages, setSelectedImages] = useState({});
  const { userPermissions } = useSelector((state) => state.relationals);

  // Initialize form data
  useEffect(() => {
    const initialFormData = {};
    fields.forEach(field => {
      if (initialData[field.name] !== undefined) {
        initialFormData[field.name] = initialData[field.name];
      } else if (field.defaultValue !== undefined) {
        initialFormData[field.name] = field.defaultValue;
      } else {
        // Set appropriate default values based on field type
        switch (field.type) {
          case 'checkbox':
          case 'switch':
            initialFormData[field.name] = false;
            break;
          case 'number':
            initialFormData[field.name] = 0;
            break;
          case 'multipleImages':
            initialFormData[field.name] = [];
            break;
          default:
            initialFormData[field.name] = '';
        }
      }
    });
    setFormData(initialFormData);
  }, [fields, initialData]);

  // Handle field value changes
  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  };

  // Handle image selection for upload fields
  const handleImageSelection = (fieldName, imageData) => {
    setSelectedImages(prev => ({
      ...prev,
      [fieldName]: imageData
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} اجباری است`;
      }
      
      // Custom validation
      if (field.validation && formData[field.name]) {
        const validationResult = field.validation(formData[field.name], formData);
        if (validationResult !== true) {
          newErrors[field.name] = validationResult;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("لطفاً فیلدهای اجباری را پر کنید");
      return;
    }

    // Prepare submission data
    const submissionData = { ...formData };
    
    // Add selected images to submission data
    Object.keys(selectedImages).forEach(fieldName => {
      const field = fields.find(f => f.name === fieldName);
      if (field && field.type === 'uploader') {
        submissionData[`${fieldName}_files`] = formData[fieldName];
        submissionData[`${fieldName}_fromGallery`] = selectedImages[fieldName] || "";
      }
    });

    onSubmit(submissionData);
  };

  // Handle delete
  const handleDelete = () => {
    if (onDelete) {
      onDelete(formData);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({});
    setErrors({});
    setSelectedImages({});
    if (onReset) {
      onReset();
    }
  };

  // Render individual field
  const renderField = (field) => {
    const {
      name,
      label,
      type,
      required,
      disabled,
      options = [],
      props = {},
      permissions,
      customRender
    } = field;

    // Check permissions if specified
    if (permissions && !permissions.every(permission => {
      const [module, operation] = permission.split('.');
      return userPermissions?.[module]?.[operation];
    })) {
      return null;
    }

    // Use custom render function if provided
    if (customRender) {
      return customRender(formData[name], (value) => handleFieldChange(name, value), formData);
    }

    // Use custom component if provided
    if (customComponents[type]) {
      const CustomComponent = customComponents[type];
      return (
        <CustomComponent
          key={name}
          value={formData[name]}
          onChange={(value) => handleFieldChange(name, value)}
          label={label}
          required={required}
          disabled={disabled}
          error={errors[name]}
          {...props}
        />
      );
    }

    const commonProps = {
      key: name,
      disabled,
      ...props
    };

    switch (type) {
      case 'textInput':
        return (
          <TextInput
            {...commonProps}
            label={label}
            currentValue={formData[name] || ''}
            change={(value) => handleFieldChange(name, value)}
            err={Boolean(errors[name])}
          />
        );

      case 'number':
        return (
          <NumberInput
            {...commonProps}
            label={label}
            value={formData[name] || 0}
            onChange={(value) => handleFieldChange(name, value)}
            error={Boolean(errors[name])}
          />
        );

      case 'dropdown':
        return (
          <Dropdown
            {...commonProps}
            title={label}
            data={options}
            value={formData[name]}
            change={(value) => handleFieldChange(name, value)}
            err={Boolean(errors[name])}
          />
        );

      case 'editor':
        return (
          <Box key={name} className="mt-4">
            <span className="text-xs">{label}</span>
            <TextEditor
              {...commonProps}
              value={formData[name] || ''}
              change={(value) => handleFieldChange(name, value)}
              noBorder
            />
          </Box>
        );

      case 'uploader':
        return (
          <UploadImage
            {...commonProps}
            file={formData[name]}
            change={(file) => handleFieldChange(name, file)}
            address={forEdit ? initialData[`${name}GalleryId`] : undefined}
            selectedProductImage={selectedImages[name]}
            setselectedProductImage={(image) => handleImageSelection(name, image)}
          />
        );

      case 'multipleImages':
        return (
          <MultipleImages
            {...commonProps}
            files={formData[name] || []}
            setFiles={(files) => handleFieldChange(name, files)}
            selectedImages={selectedImages[name]}
            setSelectedImages={(images) => handleImageSelection(name, images)}
          />
        );

      case 'switch':
        return (
          <div key={name} className="flex items-center gap-3">
            <span>{label}:</span>
            <Switch
              {...commonProps}
              checked={Boolean(formData[name])}
              onChange={(e) => handleFieldChange(name, e.target.checked)}
            />
          </div>
        );

      case 'checkbox':
        return (
          <Checkbox
            {...commonProps}
            label={label}
            checked={Boolean(formData[name])}
            onChange={(checked) => handleFieldChange(name, checked)}
          />
        );

      case 'radio':
        return (
          <FormControl key={name} component="fieldset" disabled={disabled}>
            <FormLabel component="legend">{label}</FormLabel>
            <RadioGroup
              value={formData[name] || ''}
              onChange={(e) => handleFieldChange(name, e.target.value)}
            >
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio size="small" />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'color':
        return (
          <ColorInput
            {...commonProps}
            label={label}
            value={formData[name] || ''}
            onChange={(value) => handleFieldChange(name, value)}
          />
        );

      case 'categoryTree':
        return (
          <CategoryTree
            {...commonProps}
            key={name}
            data={options}
            value={formData[name]}
            change={(value) => handleFieldChange(name, value)}
            title={label}
            emptyValue={props.emptyValue || false}
          />
        );

      case 'searchableDropdown':
        return (
          <SearchableDropdown
            {...commonProps}
            key={name}
            data={options}
            change={(value) => handleFieldChange(name, value)}
            label={label}
            multiple={props.multiple !== false}
            values={formData[name] || []}
            disable={disabled}
          />
        );

      case 'datePicker':
        return (
          <Box key={name} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span className="text-sm">{label}</span>
            <DatePicker
              {...commonProps}
              value={formData[name] || null}
              onChange={(value) => handleFieldChange(name, value)}
              placeholder={label}
              style={{ width: '100%' }}
            />
          </Box>
        );

      case 'timePicker':
        return (
          <LocalizationProvider key={name} dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span className="text-sm">{label}</span>
              <TimePicker
                {...commonProps}
                value={formData[name] || null}
                onChange={(value) => handleFieldChange(name, value)}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
          </LocalizationProvider>
        );

      case 'calendar':
        return (
          <Box key={name} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span className="text-sm">{label}</span>
            <Calendar
              {...commonProps}
              value={formData[name] || null}
              onChange={(value) => handleFieldChange(name, value)}
            />
          </Box>
        );

      case 'codeEditor':
        return (
          <Box key={name} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span className="text-sm">{label}</span>
            <Editor
              {...commonProps}
              height="200px"
              defaultLanguage="javascript"
              defaultValue={formData[name] || ''}
              onChange={(value) => handleFieldChange(name, value)}
            />
          </Box>
        );

      case 'multipleFields':
        return (
          <Box key={name} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span className="text-sm font-medium">{label}</span>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {options.map((subField, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span className="text-sm">{subField.label}:</span>
                  {subField.type === 'switch' ? (
                    <Switch
                      checked={Boolean(formData[subField.name])}
                      onChange={(e) => handleFieldChange(subField.name, e.target.checked)}
                      disabled={disabled}
                    />
                  ) : (
                    <span>Unsupported sub-field type</span>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        );

      default:
        return (
          <TextInput
            {...commonProps}
            label={label}
            currentValue={formData[name] || ''}
            change={(value) => handleFieldChange(name, value)}
            err={Boolean(errors[name])}
          />
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {fields.map(field => (
        <Box key={field.name}>
          {renderField(field)}
          {errors[field.name] && (
            <div className="text-red-500 text-xs mt-1">
              {errors[field.name]}
            </div>
          )}
        </Box>
      ))}
      
      {/* Extra Actions */}
      {extraActions.map((action, index) => (
        <Box key={index} sx={{ mt: 2 }}>
          {action}
        </Box>
      ))}

      {/* Action Buttons */}
      <Box sx={{ display: "flex", mt: 3 }}>
        {showDeleteButton && onDelete && (
          <IconButton onClick={handleDelete} disabled={loading}>
            <Delete color="error" />
          </IconButton>
        )}
        
        <div style={{ flexGrow: 1 }} />
        
        {onReset && (
          <Button
            variant="outlined"
            onClick={handleReset}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            پاک کردن
          </Button>
        )}
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : submitLabel}
        </Button>
      </Box>
    </Box>
  );
};

});

FormGenerator.displayName = 'FormGenerator';

export default FormGenerator; 