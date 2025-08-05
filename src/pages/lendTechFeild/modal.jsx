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
import { useParams, useSearchParams } from "react-router-dom";
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
  CREATE_LEND_TECH_FIELD,
  DELETE_LEND_TECH_FIELD,
  EDIT_LEND_TECH_FIELD,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const LandTechFeildModal = ({
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
  const [searchParams, setSearchParams] = useSearchParams();

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
  }, [prevData, forEdit]);

  const resetData = () => {
    setData({});
  };

  const deleteBrand = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_LEND_TECH_FIELD}?id=${data.id}`,
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
      lenTechId: searchParams.get("pi"),
      lendTechStepId: id,
    };

    var temp = [...allRows];

    if (data.title) {
      setLoading(true);
      if (forEdit) {
        axiosInstance
          .put(
            `${baseUrl}/${EDIT_LEND_TECH_FIELD}`,
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
            `${baseUrl}/${CREATE_LEND_TECH_FIELD}`,
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
      title={` ${forEdit ? "ویرایش" : "افزودن"}  فیلد`}
    >
      <TextInput
        currentValue={data?.title}
        label=" نام "
        change={(e) => setData({ ...data, title: e })}
      />
      <TextInput
        currentValue={data?.name}
        label=" نام به انگلیسی"
        change={(e) => setData({ ...data, name: e })}
      />{" "}
      <Dropdown
        value={ALLTYPES.find((item) => item.id === data?.type)}
        title="  نوع"
        data={ALLTYPES}
        change={(e) => setData({ ...data, type: e?.id })}
      />
      <NumberInput
        value={data?.priority}
        label=" اولویت "
        change={(e) => setData({ ...data, priority: e })}
      />
      <TextInput
        currentValue={data?.errorMessage}
        label=" پیام ارور "
        change={(e) => setData({ ...data, errorMessage: e })}
      />
      {/*     <Dropdown
        value={?.find((item) => item.id === data?.smsid)}
        change={(e) => setData({ ...data, smsid: e.id })}
        data={}
        title="  نوع اس ام اس "
      /> */}
      <div className="flex flex-wrap items-center gap-3">
        <span>اجباری: </span>
        <Switch
          checked={data?.required}
          onChange={() => setData({ ...data, required: !data?.required })}
        />{" "}
      </div>
      <Box sx={{ display: "flex" }}>
        {userPermissions?.lendTechField?.delete && forEdit && (
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

export default LandTechFeildModal;
const ALLTYPES = [
  {
    id: 1,
    title: "رادیو باکس",
  },
  {
    id: 2,
    title: "چک باکس",
  },
  {
    id: 3,
    title: "سلکت",
  },
  {
    id: 4,
    title: "آپلود",
  },
  {
    id: 5,
    title: "دانلود",
  },
  {
    id: 6,
    title: "تقویم",
  },
];
