import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import SyncIcon from "@mui/icons-material/Sync";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import imageCompression from "browser-image-compression";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { BiLabel } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { Modal, TextInput } from "../../components/common";
import Uploader from "../../components/common/uploader";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  ADD_NEW_DELIVER_ORDER_STATE,
  ADMIN_PRE_FACTOR,
  ALL_USERS,
  baseUrl,
  BLUE_CONSUME,
  CALC_FACILITY,
  CHECK_USER_CREDIT,
  CONFIRM_BLUE,
  CONSUME_LOAN,
  CREATE_SYNCGET_SINGLE_SYNC,
  DOWNLOAD_FILE,
  EDIT_ORDER_REVOKE,
  EDIT_ORDER_STATE,
  EXPORT_ALL_ORDERS,
  GETSHIPMENTLABEL,
  orderDescription,
  PAY_ORDER,
  RECHECK_BANK_TRANSACTION,
  REQUEST_LOAN,
  RESEND_DELIVERY_CODE,
  SEND_CODE_PREINVOCE,
  SUBMIT_NEW_DELIVER_ORDER_REVOKE,
  SYNCCRM,
} from "../../helpers/api-routes";
import {
  checkMeliCode,
  checkPersian,
  configReq,
  persianToEnglish,
} from "../../helpers/functions";
import InvoicesContent from "./InvoicesContent";
import ChangeStatusWarinig from "./changeStatusWarinig";

