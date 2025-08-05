import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Resizer from "react-image-file-resizer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Dropdown,
  Modal,
  MultipleImages,
  TextInput,
} from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { ADD_FACILITY_WALLET_PAYMENT, baseUrl } from "../../helpers/api-routes";

import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
const WalletAgentModal = ({
  open,
  close,
  setRefresh,
  allRows,
  value,
  price,
  selected,
  facility,
  prevData,
  setFacilityId,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedProductImage, setselectedProductImage] = useState([]);
  const [resizing, setresizing] = useState(false);

  const resetData = () => {
    setData({});
    setFiles([]);
  };

  const submitData = async () => {
    if (!data?.bank) {
      setErrors({ bank: true });
      toast.error("نام بانک را وارد کنید");
    } else if (!data?.accountNumber) {
      setErrors({ accountNumber: true });
      toast.error("شماره حساب را وارد کنید");
    } else if (!data?.pan) {
      setErrors({ pan: true });
      toast.error("شماره کارت را وارد کنید");
    } else if (!data?.refNumber) {
      setErrors({ refNumber: true });
      toast.error("شماره تراکنش را وارد کنید");
    } else if (!data?.description) {
      setErrors({ description: true });
      toast.error("شرح در خواست را وارد کنید");
    } else if (files.length === 0) {
      setErrors({ files: true });
      toast.error("سند مدرک را بارگذاری کنید");
    } else {
      var tempId = "";
      selected.map((item) => (tempId += `,${item.requestId}`));
      setErrors({});
      setLoading(true);
      var temp = [...allRows];
      const fd = new FormData();
      fd.append("op", "3");
      fd.append("userId", value.id);
      fd.append("value", price);
      fd.append("bank", data?.bank);
      fd.append("accountNumber", data?.accountNumber);
      fd.append("pan", data?.pan);
      fd.append("refNumber", data?.refNumber);
      fd.append("description", data?.description);
      fd.append("gateway", setFacilityId ? selected[0].gatewayId : "15");
      fd.append("facilityId", data?.facilityId);

      if (tempId !== "") fd.append("requestIds", tempId.slice(1));
      if (files?.length > 0) {
        var resizedFiles = [];
        for (let x = 0; x < files.length; x++) {
          if (
            files[x].type === "image/svg+xml" ||
            files[x].type === "image/gif" ||
            !resizing
          ) {
            resizedFiles.push(files[x]);
          } else {
            const resizedFile = await new Promise((resolve) => {
              Resizer.imageFileResizer(
                files[x],
                10000,
                10000,
                "webp",
                100,
                0,
                (uri) => {
                  resolve(uri);
                },
                "blob"
              );
            });
            resizedFiles.push(resizedFile);
          }
        }

        resizedFiles.forEach((file, index) => {
          if (
            files[index].type === "image/svg+xml" ||
            files[index].type === "image/gif"
          ) {
            fd.append(
              "files",
              file,
              files[index].name?.split(".")[0] +
                (files[index].type === "image/svg+xml" ? ".svg" : ".gif")
            );
          } else if (!resizing) {
            fd.append("files", file, files[index].name);
          } else {
            fd.append(
              "files",
              file,
              files[index].name?.split(".")[0] + ".webp"
            );
          }
        });
      }

      axiosInstance
        .post(`${baseUrl}/${ADD_FACILITY_WALLET_PAYMENT}`, fd, configReq(token))
        .then((res) => {
          setLoading(false);
          setRefresh((r) => r + 1);
          toast.success("با موفقیت ثبت شد");
          close();
          resetData();
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
    }
  };
  useEffect(() => {
    if (selected.length > 0 && prevData) {
      var tempId = "";
      selected.map((item) => {
        tempId += `\n -${item.requestId}`;
      });
      setData({
        ...data,
        facilityId: selected[0].facilityId,
        description: `       نماینده :‌${
          value.fname + " " + value.lname
        } | ‌تاریخ :‌${new Date().toLocaleDateString("fa-Ir")}
        تاریخ پیش فاکتور :  ‌${new Date(
          selected[0].preFactorDateTime
        ).toLocaleDateString("fa-Ir")}‌
        ${selected[0].facilityName}
        تسویه بابت وام ها به شماره :
${tempId.slice(1)}
        مبلغ کل :‌${Number(price).toLocaleString()}`,
      });
    }
  }, [selected, price, prevData]);
  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title="  درخواست  تسویه  کیف پول"
    >
      <div className="grid md:grid-cols-2 gap-3">
        <TextInput
          currentValue={value ? value.fname + " " + value.lname : ""}
          label="  نام کاربر "
          disabled
        />
        <TextInput
          currentValue={value ? value.facilityWallet?.toLocaleString() : ""}
          label="  موجودی کیف پول کاربر "
          disabled
        />
        <TextInput
          currentValue={value ? value.mobile : ""}
          label="شماره همراه "
          disabled
        />
        <TextInput
          currentValue={price || ""}
          label="  مبلغ در خواست"
          number={true}
          disabled
          allowZero={true}
          err={errors.value}
          price={true}
        />{" "}
        <Dropdown
          value={facility?.find((g) => g.id === data?.facilityId)}
          change={(e) => setData({ ...data, facilityId: e.id })}
          data={facility}
          title="نام تسهیلات  "
          disabled
        />
        <TextInput
          currentValue={data?.bank}
          label="نام بانک"
          err={errors.bank}
          change={(e) => setData({ ...data, bank: e })}
        />
        <TextInput
          currentValue={data?.accountNumber}
          label=" شماره حساب"
          err={errors.accountNumber}
          change={(e) => setData({ ...data, accountNumber: e })}
        />
        <TextField
          value={data?.pan}
          label=" شماره کارت"
          error={errors.pan}
          onChange={(e) => setData({ ...data, pan: e.target.value })}
          inputProps={{ maxLength: 16 }}
          onInput={(e) => {
            e.target.value = e.target.value
              .replace(/[^0-9]/g, "")
              .replace(/(\..*?)\..*/g, "$1");
          }}
        />
        <TextField
          value={data?.refNumber}
          label=" شماره تراکنش"
          error={errors.refNumber}
          onChange={(e) => setData({ ...data, refNumber: e.target.value })}
          type="number"
        />
      </div>

      <TextField
        label="شرح درخواست  "
        rows={4}
        multiline
        disabled
        value={data?.description}
        error={errors.description}
      />
      <MultipleImages
        files={files}
        setFiles={setFiles}
        selectedProductImage={selectedProductImage}
        setselectedProductImage={setselectedProductImage}
        setResizing={setresizing}
        resizing={resizing}
        noMedia
      />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/*      {userPermissions?.walletPaymentAdminCredit?.delete && forEdit && (
          <IconButton size="large" onClick={() => setConfirmDelete(true)}>
            <Delete sx={{ color: "red" }} />
          </IconButton>
        )} */}
        <div style={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          color="primary"
          onClick={submitData}
          disabled={loading}
          sx={{ width: { xs: "50%", md: "auto" } }}
        >
          {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
        </Button>
      </Box>
      {/*   <Confirm
        message="آیا از حذف این شغل اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      /> */}
    </Modal>
  );
};

export default WalletAgentModal;
