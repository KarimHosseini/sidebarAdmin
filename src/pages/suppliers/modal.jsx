import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, NumberInput, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_SUPLIER,
  DELETE_SUPLIER,
  EDIT_SUPLIER,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const EditSupplierModal = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [selectedProductImage, setselectedProductImage] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(prevData || {});
  const [avatar, setAvatar] = useState([]);
  useEffect(() => {
    setData(prevData || {});
  }, [prevData, forEdit]);
  const resetData = () => {
    setData({});
    setAvatar([]);
    setselectedProductImage();
  };
  const { userPermissions } = useSelector((state) => state.relationals);

  const submitData = () => {
    if (data.title) {
      setLoading(true);
      var temp = [...allRows];
      if (forEdit) {
        axiosInstance
          .put(`${baseUrl}/${EDIT_SUPLIER}`, data, configReq(token))
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
          .post(`${baseUrl}/${CREATE_SUPLIER}`, data, configReq(token))
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
      toast.error("نام شرکت را وارد کنید");
    }
  };
  const deleteBrand = () => {
    setLoading(true);
    axiosInstance
      .delete(`${baseUrl}/${DELETE_SUPLIER}?id=${data.id}`, configReq(token))
      .then((res) => {
        var temp = [...allRows];
        var newData = temp.filter((item) => item.id !== data.id);
        setAllRows(newData);
        setLoading(false);
        setOpenDelete(false);
        close();
        toast.success("با موفقیت حذف شد");
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
      title={` ${forEdit ? "ویرایش" : "افزودن"}   تامین کننده`}
    >
      <div className="grid md:grid-cols-2 gap-4">
        <TextInput
          label="کد یکتا  "
          change={(e) => setData({ ...data, userName: e })}
          currentValue={data.userName}
        />
        <TextInput
          label="نام  شرکت"
          change={(e) => setData({ ...data, title: e })}
          currentValue={data.title}
        />
        <TextInput
          label="نام  "
          change={(e) => setData({ ...data, fName: e })}
          currentValue={data.fName}
        />
        <TextInput
          label="نام  خانوادگی"
          change={(e) => setData({ ...data, lName: e })}
          currentValue={data.lName}
        />
        <TextInput
          label="تلفن همراه "
          change={(e) => setData({ ...data, mobile: e })}
          currentValue={data.mobile}
        />
        <TextInput
          label=" تلفن ثابت"
          change={(e) => setData({ ...data, tel: e })}
          currentValue={data.tel}
        />
        <NumberInput
          label="مقدار درصد"
          change={(e) => setData({ ...data, percent: e })}
          value={data.percent || 0}
        />
        <div className="col-span-2">
          <TextInput
            label=" نشانی "
            change={(e) => setData({ ...data, address: e })}
            currentValue={data.address}
          />
        </div>

        <TextField
          className="col-span-2"
          label=" توضیحات "
          onChange={(e) => setData({ ...data, description: e.target.value })}
          value={data.description}
          variant="outlined"
          rows={1}
          multiline
        />
      </div>

      <Box sx={{ display: "flex" }}>
        {userPermissions?.supplier?.delete && forEdit && (
          <IconButton onClick={() => setOpenDelete(true)}>
            <Delete color="error" />
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
        </Button>
      </Box>
      <Confirm
        message="آیا از حذف این تامیین اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteBrand}
        open={openDelete}
      />
    </Modal>
  );
};

export default EditSupplierModal;
