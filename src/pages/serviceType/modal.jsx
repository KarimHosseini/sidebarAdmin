import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_SERVICE_TYPE,
  DELETE_SERVICE_TYPE,
  EDIT_SERVICE_TYPE,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const EditServiceType = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
}) => {
  const { token } = useSelector((state) => state.user);
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [avatar, setAvatar] = useState([]);
  const { userPermissions } = useSelector((state) => state.relationals);
  const { themeColor } = useSelector((state) => state.themeColor);
  const useDarkMode = themeColor === "dark";
  // set data
  useEffect(() => {
    if (data && forEdit) {
      setAllData(data);
    } else {
      setAllData({});
    }
  }, [data, forEdit]);

  const deleteItem = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_SERVICE_TYPE}?id=${data.id}`,
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

  const editItem = () => {
    var sendingData = {
      ...allData,
    };
    if (forEdit) {
      sendingData = { ...sendingData, id: data?.id };
    }

    setLoading(true);
    var temp = [...allRows];
    if (forEdit) {
      axiosInstance
        .put(`${baseUrl}/${EDIT_SERVICE_TYPE}`, sendingData, configReq(token))
        .then((res) => {
          setLoading(false);
          toast.success("با موفقیت ویرایش شد");
          var index = temp.findIndex((item) => item.id === data.id);
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
          `${baseUrl}/${CREATE_SERVICE_TYPE}`,
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
      title={` ${forEdit ? "ویرایش" : "افزودن"}  تنظیمات خدمات`}
    >
      <TextInput
        label="عنوان "
        change={(e) => setAllData({ ...allData, title: e })}
        currentValue={allData?.title}
      />
      <TextInput
        label="توضیحات  "
        change={(e) => setAllData({ ...allData, description: e })}
        currentValue={allData?.description}
      />
      <TextInput
        label=" کد سرویس"
        change={(e) => setAllData({ ...allData, serviceCode: e })}
        currentValue={allData?.serviceCode}
      />{" "}
      <div className="flex items-center gap-3">
        <span>آیا این بیمه است : </span>
        <Switch
          checked={allData.isInsurance}
          onChange={() =>
            setAllData({ ...allData, isInsurance: !allData.isInsurance })
          }
        />
      </div>
      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center">
          <div className="flex items-center gap-4">
            <span className="text-xs">: فعال / غیر فعال</span>
            <Switch
              onChange={() =>
                setAllData({
                  ...allData,
                  isActive: !allData?.isActive,
                })
              }
              defaultChecked={data?.isActive}
            />
          </div>
        </div>{" "}
      </div>
      <Box sx={{ display: "flex" }}>
        {userPermissions?.serviceType?.delete && (
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
        message="آیا از حذف این  تنظیمات خدمات اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

export default EditServiceType;
