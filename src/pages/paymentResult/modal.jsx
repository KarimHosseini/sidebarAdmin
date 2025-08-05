import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import momentJalaali from "moment-jalaali";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker2";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dropdown, Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";

import {
  baseUrl,
  CREATE_PAYMENT_RESULT_GROUP,
  DELETE_ALL_PAYMENT_RESULT_GROUP,
  EDIT_PAYMENT_RESULT_GROUP,
} from "../../helpers/api-routes";
import { configReq, toIsoString } from "../../helpers/functions";

const PaymentModal = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
  gateWays,
}) => {
  const { token } = useSelector((state) => state.user);
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [avatar, setAvatar] = useState([]);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);
  const { themeColor } = useSelector((state) => state.themeColor);
  const useDarkMode = themeColor === "dark";
  const startTimeCalender = useRef();
  const [valueStatDate, setValueStatDate] = useState(0);
  const [startTime, setstartTime] = useState();
  // set data
  useEffect(() => {
    if (prevData && forEdit) {
      if (JSON.stringify(prevData) !== JSON.stringify(allData)) {
        setAllData({ ...prevData });
      }

      if (prevData?.paymentDate) {
        const paymentDate = new Date(prevData?.paymentDate);
        const formattedString = `${paymentDate.getFullYear()}/${
          paymentDate.getMonth() + 1
        }/${paymentDate.getDate()} ${String(paymentDate.getHours()).padStart(
          2,
          "0"
        )}:${String(paymentDate.getMinutes()).padStart(2, "0")}`;
        const jalaaliTime = momentJalaali(formattedString, "jYYYY/jM/jD HH:mm");
        setstartTime(jalaaliTime);
      }
    } else {
      setAllData({});
    }
  }, [prevData, forEdit]);

  const deleteItem = () => {
    if (prevData) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_ALL_PAYMENT_RESULT_GROUP}?id=${prevData.id}`,
          configReq(token)
        )
        .then((res) => {
          var temp = [...allRows];
          var newData = temp.filter((item) => item.id !== prevData.id);
          setAllRows(newData);
          setLoading(false);
          toast.success("با موفقیت حذف شد");
          setOpenDelete(false);
          close();
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
          setOpenDelete(false);
        });
    }
  };

  const editItem = () => {
    var sendingData = {
      ...allData,
    };
    if (forEdit) {
      sendingData = { ...sendingData, id: prevData?.id };
    }

    setLoading(true);
    var temp = [...allRows];
    if (forEdit) {
      axiosInstance
        .put(
          `${baseUrl}/${EDIT_PAYMENT_RESULT_GROUP}`,
          sendingData,
          configReq(token)
        )
        .then((res) => {
          setLoading(false);
          toast.success("با موفقیت ویرایش شد");
          var index = temp.findIndex((item) => item.id === prevData.id);
          temp[index] = res.data.data;
          setAllRows(temp);
          close();
          setAllData({});
          setAvatar([]);
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading(false);
        });
    } else {
      axiosInstance
        .post(
          `${baseUrl}/${CREATE_PAYMENT_RESULT_GROUP}`,
          sendingData,
          configReq(token)
        )
        .then((res) => {
          temp.unshift(res.data.data);

          setAllRows(temp);
          setLoading(false);
          toast.success("با موفقیت اضافه شد");
          close();
          setAllData({});
          setAvatar([]);
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading(false);
        });
    }
  };
  return (
    <Modal
      open={open}
      close={close}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  تراکنش`}
    >
      <TextInput
        label=" شماره کارت"
        change={(e) => setAllData({ ...allData, cardNumber: e })}
        currentValue={allData?.cardNumber || ""}
      />{" "}
      <Dropdown
        value={gateWays?.find((g) => g.id === allData?.gateway)}
        change={(e) => setAllData({ ...allData, gateway: e.id })}
        data={gateWays}
        title="نام درگاه  "
      />
      <TextInput
        label="شماره مرجع "
        change={(e) => setAllData({ ...allData, rrn: e })}
        currentValue={allData?.rrn || ""}
      />{" "}
      <TextInput
        label="  شماره تراکنش"
        change={(e) => setAllData({ ...allData, refId: e })}
        currentValue={allData?.refId || ""}
      />{" "}
      <TextInput
        label=" مقدار"
        change={(e) => setAllData({ ...allData, amount: e })}
        currentValue={allData?.amount || ""}
        number
        price
      />{" "}
      <TextInput
        label=" ایدی تراکنش درگاه"
        change={(e) => setAllData({ ...allData, payGateTranID: e })}
        currentValue={allData?.payGateTranID || ""}
      />{" "}
      <TextInput
        label=" کد ریسپانس"
        change={(e) => setAllData({ ...allData, resCode: e })}
        currentValue={allData?.resCode || ""}
      />{" "}
      <TextInput
        label=" پیام ریسپانس"
        change={(e) => setAllData({ ...allData, resMessage: e })}
        currentValue={allData?.resMessage || ""}
      />{" "}
      <TextInput
        label=" شماره سفارش"
        change={(e) => setAllData({ ...allData, orderId: e })}
        currentValue={allData?.orderId || ""}
      />{" "}
      <TextInput
        label="شماره کیف پول "
        change={(e) => setAllData({ ...allData, walletId: e })}
        currentValue={allData?.walletId || ""}
      />{" "}
      <TextInput
        label="توکن "
        change={(e) => setAllData({ ...allData, token: e })}
        currentValue={allData?.token || ""}
      />
      <div
        /*      onMouseDown={() => {
        setcheckClick(true);
      }} */
        className="relative  w-full"
      >
        <DatePicker
          timePicker={false}
          value={startTime}
          isGregorian={false}
          ref={startTimeCalender}
          onChange={(value) => {
            if (value) {
              setstartTime(value);
              setAllData({
                ...allData,
                paymentDate: toIsoString(new Date(value._d)),
              });

              setValueStatDate(value._d.toLocaleDateString("fa"));
            }
          }}
        />
        <TextField
          onMouseUp={() => startTimeCalender.current?.setOpen(true)}
          InputProps={{
            inputProps: {
              style: { textAlign: "right", width: "100%" },
            },
          }}
          variant="outlined"
          value={valueStatDate ? valueStatDate : ""}
          label={" تاریخ "}
          autoComplete="off"
          fullWidth
        />
      </div>
      <Box sx={{ display: "flex" }}>
        {userPermissions?.paymentResult?.delete && (
          <IconButton onClick={() => setOpenDelete(true)}>
            <Delete color="error" />
          </IconButton>
        )}
        <div style={{ flexGrow: 1 }} />{" "}
        <Button
          variant="contained"
          color="primary"
          onClick={editItem}
          disabled={loading}
        >
          {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
        </Button>
      </Box>
      <Confirm
        message="آیا از حذف این   بسته بندی اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

export default PaymentModal;
