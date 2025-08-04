import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import FormGenerator from '../common/FormGenerator';

const FormGeneratorTest = () => {
  const [showForm, setShowForm] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  
  // Define test fields for all supported types
  const testFields = [
    {
      name: 'title',
      label: 'عنوان',
      type: 'textInput',
      required: true,
      validation: (value) => {
        if (value.length < 3) {
          return 'عنوان باید حداقل 3 کاراکتر باشد';
        }
        return true;
      }
    },
    {
      name: 'description',
      label: 'توضیحات',
      type: 'editor',
      required: false
    },
    {
      name: 'category',
      label: 'دسته بندی',
      type: 'dropdown',
      required: true,
      options: [
        { id: 1, title: 'دسته اول' },
        { id: 2, title: 'دسته دوم' },
        { id: 3, title: 'دسته سوم' }
      ]
    },
    {
      name: 'price',
      label: 'قیمت',
      type: 'number',
      required: true,
      defaultValue: 0
    },
    {
      name: 'isActive',
      label: 'فعال/غیرفعال',
      type: 'switch',
      required: false,
      defaultValue: true
    },
    {
      name: 'status',
      label: 'وضعیت',
      type: 'radio',
      required: true,
      options: [
        { value: 'draft', label: 'پیش نویس' },
        { value: 'published', label: 'منتشر شده' },
        { value: 'archived', label: 'آرشیو شده' }
      ],
      defaultValue: 'draft'
    },
    {
      name: 'isHighlighted',
      label: 'برجسته',
      type: 'checkbox',
      required: false,
      defaultValue: false
    },
    {
      name: 'image',
      label: 'تصویر',
      type: 'uploader',
      required: false
    },
    {
      name: 'color',
      label: 'رنگ',
      type: 'color',
      required: false,
      defaultValue: '#000000'
    }
  ];

  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
    setSubmittedData(data);
    setShowForm(false);
  };

  const handleReset = () => {
    setSubmittedData(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Form Generator Test
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={() => setShowForm(!showForm)}
          sx={{ mr: 2 }}
        >
          {showForm ? 'Hide Form' : 'Show Form'}
        </Button>
        
        {submittedData && (
          <Button 
            variant="outlined" 
            onClick={handleReset}
          >
            Clear Results
          </Button>
        )}
      </Box>

      {showForm && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Test Form with All Field Types
          </Typography>
          <FormGenerator
            fields={testFields}
            onSubmit={handleSubmit}
            onReset={handleReset}
            submitLabel="تست ارسال"
          />
        </Box>
      )}

      {submittedData && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Submitted Data:
          </Typography>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '1rem', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </Box>
      )}
    </Box>
  );
};

export default FormGeneratorTest; 