/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import CustomePage from "../../components/customePage";
import {
  EXPORT_AGENT_WALLET_DETAIL,
  GET_AGENT_WALLET_DETAIL,
} from "../../helpers/api-routes";

const ReportAgentWalletDetails = () => {
  const [searchParams] = useSearchParams();
  const { userPermissions } = useSelector((state) => state.relationals);
  const { id } = useParams();
  const agentName = searchParams.get("name");

  // Define APIs for read-only operations with URL parameter
  const agentWalletDetailsApis = {
    GET_DATA: GET_AGENT_WALLET_DETAIL,
    EXPORT_DATA: EXPORT_AGENT_WALLET_DETAIL,
    // Pass the walletPaymentId as a parameter
    initialFilter: [
      {
        name: "walletPaymentId",
        value: id,
      }
    ]
  };

  return (
    <CustomePage
      apis={agentWalletDetailsApis}
      title={`گزارش عودت نماینده ${agentName}`}
      canAdd={false}
      canEdit={false}
      permissionsTag="agentWalletRequestDetail"
      customeModal={false}
      feilds={[]} // No form fields for this page
      broadCrumb={[
        {
          title: "گزارش",
          path: "/reports",
        },
        {
          title: "گزارش عودت نماینده",
          path: "/agentWalletRequest",
        },
      ]}
      showSync={false}
      showExport={true}
      defaultFilter={[]}
      extraDetails={{
        extraParams: { name: "walletPaymentId", value: id }
      }}
    />
  );
};

export default ReportAgentWalletDetails;
