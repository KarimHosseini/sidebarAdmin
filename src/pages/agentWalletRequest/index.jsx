/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  EXPORT_AGENT_WALLET,
  GET_AGENT_WALLET,
} from "../../helpers/api-routes";

const AgentWalletRequest = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [editingData, setEditingData] = useState({});

  // Define APIs for read-only operations
  const agentWalletApis = {
    GET_DATA: GET_AGENT_WALLET,
    EXPORT_DATA: EXPORT_AGENT_WALLET,
    // No CREATE, EDIT, DELETE operations for this page
  };

  // View details action
  const extraActions = [
    userPermissions?.agentWalletRequestDetail?.view && {
      title: "جزییات",
      handler: (
        <Button
          onClick={() => {
            window.open(`/agentWalletRequest/${editingData.id}?name=${editingData.user}`, "_blank");
          }}
          variant="contained"
          color="primary"
        >
          جزییات
        </Button>
      ),
    },
  ].filter((it) => it);

  return (
    <CustomePage
      apis={agentWalletApis}
      title="درخواست کیف پول نماینده"
      canAdd={false}
      canEdit={false}
      permissionsTag="agentWalletRequest"
      customeModal={false}
      feilds={[]} // No form fields for this page
      broadCrumb={[
        {
          title: "کیف پول نماینده",
          path: "/agentWalletRequest",
        },
      ]}
      extraActions={extraActions}
      onRowClick={(data) => {
        setEditingData(data);
      }}
      showSync={true}
      showExport={true}
    />
  );
};

export default AgentWalletRequest;
