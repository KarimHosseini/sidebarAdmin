import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_CALENDER,
  DELETE_CALENDER,
  EDIT_CALENDER,
} from "../../helpers/api-routes";

import momentJalaali from "moment-jalaali";
import DatePicker from "react-datepicker2";
import { configReq, toIsoString } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const EditCalender = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { userPermissions } = useSelector((state) => state.relationals);
  const startTimeCalender = useRef();
  const [valueStatDate, setValueStatDate] = useState(0);
  const [startTime, setstartTime] = useState();
  const [checkClick, setcheckClick] = useState(false);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  useEffect(() => {
    if (prevData) {
      setData({ ...prevData });

      if (prevData?.date) {
        let string = new Date(prevData?.date).toLocaleDateString(
          "en-US-u-ca-persian"
        );

        string =
          string.split("/")[2] +
          "/" +
          string.split("/")[0] +
          "/" +
          string.split("/")[1] +
          ` ${String(new Date(prevData?.date).getHours()).padStart(
            2,
            "0"
          )}:${String(new Date(prevData?.date).getMinutes()).padStart(2, "0")}`;
        setstartTime(momentJalaali(string, "jYYYY/jM/jD HH:mm"));
      }
    }
  }, [prevData]);
  const resetData = () => {
    setData({});
    setstartTime();
    setValueStatDate();
  };
  const submitData = () => {
    setLoading(true);
    var temp = [...allRows];
    if (forEdit) {
      axiosInstance
        .put(
          `${baseUrl}/${EDIT_CALENDER}`,
          { ...data, dayType: 1 },
          configReq(token)
        )
        .then((res) => {
          setLoading(false);
          toast.success("با موفقیت ویرایش شد");
          var index = temp.findIndex((item) => item.id === data.id);
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
          `${baseUrl}/${CREATE_CALENDER}`,
          { ...data, dayType: 1 },
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
  };
  const deleteAttr = () => {
    setLoading(true);
    axiosInstance
      .delete(
        `${baseUrl}/${DELETE_CALENDER}?id=${prevData.id}`,
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
  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"} تقویم
      `}
    >
      <TextInput
        label=" متن "
        change={(e) => setData({ ...data, title: e })}
        currentValue={data.title || ""}
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
              setData({
                ...data,
                date: toIsoString(new Date(value._d)),
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

      <Box sx={{ display: "flex", alignItems: "center" }}>
        {forEdit && (
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
        </Button>{" "}
      </Box>
      <Confirm
        message="آیا از حذف این تقویم اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
    </Modal>
  );
};

export default EditCalender;
