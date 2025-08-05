import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Switch,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_SHIPPING_PERIOD,
  DELETE_SHIPPING_PERIOD,
  EDIT_SHIPPING_PERIOD,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
const EditShipingPeriodModal = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
}) => {
  const { token } = useSelector((state) => state.user);
  const [allData, setAllData] = useState({ maxOrderTime: "00:00:00" });
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);
  console.log(data,'data')

  const { id } = useParams();

  const [value2, setValue2] = useState();
  const [value3, setValue3] = useState();
  const [value4, setValue4] = useState(dayjs("2014-08-18T00:00:00"));

  // set data
  useEffect(() => {
    if (data && forEdit) {
      setAllData(data);
      setValue2(dayjs(`2014-08-18T${data.from}`));
      setValue3(dayjs(`2014-08-18T${data.to}`));
      setValue4(dayjs(`2014-08-18T${data.maxOrderTime}`));
    } else {
      setAllData({ maxOrderTime: "00:00:00" });
    }
  }, [data, forEdit]);
  const handleChange2 = (newValue) => {
    setValue2(newValue);
    setAllData({
      ...allData,
      from: `${checkDigits(newValue.$H)}:${checkDigits(newValue.$m)}:00`,
    });
  };
  const handleChange3 = (newValue) => {
    setValue3(newValue);
    setAllData({
      ...allData,
      to: `${checkDigits(newValue.$H)}:${checkDigits(newValue.$m)}:00`,
    });
  };
  const handleChange4 = (newValue) => {
    setValue4(newValue);
    setAllData({
      ...allData,
      maxOrderTime: `${checkDigits(newValue.$H)}:${checkDigits(
        newValue.$m
      )}:00`,
    });
  };
  const checkDigits = (time) => {
    if (time < 10) {
      return `0${time}`;
    } else {
      return time;
    }
  };
  const deleteItem = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_SHIPPING_PERIOD}?id=${data.id}`,
          configReq(token)
        )
        .then((res) => {
          var temp = [...allRows];
          var newData = temp.filter((item) => item.id !== data.id);
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
  const reset = () => {
    setAllData({ maxOrderTime: "00:00:00" });

    setValue4(dayjs("2014-08-18T00:00:00"));
    setValue3();
    setValue2();
  };
  const editItem = () => {
    var sendingData = {
      ...allData,
      shippingCompanyId: id,
    };
    if (forEdit) {
      sendingData = { ...sendingData, id: data?.id };
    }
    if (selectedProductImage) {
      sendingData = { ...sendingData, fromGallery: selectedProductImage };
    }
    setLoading(true);
    var temp = [...allRows];
    if (forEdit) {
      axiosInstance
        .put(
          `${baseUrl}/${EDIT_SHIPPING_PERIOD}`,
          sendingData,
          configReq(token)
        )
        .then((res) => {
          setLoading(false);
          toast.success("با موفقیت ویرایش شد");
          var index = temp.findIndex((item) => item.id === data.id);
          temp[index] = res.data.data;
          setAllRows(temp);
          close();
          setAllData({});
          reset();
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading(false);
        });
    } else {
      axiosInstance
        .post(
          `${baseUrl}/${CREATE_SHIPPING_PERIOD}`,
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
          reset();
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
      close={() => {
        close();
        reset();
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  بازه زمانی ارسالی`}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            ".MuiInputAdornment-root ": {
              ".MuiIconButton-root": {
                marginRight: "0px !important",
              },
            },
          }}
          className="flex flex-col gap-4"
        >
          {" "}
          <TimePicker
            label="   از ساعت  "
            ampm={false}
            value={value2}
            onChange={handleChange2}
            renderInput={(params) => (
              <TextField
                fullWidth
                {...params}
                label="   از ساعت  "
                variant="outlined"
              />
            )}
          />
          <TimePicker
            label="   تا ساعت  "
            ampm={false}
            value={value3}
            onChange={handleChange3}
            renderInput={(params) => (
              <TextField
                fullWidth
                {...params}
                label="   تا ساعت  "
                variant="outlined"
              />
            )}
          />
          <TimePicker
            label="   مدت زمان برای بسته بندی و ارسال"
            ampm={false}
            value={value4}
            onChange={handleChange4}
            renderInput={(params) => (
              <TextField
                fullWidth
                {...params}
                label="   مدت زمان برای بسته بندی و ارسال"
                variant="outlined"
              />
            )}
          />
        </Box>
      </LocalizationProvider>
      <TextInput
        label="  ظرفیت پذیریش سفارش"
        change={(e) => setAllData({ ...allData, capacity: e })}
        currentValue={allData?.capacity || ""}
        number
      />
      <div className="flex items-center">
        <div className="flex items-center gap-4">
          <span className="text-xs"> فعال/غیرفعال : </span>
          <Switch
            onChange={() =>
              setAllData({ ...allData, active: !allData?.active })
            }
            defaultChecked={data?.active}
          />
        </div>
      </div>

      <Box sx={{ display: "flex" }}>
        {userPermissions?.shippingPeriod?.delete && (
          <IconButton onClick={() => setOpenDelete(true)}>
            <Delete color="error" />
          </IconButton>
        )}
        <div style={{ flexGrow: 1 }} />{" "}
        <Button
          variant="contained"
          color="primary"
          onClick={editItem}
          disabled={loading || !allData?.capacity}
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

export default EditShipingPeriodModal;
