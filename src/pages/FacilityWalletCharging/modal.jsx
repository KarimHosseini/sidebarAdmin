import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dropdown, Modal, TextInput } from "../../components/common";
import SearchInput2 from "../../components/common/searchInput2";
import Uploader from "../../components/common/uploader";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  ADD_FACILITY_WALLET_PAYMENT,
  ALL_USERS,
  baseUrl,
  DELETE_FACILITY_WALLET_PAYMENT,
  EDIT_FACILITY_WALLET_PAYMENT,
  GET_CHILD_FACILITIES,
} from "../../helpers/api-routes";

import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
const WalletFacilityChargingModal = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
  gateWays,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [value, setValue] = useState();
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState();
  const [facility, setFacility] = useState([]);
  const [remvalue, setRemvalue] = useState();

  const resetData = () => {
    setData({});
    setRemvalue("");
  };

  const submitData = () => {
    if (!value) {
      toast.error("نام کاربر را وارد کنید");
    } else if (!data?.value) {
      setErrors({ value: true });
      toast.error("مبلغ مورد نظر را وارد کنید");
    } else if (!data?.bank) {
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
    } else if (!files) {
      setErrors({ files: true });
      toast.error("سند مدرک را بارگذاری کنید");
    } else {
      setErrors({});
      setLoading(true);
      var temp = [...allRows];
      var datas = {
        op: 2,
        userId: value.id,

        files,
        ...data,
      };
      if (forEdit) {
        axiosInstance
          .put(
            `${baseUrl}/${EDIT_FACILITY_WALLET_PAYMENT}`,
            datas,
            configReq(token)
          )
          .then((res) => {
            setLoading(false);
            toast.success("با موفقیت ویرایش شد");
            var index = temp.findIndex((item) => item.id === prevData.id);
            temp[index] = res.data.data;
            setAllRows(temp);
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
      } else {
        axiosInstance
          .post(
            `${baseUrl}/${ADD_FACILITY_WALLET_PAYMENT}`,
            datas,
            configReq(token)
          )
          .then((res) => {
            temp.unshift(res.data.data);

            setAllRows(temp);
            setLoading(false);
            toast.success("با موفقیت اضافه شد");
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
    }
  };
  const deleteAttr = () => {
    setLoading(true);
    axiosInstance
      .delete(
        `${baseUrl}/${DELETE_FACILITY_WALLET_PAYMENT}?id=${prevData.id}`,
        configReq(token)
      )
      .then((res) => {
        var temp = [...allRows];
        var newData = temp.filter((item) => item.id !== prevData.id);
        setAllRows(newData);
        setLoading(false);
        setConfirmDelete(false);
        toast.success("با موفقیت حذف شد");
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
  };
  useEffect(() => {
    if (data?.gateway && value?.id) {
      axiosInstance
        .get(
          `${baseUrl}/${GET_CHILD_FACILITIES}?gatewayId=${data?.gateway}&userId=${value.id}`,
          configReq(token)
        )
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
                temp.push({
                  title: ch.title,
                  id: ch.id,
                  remValue: ch.remValue,
                });
              });
            });
          setFacility(temp);
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
        });
    }
  }, [data?.gateway]);
  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title="  درخواست جدید شارژ  کیف پول تسهیلاتی"
    >
      <div className="grid md:grid-cols-2 gap-3">
        <SearchInput2
          url={ALL_USERS}
          value={value}
          setValue={setValue}
          label={"جست و جو کاربر"}
        />
        <TextInput
          currentValue={value ? value.mobile : ""}
          label="شماره همراه "
          disabled
        />
        <Dropdown
          value={gateWays?.find((g) => g.id === data?.gateway)}
          change={(e) => setData({ ...data, gateway: e.id })}
          data={gateWays}
          title="نام درگاه  "
        />
        <Dropdown
          value={facility?.find((g) => g.id === data?.facilityId)}
          change={(e) => {
            setData({ ...data, facilityId: e.id });
            setRemvalue(e.remValue);
          }}
          data={facility}
          title="نام تسهیلات  "
        />{" "}
        <TextInput
          currentValue={remvalue ? remvalue.toLocaleString() : ""}
          label="  موجودی کیف پول کاربر "
          disabled
        />
        <TextInput
          currentValue={data?.value || ""}
          label="  مبلغ در خواست"
          change={(e) => setData({ ...data, value: e })}
          number={true}
          /*   errors={"قیمت بعد تخفیف باید از قیمت اصلی کوچیک تر باشد"} */
          allowZero={true}
          err={errors.value}
          price={true}
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
        rows={2}
        multiline
        onChange={(e) => setData({ ...data, description: e.target.value })}
        value={data?.description}
        error={errors.description}
      />
      <Uploader
        setFiles={(e) => {
          setFiles(e);
        }}
        check="image"
      />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {userPermissions?.walletPaymentAdminCredit?.delete && forEdit && (
          <IconButton size="large" onClick={() => setConfirmDelete(true)}>
            <Delete sx={{ color: "red" }} />
          </IconButton>
        )}
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
      <Confirm
        message="آیا از حذف این شغل اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
    </Modal>
  );
};

export default WalletFacilityChargingModal;
