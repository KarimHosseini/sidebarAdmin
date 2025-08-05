/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  APPROVED_PLAN_LANDING_REPORT,
  baseUrl,
  EXPORT_PLAN_LANDING_REPORT,
  GET_PLAN_LANDING_REPORT,
  REJECT_PLAN_LANDING_REPORT,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
const ReportLoanLanding = () => {
  const [editingData, setEditingData] = useState({});
  const { userPermissions } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  const [allRows, setAllRows] = useState([]);

  // Define APIs for loan landing report operations
  const reportLoanLandingApis = {
    GET_DATA: GET_PLAN_LANDING_REPORT,
    EXPORT_DATA: EXPORT_PLAN_LANDING_REPORT,
  };
  const handleReject = () => {
    axiosInstance
      .post(
        `${baseUrl}/${REJECT_PLAN_LANDING_REPORT}?id=${editingData.id}`,
        {},
        configReq(token)
      )
      .then((res) => {
        toast.success("با موفقیت ثبت شد");
        var temp = [...allRows];
        var index = temp.findIndex((item) => item.id === editingData.id);
        temp[index] = res.data.data;
        setAllRows(temp);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };

  const handleAccept = () => {
    axiosInstance
      .post(
        `${baseUrl}/${APPROVED_PLAN_LANDING_REPORT}?id=${editingData.id}`,
        {},
        configReq(token)
      )
      .then((res) => {
        toast.success("با موفقیت ثبت شد");
        var temp = [...allRows];
        var index = temp.findIndex((item) => item.id === editingData.id);
        temp[index] = res.data.data;
        setAllRows(temp);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };

  return (
    <CustomePage
      apis={reportLoanLandingApis}
      title="گزارشات بازدید تسهیلات لندینگ"
      canAdd={false} // Read-only page with approval workflow
      canEdit={false} // Read-only page with approval workflow
      permissionsTag="ReportLoan"
      customeModal={false} // No modals needed
      feilds={[]} // No form fields
      broadCrumb={[
        {
          title: "گزارشات",
          path: "/reports",
        },
      ]}
      onRowClick={(data) => {
        setEditingData(data);
      }}
      onDataChange={setAllRows} // Update allRows when data changes
      extraActions={
        userPermissions?.ReportLoan?.processed ||
        userPermissions?.ReportLoan?.aborted
          ? [
              {
                title: "لغو درخواست",
                handler: (
                  <Button
                    onClick={handleReject}
                    variant="outlined"
                    color="error"
                    disabled={!userPermissions?.ReportLoan?.aborted}
                  >
                    لغو
                  </Button>
                ),
              },
              {
                title: "تایید درخواست",
                handler: (
                  <Button
                    disabled={!userPermissions?.ReportLoan?.processed}
                    onClick={handleAccept}
                    variant="outlined"
                    color="primary"
                  >
                    تایید
                  </Button>
                ),
              },
            ]
          : []
      }
      showSync={true}
      showExport={true}
    />
  );
};

export default ReportLoanLanding;
