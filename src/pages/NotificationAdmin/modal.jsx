import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import momentJalaali from "moment-jalaali";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker2";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, TextInput, UploadImage } from "../../components/common";

import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_ADMIN_NOTIFICATION,
  DELETE_ADMIN_NOTIFICATION,
  EDIT_ADMIN_NOTIFICATION,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const NotificationsModal = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
  Roles,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(prevData || {});
  const [valueStatDate, setValueStatDate] = useState(0);
  const [valueEndDate, setValueEndDate] = useState(0);
  const [startTime, setstartTime] = useState();
  const [endTime, setendTime] = useState();
  const startTimeCalender = useRef();
  const endTimeCalender = useRef();
  const [avatar, setAvatar] = useState();

  useEffect(() => {
    if (prevData) {
      setselectedProductImage(prevData.galleryId);

      setData({
        ...prevData,
      });
      setselectedProductImage(prevData.galleryId);
      setSelectedCategory(prevData.rollIds || []);

      if (prevData?.startDate) {
        let string = new Date(prevData?.startDate).toLocaleDateString(
          "en-US-u-ca-persian"
        );

        string =
          string.split("/")[2] +
          "/" +
          string.split("/")[0] +
          "/" +
          string.split("/")[1] +
          ` ${String(new Date(prevData?.startDate).getHours()).padStart(
            2,
            "0"
          )}:${String(new Date(prevData?.startDate).getMinutes()).padStart(
            2,
            "0"
          )}`;
        setstartTime(momentJalaali(string, "jYYYY/jM/jD HH:mm"));
      }
      if (prevData?.endDate) {
        let string2 = new Date(prevData?.endDate).toLocaleDateString(
          "en-US-u-ca-persian"
        );
        string2 =
          string2.split("/")[2] +
          "/" +
          string2.split("/")[0] +
          "/" +
          string2.split("/")[1] +
          ` ${String(new Date(prevData?.endDate).getHours()).padStart(
            2,
            "0"
          )}:${String(new Date(prevData?.endDate).getMinutes()).padStart(
            2,
            "0"
          )}`;
        setendTime(momentJalaali(string2, "jYYYY/jM/jD HH:mm"));
      }
    }
  }, [prevData]);
  const resetData = () => {
    setData({});
    setAvatar();
    setselectedProductImage();
    setSelectedCategory([]);
  };
  const submitData = () => {
    const formData = new FormData();
    formData.append("Title", data.title);
    formData.append("ShowCount", data.showCount);
    formData.append("Description", data.description);
    formData.append("ShowCount", data.showCount);
    formData.append("StartDate", data.startDate);
    formData.append("EndDate", data.endDate);
    var temp = "";
    selectedCategory.map((item) => {
      temp += `,${item}`;
    });
    formData.append("RollIds", temp.slice(1));
    if (avatar) formData.append("Files", avatar);
    if (selectedProductImage) {
      formData.append(
        "FromGallery",
        selectedProductImage ? selectedProductImage : ""
      );
    }

    if (forEdit) {
      formData.append("Id", data.id);
    }
    var temp = [...allRows];

    setLoading(true);
    if (forEdit) {
      axiosInstance
        .put(
          `${baseUrl}/${EDIT_ADMIN_NOTIFICATION}`,
          formData,
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
          `${baseUrl}/${CREATE_ADMIN_NOTIFICATION}`,
          formData,
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
        `${baseUrl}/${DELETE_ADMIN_NOTIFICATION}?id=${data.id}`,
        configReq(token)
      )
      .then((res) => {
        setLoading(false);
        var temp = [...allRows];
        var newData = temp.filter((item) => item.id !== data.id);
        setAllRows(newData);
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
    var temp = [];
    selectedCategory.map((item) => {
      temp.push(Roles.find((it) => it.id === item).title);
    });
    setSelectedCategoryTitle(temp);
  }, [selectedCategory]);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategory(typeof value === "string" ? value.split(",") : value);
  };
  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  اعلامیه`}
    >
      <>
        <TextInput
          label="نام  "
          change={(e) => setData({ ...data, title: e })}
          currentValue={data.title}
        />{" "}
        <TextInput
          label="تعداد نمایش  "
          change={(e) => setData({ ...data, showCount: e })}
          currentValue={data.showCount}
        />
        <FormControl>
          <InputLabel id="demo-multiple-checkbox-label">سطح دسترسی</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={selectedCategory}
            onChange={handleChange}
            input={<OutlinedInput label="سطح دسترسی" />}
            renderValue={(selected) => selectedCategoryTitle.join(", ")}
          >
            {Roles.map((name) => (
              <MenuItem key={name.id} value={name.id}>
                <Checkbox checked={selectedCategory.indexOf(name.id) > -1} />
                <ListItemText primary={name.title} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="relative  w-full">
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
                  startDate: toIsoString(new Date(value._d)),
                  endDate: toIsoString2(new Date(value._d)),
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
        {/*    <div className="relative  w-full">
          <DatePicker
            timePicker={false}
            value={endTime}
            isGregorian={false}
            ref={endTimeCalender}
            onChange={(value) => {
              if (value) {
                setendTime(value);
                setData({ ...data, endDate: toIsoString2(new Date(value._d)) });

                setValueEndDate(value._d.toLocaleDateString("fa"));
              }
            }}
          />
          <TextField
            onMouseUp={() => endTimeCalender.current?.setOpen(true)}
            InputProps={{
              inputProps: {
                style: { textAlign: "right", width: "100%" },
              },
            }}
            variant="outlined"
            value={valueEndDate ? valueEndDate : ""}
            label={"تا تاریخ "}
            autoComplete="off"
            fullWidth
          />
        </div> */}
        <TextField
          multiline
          label="توضیحات"
          rows={3}
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />
        {/*      <div className="flex items-center gap-3">
          <span>فعال/غیر فعال : </span>
          <Switch
            checked={data?.IsActive}
            onChange={() => setData({ ...data, IsActive: !data?.IsActive })}
          />
        </div>{" "} */}
      </>
      <UploadImage
        file={avatar}
        change={setAvatar}
        address={data.galleryId}
        selectedProductImage={selectedProductImage}
        setselectedProductImage={setselectedProductImage}
      />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {userPermissions?.LoanSettings?.delete && (
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
        message="آیا از حذف این تسهیلات اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
    </Modal>
  );
};

export default NotificationsModal;
function toIsoString(date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      return (num < 10 ? "0" : "") + num;
    };
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    "00" +
    ":" +
    "00" +
    ":" +
    "00"
  );
}
function toIsoString2(date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      return (num < 10 ? "0" : "") + num;
    };
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    "23" +
    ":" +
    "59" +
    ":" +
    "59"
  );
}
