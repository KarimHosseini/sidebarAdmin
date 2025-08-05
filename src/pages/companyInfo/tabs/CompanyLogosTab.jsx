import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import CustomePage from '../../../components/customePage';
import {
  // Main logos APIs
  GET_LOGOES,
  EXPORT_LOGOES,
  EDIT_ACTIVE_LOGOES,
  CREATE_LOGO,
  EDIT_LOGO,
  DELETE_LOGO,
  // Footer logos APIs
  GET_FOOTER_LOGOS,
  EXPORT_FOOTER_LOGOES,
  EDIT_ACTIVE_FOOTER_LOGOES,
  CREATE_FOOTER_LOGO,
  EDIT_FOOTER_LOGO,
  DELETE_FOOTER_LOGO,
} from '../../../helpers/api-routes';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const CompanyLogosTab = () => {
  const [tabValue, setTabValue] = useState(0);

  // Define form fields for main logos
  const mainLogoFields = [
    {
      name: 'title',
      label: 'عنوان لوگو',
      type: 'textInput',
      required: true,
    },
    {
      name: 'avatar',
      label: 'تصویر لوگو',
      type: 'uploader',
      required: true,
    },
    {
      name: 'link',
      label: 'لینک',
      type: 'textInput',
      required: false,
    },
    {
      name: 'active',
      label: 'فعال/غیرفعال',
      type: 'switch',
      defaultValue: true,
    },
  ];

  // Define form fields for footer logos
  const footerLogoFields = [
    {
      name: 'title',
      label: 'عنوان لوگو',
      type: 'textInput',
      required: true,
    },
    {
      name: 'avatar',
      label: 'تصویر لوگو',
      type: 'uploader',
      required: true,
    },
    {
      name: 'link',
      label: 'لینک',
      type: 'textInput',
      required: false,
    },
    {
      name: 'alt',
      label: 'متن جایگزین (Alt)',
      type: 'textInput',
      required: false,
    },
    {
      name: 'active',
      label: 'فعال/غیرفعال',
      type: 'switch',
      defaultValue: true,
    },
  ];

  // Define APIs for main logos
  const mainLogoApis = {
    GET_DATA: GET_LOGOES,
    EXPORT_DATA: EXPORT_LOGOES,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_LOGOES,
    CREATE_DATA: CREATE_LOGO,
    EDIT_DATA: EDIT_LOGO,
    DELETE_DATA: DELETE_LOGO,
  };

  // Define APIs for footer logos
  const footerLogoApis = {
    GET_DATA: GET_FOOTER_LOGOS,
    EXPORT_DATA: EXPORT_FOOTER_LOGOES,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_FOOTER_LOGOES,
    CREATE_DATA: CREATE_FOOTER_LOGO,
    EDIT_DATA: EDIT_FOOTER_LOGO,
    DELETE_DATA: DELETE_FOOTER_LOGO,
  };

  return (
    <Box>
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="لوگوهای اصلی" />
          <Tab label="لوگوهای فوتر" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <CustomePage
          apis={mainLogoApis}
          title="لوگوهای اصلی"
          canAdd={true}
          canEdit={true}
          permissionsTag="brand"
          feilds={mainLogoFields}
          customeModal={false}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <CustomePage
          apis={footerLogoApis}
          title="لوگوهای فوتر"
          canAdd={true}
          canEdit={true}
          permissionsTag="brand"
          feilds={footerLogoFields}
          customeModal={false}
        />
      </TabPanel>
    </Box>
  );
};

export default CompanyLogosTab;