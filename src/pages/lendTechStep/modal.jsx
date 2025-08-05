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
import { useParams } from "react-router-dom";
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
  CREATE_LEND_TECH_STEP,
  DELETE_LEND_TECH_STEP,
  EDIT_LEND_TECH_STEP,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const LandTechStepModal = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
  smsTypes,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);

  const [loading, setLoading] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const { id } = useParams();
  const [data, setData] = useState({});
  useEffect(() => {
    if (forEdit) {
      setData({
        ...prevData,
      });
    }
  }, [prevData, forEdit, smsTypes]);

  const resetData = () => {
    setData({});
  };

  const deleteBrand = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_LEND_TECH_STEP}?id=${data.id}`,
          configReq(token)
        )
        .then((res) => {
          var temp = [...allRows];
          var newData = temp.filter((item) => item.id !== data.id);
          setAllRows(newData);
          setLoading(false);
          setOpenDelete(false);
          close();
          if (data.code === 200) {
            toast.success("با موفقیت حذف شد");
          }
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
          setOpenDelete(false);
          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
    }
  };

  const editItem = () => {
    var sendingData = {
      ...data,
      lenTechId: id,
    };

    var temp = [...allRows];

    if (data.title) {
      setLoading(true);
      if (forEdit) {
        axiosInstance
          .put(
            `${baseUrl}/${EDIT_LEND_TECH_STEP}`,
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
            `${baseUrl}/${CREATE_LEND_TECH_STEP}`,
            sendingData,
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
    } else if (!data.title) {
      toast.error("نام  را وارد کنید");
    }
  };

  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  مراحل`}
    >
      <TextInput
        currentValue={data?.title}
        label=" نام "
        change={(e) => setData({ ...data, title: e })}
      />
      <NumberInput
        value={data?.step}
        label=" شماره مرحله "
        change={(e) => setData({ ...data, step: e })}
      />
      <Dropdown
        value={ALLTYPES.find((item) => item.id === data?.type)}
        title="  نوع"
        data={ALLTYPES}
        change={(e) => setData({ ...data, type: e?.id })}
      />
      {/*    <TextInput
        currentValue={data?.props}
        label=" پراپز "
        change={(e) => setData({ ...data, props: e })}
      /> */}
      <TextInput
        currentValue={data?.successMessage}
        label=" پیام موفقیت "
        change={(e) => setData({ ...data, successMessage: e })}
      />
      <Dropdown
        value={smsTypes?.find((item) => item.id === data?.smsid)}
        change={(e) => setData({ ...data, smsid: e.id })}
        data={smsTypes}
        title="  نوع اس ام اس "
      />
      <div className="flex flex-wrap items-center gap-3">
        <span>فعال/غیر فعال : </span>
        <Switch
          checked={data?.active}
          onChange={() => setData({ ...data, active: !data?.active })}
        />{" "}
        <span>ارسال خودکار اس ام اس : </span>
        <Switch
          checked={data?.autoSms}
          onChange={() => setData({ ...data, autoSms: !data?.autoSms })}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span>امکان بازگشت به مرحله قبل : </span>
        <Switch
          checked={data?.canReturn}
          onChange={() => setData({ ...data, canReturn: !data?.canReturn })}
        />{" "}
        <span>امکان ویرایش توسط ادمین : </span>
        <Switch
          checked={data?.canEditAdmin}
          onChange={() =>
            setData({ ...data, canEditAdmin: !data?.canEditAdmin })
          }
        />{" "}
        <span>امکان ویرایش توسط کاربر : </span>
        <Switch
          checked={data?.canEditUser}
          onChange={() => setData({ ...data, canEditUser: !data?.canEditUser })}
        />
      </div>
      <Box sx={{ display: "flex" }}>
        {userPermissions?.lendTechStep?.delete && forEdit && (
          <IconButton onClick={() => setOpenDelete(true)}>
            <Delete color="error" />
          </IconButton>
        )}
        <div style={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          color="primary"
          onClick={editItem}
          disabled={loading}
        >
          {loading ? <CircularProgress /> : <>ذخیره و ثبت اطلاعات</>}
        </Button>
      </Box>
      <Confirm
        message="آیا از حذف این شعبه اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteBrand}
        open={openDelete}
      />
    </Modal>
  );
};

export default LandTechStepModal;
const ALLTYPES = [
  {
    title: "ثبت نام  / ثبت کاربر",
    id: 1,
  },
  {
    title: "مشخصات تسهیلات",
    id: 2,
  },

  {
    title: "صحت سنجی ",
    id: 3,
  },
  {
    title: "تعیین نوبت    ",
    id: 4,
  },
  {
    title: "شارژ کیف پول ",
    id: 3,
  },
];
