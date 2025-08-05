import React, { useState } from "react";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button, CircularProgress } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { configReq } from "../../helpers/functions";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, CHANGE_ALL_ORDER_STATE } from "../../helpers/api-routes";
import { Modal } from "../../components/common";
import { Confirm } from "../../components/modals";
const ChangeAll = ({
  selectedData,
  filter,
  extraParams,
  sumbitSearch,
  hasExtraParamsOnLink,
  setRefresh,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setloading] = React.useState(false);
  const [loading2, setloading2] = React.useState(false);
  const [loading3, setloading3] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState({
    filter: false,
    selected: false,
  });

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { token } = useSelector((state) => state.user);
  const allData = (chooseSelected, chooseFilter, isPdf) => {
    var params = "";
    var temp = "";
    if (chooseSelected) {
      setloading3(true);
      selectedData.map((items) => {
        params += `,${items.id}`;
      });
      /*  */
    }
    if (chooseFilter) {
      setloading2(true);
      filter.map((item, index) => {
        temp += `&filter[${index}][key]=${item?.name}&filter[${index}][value]=${item?.value}&filter[${index}][operator]=${item?.type}`;
      });
      if (sumbitSearch) {
        temp += `&search=${sumbitSearch}`;
      }
    }
    if (!chooseSelected && !chooseFilter) {
      setloading(true);
      temp =
        "?filter[0][key]=defaultFilter&filter[0][value]=false&filter[0][operator]=eq";
    }

    axiosInstance
      .post(
        `${baseUrl}/${CHANGE_ALL_ORDER_STATE}${
          extraParams && extraParams.value
            ? `?${extraParams.name}=${extraParams.value}`
            : ""
        }${
          params
            ? `${
                extraParams || hasExtraParamsOnLink ? "&" : "?"
              }ids=${params.slice(
                1
              )}&filter[0][key]=defaultFilter&filter[0][value]=false&filter[0][operator]=eq`
            : temp
            ? `${extraParams ? "&" : "?"}${temp.slice(1)}`
            : ""
        }`,
        {},
        { ...configReq(token) }
      )
      .then((res) => {
        setRefresh(true);
        toast.success("وضعیت با موفقیت تغییر کرد");
        setloading(false);
        setloading2(false);
        setloading3(false);
        handleClose();
      })
      .catch((err) => {
        setloading(false);
        setloading2(false);
        setloading3(false);
      });
  };
  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant={"outlined"}
        color="secondary"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        تغییر وضعیت تجمیعی
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            if (selectedData && selectedData.length > 0) {
              setOpenModal(true);
              setSaveStatus({ filter: false, selected: true });
            } else {
              toast.error("موردی انتخاب نشده است");
            }
          }}
          disableRipple
        >
          {loading3 ? (
            <CircularProgress
              sx={{
                width: "12px !important",
                height: "12px !important",
                mx: 1,
              }}
            />
          ) : (
            <FileDownloadIcon />
          )}
          خروجی موارد انتخاب شده
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenModal(true);
            setSaveStatus({ filter: true, selected: false });
          }}
          disableRipple
        >
          {loading2 ? (
            <CircularProgress
              sx={{
                width: "12px !important",
                height: "12px !important",
                mx: 1,
              }}
            />
          ) : (
            <FileDownloadIcon />
          )}
          خروجی براساس فیلتر
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenModal(true);
            setSaveStatus({ filter: false, selected: false });
          }}
          disableRipple
        >
          {loading ? (
            <CircularProgress
              sx={{
                width: "12px !important",
                height: "12px !important",
                mx: 1,
              }}
            />
          ) : (
            <FileDownloadIcon />
          )}
          خروجی کلی
        </MenuItem>
      </StyledMenu>{" "}
      <Confirm
        open={openModal}
        close={() => setOpenModal(false)}
        message="تغییر وضعیت تجمیعی"
        description={
          saveStatus.filter
            ? "براساس فیلتر های انتخاب شده اطمینان دارید"
            : saveStatus.selected
            ? `براساس ${selectedData.length}  مورد انتخاب شده اطمینان دارید `
            : "تمام موارد  اطمینان دارید"
        }
        submit={() => allData(saveStatus.selected, saveStatus.filter)}
      />
    </div>
  );
};

export default ChangeAll;
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));
