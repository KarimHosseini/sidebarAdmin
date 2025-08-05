import { Delete } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dropdown, Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_REDIRECT_GENRALL,
  DELETE_REDIRECT_GENRALL,
  EDIT_REDIRECT_GENRALL,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const RedirectModal = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
  smsType,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [valueChanges, setvalueChanges] = useState(false);

  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(prevData || {});
  useEffect(() => {
    if (forEdit) {
      setData({
        ...prevData,
      });
    } else {
      setData({});
    }
  }, [prevData, forEdit, smsType]);
  const resetData = () => {
    setData({});
  };
  const submitData = () => {
    setLoading(true);
    const temp = [...allRows];
    if (forEdit) {
      axiosInstance
        .put(
          `${baseUrl}/${EDIT_REDIRECT_GENRALL}`,
          { ...data },
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
          setValue();
          setvalueChanges(false);
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
          `${baseUrl}/${CREATE_REDIRECT_GENRALL}`,
          {
            ...data,
            EntityName: "showCase",
            EntityId: 0,
            title: "showCase",
            LastSlug: `${data.FromUrl.replace(/ /g, "-")}`,
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
        `${baseUrl}/${DELETE_REDIRECT_GENRALL}?id=${data.id}`,
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
        setValue();
        setvalueChanges(false);
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  ریدایرکت`}
    >
      {!forEdit && (
        <>
          {" "}
          <Alert severity="info">
            ریدایرکت صرفا بر روی صفحات شوکیس قابل اعمال می باشد صفحه هات استاتیک
            اعمال نمی شود
          </Alert>
          <Alert severity="info">
            نشانی درخواستی را بدون نام دامین وارد کنید .{" "}
          </Alert>
        </>
      )}
      {/*   <TextInput
        label="  شماره همراه"
        change={(e) => setData({ ...data, mobile: e })}
        currentValue={data?.mobile}
      /> */}
      <div className="leftInput">
        {" "}
        <TextInput
          label="url مبدا"
          disabled={forEdit}
          currentValue={data.FromUrl}
          change={(e) => setData({ ...data, FromUrl: e })}
        />{" "}
      </div>
      <div className="leftInput">
        {" "}
        <TextInput
          label="url مقصد"
          change={(e) => setData({ ...data, ToUrl: e })}
          currentValue={data.ToUrl}
          name="url"
        />
      </div>
      <Dropdown
        title="نوع تغیر مسیر"
        data={STATUS}
        value={STATUS.find((item) => item?.value === data.RedirectType)}
        change={(e) => setData({ ...data, RedirectType: e.value })}
      />{" "}
      <div className="flex flex-wrap items-center gap-3">
        <span>فعال/غیر فعال : </span>
        <Switch
          checked={data.IsActive}
          onChange={() => setData({ ...data, IsActive: !data.IsActive })}
        />
      </div>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {userPermissions?.redirect?.delete && forEdit && (
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
        message="آیا از حذف این redirect اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
    </Modal>
  );
};

export default RedirectModal;
var STATUS = [
  { value: 410, title: "صفحه ای یافت نشد" },
  { value: 307, title: "۳۰۷ تغیر مسیر موقت" },
  { value: 302, title: "۳۰۲ انتقال موقت" },
  { value: 301, title: "۳۰۱ انتقال دائم" },
];
