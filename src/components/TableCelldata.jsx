/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Add, Edit, MoreHoriz } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import ReactHtmlParse from "html-react-parser";
import { Fragment, useState } from "react";
import JSONPretty from "react-json-prettify";
import { darkula, githubGist } from "react-json-prettify/dist/themes";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { baseUrl } from "../helpers/api-routes";
import { configReq } from "../helpers/functions";
import { Modal, ShowImage } from "./common";
import DateDisplay from "./common/date";

import axiosInstance from "./dataFetch/axiosInstance";
const TableCelldata = ({
  row,
  item,
  rows,
  setAllRows,
  editApi,
  editInputApi,
}) => {
  const { themeColor } = useSelector((state) => state.themeColor);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [reason, setReason] = useState("");
  const [Changed, setChanged] = useState(null);
  const { userPermissions } = useSelector((state) => state.relationals);

  function objStyle(i) {
    if (themeColor === "dark") {
      if (i.styleDark) {
        var jsonStr = i.styleDark.replace(/(\w+:)|(\w+ :)/g, function (s) {
          return '"' + s.substring(0, s.length - 1) + '":';
        });

        return JSON.parse(jsonStr);
      } else {
        return {};
      }
    } else {
      if (i?.style) {
        var jsonStrW = i.style.replace(/(\w+:)|(\w+ :)/g, function (s) {
          return '"' + s.substring(0, s.length - 1) + '":';
        });

        return JSON.parse(jsonStrW);
      } else {
        return {};
      }
    }
  }
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token, userId } = useSelector((state) => state.user);
  const handleActive = () => {
    if (editApi) {
      setLoading(true);
      var temp = [...rows];
      axiosInstance
        .put(`${baseUrl}/${editApi}`, { id: row.id }, configReq(token))
        .then((res) => {
          setLoading(false);
          toast.success("با موفقیت ویرایش شد");
          var index = temp.findIndex((item) => item.id === row.id);
          temp[index] = res.data.data;
          setAllRows(temp);
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
        });
    }
  };
  const handleInput = (value, name) => {
    if (editInputApi) {
      axiosInstance
        .put(
          `${baseUrl}/${editInputApi}`,
          { ...row, [name]: value },
          configReq(token)
        )
        .then((res) => {
          toast.success("با موفقیت ویرایش شد");
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
        });
    }
  };
  const handleClick = () => {
    if (editInputApi) {
      axiosInstance
        .post(
          `${baseUrl}/${editInputApi}`,
          { UserId: row.id, Reason: reason, EditorId: userId },
          configReq(token)
        )
        .then((res) => {
          setOpen2(false);
          setChanged(Changed !== null ? !Changed : !row[item.name]);
          toast.success("با موفقیت ویرایش شد");
          setReason("");
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
        });
    }
  };
  return (
    <Box sx={objStyle(item)}>
      {item.type === "image" ? (
        <ShowImage address={row[item.name]} />
      ) : item.type === "active" ? (
        <div className="relative">
          {loading && <CircularProgress className="absolute top-2 right-0" />}

          <Switch
            disabled={loading || !editApi}
            onClick={handleActive}
            /*  color="success" */
            checked={row[item.name]}
          />
        </div>
      ) : item.type === "date" ? (
        <>
          {" "}
          <DateDisplay date={row[item.name]} />
        </>
      ) : item.type === "dateTime" ? (
        <>
          {String(new Date(row[item.name]).getMinutes()).padStart(2, "0")}:
          {String(new Date(row[item.name]).getHours()).padStart(2, "0")}
        </>
      ) : item.type === "date2" ? (
        <>{new Date(row[item.name]).toLocaleDateString("fa-IR")}</>
      ) : item.type === "price" ? (
        <>
          {row[item.name] !== null ? (
            <>
              {" "}
              {Number(row[item.name])?.toLocaleString()} <small>تومان</small>{" "}
            </>
          ) : (
            <></>
          )}
        </>
      ) : item.type === "gr" ? (
        <>
          {Number(row[item.name])} <small>گرم</small>{" "}
        </>
      ) : item.type === "status" ? (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              /*   justifyContent: "center",
                mr: 3, */
            }}
          >
            <Box
              sx={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: row[item.name] ? "#2e7d32" : "#d32f2f",
                mx: 1,
              }}
            ></Box>
            {row[item.name] ? "فعال" : "غیر فعال"}
          </Box>
        </>
      ) : item.type === "qty" ? (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              /*   justifyContent: "center",
            mr: 3, */
            }}
          >
            <Box
              sx={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: row[item.name] ? "#2e7d32" : "#d32f2f",
                mx: 1,
              }}
            ></Box>
            {row[item.name] ? "موجود" : "نا موجود"}
          </Box>
        </>
      ) : item.type === "items" ? (
        <>
          {row.values?.length > 0 ? (
            <>
              {row.values?.map((val, i) => {
                if (row.values?.length < 1 || i < 1) {
                  return <Chip label={val.title} sx={{ m: "2px" }} key={i} />;
                } else if (i === 2) {
                  return <MoreHoriz sx={{ verticalAlign: "bottom" }} />;
                } else {
                  return null;
                }
              })}
              <IconButton
                onClick={() => {
                  navigate(`/attributes/values/${row?.id}`);
                }}
              >
                <Edit color="warning" />
              </IconButton>
            </>
          ) : (
            <IconButton
              onClick={() =>
                navigate(`/attributes/values/${row?.id}`, {
                  state: {
                    rows: row?.values,
                    title: row?.title,
                    type: row?.type,
                  },
                })
              }
            >
              <Add color="success" />
            </IconButton>
          )}
        </>
      ) : item.type === "tag" ? (
        <>
          {row[item.name] && row[item.name]?.split(",") ? (
            <>
              {row[item.name]?.split(",")?.map((val, i) => {
                if (row[item.name]?.split(",")?.length < 1 || i < 1) {
                  return (
                    <Chip
                      label={row[item.name]?.split(",")[i + 1]}
                      sx={{ m: "2px" }}
                      key={i}
                    />
                  );
                } else if (i === 2) {
                  return <MoreHoriz sx={{ verticalAlign: "bottom" }} />;
                } else {
                  return null;
                }
              })}
            </>
          ) : (
            <></>
          )}
        </>
      ) : item.type === "enum" ? (
        <>
          {item.enums?.map((t, index) => (
            <Fragment key={index + t.title + "pp"}>
              {String(t.value) === String(row[item.name]) ? (
                <Box sx={objStyle(t)}>{t.title}</Box>
              ) : (
                <></>
              )}
            </Fragment>
          ))}
        </>
      ) : item.type === "attrib" ? (
        <>
          {" "}
          {row[item.name]?.type === 1 ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {!row[item.name]?.galleryId ? (
                <Avatar
                  sx={{
                    background: row[item.name]?.value,
                    border: "1px solid gray",
                    width: "18px",
                    height: "18px",
                  }}
                >
                  &nbsp;
                </Avatar>
              ) : (
                <ShowImage
                  smallImage={true}
                  address={row[item.name]?.galleryId}
                />
              )}

              {row[item.name]?.title}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {row[item.name] && (
                <>
                  {row[item.name]?.attrib} /{row[item.name]?.title}
                </>
              )}
            </Box>
          )}
        </>
      ) : item.type === "bool" ? (
        <>
          {" "}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              /*   justifyContent: "center",
            mr: 3, */
            }}
          >
            <Box
              sx={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: row[item.name] ? "#2e7d32" : "#d32f2f",
                mx: 1,
              }}
            ></Box>
            {row[item.name] ? "بلی" : "خیر"}
          </Box>
        </>
      ) : item.type === "stringArray" ? (
        <>
          {" "}
          {row[item.name].length > 0 ? (
            <div className="flex gap-1 items-center justify-center">
              <MoreHoriz sx={{ verticalAlign: "bottom" }} /> ,
              {row[item.name][0]}
            </div>
          ) : (
            row[item.name][0]
          )}
        </>
      ) : item.type === "input" ? (
        <>
          <input
            type={"number"}
            className="border rounded-md h-7 w-16 px-3 py-2 bg-transparent"
            defaultValue={row[item.name]}
            onChange={(e) => handleInput(e.target.value, item.name)}
          />
        </>
      ) : item.type === "link" ? (
        <>
          {row[item.name] && (
            <Link target={"_blank"} to={`${item.link}/${row[item.name]}`}>
              <Typography
                sx={{
                  textAlign: "center",
                  p: 1,
                  background: (theme) =>
                    theme.palette.mode === "light" ? "#fdf2f2" : "#47402b",
                  width: { md: "70%", xs: "100%" },
                  cursor: "pointer",
                  fontWeight: "400 !important",
                  "&:hover": {
                    background: (theme) =>
                      theme.palette.mode === "light"
                        ? "rgb(253 224 71)"
                        : "#A75707",
                  },
                }}
                /*    component="mark" */
                variant="body2"
                className=" rounded-md"
              >
                {row[item.name]}
              </Typography>
            </Link>
          )}
        </>
      ) : item.type === "tel" ? (
        <>
          {row[item.name] && (
            <a
              target={"_blank"}
              rel="noreferrer"
              href={`tel:${row[item.name]}`}
            >
              {row[item.name]}
            </a>
          )}
        </>
      ) : item.type === "redirect" ? (
        <>
          {row[item.name] && (
            <Link target={"_blank"} to={`${row[item.name]}`}>
              <Button variant="outlined">مشاهده</Button>
            </Link>
          )}
        </>
      ) : item.type === "urlLink" ? (
        <>
          {row[item.name] && (
            <Typography
              href={`${process.env.REACT_APP_DOMAIN_URL}${
                item.link ? item.link : ""
              }${row[item.name]}`}
              target={"_blank"}
              rel="noreferrer"
              className="text-xs transition"
              component={"a"}
              sx={{
                textAlign: "center",
                p: "4px",
                fontSize: "0.75rem !important",
                background: (theme) =>
                  theme.palette.mode === "light" ? "#fdf2f2" : "#47402b",
                width: { md: "70%", xs: "100%" },
                cursor: "pointer",
                fontWeight: "400 !important",
                "&:hover": {
                  background: (theme) =>
                    theme.palette.mode === "light"
                      ? "rgb(253 224 71)"
                      : "#A75707",
                },
              }}
            >
              {row[item.name]}
            </Typography>
          )}
        </>
      ) : item.type === "objectfield" ? (
        <>{row[item.name][item.link]}</>
      ) : item.type === "json" ? (
        <>
          <Button onClick={() => setOpen(true)}>مشاهده</Button>
        </>
      ) : item.type === "highLight" ? (
        <div className="border-2 rounded-md flex justify-center items-center px-3 py-1">
          {row[item.name]}
        </div>
      ) : item.type === "html" ? (
        <div>{row[item.name] ? ReactHtmlParse(row[item.name]) : ""}</div>
      ) : item.type === "lock" ? (
        <>
          {!userPermissions?.walletLockHistory?.view ? (
            <></>
          ) : (
            <>
              {" "}
              {Changed !== null ? (
                Changed === false ? (
                  <>
                    {" "}
                    <Button
                      disabled={!userPermissions?.walletLockHistory?.edit}
                      onClick={() => setOpen2(true)}
                      variant="outlined"
                      color="error"
                    >
                      قفل کردن کیف پول
                    </Button>
                  </>
                ) : (
                  <>
                    {" "}
                    <Button
                      disabled={!userPermissions?.walletLockHistory?.edit}
                      onClick={() => setOpen2(true)}
                      variant="outlined"
                      color="success"
                    >
                      آزاد سازی کیف پول
                    </Button>
                  </>
                )
              ) : (
                <>
                  {" "}
                  {!row[item.name] ? (
                    <Button
                      disabled={!userPermissions?.walletLockHistory?.edit}
                      onClick={() => setOpen2(true)}
                      variant="outlined"
                      color="error"
                    >
                      قفل کردن کیف پول
                    </Button>
                  ) : (
                    <Button
                      disabled={!userPermissions?.walletLockHistory?.edit}
                      onClick={() => setOpen2(true)}
                      variant="outlined"
                      color="success"
                    >
                      آزاد سازی کیف پول
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </>
      ) : (
        <> {row[item.name]} </>
      )}
      <Modal open={open} close={() => setOpen(false)} title="جزئیات درخواست">
        <div className="ltr">
          <JSONPretty
            json={open ? JSON.parse(row[item.name]) : {}}
            theme={themeColor === "dark" ? darkula : githubGist}
          ></JSONPretty>
          {/*               <pre>{JSON.stringify(row[item.name], null, 2)}</pre>
           */}{" "}
        </div>
      </Modal>
      <Modal
        open={open2}
        close={() => {
          setOpen2(false);
          setReason("");
        }}
        title="جزئیات درخواست"
      >
        <div className="flex flex-col gap-3 mb-5">
          <span>لطفا توضیحات را بنویسید</span>
          <TextField
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            label="توضیحات"
            multiline
            rows={3}
          />
          <div className="flex justify-end">
            <Button onClick={handleClick} variant="contained">
              ثبت اطلاعات
            </Button>
          </div>
        </div>
      </Modal>
    </Box>
  );
};
export default TableCelldata;
