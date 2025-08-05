import Editor, { loader } from "@monaco-editor/react";
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
  CREATE_SCRIPTS,
  DELETE_SCRIPTS,
  EDIT_SCRIPTS,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
const ScriptsModal = ({
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
        .delete(`${baseUrl}/${DELETE_SCRIPTS}?id=${data.id}`, configReq(token))
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
        .put(`${baseUrl}/${EDIT_SCRIPTS}`, sendingData, configReq(token))
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
        .post(`${baseUrl}/${CREATE_SCRIPTS}`, sendingData, configReq(token))
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
  useEffect(() => {
    loader.config({
      paths: {
        vs:
          process.env.REACT_APP_MONACO_PATH ||
          "https://unpkg.com/monaco-editor@0.34.0/min/vs",
      },
    });
  }, []);
  return (
    <Modal
      open={open}
      close={() => {
        close();
        reset();
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  اسکریپت`}
    >
      <TextInput
        label="عنوان"
        change={(e) => setAllData({ ...allData, title: e })}
        currentValue={allData.title}
      />
      <div className="ltrForEditor">
        <Editor
          height="300px"
          defaultLanguage="html"
          className="ltrFor w-full"
          defaultValue={`/* Write your css code here */


`}
          value={allData?.value}
          onChange={(e) => setAllData({ ...allData, value: e })}
          theme="vs-dark"
          options={{
            minimap: { enabled: true },
            automaticLayout: true,
            tabSize: 2,
            fontSize: 14,
            lineNumbers: "on",
            wordWrap: "on",
          }}
        />
      </div>
      <Dropdown
        title=" محل جایگذاری  "
        change={(e) => setAllData({ ...allData, type: e?.id })}
        value={TYPE.find((item) => item.id === allData?.type)}
        data={TYPE}
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
        message="آیا از حذف این اسکریپت اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

export default ScriptsModal;
const TYPE = [
  { id: 0, title: "در تگ هد" },
  { id: 1, title: "در تگ بادی" },
  { id: 2, title: "بیرون از تگ بادی و هد" },
];
