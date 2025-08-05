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
import Uploader from "../../components/common/uploader";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  DELETE_WALLET_PAYMENT,
  EDIT_STATE_WALLET_PAYMENT,
  EDIT_STATE_WALLET_PAYMENT_CODE,
  EDIT_WALLET_PAYMENT,
} from "../../helpers/api-routes";

import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
const WalletRquestModal = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
  setEditedItem,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [value, setValue] = useState();
  const [data, setData] = useState({});
  const [status, setStatus] = useState({});
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [valueChanges, setvalueChanges] = useState(false);
  const [files, setFiles] = useState();
  useEffect(() => {
    if (forEdit) {
      setData(prevData || {});
      setStatus(STATUS.find((item) => item.id === prevData.status));
    }
  }, [prevData, forEdit, open]);
  const resetData = () => {
    setData({});
  };
  const submitData = () => {
    setLoading(true);
    var temp = [...allRows];
    var datas = {
      userId: value?.id ? value.id : data.userId,
      files,
      ...data,
    };
    if (forEdit) {
      axiosInstance
        .put(`${baseUrl}/${EDIT_WALLET_PAYMENT}`, datas, configReq(token))
        .then((res) => {
          setLoading(false);
          toast.success("با موفقیت ویرایش شد");
          var index = temp.findIndex((item) => item.id === prevData.id);
          setEditedItem(res.data.data);
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
    }
  };
  const deleteAttr = () => {
    setLoading(true);
    axiosInstance
      .delete(
        `${baseUrl}/${DELETE_WALLET_PAYMENT}?id=${prevData.id}`,
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
  const editStatus = () => {
    var datas = {
      id: data?.id,
      state: status?.id,
      code,
    };
    var temp = [...allRows];
    axiosInstance
      .put(`${baseUrl}/${EDIT_STATE_WALLET_PAYMENT}`, datas, configReq(token))
      .then((res) => {
        setLoading(false);
        toast.success("با موفقیت ویرایش شد");
        var index = temp.findIndex((item) => item.id === prevData.id);
        temp[index] = res.data.data;
        setAllRows(temp);
        setStatus(STATUS.find((item) => item.id === res.data.data.status));
        setCode("");
        close();
        resetData();
        setConfirmStatus(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const setConfirmCode = () => {
    setLoading2(true);
    axiosInstance
      .put(
        `${baseUrl}/${EDIT_STATE_WALLET_PAYMENT_CODE}`,
        { id: prevData.id },
        configReq(token)
      )
      .then((res) => {
        setConfirmStatus(true);
        setLoading2(false);
      })
      .catch((err) => {
        setLoading2(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title="  ویرایش درخواست  "
    >
      <div className="grid md:grid-cols-2 gap-3">
        <TextInput
          currentValue={prevData.user}
          disabled
          label={"جست و جو کاربر"}
          defualtValue={data?.user}
        />
        <TextInput
          currentValue={
            valueChanges
              ? value?.mobile
                ? value?.mobile
                : ""
              : prevData?.userMobile
          }
          label=" شماره همراه"
          disabled
        />
        <TextInput
          currentValue={data?.value || ""}
          label="  مبلغ در خواست"
          change={(e) => setData({ ...data, value: e })}
          number={true}
          /*   errors={"قیمت بعد تخفیف باید از قیمت اصلی کوچیک تر باشد"} */
          allowZero={true}
          price={true}
          disabled
        />
        <Dropdown
          value={TYPE[data?.op - 2]}
          change={(e) =>
            setData({ ...data, op: TYPE.findIndex((t) => t === e) + 2 })
          }
          data={TYPE}
          disabled
          title=" نوع در خواست "
        />
        <TextInput
          currentValue={data?.bank}
          label="نام بانک"
          change={(e) => setData({ ...data, bank: e })}
        />

        <TextInput
          currentValue={data?.accountNumber}
          label=" شماره حساب"
          change={(e) => setData({ ...data, accountNumber: e })}
        />
        {/*      <TextInput
          currentValue={data?.pan}
          label=" شماره کارت"
          change={(e) => setData({ ...data, pan: e })}
        /> */}
        <TextField
          value={data?.pan}
          label=" شماره کارت"
          /* error={errors.pan} */
          onChange={(e) => setData({ ...data, pan: e.target.value })}
          inputProps={{ maxLength: 16 }}
          onInput={(e) => {
            e.target.value = e.target.value
              .replace(/[^0-9]/g, "")
              .replace(/(\..*?)\..*/g, "$1");
          }}
        />
        <TextInput
          currentValue={data?.refNumber}
          label=" شماره تراکنش"
          change={(e) => setData({ ...data, refNumber: e })}
        />
      </div>
      <TextField
        label="شرح درخواست  "
        rows={2}
        multiline
        onChange={(e) => setData({ ...data, description: e.target.value })}
        value={data?.description}
      />
      <Uploader
        setFiles={(e) => {
          setFiles(e);
        }}
        type="image"
        check="image"
        defualt={data.galleryId}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {userPermissions?.walletPayment?.view && forEdit && (
          <IconButton size="large" onClick={() => setConfirmDelete(true)}>
            <Delete sx={{ color: "red" }} />
          </IconButton>
        )}{" "}
        <Button
          variant="contained"
          color="primary"
          onClick={submitData}
          disabled={loading || prevData.status === 2}
          sx={{ width: { xs: "50%", md: "auto" } }}
        >
          {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
        </Button>{" "}
      </Box>{" "}
      <div className="border-t-2 mt-4 pt-4">
        <div className="grid grid-cols-2">
          <Dropdown
            value={status}
            change={setStatus}
            data={STATUS}
            title=" وضعیت "
          />{" "}
          <div className="flex items-center md:justify-end w-full justify-center">
            <Button
              disabled={
                loading || status?.id === 0 || !status || prevData.status === 2
              }
              variant="contained"
              onClick={() => setConfirmCode(true)}
            >
              {" "}
              {loading2 ? <CircularProgress /> : <> تغییر وضعیت </>}
            </Button>
          </div>
        </div>
      </div>
      <Confirm
        message="آیا از حذف این شغل اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
      <Modal
        open={confirmStatus}
        close={() => {
          setConfirmStatus(false);
          setStatus(STATUS.find((item) => item.id === prevData.status));
          setCode("");
        }}
        title="   لطفا کد احراز هویت را وارد کنید  "
      >
        <div className="flex justify-between gap-6">
          {" "}
          <TextInput
            currentValue={code}
            label=" کد احراز هویت"
            change={(e) => setCode(e)}
          />
          <Button onClick={editStatus} variant="contained">
            تایید
          </Button>
        </div>
      </Modal>
    </Modal>
  );
};

export default WalletRquestModal;
const STATUS = [
  { id: 0, title: "در انتظار تایید" },
  { id: 1, title: "  تایید شده" },
  { id: 2, title: "  رد شده" },
];
const TYPE = [" شارژ کیف پول", "عودت کیف پول"];
