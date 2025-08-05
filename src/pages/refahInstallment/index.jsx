/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal } from "../../components/common";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  EXPORT_REFAHINSTALLMENT_REPORT,
  GET_REFAHINSTALLMENT_REPORT,
  REFAHINSTALLMENT_MANUL,
  REFAHINSTALLMENT_SEND,
  REFAHINSTALLMENT_UPDATE_ALL,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const RefahInstallment = () => {
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [searchParams] = useSearchParams();
  const [editingData, setEditingData] = useState({});
  const [selected, setSelected] = useState([]);
  const [refreshData, setRefresh] = useState(0);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [openOverDue, setOpenOverDue] = useState(false);
  const [loadingSms, setLoadingSms] = useState(false);
  const [loadingUpdateAll, setLoadingUpdateAll] = useState(false);

  const handleSend = () => {
    setLoadingSms(true);
    var temp = [];
    selected.forEach((item) => {
      temp.push(item.requestId);
    });
    axiosInstance
      .post(`${baseUrl}/${REFAHINSTALLMENT_SEND}?message=${title}`, [...temp], {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success(res.data.message || "");
        setOpen(false);
        setLoadingSms(false);
        setTitle("");
        setSelected([]);
        setRefresh((r) => r + 1);
      })
      .catch((err) => {
        setLoadingSms(false);
        toast.error(err.response?.data?.message);
      });
  };

  const handleSendDue = () => {
    setLoadingSms(true);
    axiosInstance
      .post(
        `${baseUrl}/${REFAHINSTALLMENT_MANUL}`,
        { refahInstallmentId: editingData.refahInstallmentId, message: title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message || "");
        setOpenOverDue(false);
        setLoadingSms(false);
        setSelected([]);
        setTitle("");
        setRefresh((r) => r + 1);
      })
      .catch((err) => {
        setLoadingSms(false);
        toast.error(err.response?.data?.message);
      });
  };

  const updateAll = () => {
    setLoadingUpdateAll(true);
    axiosInstance
      .get(`${baseUrl}/${REFAHINSTALLMENT_UPDATE_ALL}`, configReq(token))
      .then((res) => {
        toast.success(res.data.message || "");
        setLoadingUpdateAll(false);
        setRefresh((r) => r + 1);
      })
      .catch((err) => {
        setLoadingUpdateAll(false);
        toast.error(err.response?.data?.message);
      });
  };

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_REFAHINSTALLMENT_REPORT,
    EXPORT_DATA: EXPORT_REFAHINSTALLMENT_REPORT,
  };

  // دکمه‌های اضافی
  const extraButtons = (
    <>
      {userPermissions?.RefahInstallment?.updateAll && (
        <Button
          disabled={loadingUpdateAll}
          variant="contained"
          onClick={updateAll}
        >
          {loadingUpdateAll ? (
            <CircularProgress size={20} />
          ) : (
            "بروزرسانی همه"
          )}
        </Button>
      )}
    </>
  );

  // عملیات انتخاب چندگانه
  const selectionActions = [
    userPermissions?.RefahInstallment?.SendOverdueSms && {
      title: "ارسال گزارش اقساط معوق",
      onClick: (selectedItems) => {
        setSelected(selectedItems);
        setOpen(true);
      },
      variant: "contained",
      requiresSelection: true,
    },
  ].filter(Boolean);

  // عملیات‌های اضافی برای ردیف‌ها
  const extraActions = userPermissions?.RefahInstallment?.ManualSettleOverDueInstallment
    ? [
        {
          title: "ارسال پیام معوقه",
          handler: (
            <Button
              onClick={() => {
                if (editingData.isOverDue) {
                  setOpenOverDue(true);
                } else {
                  toast.error("این مورد معوق نیست");
                }
              }}
              variant="contained"
              color="primary"
            >
              تسویه دستی
            </Button>
          ),
        },
      ]
    : [];

  // پارامترهای اضافی
  const extraParams = searchParams.get("userId") 
    ? { userId: searchParams.get("userId") }
    : {};

  // نمایش اطلاعات اضافی
  const extraDetails = (extraObject) => {
    if (!extraObject) return null;
    
    return (
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span>جمع بر اساس فیلتر:</span>
          <span className="font-bold">
            {extraObject?.sumOfFilteredData?.toLocaleString()} تومان
          </span>
        </div>
        {extraObject?.lastUpdate && (
          <div className="flex items-center gap-2">
            <span>تاریخ آخرین آپدیت:</span>
            <div className="flex items-center gap-2">
              <div className="flex">
                <div>
                  {String(
                    new Date(extraObject?.lastUpdate).getMinutes()
                  ).padStart(2, "0")}
                  :
                </div>
                <div>
                  {String(
                    new Date(extraObject?.lastUpdate).getHours()
                  ).padStart(2, "0")}
                </div>
              </div>
              <span className="text-base font-bold">
                {new Date(extraObject?.lastUpdate).toLocaleDateString("fa-IR")}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const titleSuffix = searchParams.get("userFullName") 
    ? ` ${searchParams.get("userFullName")}` 
    : "";

  return (
    <>
      <CustomePage
        apis={apis}
        title={`گزارش اقساط رفاه${titleSuffix}`}
        canAdd={false}
        canEdit={false}
        permissionsTag="RefahInstallment"
        broadCrumb={[
          {
            title: "گزارشات",
            path: "/reports",
          },
        ]}
        extraButtons={extraButtons}
        extraActions={extraActions}
        selectionActions={selectionActions}
        currentRow={(data) => {
          setEditingData(data);
        }}
        extraParams={extraParams}
        extraDetails={extraDetails}
        key={refreshData}
        defaultSelected={selected}
        onDataChange={(allData) => {
          // برای مدیریت انتخاب‌ها
        }}
      />

      <Modal
        open={open}
        close={() => setOpen(false)}
        title={"متن پیام را وارد کنید"}
      >
        <div className="flex flex-col gap-4">
          {[...new Set(selected.map((item) => item.userFullName))].map(
            (uniqueName) => (
              <span className="font-semibold" key={uniqueName}>
                {uniqueName}
              </span>
            )
          )}
        </div>
        <div className="p-3 border-t mt-3">
          <TextField
            multiline
            rows={3}
            value={title}
            fullWidth
            label="پیام"
            disabled={!userPermissions?.siteNotification?.update}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex justify-end mt-5 gap-2">
            <Button
              disabled={loadingSms}
              onClick={() => handleSend()}
              variant="contained"
            >
              {loadingSms ? <CircularProgress /> : "ثبت اطلاعات"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={openOverDue}
        close={() => setOpenOverDue(false)}
        title={"متن پیام را وارد کنید"}
      >
        <div className="p-6">
          <TextField
            multiline
            value={title}
            fullWidth
            label="پیام"
            disabled={!userPermissions?.siteNotification?.update}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex mt-5 justify-end gap-2">
            <Button
              disabled={loadingSms}
              onClick={() => handleSendDue()}
              variant="contained"
            >
              {loadingSms ? <CircularProgress /> : "ثبت اطلاعات"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RefahInstallment;

// تسک 1: صفحه refahInstallment به CustomePage تبدیل شد (گزارش با عملیات خاص) ✓
