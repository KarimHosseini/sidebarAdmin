export const baseUrl = process.env.REACT_APP_API_URL;
// download file
export const DOWNLOAD_FILE = process.env.REACT_APP_GALLERY_URL;
export const getStaticsData = "public/getStaticsData";
export const GET_GATEWAYS_ENUM = "admin/v2/EnumCodeValue/GetGateways";

// gallery
export const ALL_IMAGES = "admin/v2/Gallery/GetAll";
export const EXPORT_ALL_IMAGES = "admin/v2/Gallery/Export";

export const GALLERY = "admin/v2/Gallery/Get";
export const ADD_GALLERY_IMAGE = "admin/v2/Gallery/Insert";
export const EDIT_GALLERY = "admin/v2/Gallery/Edit";
export const EDIT_ACTIVE_GALLERY = "admin/v2/Gallery/EditActive";

export const DELETE_GALLERY = "admin/v2/Gallery/Delete";
export const galleyUsage = "admin/v2/Gallery/GalleryUsage";
export const ADD_PRODUCT_IMAGE = "admin/v2/ProductGallery/Insert";
export const RESET_GALLERY = "admin/v2/Gallery/Cleanup";
export const ADD_IMAGE = "";

// provinces - cities
export const ALL_PROVINCES = "public/provinces";

// wallet

export const PRODUCT_CARDEX = "admin/v2/Depot/GetAll";
export const EXPORT_PRODUCT_CARDEX = "admin/v2/Depot/Export";

export const All_WALLET = "admin/v2/Wallet/GetAll";
export const EXPORT_All_WALLET = "admin/v2/Wallet/Export";
export const All_WALLET_SUMN = "admin/v2/Wallet/GetSum";

/* wallet charging */
export const WALLET_PAYMENT = "admin/v2/WalletPayment/GetAll";
export const EXPORT_WALLET_PAYMENT = "admin/v2/WalletPayment/Export";
export const ADD_WALLET_PAYMENT = "admin/v2/WalletPayment/Insert";
export const DELETE_WALLET_PAYMENT = "admin/v2/WalletPayment/Delete";
export const EDIT_WALLET_PAYMENT = "admin/v2/WalletPayment/Edit";
export const EDIT_ACTIVE_WALLET_PAYMENT = "admin/v2/WalletPayment/EditActive";
export const EDIT_STATE_WALLET_PAYMENT = "admin/v2/WalletPayment/EditState";
export const EDIT_STATE_WALLET_PAYMENT_CODE =
  "admin/v2/WalletPayment/EditStateCode";

export const All_FACILITY_WALLET = "admin/v2/FacilityWallet/GetAll";
export const All_FACILITY_WALLET_DETAILS =
  "admin/v2/FacilityWallet/GetAllByFacilityId";

export const EXPORT_All_FACILITY_WALLET = "admin/v2/FacilityWallet/Export";
export const ExportWalletByFacilityId =
  "admin/v2/FacilityWallet/ExportWalletByFacilityId";

export const All_FACILITY_WALLET_SUMN = "admin/v2/FacilityWallet/GetSum";
export const FACILITY_WALLET_PAYMENT = "admin/v2/FacilityWalletPayment/GetAll";
export const EXPORT_FACILITY_WALLET_PAYMENT =
  "admin/v2/FacilityWalletPayment/Export";
export const ADD_FACILITY_WALLET_PAYMENT =
  "admin/v2/FacilityWalletPayment/Insert";
export const DELETE_FACILITY_WALLET_PAYMENT =
  "admin/v2/FacilityWalletPayment/Delete";
export const EDIT_FACILITY_WALLET_PAYMENT =
  "admin/v2/FacilityWalletPayment/Edit";
export const EDIT_ACTIVE_FACILITY_WALLET_PAYMENT =
  "admin/v2/FacilityWalletPayment/EditActive";
export const EDIT_STATE_FACILITY_WALLET_PAYMENT =
  "admin/v2/FacilityWalletPayment/EditState";
export const EDIT_STATE_FACILITY_WALLET_PAYMENT_CODE =
  "admin/v2/FacilityWalletPayment/EditStateCode";
// auth
export const LOGIN = "v1/adminLogin";
export const SEND_CODE = "v1/sendCode";
export const LOGOUT = "v1/logout";
export const sendCodeAdmin = "v1/sendCodeAdmin";

// products
export const ALL_PRODUCTS = "admin/v2/Product/GetAll";
export const EXPORT_ALL_PRODUCTS = "admin/v2/Product/Export";
export const EDIT_PRODUCTS = "admin/v2/Product/Edit";
export const EDIT_ACTIVE_PRODUCTS = "admin/v2/Product/EditActive";
export const REMOVE_PRODUCTS = "admin/v2/Product/Delete";
export const ADD_PRODUCTS = "admin/v2/Product/Insert";
export const SINGLE_PRODUCT = "admin/v2/Product/Get";
// product properties
export const ALL_PRICES = "admin/v2/ProductProperty/GetAll";
export const EXPORT_AALL_PRICES = "admin/v2/ProductProperty/Export";
export const PRODUCT_PRICE = "admin/v2/ProductProperty/Get";
export const EDIT_PRODUCT_PROPERTIES = "admin/v2/ProductProperty/Edit";
export const EDIT_ACTIVE_PRODUCT_PROPERTIES =
  "admin/v2/ProductProperty/EditActive";
export const EDIT_MULTIPLE_PRODUCT_PROPERTIES =
  "admin/v2/ProductProperty/MultiEdit";
export const RESCALEALL_PRICE = "admin/v2/ProductProperty/EditBulkPrices";
export const ADD_PRDUCT_PROPERTIES = "admin/v2/ProductProperty/Insert";
export const REMOVE_PRODUCT_PROPERTIES = "admin/v2/ProductProperty/Delete";
export const importPrices = "admin/v2/ProductProperty/ImportPrice";

// single product
export const EDIT_MULTIPLE_PTODUCT_PUBLIC =
  "admin/v2/ProductPublicProperty/MultiEdit";
export const EDIT_PTODUCT_PUBLIC = "admin/v2/ProductPublicProperty/Edit";
export const EDIT_ACTIVE_PTODUCT_PUBLIC =
  "admin/v2/ProductPublicProperty/EditActive";

export const POST_PTODUCT_PUBLIC = "admin/v2/ProductPublicProperty/Insert";
export const GET_PTODUCT_PUBLIC = "admin/v2/ProductPublicProperty/GetAll";
export const EXPORT_PTODUCT_PUBLIC = "admin/v2/ProductPublicProperty/Export";
export const PRODUCT_ATTR_MULTIEDIT = "admin/v2/ProductAttribute/MultiEdit";
export const EDIT_PRODUCT_ATTR = "admin/v2/ProductAttribute/Edit";
export const EDITT_ACTIVE_PRODUCT_ATTR = "admin/v2/ProductAttribute/EditActive";

export const GET_PRODUCT_ATTR = "admin/v2/ProductAttribute/Get";
export const DELETE_PRODUCT_IMAGE = "admin/v2/ProductGallery/DeleteByProduct";
export const DELETE_PRODUCT = "admin/v2/Product/Delete";

// ctreate product
export const CREATE_PRODUCT = "admin/v2/Product/Insert";
export const EDIT_CROSS_SELL = "admin/v2/ProductCrossCell/MultiEdit";
export const GET_CROSS_SELL = "admin/v2/ProductCrossCell/GetAll";
export const EXPORT_CROSS_SELL = "admin/v2/ProductCrossCell/Export";
export const EDIT_BULK_SELL = "admin/v2/ProductCrossForcedSell/BulkInsert";
export const GET_BULK_SELL = "admin/v2/ProductCrossForcedSell/GetAll";

// attribute groups
export const ATTR_GROUPS = "admin/v2/AttributeGroup/GetAll";
export const EXPORT_ATTR_GROUPS = "admin/v2/AttributeGroup/Export";
export const CREATE_ATTR_GROUP = "admin/v2/AttributeGroup/Insert";
export const DELETE_ATTR_GROUP = "admin/v2/AttributeGroup/Delete";
export const EDIT_ATTR_GROUP = "admin/v2/AttributeGroup/Edit";
export const EDIT_ACTIVE_ATTR_GROUP = "admin/v2/AttributeGroup/EditActive";

// attributes
export const ATTRIBUTES = "admin/v2/Attribute/GetAll";
export const EXPORT_ATTRIBUTES = "admin/v2/Attribute/Export";
export const ONE_ATTRIBUTE = "admin/v2/Attribute/Get";
export const CREATE_ATTR = "admin/v2/Attribute/Insert";
export const DELETE_ATTR = "admin/v2/Attribute/Delete";
export const EDIT_ATTR = "admin/v2/Attribute/Edit";
export const EDIT_ACTIVE_ATTR = "admin/v2/Attribute/EditActive";

export const ADD_ATTR_VALUE = "admin/v2/SubAttribute/Insert";
export const EDIT_ATTR_VALUE = "admin/v2/SubAttribute/Edit";
export const EDITT_ACTIVE_ATTR_VALUE = "admin/v2/SubAttribute/EditActive";

export const REMOVE_ATTR_VALUE = "admin/v2/SubAttribute/Delete";

// public attributes
export const PUBLIC_ATTRS = "admin/v2/PublicAttribute/GetAll";
export const EXPORT_PUBLIC_ATTRS = "admin/v2/PublicAttribute/Export";
export const CREATE_PUBLIC_ATTR = "admin/v2/PublicAttribute/Insert";
export const EDIT_PUBLIC_ATTR = "admin/v2/PublicAttribute/Edit";
export const EDIT_ACTIVE_PUBLIC_ATTR = "admin/v2/PublicAttribute/EditActive";

export const DELETE_PUBLIC_ATTR = "admin/v2/PublicAttribute/Delete";

// brands
export const BRANDS = "admin/v2/Brand/GetAll";
export const EXPORT_BRANDS = "admin/v2/Brand/Export";
export const CREATE_BRAND = "admin/v2/Brand/Insert";
export const EDIT_BRAND = "admin/v2/Brand/Edit";
export const EDIT_ACTIVE_BRAND = "admin/v2/Brand/EditActive";
export const DELETE_BRAND = "admin/v2/Brand/Delete";

// brands
export const GET_ALL_BRANCHES = "admin/v2/Branch/GetAll";
export const EXPORT_BRANCHES = "admin/v2/Branch/Export";
export const CREATE_BRANCHES = "admin/v2/Branch/Insert";
export const EDIT_BRANCHES = "admin/v2/Branch/Edit";
export const EDIT_ACTIVE_BRANCHES = "admin/v2/Branch/EditActive";
export const DELETE_BRANCHES = "admin/v2/Branch/Delete";

// categories
export const CATEGORIES = "admin/v2/Category/GetAll";
export const CATEGORIES_GET_BY_ONE = "admin/v2/Category/Get";

export const EXPORT_CATEGORIES = "admin/v2/Category/Export";
export const CREATE_CATEGORY = "admin/v2/Category/Insert";
export const EDIT_CATEGORY = "admin/v2/Category/Edit";
export const EDIT_ACTIVE_CATEGORY = "admin/v2/Category/EditActive";

export const DELETE_CATEGORY = "admin/v2/Category/Delete";

// disdount
export const DISCOUNTES = "admin/v2/DiscountCode/GetAll";
export const EXPORT_DISCOUNTES = "admin/v2/DiscountCode/Export";
export const CREATE_DISCOUNT = "admin/v2/DiscountCode/Insert";
export const DELETE_DISCOUNT = "admin/v2/DiscountCode/Delete";
export const EDIT_DISCOUNT = "admin/v2/DiscountCode/Edit";
export const EDIT_ACTIVE_DISCOUNT = "admin/v2/DiscountCode/EditActive";

export const GET_DISCOUNTES_PLAN = "admin/v2/Discount/GetAll";
export const EXPORT_DISCOUNTES_PLAN = "admin/v2/Discount/Export";
export const EDIT_ACTIVE_DISCOUNT_PLAN = "admin/v2/Discount/EditActive";

export const GET_SMS_CENTER = "admin/v2/SMSCenter/GetAll";
export const GET_SMS_CENTER_TYPES =
  "admin/v2/SMSCenter/GetTypes?page=1&limit=1000";

export const EXPORT_GET_SMS_CENTER = "admin/v2/SMSCenter/Export";
export const CREATE_SMS_CENTER = "admin/v2/SMSCenter/Insert";
export const DELETE_SMS_CENTER = "admin/v2/SMSCenter/Delete";
export const EDIT_SMS_CENTER = "admin/v2/SMSCenter/Edit";
export const EDIT_ACTIVE_SMS_CENTER = "admin/v2/SMSCenter/EditActive";