const OrderSummery = ({
  orderData,
  uuid,
  wayBill,
  orderStateD,
  setOrderData,
  orderType,
  saleManagerId,

  reload,
  refahDetails,
  orderHasBugs,
  newOrderType,
}) => {
  const navigate = useNavigate();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [loadingSync, setLoadingSync] = useState(false);
  const { id } = useParams();
  const { token, userId } = useSelector((state) => state.user);
  const [orderState, setOrderState] = useState("");
  const [code, setCode] = useState("");
  const [loadBank, setLoadBank] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [desc, setDesc] = useState("");
  const [open2, setOpen2] = useState(false);
  const [csvLoading, setCsvLoading] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [deliveryCode, setDeliveryCode] = useState("");
  const [sendedCode, setSendedCode] = useState(false);
  const [second, setSecond] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const [loadingArpa, setLoadingArpa] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);
  const [loadingConsume, setLoadingConsume] = useState(false);
  const [invoice, setInvoice] = useState();
  const [loadingBallon, setLoadingBallon] = useState(false);
  const [openModal4, setOpenModal4] = useState(false);
  const [consumeCodeBlue, setConsumeCodeBlue] = useState("");
  const [loadingBallonSubmit, setLoadingBallonSubmit] = useState(false);
  const [needValidatoins, setNeedValdations] = useState(false);
  const [loadingCredit, setLoadingCredit] = useState(false);
  const [refahTime, setRefahTime] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [openConsume, setOpenConsume] = useState(false);
  const [consumeCode, setConsumeCode] = useState("");
  const [facilityInfo, setFacilityInfo] = useState({});
  const [userMaxCredit, setUserMaxCredit] = useState(0);
  const [loadingStatus2, setLoadingStatus2] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [deliverCode, setDeliverCode] = useState("");
  const [needNewCode, setNeedNewCode] = useState(false);
  const [users, setUsers] = useState([]);
  const [openWarinig, setOpenWarning] = useState(false);
  const [deliveryInfo, setDeliverInfo] = useState({});
  const [loadingPay, setLoadingPay] = useState(false);
  const [changedStatus, setChangeStatus] = useState("");
  useEffect(() => {
    setOrderState(orderStateD);
  }, [orderStateD]);

  const synceCrm = () => {
    setLoadingSync(true);
    const formData = new FormData();
    if (id) {
      formData.append("ids", id);
    }
    axiosInstance
      .post(`${baseUrl}/${SYNCCRM}`, formData, configReq(token))
      .then((res) => {
        setLoadingSync(false);
        toast.success("با موفقیت ویرایش شد");
      })
      .catch((err) => {
        setLoadingSync(false);
        toast.error(err.response?.data?.message);
      });
  };
  const handleLabel = () => {
    axiosInstance
      .get(`${baseUrl}/${GETSHIPMENTLABEL}/` + uuid, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/pdf",
        },
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${id}-shipping.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((err) => {});
  };
  const changeOrderState = (deliveryCode, code) => {
    setLoading(true);
    var data = {
      id: parseInt(id),
      state: code ? code : orderState.id || 0,
    };
    if (deliveryCode) {
      data = { ...data, deliveryCode: deliveryCode };
    }
    axiosInstance
      .put(`${baseUrl}/${EDIT_ORDER_STATE}`, data, configReq(token))
      .then((res) => {
        reload();
        setLoading(false);
        setOpenModal3(false);
        setDeliveryCode("");

        setOpen(false);
        toast.success("با موفقیت ویرایش شد");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };
  const allExels = () => {
    axiosInstance(`${baseUrl}/${EXPORT_ALL_ORDERS}?ids=${id}`, configReq(token))
      .then((res) => {
        const { data } = res;
        var temp = [...data.data?.body];
        temp.unshift(data.data.header);
        var wb = XLSX.utils.book_new(),
          ws = XLSX.utils.aoa_to_sheet(temp);

        XLSX.utils.book_append_sheet(wb, ws, "financial");
        XLSX.writeFile(wb, `${"financial - " + id}.xlsx`);
        setCsvLoading(false);
      })
      .catch((err) => {
        setCsvLoading(false);
        toast.error(err.response?.data?.message);
      });
  };

  const resendCode = () => {
    setLoadingResend(true);
    const data = {
      orderId: parseInt(id),
    };
    axios
      .post(`${baseUrl}/${RESEND_DELIVERY_CODE}`, data, configReq(token))
      .then((res) => {
        /*    dispatch(addSnack(snackMaker("success", "با موفقیت ارسال شد"))); */
        toast.success("با موفقیت ارسال شد");
        setLoadingResend(false);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          /*        dispatch(logout()); */
        }
        setLoadingResend(false);
        toast.error(err.response?.data?.message);
        /*     dispatch(addSnack(snackMaker("error", "حین ثبت موارد خطا رخ داد"))); */
      });
  };
  const changeOrderCode = () => {
    setLoadingStatus(true);
    if (!checkMeliCode(deliveryInfo?.nationalCode)) {
      toast.error("کد ملی وارد شده معتبر نمی باشد");
      setLoadingStatus(false);
      return;
    }
    var data = {
      id: parseInt(id),
      state: 4,
      deliveryCode: code,
      nationalCode: deliveryInfo?.nationalCode,
    };
    if (orderData?.agentId) {
      data = { ...data, agentId: orderData?.agentId };
    }
    axiosInstance
      .put(`${baseUrl}/${EDIT_ORDER_STATE}`, data, configReq(token))
      .then((res) => {
        setOpenModal(false);
        setCode("");
        setLoadingStatus(false);
        setOrderState(orderType[4]);

        toast.success("با موفقیت ویرایش شد");
        reload();
        /*  setOrderData({ ...orderData, state: orderStates[4].title }); */
      })
      .catch((err) => {
        if (err.response?.data?.code === 423) {
          setNeedValdations(true);
        }
        setLoadingStatus(false);
        toast.error(err.response?.data?.message);
      });
  };
  const changeOrderCodeWithNewDeliver = () => {
    setLoadingStatus(true);
    if (!deliveryInfo?.mobileNumber) {
      toast.error("لطفا شماره موبایل را وارد کنید");
      setLoadingStatus(false);
      return;
    } else if (
      deliveryInfo?.mobileNumber.length !== 11 ||
      !deliveryInfo?.mobileNumber.startsWith("09")
    ) {
      toast.error("شماره موبایل باید 11 رقم باشد و با 09 شروع شود");
      setLoadingStatus(false);
      return;
    } else if (!checkMeliCode(deliveryInfo?.nationalCode)) {
      toast.error("کد ملی وارد شده معتبر نمی باشد");
      setLoadingStatus(false);
      return;
    } else if (
      !checkPersian(deliveryInfo?.firstName) ||
      !checkPersian(deliveryInfo?.lastName)
    ) {
      toast.error("نام و نام خانوادگی باید فارسی باشد");
      setLoadingStatus(false);
      return;
    } else if (!deliveryInfo?.files && !deliveryInfo?.fromGallery) {
      toast.error("لطفا تصویر کارت ملی گیرنده کالا را آپلود کنید");
      setLoadingStatus(false);
      return;
    }
    try {
      const originalFile = deliveryInfo?.files;
      const fileName = originalFile ? originalFile.name.split(".")[0] : "image";

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp",
      };

      imageCompression(originalFile, options)
        .then(function (compressedFile) {
          const newFile = new File([compressedFile], `${fileName}.webp`, {
            type: "image/webp",
          });

          uploadFileToServer(newFile);
        })
        .catch(function (error) {
          console.error("Compression error:", error);
          setLoadingStatus(false);
          toast.error("خطا در فشرده‌سازی تصویر. لطفا تصویر دیگری انتخاب کنید.");
        });

      function uploadFileToServer(file) {
        axiosInstance
          .post(
            `${baseUrl}/${ADD_NEW_DELIVER_ORDER_STATE}`,
            { ...deliveryInfo, orderId: id, files: file },
            configReq(token)
          )
          .then((res) => {
            toast.success("کد تحویل جدید با موفقیت ارسال شد");
            setNeedNewCode(true);
            setCode("");
            setLoadingStatus(false);
          })
          .catch((err) => {
            setLoadingStatus(false);
            toast.error(err.response?.data?.message);
          });
      }
    } catch (err) {
      console.error("General error:", err);
      setLoadingStatus(false);
      toast.error("خطا در پردازش تصویر. لطفا تصویر کم حجم تر انتخاب کنید.");
    }
  };
  const handleSumbitNewDeliverCode = () => {
    setLoadingStatus(true);
    axiosInstance
      .post(
        `${baseUrl}/${SUBMIT_NEW_DELIVER_ORDER_REVOKE}`,
        { code, orderId: id },
        configReq(token)
      )
      .then((res) => {
        setOpenModal(false);
        setCode("");
        setLoadingStatus(false);
        setNeedNewCode(false);
        setNeedValdations(false);
        toast.success("با موفقیت ویرایش شد");
        setDeliverInfo({});
        reload();
      })
      .catch((err) => {
        setLoadingStatus(false);
        toast.error(err.response?.data?.message);
      });
  };
  const checkBank = () => {
    setLoadBank(true);
    setOpen2(true);
    axiosInstance
      .post(
        `${baseUrl}/${RECHECK_BANK_TRANSACTION}`,
        { orderId: id },
        configReq(token)
      )
      .then((res) => {
        setLoadBank(false);
        toast.success(res.data.data?.result);
      })
      .catch((err) => {
        setLoadBank(false);
        toast.error(err.response?.data?.message);
      });
  };
  const revonke = () => {
    if (desc) {
      setLoadingStatus2(true);
      var data = {
        id: parseInt(id),
        /*   : desc, */
      };
      if (orderData?.agentId) {
        data = { ...data, agentId: orderData?.agentId };
      }
      axiosInstance
        .post(
          `${baseUrl}/${EDIT_ORDER_REVOKE}?description=${desc}`,
          data,
          configReq(token)
        )
        .then((res) => {
          setOpenModal2(false);
          setDesc("");
          setLoadingStatus2(false);
          toast.success("با موفقیت باطل شد");
          reload();
        })
        .catch((err) => {
          setLoadingStatus2(false);
          toast.error(err.response?.data?.message);
        });
    } else {
      toast.error("لطفا توضیخات ابطال را کامل کنید");
    }
  };
  useEffect(() => {
    var temp = [];

    axios
      .get(
        `${baseUrl}/${ALL_USERS}?filter[0][key]=role&filter[0][value]=7&filter[0][operator]=eq`,
        configReq(token)
      )
      .then((res) => {
        res?.data?.data?.map((item) => {
          temp.push({
            id: item?.id,
            title: `${item?.fname} ${item?.lname}`,
          });
        });
      })
      .catch((err) => {});
    setUsers(temp);
  }, []);

  const handleSeller = () => {
    setLoadingUser(true);
    const formData = new FormData();
    formData.append("id", orderData.id);
    if (orderData.adminDescription)
      formData.append("adminDescription", orderData.adminDescription);
    formData.append("saleManagerId", saleManagerId);
    if (orderData?.agentId) {
      formData.append("agentId", orderData?.agentId);
    }
    axiosInstance
      .put(`${baseUrl}/${orderDescription}`, formData, configReq(token))
      .then((res) => {
        setLoadingUser(false);
        toast.success("با موفقیت ثبت شد");
      })
      .catch((err) => {
        setLoadingUser(false);
        toast.error(err.response?.data?.message);
      });
  };
  const checkSync = () => {
    setLoadingArpa(true);
    axiosInstance
      .post(
        `${baseUrl}/${CREATE_SYNCGET_SINGLE_SYNC}`,
        { tablename: "Order", id },
        configReq(token)
      )
      .then((res) => {
        toast.success("با موفقیت سینک شد");
        setLoadingArpa(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoadingArpa(false);
      });
  };
  const handleVerfied = () => {
    changeOrderState(deliveryCode, 12);
  };
  const handleSendCode = () => {
    const formData = new FormData();
    formData.append("orderId", id);
    setLoadingCode(true);
    axiosInstance
      .post(`${baseUrl}/${SEND_CODE_PREINVOCE}`, formData, configReq(token))
      .then((res) => {
        setSendedCode(true);
        setSecond(60);

        toast.success("با موفقیت ارسال شد");
        setLoadingCode(false);
      })
      .catch((err) => {
        setLoadingCode(false);
        toast.error(err.response?.data?.message);
      });
  };
  useEffect(() => {
    if (second > 0) {
      const interval = setInterval(() => {
        setSecond(second - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [second]);
  const handleFacility = (time, price) => {
    setLoadingRequest(true);
    const formData = new FormData();
    const finalPrice = orderData?.agentCashPrice;
    formData.append("facilityId", orderData?.facilityId);
    formData.append("cashPrice", finalPrice);
    formData.append("forAgent", "true");
    formData.append("userMaxCredit", orderData?.userSalePower);

    axiosInstance
      .post(`${baseUrl}/${CALC_FACILITY}`, formData, configReq(token))
      .then((res) => {
        setFacilityInfo(res.data.data);
        const formData2 = new FormData();
        formData2.append("UserId", orderData?.userId);
        formData2.append("Title", "خرید کالا");
        formData2.append("Amount", res.data.data?.loanPrice);
        formData2.append("Description", orderData?.description);

        formData2.append("StartDate", time ? time : refahTime);
        formData2.append("NumberOfInstallments", res.data.data?.refunfCount);
        formData2.append("InstallmentAmount", res.data.data?.eachRefundAmount);
        formData2.append("AgentId", orderData?.agentId);
        formData2.append(
          "FinalRefundAmount",
          res.data.data?.facilitybasketPrice
        );
        formData2.append("UsableAmount", res.data.data?.amountAferWage);
        formData2.append("FacilityId", orderData?.facilityId);
        formData2.append("FacilityRelationId", orderData?.facilityRelationId);

        axiosInstance
          .post(`${baseUrl}/${REQUEST_LOAN}`, formData2, configReq(token))
          .then((res) => {
            setLoadingRequest(false);
            setOpenConsume(true);
            setSecond(120);
          })
          .catch((err) => {
            setLoadingRequest(false);

            toast.error(err.response?.data?.message);
          });
      })
      .catch((err) => {
        setLoadingRequest(false);
        toast.error(err.response?.data?.message);
      });
  };
  const handleCheckRefah = () => {
    setLoadingCredit(true);
    axiosInstance
      .post(
        `${baseUrl}/${CHECK_USER_CREDIT}`,
        {
          facilityId: orderData?.facilityId,
          userId: orderData?.userId,
          agentId: orderData?.agentId,
          agentMode: true,
        },
        configReq(token)
      )
      .then((res) => {
        setLoadingCredit(false);

        const time = res.data.data.startDate;
        if (time) {
          setRefahTime(res.data.data.startDate);
          const p = res.data.data.salePower.userMaxCredit;
          setUserMaxCredit(p);
          handleFacility(res.data.data.startDate, p);
        } else {
          toast.error(
            "اعتبار سنجی کاربر انجام نشد اعتبار رفاه کاربر را چک کنید "
          );
        }
      })
      .catch((err) => {
        setLoadingCredit(false);

        toast.error(err.response?.data?.message);
      });
  };
  const handleConsume = () => {
    setLoadingConsume(true);
    const formData2 = new FormData();
    formData2.append("UserId", orderData?.userId);
    formData2.append("Title", "خرید کالا");
    formData2.append("Amount", facilityInfo?.loanPrice);
    formData2.append("Description", orderData?.description);

    formData2.append("StartDate", refahTime);
    formData2.append("NumberOfInstallments", facilityInfo?.refunfCount);
    formData2.append("InstallmentAmount", facilityInfo?.eachRefundAmount);
    formData2.append("AgentId", orderData?.agentId);
    formData2.append("FinalRefundAmount", facilityInfo?.facilitybasketPrice);
    formData2.append("UsableAmount", facilityInfo?.amountAferWage);
    formData2.append("FacilityId", orderData?.facilityId);
    formData2.append("FacilityRelationId", orderData?.facilityRelationId);
    formData2.append("Code", consumeCode);
    axiosInstance
      .post(`${baseUrl}/${CONSUME_LOAN}`, formData2, configReq(token))
      .then((res) => {
        setLoadingConsume(false);

        toast.success("وام با موفقیت ثبت شد");
        setOpenConsume(false);
        setConsumeCode("");
        reload();
      })
      .catch((err) => {
        setLoadingConsume(false);

        setLoadingRequest(false);
        toast.error(err.response?.data?.message);
      });
  };
  const handleBlue = () => {
    handleSend();
    setLoadingBallon(true);
    const formData2 = new FormData();
    formData2.append("orderId", id);
    axiosInstance
      .post(`${baseUrl}/${ADMIN_PRE_FACTOR}`, formData2, configReq(token))
      .then((res) => {
        setInvoice(res.data.data);
        setLoadingBallon(false);
      })
      .catch((err) => {
        setLoadingBallon(false);

        setLoadingRequest(false);
        toast.error(err.response?.data?.message);
      });
  };
  const handleSend = () => {
    setLoadingBallon(true);

    const formData = new FormData();
    formData.append("userId", orderData?.userId);
    formData.append("payment", orderData?.final - orderData?.facilityDeference);
    axiosInstance
      .post(`${baseUrl}/${BLUE_CONSUME}`, formData, configReq(token))
      .then((res) => {
        setOpenModal4(true);
        setLoadingBallon(false);
        setSecond(120);
      })
      .catch((err) => {
        setLoadingBallon(false);

        toast.error(err.response?.data?.message);
      });
  };
  const handleConsumeBlue = async () => {
    const element = document.getElementById("printContent");
    if (!element) return;
    setLoadingBallonSubmit(true);
    const canvas = await html2canvas(element);
    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imageData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(
      imageData,
      "JPEG",
      0,
      0,
      pdfWidth,
      pdfHeight,
      undefined,
      "FAST"
    );
    /*     pdf.save("ballon.pdf");
     */ const pdfBlob = pdf.output("blob");
    const formData = new FormData();
    formData.append("userId", orderData?.userId);
    formData.append("orderId", id);
    formData.append("gatewayConsumeCode", consumeCodeBlue);
    formData.append("files", pdfBlob);

    axiosInstance
      .post(`${baseUrl}/${CONFIRM_BLUE}`, formData, configReq(token))
      .then((res) => {
        setLoadingBallonSubmit(false);
        setOpenModal4(false);
        reload();
        toast.success("با موفقیت انجام شد");
      })
      .catch((err) => {
        setLoadingBallonSubmit(false);

        toast.error(err.response?.data?.message);
      });
  };
  const handlePay = () => {
    setLoadingPay(true);
    axiosInstance
      .post(`${baseUrl}/${PAY_ORDER}`, { orderId: id }, configReq(token))
      .then((res) => {
        setLoadingPay(false);
        if (orderData?.gateway === 1) {
          window.open(`${res.data.data.url}`, "_self");
          localStorage.setItem("orderId", res.data.data.orderId);
        } else if (orderData?.gateway === 29) {
          window.open(`${res.data.data.url}`, "_self");
          localStorage.setItem("orderId", res.data.data.orderId);
        } else if (orderData?.gateway === 33) {
          window.open(res.data.data.url, "_self");
          localStorage.setItem("orderId", res.data.data.orderId);
        } else if (orderData?.gateway === 27) {
          postRefIdMeli(
            res.data.data.nvc.RefId,
            res.data.data.nvc.mobileap,
            res.data.data.gateway
          );
        } else if (orderData?.gateway === 25) {
          postRefId5(
            res.data.data.transactionId,
            res.data.data.sign,
            res.data.data.gateway
          );
        } else if (orderData?.gateway === 35) {
          window.open(res.data.data.payment_url, "_self");
          localStorage.setItem("orderId", res.data.data.orderId);
        } else if (orderData?.gateway === 31) {
          postRefId3(
            res.data.data.url,
            res.data.data.token,
            res.data.data.orderId
          );
          localStorage.setItem("orderId", res.data.data.orderId);
        } else if (orderData?.gateway === 23) {
          /*    postRefId3(res.data.data.gateway); */
          window.open(
            `https://api.nasiba.ir/nig/v1/payment?n=${res.data.data.Token}`,
            "_self"
          );
        } else if (orderData?.gateway === 8) {
          /*    postRefId3(res.data.data.gateway); */
          window.open(res.data.data.gateway, "_self");
        } else if (orderData?.gateway === 11) {
          window.open(res.data.data.Url, "_self");
          localStorage.setItem("no_token", res.data.data.Token);
          localStorage.setItem("invoiceID", res.data.data.TrackingCode);
        } else if (orderData?.gateway === 21) {
          postRefId4(res.data.data.RefId);
        } else {
          if (res.data.data.nvc) {
            if (orderData?.gateway === 5) {
              postRefId2(res.data.data.nvc.RefId);
            } else if (orderData?.gateway === 21) {
              postRefId4(res.data.data.nvc.RefId);
            } else {
              postRefId(res.data.data.nvc.RefId, res.data.data.nvc.mobileap);
            }
          } else {
          }
        }
      })
      .catch((err) => {
        setLoadingPay(false);
        toast.error(err.response?.data?.message);
      });
  };
  function postRefId4(refIdValue) {
    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute(
      "action",
      "https://bpm.shaparak.ir/pgwCreditchannel/startpay.mellat"
    );
    form.setAttribute("target", "_self");
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("name", "RefId");
    hiddenField.setAttribute("value", refIdValue);
    form.appendChild(hiddenField);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  function postRefId5(transaction, sign, gateway) {
    var form = document.createElement("form");
    form.setAttribute("method", "POST");

    form.setAttribute("action", gateway);
    form.setAttribute("target", "_self");

    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("name", "transaction-id");
    hiddenField.setAttribute("value", transaction);

    var hiddenField2 = document.createElement("input");
    hiddenField2.setAttribute("name", "sign");
    hiddenField2.setAttribute("value", sign);

    form.appendChild(hiddenField2);
    form.appendChild(hiddenField);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  function postRefId(refIdValue, mobile) {
    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", "https://asan.shaparak.ir");
    form.setAttribute("target", "_self");
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("name", "RefId");
    hiddenField.setAttribute("value", refIdValue);
    form.appendChild(hiddenField);
    var mobileField = document.createElement("input");
    mobileField.setAttribute("name", "mobileap");
    mobileField.setAttribute("value", mobile);
    form.appendChild(mobileField);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  function postRefIdMeli(refIdValue, mobile, url) {
    window.open(`${url}?token=${refIdValue}`, "_self");
  }

  function postRefId2(refIdValue) {
    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute(
      "action",
      "https://bpm.shaparak.ir/pgwchannel/startpay.mellat"
    );
    form.setAttribute("target", "_self");
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("name", "RefId");
    hiddenField.setAttribute("value", refIdValue);
    form.appendChild(hiddenField);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  function postRefId3(link, token, id) {
    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", link);
    form.setAttribute("target", "_self");
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("name", "payment_token");
    hiddenField.setAttribute("value", token);
    form.appendChild(hiddenField);
    var mobileField = document.createElement("input");
    mobileField.setAttribute("name", "reciept_number");
    mobileField.setAttribute("value", id);
    form.appendChild(mobileField);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }
  return (
    <div
      className={`md:border-l px-2 py-6 ${
        orderData?.mode === 1 ? "bg-orange-50" : ""
      }`}
    >
      {orderData?.legalInvoice && (
        <Alert sx={{ mb: 1 }} severity="info" variant="filled">
          درخواست فاکتور رسمی دارد{" "}
        </Alert>
      )}
      <div className="grid grid-cols-2 gap-4">
        {userPermissions?.crm?.update && (
          <>
            {orderData?.sent ? (
              <Button sx={{ width: "100%" }} variant="contained" disabled>
                <SyncIcon /> سینک شده
              </Button>
            ) : (
              <Button
                sx={{ width: "100%" }}
                onClick={() => synceCrm(id)}
                variant="outlined"
                disabled={orderState?.id === 10}
              >
                {loadingSync ? (
                  <>
                    <CircularProgress
                      sx={{
                        width: "20px !important",
                        height: "20px !important",
                      }}
                    />
                  </>
                ) : (
                  <>
                    <SyncIcon /> سینک نشده{" "}
                  </>
                )}
              </Button>
            )}
          </>
        )}
        {/*     {orderData?.iPayState === 1 ||
        orderData?.state === 5 ||
        orderState.key === 5 ? (
          <>
         {" "}
          </>
        ) : (
          <></>
        )} */}{" "}
        {userPermissions?.invoice?.view && (
          <>
            <a href={`/invoices?${id}`} target="_blank" rel="noreferrer">
              <Button
                sx={{ width: "100%" }}
                variant="outlined"
                color="secondary"
              >
                <ReceiptOutlinedIcon sx={{ mx: "5px" }} />
                فاکتور
              </Button>
            </a>{" "}
            <a href={`/orderLabel?${id}`} target="_blank" rel="noreferrer">
              <Button
                sx={{ width: "100%" }}
                variant="outlined"
                color="secondary"
              >
                <BiLabel className="mx-1" />
                لیبل سفارش
              </Button>
            </a>
          </>
        )}{" "}
        {userPermissions?.invoice?.export && (
          <Button
            onClick={allExels}
            sx={{ width: "100%" }}
            variant="outlined"
            color="warning"
          >
            {csvLoading ? (
              <CircularProgress
                sx={{
                  width: "20px !important",
                  height: "20px !important",
                  mx: 1,
                }}
              />
            ) : (
              <FileDownloadIcon />
            )}
            خروجی حسابداری
          </Button>
        )}
        {orderData?.iPayState === 1 && (
          <>
            {" "}
            <Button
              disabled={!wayBill}
              onClick={handleLabel}
              variant="outlined"
              color="info"
              sx={{ width: "100%" }}
            >
              <PictureAsPdfOutlinedIcon sx={{ mx: "5px" }} />
              برچسب ماهکس
            </Button>
          </>
        )}{" "}
        {userPermissions?.orders?.recheckBank && (
          <Button
            onClick={checkBank}
            sx={{ width: "100%" }}
            variant="outlined"
            color="success"
          >
            {loadBank ? (
              <CircularProgress
                sx={{
                  width: "20px !important",
                  height: "20px !important",
                  mx: 1,
                }}
              />
            ) : (
              <AccountBalanceIcon />
            )}
            استعلام بانک
          </Button>
        )}
        {orderData?.mode === 1 && orderData?.state === 4 ? (
          <></>
        ) : (
          <>
            {" "}
            {userPermissions?.order?.revoke && (
              <Button
                onClick={() => setOpenModal2(true)}
                sx={{ width: "100%" }}
                variant="contained"
                color="error"
                disabled={
                  /*     orderData?.gatewayId === 100
                ? false
                : */ /* orderData?.payState !== 1 || */ Number(
                    orderData?.state
                  ) === 5 || orderState?.id === 10
                }
              >
                {loadingStatus2 ? (
                  <CircularProgress
                    sx={{
                      width: "20px !important",
                      height: "20px !important",
                      mx: 1,
                    }}
                  />
                ) : (
                  <ErrorOutlineOutlinedIcon sx={{ mx: "4px" }} />
                )}
                ابطال فاکتور
              </Button>
            )}
          </>
        )}
        {userPermissions?.Sync?.update && (
          <Button
            onClick={checkSync}
            sx={{ width: "100%" }}
            variant="outlined"
            color="secondary"
            disabled={loadingArpa}
          >
            {loadingArpa ? (
              <>
                {" "}
                <CircularProgress
                  sx={{
                    width: "20px !important",
                    height: "20px !important",
                    mx: 1,
                  }}
                />
              </>
            ) : (
              <> سینک آرپا</>
            )}
          </Button>
        )}
        {orderData?.mode === 1 && orderState?.id === 11 && (
          <Button
            onClick={() => navigate(`/preFactor/edit/${orderData?.id}`)}
            variant="contained"
            color="warning"
          >
            ویرایش پیش فاکتور
          </Button>
        )}
        {orderData?.mode === 1 &&
          orderState?.id === 12 &&
          orderData?.gateway === 15 &&
          userId === orderData?.agentId && (
            <div className="col-span-2">
              {" "}
              <Button
                onClick={handleCheckRefah}
                variant="contained"
                color="success"
                fullWidth
                disabled={loadingCredit}
              >
                {loadingRequest ? (
                  <>
                    {" "}
                    <CircularProgress />
                  </>
                ) : (
                  <>
                    {" "}
                    {loadingCredit
                      ? "در حال اعتبارسنجی ..."
                      : "  ثبت وام رفاه بالن"}
                  </>
                )}
              </Button>{" "}
            </div>
          )}
        {orderData?.mode === 1 &&
          orderData.gateway === 7 &&
          orderState?.id === 12 && (
            <Button
              onClick={() => handleBlue()}
              variant="contained"
              color="warning"
            >
              برداشت وجه از کیف پول بالن
            </Button>
          )}
        {orderState?.id === 12 &&
          orderData?.mode === 1 &&
          orderData.gateway !== 7 &&
          orderData.gateway !== 15 && (
            <Button
              variant="contained"
              disabled={loadingPay}
              color="success"
              onClick={handlePay}
            >
              {loadingPay ? (
                <CircularProgress
                  sx={{
                    width: "20px !important",
                    height: "20px !important",
                    mx: 1,
                  }}
                />
              ) : (
                <> پرداخت سفارش</>
              )}
            </Button>
          )}
      </div>
      {orderState && orderData?.salerName && (
        <div className="border-t pt-5 mt-5 flex flex-col  gap-4">
          <div className="flex justify-between items-center gap-2">
            <span className="text-xs text-[#8094ae]"> مسئول فروش : </span>
            <span className="text-sm text-[#000] ">{orderData?.salerName}</span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="text-xs text-[#8094ae]"> کد معرف : </span>
            <span className="text-sm text-[#000] ">
              {orderData?.referralDetail?.referralCode}
            </span>
          </div>
        </div>
      )}
      <div className="border-t mt-5 pt-5 flex flex-col  gap-4">
        <div className="flex justify-between items-center gap-2">
          <span className="text-xs text-[#8094ae]">شماره سفارش : </span>
          <span className="text-sm text-[#000] ">{orderData?.id}</span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className="text-xs text-[#8094ae]">نوع سفارش : </span>
          <span className="text-sm text-[#000] ">
            {orderData?.type === 1 ? "تسهیلاتی" : "نقدی"}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className="text-xs text-[#8094ae]">نوع فاکتور : </span>
          <span className="text-sm text-[#000] ">
            {orderData?.op === 1 ? "فاکتور" : "پیش فاکتور"}
          </span>
        </div>
        {orderData?.mode !== 1 ? (
          <>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs text-[#8094ae]"> تحویل گیرنده : </span>
              {orderData?.baileeAgent ? (
                <span className="text-sm text-[#000] ">
                  {(orderData?.baileeAgent?.firstName || "") +
                    " " +
                    (orderData?.baileeAgent?.lastName || "")}
                </span>
              ) : (
                <a
                  href={`/users/${orderData?.userId}`}
                  target="_blank"
                  className="flex flex-col pag-2 text-blue-700 underline"
                  rel="noreferrer"
                >
                  <span className="text-sm text-[#000] ">
                    {(orderData?.sendAddress?.receptorFname || "") +
                      " " +
                      (orderData?.sendAddress?.receptorLname || "")}
                  </span>
                </a>
              )}
            </div>

            <div className="flex justify-between items-center gap-2">
              <span className="text-xs text-[#8094ae]">
                شماره موبایل تحویل گیرنده :{" "}
              </span>
              <span className="text-sm text-[#000]">
                {" "}
                {orderData?.baileeAgent?.mobileNumber
                  ? orderData?.baileeAgent?.mobileNumber
                  : orderData?.sendAddress?.receptorMobile}
              </span>
            </div>
          </>
        ) : (
          <>
            {" "}
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs text-[#8094ae]">
                نام نماینده عامل :‌
              </span>
              <span className="text-sm text-[#000]">
                {" "}
                {orderData?.agentName}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs text-[#8094ae]">دارای وابستگی:‌</span>
              <span className="text-sm text-[#000]">خیر</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs text-[#8094ae]">نقش سازنده:‌</span>
              <span className="text-sm text-[#000]">
                {" "}
                {orderData?.creatorRole === 0
                  ? "کاربر"
                  : orderData?.creatorRole === 1
                  ? "نماینده"
                  : "ادمین"}
              </span>
            </div>
          </>
        )}
        {/*   {orderData?.prePayment && (
          <div className="flex justify-between items-center gap-2">
            <span className="text-xs text-[#8094ae]"> هزینه پیش پرداخت: </span>
            <span className="text-sm text-[#000] ">
              {orderData?.prePayment?.toLocaleString()} تومان
            </span>
          </div>
        )} */}{" "}
        {orderData?.type === 1 ? (
          <>
            {" "}
            {/*            <div className="flex justify-between items-center gap-2">
              <span className="text-xs text-[#8094ae]">
                میزان تسهیلات درخواستی:
              </span>
              <span className="text-sm text-[#000] ">
                {orderData?.loanAmount?.toLocaleString()} تومان
              </span>
            </div>{" "} */}
            {orderData?.gatewayId === 15 && (
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs text-[#8094ae]">
                  مبلغ باز پرداخت نهایی:
                </span>
                <span className="text-sm text-[#000] ">
                  {orderData?.facilityFinalRefundAmount?.toLocaleString()} تومان
                </span>
              </div>
            )}{" "}
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs text-[#8094ae]">جمع کل :</span>
              <span className="text-sm text-[#000] ">
                {orderData?.final?.toLocaleString()} تومان
              </span>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-center gap-2">
            <span className="text-xs text-[#8094ae]"> قیمت نهایی نقدی: </span>
            <span className="text-sm text-[#000] ">
              {orderData?.final?.toLocaleString()} تومان
            </span>
          </div>
        )}{" "}
        {orderData?.mode === 1 && orderData?.loanAmount ? (
          <div className="flex justify-between items-center gap-2">
            <span className="text-xs text-[#8094ae]"> مبلغ کل وام رفاه: </span>
            <span className="text-sm text-[#000] ">
              {refahDetails?.loanAmount?.toLocaleString()} تومان
            </span>
          </div>
        ) : (
          <></>
        )}
        <div className="flex justify-between items-center gap-2 ">
          <span className="text-xs text-[#8094ae]">وضعیت سفارش: </span>
          <span className="text-sm text-[#000] ">{orderState?.title}</span>
        </div>
        <div className="flex justify-between items-center gap-2 ">
          <span className="text-xs text-[#8094ae]"> وضعیت پرداخت : </span>
          <Box
            sx={{
              color:
                orderData?.payState === 1 ? "rgb(21 128 61)" : "rgb(185 28 28)",
            }}
            className="text-sm font-bold border rounded-md p-3"
          >
            {orderData?.payState === 1 ? "پرداخت شده" : "پرداخت نشده"}
          </Box>
        </div>
      </div>
      {orderState && orderState?.id !== 10 && (
        <div className="border-t pt-5 mt-5">
          {/*    <div className=" flex items-center gap-4 ">
            {orderType?.length > 0 && (
              <FormControl fullWidth>
                <InputLabel id="order-status-select-label">
                  وضعیت سفارش
                </InputLabel>
                <Select
                  labelId="order-status-select-label"
                  id="order-status-select"
                  value={orderState.id || ""}
                  label="وضعیت سفارش"
                  onChange={(event) => {
                    const selectedId = Number(event.target.value);
                    const selectedOrderType = orderType.find(
                      (item) => Number(item.id) === selectedId
                    );
                    if (selectedId === 4 && Number(orderData?.state) !== 4) {
                      setOpenModal(true);
                    } else if (selectedId === 12) {
                      setOpenModal3(true);
                    } else if (selectedId === 5) {
                      setOpenModal2(true);
                    } else if (
                      Number(orderData?.state) === 1 &&
                      selectedId !== 5
                    ) {
                      setOpenWarning(true);
                      setChangeStatus(selectedOrderType);
                    } else {
                      setOrderState(selectedOrderType);
                    }
                  }}
                  disabled={
                    Number(orderData?.state) === 5 ||
                    Number(orderState.id) === 5 ||
                    !userPermissions?.orders?.update ||
                    orderHasBugs
                  }
                >
                  {orderType.map((item) => (
                    <MenuItem
                      disabled={item.disabled}
                      key={item.id}
                      value={item.id}
                    >
                      {item.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <div className="w-44">
              <Button
                onClick={() => setOpen(true)}
                variant="contained"
                disabled={
                  orderState?.title === orderData?.state ||
                  loading ||
                  orderData?.state === 5 ||
                  orderState.id === 5 ||
                  !userPermissions?.orders?.update
                }
              >
                {loading ? (
                  <CircularProgress
                    sx={{
                      width: "20px !important",
                      height: "20px !important",
                      mx: 1,
                    }}
                  />
                ) : (
                  " ثبت وضعیت"
                )}
              </Button>
            </div>
          </div>{" "} */}
          {newOrderType?.title && (
            <div className="flex justify-center">
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => {
                  const selectedId = Number(newOrderType.id);
                  const selectedOrderType = orderType.find(
                    (item) => Number(item.id) === selectedId
                  );
                  if (
                    selectedId === 4 &&
                    Number(orderData?.state) !== 4 &&
                    orderData.hasDeliveryCode
                  ) {
                    setOpenModal(true);
                  } else if (selectedId === 12) {
                    setOpenModal3(true);
                  } else if (selectedId === 5) {
                    setOpenModal2(true);
                  } else {
                    setOpenWarning(true);
                    setChangeStatus(selectedOrderType);
                  }
                }}
                disabled={!userPermissions?.orders?.update || orderHasBugs}
              >
                تغییر وضعیت به {newOrderType?.title}
              </Button>
            </div>
          )}
          <div className=" mx-auto flex mt-4 justify-center w-full">
            {orderHasBugs ? (
              <>
                {" "}
                <img
                  src="/images/confilict_status.svg"
                  alt=""
                  className="max-w-[110px] "
                />
              </>
            ) : (
              <>
                {" "}
                {Number(orderData?.state) === 1 ||
                Number(orderData?.state) === 2 ||
                Number(orderData?.state) === 3 ||
                Number(orderData?.state) === 4 ||
                Number(orderData?.state) === 13 ||
                Number(orderData?.state) === 8 ? (
                  <>
                    <img
                      src="/images/paid_status.svg"
                      alt=""
                      className="max-w-[110px] "
                    />
                  </>
                ) : Number(orderData?.state) === 0 ||
                  Number(orderData?.state) === 9 ||
                  Number(orderData?.state) === 10 ||
                  Number(orderData?.state) === 11 ||
                  Number(orderData?.state) === 12 ||
                  Number(orderData?.state) === 7 ? (
                  <>
                    {" "}
                    <img
                      src="/images/unpaid_status.svg"
                      alt=""
                      className="max-w-[110px] "
                    />
                  </>
                ) : (
                  <>
                    <img
                      src="/images/cancle_status copy.svg"
                      alt=""
                      className="max-w-[110px] "
                    />
                  </>
                )}
              </>
            )}
          </div>
          <div className="flex justify-between mt-2 border-t pt-3 items-center gap-2">
            <span className="text-xs text-[#8094ae]">کد تراکنش :</span>
            <span
              className={`text-sm ${
                orderData?.referenceNumber ? "text-black" : "text-red-700"
              }  `}
            >
              {orderData?.referenceNumber
                ? orderData?.referenceNumber
                : orderHasBugs
                ? "چک شود"
                : ""}
            </span>
          </div>
          <div className="flex mt-3 justify-between items-center gap-2">
            <span className="text-xs text-[#8094ae]">متن برگشتی بانک :</span>
            <span
              className={`text-sm ${
                orderData?.result ? "text-black" : "text-red-700"
              }  `}
            >
              {orderData?.result
                ? orderData?.result
                : orderHasBugs
                ? "چک شود"
                : ""}
            </span>
          </div>
        </div>
      )}
      {orderData?.signature && (
        <>
          {" "}
          <div className="flex flex-col gap-2 ">
            <span className="text-xs text-[#8094ae]">
              {" "}
              امضا تحویل گیرنده :{" "}
            </span>
            <img
              loading="lazy"
              className="w-[150px] h-[150px] mt-1"
              src={`${baseUrl}/${DOWNLOAD_FILE}/${orderData?.signature}`}
              alt=""
            />
          </div>
        </>
      )}
      <Modal
        open={open}
        close={() => {
          setOpen(false);
        }}
        title="آیا از تغییر وضعیت سفارش اطمینان دارید ؟"
        autoWidth={true}
      >
        <div className="flex items-center justify-between">
          <Button
            sx={{ width: "100px" }}
            onClick={() => setOpen(false)}
            variant="contained"
            color="error"
          >
            انصراف
          </Button>{" "}
          <Button
            sx={{ width: "100px" }}
            onClick={() => changeOrderState(null, null)}
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress
                sx={{
                  width: "20px !important",
                  height: "20px !important",
                  mx: 1,
                }}
              />
            ) : (
              "بله"
            )}
          </Button>
        </div>
      </Modal>{" "}
      <Modal
        open={open}
        close={() => {
          setOpen(false);
        }}
        title="آیا از تغییر وضعیت سفارش اطمینان دارید ؟"
        autoWidth={true}
      >
        <div className="flex items-center justify-between">
          {" "}
          <Button
            sx={{ width: "100px" }}
            onClick={() => setOpen(false)}
            variant="contained"
            color="error"
          >
            انصراف
          </Button>
          <Button
            sx={{ width: "100px" }}
            onClick={() => changeOrderState(null, null)}
            variant="contained"
            disabled={loadingStatus}
          >
            {loadingStatus ? (
              <>
                {" "}
                <CircularProgress
                  sx={{
                    width: "20px !important",
                    height: "20px !important",
                  }}
                />
              </>
            ) : (
              <> بله </>
            )}
          </Button>
        </div>
      </Modal>{" "}
      <Modal
        open={openModal}
        close={() => {
          setOpenModal(false);
          setCode("");
          setNeedNewCode(false);
          setNeedValdations(false);
        }}
        title="کد تحویل را وارد کنید"
        autoWidth={false}
      >
        <>
          {!needValidatoins && !needNewCode && (
            <div className="md:flex md:items-center grid  md:justify-between gap-3">
              <TextInput
                label="کد ملی تحویل گیرنده"
                change={(e) =>
                  setDeliverInfo({
                    ...deliveryInfo,
                    nationalCode: persianToEnglish(e),
                  })
                }
                currentValue={deliveryInfo.nationalCode}
              />

              <TextInput
                label="کد تحویل"
                change={(e) => setCode(persianToEnglish(e))}
                currentValue={code}
              />

              {deliveryInfo.nationalCode && (
                <Button
                  onClick={resendCode}
                  sx={{ width: "200px" }}
                  variant="outlined"
                  color="success"
                >
                  {loadingResend ? (
                    <>
                      {" "}
                      <CircularProgress
                        sx={{
                          width: "20px !important",
                          height: "20px !important",
                        }}
                      />
                    </>
                  ) : (
                    <> ارسال مجدد کد </>
                  )}
                </Button>
              )}
            </div>
          )}
          {needValidatoins && !needNewCode && (
            <div className="md:grid md:grid-cols-2  flex flex-col gap-4">
              <TextInput
                label="نام تحویل گیرنده"
                change={(e) =>
                  setDeliverInfo({ ...deliveryInfo, firstName: e })
                }
                currentValue={deliveryInfo.firstName}
              />{" "}
              <TextInput
                label=" نام خانوادگی تحویل گیرنده"
                change={(e) => setDeliverInfo({ ...deliveryInfo, lastName: e })}
                currentValue={deliveryInfo.lastName}
              />
              <TextInput
                label="کد ملی تحویل گیرنده"
                change={(e) =>
                  setDeliverInfo({
                    ...deliveryInfo,
                    nationalCode: persianToEnglish(e),
                  })
                }
                currentValue={deliveryInfo.nationalCode}
              />
              <TextInput
                label="شماره موبایل تحویل گیرنده"
                change={(e) =>
                  setDeliverInfo({
                    ...deliveryInfo,
                    mobileNumber: persianToEnglish(e),
                  })
                }
                currentValue={deliveryInfo.mobileNumber}
              />
              <div className="col-span-2">
                {/*      <UploadImage
                  file={deliveryInfo.files}
                  change={(e) => setDeliverInfo({ ...deliveryInfo, files: e })}
                  selectedProductImage={deliveryInfo.fromGallery}
                  setselectedProductImage={(e) =>
                    setDeliverInfo({ ...deliveryInfo, fromGallery: e })
                  }
                  justGallery
                /> */}
                <Uploader
                  setFiles={(e) => {
                    setDeliverInfo({ ...deliveryInfo, files: e });
                  }}
                  type="image"
                  check="image"
                  // defualt={data.galleryId}
                />
                <Alert className="mt-4" variant="outlined" severity="warning">
                  در صورت تحویل کالا به نماینده تحویل گیرنده ، لطفا پس از ثبت
                  اطلاعات ، دکمه دریافت کد تحویل جدید را بزنید و کد ارسال شده به
                  صاحب کالا را دریافت و در کادر کد تحویل وارد نمایید . در نظر
                  داشته باشید ورود این کد بمنزله پذیرفتن دریافت کالا به نماینده
                  تحویل گیرنده می باشد . این مطلب را در زمان دریافت کد از صاحب
                  کالا ، بازگو نمایید .{" "}
                </Alert>
              </div>
            </div>
          )}
          {needNewCode && (
            <div>
              <TextInput
                label="کد تحویل  "
                change={(e) => setCode(persianToEnglish(e))}
                currentValue={code}
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            {" "}
            <Button
              sx={{ width: "100px" }}
              onClick={() => {
                setOpenModal(false);
                setCode("");
                setNeedNewCode(false);
                setNeedValdations(false);
              }}
              variant="contained"
              color="error"
            >
              انصراف
            </Button>
            <Button
              sx={{ width: "100px" }}
              onClick={() => {
                if (needNewCode) {
                  handleSumbitNewDeliverCode();
                } else if (needValidatoins) {
                  changeOrderCodeWithNewDeliver();
                } else {
                  changeOrderCode();
                }
              }}
              variant="contained"
              disabled={loadingStatus}
            >
              {loadingStatus ? (
                <>
                  {" "}
                  <CircularProgress
                    sx={{
                      width: "20px !important",
                      height: "20px !important",
                    }}
                  />
                </>
              ) : (
                <>
                  {needValidatoins && !needNewCode ? (
                    <>ارسال کد جدید</>
                  ) : (
                    <> ثبت اطلاعات </>
                  )}
                </>
              )}
            </Button>
          </div>
        </>
      </Modal>
      <Modal
        open={openModal2}
        close={() => {
          setOpenModal2(false);
          setDesc("");
        }}
        title="آیا مطمئن به ابطال سفارش هستید ؟  "
        autoWidth={true}
      >
        <>
          <h4 className="font-semibold">
            {orderData?.mode !== 1 ? (
              <>
                {" "}
                در صورت ابطال سفارش ، موجودی محصول به انبار و موجودی حساب به کیف
                پول کابر عودت داده خواهد شد . <br /> علت ابطال را در کادر
                توضیحات ابطال زیر وارد نمایید .{" "}
              </>
            ) : (
              <>در صورت ابطال سفارش فاکتور در وضعیت ابطال قرار خواهد گرفت</>
            )}
          </h4>
          {orderData?.tipaxOrderId || orderData?.insuranceFee ? (
            <h4 className="font-bold text-red-600">
              {" "}
              این سفارش دارای متعلقات دیگری مانند خدمات یا روش ارسال با تیپاکس
              را دارد ، لطفا پس از ابطال فاکتور ، بصورت دستی یا در پنل مربوطه
              متعلقات این سفارش را ابطال یا برگشت بزنید .
            </h4>
          ) : (
            <></>
          )}
          <TextField
            multiline
            rows={2}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            variant="outlined"
          />
          {Number(orderData?.state) === 2 || Number(orderData?.state) === 4 ? (
            <TextField
              label="کد "
              value={deliverCode}
              onChange={(e) => setDeliverCode(e.target.value)}
              variant="outlined"
            />
          ) : (
            <></>
          )}

          <div className="flex items-center justify-between">
            {" "}
            <Button
              sx={{ width: "100px" }}
              onClick={() => {
                setOpenModal2(false);
                setDesc("");
              }}
              variant="contained"
              color="error"
            >
              انصراف
            </Button>
            <Button
              sx={{ width: "100px" }}
              onClick={revonke}
              variant="contained"
              disabled={
                loadingStatus2 ||
                (Number(orderData?.state) === 2 &&
                  String(deliverCode) !== process.env.REACT_APP_SELLER_CODE) ||
                (Number(orderData?.state) === 4 &&
                  String(deliverCode) !== process.env.REACT_APP_SELLER_CODE)
              }
            >
              {loadingStatus2 ? (
                <>
                  {" "}
                  <CircularProgress
                    sx={{
                      width: "20px !important",
                      height: "20px !important",
                    }}
                  />
                </>
              ) : (
                <> ثبت اطلاعات </>
              )}
            </Button>
          </div>
        </>
      </Modal>
      <Modal
        open={openModal3}
        close={() => {
          setOpenModal3(false);
          setDeliveryCode("");
          setSendedCode(false);
        }}
        title="آیا مطمئن به تایید سفارش هستید ؟  "
        autoWidth={true}
      >
        <>
          {!sendedCode ? (
            <div className="flex justify-end">
              {!userPermissions?.PreFactor?.RegisterRefahLoan ? (
                "کاربر گرامی شما دسترسی ندارید "
              ) : (
                <Button
                  sx={{ width: "100px" }}
                  onClick={handleSendCode}
                  variant="contained"
                  disabled={loadingCode}
                >
                  {loadingCode ? (
                    <>
                      {" "}
                      <CircularProgress
                        sx={{
                          width: "20px !important",
                          height: "20px !important",
                        }}
                      />
                    </>
                  ) : (
                    <> ارسال کد تایید</>
                  )}
                </Button>
              )}
            </div>
          ) : (
            <>
              {" "}
              <h4 className="font-semibold">کد تایید را وارد کنید</h4>
              <TextField
                value={deliveryCode}
                onChange={(e) => setDeliveryCode(e.target.value)}
                variant="outlined"
              />
              <div className="flex items-center justify-between">
                <span>تا ارسال مجدد</span>
                {second === 0 ? (
                  <Button
                    disabled={loadingCode}
                    onClick={handleSendCode}
                    variant="outlined"
                    size="small"
                  >
                    ارسال مجدد
                  </Button>
                ) : (
                  <span>{second}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                {" "}
                <Button
                  sx={{ width: "100px" }}
                  onClick={() => {
                    setOpenModal3(false);
                    setDeliveryCode("");
                  }}
                  variant="contained"
                  color="error"
                >
                  انصراف
                </Button>
                <Button
                  sx={{ width: "100px" }}
                  onClick={handleVerfied}
                  variant="contained"
                  disabled={loading || second === 0}
                >
                  {loading ? (
                    <>
                      {" "}
                      <CircularProgress
                        sx={{
                          width: "20px !important",
                          height: "20px !important",
                        }}
                      />
                    </>
                  ) : (
                    <> ثبت اطلاعات </>
                  )}
                </Button>
              </div>
            </>
          )}
        </>
      </Modal>
      <Modal
        open={openConsume}
        close={() => {
          setOpenConsume(false);
          setConsumeCode("");
        }}
        title=" کد اعتبارسنجی را وارد کنید  "
        autoWidth={true}
      >
        <>
          {" "}
          <h4 className="font-semibold">کد تایید را وارد کنید</h4>
          <TextField
            value={consumeCode}
            onChange={(e) => setConsumeCode(e.target.value)}
            variant="outlined"
          />
          <div className="flex items-center justify-between">
            <span>تا ارسال مجدد</span>
            {second === 0 ? (
              <Button
                disabled={loadingRequest}
                onClick={() => handleFacility()}
                variant="outlined"
                size="small"
              >
                ارسال مجدد
              </Button>
            ) : (
              <span>{second}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            {" "}
            <Button
              sx={{ width: "100px" }}
              onClick={() => {
                setOpenConsume(false);
                setConsumeCode("");
              }}
              variant="contained"
              color="error"
            >
              انصراف
            </Button>
            <Button
              sx={{ width: "100px" }}
              variant="contained"
              disabled={loadingConsume || second === 0}
              onClick={handleConsume}
            >
              {loadingConsume ? (
                <>
                  {" "}
                  <CircularProgress
                    sx={{
                      width: "20px !important",
                      height: "20px !important",
                    }}
                  />
                </>
              ) : (
                <> ثبت اطلاعات </>
              )}
            </Button>
          </div>
        </>
      </Modal>
      <Modal
        open={openModal4}
        close={() => {
          setOpenModal4(false);
          setConsumeCodeBlue("");
        }}
        title=" کد اعتبارسنجی  بالن را وارد کنید  "
        autoWidth={true}
      >
        <>
          {" "}
          <h4 className="font-semibold">کد تایید را وارد کنید</h4>
          <TextField
            value={consumeCodeBlue}
            onChange={(e) => setConsumeCodeBlue(e.target.value)}
            variant="outlined"
          />
          <div className="flex items-center justify-between">
            <span>تا ارسال مجدد</span>
            {second === 0 ? (
              <Button
                disabled={loadingBallon}
                onClick={() => handleSend()}
                variant="outlined"
                size="small"
              >
                ارسال مجدد
              </Button>
            ) : (
              <span>{second}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            {" "}
            <Button
              sx={{ width: "100px" }}
              onClick={() => {
                setOpenModal4(false);
                setConsumeCodeBlue("");
              }}
              variant="contained"
              color="error"
            >
              انصراف
            </Button>
            <Button
              sx={{ width: "100px" }}
              variant="contained"
              disabled={loadingBallonSubmit || second === 0}
              onClick={handleConsumeBlue}
            >
              {loadingBallonSubmit ? (
                <>
                  {" "}
                  <CircularProgress
                    sx={{
                      width: "20px !important",
                      height: "20px !important",
                    }}
                  />
                </>
              ) : (
                <> ثبت اطلاعات </>
              )}
            </Button>
          </div>
        </>
      </Modal>
      <Modal
        open={openWarinig}
        close={() => {
          setOpenWarning(false);
          setChangeStatus("");
        }}
        title={
          <div>
            {" "}
            شما در حال تغییر وضعیت سفارش از {orderState?.title} به{" "}
            <strong className="text-red-600"> {changedStatus.title}</strong>{" "}
            هستید{" "}
          </div>
        }
        autoWidth={true}
      >
        <ChangeStatusWarinig
          handleClose={() => {
            setOpenWarning(false);
            setChangeStatus("");
          }}
          handleSumbit={() => {
            changeOrderState(null, changedStatus.id);
            setOpenWarning(false);
            setChangeStatus("");
          }}
          orderData={orderData}
          nextValid={Number(newOrderType?.id)}
        />
      </Modal>
      {invoice && (
        <div
          id="pdf-container"
          className="fixed w-[100vw] h-full bottom-0 -z-10"
        >
          <div className="overflow-x-auto">
            <div className="min-w-[1200px] ">
              <InvoicesContent invoices={invoice} name={"-"} />
            </div>
          </div>{" "}
        </div>
      )}
    </div>
  );
};

export default OrderSummery;
