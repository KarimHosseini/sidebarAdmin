/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import { useParams, useSearchParams } from "react-router-dom";
import CustomePage from "../../components/customePage";
import {
  EDIT_ACTIVE_BANK_BRANCH,
  EXPORT_BANK_BRANCH,
  GET_BANK_BRANCH,
  CREATE_BANK_BRANCH,
  EDIT_BANK_BRANCH,
  DELETE_BANK_BRANCH,
} from "../../helpers/api-routes";

const BankBranch = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const bankName = searchParams.get("name");

  // Define form fields for the bank branch form
  const bankBranchFields = [ 
    {
      name: 'title',
      label: 'نام شعبه',
      type: 'textInput',
      required: true
    },
    {
      name: 'code',
      label: 'کد شعبه',
      type: 'textInput',
      required: true
    },
    {
      name: 'wage',
      label: 'کارمزد',
      type: 'number',
      required: false,
      defaultValue: 0
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
  const bankBranchApis = {
    GET_DATA: GET_BANK_BRANCH,
    EXPORT_DATA: EXPORT_BANK_BRANCH,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_BANK_BRANCH,
    CREATE_DATA: CREATE_BANK_BRANCH,
    EDIT_DATA: EDIT_BANK_BRANCH,
    DELETE_DATA: DELETE_BANK_BRANCH,
    initialFilter: [
      {
        name: "bankId",
        value: id,
        type: "eq",
      }
    ],
  };

  return (
    <CustomePage
      apis={bankBranchApis}
      title={`شعبه بانک ${bankName || ''}`}
      canAdd={true}
      canEdit={true}
      permissionsTag="bankBranch"
      customeModal={false}
      feilds={bankBranchFields}
      broadCrumb={[
        {
          title: "مدیریت تسهیلات",
          path: "/plan-loan",
        },
        {
          title: " بانک ها",
          path: "/banks",
        },
      ]}
      defaultSelected={[]}
      neededFields={[]}
      extraActions={[]}
      extraButtons={<></>}
    />
  );
};

export default BankBranch;