/* settings */
export const GET_SETTINGS = "admin/v2/Setting/Get?id=1";
export const GET_GATEWAY_TYPES = "admin/v2/Setting/GetGatewayTypes";
export const GET_SETTING_MAINTEIN =
  "admin/v2/Setting/ChangeMaintenanceModeState";
export const GET_SETTINGS_GAETWAYT = "admin/v2/GatewaySetting/GetAll";
export const UPDATE_SETTINGS_GAETWAYT = "admin/v2/GatewaySetting/Patch";
export const UPDATE_SETTINGS_GAETWAYT_IMAGE =
  "admin/v2/GatewaySetting/AddOrUpdateGatewayImage";

export const DELETE_SETTINGS_GAETWAYT = "admin/v2/GatewaySetting/Delete";
export const GET_SETTING_WALLET = "admin/v2/Setting/ChangeWalletSetting";
export const GET_SETTING_WALLET_IMAGE = "admin/v2/Setting/EditWalletImage";
export const GET_SETTING_WALLET_COVER_IMAGE =
  "admin/v2/Setting/EditWalletCoverImage";
export const GET_SETTING_PRODUCT_COVER_IMAGE =
  "admin/v2/Setting/EditProductBannerImage";

export const EDIT_SETTINGS = "admin/v2/Setting/Edit";
export const EDIT_ACTIVE_SETTINGS = "admin/v2/Setting/EditActive";
export const EDIT_LIGHT_LOGO = "admin/v2/Setting/EditCompanyLogo";
export const EDIT_DARK_LOGO = "admin/v2/Setting/EditCompanyDarkLogo";
export const EDIT_COMPANY_SEAL = "admin/v2/Setting/EditCompanySeal";
export const EDIT_PROMOTION_LOGO = "admin/v2/Setting/EditPromotionLogo";
export const EDIT_COMPANY_LOGO = "admin/v2/Setting/EditCopyrightLogo";

/* menu  */
export const GET_MENU = "admin/v2/Menu/GetAll";
export const EXPORT_GET_MENU = "admin/v2/Menu/Export";
export const CREATE_MENU = "admin/v2/Menu/Insert";
export const EDIT_MENU = "admin/v2/Menu/Edit";
export const EDIT_ACTIVE_MENU = "admin/v2/Menu/EditActive";

export const REMOVE_MENU = "admin/v2/Menu/Delete";

export const GET_MENU_ITEMS = "admin/v2/MenuItem/Get";
export const CREATE_MENU_ITEMS = "admin/v2/MenuItem/Insert";
export const EDIT_MENU_ITEMS = "admin/v2/MenuItem/Edit";
export const EDIT_ACTIVE_MENU_ITEMS = "admin/v2/MenuItem/EditActive";

export const MENU_ITEM_IMAGE = "admin/v2/MenuItem/InsertImage";
export const REMOVE_MENU_ITEM_IMAGE = "admin/v2/MenuItem/DeleteImage";
export const REMOVE_MENU_ITEMS = "admin/v2/MenuItem/Delete";

// score
export const productScores = "admin/v2/ProductScore/GetAll";
export const EXPORT_productScores = "admin/v2/ProductScore/Export";

export const EDIT_PRODUCY_SCORE = "admin/v2/ProductScore/Edit";
export const EDIT_ACTIVE_PRODUCY_SCORE = "admin/v2/ProductScore/EditActive";

export const DELETE_PRODUCY_SCORE = "admin/v2/ProductScore/Delete";

// showcases
export const ALL_SHOWCASES = "admin/v2/ShowCase/GetAll";
export const GET_SHOWCASES = "admin/v2/ShowCase/Get";
export const GET_SHOWCASES_URLS = "admin/v2/ShowCase/GetUrls";
export const GET_SHOWCASES_TYPE = "admin/v2/ShowCase/GetTypes";
export const EditPriority_SHOWCASES_TYPE = "admin/v2/ShowCase/EditPriority";

export const EXPORT_ALL_SHOWCASES = "admin/v2/ShowCase/Export";

export const CREATE_SHOWCASE = "admin/v2/ShowCase/Insert";
export const EDIT_SHOWCASE = "admin/v2/ShowCase/Edit";
export const EDIT_ACTIVE_SHOWCASE = "admin/v2/ShowCase/EditActive";
export const CREATE_SHOWCASE_IMAGE = "admin/v2/ShowCase/InsertGallery";
export const UPDATE_SHOWCASE_IMAGE = "admin/v2/ShowCase/EditGallery";
export const DELETE_SHOWCASE_IMAGE = "admin/v2/ShowCase/DeleteGallery";
export const DELETE_SHOWCASE = "admin/v2/ShowCase/Delete";
export const DELETE_ALL_SHOWCASE = "admin/v2/ShowCase/DeleteAll";

// sliders
export const ALL_SLIDERS = "admin/v2/Slider/GetAll";
export const EXPORT_ALL_SLIDERS = "admin/v2/Slider/Export";

export const CREATE_SLIDER = "admin/v2/Slider/Insert";
export const EDIT_SLIDER = "admin/v2/Slider/Edit";
export const EDIT_ACTIVE_SLIDER = "admin/v2/Slider/EditActive";

export const DELETE_SLIDER = "admin/v2/Slider/Delete";

// orders
export const ALL_ORDERS = "admin/v2/Order/GetAll";
export const EXPORT_ALL_ORDERS = "admin/v2/Order/Export";
export const RESEND_DELIVERY_CODE = "admin/v2/Order/ResendDeliveryCode";
export const ORDER_TYPE = "admin/v2/Order/GetTypes?page=1&limit=1000";
export const SINGLE_ORDER = "admin/v2/Order/Get";
export const EDIT_ORDER_STATE = "admin/v2/Order/EditState";
export const EDIT_ORDER_REVOKE = "admin/v2/Order/Revoke";
export const ADD_NEW_DELIVER_ORDER_STATE =
  "admin/v2/Order/AddBaileeAgentDetail";
export const SUBMIT_NEW_DELIVER_ORDER_REVOKE =
  "admin/v2/Order/ConfirmBaileeAgent";
export const CHANGE_ALL_ORDER_STATE = "admin/v2/Order/BulkChangeOrdersToNextState";
export const orderDescription = "admin/v2/Order/Edit";
export const ORDER_SEND_SMS = "admin/v2/Order/SendAdminDescriptionWithSMS";
export const SEND_CODE_PREINVOCE = "admin/v2/PreOrder/SendConsumeCode";

export const order_ACTIVE_Description = "admin/v2/Order/EditActive";

export const INVOICE = "admin/v2/Order/Invoices";
export const REORDER = "admin/v2/Order/ReorderAttachments";

export const GETSHIPMENTLABEL = "admin/v2/Mahex/GetShipmentLabel";
export const CREATESHIPMENT = "admin/v2/Mahex/CreateShipment";
export const getWaybill = "admin/v2/Mahex/GetWaybill";
export const track = "admin/v2/Mahex/Track";
export const export1 = "admin/export1";
export const CANCELSHIPENT = "admin/v2/Mahex/CancelShipment";
export const loadRequests = "admin/v2/LoanRequest/GetAll";
export const EXPORT_loadRequests = "admin/v2/LoanRequest/Export";
export const TIPAX_BY_ORDER_ID = "admin/v2/Tipax/BriefTrackingByOrderId";

export const loadRequest = "admin/v2/LoanRequest/Edit";
export const loadRequest_ACTIVE = "admin/v2/LoanRequest/EditActive";

//companyInfo
export const companyInfo = "admin/companyInfo";

// users
export const ALL_USERS = "admin/v2/User/GetAll";
export const EXPORT_ALL_USERS = "admin/v2/User/Export";

export const SINGLE_USER = "admin/v2/User/Get";
export const EDIT_USER = "admin/v2/User/Edit";
export const CREATE_USER = "admin/v2/User/Insert";

export const EDIT_USER_AVATAR = "admin/v2/User/EditAvatar";

export const EDIT_ACTIVE_USER = "admin/v2/User/EditActive";
export const DELETE_USER = "admin/v2/User/Delete";
export const EDIT_USER_PASSWORD = "admin/v2/User/ChangePassword";

export const GET_USER_ADDRESS = "admin/v2/UserAddress/GetAll";
export const ADD_USER_ADDRESS = "admin/v2/UserAddress/Insert";
export const REMOVE_USER_ADDRESS = "admin/v2/UserAddress/Delete";
export const EDIT_USER_ADDRESS = "admin/v2/UserAddress/Edit";

export const GET_USER_AGENCY = "admin/v2/AgentSetting/Get";
export const ADD_USER_AGENCY = "admin/v2/AgentSetting/Insert";
export const REMOVE_USER_AGENCY = "admin/v2/AgentSetting/Delete";
export const EDIT_USER_AGENCY = "admin/v2/AgentSetting/Edit";

export const GET_PROVINCE = "public/provinces";
export const EDIT_PROVINCE = "admin/v2/Province/Edit";
export const ADD_PROVINCE = "admin/v2/Province/Insert";
export const DELETE_PROVINCE = "admin/v2/Province/Delete";

export const userPermissions = "admin/v2/User/UserPermissions";
export const USER_ROLES = "admin/v2/User/GetRoles";

export const permissions = "admin/v2/Permission/GetAll?Page=1&Limit=1000";
export const EXPORT_permissions = "admin/v2/Permission/Export";

export const GET_ACCSSESS_BY_ID = "admin/v2/AccessPermission/GetAllByAccessId";
// synonyms
export const ALL_SYNONYMS = "admin/v2/Synonim/GetAll";
export const EXPORT_ALL_SYNONYMS = "admin/v2/Synonim/Export";

export const CREATE_SYNONIM = "admin/v2/Synonim/Insert";
export const EDIT_SYNOIM = "admin/v2/Synonim/Edit";
export const EDIT_ACTIVE_SYNOIM = "admin/v2/Synonim/EditActive";

export const DELETE_SYNONYM = "admin/v2/Synonim/Delete";

// shipping companies
export const ALL_SHIPPING_COMPANIES = "v2/ShippingCompany/GetAll";
export const ALL_SHIPPING_COMPANIES_GET_BY_ID = "v2/ShippingCompany/Get";

export const EXPORT_ALL_SHIPPING_COMPANIES = "v2/ShippingCompany/Export";
export const GET_BY_FACILITES_ID =
  "admin/v2/ShippingCost/shippingTimeByFacilityId";
export const CREATE_SHIPPING_COMPANY = "v2/ShippingCompany/Insert";
export const EDIT_SHIPPING_COMPANY = "v2/ShippingCompany/Edit";
export const EDIT_ACTIVE_SHIPPING_COMPANY = "v2/ShippingCompany/EditActive";
export const DELETE_SHIPPING_ALL_COMPANY = "v2/ShippingCompany/DeleteAll";
export const EDIT_ACTIVE_ALL_SHIPPING_COMPANY =
  "v2/ShippingCompany/EditActiveAll";

export const DELETE_SHIPPING_COMPANY = "v2/ShippingCompany/Delete";
export const SET_SHIPPING_PRICE = "admin/v2/ShippingCost/Insert";
export const UPDATE_SHIPPING_PRICE = "admin/v2/ShippingCost/Edit";
export const UPDATE_ACTIVE_SHIPPING_PRICE = "admin/v2/ShippingCost/EditActive";

export const DELETE_SHIPPING_PRICE = "admin/v2/ShippingCost/Delete";

export const EDIT_SHIPPING_PRICE = "admin/v2/ShippingCost/Edit";
export const COMPANY_PRICES = "admin/v2/ShippingCost/GetAll";
export const Export_COMPANY_PRICES = "admin/v2/ShippingCost/Export";
export const UPDATE_FROM_API_COMPANY_PRICES =
  "admin/v2/ShippingCost/UpdateShippingCostsForApi";

export const COMPANY_PRICES_IMPORT = "admin/v2/ShippingCost/ImportShippingCost";
export const UPDATE_ACTIVE_ALL_SHIPPING_PRICE =
  "admin/v2/ShippingCost/EditActiveAll";
export const DELETE_ALL_SHIPPING_PRICE = "admin/v2/ShippingCost/DeleteAll";
// info groups
export const ALL_INFOGROUPS = "admin/v2/CategoryAbility/GetAll";
export const EXPORT_ALL_INFOGROUPS = "admin/v2/CategoryAbility/Export";

export const CREATE_INFOGROUP = "admin/v2/CategoryAbility/Insert";
export const EDIT_INFOGROUP = "admin/v2/CategoryAbility/Edit";
export const EDIT_ACTIVE_INFOGROUP = "admin/v2/CategoryAbility/EditActive";

