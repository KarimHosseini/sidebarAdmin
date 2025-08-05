import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  ATTR_GROUPS,
  ATTRIBUTES,
  baseUrl,
  CREATE_ATTR,
  DELETE_ATTR,
  EDIT_ACTIVE_ATTR,
  EDIT_ATTR,
  EXPORT_ATTRIBUTES,
} from "../../helpers/api-routes";
import { productsPropertiesTypes } from "../../helpers/constants";
import { configReq } from "../../helpers/functions";

const Attributes = () => {
  const [attrGroups, setAttrGroups] = useState([]);
  const { token } = useSelector((state) => state.user);

  const attributesFields = [
    {
      name: "title",
      label: "نام",
      type: "textInput",
      required: true,
    },
    {
      name: "name",
      label: "به انگلیسی",
      type: "textInput",
      required: true,
      props: {
        ltr: true,
      },
    },

    {
      name: "type",
      label: "انتخاب نوع مقادیر",
      type: "dropdown",
      required: false,
      options: productsPropertiesTypes,
    },
    {
      name: "moduleNumber",
      label: "انتخاب دسته بندی ویژگی",
      type: "groupId",
      required: false,
      options: [
        {
          title: "بدون دسته",
        },
        ...attrGroups,
      ],
    },
    {
      name: "showInProduct",
      label: "نمایش در مشخصات",
      type: "switch",
      required: false,
      defaultValue: true,
    },
    {
      name: "showInShop",
      label: "نمایش در فروشگاه",
      type: "switch",
      required: false,
      defaultValue: true,
    },
    {
      name: "avatar",
      label: "تصویر",
      type: "uploader",
      required: false,
    },
  ];
  useEffect(() => {
    axiosInstance(`${baseUrl}/${ATTR_GROUPS}?Limit=2000`, configReq(token))
      .then((res) => {
        const { data } = res;
        if (data.code === 200) {
          setAttrGroups(data.data);
        }
      })
      .catch((err) => {});
  }, []);

  // Define APIs for CRUD operations
  const attributesApis = {
    GET_DATA: ATTRIBUTES,
    EXPORT_DATA: EXPORT_ATTRIBUTES,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_ATTR,
    CREATE_DATA: CREATE_ATTR,
    EDIT_DATA: EDIT_ATTR,
    DELETE_DATA: DELETE_ATTR,
  };

  return (
    <CustomePage
      apis={attributesApis}
      title="ویژگی ها"
      canAdd={true}
      canEdit={true}
      permissionsTag="attributes"
      customeModal={false}
      feilds={attributesFields}
      broadCrumb={[
        {
          title: "مدیریت محصولات",
          path: "/products",
        },
      ]}
    />
  );
};

export default Attributes;
