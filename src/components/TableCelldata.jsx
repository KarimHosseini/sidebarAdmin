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
  TableCell,
} from "@mui/material";
import ReactHtmlParse from "html-react-parser";
import { Fragment, useState, memo, useCallback } from "react";
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

const TableCelldata = memo(({
  row,
  item,
  index,
  rows,
  setAllRows,
  editApi,
  editInputApi,
  performanceManager,
  onCellUpdate,
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
  
  const handleActive = useCallback(() => {
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
          // Update via performance manager if available
          if (onCellUpdate && res.data.data[item.name] !== undefined) {
            onCellUpdate(res.data.data[item.name]);
          }
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
        });
    }
  }, [editApi, row.id, rows, token, setAllRows, item.name, onCellUpdate]);
  
  const handleInput = useCallback((value, name) => {
    if (editInputApi) {
      axiosInstance
        .put(
          `${baseUrl}/${editInputApi}`,
          { ...row, [name]: value },
          configReq(token)
        )
        .then((res) => {
          toast.success("با موفقیت ویرایش شد");
          // Update via performance manager if available
          if (onCellUpdate) {
            onCellUpdate(value);
          }
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
        });
    }
  }, [editInputApi, row, token, onCellUpdate]);

  const renderCellContent = () => {
    if (item.type === "switch") {
      return loading ? (
        <CircularProgress size={25} />
      ) : (
        <Switch
          onClick={handleActive}
          checked={
            row[item.name] === true ||
            row[item.name] === "true" ||
            row[item.name] === 1
          }
        />
      );
    } else if (item.type === "edit") {
      return (
        <TextField
          variant="standard"
          sx={{ width: "100%" }}
          defaultValue={
            item.isObject === true && row[item.name]
              ? row[item.name][item.subName || "title"]
              : row[item.name]
          }
          onBlur={(e) => {
            if (Changed) {
              handleInput(e.target.value, item.name);
            }
          }}
          onChange={(e) => setChanged(e.target.value)}
        />
      );
    } else if (item.type === "object") {
      return row[item.name] ? (
        <span style={objStyle(row[item.name])}>
          {row[item.name] &&
            (row[item.name][item.subName || "title"] ||
              row[item.name][item.subName || "name"])}
        </span>
      ) : (
        <></>
      );
    } else if (item.type === "more") {
      return (
        <div>
          <IconButton onClick={() => setOpen(true)}>
            <MoreHoriz />
          </IconButton>
        </div>
      );
    } else if (item.type === "date") {
      return <DateDisplay date={row[item.name]} />;
    } else if (item.type === "chip") {
      return (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {row[item.name] &&
            row[item.name]?.map((i, index) => (
              <Chip
                key={index}
                onClick={() => navigate(item.navigate + i?.id)}
                label={
                  item.isObject === true
                    ? i?.[item.subName || "title"]
                    : i || ""
                }
                variant="filled"
              />
            ))}
        </Box>
      );
    } else if (item.type === "json") {
      return (
        <div dir="ltr">
          <JSONPretty
            json={row[item.name]}
            theme={themeColor === "dark" ? darkula : githubGist}
          />
        </div>
      );
    } else if (item.type === "link") {
      return (
        <Link
          className=" text-blue-400 text-sm underline underline-offset-2"
          to={`${item.to}${row[item.name] ? row[item.name] : row.id}`}
          target="_blank"
        >
          {item.linkTitle}
        </Link>
      );
    } else if (item.type === "multiType") {
      return row[item.name] &&
        typeof row[item.name] === "object" &&
        row[item.name].length > 0 ? (
        <div>
          <Button
            onClick={() => setOpen2(true)}
            variant="outlined"
            startIcon={<Add />}
          >
            مشاهده همه ({row[item.name]?.length || 0})
          </Button>
        </div>
      ) : (
        <Typography>{row[item.name]}</Typography>
      );
    } else if (item.type === "image") {
      return row[item.name] ? (
        <Avatar
          sx={{
            margin: "auto",
            borderRadius: item.imgType === "product" ? 0 : "",
          }}
          variant={item.imgType === "product" ? "square" : "circular"}
          src={`${baseUrl}/file/${row[item.name]}`}
        />
      ) : (
        <></>
      );
    } else if (item.type === "editButton") {
      return (
        <IconButton
          size="small"
          onClick={() => {
            navigate(item.linkEdit + row.id);
          }}
        >
          <Edit />
        </IconButton>
      );
    } else if (item.type === "style") {
      return <span style={objStyle(row)}>{row[item.name]}</span>;
    } else if (item.type === "html") {
      return ReactHtmlParse(row[item.name] || "");
    } else if (item.type === "tooltip") {
      return item.showMax ? (
        row[item.name] ? (
          row[item.name].toString().length > item.showMax ? (
            <span title={row[item.name]}>
              {row[item.name]
                ? row[item.name].toString().slice(0, item.showMax)
                : ""}
              ...
            </span>
          ) : (
            <>{row[item.name]}</>
          )
        ) : (
          <></>
        )
      ) : (
        <span title={row[item.name]}>{row[item.name]}</span>
      );
    } else if (item.type === "price") {
      return <>{row[item.name] ? row[item.name]?.toLocaleString() : 0}</>;
    } else if (item.type === "inObject") {
      let temp = row;
      item.path.map((p) => {
        temp = temp?.[p];
      });
      return (
        <>
          {temp
            ? temp.toString() === "true"
              ? "فعال"
              : temp.toString() === "false"
              ? "غیر فعال"
              : temp?.toLocaleString && item.isPrice
              ? temp?.toLocaleString()
              : temp
            : ""}
        </>
      );
    } else if (item.type === "inObjectArray") {
      let temp = row;
      item.path.map((p) => {
        temp = temp?.[p];
      });
      return (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {temp?.map((v, i) => (
            <Chip key={i} label={v[item.subName || "title"] || ""} />
          ))}
        </Box>
      );
    } else if (item.type === "state") {
      return <Chip label={row[item.name] ? "فعال" : "غیر فعال"} />;
    } else if (item.type === "replace") {
      return (
        <>
          {item.state?.find((v) => {
            if (v.id.toString() === row[item.name]?.toString()) {
              return true;
            }
          })?.title || "-"}
        </>
      );
    } else if (item.type === "replaceInObject") {
      let temp = row;
      item.path.map((p) => {
        temp = temp?.[p];
      });
      return (
        <>
          {item.state?.find((v) => {
            if (v.id.toString() === temp?.toString()) {
              return true;
            }
          })?.title || "-"}
        </>
      );
    } else if (item.type === "boolean") {
      return (
        <>
          {row[item.name] ? (
            <Chip label="بله" color="success" />
          ) : (
            <Chip label="خیر" color="default" />
          )}
        </>
      );
    } else if (item.type === "customMultiValue") {
      return <>{item.func(row[item.name])}</>;
    } else {
      return (
        <>
          {row[item.name]
            ? row[item.name]?.toString() === "true"
              ? "فعال"
              : row[item.name]?.toString() === "false"
              ? "غیر فعال"
              : row[item.name]?.toLocaleString && item.isPrice
              ? row[item.name]?.toLocaleString()
              : row[item.name]
            : ""}
        </>
      );
    }
  };

  return (
    <>
      <TableCell
        onClick={() => {
          // No longer needed - accordion state is managed by the accordionManager
        }}
        colSpan={item.colSpan || 1}
      >
        {renderCellContent()}
      </TableCell>
      
      <Modal
        open={open}
        title={
          row[item.name] &&
          (row[item.name][item.subName || "title"] ||
            row[item.name][item.subName || "name"])
        }
        close={() => setOpen(false)}
      >
        <pre className="text-xs overflow-auto" dir="ltr">
          {JSON.stringify(row[item.name], null, 4)}
        </pre>
      </Modal>
      
      {item.type === "multiType" && (
        <Modal
          open={open2}
          title={`مشاهده همه ${item.title}`}
          close={() => setOpen2(false)}
        >
          <div className="flex flex-wrap gap-2">
            {row[item.name]?.map((it, idx) => (
              <Chip
                onClick={() => navigate(`${item.to}${it.id}`)}
                key={idx}
                label={it[item.subName || "title"] || it.toString()}
              />
            ))}
          </div>
        </Modal>
      )}
      
      {item.type === "image" && row[item.name] && (
        <ShowImage
          data={`${baseUrl}/file/${row[item.name]}`}
          open={open}
          close={() => setOpen(false)}
        />
      )}
    </>
  );
});

TableCelldata.displayName = 'TableCelldata';

export default TableCelldata;