export const DELETE_INFOGROUP = "admin/v2/CategoryAbility/Delete";

// notification
export const ALL_NOTIFICATIONS = "admin/v2/SiteNotification/GetAll";
export const EXPORT_ALL_NOTIFICATIONS = "admin/v2/SiteNotification/Export";

export const DELETE_NOTIFICATION = "admin/v2/SiteNotification/Delete";
export const CREATE_NOTIFICATION = "admin/v2/SiteNotification/Insert";
export const EDIT_NOTIFICATION = "admin/v2/SiteNotification/Edit";
export const EDIT_ACTIVE_NOTIFICATION = "admin/v2/SiteNotification/EditActive";

export const ALL_ADMIN_NOTIFICATIONS = "admin/v2/Notification/GetAll";
export const EXPORT_ALL_ADMIN_NOTIFICATIONS = "admin/v2/Notification/Export";
export const DELETE_ADMIN_NOTIFICATION = "admin/v2/Notification/Delete";
export const CREATE_ADMIN_NOTIFICATION = "admin/v2/Notification/Insert";
export const EDIT_ADMIN_NOTIFICATION = "admin/v2/Notification/Edit";
export const EDIT_ACTIVE_ADMIN_NOTIFICATION =
  "admin/v2/Notification/EditActive";
export const GET_BYROLE_ADMIN_NOTIFICATION =
  "admin/v2/Notification/GetNotificationsByFilter";

export const Chart1 = "admin/v2/Report/ReportSellByProduct";
export const export2 = "admin/export2";
export const export3 = "admin/export3";
export const export4 = "admin/export4";
export const export5 = "admin/export5";
export const export6 = "admin/export6";
export const export7 = "admin/export7";
export const export8 = "admin/export8";

export const disableAllProducts = "admin/v2/Product/DisableAll";
export const disableAllProductProperties =
  "admin/v2/ProductProperty/DisableAll";
export const SYNC_WITH_PAY = "admin/v2/Product/SyncProducts";

/* access */
export const GET_ACCESS_PROFILE = "admin/v2/AccessProfile/GetAll";
export const EXPORT_GET_ACCESS_PROFILE = "admin/v2/AccessProfile/Export";

export const CREATE_ACCESS_PROFILE = "admin/v2/AccessProfile/Insert";
export const EDIT_ACCESS_PROFILE = "admin/v2/AccessProfile/Edit";
export const EDIT_ACTIVE_ACCESS_PROFILE = "admin/v2/AccessProfile/EditActive";
export const OPEN_ALL_ACCESS_PROFILE = "admin/v2/AccessProfile/OpenAllAccess";
export const DELETE_ALL_ACCESS_PROFILE =
  "admin/v2/AccessProfile/DeleteAllAccess";

export const DELETE_ACCESS_PROFILE = "admin/v2/AccessProfile/Delete";

export const ADD_ACCESS_PERMISSION = "admin/v2/AccessPermission/Insert";
export const DELETE_ACCESS_PERMISSION = "admin/v2/AccessPermission/Delete";
/* supplier */
export const suppliers = "admin/v2/Supplier/GetAll";
export const EXPORT_suppliers = "admin/v2/Supplier/Export";

export const supplier = "admin/v2/Supplier/Get";
export const EDIT_SUPLIER = "admin/v2/Supplier/Edit";
export const EDIT_ACTIVE_SUPLIER = "admin/v2/Supplier/EditActive";

export const CREATE_SUPLIER = "admin/v2/Supplier/Insert";
export const DELETE_SUPLIER = "admin/v2/Supplier/Delete";

/* leasign */
export const leasings = "admin/v2/Leasing/GetAll";
export const EXPORT_leasings = "admin/v2/Leasing/Export";

export const leasing = "admin/v2/Leasing/Get";
export const CREATE_LEASING = "admin/v2/Leasing/Insert";
export const EDIT_LEASING = "admin/v2/Leasing/Edit";
export const EDIT_ACTIVE_LEASING = "admin/v2/Leasing/EditActive";

export const DELETE_LEASING = "admin/v2/Leasing/Delete";

/* works */
export const works = "admin/v2/Work/GetAll";
export const EXPORT_works = "admin/v2/Work/Export";

export const work = "admin/v2/Work/Get";
export const CREATE_WORK = "admin/v2/Work/Insert";
export const EDIT_WORK = "admin/v2/Work/Edit";
export const EDIT_ACTIVE_WORK = "admin/v2/Work/EditActive";

export const DELETE_WORK = "admin/v2/Work/Delete";

/* sms */
export const GET_SMS = "admin/v2/SMS/GetAll";
export const EXPORT_GET_SMS = "admin/v2/SMS/Export";

export const CREATE_SMS = "admin/v2/SMS/Insert";
export const EDIT_SMS = "admin/v2/SMS/Edit";
export const EDIT_ACTIVE_SMS = "admin/v2/SMS/EditActive";

export const DELETE_SMS = "admin/v2/SMS/Delete";
/* sms log */
export const GET_SMS_LOG = "admin/v2/SMSLog/GetAll";
export const EXPORT_GET_SMS_LOG = "admin/v2/SMSLog/Export";
export const DELETE_ALL_SMS_LOG = "admin/v2/SMSLog/DeleteAll";

/* sms access */
export const GET_SMS_ACCESS = "admin/v2/SMSLogAccess/GetAll";
export const EXPORT_GET_SMS_ACCESS = "admin/v2/SMSLogAccess/Export";

export const CREATE_SMS_ACCESS = "admin/v2/SMSLogAccess/Insert";
export const EDIT_SMS_ACCESS = "admin/v2/SMSLogAccess/Edit";
export const EDIT_ACTIVE_SMS_ACCESS = "admin/v2/SMSLogAccess/EditActive";

export const DELETE_SMS_ACCESS = "admin/v2/SMSLogAccess/Delete";

export const SYNCCRM = "admin/v2/Order/syncWithCrm";
export const RECHECK_BANK_TRANSACTION = "admin/v2/Order/RecheckBankTransaction";
export const RECHECK_WALLET_BANK_TRANSACTION =
  "admin/v2/WalletPayment/RecheckBankTransaction";
/*   reports */
export const GET_SUM_GATEWAY = "admin/v2/Report/ReportSumGateway";
export const GET_SUM_GATEWAY_ALL = "admin/v2/Report/SumReportSumGateway";

export const GET_AGENT_SUMMERY = "admin/v2/AgentSummary/GetAll";
export const EXPORT_AGENT_SUMMERY = "admin/v2/AgentSummary/Export";

export const EXPORT_SUM_GATEWAY = "admin/v2/Report/ExportSumGateway";

export const GET_SUM_COOPERATION = "admin/v2/CooperationRequest/GetAll";

export const GET_BY_ID_SUM_COOPERATION = "admin/v2/CooperationRequest/Get";
export const EXPORT_BY_ID_SUM_COOPERATION =
  "admin/v2/CooperationRequest/ExportRequest";

export const EXPORT_SUM_COOPERATION = "admin/v2/CooperationRequest/Export";
export const EDIT_SUM_COOPERATION = "dmin/v2/CooperationRequest/Confirm";
export const GET_FILES_SUM_COOPERATION =
  "admin/v2/CooperationRequest/GetAllFiles";

export const CONFIRM_COOPERATION = "admin/v2/CooperationRequest/Confirm";
export const FINAL_COOPERATION = "admin/v2/CooperationRequest/Finalize";

export const EBORT_COOPERATION = "admin/v2/CooperationRequest/Abort";
export const INCOMPELTE_COOPERATION =
  "admin/v2/CooperationRequest/IncompleteDocuments";

export const GET_USER_TURN_OVER = "admin/v2/Report/ReportUserTurnover";
export const EXPORT_USER_TURN_OVER = "admin/v2/Report/ExportUserTurnover";

export const GET_USER_FACILITY_TURN_OVER =
  "admin/v2/Report/ReportUserFacilityTurnover";
export const EXPORT_USER_FACILITY_TURN_OVER =
  "admin/v2/Report/ExportUserFacilityTurnover";

export const GET_AGENT_TURN_OVER = "admin/v2/AgentTurnover/GetAll";
export const EXPORT_AGENT_TURN_OVER = "admin/v2/AgentTurnover/Export";

export const GET_SUM_GATEWAY_BY_USER = "admin/v2/Report/ReportSumGatewayByUser";
export const EXPORT_SUM_GATEWAY_BY_USER =
  "admin/v2/Report/ExportSumGatewayByUser";
export const GET_REPORT_TRANSACTION = "admin/v2/Report/ReportTransactions";
export const EXPORT_REPORT_TRANSACTION = "admin/v2/Report/ExportTransactions";

export const GET_REPORT_WALLET_BALANCE = "admin/v2/Report/ReportWalletBalance";
export const EXPORT_REPORT_WALLET_BALANCE =
  "admin/v2/Report/ExportWalletBalance";
export const TOGGLE_WALLET_BALANCE =
  "admin/v2/WalletLockHistory/ToggleWalletLock";

export const GET_FACILITY_REPORT_WALLET_BALANCE =
  "admin/v2/Report/ReportFacilityWalletBalance";
export const EXPORT_FACILITY_REPORT_WALLET_BALANCE =
  "admin/v2/Report/ExportFacilityWalletBalance";
export const TOGGLE_FACILIY_WALLET_BALANCE =
  "admin/v2/FacilityWalletLockHistory/ToggleWalletLock";
export const GetFacilityUserWalletLockHistories =
  "admin/v2/FacilityWalletLockHistory/GetUserWalletLockHistories";
export const GetFacilityWalletLockHistories =
  "admin/v2/FacilityWalletLockHistory/GetFacilityWalletLockHistories";
export const AddFacilityWalletLockHistories =
  "admin/v2/FacilityWalletLockHistory/AddFacilityWalletLockHistories";
export const GET_RESERVE_REPORT = "admin/v2/Report/ReportReserved";
export const EXPORT_RESERVE_REPORT = "admin/v2/Report/ExportReserved";

export const EXPORT_PLAN_REPORT = "admin/v2/PlanTransaction/Export";
export const GET_PLAN_REPORT = "admin/v2/PlanTransaction/GetAll";

export const GET_DAILY_REPORT = "admin/v2/Report/ReportDisaggregatedDailySales";
export const EXPORT_DAILY_REPORT =
  "admin/v2/Report/ExportDisaggregatedDailySales";

export const EXPORT_INVOICE_REPORT = "admin/v2/Report/ExportInvoice";
export const GET_INVOICE_REPORT = "admin/v2/Report/ReportInvoice";
export const GET_SUM_INVOICE = "admin/v2/Report/SumReportInvoice";
export const EXPORT_PLAN_LANDING_REPORT = "admin/v2/Report/ExportLoan";
export const GET_PLAN_LANDING_REPORT = "admin/v2/Report/ReportLoan";
export const REJECT_PLAN_LANDING_REPORT = "admin/v2/Loan/Aborted";
export const APPROVED_PLAN_LANDING_REPORT = "admin/v2/Loan/Processed";
export const GET_SUM_INVOICE_DAILY =
  "admin/v2/Report/SumReportDisaggregatedDailySales";

export const EXPORT_DISCOUNT_REPORT = "admin/v2/DiscountTransaction/Export";
export const GET_DISCOUNT_REPORT = "admin/v2/DiscountTransaction/GetAll";

export const EXPORT_LOG_REPORT = "admin/v2/Log/Export";
export const GET_LOG_REPORT = "admin/v2/Log/GetAll";

export const GET_SHIPMENT_REPORT = "admin/v2/Report/ReportShipment";
export const EXPORT_SHIPMENT_REPORT = "admin/v2/Report/ExportShipment";

/* widgets */
export const WidgetDailySale = "admin/v2/Widget/WidgetDailySale";
export const WidgetDailySaleByBrand = "admin/v2/Widget/WidgetDailySaleByBrand";
export const WidgetTopProducts = "admin/v2/Widget/WidgetTopProducts";
export const WidgetTodaySaleRatio = "admin/v2/Widget/WidgetTodaySaleRatio";
export const WidgetWalletCharge = "admin/v2/Widget/WidgetWalletCharge";
export const WidgetResentOrders = "admin/v2/Widget/WidgetResentOrders";
export const WidgetSaleByRegion = "admin/v2/Widget/WidgetSaleByRegion";
export const WidgetRecentOrders = "admin/v2/Widget/WidgetRecentOrders";
export const WidgetNotSentOrders = "admin/v2/Widget/WidgetNotSentOrders";
export const WidgetOrdersSummaryData = "admin/v2/Widget/WidgetOrdersSummary";
export const WidgetMonthlySaleByDay = "admin/v2/Widget/WidgetMonthlySaleByDay";
export const WidgetMonthlyRegistrationByDay =
  "admin/v2/Widget/WidgetMonthlyRegistrationByDay";
