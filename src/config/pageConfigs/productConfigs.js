/**
 * Product-related Page Configurations
 */

import {
  BRANDS, EXPORT_BRANDS, CREATE_BRAND, EDIT_BRAND, EDIT_ACTIVE_BRAND, DELETE_BRAND,
  CATEGORIES, EXPORT_CATEGORIES, CREATE_CATEGORY, EDIT_CATEGORY, EDIT_ACTIVE_CATEGORY, DELETE_CATEGORY,
  ATTRIBUTES, EXPORT_ATTRIBUTES, CREATE_ATTR, EDIT_ATTR, EDIT_ACTIVE_ATTR, DELETE_ATTR,
  PUBLIC_ATTRS, EXPORT_PUBLIC_ATTRS, CREATE_PUBLIC_ATTR, EDIT_PUBLIC_ATTR, EDIT_ACTIVE_PUBLIC_ATTR, DELETE_PUBLIC_ATTR,
  ATTR_GROUPS, EXPORT_ATTR_GROUPS, CREATE_ATTR_GROUP, EDIT_ATTR_GROUP, EDIT_ACTIVE_ATTR_GROUP, DELETE_ATTR_GROUP,
  ALL_INFOGROUPS, EXPORT_ALL_INFOGROUPS, CREATE_INFOGROUP, EDIT_INFOGROUP, EDIT_ACTIVE_INFOGROUP, DELETE_INFOGROUP,
} from './apiRoutes';

