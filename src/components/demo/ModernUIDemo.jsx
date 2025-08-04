import React, { useState } from 'react';
import { Box, Grid, Typography, Chip, IconButton } from '@mui/material';
import { 
  Dashboard, 
  Add, 
  Edit, 
  Delete, 
  Search, 
  Person, 
  Settings,
  Visibility,
  MoreVert 
} from '@mui/icons-material';
import {
  PageHeader,
  ModernButton,
  ModernInput,
  ModernTable,
  ModernCard
} from '../common';

const ModernUIDemo = () => {
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sample data for the table
  const sampleData = [
    { id: 1, name: 'علی احمدی', email: 'ali@example.com', status: 'فعال', role: 'مدیر' },
    { id: 2, name: 'فاطمه محمدی', email: 'fateme@example.com', status: 'غیرفعال', role: 'کاربر' },
    { id: 3, name: 'محمد رضایی', email: 'mohammad@example.com', status: 'فعال', role: 'ادمین' },
    { id: 4, name: 'زهرا حسینی', email: 'zahra@example.com', status: 'فعال', role: 'کاربر' },
    { id: 5, name: 'حسن کریمی', email: 'hasan@example.com', status: 'غیرفعال', role: 'مدیر' },
  ];

  const tableColumns = [
    { field: 'id', label: 'شناسه', align: 'center' },
    { field: 'name', label: 'نام' },
    { field: 'email', label: 'ایمیل' },
    { 
      field: 'status', 
      label: 'وضعیت', 
      type: 'chip',
      align: 'center'
    },
    { field: 'role', label: 'نقش' },
    {
      field: 'actions',
      label: 'عملیات',
      type: 'actions',
      align: 'center',
      render: (row) => [
        {
          icon: <Visibility />,
          onClick: () => console.log('View', row.id),
        },
        {
          icon: <Edit />,
          onClick: () => console.log('Edit', row.id),
        },
        {
          icon: <Delete />,
          onClick: () => console.log('Delete', row.id),
        },
      ]
    },
  ];

  const breadcrumbs = [
    { label: 'داشبورد', path: '/dashboard' },
    { label: 'مدیریت سیستم', path: '/system' },
    { label: 'نمایش کامپوننت‌ها', path: '/demo' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header Demo */}
      <PageHeader
        title="نمایش کامپوننت‌های مدرن"
        subtitle="مجموعه‌ای از کامپوننت‌های زیبا و مدرن با طراحی گرادیانی"
        breadcrumbs={breadcrumbs}
        icon={<Dashboard />}
        showBackButton={true}
        actions={[
          <ModernButton key="add" variant="primary" startIcon={<Add />}>
            افزودن جدید
          </ModernButton>
        ]}
      />

      <Grid container spacing={3}>
        {/* Buttons Demo */}
        <Grid item xs={12} md={6}>
          <ModernCard
            title="دکمه‌های مدرن"
            subtitle="انواع مختلف دکمه‌ها با طراحی گرادیانی"
            icon={<Settings />}
            actions={[
              <IconButton key="more">
                <MoreVert />
              </IconButton>
            ]}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <ModernButton variant="primary">اصلی</ModernButton>
                <ModernButton variant="secondary">ثانویه</ModernButton>
                <ModernButton variant="success">موفقیت</ModernButton>
                <ModernButton variant="warning">هشدار</ModernButton>
                <ModernButton variant="error">خطا</ModernButton>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <ModernButton variant="outline">حاشیه‌دار</ModernButton>
                <ModernButton variant="ghost">شفاف</ModernButton>
                <ModernButton variant="primary" loading>
                  در حال بارگذاری
                </ModernButton>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <ModernButton variant="primary" size="small">
                  کوچک
                </ModernButton>
                <ModernButton variant="primary" size="medium">
                  متوسط
                </ModernButton>
                <ModernButton variant="primary" size="large">
                  بزرگ
                </ModernButton>
              </Box>
            </Box>
          </ModernCard>
        </Grid>

        {/* Inputs Demo */}
        <Grid item xs={12} md={6}>
          <ModernCard
            title="فیلدهای ورودی مدرن"
            subtitle="فیلدهای ورودی با افکت‌های بصری پیشرفته"
            icon={<Person />}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <ModernInput
                label="نام و نام خانوادگی"
                placeholder="نام خود را وارد کنید"
                startIcon={<Person />}
              />
              <ModernInput
                label="جستجو"
                placeholder="جستجو کنید..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                startIcon={<Search />}
              />
              <ModernInput
                label="توضیحات"
                placeholder="توضیحات خود را بنویسید..."
                multiline
                rows={3}
              />
              <ModernInput
                label="فیلد خطا"
                placeholder="این فیلد خطا دارد"
                error
                helperText="این فیلد اجباری است"
              />
            </Box>
          </ModernCard>
        </Grid>

        {/* Cards Demo */}
        <Grid item xs={12}>
          <ModernCard
            title="انواع کارت‌ها"
            subtitle="کارت‌ها با طراحی‌های مختلف"
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <ModernCard variant="default" title="پیش‌فرض">
                  <Typography>محتوای کارت پیش‌فرض</Typography>
                </ModernCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ModernCard variant="gradient" title="گرادیانی">
                  <Typography>محتوای کارت گرادیانی</Typography>
                </ModernCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ModernCard variant="glass" title="شیشه‌ای">
                  <Typography>محتوای کارت شیشه‌ای</Typography>
                </ModernCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ModernCard variant="outlined" title="حاشیه‌دار">
                  <Typography>محتوای کارت حاشیه‌دار</Typography>
                </ModernCard>
              </Grid>
            </Grid>
          </ModernCard>
        </Grid>

        {/* Table Demo */}
        <Grid item xs={12}>
          <ModernTable
            title="جدول مدرن"
            subtitle="جدول با طراحی مدرن و قابلیت‌های پیشرفته"
            columns={tableColumns}
            data={sampleData}
            pagination={true}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={sampleData.length}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            actions={[
              <ModernButton key="export" variant="outline" size="small">
                خروجی Excel
              </ModernButton>,
              <ModernButton key="add" variant="primary" size="small" startIcon={<Add />}>
                افزودن
              </ModernButton>
            ]}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ModernUIDemo;