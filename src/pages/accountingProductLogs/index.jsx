import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { Confirm } from "../../components/modals";
import {
  ALL_ACCOUNTING_LOGS,
  baseUrl,
  DELETE_ACCOUNTING_LOGS,
  EXPORT_ACCOUNTING_LOGS,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const AccountingLogs = () => {
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [openDelete, setOpenDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Delete all logs function
  const deleteLogs = async () => {
    setLoadingDelete(true);
    try {
      await axiosInstance.delete(
        `${baseUrl}/${DELETE_ACCOUNTING_LOGS}`,
        configReq(token)
      );
      toast.success("لاگ ها با موفقیت پاک شدند");
      setOpenDelete(false);
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "خطا در پاک کردن لاگ ها");
    } finally {
      setLoadingDelete(false);
    }
  };

  // Define APIs for read-only operations
  const accountingLogsApis = {
    GET_DATA: ALL_ACCOUNTING_LOGS,
    EXPORT_DATA: EXPORT_ACCOUNTING_LOGS,
    // No CREATE, EDIT, DELETE operations for logs
  };

  // Custom button for deleting all logs
  const extraButtons = (
    <>
      {userPermissions?.accountingProductSyncLogError?.delete && (
        <Button
          onClick={() => setOpenDelete(true)}
          variant="contained"
          color="error"
        >
          پاک کردن لاگ ها
        </Button>
      )}
      <Confirm
        message="آیا از پاک کردن لاگ ها اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteLogs}
        type="error"
        open={openDelete}
        loading={loadingDelete}
      />
    </>
  );

  return (
    <CustomePage
      apis={accountingLogsApis}
      title="لاگ خطای سینک حسابداری"
      canAdd={false}
      canEdit={false}
      permissionsTag="accountingProductSyncLogError"
      customeModal={false}
      feilds={[]} // No form fields for logs
      broadCrumb={[
        {
          title: "حسابداری",
          path: "/accounting",
        },
      ]}
      extraButtons={extraButtons}
      showSync={true}
      showExport={true}
    />
  );
};

export default AccountingLogs;
