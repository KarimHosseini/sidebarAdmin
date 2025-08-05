/* eslint-disable react-hooks/exhaustive-deps */
import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { Modal } from "../../components/common";
import {
  ALL_TIPAX,
  baseUrl,
  EDIT_ACTIVE_ALL_TIPAX,
  EDIT_ACTIVE_TIPAX,
  EXPORT_TIPAX,
  TRACKING_TIPAX,
  CREATE_TIPAX,
  EDIT_TIPAX,
  DELETE_TIPAX,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const Tipax = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  const [loadingButton, setLoadingButton] = useState(false);
  const [open, setOpen] = useState(false);
  const [trackResualt, setTrackResualt] = useState([]);
  const [currentRowData, setCurrentRowData] = useState({});
  const [refreshData, setRefresh] = useState(0);

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: ALL_TIPAX,
    EXPORT_DATA: EXPORT_TIPAX,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_TIPAX,
    DELETE_ALL_DATA: EDIT_ACTIVE_ALL_TIPAX,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_TIPAX,
    CREATE_DATA: CREATE_TIPAX,
    EDIT_DATA: EDIT_TIPAX,
    DELETE_DATA: DELETE_TIPAX,
  };

  // تعریف فیلدهای فرم برای modal
  const fields = [
    {
      name: 'traceCode',
      label: 'کد رهگیری',
      type: 'textInput',
      required: true
    },
    {
      name: 'secondaryTraceCode',
      label: 'کد رهگیری ثانویه',
      type: 'textInput',
      required: false
    },
    {
      name: 'customerSubstationCode',
      label: 'کد مشتری',
      type: 'textInput',
      required: false
    },
    {
      name: 'discountCode',
      label: 'کد تخفیف',
      type: 'textInput',
      required: false
    },
    {
      name: 'orderId',
      label: 'شماره سفارش',
      type: 'textInput',
      required: false
    }
  ];

  // تابع استعلام
  const handleCheck = (tipaxWayBill) => {
    setLoadingButton(true);
    axiosInstance(
      `${baseUrl}/${TRACKING_TIPAX}?orderId=${tipaxWayBill}`,
      configReq(token)
    )
      .then((res) => {
        setLoadingButton(false);
        setTrackResualt(res.data);
        setOpen(true);
      })
      .catch((err) => {
        setLoadingButton(false);
        toast.error(err.response?.data?.message);
      });
  };

  // عملیات‌های اضافی برای ردیف‌ها
  const extraActions = userPermissions?.tipax?.track
    ? [
        {
          title: "استعلام",
          handler: (
            <Button
              variant="contained"
              disabled={loadingButton}
              onClick={(rowData) => {
                const data = rowData?.tipaxWayBill ? rowData : currentRowData;
                handleCheck(data.tipaxWayBill);
              }}
            >
              استعلام
            </Button>
          ),
        },
      ]
    : [];

  // کامپوننت برای نمایش اطلاعات اضافی
  const extraDetails = (extraObject) => {
    if (!extraObject) return null;
    
    return (
      <div className="flex gap-4 items-center">
        <span>آخرین بروزرسانی:</span>
        <span className="font-bold">
          {String(new Date(extraObject).getMinutes()).padStart(2, "0")}:
          {String(new Date(extraObject).getHours()).padStart(2, "0")}
        </span>
        <span className="font-bold">
          {new Date(extraObject)?.toLocaleDateString("fa-ir")}
        </span>
      </div>
    );
  };

  return (
    <>
      <CustomePage
        apis={apis}
        title="مشاهده سفارشات به تیپاکس"
        canAdd={userPermissions?.tipax?.insert}
        canEdit={userPermissions?.tipax?.update}
        permissionsTag="tipax"
        customeModal={false}
        feilds={fields}
        broadCrumb={[
          {
            title: "گزارشات",
            path: "/reports",
          },
        ]}
        extraActions={extraActions}
        extraDetails={extraDetails}
        currentRow={(data) => {
          setCurrentRowData(data);
        }}
        key={refreshData}
      />

      {/* Modal استعلام */}
      <Modal
        open={open}
        close={() => {
          setOpen(false);
          setTrackResualt([]);
        }}
        title={"استعلام تیپاکس"}
      >
        <div>
          {loadingButton ? (
            <CircularProgress />
          ) : (
            <div className="flex my-4 flex-col gap-2">
              {trackResualt?.map((item, index) => (
                <span key={index}>
                  - {item.status} / {item.trackingCode}
                </span>
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setOpen(false);
                setTrackResualt([]);
              }}
              variant="contained"
              color="info"
            >
              متوجه شدم
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Tipax;
