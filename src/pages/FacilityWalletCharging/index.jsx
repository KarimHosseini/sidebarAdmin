/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  EXPORT_FACILITY_WALLET_PAYMENT,
  FACILITY_WALLET_PAYMENT,
  GET_GATEWAYS_ENUM,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import WalletFacilityChargingModal from "./modal";
const FacilityWalletCharging = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [editingData, setEditingData] = useState({});
  const { userPermissions } = useSelector((state) => state.relationals);
  const [gateWays, setGateWays] = useState([]);
  const { token } = useSelector((state) => state.user);
  const [allRows, setAllRows] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [forEdit, setForEdit] = useState(false);

  // Define APIs for facility wallet charging operations
  const facilityWalletChargingApis = {
    GET_DATA: FACILITY_WALLET_PAYMENT,
    EXPORT_DATA: EXPORT_FACILITY_WALLET_PAYMENT,
  };

  // Control modal opening after editingData is set
  useEffect(() => {
    if (editingData && Object.keys(editingData).length > 0 && forEdit) {
      setOpenEdit(true);
    }
  }, [editingData, forEdit]);

  useEffect(() => {
    getAllGateWays();
  }, []);

  const getAllGateWays = () => {
    axiosInstance
      .get(
        `${baseUrl}/${GET_GATEWAYS_ENUM}?Page=1&Limit=10000&showBasicGateWay=true`,
        configReq(token)
      )
      .then((res) => {
        setGateWays(res.data.data);
      })
      .catch((err) => {});
  };
  return (
    <>
      <CustomePage
        apis={facilityWalletChargingApis}
        title="درخواست شارژ کیف تسهیلاتی"
        canAdd={false} // Using custom add button
        canEdit={false} // No edit actions needed
        permissionsTag="facilityWalletPaymentAdminCredit"
        customeModal={false} // Using separate modal
        feilds={[]} // No form fields
        broadCrumb={[
          {
            title: "کیف پول تسهیلاتی",
            path: "/facilityWallet",
          },
        ]}
        defaultFilter={[
          {
            name: "op",
            value: 2,
            type: "eq",
          }
        ]}
        onRowClick={(data) => {
          setEditingData(data);
          setForEdit(true);
        }}
        onDataChange={setAllRows}
        extraButtons={
          <>
            {userPermissions?.facilityWalletPaymentAdminCredit?.insert && (
              <Button onClick={() => setOpenCreate(true)} variant="contained">
                <AddIcon />
                افزودن درخواست جدید
              </Button>
            )}
          </>
        }
        showSync={true}
        showExport={true}
        exportParams="&filter[0][key]=op&filter[0][value]=2&filter[0][operator]=eq"
      />
      
      {/* Custom modal outside CustomePage to prevent infinite renders */}
      <WalletFacilityChargingModal
        open={openEdit || openCreate}
        forEdit={openEdit}
        prevData={editingData}
        setAllRows={setAllRows}
        allRows={allRows}
        gateWays={gateWays}
        close={() => {
          setOpenCreate(false);
          setOpenEdit(false);
          setEditingData({});
          setForEdit(false);
        }}
      />
    </>
  );
};

export default FacilityWalletCharging;
