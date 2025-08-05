/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  CREATE_WORK,
  DELETE_WORK,
  EDIT_WORK,
  EXPORT_works,
  works,
} from "../../helpers/api-routes";

const Works = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define form fields for the works form
  const worksFields = [
    {
      name: "title",
      label: "عنوان کار",
      type: "textInput",
      required: true,
    },
    {
      name: "description",
      label: "توضیحات",
      type: "textInput",
      required: false,
      props: {
        multiline: true,
        rows: 4,
      },
    },
    {
      name: "client",
      label: "نام کارفرما",
      type: "textInput",
      required: false,
    },
    {
      name: "url",
      label: "لینک پروژه",
      type: "textInput",
      required: false,
      props: {
        dir: "ltr",
      },
    },
    {
      name: "image",
      label: "تصویر پروژه",
      type: "uploader",
      required: false,
    },
    {
      name: "order",
      label: "ترتیب نمایش",
      type: "numberInput",
      required: false,
      defaultValue: 0,
    },
    {
      name: "active",
      label: "فعال/غیرفعال",
      type: "switch",
      required: false,
      defaultValue: true,
    },
  ];

  // Define APIs for CRUD operations
  const worksApis = {
    GET_DATA: works,
    EXPORT_DATA: EXPORT_works,
    EDIT_ACTIVE_WOR: CREATE_WORK,
    EDIT_DATA: EDIT_WORK,
    DELETE_DATA: DELETE_WORK,
  };

  return (
    <CustomePage
      apis={worksApis}
      title="نمونه کارها"
      canAdd={true}
      canEdit={true}
      permissionsTag="works"
      customeModal={false}
      feilds={worksFields}
      broadCrumb={[
        {
          title: "تنظیمات",
          path: "/companyInfo",
        },
      ]}
    />
  );
};

export default Works;
