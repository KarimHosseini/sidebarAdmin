import { Delete } from "@mui/icons-material";
import { Button, CircularProgress, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { Confirm } from "../../components/modals";
import {
  baseUrl,
  DELETE_GALLERY,
  DOWNLOAD_FILE,
  EDIT_GALLERY,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const ImageGalleryEdit = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
}) => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [loaded, setLoaded] = useState(false);
  const [loaded2, setLoaded2] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [fileName, setFileName] = useState("");
  const [source, setSource] = useState("");
  const [use, setuse] = useState("");

  const [alt, setAlt] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setFileName(prevData.originalFileName);
    setSource(prevData.source);
    setAlt(prevData.alt);
    /*     Usege();
     */
  }, [forEdit]);

  /*   const Usege = () => {
    if (prevData.id) {
      axios
        .get(`${baseUrl}/${galleyUsage}?id=${prevData.id}`, configReq(token))
        .then((res) => {
          setLoaded2(true);
          setuse(res.data.data);
        })
        .catch(() => {
          setLoaded2(false);
        });
    }
  };
  console.log(prevData.source, "prevData"); */
  const handleEditImage = () => {
    setLoaded(true);
    const fd = new FormData();
    fd.append("Source", source);
    fd.append("Alt", alt);
    fd.append("OriginalFileName", fileName);
    fd.append("Id", prevData.id);
    var temp = [...allRows];
    axiosInstance
      .put(`${baseUrl}/${EDIT_GALLERY}`, fd, configReq(token))
      .then((res) => {
        var index = temp.findIndex((item) => item.id === prevData.id);
        temp[index] = res.data.data[0];
        setAllRows(temp);
        toast.success("با موفقیت ویرایش شد");
        setOpenCreate(false);
        setLoaded(false);
        close();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(logout());
        }
        setLoaded(false);
        toast.error(err.response?.data?.message);
      });
  };
  const HandleDelete = () => {
    axiosInstance
      .delete(
        `${baseUrl}/${DELETE_GALLERY}?id=${prevData.id}`,
        configReq(token)
      )
      .then((res) => {
        toast.success("با موفقیت حذف شد");
        setOpenCreate(false);
        var temp = [...allRows];
        var newData = temp.filter((item) => item.id !== prevData.id);
        setAllRows(newData);
        setConfirmDelete(false);
        close();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(logout());
        }
        toast.error(err.response?.data?.message);
      });
  };
  return (
    <>
      <Modal
        open={open}
        close={close}
        title={`ویرایش  عکس در گالری ایدی  ${prevData.id}`}
        autoWidth={true}
      >
        <div className="flex flex-col gap-5 px-8">
          <TextInput
            label="نام عکس"
            currentValue={fileName}
            change={setFileName}
          />
          <TextInput
            label="سورس عکس"
            currentValue={source}
            change={setSource}
            readOnly
          />
          <TextInput label="alt عکس" currentValue={alt} change={setAlt} />
          <div className="flex items-center gap-2">
            <span className="text-sm"> وضعیت ارتباط : </span>
            <span className="text-sm">{prevData.source}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm"> shopId: </span>
            <span className="text-sm">{prevData.shopId}</span>
          </div>
          <a
            target={"_blank"}
            className={"text-blue-600 text-sm underline"}
            href={`${baseUrl}/${DOWNLOAD_FILE}/${prevData.id}`}
            rel="noreferrer"
          >
            {baseUrl}/{DOWNLOAD_FILE}/{prevData.id}
          </a>
          <div className="flex justify-between items-center mt-9 ">
            <img
              onClick={() => setOpenCreate(true)}
              src={`${baseUrl}/${DOWNLOAD_FILE}/${prevData.id}?size=tiny`}
              className="md:w-24 md:h-24 w-20 h-20"
              alt=""
            />
          </div>{" "}
          <div className="flex items-center justify-between  gap-4">
            {userPermissions?.gallery?.delete && !use.usage ? (
              /*      <Button
                                variant="contained"
                                color="error"
                                onClick={HandleDelete}
                              >
                                حذف
                              </Button> */
              <IconButton size="large" onClick={() => setConfirmDelete(true)}>
                <Delete sx={{ color: "red" }} />
              </IconButton>
            ) : (
              <div></div>
            )}{" "}
            <Button variant="contained" onClick={handleEditImage}>
              {loaded ? <CircularProgress /> : <>ثبت اطلاعات</>}
            </Button>
          </div>
        </div>
      </Modal>
      <Confirm
        message="آیا از حذف این عکس اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={HandleDelete}
        open={confirmDelete}
      />
    </>
  );
};

export default ImageGalleryEdit;
