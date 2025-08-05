import { Edit } from "@mui/icons-material";
import {
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import { ordersHeadCells } from "../../helpers/constants";

const OrderTable = ({ data, loading }) => {
  const { userPermissions } = useSelector((state) => state.relationals);

  return (
    <div className="w-full">
      <TableContainer>
        <Table sx={{ minWidth: 400, width: "100%" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {ordersHeadCells.map((item, index) => (
                <TableCell key={item?.label + index + " index"}>
                  {item?.label}
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading ? (
              <>
                {data?.map((orderItem, i) => {
                  const { id, userName, total, qty } = orderItem;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={userName + i + "mmm"}
                    >
                      <TableCell>
                        <Box>{userName}</Box>
                      </TableCell>
                      <TableCell>
                        <Box>{qty} </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            color: (theme) =>
                              theme.palette.mode === "light"
                                ? "#1a63c5"
                                : "#ff9999",
                          }}
                        >
                          {total?.toLocaleString("en-US")} تومان
                        </Box>
                      </TableCell>
                      <TableCell>
                        {userPermissions?.orders?.desc ? (
                          <a
                            href={`/order/${id}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <IconButton disabled>
                              <Edit color="warning" />
                            </IconButton>
                          </a>
                        ) : (
                          <></>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <>
                {Array.from(Array(10).keys()).map((item, i) => (
                  <TableRow key={i + "loadingTable"}>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OrderTable;