export const WidgetPLan = "admin/v2/Widget/WidgetPlanLoanRequest";
export const WidgetFacilityWalletsAmount =
  "admin/v2/Widget/WidgetFacilityWalletsAmount";

export const WidgetDisaggregatedDailySales =
  "admin/v2/Widget/WidgetDisaggregatedDailySales";

// footer logos
export const GET_FOOTER_LOGOS = "admin/v2/FooterLogo/GetAll";
export const EXPORT_FOOTER_LOGOES = "admin/v2/FooterLogo/Export";
export const CREATE_FOOTER_LOGOES = "admin/v2/FooterLogo/Insert";
export const EDIT_FOOTER_LOGOES = "admin/v2/FooterLogo/Edit";
export const DELETE_FOOTER_LOGOES = "admin/v2/FooterLogo/Delete";
export const EDIT_ACTIVE_FOOTER_LOGOES = "admin/v2/FooterLogo/EditActive";
/* bloges */

export const GET_BLOG_CATEGORY = "admin/v2/BlogCategory/GetAll";
export const EXPORT_BLOG_CATEGORY = "admin/v2/BlogCategory/Export";
export const CREATE_BLOG_CATEGORY = "admin/v2/BlogCategory/Insert";
export const EDIT_BLOG_CATEGORY = "admin/v2/BlogCategory/Edit";

export const DELETE_BLOG_CATEGORY = "admin/v2/BlogCategory/Delete";

export const GET_BLOG = "admin/v2/Blog/GetAll";
export const GET_BLOG_URL = "admin/v2/Blog/GetUrls";

export const EXPORT_BLOG = "admin/v2/Blog/Export";
export const CREATE_BLOG = "admin/v2/Blog/Insert";
export const EDIT_BLOG = "admin/v2/Blog/Edit";
export const EDIT_ACTIVE_BLOG = "admin/v2/Blog/EditActive";
export const DELETE_BLOG = "admin/v2/Blog/Delete";
export const GET_SINGLE_BLOG = "admin/v2/Blog/Get";

export const GET_BLOG_Tag = "admin/v2/BlogTag/GetAll"; 
export const EXPORT_BLOG_Tag = "admin/v2/BlogTag/Export";
export const CREATE_BLOG_Tag = "admin/v2/BlogTag/Insert";
export const EDIT_BLOG_Tag = "admin/v2/BlogTag/Edit";
export const DELETE_BLOG_Tag = "admin/v2/BlogTag/Delete";

export const GET_RELATED_TAG = "admin/v2/BlogRelatedTag/GetAll";
export const EDIT_BLOG_RELATED_TAG = "admin/v2/BlogRelatedTag/MultiEdit";

export const GET_BLOG_LIKE = "admin/v2/BlogLike/GetAll";
export const EXPORT_BLOG_LIKE = "admin/v2/BlogLike/Export";
export const CREATE_BLOG_LIKE = "admin/v2/BlogLike/Insert";
export const EDIT_BLOG_LIKE = "admin/v2/BlogLike/Edit";
export const DELETE_BLOG_LIKE = "admin/v2/BlogLike/Delete";

export const GET_BLOG_POINT = "admin/v2/BlogPoint/GetAll";
export const EXPORT_BLOG_POINT = "admin/v2/BlogPoint/Export";
export const CREATE_BLOG_POINT = "admin/v2/BlogPoint/Insert";
export const EDIT_BLOG_POINT = "admin/v2/BlogPoint/Edit";
export const DELETE_BLOG_POINT = "admin/v2/BlogPoint/Delete";
export const EDIT_BLOG_POINT_VERIFY = "admin/v2/BlogPoint/Verify";

export const EDIT_REDIRECT = "admin/v2/Blog/Redirect";

export const GET_BLOG_REDIRECT = "admin/v2/BlogRedirect/GetAll";
export const EXPORT_BLOG_REDIRECT = "admin/v2/BlogRedirect/Export";
export const CREATE_BLOG_REDIRECT = "admin/v2/BlogRedirect/Insert";
export const EDIT_BLOG_REDIRECT = "admin/v2/BlogRedirect/Edit";

export const GET_SITE_LINK = "admin/v2/SiteLink/GetAll";
export const EXPORT_SITE_LINK = "admin/v2/SiteLink/Export";
export const CREATE_SITE_LINK = "admin/v2/SiteLink/Insert";
export const EDIT_SITE_LINK = "admin/v2/SiteLink/Edit";
export const DELETE_SITE_LINK = "admin/v2/SiteLink/Delete";
export const EDIT_ACTIVE_SITE_LINK = "admin/v2/SiteLink/Edit";

export const GET_COMPANY = "admin/v2/Company/GetAll";
export const GET_COMPANY_SINGLE = "admin/v2/Company/Get";
export const EXPORT_COMPANY = "admin/v2/Company/Export";
export const CREATE_COMPANY = "admin/v2/Company/Insert";
export const EDIT_COMPANY = "admin/v2/Company/Edit";
export const DELETE_COMPANY = "admin/v2/Company/Delete";
export const EDIT_ACTIVE_COMPANY = "admin/v2/Company/EditActive";

export const COMPANY_IMPORT_USER = "admin/v2/Company/ImportUser";
export const COMPANY_IMPORT_USER_BY_ID = "admin/v2/Company/AddUsers";
export const COMPANY_REMOVE_USER_BY_ID = "admin/v2/Company/RemoveUsers";

export const GET_PLAN = "admin/v2/SpecialPlan/GetAll";
export const GET_PLAN_SINGEL = "admin/v2/SpecialPlan/Get";
export const GET_PLAN_ACTIVE = "admin/v2/SpecialPlan/GetAllActive";

export const EXPORT_PLAN = "admin/v2/SpecialPlan/Export";
export const CREATE_PLAN = "admin/v2/SpecialPlan/Insert";
export const EDIT_PLAN = "admin/v2/SpecialPlan/Edit";
export const DELETE_PLAN = "admin/v2/SpecialPlan/Delete";
export const EDIT_ACTIVE_PLAN = "admin/v2/SpecialPlan/EditActive";

export const GET_EMAILS = "admin/v2/EmailLog/GetAll";
export const EXPORT_EMAILS = "admin/v2/EmailLog/Export";

export const GET_PLAN_LOAN = "admin/v2/PlanLoanRequest/GetAll";
export const GET_PLAN_SINGEL_LOAN = "admin/v2/PlanLoanRequest/Get";
export const EXPORT_PLAN_LOAN = "admin/v2/PlanLoanRequest/Export";
export const CREATE_PLAN_LOAN = "admin/v2/PlanLoanRequest/Insert";
export const EDIT_PLAN_LOAN = "admin/v2/PlanLoanRequest/EditInsert";
export const SMS_PLAN_LOAN = "admin/v2/PlanLoanRequest/SendSMS";
export const BANK_PLAN_LOAN = "admin/v2/PlanLoanRequest/PayRequest";
export const MEETING_PLAN_LOAN = "admin/v2/PlanLoanRequest/MeetTiming";
export const STEP_PLAN_LOAN = "admin/v2/PlanLoanRequest/ChangeStep";
export const REVOKE_PLAN_LOAN = "admin/v2/PlanLoanRequest/Revoke";
export const RETRIEVAL_PLAN_LOAN = "admin/v2/PlanLoanRequest/RetrievalAsync";

export const GET_PLAN_PAYMENT = "admin/v2/PlanLoanPayment/GetAll";

export const GET_PLAN_CHECK_PAYMENT = "admin/v2/PlanLoanRequest/CheckPayment";
export const DELETE_PLAN_LOAN = "admin/v2/PlanLoanRequest/Delete";
export const EDIT_ACTIVE_PLAN_LOAN = "admin/v2/PlanLoanRequest/EditActive";

export const CREDIT_SCORE_PLAN_LOAN =
  "admin/v2/PlanLoanRequest/CreditScoreSendCode";
export const VERIFY_CODE_PLAN_LOAN =
  "admin/v2/PlanLoanRequest/CreditScoreVerifyCode";
export const STATUS_CHECK_PLAN_LOAN =
  "admin/v2/PlanLoanRequest/CreditScoreStatusCheck";
export const SCORE_REPORT_PLAN_LOAN =
  "admin/v2/PlanLoanRequest/CreditScoreReport";

export const GET_PLAN_LOAN_SETTING = "admin/v2/PlanLoanSetting/Get";
export const GET_PLAN_SINGEL_LOAN_SETTING = "admin/v2/PlanLoanSetting/Get";
export const EXPORT_PLAN_LOAN_SETTING = "admin/v2/PlanLoanSetting/Export";
export const CREATE_PLAN_LOAN_SETTING = "admin/v2/PlanLoanSetting/Insert";
export const EDIT_PLAN_LOAN_SETTING = "admin/v2/PlanLoanSetting/Edit";
export const DELETE_PLAN_LOAN_SETTING = "admin/v2/PlanLoanSetting/Delete";
export const EDIT_ACTIVE_PLAN_LOAN_SETTING =
  "admin/v2/PlanLoanSetting/EditActive";

export const GET_PLAN_LOAN_DOCUMENT = "admin/v2/PlanLoanDocument/GetAll";
export const GET_PLAN_SINGEL_LOAN_DOCUMENT = "admin/v2/PlanLoanDocument/Get";
export const EXPORT_PLAN_LOAN_DOCUMENT = "admin/v2/PlanLoanDocument/Export";
export const CREATE_PLAN_LOAN_DOCUMENT = "admin/v2/PlanLoanDocument/Insert";
export const EDIT_PLAN_LOAN_DOCUMENT = "admin/v2/PlanLoanDocument/Edit";
export const DELETE_PLAN_LOAN_DOCUMENT = "admin/v2/PlanLoanDocument/Delete";
export const EDIT_ACTIVE_PLAN_LOAN_DOCUMENT =
  "admin/v2/PlanLoanDocument/EditActive";

export const GET_BUNDLE_PRODUCT = "admin/v2/ProductBundle/GetAll";
export const GET_SINGLE_BUNDLE_PRODUCT = "admin/v2/ProductBundle/Get";
export const EXPORT_BUNDLE_PRODUCT = "admin/v2/ProductBundle/Export";
export const CREATE_BUNDLE_PRODUCT = "admin/v2/ProductBundle/Insert";
export const EDIT_BUNDLE_PRODUCT = "admin/v2/ProductBundle/Edit";
export const DELETE_BUNDLE_PRODUCT = "admin/v2/ProductBundle/Delete";
export const EDIT_ACTIVE_BUNDLE_PRODUCT = "admin/v2/ProductBundle/EditActive";

export const GET_USER_NOTIFACTION = "admin/v2/UserNotification/GetAll";
export const EXPORT_USER_NOTIFACTION = "admin/v2/UserNotification/Export";

export const GET_USER_NOTIFICATION_TARGET =
  "admin/v2/UserNotificationTarget/GetAll";
export const GET_SINGLE_USER_NOTIFICATION_TARGET =
  "admin/v2/UserNotificationTarget/Get";
export const EXPORT_USER_NOTIFICATION_TARGET =
  "admin/v2/UserNotificationTarget/Export";
export const CREATE_USER_NOTIFICATION_TARGET =
  "admin/v2/UserNotificationTarget/Insert";
export const EDIT_USER_NOTIFICATION_TARGET =
  "admin/v2/UserNotificationTarget/Edit";
export const DELETE_USER_NOTIFICATION_TARGET =
  "admin/v2/UserNotificationTarget/Delete";
export const EDIT_ACTIVE_USER_NOTIFICATION_TARGET =
  "admin/v2/UserNotificationTarget/EditActive";

export const GET_INBOX = "admin/v2/Inbox/GetAll";
export const GET_SINGLE_INBOX = "admin/v2/Inbox/Get";
export const EXPORT_INBOX = "admin/v2/Inbox/Export";

export const GET_USER_SCORE_PARAMETER = "admin/v2/ScoreParameter/GetAll";
export const GET_SINGLE_USER_SCORE_PARAMETER = "admin/v2/ScoreParameter/Get";
export const EXPORT_USER_SCORE_PARAMETER = "admin/v2/ScoreParameter/Export";
export const CREATE_USER_SCORE_PARAMETER = "admin/v2/ScoreParameter/Insert";
export const EDIT_USER_SCORE_PARAMETER = "admin/v2/ScoreParameter/Edit";
export const DELETE_USER_SCORE_PARAMETER = "admin/v2/ScoreParameter/Delete";
export const EDIT_ACTIVE_USER_SCORE_PARAMETER =
  "admin/v2/ScoreParameter/EditActive";

