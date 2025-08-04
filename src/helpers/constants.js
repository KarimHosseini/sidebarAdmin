import {
  Collections,
  Devices,
  Group,
  LocalShipping,
  Payment,
  QueryStats,
  SettingsSuggest,
  Spellcheck,
} from "@mui/icons-material";
import React from "react";

const ascPersianAlphabetSort = (rows, title) => {
  let copy = [...rows];
  copy.sort((a, b) => a[title].localeCompare(b[title]));
  return copy;
};

const descPersianAlphabetSort = (rows, title) => {
  let copy = [...rows];
  copy.sort((a, b) => b[title].localeCompare(a[title]));
  return copy;
};

const ascNumbersSort = (rows, title) => {
  let copy = [...rows];
  copy.sort((a, b) => parseInt(a[title]) - parseInt(b[title]));
  return copy;
};

const descNumbersSort = (rows, title) => {
  let copy = [...rows];
  copy.sort((a, b) => parseInt(b[title]) - parseInt(a[title]));
  return copy;
};
export const menuItems = [
  {
    title: "مدیریت محصولات",
    subroutes: [
      {
        name: "محصولات",
        path: "/products",
      },
      {
        name: "لیست کالاها",
        path: "/products/properties",
      },
      {
        name: "گروه ویژگی ها",
        path: "/products/attribute-groups",
      },
      {
        name: "ویژگی ها",
        path: "/products/attributes",
      },
      {
        name: "ویژگی های عمومی",
        path: "/products/public-attributes",
      },
      {
        name: "برند ها",
        path: "/brands",
      },
      {
        name: "دسته بندی ها",
        path: "/categories",
      },
      {
        name: "توضیحات",
        path: "/info-groups",
      },
    ],
    icon: <Devices fontSize="inherit" />,
  },
  {
    title: "سفارشات",
    subroutes: false,
    path: "/orders",
    icon: <Payment fontSize="inherit" />,
  },
  {
    title: "کیف پول",
    subroutes: false,
    path: "/wallet",
    icon: <Payment fontSize="inherit" />,
  },
  {
    title: "کاربران",
    subroutes: false,
    path: "/users",
    icon: <Group fontSize="inherit" />,
  },
  {
    title: "تنظیمات صفحات",
    subroutes: [
      {
        name: "منو",
        path: "/menu",
      },
      {
        name: "ویترین ها",
        path: "/showcases",
      },
      {
        name: "اسلایدر ها",
        path: "/sliders",
      },
      {
        name: "SEO",
        path: "/seo",
      },
      {
        name: "نوتیفیکیشن",
        path: "/notification",
      },
    ],
    icon: <SettingsSuggest fontSize="inherit" />,
  },
  {
    title: "گزارش گیری",
    subroutes: false,
    path: "/reports",
    icon: <QueryStats fontSize="inherit" />,
  },
  {
    title: "شرکتهای حمل",
    subroutes: false,
    path: "/shipping-companies",
    icon: <LocalShipping fontSize="inherit" />,
  },
  {
    title: "واژه ها",
    subroutes: false,
    path: "/synonyms",
    icon: <Spellcheck fontSize="inherit" />,
  },
  {
    title: "گالری تصاویر",
    subroutes: false,
    path: "/gallery",
    icon: <Collections fontSize="inherit" />,
  },
  {
    title: " تنظیمات",
    path: "/gallery",
    subroutes: [
      {
        name: " تنظیمات",
        path: "/companyInfo",
      },
      {
        name: "  کد تخفیف محصول",
        path: "/discounts",
      },
      {
        name: "  پیام ",
        path: "/sms",
      },
      {
        name: "  ارسال کالا ",
        path: "/shippingSetting",
      },
    ],
    icon: <Collections fontSize="inherit" />,
  },
  {
    title: " نظرات",
    subroutes: false,
    path: "/comments",
    icon: <Collections fontSize="inherit" />,
  },
];

