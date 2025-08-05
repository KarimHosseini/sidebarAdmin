import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Dropdown,
  Modal,
  NumberInput,
  TextInput,
} from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_PLAN_LOAN_SETTING,
  DELETE_PLAN_LOAN_SETTING,
  EDIT_PLAN_LOAN_SETTING,
} from "../../helpers/api-routes";

import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const EditPlanSetting = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(prevData || {});
  useEffect(() => {
    if (forEdit) {
      setData(prevData || {});
    }
  }, [prevData, forEdit]);
  const resetData = () => {
    setData({});
  };

  const submitData = () => {
   
      setLoading(true);
      var temp = [...allRows];
      if (forEdit) {
        axiosInstance
          .put(`${baseUrl}/${EDIT_PLAN_LOAN_SETTING}`, data, configReq(token))
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
          .post(`${baseUrl}/${CREATE_PLAN_LOAN_SETTING}`, data, configReq(token))
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
      .delete(`${baseUrl}/${DELETE_PLAN_LOAN_SETTING}?id=${data.id}`, configReq(token))
      .then((res) => {
        var temp = [...allRows];
        var newData = temp.filter((item) => item.id !== data.id);
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
      title="ویرایش  تنظیمات طرح "
    >
      <Dropdown
        change={(e) => setData({ ...data, documentPrice: e?.id })}
        value={types?.find((item) => item.id === data.documentPrice)}
        title=" نوع"
        data={types}
      />
      <TextInput
        price={true}
        number={true}
        label=" مبلغ  "
        currentValue={data.validationPrice || ""}
        change={(e) => setData({ ...data, validationPrice: e })}
      />
      <NumberInput
        label="ظرفیت"
        value={data.meetCapacity}
        change={(e) => setData({ ...data, meetCapacity: e })}
      />{" "}
      <NumberInput
        label="تعداد روز"
        value={data.meetDays}
        change={(e) => setData({ ...data, meetDays: e })}
      />{" "}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          rowGap: 1,
          columnGap: 1,
        }}
      >
        <span className="text-sm "> برسی در روز های تعطیل: </span>
        <Switch
          checked={data?.holidayMeet}
          onChange={(e) =>
            setData({ ...data, holidayMeet: !data?.holidayMeet })
          }
        />
      </Box>{" "}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          rowGap: 1,
          columnGap: 1,
        }}
      >
        <span className="text-sm "> برسی در روز جمعه: </span>
        <Switch
          checked={data?.fridayMeet}
          onChange={(e) => setData({ ...data, fridayMeet: !data?.fridayMeet })}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {userPermissions?.planLoanSetting?.delete && forEdit && (
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
        message="آیا از حذف این شغل اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
    </Modal>
  );
};

export default EditPlanSetting;
const types = [];
