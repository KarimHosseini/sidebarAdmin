/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_USER_GROUP,
  DELETE_ALL_USER_GROUP,
  EDIT_ACTIVE_ALL_USER_GROUP,
  EDIT_ACTIVE_USER_GROUP,
  EXPORT_USER_GROUP,
  CREATE_USER_GROUP,
  EDIT_USER_GROUP,
  DELETE_USER_GROUP,
} from "../../helpers/api-routes";

const GroupUser = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  // Define form fields for the groupUser form
  const groupUserFields = [
    {
      name: 'title',
      label: 'عنوان',
      type: 'textInput',
      required: true
    },
    {
      name: 'description',
      label: 'توضیحات',
      type: 'textInput',
      required: false
    }
  ];

  // Define APIs for CRUD operations
  const groupUserApis = {
    GET_DATA: ALL_USER_GROUP,
    EXPORT_DATA: EXPORT_USER_GROUP,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_USER_GROUP,
    DELETE_ALL_DATA: DELETE_ALL_USER_GROUP,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_USER_GROUP,
    CREATE_DATA: CREATE_USER_GROUP,
    EDIT_DATA: EDIT_USER_GROUP,
    DELETE_DATA: DELETE_USER_GROUP,
  };

  return (
    <CustomePage
      apis={groupUserApis}
      title="گروه کاربر"
      canAdd={true}
      canEdit={true}
      permissionsTag="groupUser"
      customeModal={false}
      feilds={groupUserFields}
      broadCrumb={[
        {
          title: "کاربران",
          path: "/users",
        },
      ]}
    />
  );
};

export default GroupUser;