// head cells
export const productsHeadCells = [
  {
    label: "آیدی",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  {
    label: "تصویر",
    key: "image",
    sorting: false,
  },
  {
    label: "نام محصول",
    key: "title",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
  { label: "کد ویژگی", key: "code", sorting: false },
  { label: "برند", key: "brandId", sorting: false },
  { label: "دسته بندی", key: "categoryId", sorting: false },
  /*   { label: "فعال", key: "active", sorting: false },
   */
];

export const usersHeadCells = [
  {
    label: "آیدی",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  {
    label: "نام",
    key: "fname",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
  {
    label: "نام خانوادگی",
    key: "lname",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
  {
    label: "شماره موبایل",
    key: "mobile",
    sorting: false,
  },
  {
    label: "شهر",
    key: "city",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
  { label: "آخرین ورود", key: "lastLogin", sorting: false },
  {
    label: "سطح دسترسی",
    key: "role",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  {
    label: "نقش",
    key: "access",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },

  {
    label: "جنسیت",
    key: "gender",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
  {
    label: " وضعیت کاربر",
    key: "status",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
];

export const suppliersHeadCells = [
  {
    label: "آیدی",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  {
    label: "نام کاربری ",
    key: "fname",
    sorting: false,
  },
  {
    label: "اسم شرکت ",
    key: "fname",
    sorting: false,
  },
  {
    label: "نام  ",
    key: "fname",
    sorting: false,
  },
  {
    label: "نام خانواگی ",
    key: "fname",
    sorting: false,
  },
  {
    label: "تلفن همراه ",
    key: "city",
    sorting: false,
  },
  {
    label: " تلفن ثابت",
    key: "mobile",
    sorting: false,
  },
  {
    label: " نشانی ",
    key: "lname",
    sorting: false,
  },

  { label: " مقدار درصد", key: "lastLogin", sorting: false },
];
export const leasingTableCells = [
  {
    label: "آیدی",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  {
    label: " عکس ",
    key: "fname",
    sorting: false,
  },

  {
    label: "نام  ",
    key: "fname",
    sorting: false,
  },
  {
    label: " تامین کننده ",
    key: "fname",
    sorting: false,
  },
  {
    label: " قیمت ",
    key: "fname",
    sorting: false,
  },
  {
    label: "فعال/غیرفعال",
    key: "active",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
];
export const workTableCells = [
  {
    label: "آیدی",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },

  {
    label: "نام  ",
    key: "fname",
    sorting: false,
  },
];
export const showCasesHeadCells = [
  {
    label: "آیدی",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  {
    label: "عنوان",
    key: "title",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
  {
    label: "اولویت",
    key: "priority",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  {
    label: "محدودیت تعداد",
    key: "limit",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
];

export const slidersHeadCells = [
  {
    label: "آیدی",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  {
    label: "عکس",
    key: "image",
    sorting: false,
  },
  {
    label: "اولویت",
    key: "priority",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  {
    label: "نمایش در موبایل",
    key: "mobileView",
    sorting: false,
  },
];

export const shippingCompaniesHeadCells = [
  {
    label: "آیدی",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  {
    label: "آیکون",
    key: "icon",
    sorting: false,
  },
  {
    label: "عنوان",
    key: "title",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
  {
    label: "اضافات / کسورات حمل و نقل",
    key: "shipmentExtraCost",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },

  {
    label: "بسته بندی",
    key: "packagingCost",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
  {
    label: "فعال/غیرفعال",
    key: "title",
    sorting: false,
  },
  {
    label: "COD",
    key: "title",
    sorting: false,
  },
];

export const attrsHeadCells = [
  {
    label: "آیدی",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  {
    label: " آیکون",
    key: "type",
    sorting: false,
  },
  {
    label: "نام ویژگی",
    key: "title",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
  { label: "به انگلیسی", key: "name", sorting: false },
  {
    label: "گروه ویژگی",
    key: "group",
    sorting: false,
  },
];

export const pricesHeadCells = [
  {
    label: "کد",
    key: "code",
    sorting: false,
  },
  {
    label: "محصول",
    key: "code",
    sorting: false,
  },
  {
    label: "ویژگی یک",
    key: "code",
    sorting: false,
  },
  {
    label: "ویژگی دو",
    key: "code",
    sorting: false,
  },
  {
    label: "قیمت",
    key: "code",
    sorting: false,
  },
];

export const publicAttrsHeadCells = [
  {
    label: "آیدی",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  { label: "آواتار", key: "avatar", sorting: false },
  {
    label: "نام ویژگی",
    key: "title",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
  {
    label: "به انگلیسی",
    key: "name",
    sorting: false,
  },
];

export const infogroupsHeadCells = [
  {
    label: "آیدی",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  { label: "آواتار", key: "avatar", sorting: false },
  {
    label: "دسته بندی",
    key: "categoryId",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  {
    label: "متن توضیح",
    key: "title",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
];

export const SynonymsHeadCells = [
  {
    label: "آیدی",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  {
    label: "اصلی",
    key: "original",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
  {
    label: "مشابه/معادل",
    key: "synonim",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
];

export const attrGroupsHeadCells = [
  {
    label: "آیدی",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  { label: "آواتار", key: "avatar", sorting: false },
  {
    label: "نام ویژگی",
    key: "title",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
];

export const attributeValuesHeadCells = [
  {
    label: "آیدی",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  {
    label: "نام مقدار",
    key: "title",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
  {
    label: "نمایش در فیلترینگ",
    key: "showInShop",
    sorting: false,
  },
  {
    label: "مقدار",
    key: "value",
    sorting: false,
  },
  {
    label: "اسلاگ",
    key: "slug",
    sorting: false,
  },
];
export const attributeValuesHeadCells2 = [
  {
    label: "آیدی",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  {
    label: "عکس",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  {
    label: "نام مقدار",
    key: "title",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
  {
    label: "نمایش در فیلترینگ",
    key: "showInShop",
    sorting: false,
  },
  {
    label: "مقدار",
    key: "value",
    sorting: false,
  },
  {
    label: "اسلاگ",
    key: "slug",
    sorting: false,
  },
];
export const brandsHeadCells = [
  {
    label: "آیدی",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  { label: "آواتار", key: "avatar", sorting: false },
  {
    label: "نام برند",
    key: "title",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
  {
    label: "فعال/غیرفعال",
    key: "active",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
];

export const categoriesHeadCells = [
  {
    label: "آیدی",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  { label: "آواتار", key: "avatar", sorting: false },
  {
    label: "نام دسته بندی",
    key: "title",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
  { label: "والد", key: "parent", sorting: false },
  {
    label: "تعداد محصولات مرتبط",
    key: "link",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  {
    label: "فعال/غیرفعال",
    key: "active",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
];
export const discountHeadCells = [
  {
    label: "شرح تخفیف",
    key: "id",
    sorting: false,
  },
  {
    label: "کد تخفیف محصول",
    key: "Type",
    sorting: false,
  },
  {
    label: "ارزش تخفیف",
    key: "Type",
    sorting: false,
  },
  {
    label: "نام محصول",
    key: "Code",
    sorting: false,
  },

  {
    label: "   نام ویژگی محصول ",
    key: "TargetId",
    sorting: false,
  },
  { label: "  کاربر", key: "fromDate", sorting: false },
  { label: "شروع تخفیف", key: "fromDate", sorting: false },
  { label: "انتها تخفیف", key: "toDate", sorting: false },
  { label: " تعداد مصرف", key: "toDate", sorting: false },
  { label: " وضعیت", key: "toDate", sorting: false },
];
export const smsHeadCells = [
  { label: "  ایدی", key: "fromDate", sorting: false },
  { label: " نام کاربری", key: "fromDate", sorting: false },
  { label: " موبایل", key: "fromDate", sorting: false },
  { label: " نوع", key: "toDate", sorting: false },
];
export const smsContentHeadCells = [
  { label: "  ایدی", key: "2", sorting: false },
  { label: " عنوان", key: "3", sorting: false },
  { label: " گیرنده", key: "4", sorting: false },
  { label: " متن", key: "5", sorting: false },
  { label: " هدف", key: "6", sorting: false },
];
export const permisionsHeadCells = [
  {
    label: "  ایدی",
    key: "id",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  {
    label: " عنوان",
    key: "title",
    sorting: {
      asc: ascPersianAlphabetSort,
      desc: descPersianAlphabetSort,
    },
  },
  { label: " دسترسی ها", key: "toDate", sorting: false },
];
export const menusHeadCells = [
  {
    label: "  ایدی",
    key: "fromDate",
    sorting: {
      asc: ascNumbersSort,
      desc: descNumbersSort,
    },
  },
  { label: " عنوان", key: "fromDate", sorting: false },
  { label: " نمایش در موبایل", key: "toDate", sorting: false },
  { label: "موقعیت", key: "toDate", sorting: false },
];
export const menuItemsHeadCells = [
  { label: "  ایدی", key: "fromDate", sorting: false },
  { label: "  عکس", key: "fromDate", sorting: false },
  { label: " عنوان", key: "fromDate", sorting: false },
  { label: "لینک", key: "toDate", sorting: false },
];
export const ordersHeadCells = [
  {
    label: "سفارش دهنده",
    key: "userName",
    sorting: false,
  },
  {
    label: "تعداد محصولات",
    key: "qty",
    sorting: false,
  },
  {
    label: "مبلغ",
    key: "total",
    sorting: false,
  },
];
export const walletHeadCells = [
  {
    label: "آیدی",
    key: "id",
    sorting: false,
  },
  {
    label: "شماره همراه",
    key: "userName",
    sorting: false,
  },
  {
    label: "نام",
    key: "total",
    sorting: false,
  },
  {
    label: "نام خانوادگی",
    key: "qty",
    sorting: false,
  },
  /*   {
    label: "مبلغ ارسال",
    key: "transportFee",
    sorting: false,
  }, */

  {
    label: "تاریخ",
    key: "state",
    sorting: false,
  },
  {
    label: "عملیات",
    key: "dateTime",
    sorting: false,
  },
  {
    label: "وضعیت",
    key: "dateTime",
    sorting: false,
  },

  {
    label: "شارژ اعتبار",
    key: "updatedAt",
    sorting: false,
  },
  {
    label: " کسر اعتبار ",
    key: "updatedAt",
    sorting: false,
  },
  {
    label: " اعتبار فعلی ",
    key: "updatedAt",
    sorting: false,
  },
  {
    label: "درگاه  ",
    key: "updatedAt",
    sorting: false,
  },
  {
    label: " شماره کارت ",
    key: "updatedAt",
    sorting: false,
  },
  {
    label: " کد تراکنش ",
    key: "updatedAt",
    sorting: false,
  },

  {
    label: "شماره سفارش",
    key: "updatedAt",
    sorting: false,
  },
  {
    label: "شماره تسهیلات",
    key: "updatedAt",
    sorting: false,
  },
];
export const productCardexHeadCells = [
  {
    label: "ردیف",
    key: "id",
    sorting: false,
  },
  {
    label: "  نام کاربر ",
    key: "updatedAt",
    sorting: false,
  },

  {
    label: "کد ویژگی",
    key: "userName",
    sorting: false,
  },
  {
    label: "نام محصول",
    key: "total",
    sorting: false,
  },
  {
    label: "تاریخ",
    key: "state",
    sorting: false,
  },

  {
    label: "عملیات ",
    key: "dateTime",
    sorting: false,
  },
  {
    label: "قیمت  ",
    key: "updatedAt",
    sorting: false,
  },
  {
    label: "تعداد",
    key: "dateTime",
    sorting: false,
  },

  {
    label: " موجودی قبلی",
    key: "updatedAt",
    sorting: false,
  },
  {
    label: "موجودی فعلی ",
    key: "updatedAt",
    sorting: false,
  },
  {
    label: "شماره سفارش",
    key: "state",
    sorting: false,
  },
  {
    label: " تاریخ اصلاح",
    key: "state",
    sorting: false,
  },
  {
    label: " مرجع تغییر",
    key: "state",
    sorting: false,
  },
];
export const productsPropertiesTypes = [
  /*   {
    value: 4,
    title: "تصویر",
  },
  {
    value: 3,
    title: "مقدار",
  }, */
  {
    value: 2,
    title: "متنی",
  },
  {
    value: 1,
    title: "رنگی ، مقدار ،‌تصویر",
  },
];

export const getWay = [
  {
    value: "0",
    title: "بانک شهر",
    style: "{fontWeight:500}",
    styleDark: "{fontWeight:500}",
  },
  {
    value: "1",
    title: "درگاه تسهیلاتی آینده",
    style: "{fontWeight:500}",
    styleDark: "{fontWeight:500}",
  },
  {
    value: "2",
    title: "کیف پول سایت",
    style: "{fontWeight:500}",
    styleDark: "{fontWeight:500}",
  },
  {
    value: "3",
    title: "بانک شهر + کیف پول سایت",
    style: "{fontWeight:500}",
    styleDark: "{fontWeight:500}",
  },
  {
    value: "4",
    title: "بانک آینده + کیف پول سایت",
    style: "{fontWeight:500}",
    styleDark: "{fontWeight:500}",
  },
  {
    value: "5",
    title: "بانک ملت",
    style: "{fontWeight:500}",
    styleDark: "{fontWeight:500}",
  },
  {
    value: "6",
    title: "بانک ملت + کیف پول سایت",
    style: "{fontWeight:500}",
    styleDark: "{fontWeight:500}",
  },
  {
    value: "8",
    title: "درگاه تسهیلاتی دیجی پی",
    style: "{fontWeight:500}",
    styleDark: "{fontWeight:500}",
  },
  {
    value: "7",
    title: "درگاه تسهیلاتی بالون بلو",
    style: "{fontWeight:500}",
    styleDark: "{fontWeight:500}",
  },
  {
    value: "9",
    title: "درگاه تسهیلاتی بالون بلو + کیف پول سایت",
    style: "{fontWeight:500}",
    styleDark: "{fontWeight:500}",
  },
  {
    value: "10",
    title: "درگاه تسهیلاتی دیجی پی + کیف پول سایت",
    style: "{fontWeight:500}",
    styleDark: "{fontWeight:500}",
  },
  {
    value: "11",
    title: "درگاه تسهیلاتی انتخابی نو",
    style: null,
    styleDark: null,
  },
  {
    value: "12",
    title: "درگاه تسهیلاتی انتخابی نو + کیف پول سایت",
    style: null,
    styleDark: null,
  },
  {
    value: "13",
    title: "درگاه تسهیلاتی بالون بتا سازمانی",
    style: null,
    styleDark: null,
  },
  {
    value: "14",
    title: "درگاه تسهیلاتی بالون بتا سازمانی + کیف پول سایت",
    style: null,
    styleDark: null,
  },
  {
    value: "100",
    title: "بانک پارسیان (پوز)",
    style: null,
    styleDark: null,
  },
  {
    value: "15",
    title: "درگاه تسهیلاتی بتا  - رفاه",
    style: null,
    styleDark: null,
  },
  {
    value: "16",
    title: "درگاه تسهیلاتی رفاه + کیف پول سایت",
    style: null,
    styleDark: null,
  },
  {
    value: "17",
    title: "درگاه داخلی",
    style: null,
    styleDark: null,
  },
  {
    value: "18",
    title: "کیف پول تسهیلاتی",
    style: null,
    styleDark: null,
  },
  {
    value: "19",
    title: "کیف پول + کیف پول تسهیلاتی",
    style: null,
    styleDark: null,
  },
  {
    value: "20",
    title: "حسابداری",
    style: null,
    styleDark: null,
  },
  {
    value: "21",
    title: "جت وام",
    style: null,
    styleDark: null,
  },
  {
    value: "22",
    title: "درگاه تسهیلاتی جت وام + کیف پول سایت",
    style: "{fontWeight:500}",
    styleDark: "{fontWeight:500}",
  },
  {
    value: "24",
    title: "درگاه تسهیلاتی نسیبا + کیف پول سایت",
    style: "{fontWeight:500}",
    styleDark: "{fontWeight:500}",
  },
  {
    value: "23",
    title: "درگاه تسهیلاتی نسیبا",
    style: null,
    styleDark: null,
  },
  {
    value: "25",
    title: "درگاه تسهیلاتی کالا کارت مهر",
    style: null,
    styleDark: null,
  },
  {
    value: "26",
    title: "درگاه تسهیلاتی کالا کارت مهر + کیف پول سایت",
    style: null,
    styleDark: null,
  },
  {
    value: "27",
    title: "درگاه کالاپی - ملی",
    style: null,
    styleDark: null,
  },
  {
    value: "28",
    title: "درگاه کالاپی - ملی + کیف پول سایت",
    style: null,
    styleDark: null,
  },
  {
    value: "29",
    title: "درگاه ازکی وام",
    style: null,
    styleDark: null,
  },
  {
    value: "30",
    title: "درگاه ازکی وام + کیف پول سایت",
    style: null,
    styleDark: null,
  },
  {
    value: "31",
    title: "درگاه کیپا",
    style: null,
    styleDark: null,
  },
  {
    value: "32",
    title: "درگاه کیپا + کیف پول سایت",
    style: null,
    styleDark: null,
  },
  {
    value: "33",
    title: "درگاه زرین پال",
    style: null,
    styleDark: null,
  },
  {
    value: "34",
    title: "درگاه زرین پال + کیف پول سایت",
    style: null,
    styleDark: null,
  },
  {
    value: "35",
    title: "درگاه تسهیلاتی وایب",
    style: null,
    styleDark: null,
  },
  {
    value: "36",
    title: "درگاه تسهیلاتی وایب + کیف پول سایت",
    style: null,
    styleDark: null,
  },
  {
    value: "37",
    title: "درگاه فدکس",
    style: null,
    styleDark: null,
  },
  {
    value: "38",
    title: "درگاه فدکس + کیف پول سایت",
    style: null,
    styleDark: null,
  },
  {
    value: "39",
    title: "درگاه ملی",
    style: null,
    styleDark: null,
  },
  {
    value: "40",
    title: "درگاه ملی + کیف پول سایت",
    style: null,
    styleDark: null,
  },
  {
    value: "41",
    title: "درگاه ستاره اول",
    style: "{fontWeight:500}",
    styleDark: "{fontWeight:500}",
  },
  {
    value: "42",
    title: "درگاه ستاره اول + کیف پول",
    style: "{fontWeight:500}",
    styleDark: "{fontWeight:500}",
  },
  {
    value: "43",
    title: "درگاه تپسی",
    style: "{fontWeight:500}",
    styleDark: "{fontWeight:500}",
  },
];
export const orderStates = [
  {
    id: 0,
    title: "پرداخت نشده",
  },
  {
    id: 1,
    title: "در حال بررسی",
  },
  {
    id: 2,
    title: "در حال ارسال",
  },
  {
    id: 3,
    title: "خروج از انبار",
  },

  {
    id: 5,
    title: "لغو سفارش",
  },
  {
    id: 6,
    title: "ناموفق",
  },
  {
    id: 4,
    title: "تحویل شد",
  },
  { id: 8, title: "در حال آماده سازی" },
  { id: 7, title: "در انتظار پرداخت" },
  {
    id: 10,
    title: "در انتظار واریز وام ",
  },
  {
    id: 11,
    title: "در انتظار تایید",
  },
  {
    id: 12,
    title: "تایید شده",
  },
  {
    id: 13,
    title: "آماده تحویل - حضوری",
  },
];

export const orderStates2 = [
  {
    key: 5,
    title: "لغو سفارش",
  },

  {
    key: 4,
    title: "تحویل شد",
  },
];

export const legalData = ["حقیقی", "حقوقی"];

export const genderData = ["مرد", "زن"];

export const roleData = [
  { value: 0, title: "کاربر" },
  { value: 1, title: "ادمین" },
  { value: 3, title: "فروشنده" },
  { value: 2, title: "مدیر سایت" },
  { value: 4, title: "بلاگر" },
  { value: 6, title: "بازاریاب" },
  { value: 7, title: "مسئول فروش" },
];

export const PackType = [
  {
    id: null,
    title: "هیچ کدام",
  },
  {
    id: 10,
    title: "پاکت",
  },
  {
    id: 20,
    title: "بسته",
  },
];
export const PaymentType = [
  {
    id: null,
    title: "هیچ کدام",
  },
  {
    id: 10,
    title: "سمت فرستنده - اعتباری",
  },
  {
    id: 40,
    title: "سمت فرستنده - پرداخت در محل",
  },
  {
    id: 50,
    title: "سمت فرستنده - پرداخت از کیف پول",
  },

  {
    id: 80,
    title: "سمت فرستنده - نقدی",
  },

  {
    id: 20,
    title: "سمت گیرنده - پس کرایه",
  },
  {
    id: 30,
    title: "سمت گیرنده - پرداخت در محل",
  },
];
export const PickupType = [
  {
    id: null,
    title: "هیچ کدام",
  },
  {
    id: 10,
    title: " جمع آوری در محل مشتری",
  },
  {
    id: 20,
    title: "جمع آوری در نمایندگی",
  },
];
export const DistributionType = [
  {
    id: null,
    title: "هیچ کدام",
  },
  {
    id: 10,
    title: " تحویل در محل مشتری",
  },
  {
    id: 20,
    title: "تحویل در نمایندگی",
  },
];
export const SMSTYPES = [
  {
    id: 0,
    title: "",
  },
];
export const ServiceId = [
  {
    id: null,
    title: "هیچ کدام",
  },
  {
    id: 1,
    title: "ارسال زمینی همان روز ",
  },
  {
    id: 2,
    title: "ارسال زمینی یک روزه",
  },
  {
    id: 3,
    title: "ارسال زمینی دو روزه",
  },
  {
    id: 5,
    title: "اکسپرس ویژه بین شهری",
  },
  {
    id: 6,
    title: "بین الملل",
  },
  {
    id: 7,
    title: "اکسپرس درون شهری",
  },
  {
    id: 8,
    title: "تی بار",
  },
];
