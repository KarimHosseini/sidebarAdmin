import { Delete } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import "@neshan-maps-platform/react-openlayers/dist/style.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_ADMIN_PERMISSIONS,
  DELETE_ADMIN_PERMISSIONS,
  EDIT_ADMIN_PERMISSIONS,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
const PermissionAdminModal = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
  allShippingClass,
}) => {
  const { token } = useSelector((state) => state.user);
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const { userPermissions } = useSelector((state) => state.relationals);

  const { id } = useParams();

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
          `${baseUrl}/${DELETE_ADMIN_PERMISSIONS}?id=${data.id}`,
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
    var sendingData = { ...allData };
    Object.keys(sendingData).forEach((key) => {
      if (sendingData[key] === null || sendingData[key] === "") {
        delete sendingData[key];
      }
    });

    setLoading(true);
    var temp = [...allRows];
    if (forEdit) {
      axiosInstance
        .put(
          `${baseUrl}/${EDIT_ADMIN_PERMISSIONS}`,
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
          reset();
          setAllData({});
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading(false);
        });
    } else {
      axiosInstance
        .post(
          `${baseUrl}/${CREATE_ADMIN_PERMISSIONS}`,
          sendingData,
          configReq(token)
        )
        .then((res) => {
          temp.unshift(res.data.data);

          setAllRows(temp);
          setLoading(false);
          toast.success("با موفقیت اضافه شد");
          close();
          reset();
          setAllData({});
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading(false);
        });
    }
  };
  const reset = () => {};
  return (
    <Modal
      open={open}
      close={() => {
        close();
        reset();
      }}
      autoWidth
      title={` ${forEdit ? "ویرایش" : "افزودن"}  پرمیژن`}
    >
      <div className="md:grid grid-cols-3 gap-5 md:min-w-[700px]">
        {" "}
        <TextInput
          label=" آیدی پرمیژن"
          change={(e) => setAllData({ ...allData, id: e })}
          currentValue={allData?.id}
        />
        <TextInput
          label=" نام پرمیژن"
          change={(e) => setAllData({ ...allData, title: e })}
          currentValue={allData?.title}
        />
        <div className="leftInput">
          <TextInput
            label="مقدار "
            change={(e) => setAllData({ ...allData, value: e })}
            currentValue={allData?.value}
          />
        </div>
        <div className="leftInput">
          <TextInput
            label="ماژول "
            change={(e) => setAllData({ ...allData, module: e })}
            currentValue={allData?.module}
          />
        </div>
        <div className="leftInput">
          <TextInput
            label="متد "
            change={(e) => setAllData({ ...allData, method: e })}
            currentValue={allData?.method}
          />
        </div>
        <div className="leftInput">
          <TextInput
            label=" یوآرال
          "
            change={(e) => setAllData({ ...allData, url: e })}
            currentValue={allData?.url}
          />
        </div>
        <div className="leftInput">
          {" "}
          <TextInput
            label=" اولویت"
            change={(e) => setAllData({ ...allData, priority: e })}
            currentValue={allData?.priority}
          />
        </div>
        <div className="leftInput">
          <TextInput
            label=" ایدی پرنت"
            change={(e) => setAllData({ ...allData, parentId: e })}
            currentValue={allData?.parentId}
          />
        </div>
      </div>

      <Box sx={{ display: "flex" }}>
        {userPermissions?.permissionAdmin?.delete && data.id && (
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
        message="آیا از حذف این مبلغ اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

export default PermissionAdminModal;
const TYPED = ["خیر", "بلی"];
