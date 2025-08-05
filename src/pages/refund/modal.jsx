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
  CREATE_REFUND_GROUP,
  DELETE_REFUND_GROUP,
  EDIT_REFUND_GROUP,
} from "../../helpers/api-routes";
import { configReq, toIsoString } from "../../helpers/functions";

const EditRefund = ({
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

      if (prevData?.refundDate) {
        const refundDate = new Date(prevData?.refundDate);
        const formattedString = `${refundDate.getFullYear()}/${
          refundDate.getMonth() + 1
        }/${refundDate.getDate()} ${String(refundDate.getHours()).padStart(
          2,
          "0"
        )}:${String(refundDate.getMinutes()).padStart(2, "0")}`;
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
          `${baseUrl}/${DELETE_REFUND_GROUP}?id=${prevData.id}`,
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
        .put(`${baseUrl}/${EDIT_REFUND_GROUP}`, sendingData, configReq(token))
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
          `${baseUrl}/${CREATE_REFUND_GROUP}`,
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
      title={` ${forEdit ? "ویرایش" : "افزودن"}   برگشت پول `}
    >
      <TextInput
        label="قیمت "
        change={(e) => setAllData({ ...allData, amount: e })}
        currentValue={allData?.amount || ""}
        price
        number
      />{" "}
      <Dropdown
        value={gateWays?.find((g) => g.id === allData?.gateway)}
        change={(e) => setAllData({ ...allData, gateway: e.id })}
        data={gateWays}
        title="نام درگاه  "
      />
      <TextInput
        label="شماره سفارش"
        change={(e) => setAllData({ ...allData, orderId: e })}
        currentValue={allData?.orderId}
      />{" "}
      <TextInput
        label="ریسپانس  برگشت پول "
        change={(e) => setAllData({ ...allData, refundResponse: e })}
        currentValue={allData?.refundResponse}
      />{" "}
      <TextInput
        label="شماره کارت"
        change={(e) => setAllData({ ...allData, cardPan: e })}
        currentValue={allData?.cardPan}
      />{" "}
      <TextInput
        label="کد  برگشت پول "
        change={(e) => setAllData({ ...allData, refundCode: e })}
        currentValue={allData?.refundCode}
      />{" "}
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
                refundDate: toIsoString(new Date(value._d)),
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
        {userPermissions?.refundBank?.delete && (
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

export default EditRefund;
