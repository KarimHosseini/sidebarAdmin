import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import { Checkbox, FormControlLabel, IconButton, Popover } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import { Confirm } from "../../../components/modals";
import { baseUrl, REMOVE_USER_ADDRESS } from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import AddressModal from "./addressModal";
const Address = ({ adrs, province, userData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [allAdress, setAllAddress] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const openPopOver = Boolean(anchorEl);
  const { token } = useSelector((state) => state.user);

  const id = openPopOver ? "simple-popover" : undefined;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const [editingData, setEditingData] = useState({});
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    setAllAddress(adrs);
  }, [adrs]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const handleDelete = () => {
    setConfirmDelete(true);
    setAnchorEl(null);
  };
  const deleteAttr = () => {
    /*     setLoading(true);
     */ axiosInstance
      .delete(
        `${baseUrl}/${REMOVE_USER_ADDRESS}?id=${editingData.id}`,
        configReq(token)
      )
      .then((res) => {
        var temp = [...allAdress];
        var newData = temp.filter((item) => item.id !== editingData.id);
        setAllAddress(newData);
        setConfirmDelete(false);
        toast.success("با موفقیت حذف شد");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);

        /*       if (err.response.status === 401) {
          dispatch(logout());
        } */
      });
  };
  /*   const changeActive = (item) => {
    var tt = { ...item };
    for (var prop in tt) {
      if (tt[prop] === "" || tt[prop] === null) {
        delete tt[prop];
      }
    }
    axios
      .put(`${baseUrl}/${EDIT_USER_ADDRESS}`, {
        ...tt,
        userId: id,
        isDefault: true,
      })
      .then((res) => {
        var temp = [...allAdress];
        for (var i = 0; i < temp.length; i++) {
          if (temp[i]?.id === item.id) {
            temp[i] = res.data.data;
          } else {
            temp[i] = { ...temp[i], isDefault: false };
          }
        }

        setAllAddress(temp);
        toast.success("با موفقیت ویرایش شد");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  }; */
  return (
    <div className="flex items-center gap-4 flex-wrap ">
      {allAdress?.map((item, index) => (
        <div>
          <Box
            sx={{
              width: { md: 350, xs: "100%" },
              borderWidth: "1px",
              borderColor: "",
            }}
            key={index}
            className="py-4 border border-blue-500  md:min-h-[150px] rounded pr-2 pl-10 relative"
          >
            <Box
              sx={{ justifyContent: "start" }}
              className="py-4 flex items-center"
            >
              <span className="text-sm text-gray-500 inline-block">
                {item.province} , {item.city} ,{item.address}
              </span>
              <IconButton
                onClickCapture={() => setEditingData(item)}
                onClick={handleClick}
              >
                <MoreVertIcon className="text-lg" />
              </IconButton>
              <Popover
                id={id}
                open={openPopOver}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <div className="flex flex-col gap-4 py-5 px-3">
                  <div
                    onClick={() => {
                      handleDelete();
                    }}
                    className="flex items-center gap-3 text-red-600 cursor-pointer"
                  >
                    <DeleteIcon /> <span>حذف</span>
                  </div>
                  <div
                    onClick={() => {
                      setAnchorEl(null);
                      setOpenEdit(true);
                    }}
                    className="flex items-center gap-3 text-yellow-700 cursor-pointer"
                  >
                    <EditIcon /> <span>ویرایش</span>
                  </div>
                </div>
              </Popover>
            </Box>

            <div className="flex flex-col gap-3 pb-4">
              <div className="flex text-xs text-gray-500 gap-2 items-center">
                <PersonIcon className="font-bold text-lg" />
                {item.receptorFname} {item.receptorLname}
              </div>
              <div className="flex text-xs text-gray-500 gap-2 items-center">
                <LocalPhoneIcon className="font-bold text-lg" />
                {item.receptorMobile}
              </div>
              <div className="flex text-xs text-gray-500 gap-2 items-center">
                <EmailIcon className="font-bold text-lg" />
                {item.postalCode}
              </div>
            </div>
            <div className="absolute left-8  bottom-8">
              <FormControlLabel
                control={
                  <Checkbox
                    /* disabled */ checked={item.isDefault}
                    size="small"
                  />
                }
                label={
                  <span className="text-xs font-semibold ">نشانی پیش فرض</span>
                }
              />
            </div>
          </Box>
        </div>
      ))}{" "}
      <Box
        onClick={() => {
          setOpenCreate(true);
        }}
        sx={{
          width: { md: 350, xs: "100%" },
          borderWidth: "1px",
          borderColor: "",
          minHeight: "177px",
          background: (theme) =>
            theme.palette.mode === "light" ? "#ebf5ff" : "#0a233d",
        }}
        className="py-4 border border-dashed cursor-pointer border-blue-500 
     md:min-h-[150px] rounded flex flex-col justify-center items-center gap-2"
      >
        <AddLocationAltOutlinedIcon className="text-[#0082fd] text-2xl" />

        <span className="text-[#0082fd] text-sm">افزودن نشانی جدید</span>
      </Box>
      <AddressModal
        open={openEdit || openCreate}
        forEdit={openEdit}
        prevData={editingData}
        setAllRows={setAllAddress}
        userData={userData}
        allRows={allAdress}
        close={() => {
          setOpenCreate(false);
          setOpenEdit(false);
          setEditingData({});
        }}
        province={province}
      />
      <Confirm
        message="آیا از حذف این نشانی اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
    </div>
  );
};

export default Address;
