import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionButton, Loading, Modal, TextInput } from "../../common";
import {
  baseUrl,
  DELETE_SYNONYM,
  EDIT_SYNOIM,
} from "../../../helpers/api-routes";
import { configReq, snackMaker } from "../../../helpers/functions";
import { addSnack } from "../../../redux/slices/snacks";
import { Box, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import Confirm from "../Confirm";
import { toast } from "react-toastify";
import axiosInstance from "../../dataFetch/axiosInstance";

const EditSynonimModal = ({ close, open, data }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  const [openDelete, setOpenDelete] = useState(false);

  const [original, setOriginal] = useState("");
  const [synonim, setSynonim] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setOriginal(data.original);
      setSynonim(data.synonim);
    }
  }, [data, data?.original, data?.synonim]);

  const submitData = () => {
    if (original && synonim) {
      setLoading(true);
      axiosInstance
        .put(
          `${baseUrl}/${EDIT_SYNOIM}`,
          {
            id: data.id,
            original,
            synonim,
          },
          configReq(token)
        )
        .then((res) => {
          setLoading(false);
          toast.success("با موفقیت ویرایش شد");
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
        });
    } else {
    }
  };

  const deleteItem = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(`${baseUrl}/${DELETE_SYNONYM}/${data.id}`, configReq(token))
        .then((res) => {
          setLoading(false);
          setOpenDelete(false);
          close();
          toast.success("با موفقیت ویرایش شد");
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
          setOpenDelete(false);
        });
    }
  };

  return (
    <Modal open={open} close={close} title="ویرایش واژه">
      {loading && <Loading />}
      <TextInput
        label="واژه اصلی"
        change={setOriginal}
        currentValue={original}
      />
      <TextInput
        label="مشابه/معادل"
        change={setSynonim}
        currentValue={synonim}
      />
      <Box sx={{ display: "flex" }}>
        <IconButton onClick={() => setOpenDelete(true)}>
          <Delete color="error" />
        </IconButton>
        <div style={{ flexGrow: 1 }} />
        <ActionButton click={submitData} />
      </Box>
      <Confirm
        message="آیا از حذف این واژه اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

export default EditSynonimModal;
