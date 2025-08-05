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
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Dropdown, Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_SMS_PROVIDER,
  DELETE_SMS_PROVIDER,
  EDIT_SMS_PROVIDER,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
const SmsProviderModal = ({
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

  const { userPermissions } = useSelector((state) => state.relationals);

  const { id } = useParams();

  useEffect(() => {
    if (data && forEdit) {
      setAllData({
        ...data,
      });
    } else {
      setAllData({});
    }
  }, [data, forEdit]);
  const deleteItem = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_SMS_PROVIDER}?id=${data.id}`,
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
    Object.keys(sendingData).forEach((key) => {
      if (sendingData[key] === null || sendingData[key] === "") {
        delete sendingData[key];
      }
    });

    setLoading(true);
    var temp = [...allRows];
    if (forEdit) {
      axiosInstance
        .put(`${baseUrl}/${EDIT_SMS_PROVIDER}`, sendingData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
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
        .post(`${baseUrl}/${CREATE_SMS_PROVIDER}`, sendingData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
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
      title={` ${forEdit ? "ویرایش" : "افزودن"}  سرویس دهنده  اس ام اس  `}
    >
      <div className="md:grid grid-cols-2 gap-5">
        <TextInput
          label="عنوان"
          change={(e) => setAllData({ ...allData, title: e })}
          currentValue={allData.title}
        />
        <TextInput
          label="عنوان سرویس دهنده های اس ام اس"
          change={(e) => setAllData({ ...allData, providerName: e })}
          currentValue={allData.providerName}
        />{" "}
        <div className="col-span-2">
          <TextInput
            label="توضیحات "
            change={(e) => setAllData({ ...allData, description: e })}
            currentValue={allData.description}
          />{" "}
        </div>
        <TextInput
          label="اولویت سرویس"
          change={(e) => setAllData({ ...allData, servicePriority: e })}
          currentValue={allData.servicePriority}
        />{" "}
        <Dropdown
          title=" نوع خط ارسالی"
          change={(e) => setAllData({ ...allData, lineType: e?.id })}
          value={TYPE.find((item) => item.id === allData?.lineType)}
          data={TYPE}
        />
        <Dropdown
          title="اولویت استفاده از خطوط"
          change={(e) => setAllData({ ...allData, linePriority: e?.id })}
          value={TYPE2.find((item) => item.id === allData?.linePriority)}
          data={TYPE2}
        />
        {/*    <TextInput
          label="اولویت  خط خدماتی"
          change={(e) => setAllData({ ...allData, serviceLinePriority: e })}
          currentValue={allData.serviceLinePriority}
        />{" "}
        <TextInput
          label="اولویت خط اشتراکی"
          change={(e) => setAllData({ ...allData, shareLinePriority: e })}
          currentValue={allData.shareLinePriority}
        /> */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            rowGap: 1,
            columnGap: 1,
          }}
        >
          <span className="text-sm "> وضعیت خط خدماتی : </span>
          <Switch
            checked={allData?.serviceLineActive}
            onChange={(e) =>
              setAllData({
                ...allData,
                serviceLineActive: !allData?.serviceLineActive,
              })
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
          <span className="text-sm "> وضعیت خط اشتراکی: </span>
          <Switch
            checked={allData?.shareLineActive}
            onChange={(e) =>
              setAllData({
                ...allData,
                shareLineActive: !allData?.shareLineActive,
              })
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
          <span className="text-sm "> فعال/غیرفعال سرویس: </span>
          <Switch
            checked={allData?.serviceActive}
            onChange={(e) =>
              setAllData({ ...allData, serviceActive: !allData?.serviceActive })
            }
          />
        </Box>
      </div>
      <Box sx={{ display: "flex" }}>
        {userPermissions?.smsProvider?.delete && data.id && (
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
        message="آیا از حذف این سرویس دهنده های اس ام اس   اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

export default SmsProviderModal;
const TYPE = [
  { id: 1, title: "اشتراکی" },
  { id: 2, title: "خدماتی " },
];
const TYPE2 = [
  {
    id: 1,
    title: "خط اشتراکی",
  },
  {
    id: 2,
    title: "خط  خدماتی",
  },
];