export const productConfigs = {
  "brands": {
    title: "برندها",
    apis: {
      GET_DATA: BRANDS,
      EXPORT_DATA: EXPORT_BRANDS,
      CREATE_DATA: CREATE_BRAND,
      EDIT_DATA: EDIT_BRAND,
      EDIT_ACTIVE_DATA: EDIT_ACTIVE_BRAND,
      DELETE_DATA: DELETE_BRAND,
    },
    permissionsTag: "brands",
    modal: {
      type: "dynamic",
      title: "برند",
      fields: [
        {
          name: "title",
          type: "text",
          label: "نام برند",
          required: true,
          maxLength: 100,
          grid: { xs: 12, md: 6 }
        },
        {
          name: "image",
          type: "image",
          label: "تصویر برند",
          required: false,
          grid: { xs: 12, md: 6 }
        },
        {
          name: "description",
          type: "htmlEditor",
          label: "توضیحات",
          required: false,
          grid: { xs: 12 }
        },
        {
          name: "active",
          type: "switch",
          label: "فعال",
          required: false,
          grid: { xs: 12 }
        }
      ]
    },
    hasModal: true,
    hasExport: true,
    hasCreate: true,
    hasEdit: true,
    hasDelete: true,
    neededFields: ["id", "title"],
    breadcrumb: [
      { title: "مدیریت محصولات" },
      { title: "برندها" }
    ],
  },

  "categories": {
    title: "دسته‌بندی‌ها",
    apis: {
      GET_DATA: CATEGORIES,
      EXPORT_DATA: EXPORT_CATEGORIES,
      CREATE_DATA: CREATE_CATEGORY,
      EDIT_DATA: EDIT_CATEGORY,
      EDIT_ACTIVE_DATA: EDIT_ACTIVE_CATEGORY,
      DELETE_DATA: DELETE_CATEGORY,
    },
    permissionsTag: "categories",
    modal: {
      type: "registry",
      component: "CategoryModal"
    },
    hasModal: true,
    hasExport: true,
    hasCreate: true,
    hasEdit: true,
    hasDelete: true,
    neededFields: ["id", "title"],
    breadcrumb: [
      { title: "مدیریت محصولات" },
      { title: "دسته‌بندی‌ها" }
    ],
  },

  "attributes": {
    title: "ویژگی‌ها",
    apis: {
      GET_DATA: ATTRIBUTES,
      EXPORT_DATA: EXPORT_ATTRIBUTES,
      CREATE_DATA: CREATE_ATTR,
      EDIT_DATA: EDIT_ATTR,
      EDIT_ACTIVE_DATA: EDIT_ACTIVE_ATTR,
      DELETE_DATA: DELETE_ATTR,
    },
    permissionsTag: "Attributes",
    modal: {
      type: "dynamic",
      title: "ویژگی",
      fields: [
        {
          name: "title",
          type: "text",
          label: "نام ویژگی",
          required: true,
          maxLength: 100,
          grid: { xs: 12, md: 6 }
        },
        {
          name: "type",
          type: "select",
          label: "نوع ویژگی",
          required: true,
          options: [
            { value: 1, label: "متن" },
            { value: 2, label: "عدد" },
            { value: 3, label: "انتخابی" }
          ],
          grid: { xs: 12, md: 6 }
        },
        {
          name: "unit",
          type: "text",
          label: "واحد",
          required: false,
          grid: { xs: 12, md: 6 }
        },
        {
          name: "sort_order",
          type: "number",
          label: "ترتیب نمایش",
          required: false,
          min: 0,
          grid: { xs: 12, md: 6 }
        },
        {
          name: "active",
          type: "switch",
          label: "فعال",
          required: false,
          grid: { xs: 12 }
        }
      ]
    },
    hasModal: true,
    hasExport: true,
    hasCreate: true,
    hasEdit: true,
    hasDelete: true,
    neededFields: ["id", "title"],
    breadcrumb: [
      { title: "مدیریت محصولات" },
      { title: "ویژگی‌ها" }
    ],
  },

  "public-attributes": {
    title: "ویژگی‌های عمومی",
    apis: {
      GET_DATA: PUBLIC_ATTRS,
      EXPORT_DATA: EXPORT_PUBLIC_ATTRS,
      CREATE_DATA: CREATE_PUBLIC_ATTR,
      EDIT_DATA: EDIT_PUBLIC_ATTR,
      EDIT_ACTIVE_DATA: EDIT_ACTIVE_PUBLIC_ATTR,
      DELETE_DATA: DELETE_PUBLIC_ATTR,
    },
    permissionsTag: "PublicAttributes",
    modal: {
      type: "dynamic",
      title: "ویژگی عمومی",
      fields: [
        {
          name: "title",
          type: "text",
          label: "نام ویژگی",
          required: true,
          maxLength: 100,
          grid: { xs: 12, md: 8 }
        },
        {
          name: "sort_order",
          type: "number",
          label: "ترتیب نمایش",
          required: false,
          min: 0,
          grid: { xs: 12, md: 4 }
        },
        {
          name: "type",
          type: "select",
          label: "نوع ویژگی",
          required: true,
          options: [
            { value: "text", label: "متن" },
            { value: "number", label: "عدد" },
            { value: "select", label: "انتخابی" }
          ],
          grid: { xs: 12, md: 6 }
        },
        {
          name: "required",
          type: "switch",
          label: "اجباری",
          required: false,
          grid: { xs: 12, md: 6 }
        },
        {
          name: "active",
          type: "switch",
          label: "فعال",
          required: false,
          grid: { xs: 12 }
        }
      ]
    },
    hasModal: true,
    hasExport: true,
    hasCreate: true,
    hasEdit: true,
    hasDelete: true,
    neededFields: ["id", "title"],
    breadcrumb: [
      { title: "مدیریت محصولات" },
      { title: "ویژگی‌های عمومی" }
    ],
  },

  "attribute-groups": {
    title: "گروه‌های ویژگی",
    apis: {
      GET_DATA: ATTR_GROUPS,
      EXPORT_DATA: EXPORT_ATTR_GROUPS,
      CREATE_DATA: CREATE_ATTR_GROUP,
      EDIT_DATA: EDIT_ATTR_GROUP,
      EDIT_ACTIVE_DATA: EDIT_ACTIVE_ATTR_GROUP,
      DELETE_DATA: DELETE_ATTR_GROUP,
    },
    permissionsTag: "AttributeGroups",
    modal: {
      type: "dynamic",
      title: "گروه ویژگی",
      fields: [
        {
          name: "title",
          type: "text",
          label: "نام گروه",
          required: true,
          maxLength: 100,
          grid: { xs: 12, md: 8 }
        },
        {
          name: "sort_order",
          type: "number",
          label: "ترتیب نمایش",
          required: false,
          min: 0,
          grid: { xs: 12, md: 4 }
        },
        {
          name: "description",
          type: "textarea",
          label: "توضیحات",
          required: false,
          rows: 3,
          grid: { xs: 12 }
        },
        {
          name: "active",
          type: "switch",
          label: "فعال",
          required: false,
          grid: { xs: 12 }
        }
      ]
    },
    hasModal: true,
    hasExport: true,
    hasCreate: true,
    hasEdit: true,
    hasDelete: true,
    neededFields: ["id", "title"],
    breadcrumb: [
      { title: "مدیریت محصولات" },
      { title: "گروه‌های ویژگی" }
    ],
  },

  "info-groups": {
    title: "توضیحات وندور",
    apis: {
      GET_DATA: ALL_INFOGROUPS,
      EXPORT_DATA: EXPORT_ALL_INFOGROUPS,
      CREATE_DATA: CREATE_INFOGROUP,
      EDIT_DATA: EDIT_INFOGROUP,
      EDIT_ACTIVE_DATA: EDIT_ACTIVE_INFOGROUP,
      DELETE_DATA: DELETE_INFOGROUP,
    },
    permissionsTag: "categoryAbilities",
    modal: {
      type: "dynamic",
      title: "توضیحات وندور",
      fields: [
        {
          name: "title",
          type: "text",
          label: "نام توضیحات",
          required: true,
          maxLength: 100,
          grid: { xs: 12, md: 8 }
        },
        {
          name: "sort_order",
          type: "number",
          label: "ترتیب نمایش",
          required: false,
          min: 0,
          grid: { xs: 12, md: 4 }
        },
        {
          name: "description",
          type: "textarea",
          label: "توضیحات",
          required: false,
          grid: { xs: 12 }
        },
        {
          name: "active",
          type: "switch",
          label: "فعال",
          required: false,
          grid: { xs: 12 }
        }
      ]
    },
    hasModal: true,
    hasExport: true,
    hasCreate: true,
    hasEdit: true,
    hasDelete: true,
    neededFields: ["id", "title"],
    breadcrumb: [
      { title: "مدیریت محصولات" },
      { title: "توضیحات وندور" }
    ],
  },
}; 