/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  EXPORT_FACILITY_WALLET_PAYMENT,
  FACILITY_WALLET_PAYMENT,
  GET_CHILD_FACILITIES,
  GET_GATEWAYS_ENUM,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import WalletFacilityRquestModal from "./modal";
const FacilityWalletPayment = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [facility, setFacility] = useState([]);
  const [editingData, setEditingData] = useState({});
  const { userPermissions } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  const [gateWays, setGateWays] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [forEdit, setForEdit] = useState(false);

  // Define APIs for facility wallet payment operations
  const facilityWalletPaymentApis = {
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

  useEffect(() => {
    axiosInstance
      .get(`${baseUrl}/${GET_CHILD_FACILITIES}`, configReq(token))
      .then((res) => {
        var temp = [];
        res.data.data
          .filter((item) => item.children?.length > 0)
          .map((item) => {
            temp.push({
              title: `↓ - ${item.title} - ↓ `,
              id: -1,
              disabled: true,
            });
            item.children.map((ch) => {
              temp.push({ title: ch.title, id: ch.id });
            });
          });
        setFacility(temp);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
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
        apis={facilityWalletPaymentApis}
        title="درخواست های کیف پول تسهیلاتی"
        canAdd={false} // Using custom modal
        canEdit={false} // Using custom modal
        permissionsTag="facilityWalletPayment"
        customeModal={false} // Using separate modal
        feilds={[]} // No form fields
        broadCrumb={[
          {
            title: "کیف پول تسهیلاتی",
            path: "/facilityWallet",
          },
        ]}
        onRowClick={(data) => {
          setEditingData(data);
          setForEdit(true);
        }}
        onDataChange={setAllRows}
        extraButtons={
          <>
            <Button
              href="/ChargingFacilityWWallet"
              target="_blank"
              variant="outlined"
            >
              شارژ
            </Button>
            <Button
              href="/withdrawFacilityWallet"
              target="_blank"
              variant="outlined"
            >
              عودت
            </Button>
          </>
        }
        extraActions={
          userPermissions?.facilityWalletPayment?.update
            ? [
                {
                  title: "ویرایش",
                  handler: (
                    <Button
                      onClick={() => setOpenEdit(true)}
                      variant="contained"
                      color="primary"
                    >
                      ویرایش درخواست
                    </Button>
                  ),
                },
              ]
            : []
        }
        showSync={true}
        showExport={true}
      />
      
      {/* Custom modal outside CustomePage to prevent infinite renders */}
      <WalletFacilityRquestModal
        open={openEdit || openCreate}
        forEdit={openEdit}
        prevData={editingData}
        facility={facility}
        setAllRows={setAllRows}
        allRows={allRows}
        gateWays={gateWays}
        setEditedItem={(e) => setEditingData(e)}
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

export default FacilityWalletPayment;
