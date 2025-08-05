/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  DELETE_EXPIREDT_LOANS,
  EDIT_ACTIVE_REFAHLOAN,
  EXPORT_REFAHLOAN,
  GET_REFAHLOAN,
  UPDATE_ALL_REFAH,
  CREATE_REFAHLOAN,
  EDIT_REFAHLOAN,
  DELETE_REFAHLOAN,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { Modal } from "../../components/common";
import { Confirm } from "../../components/modals";
import ReportAdminTurnover from "./mali";
import ShowLogs from "./showLogs";

const BetaLoan = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  const [loadingUpdate, setloadingUpdate] = useState(false);
  const [openMali, setOpenMali] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteConfirmAll, setDeleteConfirmAll] = useState(false);
  const [openLog, setOpenLog] = useState(false);
  const [openLog2, setOpenLog2] = useState(false);
  const [refreshData, setRefresh] = useState(0);

  const handleUpdate = () => {
    setloadingUpdate(true);
    axiosInstance
      .get(`${baseUrl}/${UPDATE_ALL_REFAH}`, configReq(token))
      .then((res) => {
        setRefresh((r) => r + 1);
        setloadingUpdate(false);
        toast.success(res.data.message);
      })
      .catch((err) => {
        setloadingUpdate(false);
        toast.error(err.response?.data?.message);
      });
  };

  const deleteItemAllClick = () => {
    setLoadingDelete(true);
    axiosInstance
      .get(`${baseUrl}/${DELETE_EXPIREDT_LOANS}`, configReq(token))
      .then((res) => {
        setDeleteConfirmAll(false);
        setRefresh((r) => r + 1);
        toast.success("با موفقیت انجام شد");
        setLoadingDelete(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoadingDelete(false);
      });
  };

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_REFAHLOAN,
    EXPORT_DATA: EXPORT_REFAHLOAN,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_REFAHLOAN,
    CREATE_DATA: CREATE_REFAHLOAN,
    EDIT_DATA: EDIT_REFAHLOAN,
    DELETE_DATA: DELETE_REFAHLOAN,
  };

  // دکمه‌های اضافی
  const extraButtons = (
    <>
      {userPermissions?.RefahLoans?.deleteExpired && (
        <Button
          onClick={() => setDeleteConfirmAll(true)}
          variant="contained"
          color="error"
        >
          حذف تسهیلات منقضی شده
        </Button>
      )}
      {userPermissions?.ReportFacilityUserTurnover?.view && (
        <Button
          onClick={() => setOpenMali(true)}
          variant="contained"
          color="secondary"
        >
          گزارش مالی
        </Button>
      )}
      <Button
        disabled={loadingUpdate}
        onClick={handleUpdate}
        variant="outlined"
        color="inherit"
      >
        {loadingUpdate ? <CircularProgress size={24} /> : "بروزرسانی همه"}
      </Button>
      {userPermissions?.RefahLoans?.shareBlueBank && (
        <Button
          disabled={loadingUpdate}
          onClick={() => window.open("/shareBlueBank")}
          variant="contained"
          color="info"
        >
          تسهیم تجمیعی
        </Button>
      )}
      {userPermissions?.RefahLoans?.chargeBlueBank && (
        <Button
          disabled={loadingUpdate}
          onClick={() => window.open("/chargeBlueBank")}
          variant="outlined"
          color="secondary"
        >
          شارژ تجمیعی
        </Button>
      )}
      {userPermissions?.RefahLoans?.chargeBlueBankLogs && (
        <Button
          disabled={loadingUpdate}
          onClick={() => setOpenLog(true)}
          variant="contained"
          color="primary"
        >
          لاگ شارژ تجمیعی
        </Button>
      )}
      {userPermissions?.RefahLoans?.shareBlueBankLogs && (
        <Button
          disabled={loadingUpdate}
          onClick={() => setOpenLog2(true)}
          variant="outlined"
          color="secondary"
        >
          لاگ تسهیم تجمیعی
        </Button>
      )}
    </>
  );

  // عملیات‌های اضافی برای ردیف‌ها
  const extraActions = [
    {
      title: "ویرایش",
      handler: (
        <IconButton
          onClick={(rowData) => {
            const data = rowData?.id ? rowData : rowData;
            window.open(`/betaloan/${data.id || data.Id}`);
          }}
        >
          <Edit sx={{ color: "#ff2000" }} />
        </IconButton>
      ),
    },
  ];

  // کامپوننت برای نمایش اطلاعات اضافی
  const extraDetails = (extraObject) => {
    if (!extraObject) return null;
    
    return (
      <div className="flex gap-7 flex-wrap items-center justify-between w-full">
        {extraObject?.updatedAt && (
          <span className="flex gap-2 items-center">
            <span>اخرین بروزرسانی</span>
            <span className="font-bold">
              {`${String(
                new Date(extraObject.updatedAt).getMinutes()
              ).padStart(2, "0")}:${String(
                new Date(extraObject.updatedAt).getHours()
              ).padStart(2, "0")}`}{" "}
              -{" "}
              {new Date(extraObject.updatedAt).toLocaleDateString("fa-IR")}
            </span>
          </span>
        )}
        <fieldset className="flex gap-3 items-center border rounded-md px-3 py-2 flex-wrap">
          <legend className="text-center mx-2 px-2 text-sm font-bold">
            گزارش نماینده
          </legend>
          {(extraObject?.allSums || extraObject?.allSums === 0) && (
            <span className="flex gap-2 items-center mb-3">
              <span>جمع کل اعتبار</span>
              <span className="font-bold">
                {Number(extraObject.allSums).toLocaleString()}
              </span>
            </span>
          )}
          {(extraObject?.monthlySum || extraObject?.monthlySum === 0) && (
            <span className="flex gap-2 border-r px-3 border-l items-center mb-3">
              <span>جمع اعتبار ماه جاری</span>
              <span className="font-bold">
                {Number(extraObject.monthlySum).toLocaleString()}
              </span>
            </span>
          )}
          {(extraObject?.dailySum || extraObject?.dailySum === 0) && (
            <span className="flex gap-2 items-center mb-3">
              <span>جمع اعتبار روزانه</span>
              <span className="font-bold">
                {Number(extraObject.dailySum).toLocaleString()}
              </span>
            </span>
          )}
        </fieldset>
        {(extraObject?.filteredSumLoans || extraObject?.filteredSumLoans === 0) && (
          <fieldset className="flex gap-3 items-center border rounded-md px-3 py-2 flex-wrap">
            <legend className="text-center mx-2 px-2 text-sm font-bold">
              گزارش ادمین
            </legend>
            <span className="flex gap-2 items-center mb-3">
              <span>جمع کل اعتبار</span>
              <span className="font-bold">
                {Number(extraObject.filteredSumLoans).toLocaleString()}
              </span>
            </span>
          </fieldset>
        )}
      </div>
    );
  };

  return (
    <>
      <CustomePage
        apis={apis}
        title="تسهیلات دارای تضمین کننده"
        canAdd={false}
        canEdit={userPermissions?.RefahLoans?.view}
        permissionsTag="RefahLoans"
        customeModal={true}
        createOrEditPageUsingOtherPage={true}
        editLink="/betaloan"
        broadCrumb={[
          {
            title: "تسهیلات",
            path: "/facilites",
          },
        ]}
        extraButtons={extraButtons}
        extraActions={extraActions}
        extraDetails={extraDetails}
        key={refreshData}
      />

      <Confirm
        message="آیا از حذف تسهیلات منقضی شده اطمینان دارید؟"
        close={() => setDeleteConfirmAll(false)}
        submit={deleteItemAllClick}
        open={deleteConfirmAll}
        loading={loadingDelete}
      />

      <ReportAdminTurnover open={openMali} close={() => setOpenMali(false)} />

      <Modal
        open={openLog || openLog2}
        autoWidth
        title={`لاگ ${openLog2 ? "تسهیم" : "شارژ"} تجمیعی`}
        close={() => {
          setOpenLog2(false);
          setOpenLog(false);
        }}
      >
        <ShowLogs isShare={openLog2} />
      </Modal>
    </>
  );
};

export default BetaLoan;
