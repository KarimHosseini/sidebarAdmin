/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import CloudSyncOutlinedIcon from "@mui/icons-material/CloudSyncOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  ALL_ORDERS,
  baseUrl,
  EXPORT_ALL_ORDERS,
  RECHECK_BANK_TRANSACTION,
  SYNCCRM,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import ChangeAll from "./changeAll";

const Orders = () => {
  const { token } = useSelector((state) => state.user);

  const { userPermissions } = useSelector((state) => state.relationals);

  const [loadingSync, setLoadingSync] = useState(false);
  const [loadBank, setLoadBank] = useState(false);

  const navigate = useNavigate();

  const allInvoices = (selectedItems, selectedIds) => {
    const ids = selectedIds || selectedItems.map((item) => item.id);
    var params = ids.join(",");
    console.log(selectedItems, "selectedItems");
    console.log(selectedIds, "selectedIds");
    navigate(`/invoices?${params}`);
  };

  const crmSync = (selectedItems, selectedIds) => {
    setLoadingSync(true);
    const formData = new FormData();
    // Use selectedIds directly if provided, otherwise fall back to extracting from items
    const ids = selectedIds || selectedItems.map((item) => item.id);

    if (ids.length > 0) {
      formData.append("ids", ids);
    } else {
      toast.error("لطفا حداقل یک مورد را انتخاب کنید");
      setLoadingSync(false);
      return;
    }
    axiosInstance
      .post(`${baseUrl}/${SYNCCRM}`, formData, configReq(token))
      .then((res) => {
        setLoadingSync(false);

        toast.success("با موفقیت سینک شد");
      })
      .catch((err) => {
        setLoadingSync(false);
        toast.error(err.response?.data?.message);
      });
  };

  const check = (id) => {
    setLoadBank(true);
    axiosInstance
      .post(
        `${baseUrl}/${RECHECK_BANK_TRANSACTION}`,
        { orderId: id },
        configReq(token)
      )
      .then((res) => {
        setLoadBank(false);
        const msg = ` متن برگشتی :‌ ${res.data.data?.result}  , شماره کارت :‌ ${res.data.data?.pan} , مقدار :‌ ${res.data.data?.amount} , شماره پیگیری : ${res.data.data?.refNumber}`;
        toast.success(msg);
      })
      .catch((err) => {
        setLoadBank(false);
        toast.error(err.response?.data?.message);
      });
  };

  // Define selection-based actions for this page
  const selectionActions = [
    {
      title: "CRM SYNC",
      icon: <CloudSyncOutlinedIcon />,
      onClick: crmSync, // Function that receives selectedItems as parameter
      variant: "outlined",
      color: "success",
      sx: { minWidth: "87.85px" },
      permissions: ["crm.update"], // Required permissions in ["module.operation"] format
      loading: loadingSync, // Shows loading spinner when true
    },
    {
      title: "پرینت دسته جمعی فاکتور ها",
      icon: <LocalPrintshopOutlinedIcon />,
      onClick: allInvoices, // Function that receives selectedItems as parameter
      variant: "contained",
      color: "secondary",
      permissions: ["orders.export"], // Required permissions in ["module.operation"] format
      requiresSelection: true, // Button disabled when no items selected
    },
  ];

  return (
    <>
      <CustomePage
        broadCrumb={[]}
        title="سفارشات"
        apis={{
          GET_DATA: ALL_ORDERS,
          EXPORT_DATA: EXPORT_ALL_ORDERS,
        }}
        permissionsTag={"orders"}
        neededFields={["id", "userName"]}
        selectionActions={selectionActions}
        extraButtons={
          <>
            {" "}
            {userPermissions?.PreFactor?.AddPreFactorWithOutDependency && (
              <Button
                onClick={() => navigate("/preFactor/create")}
                variant="contained"
              >
                ثبت پیش فاکتور بدون وابستگی نماینده
              </Button>
            )}
          </>
        }
        extraDetails={
          <div className="flex items-center flex-wrap md:justify-end justify-start col-span-7">
            <div className="flex gap-1 items-center border-r border-l border-b px-4 py-3 ">
              <span>جمع موارد فیلتر شده : </span>
              <span className="font-bold">12</span>
              <span>تومان</span>
            </div>
            <div className="flex gap-1 items-center  border-l border-b px-4 py-3 ">
              <span>جمع هزینه ارسال : </span>
              <span className="font-bold">12</span>
              <span>تومان</span>
            </div>
          </div>
        } 
        extraActions={
          userPermissions?.orders?.recheckBank &&
          userPermissions?.orders?.detail
            ? [
                {
                  title: "",
                  handler: (
                    <>
                      <Button
                        onClick={(event) => {
                          const target =
                            event.currentTarget.closest("[data-id]") ||
                            event.currentTarget.parentElement;
                          const id = target.getAttribute("data-id");
                          check(id);
                        }}
                        variant="outlined"
                      >
                        استعلام بانک
                      </Button>
                    </>
                  ),
                },
                {
                  title: "ویرایش",
                  handler: (
                    <>
                      <IconButton
                        onClick={(event) => {
                          const target =
                            event.currentTarget.closest("[data-id]") ||
                            event.currentTarget.parentElement;
                          const id = target.getAttribute("data-id");
                          const userName = target.getAttribute("data-username");

                          navigate(`/order/${id}`);
                        }}
                      >
                        <Edit sx={{ color: "#ff2000" }} />
                      </IconButton>
                    </>
                  ),
                },
              ]
            : userPermissions?.orders?.detail
            ? [
                {
                  title: "ویرایش",
                  handler: (
                    <>
                      <IconButton
                        onClick={(event) => {
                          const target =
                            event.currentTarget.closest("[data-id]") ||
                            event.currentTarget.parentElement;
                          const id = target.getAttribute("data-id");
                          const userName = target.getAttribute("data-username");

                          navigate(`/order/${id}`);
                        }}
                      >
                        <Edit sx={{ color: "#ff2000" }} />
                      </IconButton>
                    </>
                  ),
                },
              ]
            : []
        }
      />
    </>
  );
};

export default Orders;
