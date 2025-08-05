/* eslint-disable react-hooks/exhaustive-deps */
import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal } from "../../components/common";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  ALL_ENUM,
  baseUrl,
  DELETE_ALL_ENUM,
  EDIT_ACTIVE_ALL_ENUM,
  EDIT_ACTIVE_ENUM,
  EXPORT_ENUM,
  SYNC_ALL_ENUM,
  CREATE_ENUM,
  EDIT_ENUM,
  DELETE_ENUM,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const Enums = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  const [refreshData, setRefresh] = useState(0);

  // Define form fields for the enum form
  const enumFields = [
    {
      name: 'id',
      label: 'آی دی',
      type: 'textInput',
      required: false
    },
    {
      name: 'tableName',
      label: 'نام تیبل',
      type: 'textInput',
      required: false
    },
    {
      name: 'fieldName',
      label: 'نام فیلد',
      type: 'textInput',
      required: false
    },
    {
      name: 'title',
      label: 'عنوان',
      type: 'textInput',
      required: false
    },
    {
      name: 'value',
      label: 'مقدار',
      type: 'textInput',
      required: false
    },
    {
      name: 'style',
      label: 'استایل',
      type: 'textInput',
      required: false
    },
    {
      name: 'styleDark',
      label: 'استایل دارک',
      type: 'textInput',
      required: false
    },
    {
      name: 'columnOrder',
      label: 'اولویت ستون',
      type: 'textInput',
      required: false
    },
    {
      name: 'rowOrder',
      label: 'اولویت سطر',
      type: 'textInput',
      required: false
    },
    {
      name: 'visible',
      label: 'نمایش',
      type: 'switch',
      required: false,
      defaultValue: false
    }
  ];

  // Define APIs for CRUD operations
  const enumApis = {
    GET_DATA: ALL_ENUM,
    EXPORT_DATA: EXPORT_ENUM,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_ENUM,
    DELETE_ALL_DATA: DELETE_ALL_ENUM,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_ENUM,
    CREATE_DATA: CREATE_ENUM,
    EDIT_DATA: EDIT_ENUM,
    DELETE_DATA: DELETE_ENUM,
  };

  const handleSync = () => {
    setLoadingSync(true);
    axiosInstance
      .get(`${baseUrl}/${SYNC_ALL_ENUM}`, configReq(token))
      .then((res) => {
        setRefresh((r) => r + 1);
        setLoadingSync(false);
        setOpen(false);
        toast.success("با موفقیت اعمال شد");
      })
      .catch((err) => {
        setLoadingSync(false);
        toast.error(err.response?.data?.message);
      });
  };

  const extraButtons = (
    <>
      {userPermissions?.enum?.sync && (
        <Button onClick={() => setOpen(true)} variant="contained" color="info">
          همگام سازی
        </Button>
      )}
    </>
  );

  return (
    <>
      <CustomePage
        apis={enumApis}
        title="اینام های دیتابیس"
        canAdd={true}
        canEdit={true}
        permissionsTag="enum"
        customeModal={false}
        feilds={enumFields}
        broadCrumb={[
          {
            title: "تنظیمات",
            path: "/companyInfo",
          },
        ]}
        extraButtons={extraButtons}
        key={`enum-page-${refreshData}`}
      />
      
      <Modal
        open={open}
        close={() => setOpen(false)}
        title="همگام سازی"
      >
        <div className="text-center">
          <p className="mb-4">آیا از همگام سازی اینام ها اطمینان دارید؟</p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSync}
              disabled={loadingSync}
            >
              {loadingSync ? <CircularProgress size={20} /> : "تایید"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpen(false)}
            >
              انصراف
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Enums;
