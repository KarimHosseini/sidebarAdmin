import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, IconButton, Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import ReactHtmlParse from "html-react-parser";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Dropdown, Modal, PageTitle } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { Confirm } from "../../components/modals";
import NoAccess from "../../components/noAccess";

import {
  baseUrl,
  GetDataToChargeBluBank,
  WalletChargeByBluBankList,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: "id",
    numeric: true,
    disablePadding: true,
    label: "شماره وام",
  },
  {
    id: "userFullName",
    numeric: false,
    disablePadding: true,
    label: "نام کاربر",
  },
  {
    id: "userMobile",
    numeric: false,
    disablePadding: true,
    label: "شماره همراه کاربر",
  },
  {
    id: "agentName",
    numeric: false,
    disablePadding: true,
    label: "نام نماینده",
  },
  {
    id: "amount",
    numeric: true,
    disablePadding: true,
    label: "مبلغ وام",
  },
  {
    id: "finalRefundAmount",
    numeric: true,
    disablePadding: true,
    label: "مبلغ باز پرداخت نهایی",
  },
  {
    id: "transferToWallet",
    numeric: false,
    disablePadding: true,
    label: "انتقال داده شده به کیف پول",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: true,
    label: "تاریخ بروزرسانی",
  },
  {
    id: "lastActionDate",
    numeric: false,
    disablePadding: true,
    label: "وضعیت",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;
  const [totals, setTotals] = React.useState({
    amount: 0,
    finalRefundAmount: 0,
  });
  React.useEffect(() => {
    const calculateTotals = () => {
      const amount = props.selected.reduce((sum, id) => {
        const selectedItem = props.data.find((item) => item.id === id);
        return sum + (selectedItem?.amount || 0);
      }, 0);

      const finalRefundAmount = props.selected.reduce((sum, id) => {
        const selectedItem = props.data.find((item) => item.id === id);
        return sum + (selectedItem?.finalRefundAmount || 0);
      }, 0);

      return { amount, finalRefundAmount };
    };

    setTotals(calculateTotals());
  }, [props.selected, props.data]);
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} مورد
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          انتخاب موارد برای شارژ تجمیعی
        </Typography>
      )}
      {numSelected > 0 ? (
        <div className="flex gap-8 items-center">
          <div className="flex min-w-[220px] items-center gap-2">
            <span>جمع مبلغ وام</span>
            <span className="font-bold">
              {" "}
              {totals.amount.toLocaleString("en-US")} {"  "} تومان
            </span>
          </div>{" "}
          <div className="flex min-w-[320px] items-center gap-2">
            <span>جمع از پرداخت نهایی</span>
            <span className="font-bold">
              {" "}
              {totals.finalRefundAmount.toLocaleString("en-US")} {"  "} تومان{" "}
            </span>
          </div>
          <Tooltip title="شارژ">
            <Button
              disabled={props.loadingButton}
              variant="contained"
              onClick={props.handleOpen}
            >
              شارژ
            </Button>
          </Tooltip>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <IconButton
            sx={{
              background: "#f0f0f0 !important",
              width: "1.3rem !important",
              padding: "2px !important",
              height: "1.3rem !important",
              fontSize: "1.5rem !important",
            }}
            onClick={() => {
              props.reload();
            }}
          >
            <RefreshIcon sx={{ color: "#001ee4" }} />
          </IconButton>
          <Button variant="outlined" onClick={props.back}>
            بازگشت
          </Button>
        </div>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const ChargeBluBank = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [open2, setOpen2] = React.useState(false);
  const [userType, setUserType] = useState(-1);
  const [status, setStatus] = useState(-1);

  const { token, userId } = useSelector((state) => state.user);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(500);
  const navigate = useNavigate();
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const visibleRows = React.useMemo(() => {
    return [...data].sort(getComparator(order, orderBy));
  }, [order, orderBy, page, rowsPerPage, data]);
  useEffect(() => {
    getData();
  }, [userType, status]);
  const getData = () => {
    setLoading(true);
    const params = new URLSearchParams();
    userType !== -1 && params.append("userType", userType);
    status !== -1 && params.append("status", status);
    axiosInstance
      .get(
        `${baseUrl}/${GetDataToChargeBluBank}${params ? `?${params}` : ""}`,
        configReq(token)
      )
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading(false);
      });
  };
  const handleSharj = () => {
    setLoadingButton(true);

    axiosInstance
      .post(`${baseUrl}/${WalletChargeByBluBankList}`, selected, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        getData();
        setOpen(false);
        var text = res.data.extraObject
          ? res.data.extraObject?.join("<br />")
          : false;

        setOpen2(text);
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };
  if (!userPermissions?.RefahLoans?.shareBlueBank) {
    return <NoAccess />;
  }

  return (
    <div>
      {" "}
      <PageTitle
        title="شارژ تجمیعی   "
        broadCrumb={[
          {
            title: "  تسهیلات رفاه",
            path: "/betaloan",
          },
        ]}
      />{" "}
      <div className="md:mx-3 mx-1">
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ width: "100%", mb: 2, pb: 5 }}>
            <EnhancedTableToolbar
              handleOpen={() => setOpen(true)}
              numSelected={selected.length}
              back={() => navigate("/betaloan")}
              reload={() => getData()}
              selected={selected}
              loadingButton={loadingButton}
              data={visibleRows}
            />
            <div className="flex items-center py-10">
              <div className="max-w-[11rem] w-full px-3">
                <Dropdown
                  title="نوع کاربر  "
                  data={USERTYPE}
                  value={USERTYPE.find((item) => item?.id === userType)}
                  change={(e) => setUserType(e.id)}
                />
              </div>{" "}
              <div className="max-w-[11rem] w-full px-3">
                <Dropdown
                  title=" وضعیت  "
                  data={STATUS}
                  value={STATUS.find((item) => item?.id === status)}
                  change={(e) => setStatus(e.id)}
                />
              </div>
            </div>
            <TableContainer sx={{ px: 3 }}>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                /*                 size={dense ? "small" : "medium"}
                 */
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={data.length}
                />
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Skeleton
                          variant="rounded"
                          height={30}
                          width={"100%"}
                        />
                      </TableCell>{" "}
                      <TableCell padding="checkbox">
                        <Skeleton
                          variant="rounded"
                          height={30}
                          width={"100%"}
                        />
                      </TableCell>{" "}
                      <TableCell padding="checkbox">
                        <Skeleton
                          variant="rounded"
                          height={30}
                          width={"100%"}
                        />
                      </TableCell>{" "}
                      <TableCell padding="checkbox">
                        <Skeleton
                          variant="rounded"
                          height={30}
                          width={"100%"}
                        />
                      </TableCell>{" "}
                      <TableCell padding="checkbox">
                        <Skeleton
                          variant="rounded"
                          height={30}
                          width={"100%"}
                        />
                      </TableCell>{" "}
                      <TableCell padding="checkbox">
                        <Skeleton
                          variant="rounded"
                          height={30}
                          width={"100%"}
                        />
                      </TableCell>{" "}
                      <TableCell padding="checkbox">
                        <Skeleton
                          variant="rounded"
                          height={30}
                          width={"100%"}
                        />
                      </TableCell>{" "}
                      <TableCell padding="checkbox">
                        <Skeleton
                          variant="rounded"
                          height={30}
                          width={"100%"}
                        />
                      </TableCell>{" "}
                      <TableCell padding="checkbox">
                        <Skeleton
                          variant="rounded"
                          height={30}
                          width={"100%"}
                        />
                      </TableCell>{" "}
                      <TableCell padding="checkbox">
                        <Skeleton
                          variant="rounded"
                          height={30}
                          width={"100%"}
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {" "}
                      {visibleRows.map((row, index) => {
                        const isItemSelected = selected.includes(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            onClick={(event) => {
                              if (row.status !== 1 && row.status !== 2)
                                handleClick(event, row.id);
                            }}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.id}
                            selected={isItemSelected}
                            sx={{ cursor: "pointer" }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                disabled={row.status === 1 || row.status === 2}
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              align="center"
                            >
                              <a
                                target={"_blank"}
                                href={`/betaloan/${row.id}`}
                                rel="noreferrer"
                              >
                                {row.id}
                              </a>
                            </TableCell>
                            <TableCell align="center">
                              <a
                                target={"_blank"}
                                href={`/users/${row.userId}`}
                                rel="noreferrer"
                              >
                                {row.userFullName}
                              </a>
                            </TableCell>
                            <TableCell align="center">
                              {row.userMobile}
                            </TableCell>
                            <TableCell align="center">
                              {row.agentName}
                            </TableCell>
                            <TableCell align="center">
                              {row.amount.toLocaleString("en-US")} {"  "} تومان
                            </TableCell>
                            <TableCell align="center">
                              {row.finalRefundAmount.toLocaleString("en-US")}{" "}
                              {"  "} تومان
                            </TableCell>
                            <TableCell align="center">
                              {row.transferToWallet ? "بلی" : "خیر"}
                            </TableCell>
                            <TableCell align="center">
                              {row.lastActionDate && (
                                <>
                                  {" "}
                                  {new Date(
                                    row.lastActionDate
                                  ).toLocaleDateString("fa-IR")}
                                </>
                              )}
                            </TableCell>{" "}
                            <TableCell align="center">
                              {row.status === 1
                                ? "در حال انجام"
                                : row.status === 2
                                ? "انجام شده"
                                : row.status === 3
                                ? "انجام نشده"
                                : ""}
                            </TableCell>{" "}
                          </TableRow>
                        );
                      })}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          {/*      <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          /> */}
        </Box>
      </div>
      <Confirm
        message={`آیا از   شارژ این  ${selected.length} مورد  اطمینان دارید؟`}
        close={() => setOpen(false)}
        submit={handleSharj}
        open={open}
        loading={loadingButton}
      />{" "}
      <Modal open={Boolean(open2)} title="   " close={() => setOpen2(false)}>
        {" "}
        {ReactHtmlParse(open2 || "")}
        <div className="flex justify-end  my-5">
          <Button
            variant="contained"
            onClick={() => {
              setOpen2(false);
            }}
          >
            متوجه شدم
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ChargeBluBank;
const USERTYPE = [
  {
    id: -1,
    title: "همه",
  },
  {
    id: 0,
    title: "کاربر",
  },
  {
    id: 1,
    title: "نماینده    ",
  },
];
const STATUS = [
  {
    id: -1,
    title: "همه",
  },
  {
    id: 1,
    title: "در حال انجام",
  },
  {
    id: 2,
    title: "انجام شده    ",
  },
  {
    id: 3,
    title: "انجام نشده    ",
  },
];
