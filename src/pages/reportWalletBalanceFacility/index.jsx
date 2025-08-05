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
  EXPORT_FACILITY_REPORT_WALLET_BALANCE,
  GET_CHILD_FACILITIES,
  GET_FACILITY_REPORT_WALLET_BALANCE,
  TOGGLE_WALLET_BALANCE,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import Lock from "./lock";
import HistoryReport from "./modal";
const ReporFacilityWalletBalance = () => {
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [facility, setFacility] = useState([]);
  const [editingData, setEditingData] = useState({});
  const [allRows, setAllRows] = useState([]);

  // Define APIs for facility wallet balance report operations
  const reportWalletBalanceFacilityApis = {
    GET_DATA: GET_FACILITY_REPORT_WALLET_BALANCE,
    EXPORT_DATA: EXPORT_FACILITY_REPORT_WALLET_BALANCE,
    EDIT_TOGGLE_DATA: TOGGLE_WALLET_BALANCE,
  };

  useEffect(() => {
    axiosInstance
      .get(`${baseUrl}/${GET_CHILD_FACILITIES}`, configReq(token))
      .then((res) => {
        setFacility(res.data.data.filter((item) => item.children?.length > 0));
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  }, []);
  return (
    <>
      <CustomePage
        apis={reportWalletBalanceFacilityApis}
        title="گزارش مانده کیف پول تسهیلاتی"
        canAdd={false} // Read-only page with custom actions
        canEdit={false} // Read-only page with custom actions
        permissionsTag="reportfacilitywalletballance"
        customeModal={false} // Custom modals handled separately
        feilds={[]} // No form fields
        broadCrumb={[
          {
            title: "کیف پول تسهیلاتی",
            path: "/facilityWallet",
          },
        ]}
        onRowClick={(data) => {
          setEditingData(data);
        }}
        onDataChange={setAllRows}
        extraActions={[
          userPermissions?.facilityWalletLockHistory?.edit && {
            title: "قفل کیف پول تسهیلاتی",
            handler: (
              <Button onClick={() => setOpen2(true)} variant="outlined">
                مشاهده
              </Button>
            ),
          },
          userPermissions?.facilityWalletLockHistory?.view && {
            title: "تاریخچه",
            handler: (
              <Button
                onClick={(rowData) => {
                  const data = rowData?.id ? rowData : editingData;
                  window.open(
                    `/getUserWalletLockHistories/${data.id}?name=${data.fullName}`
                  );
                }}
                variant="outlined"
              >
                مشاهده
              </Button>
            ),
          },
        ].filter((it) => it)}
        showSync={true}
        showExport={true}
      />
      
      {/* Custom modals outside CustomePage */}
      <HistoryReport
        open={open}
        data={editingData}
        close={() => {
          setOpen(false);
          setEditingData({});
        }}
      />
      <Lock
        open={open2}
        data={editingData}
        facility={facility}
        reload={() => setAllRows([...allRows])} // Trigger refresh
        close={() => {
          setOpen2(false);
          setEditingData({});
        }}
      />
    </>
  );
};

export default ReporFacilityWalletBalance;
