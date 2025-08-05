/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { Button, IconButton } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  EXPORT_USER_TURN_OVER,
  GET_USER_TURN_OVER,
  RECHECK_BANK_TRANSACTION,
  RECHECK_WALLET_BANK_TRANSACTION,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const ReportUserTurnover = () => {
  const [searchParams] = useSearchParams();
  const [editingData, setEditingData] = useState({});
  const { userPermissions } = useSelector((state) => state.relationals);
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);

  const setOpen = () => {
    if (editingData.id) {
      if (editingData.type === 1) {
        axiosInstance
          .post(
            `${baseUrl}/${RECHECK_BANK_TRANSACTION}`,
            { orderId: editingData.id },
            configReq(token)
          )
          .then((res) => {
            const msg = ` متن برگشتی :‌ ${res.data.data?.result}  , شماره کارت :‌ ${res.data.data?.pan} , مقدار :‌ ${res.data.data?.amount} , شماره پیگیری : ${res.data.data?.refNumber}`;
            toast.success(msg);
          })
          .catch((err) => {
            toast.error(err.response?.data?.message);
          });
      } else if (editingData.type === 2) {
        axiosInstance
          .post(
            `${baseUrl}/${RECHECK_WALLET_BANK_TRANSACTION}`,
            { wpId: editingData.id },
            configReq(token)
          )
          .then((res) => {
            const msg = ` متن برگشتی :‌ ${res.data.data?.result}  , شماره کارت :‌ ${res.data.data?.pan} , مقدار :‌ ${res.data.data?.amount} , شماره پیگیری : ${res.data.data?.refNumber}`;
            toast.success(msg);
          })
          .catch((err) => {
            toast.error(err.response?.data?.message);
          });
      }
    } else {
      toast.error("آیدی یافت نشد");
    }
  };

  // Define APIs for user turnover report operations
  const reportUserTurnoverApis = {
    GET_DATA: GET_USER_TURN_OVER,
    EXPORT_DATA: EXPORT_USER_TURN_OVER,
    initialFilter: [{ name: "userId", value: id }],
  };

  return (
    <CustomePage
      apis={reportUserTurnoverApis}
      title={`گزارش مالی نقدی ${searchParams.get("name") || ""}`}
      canAdd={false} // Read-only page
      canEdit={false} // Read-only page
      permissionsTag="ReportUserTurnover"
      customeModal={false} // No modals needed
      feilds={[]} // No form fields
      broadCrumb={[
        {
          title: "کاربران",
          path: "/users",
        },
      ]}
      onRowClick={(data) => {
        setEditingData(data);
      }}
      extraActions={[
        {
          title: "استعلام بانک",
          handler: (
            <IconButton onClick={() => setOpen()}>
              <RemoveRedEyeOutlinedIcon color="primary" />
            </IconButton>
          ),
        },
      ]}
      extraButtons={
        <Link to="/users">
          <Button variant="outlined">بازگشت</Button>
        </Link>
      }
      showSync={false}
      showExport={true}
    />
  );
};

export default ReportUserTurnover;
