import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import ReactHtmlParse from "html-react-parser";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { Confirm } from "../../components/modals";
import {
  baseUrl,
  CANCLE_BLUE_BANK,
  CONFIRM_BLUE_BANK,
  DeleteOnlyBluBank,
  EDIT_REFAHLOAN_REF,
  RETRY_BLUE_BANK,
  ReturnBluBank,
  SHARING_BLUE_BANK,
  UPDATE_BLUE_BANK,
  WalletChargeByBluBank,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

import { Edit } from "@mui/icons-material";

const Ballon = ({ reuqestDetail, setRequesDetail, handleRerender }) => {
  const [loading2, setLoading2] = useState({});
  const [loadingButton, setLoadingButton] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [openDelete2, setOpenDelete2] = useState(false);
  const { token, userId } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [newRefValue, setNewRefValue] = useState("");
  const [loadingRefUpdate, setLoadingRefUpdate] = useState(false);

  const RetryBluBank = () => {
    setLoading2({ retryBluBank: true });

    setLoadingButton(true);
    axiosInstance
      .get(
        `${baseUrl}/${RETRY_BLUE_BANK}?changerId=${userId}&id=${id}`,

        configReq(token)
      )
      .then((res) => {
        setLoadingButton(false);
        setLoading2({ retryBluBank: false });
        setRequesDetail(res.data.data);
        handleRerender();
        toast.success("با موفقیت انجام شد");
      })
      .catch((err) => {
        setLoading2({ retryBluBank: false });
        setLoadingButton(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const UpdateBluBankState = () => {
    setLoading2({ updateBluBank: true });

    setLoadingButton(true);
    axiosInstance
      .get(
        `${baseUrl}/${UPDATE_BLUE_BANK}?changerId=${userId}&id=${id}`,

        configReq(token)
      )
      .then((res) => {
        setLoadingButton(false);
        setLoading2({ updateBluBank: false });
        setRequesDetail(res.data.data);

        toast.success("با موفقیت انجام شد");
      })
      .catch((err) => {
        setLoading2({ updateBluBank: false });

        setLoadingButton(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const CancelBluBank = () => {
    setLoading2({ cancelBluBank: true });

    setLoadingButton(true);
    axiosInstance
      .get(
        `${baseUrl}/${CANCLE_BLUE_BANK}?changerId=${userId}&id=${id}`,

        configReq(token)
      )
      .then((res) => {
        setLoadingButton(false);
        setLoading2({ cancelBluBank: false });
        setRequesDetail(res.data.data);

        toast.success("با موفقیت حذف شد");
      })
      .catch((err) => {
        setLoading2({ cancelBluBank: false });

        setLoadingButton(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const ConfirmBluBank = () => {
    setLoading2({ confirmBluBank: true });

    setLoadingButton(true);
    axiosInstance
      .get(
        `${baseUrl}/${CONFIRM_BLUE_BANK}?changerId=${userId}&id=${id}`,

        configReq(token)
      )
      .then((res) => {
        setLoadingButton(false);
        setLoading2({ confirmBluBank: false });
        setRequesDetail(res.data.data);

        toast.success("با موفقیت انجام شد");
      })
      .catch((err) => {
        setLoading2({ confirmBluBank: false });

        setLoadingButton(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const SharingBluBank = () => {
    setLoading2({ sharingBluBank: true });

    setLoadingButton(true);
    axiosInstance
      .get(
        `${baseUrl}/${SHARING_BLUE_BANK}?changerId=${userId}&id=${id}`,

        configReq(token)
      )
      .then((res) => {
        setLoadingButton(false);
        setLoading2({ sharingBluBank: false });
        setRequesDetail(res.data.data);

        toast.success("با موفقیت انجام شد");
      })
      .catch((err) => {
        setLoading2({ sharingBluBank: false });

        setLoadingButton(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const SharingWallet = () => {
    setLoading2({ sharingWallet: true });

    setLoadingButton(true);
    axiosInstance
      .get(
        `${baseUrl}/${WalletChargeByBluBank}?changerId=${userId}&id=${id}`,

        configReq(token)
      )
      .then((res) => {
        setLoadingButton(false);
        setLoading2({ sharingWallet: false });
        setRequesDetail(res.data.data);

        toast.success("با موفقیت شارژ شد");
      })
      .catch((err) => {
        setLoading2({ sharingWallet: false });

        setLoadingButton(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const returnBlueBank = () => {
    setLoading2({ returnBlueBank: true });

    setLoadingButton(true);
    axiosInstance
      .get(
        `${baseUrl}/${ReturnBluBank}?changerId=${userId}&id=${id}`,

        configReq(token)
      )
      .then((res) => {
        setLoadingButton(false);
        setLoading2({ returnBlueBank: false });

        toast.success("با موفقیت انجام شد");
      })
      .catch((err) => {
        setLoading2({ returnBlueBank: false });

        setLoadingButton(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const handleDeleteBlue = () => {
    setLoading2({ deleteJustBlue: true });

    setLoadingButton(true);
    axiosInstance
      .delete(
        `${baseUrl}/${DeleteOnlyBluBank}?id=${id}`,

        configReq(token)
      )
      .then((res) => {
        setOpenDelete2(false);
        setLoadingButton(false);
        setLoading2({ deleteJustBlue: false });
        handleRerender();

        /*   navigate("/betaloan"); */
        toast.success("با موفقیت انجام شد");
      })
      .catch((err) => {
        setLoading2({ deleteJustBlue: false });

        setLoadingButton(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };

  const updateReferenceNumber = () => {
    if (!newRefValue.trim()) {
      toast.error("لطفا شماره پیگیری را وارد کنید");
      return;
    }

    setLoadingRefUpdate(true);
    axiosInstance
      .put(
        `${baseUrl}/${EDIT_REFAHLOAN_REF}`,
        {
          id: id,
          loanApplicationRef: newRefValue,
        },
        configReq(token)
      )
      .then((res) => {
        setLoadingRefUpdate(false);
        setOpenEditModal(false);
        handleRerender();
        toast.success("شماره پیگیری با موفقیت ثبت شد");
      })
      .catch((err) => {
        setLoadingRefUpdate(false);
        toast.error(err.response?.data?.message || "خطا در ثبت شماره پیگیری");
        if (err.response && err.response.status === 401) {
          dispatch(logout());
        }
      });
  };

  return (
    <div>
      <div className="md:mx-3 mx-1 ">
        <div className={` text-sm items-center flex gap-2 my-4 `}>
          {" "}
          <span>وضعیت بلو بانک : </span>
          <span
            className={` font-bold text-lg ${
              reuqestDetail.bluBankState === 7 ||
              reuqestDetail.bluBankState === 8 ||
              reuqestDetail.bluBankState === 12
                ? "text-green-500"
                : reuqestDetail.bluBankState === 2 ||
                  reuqestDetail.bluBankState === 3
                ? "text-red-500"
                : ""
            }`}
          >
            {
              STATUS.find(
                (item) =>
                  Number(item?.value) === Number(reuqestDetail.bluBankState)
              )?.title
            }
          </span>
        </div>
        <Paper sx={{ border: "1px solid #dbdfea", mt: 2, px: 2 }} elevation={0}>
          <div className="grid md:grid-cols-4 gap-4 py-4">
            <div className="!relative">
              <TextInput
                disabled
                currentValue={reuqestDetail.loanApplicationRef}
                label="  شماره پیگیری بلو بانک"
              />
              {!reuqestDetail.loanApplicationRef && (
                <IconButton
                  className="!absolute top-1/2 left-2 -translate-y-1/2"
                  size="small"
                  onClick={() => setOpenEditModal(true)}
                >
                  <Edit fontSize="small" color="primary" />
                </IconButton>
              )}
            </div>
            <TextInput
              disabled
              currentValue={reuqestDetail.numberOfRepayments || ""}
              label={" تعداد اقساط بلو بانک"}
              number
            />{" "}
            <TextInput
              disabled
              currentValue={reuqestDetail.firstRepaymentAmount || ""}
              label="مبلغ قسط"
              price
              number
            />{" "}
            <TextInput
              disabled
              currentValue={
                reuqestDetail.disbursementDate
                  ? new Date(
                      reuqestDetail.nextRepaymentDate
                    )?.toLocaleDateString("fa-ir")
                  : ""
              }
              label={"تاریخ اولین قسط  "}
            />{" "}
            {/*     <TextInput
              disabled
              currentValue={reuqestDetail.loanOutstandingAmount || ""}
              label={"مبلغ معوقه بعدی بلو بانک "}
              price
              number
            /> */}
          </div>
        </Paper>
      </div>

      <div className="md:mx-3 mx-1 mt-4">
        <Paper sx={{ border: "1px solid #dbdfea", mt: 2, px: 2 }} elevation={0}>
          <div className="flex flex-col md:grid md:grid-cols-4 gap-4 py-4">
            <TextInput
              disabled
              currentValue={reuqestDetail.finalRefundAmount || ""}
              label="مبلغ بازپرداخت نهایی"
              price
              number
            />
            {reuqestDetail?.agentId ? (
              <>
                {" "}
                <TextInput
                  disabled
                  currentValue={reuqestDetail.usableAmount || ""}
                  label="مبلغ شارژ کیف پول نماینده"
                  price
                  number
                />{" "}
              </>
            ) : (
              <>
                {" "}
                <TextInput
                  disabled
                  currentValue={reuqestDetail.usableAmount || ""}
                  label="مبلغ قابل استفاده"
                  price
                  number
                />
                <TextInput
                  disabled
                  currentValue={reuqestDetail.amount || ""}
                  label="مبلغ  وام اعطا شده"
                  price
                  number
                />{" "}
              </>
            )}
            <TextInput
              disabled
              currentValue={
                reuqestDetail.disbursementDate
                  ? new Date(
                      reuqestDetail.disbursementDate
                    )?.toLocaleDateString("fa-ir")
                  : ""
              }
              label=" تاریخ اعطای وام "
            />{" "}
            <TextInput
              disabled
              currentValue={reuqestDetail.numberOfPaidRepayments || ""}
              label={" تعداد پرداخت بلو بانک"}
              number
            />{" "}
            <TextInput
              disabled
              currentValue={
                reuqestDetail.interestRate
                  ? reuqestDetail.interestRate + " % "
                  : ""
              }
              label="نرخ بهره بلو بانک"
            />
            {/*          <TextInput
              disabled
              currentValue={reuqestDetail.automaticRepaymentStatus}
              label="وضعیت باز پرداخت خودکار"
            />{" "} */}
            {/*         <TextInput
              disabled
              currentValue={reuqestDetail.whiteListCode}
              label="نام محصول بلوبانک"
            />{" "} */}
            <div className="leftInput">
              <TextInput
                disabled
                currentValue={
                  reuqestDetail.lastInquiryDate
                    ? `${new Date(
                        reuqestDetail.lastInquiryDate
                      )?.toLocaleDateString("fa-ir")}   ${String(
                        new Date(reuqestDetail.lastInquiryDate).getHours()
                      ).padStart(2, "0")}  : ${String(
                        new Date(reuqestDetail.lastInquiryDate).getMinutes()
                      ).padStart(2, "0")}`
                    : ""
                }
                label="اخرین تاریخ استعلام بانک مرکزی"
              />
            </div>
            {/*    <TextInput
              disabled
              currentValue={reuqestDetail.whiteListCode}
              label="کد محصول بلو بانک"
            /> */}
            <TextInput
              disabled
              currentValue={reuqestDetail.loanAccountNumber}
              label={"کد وام بلو بانک "}
            />
            <div className="col-span-4">
              <TextInput
                disabled
                currentValue={reuqestDetail.bluDescription}
                label={"توضیحات بالن "}
              />
            </div>
            {reuqestDetail?.errorLog && (
              <div className="col-span-4 my-4">
                {ReactHtmlParse(reuqestDetail?.errorLog)}
              </div>
            )}
            {/*          <TextInput
              disabled
              currentValue={
                STATUS.find(
                  (item) => item?.id === reuqestDetail.loanApplicationStatus
                )?.title
              }
              label="وضعیت بلو بانک  "
            /> */}{" "}
            {/*    <TextInput
              disabled
              currentValue={reuqestDetail.hasPartialPaid || ""}
              label="دارای پرداخت جزیی"
            />{" "} */}
            {/* <TextInput
              disabled
              currentValue={reuqestDetail.whiteListName}
              label=""
              price
              number
            /> */}
          </div>
          <div className="flex md:flex-row flex-col flex-wrap gap-3 justify-center items-center py-6">
            {userPermissions?.RefahLoans?.retryBluBank && (
              <Button
                sx={{ width: { md: "auto", xs: "100%" } }}
                disabled={
                  loadingButton ||
                  reuqestDetail.bluBankState === 9 ||
                  reuqestDetail.bluBankState === 8 ||
                  reuqestDetail.bluBankState === 10 ||
                  reuqestDetail.bluBankState ===
                    7 /* || reuqestDetail.bluBankState === 0 */ ||
                  reuqestDetail.bluBankState === 5 ||
                  reuqestDetail.bluBankState === 4 ||
                  reuqestDetail.bluBankState === 1 ||
                  reuqestDetail.bluBankState === 2 ||
                  reuqestDetail.bluBankState === 6 ||
                  reuqestDetail.bluBankState === 12 ||
                  reuqestDetail.bluBankState === 13
                }
                onClick={RetryBluBank}
                variant="contained"
                color="primary"
              >
                {loading2.retryBluBank ? (
                  <CircularProgress />
                ) : (
                  <>تلاش مجدد برای ایجاد وام </>
                )}
              </Button>
            )}
            {userPermissions?.RefahLoans?.updateBluBank && (
              <Button
                sx={{ width: { md: "auto", xs: "100%" } }}
                disabled={
                  loadingButton ||
                  reuqestDetail.bluBankState ===
                    13 /* || reuqestDetail.bluBankState === 2 */
                }
                onClick={UpdateBluBankState}
                variant="contained"
                color="warning"
              >
                {loading2.updateBluBank ? (
                  <CircularProgress />
                ) : (
                  <> استعلام وضعیت وام بالن </>
                )}
              </Button>
            )}

            {userPermissions?.RefahLoans?.cancelBluBank && (
              <Button
                sx={{ width: { md: "auto", xs: "100%" } }}
                disabled={
                  loadingButton ||
                  reuqestDetail.bluBankState === 9 ||
                  reuqestDetail.bluBankState === 8 ||
                  reuqestDetail.bluBankState === 7 ||
                  /*                   reuqestDetail.bluBankState === 0 ||
                   */ reuqestDetail.bluBankState === 2 ||
                  reuqestDetail.bluBankState === 6 ||
                  reuqestDetail.bluBankState === 12 ||
                  reuqestDetail.bluBankState === 13
                }
                onClick={CancelBluBank}
                variant="contained"
                color="error"
              >
                {loading2.cancelBluBank ? (
                  <CircularProgress />
                ) : (
                  <> حذف وام از رفاه و بالن</>
                )}
              </Button>
            )}
            {userPermissions?.RefahLoans?.deleteOnlyBluBank && (
              <Button
                sx={{ width: { md: "auto", xs: "100%" } }}
                disabled={
                  loadingButton ||
                  reuqestDetail.bluBankState === 9 ||
                  reuqestDetail.bluBankState === 8 ||
                  reuqestDetail.bluBankState === 7 ||
                  /*                   reuqestDetail.bluBankState === 0 ||
                   */ reuqestDetail.bluBankState === 2 ||
                  reuqestDetail.bluBankState === 6 ||
                  reuqestDetail.bluBankState === 12 ||
                  reuqestDetail.bluBankState === 13
                }
                onClick={() => setOpenDelete2(true)}
                variant="outlined"
                color="error"
              >
                {loading2.deleteJustBlue ? (
                  <CircularProgress />
                ) : (
                  <> حذف وام از بالن </>
                )}
              </Button>
            )}
            {/*     {userPermissions?.RefahLoans?.confirmBluBank && (
              <Button
              sx={{width:{md:'auto' , xs:"100%"}}}
                disabled={loadingButton || reuqestDetail.bluBankState === 9 || reuqestDetail.bluBankState === 8  || reuqestDetail.bluBankState === 2|| reuqestDetail.bluBankState === 10 || reuqestDetail.bluBankState === 7  || reuqestDetail.bluBankState === 0 || reuqestDetail.bluBankState === 5  || reuqestDetail.bluBankState === 4 || reuqestDetail.bluBankState === 1}
                onClick={ConfirmBluBank}
                variant="contained"
                color="success"
              >
                {loading2.confirmBluBank ? (
                  <CircularProgress />
                ) : (
                  <>تایید ارسال امضا</>
                )}
              </Button>
            )} */}
            {userPermissions?.RefahLoans?.sharingBluBank && (
              <Button
                sx={{ width: { md: "auto", xs: "100%" } }}
                disabled={
                  loadingButton ||
                  reuqestDetail.bluBankState === 9 ||
                  reuqestDetail.bluBankState === 8 ||
                  reuqestDetail.bluBankState === 2 ||
                  reuqestDetail.bluBankState === 10 ||
                  reuqestDetail.bluBankState === 0 ||
                  reuqestDetail.bluBankState === 5 ||
                  reuqestDetail.bluBankState === 4 ||
                  reuqestDetail.bluBankState === 1 ||
                  reuqestDetail.bluBankState === 6 ||
                  reuqestDetail.bluBankState === 11 ||
                  reuqestDetail.bluBankState === 12 ||
                  reuqestDetail.bluBankState === 0 ||
                  reuqestDetail.bluBankState === 13
                }
                onClick={SharingBluBank}
                variant="contained"
                color="secondary"
              >
                {loading2.sharingBluBank ? (
                  <CircularProgress />
                ) : (
                  <> تسهیم وام به {process.env.REACT_APP_COMPANY_TITLE}</>
                )}
              </Button>
            )}
            {userPermissions?.RefahLoans?.walletCharge && (
              <Button
                sx={{ width: { md: "auto", xs: "100%" } }}
                disabled={
                  loadingButton ||
                  reuqestDetail.bluBankState === 9 ||
                  reuqestDetail.bluBankState === 10 ||
                  reuqestDetail.bluBankState === 2 ||
                  reuqestDetail.bluBankState === 0 ||
                  reuqestDetail.bluBankState === 5 ||
                  reuqestDetail.bluBankState === 4 ||
                  reuqestDetail.bluBankState === 1 ||
                  reuqestDetail.bluBankState === 6 ||
                  reuqestDetail.bluBankState === 7 ||
                  reuqestDetail.bluBankState === 11 ||
                  reuqestDetail.bluBankState === 12 ||
                  reuqestDetail.bluBankState === 0 ||
                  reuqestDetail.bluBankState === 13
                }
                onClick={SharingWallet}
                variant="contained"
                color="primary"
              >
                {loading2.sharingWallet ? (
                  <CircularProgress />
                ) : (
                  <>شارژ و قفل کیف پول</>
                )}
              </Button>
            )}
            {/*   {userPermissions?.RefahLoans?.sharingBluBank && (
              <Button
              sx={{width:{md:'auto' , xs:"100%"}}}
                disabled={
                  loadingButton ||
                  reuqestDetail.bluBankState === 9 ||
                  reuqestDetail.bluBankState === 2 ||
                  reuqestDetail.bluBankState === 0 ||
                  reuqestDetail.bluBankState === 5 ||
                  reuqestDetail.bluBankState === 4 ||
                  reuqestDetail.bluBankState === 1 ||
                  reuqestDetail.bluBankState === 6 ||
                  reuqestDetail.bluBankState === 7 ||
                  reuqestDetail.bluBankState === 8
                }
                onClick={returnBlueBank}
                variant="contained"
                color="success"
              >
                {loading2.returnBlueBank ? (
                  <CircularProgress />
                ) : (
                  <>برگشت به وام ایجاد شده</>
                )}
              </Button>
            )} */}
          </div>
        </Paper>{" "}
        {reuqestDetail.bluBankState === 9 && (
          <Alert sx={{ my: 3 }} variant="outlined" severity="info">
            در این مرحله کاربر پیامکی مبنی بر شارژ کیف پول بر اساس وام و به مبلغ
            کسر شده از هزینه کارمزد دریافت می نماید.
          </Alert>
        )}
        {reuqestDetail.bluBankState === 10 && (
          <Alert sx={{ my: 3 }} variant="outlined" severity="warning">
            زمان امضاء مشتری به پایان رسیده است . مهلت زمان امضاء در بلوبانک ۲۴
            ساعت می باشد.
          </Alert>
        )}
      </div>
      <Confirm
        message={`آیا از حذف ${
          "   وام بلو " + reuqestDetail.userFullName || ""
        } اطمینان دارید؟`}
        close={() => setOpenDelete2(false)}
        submit={handleDeleteBlue}
        open={openDelete2}
        loading={loading2.deleteJustBlue}
      />
      <Modal
        title="افزودن شماره پیگیری بلو بانک"
        open={openEditModal}
        close={() => setOpenEditModal(false)}
      >
        <>
          <TextField
            fullWidth
            label="شماره پیگیری"
            value={newRefValue}
            onChange={(e) => setNewRefValue(e.target.value)}
            variant="outlined"
            className="mb-4"
          />
          <div className="flex justify-between gap-2">
            <Button
              variant="outlined"
              onClick={() => setOpenEditModal(false)}
              disabled={loadingRefUpdate}
            >
              انصراف
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={updateReferenceNumber}
              disabled={loadingRefUpdate}
            >
              {loadingRefUpdate ? <CircularProgress size={24} /> : "ثبت"}
            </Button>
          </div>
        </>
      </Modal>
    </div>
  );
};

export default Ballon;
const STATUS = [
  {
    value: "0",
    title: "در انتظار ایجاد وام",
    style: '{color: "orange"}',
    styleDark: null,
  },
  {
    value: "1",
    title: "وام ایجاد شده است",
    style: '{color: "green"}',
    styleDark: null,
  },
  {
    value: "4",
    title: "در انتظار تایید بانک",
    style: '{color: "orange"}',
    styleDark: null,
  },
  {
    value: "5",
    title: "در انتظار امضای مشتری",
    style: '{color: "orange"}',
    styleDark: null,
  },
  {
    value: "10",
    title: "انقضای مهلت امضاء",
    style: null,
    styleDark: null,
  },
  {
    value: "6",
    title: "در انتظار واریز وام",
    style: '{color: "orange"}',
    styleDark: null,
  },
  {
    value: "7",
    title: "وام واریز شده است",
    style: '{color: "green"}',
    styleDark: null,
  },
  {
    value: "8",
    title: `تسهیم و واریز به   ${process.env.REACT_APP_COMPANY_TITLE}   `,
    style: '{color: "purple"}',
    styleDark: null,
  },
  {
    value: "9",
    title: "شارژ کیف پول و قفل کیف پول",
    style: '{color: "green"}',
    styleDark: null,
  },
  {
    value: "2",
    title: "حذف وام از رفاه و بالن",
    style: '{color: "red"}',
    styleDark: null,
  },
  {
    value: "11",
    title: "برگشت خورده",
    style: null,
    styleDark: null,
  },
  {
    value: "12",
    title: "وام تسویه شده است",
    style: null,
    styleDark: null,
  },
  {
    value: "13",
    title: "تسویه وام زودتر از موعد",
    style: null,
    styleDark: null,
  },
];
/* usableAmount */
