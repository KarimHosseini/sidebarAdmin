/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CustomePage from "../../components/customePage";
import {
  EDIT_ACTIVE_BANK,
  EXPORT_BANK,
  GET_BANK,
  CREATE_BANK,
  EDIT_BANK,
  DELETE_BANK,
} from "../../helpers/api-routes";
import { getWay } from "../../helpers/constants";

const Banks = () => {
  const navigate = useNavigate();

  // Define form fields for the bank form
  const bankFields = [
    {
      name: 'title',
      label: 'نام بانک',
      type: 'textInput',
      required: true
    },
    {
      name: 'gate',
      label: 'نام درگاه',
      type: 'dropdown',
      required: false,
      options: getWay.map(item => ({
        id: item.value,
        key: item.value,
        title: item.title
      })),
      props: {
        emptyValue: true
      }
    },
    {
      name: 'active',
      label: 'فعال/غیرفعال',
      type: 'switch',
      required: false,
      defaultValue: true
    }
  ];

  // Define APIs for CRUD operations
  const bankApis = {
    GET_DATA: GET_BANK,
    EXPORT_DATA: EXPORT_BANK,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_BANK,
    CREATE_DATA: CREATE_BANK,
    EDIT_DATA: EDIT_BANK,
    DELETE_DATA: DELETE_BANK,
  };

  return (
    <CustomePage
      apis={bankApis}
      title="بانک"
      canAdd={true}
      canEdit={true}
      permissionsTag="bank"
      customeModal={false}
      feilds={bankFields}
      broadCrumb={[
        {
          title: "مدیریت تسهیلات",
          path: "/plan-loan",
        },
      ]}
      extraActions={[
        {
          title: "مشاهده شعبه ها",
          handler: (rowData) => {
            const data = rowData?.id ? rowData : null;
            if (data) {
              navigate(`/bankBranch/${data.id}?name=${data.title}`);
            }
          },
          permissions: ['bankBranch.view'],
        }
      ]}
    />
  );
};

export default Banks;