export const GET_BANK = "admin/v2/Bank/GetAll";
export const GET_SINGLE_BANK = "admin/v2/Bank/Get";
export const EXPORT_BANK = "admin/v2/Bank/Export";
export const CREATE_BANK = "admin/v2/Bank/Insert";
export const EDIT_BANK = "admin/v2/Bank/Edit";
export const DELETE_BANK = "admin/v2/Bank/Delete";
export const EDIT_ACTIVE_BANK = "admin/v2/Bank/EditActive";

export const GET_BANK_BRANCH = "admin/v2/BankBranch/GetAll";
export const GET_SINGLE_BANK_BRANCH = "admin/v2/BankBranch/Get";
export const EXPORT_BANK_BRANCH = "admin/v2/BankBranch/Export";
export const CREATE_BANK_BRANCH = "admin/v2/BankBranch/Insert";
export const EDIT_BANK_BRANCH = "admin/v2/BankBranch/Edit";
export const DELETE_BANK_BRANCH = "admin/v2/BankBranch/Delete";
export const EDIT_ACTIVE_BANK_BRANCH = "admin/v2/BankBranch/EditActive";

export const GET_SINGLE_SYNC = "admin/v2/Sync/GetAll";
export const GET_SINGLE_SYNCGET_SINGLE_SYNC = "admin/v2/Sync/Get";
export const EXPORT_SYNCGET_SINGLE_SYNC = "admin/v2/Sync/Export";
export const CREATE_SYNCGET_SINGLE_SYNC = "admin/v2/Sync/SyncAll";

/* --------------------- validatation --------------------- */
export const CHECK_PERSOANL_DETAILS =
  "admin/v2/PersonalDetailMatch/national-code-match";
export const CHECK_PERSOANL_DETAILS_FRONT =
  "admin/v2/PersonalDetailMatch/GetActiveStatus";
export const CHECK_PERSOANL_DETAILS_FRONT_USER =
  "api/PersonalDetailMatch/GetActiveStatusForUser";
export const CHECK_PERSOANL_DETAILS_Update =
  "admin/v2/PersonalDetailMatch/updateActiveStatus";
export const CHECK_PERSOANL_DETAILS_Update_USER =
  "api/PersonalDetailMatch/UpdateActiveStatusForUser";
export const GET_REFAHLOAN = "admin/v2/RefahLoan/GetAll";
export const GET_SINGLE_REFAHLOAN = "admin/v2/RefahLoan/Get";
export const EXPORT_REFAHLOAN = "admin/v2/RefahLoan/Export";
export const CREATE_REFAHLOAN = "admin/v2/RefahLoan/Insert";
export const EDIT_REFAHLOAN = "admin/v2/RefahLoan/Edit";
export const EDIT_REQUEST_REFAHLOAN = "admin/v2/RefahLoan/EditRequest";
export const EDIT_SIMPLE_REFAHLOAN = "admin/v2/RefahLoan/NormalEdit";

export const DELETE_REFAHLOAN = "admin/v2/RefahLoan/Delete";
export const DELETE_REFAHLOAN_IN = "admin/v2/RefahLoan/DeleteInstallment";

export const EDIT_ACTIVE_REFAHLOAN = "admin/v2/RefahLoan/EditActive";
export const CONFIRM_REFAHLOAN = "admin/v2/RefahLoan/Confirm";
export const ABORT_REFAHLOAN = "admin/v2/RefahLoan/Abort";
export const REFAHLOAN = "admin/v2/RefahLoan/InstallmentSchedule";

export const DISTINC_ROW_EXPORT = "admin/v2/Order/DistinctRowExport";

export const RETRY_BLUE_BANK = "admin/v2/RefahLoan/RetryBluBank";
export const UPDATE_BLUE_BANK = "admin/v2/RefahLoan/UpdateBluBankState";
export const CANCLE_BLUE_BANK = "admin/v2/RefahLoan/CancelBluBank";
export const CONFIRM_BLUE_BANK = "admin/v2/RefahLoan/ConfirmBluBank";
export const SHARING_BLUE_BANK = "admin/v2/RefahLoan/SharingBluBank";
export const WalletChargeByBluBank = "admin/v2/RefahLoan/WalletChargeByBluBank";
export const ReturnBluBank = "admin/v2/RefahLoan/ReturnBluBank";
export const DeleteOnlyRefah = "admin/v2/RefahLoan/DeleteOnlyRefah";

export const DeleteOnlyBluBank = "admin/v2/RefahLoan/DeleteOnlyBluBank";

/*  ------------------ lend tech ----------------------- */

export const GET_LEND_TECH = "admin/v2/LendTech/GetAll";
export const GET_SINGLE_LEND_TECH = "admin/v2/LendTech/Get";
export const EXPORT_LEND_TECH = "admin/v2/LendTech/Export";
export const CREATE_LEND_TECH = "admin/v2/LendTech/Insert";
export const EDIT_LEND_TECH = "admin/v2/LendTech/Edit";
export const DELETE_LEND_TECH = "admin/v2/LendTech/Delete";
export const EDIT_ACTIVE_LEND_TECH = "admin/v2/LendTech/EditActive";

export const GET_LEND_TECH_DOCUMENT = "admin/v2/LendTechDocument/GetAll";
export const GET_SINGLE_LEND_TECH_DOCUMENT = "admin/v2/LendTechDocument/Get";
export const EXPORT_LEND_TECH_DOCUMENT = "admin/v2/LendTechDocument/Export";
export const CREATE_LEND_TECH_DOCUMENT = "admin/v2/LendTechDocument/Insert";
export const EDIT_LEND_TECH_DOCUMENT = "admin/v2/LendTechDocument/Edit";
export const DELETE_LEND_TECH_DOCUMENT = "admin/v2/LendTechDocument/Delete";
export const EDIT_ACTIVE_LEND_TECH_DOCUMENT =
  "admin/v2/LendTechDocument/EditActive";

export const GET_LEND_TECH_FIELD = "admin/v2/LendTechField/GetAll";
export const GET_SINGLE_LEND_TECH_FIELD = "admin/v2/LendTechField/Get";
export const EXPORT_LEND_TECH_FIELD = "admin/v2/LendTechField/Export";
export const CREATE_LEND_TECH_FIELD = "admin/v2/LendTechField/Insert";
export const EDIT_LEND_TECH_FIELD = "admin/v2/LendTechField/Edit";
export const DELETE_LEND_TECH_FIELD = "admin/v2/LendTechField/Delete";
export const EDIT_ACTIVE_LEND_TECH_FIELD = "admin/v2/LendTechField/EditActive";

export const GET_LEND_TECH_REQUEST = "admin/v2/LendTechRequest/GetAll";
export const GET_SINGLE_LEND_TECH_REQUEST = "admin/v2/LendTechRequest/Get";
export const EXPORT_LEND_TECH_REQUEST = "admin/v2/LendTechRequest/Export";
export const CREATE_LEND_TECH_REQUEST = "admin/v2/LendTechRequest/Insert";
export const EDIT_LEND_TECH_REQUEST = "admin/v2/LendTechRequest/EditInsert";
export const DELETE_LEND_TECH_REQUEST = "admin/v2/LendTechRequest/Delete";
export const EDIT_ACTIVE_LEND_TECH_REQUEST =
  "admin/v2/LendTechRequest/EditActive";

export const GET_LEND_TECH_STEP = "admin/v2/LendTechStep/GetAll";
export const GET_SINGLE_LEND_TECH_STEP = "admin/v2/LendTechStep/Get";
export const EXPORT_LEND_TECH_STEP = "admin/v2/LendTechStep/Export";
export const CREATE_LEND_TECH_STEP = "admin/v2/LendTechStep/Insert";
export const EDIT_LEND_TECH_STEP = "admin/v2/LendTechStep/Edit";
export const DELETE_LEND_TECH_STEP = "admin/v2/LendTechStep/Delete";
export const EDIT_ACTIVE_LEND_TECH_STEP = "admin/v2/LendTechStep/EditActive";

export const GetUserWalletLockHistories =
  "admin/v2/WalletLockHistory/GetUserWalletLockHistories";

export const GET_PAYMENT_LOG = "admin/v2/OnlinePaymentLog/GetAll";
export const GET_SINGLE_PAYMENT_LOG = "admin/v2/OnlinePaymentLog/Get";
export const EXPORT_PAYMENT_LOG = "admin/v2/OnlinePaymentLog/Export";
export const CREATE_PAYMENT_LOG = "admin/v2/OnlinePaymentLog/Insert";
export const DELETE_ALL_PAYMENT_LOG = "admin/v2/OnlinePaymentLog/DeleteAll";
export const DELETE_MONTH_PAYMENT_LOG =
  "admin/v2/OnlinePaymentLog/DeleteAllByMonth";

export const DELETE_PAYMENT_LOG = "admin/v2/OnlinePaymentLog/Delete";
export const EDIT_ACTIVE_PAYMENT_LOG = "admin/v2/OnlinePaymentLog/EditActive";

export const GET_LOGIN_IMAGES = "admin/v2/LoginImage/GetAll";
export const GET_SINGLE_LOGIN_IMAGES = "admin/v2/LoginImage/Get";
export const EXPORT_LOGIN_IMAGES = "admin/v2/LoginImage/Export";
export const CREATE_LOGIN_IMAGES = "admin/v2/LoginImage/Insert";
export const EDIT_LOGIN_IMAGES = "admin/v2/LoginImage/Edit";
export const DELETE_LOGIN_IMAGES = "admin/v2/LoginImage/Delete";
export const EDIT_ACTIVE_LOGIN_IMAGES = "admin/v2/LoginImage/EditActive";

export const DELETE_EXPIREDT_LOANS = "admin/v2/RefahLoan/DeleteExpiredLoans";

export const GET_FACILITIES = "admin/v2/Facility/GetAll";
export const GET_CHILD_FACILITIES =
  "admin/v2/FacilityParent/GetAllWithChildren";
export const GET_FACILITIES_SINGLE = "admin/v2/Facility/Get";

export const EXPORT_FACILITIES = "admin/v2/Facility/Export";
export const CREATE_FACILITIES = "admin/v2/Facility/Insert";
export const EDIT_FACILITIES = "admin/v2/Facility/Edit";
export const DELETE_FACILITIES = "admin/v2/Facility/Delete";
export const EDIT_ACTIVE_FACILITIES = "admin/v2/Facility/EditActive";

export const GET_FACILITIES_PARENT = "admin/v2/FacilityParent/GetAll";
export const EXPORT_FACILITIES_PARENT = "admin/v2/FacilityParent/Export";
export const CREATE_FACILITIES_PARENT = "admin/v2/FacilityParent/Insert";
export const EDIT_FACILITIES_PARENT = "admin/v2/FacilityParent/Edit";
export const DELETE_FACILITIES_PARENT = "admin/v2/FacilityParent/Delete";
export const EDIT_ACTIVE_FACILITIES_PARENT =
  "admin/v2/FacilityParent/EditActive";
export const ADD_FORCE_INSURANCE =
  "admin/v2/FacilityParent/AddForceInsuranceIntoFacility";
export const GetSavedForceInsurancesAndRelatedCategoriesByParentId =
  "admin/v2/FacilityParent/GetSavedForceInsurancesAndRelatedCategoriesByParentId";
export const UPDATE_ALL_REFAH = "admin/v2/RefahLoan/UpdateAll";
export const ADD_PRODUCT_FACILITY = "admin/v2/Product/AddProductFacilities";
export const GET_PRODUCT_FACILITY = "admin/v2/Product/GetProductFacilities";
export const DELETE_PRODUCT_FACILITY =
  "admin/v2/Product/DeleteProductFacilities";

/* pre  invoice */
export const GET_PREINVOICE = "admin/v2/PreFactor/GetAllPreFactor";
export const GET_PREINVOICE_SINGLE =
  "admin/v2/PreFactor/GetPreFactorProductByPreFactorId";

export const EXPORT_PREINVOICE = "admin/v2/PreFactor/Export";
export const CREATE_PREINVOICE =
  "admin/v2/PreOrder/AddPreFactorWithOutDependency";
export const EDIT_PREINVOICE =
  "admin/v2/PreOrder/EditPreFactorWithOutDependency";
export const REQUEST_LOAN_CREATE = "admin/v2/Facility/RequestLoan";
export const REQUEST_CONSUME_CREATE = "admin/v2/Facility/Consume";
export const GET_INSURANCE = "admin/v2/Insurance/GetAll";
export const GET_SINGLE_INSURANCE = "admin/v2/Insurance/Get";
export const EXPORT_INSURANCE = "admin/v2/Insurance/Export";
export const TYPEPS_INSURANCE = "admin/v2/Insurance/GetTypes";

