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
  DELETE_DEPOT,
  EXPORT_PRODUCT_CARDEX,
  PRODUCT_CARDEX,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const ProductCardex = () => {
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleDelete = () => {
    setLoadingDelete(true);
    axiosInstance
      .delete(`${baseUrl}/${DELETE_DEPOT}`, configReq(token))
      .then((res) => {
        setOpenConfirm(false);
        setLoadingDelete(false);
        toast.success("لاگ اولین ماه با موفقیت پاک شد");
        window.location.reload(); // Refresh the page data
      })
      .catch((err) => {
        setLoadingDelete(false);
        toast.error(err.response?.data?.message);
      });
  };

  // Define APIs for read-only operations
  const productCardexApis = {
    GET_DATA: PRODUCT_CARDEX,
    EXPORT_DATA: EXPORT_PRODUCT_CARDEX,
    // No CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only with special action
  };

  // Special action button for deleting first month logs
  const deleteLogsButton = userPermissions?.productCardex?.delete ? (
    <Button
      onClick={() => setOpenConfirm(true)}
      variant="contained"
      color="warning"
      disabled={loadingDelete}
    >
      {loadingDelete ? "در حال پاک کردن..." : "پاک کردن لاگ اولین ماه"}
    </Button>
  ) : null;

  return (
    <>
      <CustomePage
        apis={productCardexApis}
        title="گزارش کاردکس کالا"
        canAdd={false}
        canEdit={false}
        permissionsTag="productCardex"
        customeModal={false}
        feilds={[]} // No form fields for read-only page
        broadCrumb={[
          {
            title: "گزارشات",
            path: "/reports",
          },
        ]}
        extraButtons={deleteLogsButton}
        extraActions={[]}
        showSync={true}
        showExport={true}
      />

      <Confirm
        message="آیا از پاک کردن لاگ اولین ماه اطمینان دارید؟"
        close={() => setOpenConfirm(false)}
        submit={handleDelete}
        open={openConfirm}
        loading={loadingDelete}
      />
    </>
  );
};

export default ProductCardex;
