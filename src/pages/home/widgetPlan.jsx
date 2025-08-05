import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import momentJalaali from "moment-jalaali";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, WidgetPLan } from "../../helpers/api-routes";
import { configReq, toIsoString } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
const WidgetPlan = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState();
  const [time, setTime] = useState(momentJalaali());
  const [number, setNumber] = useState(0);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [noData, setnoData] = useState(false);
  useEffect(() => {
    setLoading(true);
    axiosInstance(
      `${baseUrl}/${WidgetPLan}?date=${toIsoString(new Date(time))}`,
      configReq(token)
    )
      .then((res) => {
        var tepm = {};
        res.data.data?.map((item) => {
          tepm = { ...tepm, [item?.step]: item?.num };
        });
        if (res.data.data?.length === 0) {
          setnoData(true);
        } else {
          setnoData(false);
        }
        setData(tepm);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
        setLoading(false);
      });
  }, [time]);
  const changeData = (data) => {
    if (data === "up") {
      if (number === -1) {
        setTime(momentJalaali());
      } else {
        setTime(momentJalaali().add(number + 1, "days"));
      }
      setNumber((number) => number + 1);
    } else {
      if (number === 1) {
        setTime(momentJalaali());
      } else {
        setTime(momentJalaali().add(number - 1, "days"));
      }
      setNumber((number) => number - 1);
    }
  };
  return (
    <Paper
      elevation={0}
      className="border rounded px-4 py-6 flex flex-col  gap-3 relative"
      sx={{
        ":hover": {
          ".refreshButton": {
            opacity: "100 !important",
          },
          boxShadow: "0px 0px 11px #8b8b8b4f",
        },
      }}
    >
      <div className="overflow-x-auto w-full">
        <div className="mb-7">
          <div className="text-sm text-center"> گزارش تسهیلات طرح </div>
          <div className="text-xs text-center mt-3">
            {new Date(time).toLocaleDateString("fa")}
          </div>
        </div>
        <div className="min-w-[600px] w-full ">
          <TableContainer>
            <Table
              sx={{ minWidth: 600, width: "100%", tableLayout: "fixed" }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell> مرحله ۲ - طرح</TableCell>
                  <TableCell> مرحله ۳ - پرداخت</TableCell>
                  <TableCell> مرحله ۴ - صحت</TableCell>
                  <TableCell> مرحله ۵ - نوبت</TableCell>
                  <TableCell> مرحله ۶ - باجه</TableCell>
                  <TableCell> مرحله ۷ - بانک</TableCell>
                  <TableCell> مرحله ۸ - واریز</TableCell>
                  <TableCell> مرحله ۹ - شارژ</TableCell>
                  <TableCell> لغو شده</TableCell>
                  <TableCell>کامل شده </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading ? (
                  <TableRow>
                    {noData ? (
                      <>
                        <TableCell colSpan={8}>
                          <div className="text-center">رکوردی یافت نشد</div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        {" "}
                        <TableCell>
                          {data[1] !== undefined && <> {data[1]} نفر</>}
                        </TableCell>
                        <TableCell>
                          {data[2] !== undefined && <> {data[2]} نفر</>}
                        </TableCell>
                        <TableCell>
                          {data[3] !== undefined && <> {data[3]} نفر</>}
                        </TableCell>
                        <TableCell>
                          {data[4] !== undefined && <> {data[4]} نفر</>}
                        </TableCell>
                        <TableCell>
                          {data[5] !== undefined && <> {data[5]} نفر</>}
                        </TableCell>
                        <TableCell>
                          {data[6] !== undefined && <> {data[6]} نفر</>}
                        </TableCell>
                        <TableCell>
                          {data[7] !== undefined && <> {data[7]} نفر</>}
                        </TableCell>
                        <TableCell>
                          {data[8] !== undefined && <> {data[8]} نفر</>}
                        </TableCell>
                        <TableCell>
                          {data[21] !== undefined && <> {data[21]} نفر</>}
                        </TableCell>
                        <TableCell>
                          {data[20] !== undefined && <> {data[20]} نفر</>}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>{" "}
                    <TableCell>
                      <Skeleton />
                    </TableCell>{" "}
                    <TableCell>
                      <Skeleton />
                    </TableCell>{" "}
                    <TableCell>
                      <Skeleton />
                    </TableCell>{" "}
                    <TableCell>
                      <Skeleton />
                    </TableCell>{" "}
                    <TableCell>
                      <Skeleton />
                    </TableCell>{" "}
                    <TableCell>
                      <Skeleton />
                    </TableCell>{" "}
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <IconButton
        sx={{
          position: "absolute",
          top: "30px",
          left: "5px",
          transform: "translateY(-50%)",
        }}
        onClick={() => changeData("down")}
      >
        <KeyboardArrowRightIcon />
      </IconButton>
      <IconButton
        sx={{
          position: "absolute",
          top: "30px",
          right: "5px",
          transform: "translateY(-50%)",
        }}
        onClick={() => changeData("up")}
      >
        <KeyboardArrowLeftIcon />
      </IconButton>
      <IconButton
        sx={{
          position: "absolute",
          top: "30px",
          right: "35px",
          transform: "translateY(-50%)",
          color: "#b9b9b9",
          opacity: { md: "0", xs: "100" },
          transition: "opacity 400ms",
        }}
        className="refreshButton "
        onClick={() => {
          setNumber(0);
          setTime(momentJalaali());
        }}
      >
        <RefreshIcon />
      </IconButton>
      <AccountBalanceWalletOutlinedIcon
        sx={{
          position: "absolute",
          top: "30px",
          left: "45px",
          transform: "translateY(-50%)",
          color: "#d0d0ff",
          /*      background: "#fff", */
          borderRadius: "3px",
          fontSize: "2rem",
          padding: "1px",
        }}
      />
    </Paper>
  );
};

export default WidgetPlan;
