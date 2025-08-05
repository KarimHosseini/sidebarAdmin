/* eslint-disable array-callback-return */
/* eslint-disable no-loop-func */
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button, CircularProgress } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import "jspdf-autotable";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import { Confirm } from "../../../components/modals";
import { baseUrl, SYNC_PRODUCTS } from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";

const SyncProducts = ({
  filter,
  selectedData,
  variant = "contained",
  extraParams = false,
  sumbitSearch = false,
  disabled = false,
  hasExtraParamsOnLink = false,
  handleReload,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loading, setloading] = React.useState(false);
  const [loading2, setloading2] = React.useState(false);
  const [loading3, setloading3] = React.useState(false);
  const open = Boolean(anchorEl);
  const [savedData, setSavedData] = useState({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { token } = useSelector((state) => state.user);
  const allData = (chooseSelected, chooseFilter) => {
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
      if (filter.length === 0) {
        toast.error("فیلتر خالی است");
        return;
      }
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

    axiosInstance(
      `${baseUrl}/${SYNC_PRODUCTS}${
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
      { ...configReq(token), responseType: "blob" }
    )
      .then((res) => {
        handleReload();
        toast.success("با موفقیت سینک شد")
        setloading(false);
        setloading2(false);
        setloading3(false);
        handleClose();
        setOpenConfirm(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
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
        variant={variant}
        color="primary"
        onClick={handleClick}
        disabled={disabled}
        endIcon={<KeyboardArrowDownIcon />}
      >
        سینک محصولات به حسابداری آرپا
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
              setSavedData({ chooseSelected: true, chooseFilter: false });
              setOpenConfirm(true);
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
          سینک موارد انتخاب شده
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSavedData({ chooseSelected: false, chooseFilter: true });
            setOpenConfirm(true);
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
          سینک براساس فیلتر
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSavedData({ chooseSelected: false, chooseFilter: false });
            setOpenConfirm(true);
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
          سینک کلی
        </MenuItem>
      </StyledMenu>{" "}
      <Confirm
        message={
          <>
            آیا از سینک محصولات{" "}
            {savedData.chooseSelected
              ? "بر اساس موارد انتخاب شده"
              : savedData.chooseFilter
              ? "براساس فیلتر انتخاب شده"
              : "به صورت کلی"}{" "}
            اطمینان دارید ؟‌
          </>
        }
        close={() => setOpenConfirm(false)}
        submit={() => allData(savedData.chooseSelected, savedData.chooseFilter)}
        open={openConfirm}
      />
    </div>
  );
};

export default SyncProducts;
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
