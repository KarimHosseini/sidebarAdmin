/* eslint-disable array-callback-return */
import { Delete } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_SYNONIM,
  DELETE_SYNONYM,
  EDIT_SYNOIM,
} from "../../helpers/api-routes";

import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const EditSynonims = ({
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
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [loading, setLoading] = useState(false);
  const [worlds, setWorlds] = useState([]);
  const [world, setWorld] = useState("");
  const [originalWorld, setOriginalWorld] = useState("");

  useEffect(() => {
    if (forEdit) {
      setOriginalWorld(prevData.original);
      if (prevData?.synonims) {
        setWorlds(prevData?.synonims);
      }
    }
  }, [prevData, forEdit]);
  const resetData = () => {
    setWorlds([]);
    setWorld("");
    setOriginalWorld("");
  };
  const submitData = () => {
    if (originalWorld) {
      setLoading(true);
      var temp = [...allRows];
      var string = "";
      worlds.map((item) => {
        string += `,${item}`;
      });
      const formData = new FormData();

      formData.append("original", originalWorld);
      formData.append("synonims", string.slice(1));
      if (forEdit) {
        formData.append("id", prevData.id);
        axiosInstance
          .put(`${baseUrl}/${EDIT_SYNOIM}`, formData, configReq(token))
          .then((res) => {
            setLoading(false);
            toast.success("با موفقیت ویرایش شد");
            var index = temp.findIndex((item) => item.id === prevData.id);
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
          .post(`${baseUrl}/${CREATE_SYNONIM}`, formData, configReq(token))
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
    } else {
      toast.error("نام  را وارد کنید");
    }
  };
  const deleteAttr = () => {
    setLoading(true);
    axiosInstance
      .delete(
        `${baseUrl}/${DELETE_SYNONYM}?id=${prevData.id}`,
        configReq(token)
      )
      .then((res) => {
        var temp = [...allRows];
        var newData = temp.filter((item) => item.id !== prevData.id);
        setAllRows(newData);
        setLoading(false);
        setConfirmDelete(false);
        toast.success("با موفقیت حذف شد");
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
  };
  const allWorld = () => {
    var temp = [...worlds];
    if (world) {
      temp.push(world);
    }
    setWorld("");
    setWorlds(temp);
  };
  const handleDelete = (item) => {
    var temp = [...worlds];

    temp = temp.filter((i) => i !== item);
    setWorlds(temp);
  };
  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title="ویرایش  واژه "
    >
      <TextInput
        label=" واژه اصلی"
        change={setOriginalWorld}
        currentValue={originalWorld}
      />
      <div className="flex items-center gap-4">
        <TextInput
          label="افزودن واژه مترادف"
          change={setWorld}
          currentValue={world}
        />{" "}
        <Button
          sx={{ maxHeight: "40px" }}
          onClick={allWorld}
          variant="contained"
          color="primary"
          disabled={!world}
        >
          افزودن
        </Button>
      </div>
      <div className="flex flex-wrap gap-4 flex-col">
        <span className="text-base font-semibold">مترادف ها : </span>
        <div className="flex flex-wrap gap-4">
          {worlds?.map((item, index) => (
            <div
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded-3xl flex gap-2 items-center"
              key={item + index}
            >
              {item}
              <IconButton onClick={() => handleDelete(item)}>
                <Delete color="error" sx={{ fontSize: "15px !important" }} />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {userPermissions?.synonim?.delete && forEdit && (
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
        message="آیا از حذف این شغل اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
    </Modal>
  );
};

export default EditSynonims;
