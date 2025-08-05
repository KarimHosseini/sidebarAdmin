import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_BANNER,
  CREATE_BANNER,
  DELETE_ALL_BANNER,
  DELETE_BANNER,
  EDIT_ACTIVE_ALL_BANNER,
  EDIT_ACTIVE_BANNER,
  EDIT_BANNER,
  EXPORT_BANNER,
} from "../../helpers/api-routes";

const LINK_TYPE = [
  {
    id: 1,
    title: "برای موبایل",
  },
  {
    id: 2,
    title: "برای دسکتاپ",
  },
];

const MODULE = [
  {
    id: 1,
    title: "پرداخت موفق در صفحه برگشت بانک",
  },
  {
    id: 2,
    title: "پرداخت ناموفق در صفحه برگشت بانک",
  },
  {
    id: 3,
    title: "    بنر تبلیغاتی صفحه محصول",
  },
  {
    id: 4,
    title: "    سرچ باکس",
  },
  {
    id: 5,
    title: "    صفحه 500",
  },
  {
    id: 6,
    title: "    صفحه 502",
  },
  {
    id: 7,
    title: "    صفحه 410",
  },
  {
    id: 8,
    title: "    صفحه 404",
  },
];

const Banner = () => {
  const { categories, brands } = useSelector((state) => state.relationals);

  // Define form fields for the banner form
  const bannerFields = [
    {
      name: "title",
      label: "نام",
      type: "textInput",
      required: true,
    },
    {
      name: "link",
      label: "لینک",
      type: "textInput",
      required: true,
      props: {
        ltr: true,
      },
    },
    {
      name: "description",
      label: "توضیحات",
      type: "textInput",
      required: false,
    },
    {
      name: "linkType",
      label: "محل قرار گیری عکس",
      type: "dropdown",
      required: false,
      options: LINK_TYPE,
    },
    {
      name: "moduleNumber",
      label: "نمایش در",
      type: "dropdown",
      required: false,
      options: MODULE,
    },
    {
      name: "categoryId",
      label: "دسته بندی",
      type: "dropdown",
      required: false,
      options: [{ id: null, title: "بدون دسته بندی" }, ...(categories || [])],
    },
    {
      name: "brandId",
      label: "برند",
      type: "dropdown",
      required: false,
      options: [{ id: null, title: "بدون برند" }, ...(brands || [])],
    },
    {
      name: "avatar",
      label: "تصویر بنر",
      type: "uploader",
      required: false,
    },
  ];

  // Define APIs for CRUD operations
  const bannerApis = {
    GET_DATA: ALL_BANNER,
    EXPORT_DATA: EXPORT_BANNER,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_BANNER,
    CREATE_DATA: CREATE_BANNER,
    EDIT_DATA: EDIT_BANNER,
    DELETE_DATA: DELETE_BANNER,
    DELETE_ALL_DATA: DELETE_ALL_BANNER,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_BANNER,
  };

  return (
    <CustomePage
      apis={bannerApis}
      title="بنر"
      canAdd={true}
      canEdit={true}
      permissionsTag="banner"
      customeModal={false}
      feilds={bannerFields}
      broadCrumb={[
        {
          title: "مدیریت سایت",
          path: "/site",
        },
      ]}
    />
  );
};

export default Banner;
