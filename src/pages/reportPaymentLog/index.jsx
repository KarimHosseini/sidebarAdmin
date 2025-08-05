/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, TextInput } from "../../components/common";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { Confirm } from "../../components/modals";
import {
  baseUrl,
  DELETE_ALL_PAYMENT_LOG,
  DELETE_MONTH_PAYMENT_LOG,
  DELETE_PAYMENT_LOG,
  EXPORT_PAYMENT_LOG,
  GET_PAYMENT_LOG,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
const ReportPaymentLog = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [editingData, setEditingData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteConfirmAll, setDeleteConfirmAll] = useState(false);
  const [deleteConfirmAllThisMonth, setDeleteConfirmAllThisMonth] = useState(false);
  const [allRows, setAllRows] = useState([]);
  const [years, setYears] = useState(1403);
  const [month, setmonth] = useState(1);
  const { token } = useSelector((state) => state.user);

  // Define APIs for payment log operations
  const reportPaymentLogApis = {
    GET_DATA: GET_PAYMENT_LOG,
    EXPORT_DATA: EXPORT_PAYMENT_LOG,
    DELETE_DATA: DELETE_PAYMENT_LOG,
    DELETE_ALL_DATA: DELETE_ALL_PAYMENT_LOG,
  };
  const deleteItemClick = () => {
    if (editingData) {
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_PAYMENT_LOG}?id=${editingData.id}`,
          configReq(token)
        )
        .then((res) => {
          setDeleteConfirm(false);
          var temp = [...allRows];
          var newData = temp.filter((item) => item.id !== editingData.id);
          setAllRows(newData);
          toast.success("با موفقیت حذف شد");
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
        });
    }
  };

  const deleteItemAllClick = () => {
    axiosInstance
      .delete(`${baseUrl}/${DELETE_ALL_PAYMENT_LOG}`, configReq(token))
      .then((res) => {
        setDeleteConfirmAll(false);
        setAllRows([]);
        toast.success("با موفقیت حذف شد");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };

  const deleteItemAllThisMonthClick = () => {
    axiosInstance
      .delete(`${baseUrl}/${DELETE_MONTH_PAYMENT_LOG}`, {
        data: { month, year: years },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        handleClose();
        setAllRows([]);
        toast.success("با موفقیت حذف شد");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };

  const handleClose = () => {
    setmonth(1);
    setYears(1403);
    setDeleteConfirmAllThisMonth(false);
  };

  return (
    <>
      <CustomePage
        apis={reportPaymentLogApis}
        title="لاگ درگاه"
        canAdd={false} // Read-only page
        canEdit={false} // Read-only page
        permissionsTag="OnlinePaymentLog"
        customeModal={false} // No modals needed for CRUD
        feilds={[]} // No form fields
        broadCrumb={[
          {
            title: "لاگ سیستم",
            path: "/reportpayment",
          },
        ]}
        onRowClick={(data) => {
          setEditingData(data);
        }}
        onDataChange={setAllRows} // Update allRows when data changes
        extraButtons={
          <>
            {userPermissions?.OnlinePaymentLog?.deleteAll && (
              <Button
                onClick={() => setDeleteConfirmAll(true)}
                variant="contained"
                color="error"
              >
                حذف همه
              </Button>
            )}
            {userPermissions?.OnlinePaymentLog?.deleteAll && (
              <Button
                onClick={() => setDeleteConfirmAllThisMonth(true)}
                variant="contained"
                color="warning"
              >
                حذف ماهانه
              </Button>
            )}
          </>
        }
        extraActions={
          userPermissions?.OnlinePaymentLog?.delete
            ? [
                {
                  title: "حذف",
                  handler: (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setDeleteConfirm(true);
                      }}
                    >
                      حذف
                    </Button>
                  ),
                },
              ]
            : []
        }
        showSync={true}
        showExport={true}
      />
      
      {/* Custom modals for delete operations */}
      <Confirm
        message="آیا از حذف این لاگ پرداخت اطمینان دارید؟"
        close={() => setDeleteConfirm(false)}
        submit={deleteItemClick}
        open={deleteConfirm}
      />
      <Confirm
        message="آیا از حذف تمام لاگ های پرداخت اطمینان دارید؟"
        close={() => setDeleteConfirmAll(false)}
        submit={deleteItemAllClick}
        open={deleteConfirmAll}
      />
      <Modal
        open={deleteConfirmAllThisMonth}
        close={handleClose}
        title={"سال و ماه مورد نظر را وارد کنید"}
      >
        <div className="grid md:grid-cols-2 gap-3">
          <TextInput label="سال" currentValue={years} change={setYears} />
          <TextInput label="ماه" currentValue={month} change={setmonth} />
        </div>
        <div className="flex justify-end">
          <Button onClick={deleteItemAllThisMonthClick} variant="contained">
            ثبت اطلاعات
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ReportPaymentLog;
