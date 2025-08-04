export const MESSAGES = {
  ERRORS: {
    IMAGE_SIZE: 'حجم تصویر باید کمتر از ۲ مگابایت باشد',
    IMAGE_DIMENSIONS: {
      DESKTOP: 'ابعاد تصویر دسکتاپ باید حداقل ۱۲۰۰x۶۰۰ پیکسل باشد',
      MOBILE: 'ابعاد تصویر موبایل باید حداقل ۶۰۰x۸۰۰ پیکسل باشد',
    },
    IMAGE_FORMAT: 'فرمت تصویر باید یکی از موارد JPG، PNG یا WebP باشد',
    IMAGE_ASPECT_RATIO: {
      DESKTOP: 'نسبت تصویر دسکتاپ باید ۱۶:۹ باشد',
      MOBILE: 'نسبت تصویر موبایل باید ۹:۱۶ باشد',
    },
    REQUIRED_FIELD: 'این فیلد الزامی است',
    INVALID_URL: 'لینک وارد شده معتبر نیست',
    UPLOAD_FAILED: 'آپلود تصویر با خطا مواجه شد',
    SAVE_FAILED: 'ذخیره محتوا با خطا مواجه شد',
    DELETE_FAILED: 'حذف محتوا با خطا مواجه شد',
    INVALID_PRIORITY: 'اولویت باید عددی بین ۱ تا ۱۰۰ باشد'
  },
  SUCCESS: {
    CONTENT_ADDED: 'محتوا با موفقیت اضافه شد',
    CONTENT_DELETED: 'محتوا با موفقیت حذف شد',
    ORDER_UPDATED: 'ترتیب محتواها با موفقیت بروزرسانی شد',
    PRIORITY_UPDATED: 'اولویت محتوا با موفقیت بروزرسانی شد'
  },
  LABELS: {
    CONFIRM_DELETE: 'آیا از حذف این محتوا اطمینان دارید؟',
    CANCEL: 'انصراف',
    DELETE: 'حذف',
    SAVE: 'ذخیره',
    PREVIEW: 'پیش‌نمایش',
    UPLOAD_IMAGE: 'آپلود تصویر',
    PRIORITY: 'اولویت',
    TITLE: 'عنوان',
    DESCRIPTION: 'توضیحات',
    LINK: 'لینک',
    SHOW_TITLE: 'نمایش متن',
    REMAINING_SLOTS: 'محتوای باقی‌مانده'
  }
};

export const IMAGE_CONFIG = {
  DESKTOP: {
    MIN_WIDTH: 1200,
    MIN_HEIGHT: 600,
    MAX_SIZE_MB: 2,
    ASPECT_RATIO: 16 / 9,
    ASPECT_RATIO_TOLERANCE: 0.1,
  },
  MOBILE: {
    MIN_WIDTH: 600,
    MIN_HEIGHT: 800,
    MAX_SIZE_MB: 2,
    ASPECT_RATIO: 9 / 16,
    ASPECT_RATIO_TOLERANCE: 0.1,
  },
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB in bytes
};

export const ANIMATION_CONFIG = {
  DURATION: 300,
  EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
  FADE: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  SLIDE: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  },
  SCALE: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
};
