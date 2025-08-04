/* eslint-disable array-callback-return */
/* eslint-disable no-loop-func */
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button, CircularProgress } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { baseUrl } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import axiosInstance from "../dataFetch/axiosInstance";
import Font from "./font";
import HeaderSelectionModal from "./HeaderSelectionModal";
import Logo from "./logo";

const Exports = ({
  filter,
  header,
  data,
  selectedData,
  variant = "contained",
  name = "خروجی ",
  title,
  api,
  param = false,
  extraParams = false,
  sumbitSearch = false,
  disabled = false,
  hasExtraParamsOnLink = false,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loading, setloading] = React.useState(false);
  const [loading2, setloading2] = React.useState(false);
  const [loading3, setloading3] = React.useState(false);
  const open = Boolean(anchorEl);
  const { companyInfo } = useSelector((state) => state.relationals);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHeaders, setSelectedHeaders] = useState([]);
  const [datas, setDatas] = useState({ header: [], body: [] });
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleConfirmHeaders = (headers) => {
    setSelectedHeaders(headers);
    handleCloseModal();

    generatePDF(headers, Logo);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { token } = useSelector((state) => state.user);
  const allExels = (datas) => {
    var name = "";
    filter?.map((item) => {
      if (item.isDate) {
        name += " - " + new Date(item.date).toLocaleDateString("fa-IR");
      }
    });
    var temp = [...datas?.body];
    temp.unshift(datas.header);
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.aoa_to_sheet(temp);
    try {
      const validTitle = title.slice(0, 31);

      XLSX.utils.book_append_sheet(wb, ws, validTitle);

      XLSX.writeFile(
        wb,
        `${
          title.slice(0, 15) +
          " " +
          (name ? name.slice(3) : new Date().toLocaleDateString("fa-IR"))
        }.xlsx`
      );
    } catch (error) {}

    handleClose();
  };
  const generatePDF = (selectedHeaders, logoBase64) => {
    const doc = new jsPDF();

    // Add Persian font
    doc.addFileToVFS("Vazir.ttf", Font);
    doc.addFont("Vazir.ttf", "Vazir", "normal");
    doc.setFont("Vazir");

    // Filter headers and body based on selected headers
    const filteredHeaderIndexes = datas.header
      .map((header, index) => (selectedHeaders.includes(header) ? index : -1))
      .filter((index) => index !== -1);

    const filteredHeaders = filteredHeaderIndexes.map(
      (index) => datas.header[index]
    );
    const filteredBody = datas.body.map((row) =>
      filteredHeaderIndexes.map((index) => row[index])
    );

    // Add watermark logo and big title to each page
    const addPageDecorations = () => {
      if (logoBase64) {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Add the logo faintly in the background
        doc.setGState(new doc.GState({ opacity: 0.1 })); // Set low opacity
        doc.addImage(
          logoBase64,
          "PNG",
          pageWidth / 4,
          pageHeight / 4,
          pageWidth / 2,
          pageHeight / 3
        );
        doc.setGState(new doc.GState({ opacity: 1 })); // Reset opacity for other elements
      }

      // Add big company name at the top center
      /*  const companyName = companyInfo?.companyName || "Your Company Name";
            doc.setFontSize(20);
            doc.setTextColor(50); // Dark gray color
            doc.text(companyName, doc.internal.pageSize.getWidth() / 2, 20, {
              align: "center",
            }); */
    };

    // Add table to PDF
    doc.autoTable({
      head: [filteredHeaders], // Use filtered headers
      body: filteredBody, // Use filtered body rows
      startY: 40,
      theme: "grid",
      styles: {
        font: "Vazir",
        fontSize: 8,
        cellPadding: 1,
        overflow: "linebreak", // Wrap content by words
        wordBreak: "break-word", // Break long words when needed
      },
      headStyles: {
        fillColor: [255, 165, 0], // Orange header background
        textColor: 255, // White text for headers
        fontSize: 8,
        halign: "center",
      },
      bodyStyles: {
        halign: "right", // Align Persian text to the right
      },
      didDrawPage: (data) => {
        // Add watermark and big title to each page
        addPageDecorations();

        // Add centered footer with current time
        const currentDateTime = new Date().toLocaleString("fa-IR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        doc.setFontSize(10);
        doc.text(
          `تاریخ و زمان: ${currentDateTime}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.height - 10, // Bottom of the page
          { align: "center" }
        );
      },
    });

    // Save the PDF
    doc.save(`${title ? title : `${process.env.REACT_APP_COMPANY_TITLE}`}.pdf`);
  };

  const allData = (chooseSelected, chooseFilter, isPdf) => {
    var params = "";
    var temp = "";
    if (chooseSelected) {
      setloading3(true);
      selectedData.forEach((id) => {
        params += `,${id}`;
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

    axiosInstance(
      `${baseUrl}/${api}${
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
        const contentDisposition = res.headers["content-disposition"];
        let filename = `${name}.xlsx`;
        if (contentDisposition && contentDisposition.includes("filename=")) {
          filename = contentDisposition
            .split("filename=")[1]
            .split(";")[0]
            .replace(/['"]/g, "");
        }
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

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
        variant={variant}
        color="warning"
        onClick={handleClick}
        disabled={disabled}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {name}
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
              allData(true, false);
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
        <MenuItem onClick={() => allData(false, true)} disableRipple>
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
        <MenuItem onClick={() => allData(false, false)} disableRipple>
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
        {/* ---- for PDF ----- */}{" "}
        {/*     <MenuItem
          onClick={() => {
            if (selectedData && selectedData.length > 0) {
              allData(true, false, true);
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
          خروجی PDF موارد انتخاب شده
        </MenuItem>
        <MenuItem onClick={() => allData(false, true, true)} disableRipple>
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
          خروجی PDF براساس فیلتر
        </MenuItem>
        <MenuItem onClick={() => allData(false, false, true)} disableRipple>
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
          خروجی PDF کلی
        </MenuItem> */}
      </StyledMenu>{" "}
      <HeaderSelectionModal
        open={modalOpen}
        onClose={handleCloseModal}
        headers={datas.header}
        onConfirm={handleConfirmHeaders}
      />
    </div>
  );
};

export default Exports;
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
/*   var range = XLSX.utils.decode_range(ws["!ref"]);
    for (var C = range.s.c; C <= range.e.c; ++C) {
      var address = XLSX.utils.encode_col(C) + "1";
      if (!ws[address]) continue;
      var finded = header?.find((item) => item.name === ws[address].v);
      if (finded) {
        ws[address].v = finded.title;
      }
    } */
