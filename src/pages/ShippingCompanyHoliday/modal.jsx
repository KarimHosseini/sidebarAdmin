import { Delete } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dropdown, Modal } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_SHIPPING_HOLIDAY,
  DELETE_SHIPPING_HOLIDAY,
  EDIT_SHIPPING_HOLIDAY,
} from "../../helpers/api-routes";

import { useParams, useSearchParams } from "react-router-dom";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const ShippingCalenderHOliday = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
  allCalenders,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { userPermissions } = useSelector((state) => state.relationals);
 
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
        .put(
          `${baseUrl}/${EDIT_SHIPPING_HOLIDAY}`,
          {
            ...data,
            shippingCompanyId: id,
            shippingCompanyName: searchParams.get("name"),
          },
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
          `${baseUrl}/${CREATE_SHIPPING_HOLIDAY}`,
          {
            ...data,
            shippingCompanyId: id,
            shippingCompanyName: searchParams.get("name"),
          },
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
        `${baseUrl}/${DELETE_SHIPPING_HOLIDAY}?id=${data.id}`,
        configReq(token)
      )
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
      title="ویرایش  روز "
    >
      <Dropdown
        change={(e) => setData({ ...data, calendarId: e.id })}
        value={allCalenders.find((item) => item.id === data.calendarId)}
        data={allCalenders}
        title=" انتخاب روز "
      />

      <Box sx={{ display: "flex", alignItems: "center" }}>
        {forEdit && userPermissions?.shippingCompanyHoliday?.delete && (
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
        message="آیا از حذف این روز اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
    </Modal>
  );
};

export default ShippingCalenderHOliday;
