/* eslint-disable react-hooks/exhaustive-deps */
import { Delete } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  baseUrl,
  EDIT_ATTR_VALUE,
  REMOVE_ATTR_VALUE,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import { logout } from "../../../redux/slices/user";
import {
  ActionButton,
  ColorInput,
  Loading,
  Modal,
  TextInput,
  UploadImage,
} from "../../common";
import axiosInstance from "../../dataFetch/axiosInstance";
import Confirm from "../Confirm";

const EditAttributeValues = ({ open, close, type, propsData }) => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);

  const [fileName, setFileNames] = useState("");
  const dispatch = useDispatch();
  const [selectedProductImage, setselectedProductImage] = useState();

  const [avatar, setAvatar] = useState({});
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const resetData = () => {
    setName("");
    setValue("");
    setselectedProductImage();
  };

  useEffect(() => {
    setValue(propsData.value);
    setName(propsData.title);
  }, [propsData]);

  const deleteItem = () => {
    if (propsData) {
      axiosInstance
        .delete(
          `${baseUrl}/${REMOVE_ATTR_VALUE}/${propsData.id}`,
          configReq(token)
        )
        .then((res) => {
          setLoading(false);
          toast.success("با موفقیت ویرایش شد");
          close();
          setOpenDelete(false);
        })
        .catch((err) => {
          setLoading(false);

          toast.error(err.response?.data?.message);
          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
    }
  };

  const editItem = () => {
    const data = {
      id: propsData.id,
      attributeId: parseInt(id),
      title: name,
      value: value,
      fromGallery: selectedProductImage ? selectedProductImage : "",
    };
    setLoading(true);
    axios
      .axiosInstance(`${baseUrl}/${EDIT_ATTR_VALUE}`, data, configReq(token))
      .then((res) => {
        setLoading(false);
        toast.success("با موفقیت ویرایش شد");
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

  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title={`ویرایش مقدار: ${propsData.title}`}
    >
      {loading && <Loading />}
      <Box sx={styles.inputBox}>
        {type === 1 ? (
          <ColorInput
            color={value}
            setColor={setValue}
            changeName={setName}
            name={name}
          />
        ) : (
          <TextInput
            currentValue={name}
            label="مقدار جدید"
            change={(inputValue) => {
              setName(inputValue);
              setValue(inputValue);
            }}
          />
        )}
        <UploadImage
          file={avatar}
          change={setAvatar}
          address={propsData.avatar}
          selectedProductImage={selectedProductImage}
          setselectedProductImage={setselectedProductImage}
          setFileNames={setFileNames}
        />
        <Box sx={{ display: "flex" }}>
          {userPermissions?.attributes?.delete && (
            <IconButton onClick={() => setOpenDelete(true)}>
              <Delete color="error" />
            </IconButton>
          )}
          <div style={{ flexGrow: 1 }} />
          <ActionButton click={editItem} />
        </Box>
      </Box>
      <Confirm
        message="آیا از حذف این مقدار اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

const styles = {
  inputBox: { display: "flex", flexDirection: "column", gap: 2 },
};

export default EditAttributeValues;