export const CREATE_INSURANCE = "admin/v2/Insurance/Insert";
export const EDIT_INSURANCE = "admin/v2/Insurance/Edit";
export const DELETE_INSURANCE = "admin/v2/Insurance/Delete";
export const EDIT_ACTIVE_INSURANCE = "admin/v2/Insurance/EditActive";

export const GET_CATEGORY_INSURANCE =
  "admin/v2/CategoryInsurance/GetAllByCategoryId";
export const GET_SINGLE_CATEGORY_INSURANCE = "admin/v2/CategoryInsurance/Get";
export const EXPORT_CATEGORY_INSURANCE = "admin/v2/CategoryInsurance/Export";
export const CREATE_CATEGORY_INSURANCE = "admin/v2/CategoryInsurance/Insert";
export const EDIT_CATEGORY_INSURANCE = "admin/v2/CategoryInsurance/Edit";
export const DELETE_CATEGORY_INSURANCE = "admin/v2/CategoryInsurance/Delete";
export const EDIT_ACTIVE_CATEGORY_INSURANCE =
  "admin/v2/CategoryInsurance/EditActive";
export const SET_MANDATORY = "admin/v2/CategoryInsurance/SetMandatoryAsync";
export const TYPES_CATEGORY_INSURANCE =
  "admin/v2/CategoryInsurance/GetCategoryTypes";

export const GET_INSURANCE_PURCHASED =
  "admin/v2/InsurancePurchaseRecord/GetAll";
export const EXPORT_INSURANCE_PURCHASED =
  "admin/v2/InsurancePurchaseRecord/Export";
export const ACTIVE_INSURANCE_PURCHASED =
  "admin/v2/InsurancePurchaseRecord/ActiveInsurance";

export const CHECK_REFAH = "user/RefahCredit";
export const CHECK_BLUE = "user/HasBluBankAccount";
export const CHECK_BALON = "user/baloanCredit";
export const CHECK_BETABALON = "user/baloanBetaCredit";
export const CALC_FACILITY = "public/v2/User/CalculateFacilityPrice";
export const REQUEST_LOAN = "admin/v2/RefahLoan/RequestLoan";
export const CONSUME_LOAN = "admin/v2/RefahLoan/Consume";
export const CalculateUsableAmountWithUserMaxCreditForAgent =
  "admin/v2/FacilityParent/CalculateUsableAmountWithUserMaxCreditForAgent";

export const ALL_PACKAGING = "v2/Packaging/GetAll";
export const EXPORT_PACKAGING = "v2/Packaging/Export";
export const DELETE_PACKAGING = "v2/Packaging/Delete";
export const CREATE_PACKAGING = "v2/Packaging/Insert";
export const EDIT_PACKAGING = "v2/Packaging/Edit";
export const EDIT_ACTIVE_PACKAGING = "v2/Packaging/EditActive";
export const DELETE_ALL_PACKAGING = "v2/Packaging/DeleteAll";
export const EDIT_ACTIVE_ALL_PACKAGING = "v2/Packaging/EditActiveAll";

export const ALL_SHIPPINGCLASS = "admin/v2/ShippingClass/GetAll";
export const EXPORT_SHIPPINGCLASS = "admin/v2/ShippingClass/Export";
export const DELETE_SHIPPINGCLASS = "admin/v2/ShippingClass/Delete";
export const CREATE_SHIPPINGCLASS = "admin/v2/ShippingClass/Insert";
export const EDIT_SHIPPINGCLASS = "admin/v2/ShippingClass/Edit";
export const EDIT_ACTIVE_SHIPPINGCLASS = "admin/v2/ShippingClass/EditActive";
export const DELETE_ALL_SHIPPINGCLASS = "admin/v2/ShippingClass/DeleteAll";
export const EDIT_ACTIVE_ALL_SSHIPPINGCLASS =
  "admin/v2/ShippingClass/EditActiveAll";

export const ALL_SHIPPING_PERIOD = "admin/v2/ShippingPeriod/GetAll";
export const ALL_SHIPPING_CSV = "admin/v2/ShippingPeriod/ImportShippingPeriod";

export const EXPORT_SHIPPING_PERIOD = "admin/v2/ShippingPeriod/Export";
export const DELETE_SHIPPING_PERIOD = "admin/v2/ShippingPeriod/Delete";
export const CREATE_SHIPPING_PERIOD = "admin/v2/ShippingPeriod/Insert";
export const EDIT_SHIPPING_PERIOD = "admin/v2/ShippingPeriod/Edit";
export const EDIT_ACTIVE_SHIPPING_PERIOD = "admin/v2/ShippingPeriod/EditActive";
export const DELETE_ALL_SHIPPING_PERIOD = "admin/v2/ShippingPeriod/DeleteAll";
export const EDIT_ACTIVE_ALL_SHIPPING_PERIOD =
  "admin/v2/ShippingPeriod/EditActiveAll";

export const GET_PAGE_SEO = "admin/v2/SeoUrl/GetAll";
export const GET_SINGLE_PAGE_SEO = "admin/v2/SeoUrl/Get";
export const EXPORT_PAGE_SEO = "admin/v2/SeoUrl/Export";
export const CREATE_PAGE_SEO = "admin/v2/SeoUrl/Insert";
export const EDIT_PAGE_SEO = "admin/v2/SeoUrl/Patch";
export const DELETE_PAGE_SEO = "admin/v2/SeoUrl/Delete";
export const EDIT_ACTIVE_PAGE_SEO = "admin/v2/SeoUrl/EditActive";

export const GET_CALENDER = "admin/v2/Calendar/GetAll";
export const GET_SINGLE_CALENDER = "admin/v2/Calendar/Get";
export const EXPORT_CALENDER = "admin/v2/Calendar/Export";
export const CREATE_CALENDER = "admin/v2/Calendar/Insert";
export const EDIT_CALENDER = "admin/v2/Calendar/Edit";
export const DELETE_CALENDER = "admin/v2/Calendar/Delete";
export const EDIT_ACTIVE_CALENDER = "admin/v2/Calendar/EditActive";

export const ALL_SHIPPING_HOLIDAY = "admin/v2/ShippingCompanyHoliday/GetAll";
export const EXPORT_SHIPPING_HOLIDAY = "admin/v2/ShippingCompanyHoliday/Export";
export const DELETE_SHIPPING_HOLIDAY = "admin/v2/ShippingCompanyHoliday/Delete";
export const CREATE_SHIPPING_HOLIDAY = "admin/v2/ShippingCompanyHoliday/Insert";
export const EDIT_SHIPPING_HOLIDAY = "admin/v2/ShippingCompanyHoliday/Edit";
export const EDIT_ACTIVE_SHIPPING_HOLIDAY =
  "admin/v2/ShippingCompanyHoliday/EditActive";
export const DELETE_ALL_SHIPPING_HOLIDAY =
  "admin/v2/ShippingCompanyHoliday/DeleteAll";
export const EDIT_ACTIVE_ALL_SHIPPING_HOLIDAY =
  "admin/v2/ShippingCompanyHoliday/EditActiveAll";

export const GET_TAG_SEO = "v2/SeoTag/GetAll";
export const EXPORT_TAG_SEO = "v2/SeoTag/Export";

export const GET_SINGLE_TAG_SEO = "v2/SeoTag/Get";
export const CREATE_TAG_SEO = "v2/SeoTag/Insert";
export const EDIT_TAG_SEO = "v2/SeoTag/Edit";
export const DELETE_TAG_SEO = "v2/SeoTag/Delete";
export const EDIT_ACTIVE_TAG_SEO = "v2/SeoTag/EditActive";

export const CREATE_SEO = "v2/Seo/Patch";
export const GET_SEO = "v2/Seo/Get";

export const ALL_HEADER = "admin/v2/Header/GetAll";
export const GET_HEADER = "admin/v2/Header/Get";

export const EXPORT_HEADER = "admin/v2/Header/Export";
export const DELETE_HEADER = "admin/v2/Header/Delete";
export const CREATE_HEADER = "admin/v2/Header/Insert";
export const EDIT_HEADER = "admin/v2/Header/Edit";
export const EDIT_ACTIVE_HEADER = "admin/v2/Header/EditActive";
export const DELETE_ALL_HEADER = "admin/v2/Header/DeleteAll";
export const EDIT_ACTIVE_ALL_HEADER = "admin/v2/Header/EditActiveAll";

export const ALL_ADMIN_PERMISSIONS = "admin/v2/PermissionAdmin/GetAll";
export const GET_ADMIN_PERMISSIONS = "admin/v2/PermissionAdmin/Get";

export const EXPORT_ADMIN_PERMISSIONS = "admin/v2/PermissionAdmin/Export";
export const DELETE_ADMIN_PERMISSIONS = "admin/v2/PermissionAdmin/Delete";
export const CREATE_ADMIN_PERMISSIONS = "admin/v2/PermissionAdmin/Insert";
export const EDIT_ADMIN_PERMISSIONS = "admin/v2/PermissionAdmin/Edit";
export const EDIT_ACTIVE_ADMIN_PERMISSIONS =
  "admin/v2/PermissionAdmin/EditActive";
export const DELETE_ALL_ADMIN_PERMISSIONS =
  "admin/v2/PermissionAdmin/DeleteAll";
export const EDIT_ACTIVE_ALL_ADMIN_PERMISSIONS =
  "admin/v2/PermissionAdmin/EditActiveAll";
export const EDIT_ACTIVES_ALL_ADMIN_PERMISSIONS =
  "admin/v2/AccessPermission/ChangeActivation";
export const ALL_REDIRECT_GENRALL = "v2/RedirectUrl/GetAll";
export const EXPORT_REDIRECT_GENRALL = "v2/RedirectUrl/Export";
export const DELETE_REDIRECT_GENRALL = "v2/RedirectUrl/Delete";
export const CREATE_REDIRECT_GENRALL = "v2/RedirectUrl/Insert";
export const EDIT_REDIRECT_GENRALL = "v2/RedirectUrl/Edit";
export const EDIT_ACTIVE_REDIRECT_GENRALL = "v2/RedirectUrl/EditActive";
export const DELETE_ALL_REDIRECT_GENRALL = "v2/RedirectUrl/DeleteAll";
export const EDIT_ACTIVE_ALL_REDIRECT_GENRALL = "v2/RedirectUrl/EditActiveAll";

export const ALL_PANEL_MENU = "admin/v2/UserPanel/GetAll";
export const EXPORT_PANEL_MENU = "admin/v2/UserPanel/Export";
export const DELETE_PANEL_MENU = "admin/v2/UserPanel/Delete";
export const CREATE_PANEL_MENU = "admin/v2/UserPanel/Insert";
export const EDIT_PANEL_MENU = "admin/v2/UserPanel/Edit";
export const EDIT_ACTIVE_PANEL_MENU = "admin/v2/UserPanel/EditActive";
export const DELETE_ALL_PANEL_MENU = "admin/v2/UserPanel/DeleteAll";
export const EDIT_ACTIVE_ALL_PANEL_MENU = "admin/v2/UserPanel/EditActiveAll";

export const ALL_REPORT_SHIPPING_COST = "admin/v2/ShippingCostReport/GetAll";
export const EXPORT_REPORT_SHIPPING_COST = "admin/v2/ShippingCostReport/Export";
export const SUMMERY_REPORT_SHIPPING_COST =
  "admin/v2/ShippingCostReport/GetAllSummary";
export const EXPORT_SUMMERY_REPORT_SHIPPING_COST =
  "admin/v2/ShippingCostReport/ExportSummary";

export const ALL_TIPAX = "admin/v2/Tipax/GetAll";
export const EXPORT_TIPAX = "admin/v2/Tipax/Export";
export const TRACKING_TIPAX = "admin/v2/Tipax/BriefTrackingByOrderId";

export const DELETE_TIPAX = "admin/v2/Tipax/Delete";
export const CREATE_TIPAX = "admin/v2/Tipax/Insert";
export const EDIT_TIPAX = "admin/v2/Tipax/Edit";
export const EDIT_ACTIVE_TIPAX = "admin/v2/Tipax/EditActive";
export const DELETE_ALL_TIPAX = "admin/v2/Tipax/DeleteAll";
export const EDIT_ACTIVE_ALL_TIPAX = "admin/v2/Tipax/EditActiveAll";

