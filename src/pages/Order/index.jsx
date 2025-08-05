import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

import ReactHtmlParse from "html-react-parser";
import NoAccess from "../../components/noAccess";

import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, PageTitle } from "../../components/common";
import TextInput from "../../components/common/TextInput";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  CANCELSHIPENT,
  CREATESHIPMENT,
  getWaybill,
  ORDER_TYPE,
  SINGLE_ORDER,
  TIPAX_BY_ORDER_ID,
  track,
} from "../../helpers/api-routes";
import { orderStates } from "../../helpers/constants";
import { configReq, orderStateIdToObj } from "../../helpers/functions";
import DeliverInfo from "./deliverInfo";
import Details from "./details";
import Errors from "./errors";
import FacilityInfo from "./facilityInfo";
import InsuranceDetails from "./insuranceDetails";
import OrderDetails from "./orderDetails";
import OrderSummery from "./orderSummery";
import ShippingInfo from "./shippingInfo";

const SingleOrder = () => {
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [tipaxDetail, setTipaxDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wayBill, setwayBill] = useState(false);
  const [status, setStatus] = useState(false);
  const [notAccsess, setNotAccsess] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [legalInvoice, setLegalInvoice] = useState(null);
  const [refresh, sendRefresh] = useState(0);
  const [wallets, setWallets] = useState({});
  const [refahDetails, setRefahDetails] = useState({});
  const [orderHasBugs, setOrderHasBugs] = useState(false);
  const [openBugsModal, setOpenBugsModal] = useState(false);
  const [newOrderType, setNewOrderType] = useState();
  const [description, setdescription] = useState(null);
  const [uuid, setuuid] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [orderType, setOrderType] = useState([]);
  const [orderState, setOrderState] = useState("");
  const [saleManagerId, setSaleManagerId] = useState("");

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    if (orderData?.id) {
      axiosInstance(`${baseUrl}/${ORDER_TYPE}&orderId=${orderData?.id}`, configReq(token))
        .then((res) => {
          const { data } = res;
          var temp = [];
          setNewOrderType(data.data?.enums.find((item) => Number(item.id) === Number(data.data?.nextValidState)))
          data.data?.enums.map((item) => {
            if (orderData.state === 4) {
              if (item.id === "5") {
                temp.push({ ...item });
              } else {
                temp.push({ ...item, disabled: true });
              }
            } else if (orderData.state === 11) {
              if (item.payState !== 1) {
                if (item.id === "12" || item.id === "11" || item.id === "5") {
                  temp.push({ ...item });
                } else {
                  temp.push({ ...item, disabled: true });
                }
              }
            } else if (orderData.state === 12) {
              if (item.payState !== 1) {
                if (item.id === "5") {
                  temp.push({ ...item });
                } else {
                  temp.push({ ...item, disabled: true });
                }
              } else {
                if (item.id !== "11") {
                  temp.push({ ...item });
                } else {
                  temp.push({ ...item, disabled: true });
                }
              }
            } else {
              if (item.id === "5") {
                temp.push({ ...item, disabled: true });
              } else {
                temp.push({ ...item });
              }
            }
          });
          setOrderType(temp);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [orderData]);

  useEffect(() => {
    setLoading(true);
    axiosInstance(`${baseUrl}/${SINGLE_ORDER}?id=${id}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        setOrderData(data.data.order);
        if (data.data.order?.result) {
          setOrderState(orderStateIdToObj(data.data.order?.result?.state));
        }
        setWallets({
          facilityWalletId: data.data.facilityWalletId,
          walletId: data.data.walletId,
        });
        setRefahDetails({
          refahBlueRefId: data.data.refahBlueRefId,
          refahId: data.data.refahId,
          refahRefId: data.data.refahRefId,
          refahLoanAmount: data.data.refahLoanAmount,
          refahFinalAmount: data.data.refahFinalAmount,
          agentPercent: data.data.agentPercent,
        });
        setOrderItems(data.data.detail);
        setuuid(data.data.order.uuid);
        setwayBill(data.data.order.waybill);
        setLegalInvoice(data.data.order.legalInvoice);
        setSaleManagerId(data.data.order.saleManagerId);
        setOrderHasBugs(handleOrderHasBuges(data.data.order));
        setOpenBugsModal(handleOrderHasBuges(data.data.order));
        if (data.data.order.tipaxOrderId) {
          getTipaxInfo(data.data.order.tipaxOrderId);
        }
        if (data.data.order.state !== undefined) {
          setOrderState(
            orderStates.find(
              (item) => Number(item.id) === Number(data.data.order.state)
            )
          );
        }
      })
      .catch((err) => {
        if (err.response.status === 401 || err.response.status === 403) {
          setNotAccsess(true);
        }
        setLoading(false);
      });
  }, [id, token, refresh]);
  const handleOrderHasBuges = (orderD) => {
    if (!orderD.facilityId) {
      if (orderD.gateway !== 2 && !orderD.result && !orderD.referenceNumber) {
        return true;
      }
    }
    return false;
  };

  const StatusCheck = () => {
    axiosInstance(`${baseUrl}/${track}/` + wayBill, configReq(token))
      .then((res) => {
        setLoading(false);
        const { data } = res;
        setStatus(data.data);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };
  const wayId = () => {
    axiosInstance(`${baseUrl}/${getWaybill}/` + uuid, configReq(token))
      .then((res) => {
        setLoading(false);
        const { data } = res;
        setwayBill(data.data);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };
  const sendOrder = () => {
    const formData = new FormData();
    formData.append("orderId", id);
    /*     formData.append("description", description);
     */ axiosInstance
      .post(`${baseUrl}/${CREATESHIPMENT}`, formData, configReq(token))
      .then((res) => {
        setLoading(false);
        const { data } = res;
        setuuid(data.data);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };
  const cancelShipment = () => {
    if (wayBill) {
      const formData = new FormData();
      formData.append("wayBill", wayBill);
      axiosInstance
        .post(`${baseUrl}/${CANCELSHIPENT}`, formData, configReq(token))
        .then((res) => {
          setLoading(false);
          toast.success("با موفقیت کنسل شد");
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
        });
    }
  };
  const getTipaxInfo = (id) => {
    axiosInstance
      .get(`${baseUrl}/${TIPAX_BY_ORDER_ID}?orderId=${id}`, configReq(token))
      .then((res) => {
        setTipaxDetail(res.data);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };
  if (!userPermissions?.orders?.desc || notAccsess) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        title="جزییات سفارش"
        broadCrumb={[
          {
            title: "سفارشات",
            path: "/orders",
          },
        ]}
      />
      <div className="md:mx-3 mx-1">
        {" "}
        {orderData?.warningMessages && orderData.warningMessages.length > 0 && (
          <div className="flex flex-col gap-1">
            <Alert
              sx={{
                color: "#fff !important",
                alignItems: "center !important",
                width: "100%",
                ".MuiAlert-message": {
                  width: "100%",
                },
              }}
              variant="filled"
              severity="warning"
            >
              <div className="flex w-full justify-between items-center">
                {orderData.warningMessages.map((item) => (
                  <span key={item.message}>{item.message}</span>
                ))}{" "}
              </div>
            </Alert>
          </div>
        )}
        <Paper sx={{ border: "1px solid #dbdfea", mt: 2 }} elevation={0}>
          <div className="md:grid md:grid-cols-5 flex flex-col gap-2">
            <OrderSummery
              orderData={orderData}
              uuid={uuid}
              wayBill={wayBill}
              orderStateD={orderState}
              setOrderData={setOrderData}
              orderType={orderType}
              setSaleManagerId={setSaleManagerId}
              refahDetails={refahDetails}
              saleManagerId={saleManagerId}
              setOrderType={setOrderType}
              reload={() => sendRefresh((r) => r + 1)}
              orderItems={orderItems} 
              newOrderType={newOrderType}
              orderHasBugs={orderHasBugs}
            />
            <div className="col-span-4">
              <Box
                sx={{ borderBottom: 1, borderColor: "divider" }}
                className="relative z-10"
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  sx={{
                    flexGrow: 1,
                    height: "3.07rem",
                    minHeight: "40px !important",
                    ".MuiTab-root": {
                      minHeight: "40px !important",
                    },
                    background: (theme) =>
                      theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.04) !important"
                        : "rgba(0,0,0,0.7)  !important",
                  }}
                >
                  <Tab label=" اطلاعات سفارش" {...a11yProps(0)} />
                  <Tab
                    label=" اطلاعات گیرنده کالا و صاحب اکانت"
                    {...a11yProps(1)}
                  />

                  <Tab label="اطلاعات پرداخت و حمل و نقل" {...a11yProps(2)} />
                  <Tab label="اطلاعات خدمات" {...a11yProps(3)} />
                  {orderData?.type === 1 && (
                    <Tab label="اطلاعات تسهیلات" {...a11yProps(4)} />
                  )}
                  <Tab label="لاگ تغیرات ادمین " {...a11yProps(5)} />
                  <Tab label="خطا ها" {...a11yProps(6)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <OrderDetails
                  loadingData={loading}
                  orderItems={orderItems}
                  orderData={orderData}
                  saleManagerId={saleManagerId}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <DeliverInfo orderData={orderData} />
              </TabPanel>
              {/*   <TabPanel value={value} index={3}>
                <PayInfo orderData={orderData} />
              </TabPanel> */}
              <TabPanel value={value} index={2}>
                <ShippingInfo
                  orderData={orderData}
                  wallets={wallets}
                  tipaxDetail={tipaxDetail}
                />
                <div className="mt-10 ">
                  <>
                    {orderData?.iPayState === 1 &&
                      orderData?.transferCompany === "ماهکس" && (
                        <div className="border rounded-md p-4">
                          <div className="flex items-center flex-wrap justify-between">
                            <Typography
                              sx={{ fontSize: "0.8rem !important" }}
                              variant="h6"
                            >
                              ماهکس
                            </Typography>
                            <div className="flex items-center flex-wrap gap-4">
                              {userPermissions?.shipment?.delete && (
                                <Button
                                  disabled={!wayBill}
                                  onClick={cancelShipment}
                                  variant="outlined"
                                  color="error"
                                >
                                  لغو باربری
                                </Button>
                              )}

                              {/*   {userPermissions?.orders?.insert && ( )} */}
                              {userPermissions?.shipment?.insert && (
                                <Button
                                  disabled={uuid}
                                  onClick={sendOrder}
                                  variant="outlined"
                                  color="secondary"
                                >
                                  ارسال بسته
                                </Button>
                              )}

                              {/*   {userPermissions?.orders?.waybill && (  )} */}
                              {userPermissions?.shipment?.waybill && (
                                <Button
                                  onClick={wayId}
                                  disabled={!uuid || wayBill}
                                  variant="outlined"
                                  color="info"
                                >
                                  دریافت بارنامه
                                </Button>
                              )}

                              <Button
                                onClick={StatusCheck}
                                disabled={!wayBill}
                                variant="outlined"
                                color="primary"
                              >
                                پیگیری سفارش
                              </Button>
                            </div>
                          </div>

                          <div className="grid gap-x-3 my-6">
                            {/*    <TextInput label={"وزن"} /> */}
                            <TextInput
                              change={setdescription}
                              currentValue={description}
                              label={"توضیحات"}
                              readOnly={uuid}
                            />
                          </div>

                          <div>
                            {" "}
                            <div className="grid md:grid-cols-3 gap-x-3 mt-5">
                              {uuid !== false && (
                                <div className="flex flex-col">
                                  <span>UUID</span>
                                  <input
                                    value={uuid}
                                    disabled
                                    className="border rounded-md px-3 h-[50px]"
                                    label={"Status"}
                                  />
                                </div>
                              )}
                              {wayBill !== false && (
                                <div className="flex flex-col">
                                  <span>WayBill</span>
                                  <input
                                    value={wayBill}
                                    disabled
                                    className="border rounded-md px-3 h-[50px]"
                                    label={"wayBill"}
                                  />
                                </div>
                              )}

                              <div className="flex flex-col">
                                <span>Status</span>
                                <input
                                  value={status}
                                  disabled
                                  className="border rounded-md px-3 h-[50px]"
                                  label={"Status"}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                  </>
                </div>
              </TabPanel>{" "}
              <TabPanel value={value} index={3}>
                <InsuranceDetails
                  orderItems={orderItems}
                  orderData={orderData}
                />
              </TabPanel>
              {orderData?.type === 1 && (
                <TabPanel value={value} index={4}>
                  <FacilityInfo
                    refahDetails={refahDetails}
                    orderData={orderData}
                  />
                </TabPanel>
              )}
              <TabPanel value={value} index={orderData?.type === 1 ? 5 : 4}>
                {orderData?.orderLog && (
                  <div className="my-5">
                    {ReactHtmlParse(orderData?.orderLog)}
                  </div>
                )}
              </TabPanel>
              <TabPanel value={value} index={orderData?.type === 1 ? 6 : 5}>
                <Errors
                  refresh={() => sendRefresh((r) => r + 1)}
                  orderData={orderData}
                />
              </TabPanel>
            </div>
          </div>
          <Details
            value={value}
            orderData={orderData}
            orderItems={orderItems}
          />
        </Paper>
      </div>
      <Modal
        open={openBugsModal}
        close={() => {
          setOpenBugsModal(false);
        }}
        title={"این سفارش دارای مغایرت سیستمی می باشد"}
      >
        <div className="font-semibold text-red-700">
          لطفا پس از تاییدیه کد تراکنش و صحت سنجی پرداخت به بانکی از واحد مالی ،
          اقدامات لازم را مبذول فرمایید
        </div>
        <div className="flex justify-end items-center">
          <Button
            onClick={() => setOpenBugsModal(false)}
            variant="contained"
            color="primary"
          >
            متوجه شدم
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default SingleOrder;
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
        <Box sx={{ p: 3 }}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
