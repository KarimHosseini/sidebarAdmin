import {
  Avatar,
  Button,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, TextInput, UploadImage } from "../../../components/common";
import DateDisplay from "../../../components/common/date";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import { Confirm } from "../../../components/modals";
import {
  baseUrl,
  DELETE_USER,
  DOWNLOAD_FILE,
  EDIT_USER,
  EDIT_USER_PASSWORD,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
const UserSummery = ({
  userData,
  avatar,
  setAvatar,
  selectedProductImage,
  setselectedProductImage,
  setUserData,
}) => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [loading, setLoading] = useState({});
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [isLegal, setIslegal] = useState(false);
  const [passWord, setPassWord] = useState("");
  useEffect(() => {
    setIslegal(userData?.isLegal);
  }, [userData]);
  const sendPassword = () => {
    setLoading({ password: true });
    var data = {
      id: userData?.id,
      newPassword: passWord,
    };
    axiosInstance
      .put(`${baseUrl}/${EDIT_USER_PASSWORD}`, data, configReq(token))
      .then((res) => {
        toast.success("رمز عبور با موفقیت تغییر کرد");
        setLoading({ password: false });
        setOpen2(false);
      })
      .catch((err) => {
        setLoading({ password: false });
        toast.error(err.response?.data?.message);
      });
  };
  const submitEdit = () => {
    setLoading({ active: true });
    axiosInstance
      .put(
        `${baseUrl}/${EDIT_USER}`,
        { ...userData, active: !userData.active },
        configReq(token)
      )
      .then((res) => {
        toast.success(`با موفقیت ${open} شد`);
        setLoading({ active: false });
        setOpen(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
        setLoading({ active: false });
      });
  };
  const navigate = useNavigate();
  const deleteUser = () => {
    axiosInstance
      .delete(`${baseUrl}/${DELETE_USER}?id=${userData?.id}`, configReq(token))
      .then((res) => {
        toast.success("با موفقیت حذف شد");
        setLoading(false);
        navigate("/users");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };
  const changeLegal = (e) => {
    axios
      .put(
        `${baseUrl}/${EDIT_USER}`,
        { ...userData, isLegal: e },
        configReq(token)
      )
      .then((res) => {
        toast.success(`با موفقیت ${!e ? "حقیقی" : "حقوقی"} کاربرشد`);
        setUserData(res.data.data);
        setIslegal(e);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };
  return (
    <div className="flex flex-col items-center py-6 gap-2">
      <Avatar sx={{ bgcolor: "#13318f", width: 75, height: 75 }}>
        {userData?.galleryId ? (
          <>
            <img
              src={`${baseUrl}/${DOWNLOAD_FILE}/${userData?.galleryId}?size=tiny`}
              alt=""
              className="w-[75px] h-[75px] rounded-full"
            />
          </>
        ) : (
          <>
            {userData?.fname?.slice(0, 1)} {userData?.lname?.slice(0, 1)}
          </>
        )}
      </Avatar>
      <div className="z-50 relative">
        {" "}
        <UploadImage
          file={avatar}
          change={setAvatar}
          /*  address={userData.galleryId} */
          selectedProductImage={selectedProductImage}
          setselectedProductImage={setselectedProductImage}
          icons={true}
        />
      </div>
      {/*       <div className="text-xs text-[#93989e] mt-5 border rounded-2xl border-[#d4dae3] py-1 px-3">
        {userData?.role === 0 ? "کاربر" : userData?.access || "ادمین"}
      </div> */}
      <div className="text-[#364a63] text-base font-semibold">
        {userData?.fname} {userData?.lname}
      </div>
      <span className="text-xs text-[#8094ae]">{userData?.mobile}</span>
      <div className="flex flex-col px-3 pt-4 pb-3 gap-2 border-t w-full mx-3">
        <div className="flex justify-between items-center gap-2">
          <span className="text-xs text-[#8094ae]"> کد کاربری : </span>
          <span className="text-xs text-[#000] font-bold">{userData?.id}</span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className="text-xs text-[#8094ae]"> آخرین ورود: </span>
          <span className="text-xs -ml-2 text-[#000] font-bold">
            <DateDisplay date={userData?.lastLogin} />
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className="text-xs text-[#8094ae]"> حساب کاربری: </span>
          <Switch
            onClick={() => setOpen(true)}
            /*  color="success" */
            checked={userData?.active}
          />
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className="text-xs text-[#8094ae]"> نوع کاربر: </span>

          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            row
          >
            <FormControlLabel
              value="female"
              control={
                <Radio
                  checked={isLegal === false}
                  onClick={() => changeLegal(false)}
                />
              }
              label="حقیقی"
            />
            <FormControlLabel
              value="male"
              control={
                <Radio
                  checked={isLegal === true}
                  onClick={() => changeLegal(true)}
                />
              }
              label="حقوقی"
            />
          </RadioGroup>
        </div>
      </div>
      {userPermissions?.user?.changepass || userPermissions?.user?.delete ? (
        <div className="flex justify-center  items-center pt-4 gap-2 border-t w-full mx-3">
          {userPermissions?.user?.delete && (
            <Button
              onClick={() => setOpen3(true)}
              sx={{ width: "140px" }}
              variant="outlined"
              color="error"
            >
              حذف
            </Button>
          )}
          {userPermissions?.user?.changepass && (
            <Button
              onClick={() => setOpen2(true)}
              sx={{
                color: "#364a63 !important",
                borderColor: "#364a63 !important",
                width: "140px",
              }}
              variant="outlined"
            >
              تغییر رمز عبور
            </Button>
          )}
        </div>
      ) : (
        <></>
      )}
      {userPermissions?.ReportUserTurnover?.view && (
        <div className="w-full flex gap-3 mx-3 px-3">
          {" "}
          <Button
            onClick={() => {
              window.open(
                `/reportUserTurnover/${userData?.id}?name=${userData?.fname} ${userData?.lname}`,
                "_blank"
              );
            }}
            disabled={!userPermissions?.ReportUserTurnover?.view}
            variant="outlined"
            fullWidth
          >
            گزارش مالی
          </Button>{" "}
          <Button
            onClick={() => {
              window.open(
                `/reportUserTurnoverFacility/${userData?.id}?name=${userData?.fname} ${userData?.lname}`,
                "_blank"
              );
            }}
            disabled={!userPermissions?.ReportUserTurnover?.view}
            variant="outlined"
            fullWidth
          >
            گزارش مالی تسهیلاتی
          </Button>
        </div>
      )}

      <Modal
        open={open}
        close={() => {
          setOpen(false);
        }}
        title={`آیا از تغییر وضعیت کاربر   اطمینان دارید ؟ `}
      >
        <div className="flex justify-center gap-4 items-center">
          <Button
            disabled={loading?.active}
            onClick={submitEdit}
            variant="contained"
          >
            {loading?.active ? <CircularProgress /> : <>ثبت اطلاعات</>}
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            color="error"
            variant="contained"
          >
            انصراف
          </Button>
        </div>
      </Modal>
      <Modal
        open={open2}
        close={() => {
          setOpen2(false);
          setPassWord("");
        }}
        title="انتخاب  پسورد جدید"
      >
        <div className="flex justify-center gap-4 items-center">
          <TextInput
            label=" پسورد"
            currentValue={passWord}
            change={(e) => setPassWord(e)}
          />
        </div>
        <Button
          disabled={loading?.password || !passWord}
          onClick={sendPassword}
          variant="contained"
        >
          {loading?.password ? <CircularProgress /> : <>ثبت اطلاعات</>}
        </Button>
      </Modal>
      <Confirm
        message={`آیا از  حذف این  کاربر   اطمینان دارید ؟ `}
        close={() => setOpen3(false)}
        submit={deleteUser}
        open={open3}
      />
    </div>
  );
};

export default UserSummery;