export const ALL_TELEGRAM_GROUP = "v2/TelegramGroup/GetAll";
export const EXPORT_TELEGRAM_GROUP = "v2/TelegramGroup/Export";
export const DELETE_TELEGRAM_GROUP = "v2/TelegramGroup/Delete";
export const CREATE_TELEGRAM_GROUP = "v2/TelegramGroup/Insert";
export const EDIT_TELEGRAM_GROUP = "v2/TelegramGroup/Edit";
export const EDIT_ACTIVE_TELEGRAM_GROUP = "v2/TelegramGroup/EditActive";
export const DELETE_ALL_TELEGRAM_GROUP = "v2/TelegramGroup/DeleteAll";
export const EDIT_ACTIVE_ALL_TELEGRAM_GROUP = "v2/TelegramGroup/EditActiveAll";

export const GetDataToSharingBluBank =
  "admin/v2/RefahLoan/GetDataToSharingBluBank";
export const GetDataToChargeBluBank =
  "admin/v2/RefahLoan/GetDataToChargeBluBank";
export const SharingBluBankList = "admin/v2/RefahLoan/SharingBluBankList";
export const WalletChargeByBluBankList =
  "admin/v2/RefahLoan/WalletChargeByBluBankList";

export const EXPORT_Refund_REPORT = "v2/Refund/Export";
export const GET_Refund_REPORT = "v2/Refund/GetAll";
export const DELETE_REFUND_GROUP = "v2/Refund/Delete";
export const CREATE_REFUND_GROUP = "v2/Refund/Insert";
export const EDIT_REFUND_GROUP = "v2/Refund/Edit";
export const EDIT_ACTIVE_REFUND_GROUP = "v2/Refund/EditActive";
export const DELETE_ALL_REFUND_GROUP = "v2/Refund/DeleteAll";
export const EDIT_ACTIVE_ALL_REFUND_GROUP = "v2/Refund/EditActiveAll";

export const REFAH_LOAN_LOG = "admin/v2/RefahLoanLog/GetAll";

export const EXPORT_PAYMENT_RESULT_REPORT = "v2/PaymentResult/Export";
export const GET_PAYMENT_RESULT_REPORT = "v2/PaymentResult/GetAll";
export const DELETE_PAYMENT_RESULT_GROUP = "v2/PaymentResult/Delete";
export const CREATE_PAYMENT_RESULT_GROUP = "v2/PaymentResult/Insert";
export const EDIT_PAYMENT_RESULT_GROUP = "v2/PaymentResult/Edit";
export const EDIT_ACTIVE_PAYMENT_RESULT_GROUP = "v2/PaymentResult/EditActive";
export const DELETE_ALL_PAYMENT_RESULT_GROUP = "v2/PaymentResult/DeleteAll";
export const EDIT_ACTIVE_ALL_PAYMENT_RESULT_GROUP =
  "v2/PaymentResult/EditActiveAll";

export const ADMIN_PRE_FACTOR = "admin/v2/FacilityParent/AgentPreFactor";
export const CONFIRM_BLUE = "admin/v2/FacilityParent/ConfirmBluBank";
export const BLUE_CONSUME = "admin/v2/FacilityParent/balonGetConsumeCode";

export const GET_REPORT_SINGLE_LOAN = "admin/v2/SingleLoan/GetAll";
export const EXPORT_REPORT_SINGLE_LOAN = "admin/v2/SingleLoan/Export";

export const GET_AGENT_SUMMERY_SINGLE =
  "admin/v2/SingleLoanAgentTurnover/GetAllSummaries";
export const EXPORT_AGENT_SUMMERY_SINGLE =
  "admin/v2/SingleLoanAgentTurnover/GetAllSummariesExport";

export const GET_AGENT_TURNOVER_SINGLE =
  "admin/v2/SingleLoanAgentTurnover/GetAllAgentTurnovers";
export const EXPORT_AGENT_TURNOVER_SINGLE =
  "admin/v2/SingleLoanAgentTurnover/GetAllAgentTurnoversExport";

export const EXPORT_Financier = "admin/v2/Financier/Export";
export const GET_Financier = "admin/v2/Financier/GetAll";
export const DELETE_Financier = "admin/v2/Financier/Delete";
export const CREATE_Financier = "admin/v2/Financier/Insert";
export const EDIT_Financier = "admin/v2/Financier/Edit";
export const EDIT_ACTIVE_Financier = "admin/v2/Financier/EditActive";
export const DELETE_ALL_Financier = "admin/v2/Financier/DeleteAll";
export const EDIT_ACTIVE_ALL_Financier = "admin/v2/Financier/EditActiveAll";

export const GET_REFAHINSTALLMENT_REPORT =
  "admin/v2/RefahInstallment/ReportOverdueInstallments";
export const EXPORT_REFAHINSTALLMENT_REPORT =
  "admin/v2/RefahInstallment/ReportOverdueInstallmentsExport";

export const REFAHINSTALLMENT_SEND = "admin/v2/RefahInstallment/SendOverdueSms";
export const REFAHINSTALLMENT_MANUL =
  "admin/v2/RefahInstallment/ManualSettleOverDueInstallment";

export const GET_ReportFinancierInstallment =
  "admin/v2/RefahInstallment/ReportFinancierInstallment";
export const EXPORT_ReportFinancierInstallment =
  "admin/v2/RefahInstallment/ReportFinancierInstallmentExport";

export const GET_ReportOverdueInstallmentsBasedOnFinancier =
  "admin/v2/RefahInstallment/ReportOverdueInstallmentsBasedOnFinancier";
export const EXPORT_ReportOverdueInstallmentsBasedOnFinancier =
  "admin/v2/RefahInstallment/ReportOverdueInstallmentsBasedOnFinancierExport";
export const REFAHINSTALLMENT_UPDATE_ALL =
  "admin/v2/RefahInstallment/updateAll";

export const GET_REPORT_INSTALLMENT_SUMMERY =
  "admin/v2/RefahInstallment/ReportOverdueInstallmentsSummary";
export const EXPORT_REPORT_INSTALLMENT_SUMMERY =
  "admin/v2/RefahInstallment/ReportOverdueInstallmentsSummaryExport";

export const EXPORT_USER_LOAN_REQUEST = "v2/UserLoanRequest/Export";
export const GET_USER_LOAN_REQUEST = "v2/UserLoanRequest/GetAll";
export const DELETE_USER_LOAN_REQUEST = "v2/UserLoanRequest/Delete";
export const CREATE_USER_LOAN_REQUEST = "v2/UserLoanRequest/Insert";
export const EDIT_USER_LOAN_REQUEST = "v2/UserLoanRequest/Edit";
export const EDIT_ACTIVE_USER_LOAN_REQUEST = "v2/UserLoanRequest/EditActive";
export const DELETE_ALL_USER_LOAN_REQUEST = "v2/UserLoanRequest/DeleteAll";
export const EDIT_ACTIVE_ALL_USER_LOAN_REQUEST =
  "v2/UserLoanRequest/EditActiveAll";

export const EXPORT_REPORT_DEPOT = "admin/v2/Report/ReportProductDepotExport";
export const GET_REPORT_DEPOT = "admin/v2/Report/ReportProductDepot";
export const SHOW_MAP_SETTING = "admin/v2/Setting/EditShowMapInFront";
export const SHOW_ROBOTS_SETTING = "admin/v2/Setting/EditRobotNoIndex";
export const CHANGE_CATELOGE_WEBSITE =
  "admin/v2/Setting/ChangeCatalogModeState";
export const EXPORT_REFERRAL_REPORT =
  "admin/v2/Report/ReportReferralOrdersExport";
export const GET_REFERRAL_REPORT = "admin/v2/Report/ReportReferralOrders";
export const ALL_ENUM = "admin/v2/Enum/GetAll";
export const CHANGE_SHOW_UNAVILABLE_PRODUCTS =
  "admin/v2/Setting/EditShowUnavailableProducts";
export const EXPORT_ENUM = "admin/v2/Enum/Export";
export const DELETE_ENUM = "admin/v2/Enum/Delete";
export const CREATE_ENUM = "admin/v2/Enum/Insert";
export const EDIT_ENUM = "admin/v2/Enum/Edit";
export const EDIT_ACTIVE_ENUM = "admin/v2/Enum/EditActive";
export const DELETE_ALL_ENUM = "admin/v2/Enum/DeleteAll";
export const EDIT_ACTIVE_ALL_ENUM = "admin/v2/Enum/EditActiveAll";
export const SYNC_ALL_ENUM = "admin/v2/Setting/SyncHeaderEnumSearch";

export const ALL_DEPARTMENT = "admin/v2/Department/GetAll";

export const EXPORT_DEPARTMENT = "admin/v2/Department/Export";
export const DELETE_DEPARTMENT = "admin/v2/Department/Delete";
export const CREATE_DEPARTMENT = "admin/v2/Department/Insert";
export const EDIT_DEPARTMENT = "admin/v2/Department/Edit";
export const EDIT_ACTIVE_DEPARTMENT = "admin/v2/Department/EditActive";
export const DELETE_ALL_DEPARTMENT = "admin/v2/Department/DeleteAll";
export const EDIT_ACTIVE_ALL_DEPARTMENT = "admin/v2/Department/EditActiveAll";

export const GET_CUSTOMER_CSS = "admin/v2/Setting/GetCustomCssContent";
export const EDIT_CUSTOMER_CSS = "admin/v2/Setting/EditCustomCssFile";

export const GET_FINNOTECH_COMPANYINFO = "v2/Finnotech/GetCompanyInfo";
export const CHECK_FINNOTECH_ACTIVE = "v2/Finnotech/CheckFinnotechIsActive";
export const CHECK_FINNOTECH_ACTIVE_FOR_USER =
  "v2/Finnotech/CheckFinnotechIsActiveForUser";
export const CHANGE_FINNOTECH_ACTIVE =
  "admin/v2/Finnotech/ChangeFinnotechActiveStatus";
export const CHANGE_FINNOTECH_ACTIVE_USER =
  "admin/v2/Finnotech/ChangeFinnotechActiveStatusForUser";
export const GET_CITY = "admin/v2/City/GetAll";
export const EXPORT_CITY = "admin/v2/City/Export";
export const DELETE_CITY = "admin/v2/City/Delete";
export const CREATE_CITY = "admin/v2/City/Insert";
export const EDIT_CITY = "admin/v2/City/Edit";
export const EDIT_ACTIVE_CITY = "admin/v2/City/EditActive";
export const DELETE_ALL_CITY = "admin/v2/City/DeleteAll";
export const EDIT_ACTIVE_ALL_CITY = "admin/v2/City/EditActiveAll";
export const GET_CITY_FROM_LAT = "admin/v2/Tipax/GetCityFromLanLat";

export const ALL_BANNER = "v2/Banner/GetAll";
export const EXPORT_BANNER = "v2/Banner/Export";
export const DELETE_BANNER = "v2/Banner/Delete";
export const CREATE_BANNER = "v2/Banner/Insert";
export const EDIT_BANNER = "v2/Banner/Edit";
export const EDIT_ACTIVE_BANNER = "v2/Banner/EditActive";
export const DELETE_ALL_BANNER = "v2/Banner/DeleteAll";
export const EDIT_ACTIVE_ALL_BANNER = "v2/Banner/EditActiveAll";

export const ALL_SCRIPTS = "v2/Script/GetAll";
export const EXPORT_SCRIPTS = "v2/Script/Export";
export const DELETE_SCRIPTS = "v2/Script/Delete";
export const CREATE_SCRIPTS = "v2/Script/Insert";
export const EDIT_SCRIPTS = "v2/Script/Edit";
export const EDIT_ACTIVE_SCRIPTS = "v2/Script/EditActive";
export const DELETE_ALL_SCRIPTS = "v2/Script/DeleteAll";
export const EDIT_ACTIVE_ALL_SCRIPTS = "v2/Script/EditActiveAll";

export const ALL_STATIC_PAGES = "v2/StaticPage/GetAll";
export const EXPORT_STATIC_PAGES = "v2/StaticPage/Export";
export const DELETE_STATIC_PAGES = "v2/StaticPage/Delete";
export const CREATE_STATIC_PAGES = "v2/StaticPage/Insert";
export const EDIT_STATIC_PAGES = "v2/StaticPage/Edit";
export const EDIT_ACTIVE_STATIC_PAGES = "v2/StaticPage/EditActive";
export const DELETE_ALL_STATIC_PAGES = "v2/StaticPage/DeleteAll";
export const EDIT_ACTIVE_ALL_STATIC_PAGES = "v2/StaticPage/EditActiveAll";

export const CHECK_FINNO_TECH_FOR_USER =
  "v2/Finnotech/CheckFinnotechPersonVerifyIsActive";
