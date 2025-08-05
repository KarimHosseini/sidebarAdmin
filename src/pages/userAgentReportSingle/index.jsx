/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_AGENT_SUMMERY_SINGLE,
  GET_AGENT_SUMMERY_SINGLE,
} from "../../helpers/api-routes";
const ReportUserAgentSingle = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [editingData, setEditingData] = useState({});

  // Define APIs for agent single report operations
  const reportUserAgentSingleApis = {
    GET_DATA: GET_AGENT_SUMMERY_SINGLE,
    EXPORT_DATA: EXPORT_AGENT_SUMMERY_SINGLE,
  };

  return (
    <CustomePage
      apis={reportUserAgentSingleApis}
      title="گزارش تسویه تسهیلات تکی نماینده ها"
      canAdd={false} // Read-only page
      canEdit={false} // Read-only page
      permissionsTag="singleLoanAgentSummery"
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
      extraActions={
        userPermissions?.singleLoanAgentTurnover?.view
          ? [
              {
                title: "مشاهده",
                handler: (
                  <Button
                    onClick={(rowData) => {
                      const data = rowData?.id ? rowData : editingData;
                      window.open(
                        `/singleLoanAgentTurnover/${data.agentId}?name=${data.agentFullName}`,
                        "_blank"
                      );
                    }}
                    disabled={
                      !userPermissions?.AgentRefahLoanDetailSummery?.view
                    }
                    variant="contained"
                    color="success"
                  >
                    مشاهده ریز تراکنش ها
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

export default ReportUserAgentSingle;
