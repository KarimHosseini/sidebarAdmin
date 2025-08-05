import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Skeleton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, DELETE_REFAHLOAN_IN } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const LoanModal = ({ datas, url, loading3, lists, isRefah, isBlue }) => {
  const { id } = useParams();
  const { token, userId } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [value, setValue] = useState(0);

  const [loading, setLoadingButton] = useState({});
  const [allData, setAllData] = useState([]);
  useEffect(() => {
    setAllData(
      Array.isArray(datas?.data)
        ? datas.data
        : Array.isArray(datas)
        ? datas
        : []
    );
  }, [datas]);
  const removeItem = (item) => {
    setLoadingButton({ [item.id]: true });

    axiosInstance
      .delete(
        `${baseUrl}/${DELETE_REFAHLOAN_IN}?id=${id}&installmentId=${item.id}`,

        configReq(token)
      )
      .then((res) => {
        setLoadingButton({ [item.id]: false });
        var temp = [...allData];
        temp = temp.filter((it) => it?.id !== item?.id);
        setAllData(temp);
        toast.success("با موفقیت حذف شد");
      })
      .catch((err) => {
        setLoadingButton({ [item.id]: false });

        toast.error(err.response?.data?.message);
      });
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Paper sx={{ border: "1px solid #dbdfea", mt: 2, px: 2 }} elevation={0}>
      {url && (
        <div className="flex items-center">
          <Button href={url} target="_blank" variant="contained">
            دانلود تصویر اجازه نامه مشتری
          </Button>
        </div>
      )}
      <div className="flex justify-center py-4 font-bold items-center "></div>{" "}
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab label="   جدول اقساط تضمین کننده" {...a11yProps(0)} />
        <Tab label="   جدول اقساط تامیین کننده" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        {" "}
        <div className="overflow-x-auto py-5 pt-1 px-5 mb-5 mt-1">
          <div className="min-w-[900px] bigTable">
            {loading3 ? (
              <Skeleton height={500} variant="rounded" animation="wave" />
            ) : (
              <>
                {isRefah ? (
                  // Original content for isRefah=true
                  <>
                    <div className="flex flex-wrap items-center gap-9">
                      <div className="flex items-center gap-2">
                        <span>اقساط پرداخت شده :</span>
                        <span className="font-bold text-lg">
                          {datas.paidInstallmentsAmount?.toLocaleString(
                            "en-US"
                          )}
                          {datas.paidInstallmentsAmount && <>تومان</>}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>اقساط پرداخت نشده :‌</span>
                        <span className="font-bold text-lg">
                          {datas.notPaidInstallmentsAmount?.toLocaleString(
                            "en-US"
                          )}
                          {datas.notPaidInstallmentsAmount && <>تومان</>}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>اقساط سر رسید شده :‌</span>
                        <span className="font-bold text-lg">
                          {datas.settledInstallmentsAmount?.toLocaleString(
                            "en-US"
                          )}{" "}
                          {datas.settledInstallmentsAmount && <>تومان</>}
                        </span>
                      </div>
                    </div>{" "}
                    <Table
                      sx={{ minWidth: 650, mt: 3 }}
                      aria-label="simple table"
                    >
                      <TableHead>
                        <TableRow>
                          {[
                            "# ",
                            "مبلغ ",
                            " تاریخ سر رسید",
                            " تاریخ پرداخت",
                            " سر رسید شده",
                            "",
                          ].map((item) => (
                            <TableCell key={item}>{item}</TableCell>
                          ))}
                          {userPermissions?.RefahLoans?.deleteInstallments && (
                            <TableCell>حذف</TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allData?.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>
                              {item.amount?.toLocaleString("en-US")} تومان
                            </TableCell>
                            <TableCell>
                              {item.overdueDate &&
                                new Date(item.overdueDate).toLocaleDateString(
                                  "fa-IR"
                                )}
                            </TableCell>

                            <TableCell>
                              {item.settelDate &&
                                new Date(item.settelDate).toLocaleDateString(
                                  "fa-IR"
                                )}
                            </TableCell>

                            <TableCell color={item.isSettled ? "green" : "red"}>
                              {item.isSettled ? "بله" : "خیر"}
                            </TableCell>
                            {userPermissions?.RefahLoans
                              ?.deleteInstallments && (
                              <TableCell>
                                <IconButton onClick={() => removeItem(item)}>
                                  {loading[item.id] ? (
                                    <CircularProgress />
                                  ) : (
                                    <Delete color="error" />
                                  )}
                                </IconButton>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                ) : (
                  // New content for isRefah=false
                  <>
                    <Table
                      sx={{ minWidth: 650, mt: 3 }}
                      aria-label="simple table"
                    >
                      <TableHead>
                        <TableRow>
                          {[
                            "# ",
                            "مبلغ ",
                            " تاریخ سر رسید",
                            " تاریخ پرداخت",
                            " سر رسید شده",
                            "وضعیت",
                            "عنوان وضعیت",
                            "بروزرسانی دستی",
                            "ارسال پیامک",
                          ].map((item) => (
                            <TableCell key={item}>{item}</TableCell>
                          ))}
                          {userPermissions?.RefahLoans?.deleteInstallments && (
                            <TableCell>حذف</TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(Array.isArray(allData) ? allData : []).map(
                          (item, i) => (
                            <TableRow key={i}>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>
                                {item.amount?.toLocaleString("en-US")} تومان
                              </TableCell>
                              <TableCell>
                                {item.overdueDate &&
                                  new Date(item.overdueDate).toLocaleDateString(
                                    "fa-IR"
                                  )}
                              </TableCell>
                              <TableCell>
                                {item.settelDate &&
                                  new Date(item.settelDate).toLocaleDateString(
                                    "fa-IR"
                                  )}
                              </TableCell>
                              <TableCell
                                color={item.isSettled ? "green" : "red"}
                              >
                                {item.isSettled ? "بله" : "خیر"}
                              </TableCell>
                              <TableCell>{item.status}</TableCell>
                              <TableCell>{item.statusTitle}</TableCell>
                              <TableCell
                                color={item.isManualUpdate ? "green" : "red"}
                              >
                                {item.isManualUpdate ? "بله" : "خیر"}
                              </TableCell>
                              <TableCell
                                color={item.isSmsSent ? "green" : "red"}
                              >
                                {item.isSmsSent ? "بله" : "خیر"}
                              </TableCell>
                              {userPermissions?.RefahLoans
                                ?.deleteInstallments && (
                                <TableCell>
                                  <IconButton onClick={() => removeItem(item)}>
                                    {loading[item.id] ? (
                                      <CircularProgress />
                                    ) : (
                                      <Delete color="error" />
                                    )}
                                  </IconButton>
                                </TableCell>
                              )}
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {" "}
        <div className="overflow-x-auto py-5 pt-1 px-5 mb-5 mt-1">
          <div className="min-w-[900px] bigTable">
            {loading3 ? (
              <Skeleton height={500} variant="rounded" animation="wave" />
            ) : (
              <>
                {isBlue ? (
                  // Original content for isBlue=true
                  <Table
                    sx={{ minWidth: 650, mt: 3 }}
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow>
                        {[
                          "شماره قسط",
                          "تاریخ سررسید",
                          "مبلغ بازپرداخت",
                          "مبلغ بازپرداخت نشده",
                          "مبلغ جریمه",
                          "مبلغ جریمه پرداخت نشده",
                          "وضعیت",
                          "مرحله",
                          "مبلغ قسط",
                          "معوقات",
                        ].map((item) => (
                          <TableCell key={item}>{item}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lists?.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>{item.number}</TableCell>
                          <TableCell>
                            {item.dueDate &&
                              new Date(item.dueDate).toLocaleDateString(
                                "fa-IR"
                              )}
                          </TableCell>
                          <TableCell>
                            {item.repaymentAmount?.toLocaleString("en-US")}{" "}
                            تومان
                          </TableCell>
                          <TableCell>
                            {item.repaymentAmountUnpaid?.toLocaleString(
                              "en-US"
                            )}{" "}
                            تومان
                          </TableCell>
                          <TableCell>
                            {item.penaltyAmount?.toLocaleString("en-US")} تومان
                          </TableCell>
                          <TableCell>
                            {item.penaltyAmountUnpaid?.toLocaleString("en-US")}{" "}
                            تومان
                          </TableCell>
                          <TableCell>
                            {item.status === "PAID"
                              ? "پرداخت شده"
                              : item.status === "UNPAID"
                              ? "پرداخت نشده"
                              : item.status}
                          </TableCell>
                          <TableCell>
                            {item.stage === "CURRENT"
                              ? "جاری"
                              : item.stage === "OVERDUE"
                              ? "سررسید شده"
                              : item.stage}
                          </TableCell>
                          <TableCell>
                            {item.installmentAmount?.toLocaleString("en-US")}{" "}
                            تومان
                          </TableCell>
                          <TableCell>
                            {item.arrears?.toLocaleString("en-US")} تومان
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  // New content for isBlue=false
                  <Table
                    sx={{ minWidth: 650, mt: 3 }}
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow>
                        {[
                          "# ",
                          "مبلغ ",
                          " تاریخ سر رسید",
                          " تاریخ پرداخت",
                          " سر رسید شده",
                          "وضعیت",
                          "عنوان وضعیت",
                          "بروزرسانی دستی",
                          "ارسال پیامک",
                        ].map((item) => (
                          <TableCell key={item}>{item}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lists?.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>
                            {item.amount?.toLocaleString("en-US")} تومان
                          </TableCell>
                          <TableCell>
                            {item.overdueDate &&
                              new Date(item.overdueDate).toLocaleDateString(
                                "fa-IR"
                              )}
                          </TableCell>
                          <TableCell>
                            {item.settelDate &&
                              new Date(item.settelDate).toLocaleDateString(
                                "fa-IR"
                              )}
                          </TableCell>
                          <TableCell color={item.isSettled ? "green" : "red"}>
                            {item.isSettled ? "بله" : "خیر"}
                          </TableCell>
                          <TableCell>{item.status}</TableCell>
                          <TableCell>{item.statusTitle}</TableCell>
                          <TableCell
                            color={item.isManualUpdate ? "green" : "red"}
                          >
                            {item.isManualUpdate ? "بله" : "خیر"}
                          </TableCell>
                          <TableCell color={item.isSmsSent ? "green" : "red"}>
                            {item.isSmsSent ? "بله" : "خیر"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </>
            )}
          </div>
        </div>
      </TabPanel>
    </Paper>
  );
};

export default LoanModal;
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ px: 3 }}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
