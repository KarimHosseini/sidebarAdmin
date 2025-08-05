import { Delete } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton } from "@mui/material";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Dropdown, Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_WHITE_LIST_HISTORY,
  DELETE_WHITE_LIST_HISTORY,
  EDIT_WHITE_LIST_HISTORY,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
const WhiteListHistoryModal = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
  whiteListUserId,
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
          `${baseUrl}/${DELETE_WHITE_LIST_HISTORY}?id=${data.id}`,
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
    var sendingData = { ...allData, WhiteListUserId: whiteListUserId };
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
          `${baseUrl}/${EDIT_WHITE_LIST_HISTORY}`,
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
          `${baseUrl}/${CREATE_WHITE_LIST_HISTORY}`,
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
      title={` ${forEdit ? "ویرایش" : "افزودن"}  تاریخچه`}
    >
      <Dropdown
        title=" عملیات "
        change={(e) => setAllData({ ...allData, op: e?.id })}
        value={TYPE.find((item) => item.id === allData?.op)}
        data={TYPE}
      />
      <TextInput
        label="مقدار"
        change={(e) => setAllData({ ...allData, value: e })}
        currentValue={allData.value}
      />
      <TextInput
        label="توضیحات"
        change={(e) => setAllData({ ...allData, description: e })}
        currentValue={allData.description}
      />

      <Box sx={{ display: "flex" }}>
        {userPermissions?.scripts?.delete && data.id && (
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
        message="آیا از حذف این تاریخچه اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

export default WhiteListHistoryModal;
const TYPE = [
  {
    id: 0,
    title: "مصرف",
    style: '{fontWeight:500 , color: "#ff8b00"} ',
    styleDark: '{fontWeight:500 , color: "#ffcc6f"} ',
  },
  {
    id: 1,
    title: "شارژ",
    style: '{fontWeight:500 , color: "#00c83a"}',
    styleDark: '{fontWeight:500 , color: "#76e59f"}',
  },
  {
    id: 2,
    title: "شارژ کیف پول داخلی",
    style: '{fontWeight:500 , color: "#00c83a"}',
    styleDark: '{fontWeight:500 , color: "#76e59f"}',
  },
  {
    id: 3,
    title: "عودت وجه از کیف پول سایت",
    style: '{fontWeight:500 , color: "#ff8b00"}',
    styleDark: '{fontWeight:500 , color: "#ffcc6f"} ',
  },
  {
    id: 4,
    title: "عودت سیستمی",
    style: '{fontWeight:500 , color: "red"}',
    styleDark: null,
  },
  {
    id: 5,
    title: "کسر بابت کارمزد طرح",
    style: null,
    styleDark: null,
  },
  {
    id: 6,
    title: "به روز رسانی",
    style: null,
    styleDark: null,
  },
];
