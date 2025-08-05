/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { Confirm } from "../../components/modals";
import {
  baseUrl,
  EXPORT_loadRequests,
  loadRequest,
  loadRequests,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const Facilities = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [editingData, setEditingData] = useState({});
  const [open2, setOpen2] = useState(false);
  const [allRows, setAllRows] = useState([]);
  const { token } = useSelector((state) => state.user);

  // Handle completing facility request
  const handleDone = async () => {
    try {
      const res = await axiosInstance.put(
        `${baseUrl}/${loadRequest}`,
        { id: editingData.id, done: true },
        configReq(token)
      );
      setOpen2(false);
      const temp = [...allRows];
      const index = temp.findIndex((item) => item.id === editingData.id);
      setEditingData(res.data.data);
      temp[index] = res.data.data;
      setAllRows(temp);
      toast.success("درخواست با موفقیت تکمیل شد");
    } catch (err) {
      toast.error(err.response?.data?.message || "خطا در تکمیل درخواست");
    }
  };

  // Define APIs for read-only operations
  const facilitiesApis = {
    GET_DATA: loadRequests,
    EXPORT_DATA: EXPORT_loadRequests,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only with custom action
  };

  // Custom action for completing facility requests
  const extraActions = [
    userPermissions?.loanRequest?.update && {
      title: "ویرایش",
      handler: (
        <>
          <Button
            onClick={() => setOpen2(true)}
            variant="contained"
            color="primary"
            disabled={editingData?.state !== 2}
          >
            تکمیل فرایند در خواست
          </Button>
        </>
      ),
    },
  ].filter((it) => it);

  return (
    <>
      <CustomePage
        apis={facilitiesApis}
        title="درخواست تسهیلات لیزینگ"
        canAdd={false}
        canEdit={false}
        permissionsTag="loanRequest"
        customeModal={false}
        feilds={[]} // No form fields for read-only page
        broadCrumb={[
          {
            title: "تسهیلات",
            path: "/facilites",
          },
        ]}
        extraActions={extraActions}
        onRowClick={(data) => {
          setEditingData(data);
        }}
        onDataChange={(data) => {
          setAllRows(data);
        }}
        showSync={true}
        showExport={true}
      />
      <Confirm
        message="آیا از تایید در خواست اطمینان دارید ؟"
        close={() => setOpen2(false)}
        submit={handleDone}
        open={open2}
        type="success"
      />
    </>
  );
};

export default Facilities;
