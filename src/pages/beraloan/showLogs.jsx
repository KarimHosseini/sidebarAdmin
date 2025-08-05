import { Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../components/dataFetch/axiosInstance";

import { baseUrl, REFAH_LOAN_LOG } from "../../helpers/api-routes";
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
    id: "mobile",
    numeric: false,
    disablePadding: true,
    label: "شماره همراه کاربر",
  },
  {
    id: "dateTime",
    numeric: false,
    disablePadding: true,
    label: " تاریخ",
  },
  {
    id: "amount",
    numeric: true,
    disablePadding: true,
    label: "مبلغ وام",
  },

  {
    id: "message",
    numeric: false,
    disablePadding: true,
    label: "     پیام",
  },
  {
    id: "isSuccess",
    numeric: false,
    disablePadding: true,
    label: "     وضعیت",
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

const RefahLogs = ({ isShare }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token, userId } = useSelector((state) => state.user);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(500);
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
  }, []);
  const getData = () => {
    setLoading(true);
    axiosInstance
      .get(
        `${baseUrl}/${REFAH_LOAN_LOG}?state=${isShare ? 8 : 9}`,
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

  return (
    <Box sx={{ width: "100%" }}>
      <>
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
                    <Skeleton variant="rounded" height={30} width={"100%"} />
                  </TableCell>{" "}
                  <TableCell padding="checkbox">
                    <Skeleton variant="rounded" height={30} width={"100%"} />
                  </TableCell>{" "}
                  <TableCell padding="checkbox">
                    <Skeleton variant="rounded" height={30} width={"100%"} />
                  </TableCell>{" "}
                  <TableCell padding="checkbox">
                    <Skeleton variant="rounded" height={30} width={"100%"} />
                  </TableCell>{" "}
                  <TableCell padding="checkbox">
                    <Skeleton variant="rounded" height={30} width={"100%"} />
                  </TableCell>{" "}
                  <TableCell padding="checkbox">
                    <Skeleton variant="rounded" height={30} width={"100%"} />
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
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
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
                        <TableCell align="center">{row.userFullName}</TableCell>
                        <TableCell align="center">{row.mobile}</TableCell>
                        <TableCell align="center">
                          {new Date(row.dateTime)?.toLocaleDateString("fa-ir")}
                        </TableCell>
                        <TableCell align="center">
                          {row.amount.toLocaleString("en-US")} {"  "} تومان
                        </TableCell>

                        <TableCell align="center">{row.message}</TableCell>
                        <TableCell
                          sx={{ color: row.isSuccess ? "green" : "red" }}
                          align="center"
                        >
                          {row.isSuccess ? "موفق" : "ناموفق"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </>
      {/*      <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          /> */}
    </Box>
  );
};

export default RefahLogs;