export const CHECK_FINNO_TECH_FOR_FRONT =
  "v2/Finnotech/CheckFinnotechPersonVerifyIsActiveForUser";
export const CHANGE_FINNO_TECH_FOR_USER =
  "admin/v2/finnotech/ChangeFinnotechPersonVerifyActiveStatus";
export const CHANGE_FINNO_TECH_FOR_FRONT =
  "admin/v2/finnotech/ChangeFinnotechPersonVerifyActiveStatusForUser";
export const VERIFY_FINNOTECH = "v2/finnotech/VerifyPerson";

export const ALL_GUARANTOR = "admin/v2/Guarantor/GetAll";
export const EXPORT_GUARANTOR = "admin/v2/Guarantor/Export";
export const DELETE_GUARANTOR = "admin/v2/Guarantor/Delete";
export const CREATE_GUARANTOR = "admin/v2/Guarantor/Insert";
export const EDIT_GUARANTOR = "admin/v2/Guarantor/Edit";
export const EDIT_ACTIVE_GUARANTOR = "admin/v2/Guarantor/EditActive";
export const DELETE_ALL_GUARANTOR = "admin/v2/Guarantor/DeleteAll";
export const EDIT_ACTIVE_ALL_GUARANTOR = "admin/v2/Guarantor/EditActiveAll";

export const ALL_WHITE_LIST_USER = "admin/v2/WhiteListUser/GetAllByGuarantor";
export const EXPORT_WHITE_LIST_USER = "admin/v2/WhiteListUser/Export";
export const DELETE_WHITE_LIST_USER = "admin/v2/WhiteListUser/Delete";
export const CREATE_WHITE_LIST_USER = "admin/v2/WhiteListUser/Insert";
export const EDIT_WHITE_LIST_USER = "admin/v2/WhiteListUser/Edit";
export const EDIT_ACTIVE_WHITE_LIST_USER = "admin/v2/WhiteListUser/EditActive";
export const DELETE_ALL_WHITE_LIST_USER = "admin/v2/WhiteListUser/DeleteAll";
export const EDIT_ACTIVE_ALL_WHITE_LIST_USER =
  "admin/v2/WhiteListUser/EditActiveAll";
export const INSET_IMAGE_WHITE_LIST_USER =
  "admin/v2/WhiteListUser/InsertGallery";
export const REMOVE_IMAGE_WHITE_LIST_USER =
  "admin/v2/WhiteListUser/RemoveGallery";
export const GET_WHITE_LIST_USER = "admin/v2/WhiteListUser/Get";
export const IMPORT_FROM_EXCEL_WHILTE_LIST_USER =
  "admin/v2/WhiteListUser/Import";

export const REMOVE_STATIC_DATA_CACHE =
  "admin/v2/Setting/RemoveStaticDataCache";

export const ALL_WHITE_LIST_HISTORY =
  "admin/v2/WhiteListHistory/GetAllForWhiteListUser";
export const EXPORT_WHITE_LIST_HISTORY = "admin/v2/WhiteListHistory/Export";
export const DELETE_WHITE_LIST_HISTORY = "admin/v2/WhiteListHistory/Delete";
export const CREATE_WHITE_LIST_HISTORY = "admin/v2/WhiteListHistory/Insert";
export const EDIT_WHITE_LIST_HISTORY = "admin/v2/WhiteListHistory/Edit";
export const EDIT_ACTIVE_WHITE_LIST_HISTORY =
  "admin/v2/WhiteListHistory/EditActive";
export const DELETE_ALL_WHITE_LIST_HISTORY =
  "admin/v2/WhiteListHistory/DeleteAll";
export const EDIT_ACTIVE_ALL_WHITE_LIST_HISTORY =
  "admin/v2/WhiteListHistory/EditActiveAll";
export const GET_SMS_PROVIDERS = "admin/v2/SMS/GetAllProvider";
export const CHECK_USER_CREDIT = "admin/v2/Facility/CheckUserCredit";
export const ALL_SMS_PROVIDER = "admin/v2/SMSProvider/GetAll";
export const EXPORT_SMS_PROVIDER = "admin/v2/SMSProvider/Export";
export const DELETE_SMS_PROVIDER = "admin/v2/SMSProvider/Delete";
export const CREATE_SMS_PROVIDER = "admin/v2/SMSProvider/Insert";
export const EDIT_SMS_PROVIDER = "admin/v2/SMSProvider/Edit";
export const EDIT_ACTIVE_SMS_PROVIDER =
  "admin/v2/SMSProvider/ChangeServiceActive";
export const DELETE_ALL_SMS_PROVIDER = "admin/v2/SMSProvider/DeleteAll";
export const EDIT_ACTIVE_ALL_SMS_PROVIDER =
  "admin/v2/SMSProvider/EditActiveAll";

export const ALL_ACCOUNTING_PAGES = "admin/v2/Accounting/GetAll";
export const GET_ACCOUNTING_PAGES = "admin/v2/Accounting/Get";

export const EXPORT_ACCOUNTING_PAGES = "admin/v2/Accounting/Export";
export const DELETE_ACCOUNTING_PAGES = "admin/v2/Accounting/Delete";
export const CREATE_ACCOUNTING_PAGES = "admin/v2/Accounting/Insert";
export const EDIT_ACCOUNTING_PAGES = "admin/v2/Accounting/Edit";
export const EDIT_ACTIVE_ACCOUNTING_PAGES = "admin/v2/Accounting/EditActive";
export const DELETE_ALL_ACCOUNTING_PAGES = "admin/v2/Accounting/DeleteAll";
export const EDIT_ACTIVE_ALL_ACCOUNTING_PAGES =
  "admin/v2/Accounting/EditActiveAll";
export const SYNC_ACCOUNTING_PAGES = "admin/v2/Accounting/SyncAccounting";
export const SYNC_PRODUCTS = "admin/v2/AccountingProduct/SyncProduct";
export const EDIT_ACCOUNTING_BRAND_TO_CATEGORY_PAGES =
  "admin/v2/Accounting/SwitchBrandToCategory";
export const GET_ACCOUNTIG_SETTING =
  "admin/v2/Accounting/GetAccountingSyncSetting";
export const GET_ACCOUNTIG_SETTING_STATUS =
  "admin/v2/Accounting/GetAccountingSyncStatus";
export const ADD_ACCOUNTIG_SETTING =
  "admin/v2/Accounting/AddAccountingSyncSetting";
export const UPDATE_ACCOUNTIG_SETTING =
  "admin/v2/Accounting/UpdateAccountingSyncSetting";
export const CHANGE_QTY_ACCOUNTIG_SETTING =
  "admin/v2/Accounting/ChangeQtySyncActive";
export const CHANGE_PRICE_ACCOUNTIG_SETTING =
  "admin/v2/Accounting/ChangePriceSyncActive";
export const ALL_USER_GROUP = "admin/v2/UserGroup/GetAll";
export const EXPORT_USER_GROUP = "admin/v2/UserGroup/Export";
export const DELETE_USER_GROUP = "admin/v2/UserGroup/Delete";
export const CREATE_USER_GROUP = "admin/v2/UserGroup/Insert";
export const EDIT_USER_GROUP = "admin/v2/UserGroup/Edit";
export const EDIT_ACTIVE_USER_GROUP = "admin/v2/UserGroup/EditActive";
export const DELETE_ALL_USER_GROUP = "admin/v2/UserGroup/DeleteAll";
export const EDIT_ACTIVE_ALL_USER_GROUP = "admin/v2/UserGroup/EditActiveAll";

export const EXPORT_REPORT_LOAN_USER =
  "admin/v2/Report/ReportLoanDetailByUserExport";
export const GET_REPORT_LOAN_USER = "admin/v2/Report/ReportLoanDetailByUser";

export const EXPORT_REPORT_LOAN_AGENT =
  "admin/v2/Report/ReportLoanDetailByAgentExport";
export const GET_REPORT_LOAN_AGENT = "admin/v2/Report/ReportLoanDetailByAgent";
export const DELETE_DEPOT = "admin/v2/Depot/DeleteFirstLastMonth";

export const ALL_ACCOUNTING_LOGS = "admin/v2/AccountingProduct/GetSyncLogError";
export const EXPORT_ACCOUNTING_LOGS =
  "admin/v2/AccountingProduct/ExportSyncLogError";
export const DELETE_ACCOUNTING_LOGS =
  "admin/v2/AccountingProduct/DeleteSyncLogError";

export const GET_WEBSITE_SETTING = "admin/v2/WebSiteKeySetting/GetAll";
export const EXPORT_WEBSITE_SETTING = "admin/v2/WebSiteKeySetting/Export";
export const GET_SINGLE_WEBSITE_SETTING = "admin/v2/WebSiteKeySetting/Get";
export const CREATE_WEBSITE_SETTING = "admin/v2/WebSiteKeySetting/Insert";
export const EDIT_WEBSITE_SETTING = "admin/v2/WebSiteKeySetting/Edit";
export const DELETE_WEBSITE_SETTING = "admin/v2/WebSiteKeySetting/Delete";
export const EDIT_ACTIVE_WEBSITE_SETTING =
  "admin/v2/WebSiteKeySetting/EditActive";

export const PAY_ORDER = "admin/v2/AgentLoan/Checkout";
export const EDIT_REFAHLOAN_REF =
  "admin/v2/RefahLoan/UpdateApplicationRefForBlue";

export const GET_AGENT_WALLET =
  "admin/v2/AgentTurnover/GetAllAgentWalletRequest";
export const EXPORT_AGENT_WALLET =
  "admin/v2/AgentTurnover/GetAllAgentWalletRequestExport";

export const GET_AGENT_WALLET_DETAIL =
  "admin/v2/AgentTurnover/GetAgentWalletRequestDetail";
export const EXPORT_AGENT_WALLET_DETAIL =
  "admin/v2/AgentTurnover/GetAgentWalletRequestDetailExport";

export const GET_SITE_ADDRESS = "admin/v2/CompanyAddress/GetAll";
export const EXPORT_SITE_ADDRESS = "admin/v2/CompanyAddress/Export";
export const CREATE_SITE_ADDRESS = "admin/v2/CompanyAddress/Insert";
export const EDIT_SITE_ADDRESS = "admin/v2/CompanyAddress/Edit";
export const DELETE_SITE_ADDRESS = "admin/v2/CompanyAddress/Delete";
export const EDIT_ACTIVE_SITE_ADDRESS = "admin/v2/CompanyAddress/EditActive";
export const DELETE_ALL_SITE_ADDRESS = "admin/v2/CompanyAddress/DeleteAll";
export const EDIT_ACTIVE_ALL_SITE_ADDRESS =
  "admin/v2/CompanyAddress/EditActiveAll";

export const ALL_SERVICE_TYPE = "v2/ServiceType/GetAll";
export const EXPORT_SERVICE_TYPE = "v2/ServiceType/Export";
export const DELETE_SERVICE_TYPE = "v2/ServiceType/Delete";
export const CREATE_SERVICE_TYPE = "v2/ServiceType/Insert";
export const EDIT_SERVICE_TYPE = "v2/ServiceType/Edit";
export const EDIT_ACTIVE_SERVICE_TYPE = "v2/ServiceType/EditActive";
export const DELETE_ALL_SERVICE_TYPE = "v2/ServiceType/DeleteAll";
export const EDIT_ACTIVE_ALL_SERVICE_TYPE = "v2/ServiceType/EditActiveAll";
export const GET_SETTING_TELEGRAM = "admin/v2/Setting/EditTelegramActive";
export const GET_SETTING_SYNC_PRODUCT =
  "admin/v2/Setting/EditSyncProductSetting";

export const ALL_GATEWAY_DEFUALT_SETTING =
  "admin/v2/GatewayDefultSettings/GetAll";
export const EXPORT_GATEWAY_DEFUALT_SETTING =
  "admin/v2/GatewayDefultSettings/Export";
export const DELETE_GATEWAY_DEFUALT_SETTING =
  "admin/v2/GatewayDefultSettings/Delete";
export const CREATE_GATEWAY_DEFUALT_SETTING =
  "admin/v2/GatewayDefultSettings/Insert";
export const EDIT_GATEWAY_DEFUALT_SETTING =
  "admin/v2/GatewayDefultSettings/Edit";
export const EDIT_ACTIVE_GATEWAY_DEFUALT_SETTING =
  "admin/v2/GatewayDefultSettings/EditActive";
export const DELETE_ALL_GATEWAY_DEFUALT_SETTING =
  "admin/v2/GatewayDefultSettings/DeleteAll";
export const EDIT_ACTIVE_ALL_GATEWAY_DEFUALT_SETTING =
  "admin/v2/GatewayDefultSettings/EditActiveAll";
