import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Skeleton,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Dropdown,
  PageTitle,
  TextEditor,
  TextInput,
  UploadImage,
} from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  ALL_USER_GROUP,
  baseUrl,
  CREATE_FACILITIES,
  DELETE_FACILITIES,
  EDIT_FACILITIES,
  GET_FACILITIES_SINGLE,
  GET_GATEWAYS_ENUM,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
import GroupsUser from "../Users/detail/groups";

const FaciltyModal = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { id, childId } = useParams();
  const [gateWays, setGateWays] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [avatar, setAvatar] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (childId) {
      setLoadingData(true);
      axiosInstance
        .get(
          `${baseUrl}/${GET_FACILITIES_SINGLE}?facilityId=${childId}`,

          configReq(token)
        )
        .then((res) => {
          setData(res.data.data);
          setselectedProductImage(res.data.data.galleryId);
          setLoadingData(false);
        })
        .catch((err) => {
          setLoadingData(false);
        });
    }
  }, [childId]);
  const resetData = () => {
    setData({});
    setAvatar([]);
    setselectedProductImage();
  };
  useEffect(() => {
    getAllGateWays();
    axiosInstance(`${baseUrl}/${ALL_USER_GROUP}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data && data.code === 200 && data.data) {
          setGroups(data.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  }, []);
  const getAllGateWays = () => {
    axiosInstance
      .get(
        `${baseUrl}/${GET_GATEWAYS_ENUM}?Page=1&Limit=10000&showBasicGateWay=true`,

        configReq(token)
      )
      .then((res) => {
        setGateWays(res.data.data);
      })
      .catch((err) => {});
  };
  const submitData = () => {
    var sendingData = {
      ParentId: id,
      Title: data.title,
      Files: avatar,

      IsActive: data.isActive,
      PmtPercent: 0,
      FromGallery: selectedProductImage ? selectedProductImage : "",
      RefundMonthCount: data.refundMonthCount,
      GatewayId: data.gatewayId,
      GatewayTitle: data.gatewayTitle,
      OrderExpiration: data.orderExpiration,
      HasForceInsurance: false,
      IsProductFreeze: data.isProductFreeze,
      Description: data.description || "",
      HasPrePrePayment: data.hasPrePrePayment,
      MaxCredit: data.maxCredit,
      MinPrePaymentInPercent: data.minPrePaymentInPercent || 0,
      FacilitatorWagePercent: data.facilitatorWagePercent,
      SalesDevelopmentFee: data.salesDevelopmentFee,
      CompanyWagePercent: data.companyWagePercent,
      ShowInFront: data.showInFront,
      HasValidation: data.hasValidation,
      MaxPreInvoiceAmountForAgent: data.maxPreInvoiceAmountForAgent,
      MinCredit: data.minCredit,
      ShowDetailInFront: data.showDetailInFront,
      FacilitatorFromCompanyWagePercent: data.facilitatorFromCompanyWagePercent,
      BlockedPercent: data.blockedPercent,
      BlockedDays: data.blockedDays,
      bankYearlyWagePercent: data.bankYearlyWagePercent,
      OnlyCanUseFacilityWallet: data.onlyCanUseFacilityWallet,
      HasBlock: data.hasBlock,
      PriceChangeRange: data.priceChangeRange,
      hasFinancierCheckCredit: data.hasFinancierCheckCredit,
      hasGuarantorCheckCredit: data.hasGuarantorCheckCredit,
      hasFinancierRequestLoan: data.hasFinancierRequestLoan,
      hasGuarantorRequestLoan: data.hasGuarantorRequestLoan,
      hasFinancierSubmitLoan: data.hasFinancierSubmitLoan,
      hasGuarantorSubmitLoan: data.hasGuarantorSubmitLoan,
      guarantorGatewayId: data.guarantorGatewayId,
      showFinalRefundAmount: data.guarantorGatewayId,
    };
    if (data.id) {
      sendingData = { ...sendingData, id: data.id };
    }
    sendingData = Object.fromEntries(
      Object.entries(sendingData).filter(([_, value]) => value !== undefined)
    );

    if (data.title) {
      const formData1 = new FormData();
      if (data.userGroups) {
        data.userGroups.map((item) => {
          formData1.append("UserGroups", item);
        });
      }
      Object.keys(sendingData).forEach((key) => {
        if (sendingData[key] !== null) {
          formData1.append(key, sendingData[key]);
        }
      });
      setLoading(true);
      if (childId) {
        axiosInstance
          .put(`${baseUrl}/${EDIT_FACILITIES}`, formData1, configReq(token))
          .then((res) => {
            setLoading(false);
            toast.success("با موفقیت ویرایش شد");
            navigate(
              `/facilitySetting/${id}?title=${searchParams.get("title")}`
            );
          })
          .catch((err) => {
            setLoading(false);
            toast.error(err.response?.data?.message);
            if (err.response.status === 401) {
              dispatch(logout());
            }
          });
      } else {
        axiosInstance
          .post(`${baseUrl}/${CREATE_FACILITIES}`, formData1, configReq(token))
          .then((res) => {
            toast.success("با موفقیت اضافه شد");
            navigate(
              `/facilitySetting/${id}?title=${searchParams.get("title")}`
            );
          })
          .catch((err) => {
            setLoading(false);
            toast.error(err.response?.data?.message);
            if (err.response.status === 401) {
              dispatch(logout());
            }
          });
      }
    } else if (!data.title) {
      toast.error("نام  را وارد کنید");
    }
  };
  const deleteAttr = () => {
    setLoading(true);
    axiosInstance
      .delete(`${baseUrl}/${DELETE_FACILITIES}?id=${data.id}`, configReq(token))
      .then((res) => {
        toast.success("با موفقیت حذف شد");
        navigate(`/facilitySetting/${id}?title=${searchParams.get("title")}`);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);

        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  return (
    <>
      {" "}
      <PageTitle
        broadCrumb={[
          {
            title: "  تسهیلات",
            path: "/facilites",
          },
          {
            title: "   تنظیمات تسهیلات ",
            path: "/facilitySetting",
          },
          {
            title: "  تسهیلات  " + searchParams.get("title"),
            path: `/facilitySetting/${id}?title=${searchParams.get("title")}`,
          },
        ]}
        title={childId ? "  ویرایش  " + data.title : "افزودن تسهیلات جدید"}
      />{" "}
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          {loadingData ? (
            <div className="md:grid grid-cols-4 gap-3">
              {" "}
              {Array.from(Array(16).keys()).map((item, i) => (
                <div key={i + "fgioerf"}>
                  <Skeleton width={"100%"} height={200} animation="pulse" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {" "}
              <div className="md:grid grid-cols-4 gap-3">
                <TextInput
                  label="نام  "
                  change={(e) => setData({ ...data, title: e })}
                  currentValue={data.title}
                />{" "}
                <TextInput
                  label=" کارمزد تسهیلگر"
                  change={(e) =>
                    setData({ ...data, facilitatorWagePercent: e })
                  }
                  currentValue={
                    data.facilitatorWagePercent !== undefined
                      ? data.facilitatorWagePercent
                      : 0
                  }
                  number
                  price
                  priceLabel="%"
                  allowZero
                />
                <TextInput
                  label={`  کارمزد ${process.env.REACT_APP_COMPANY_TITLE}  `}
                  change={(e) => setData({ ...data, companyWagePercent: e })}
                  currentValue={
                    data.companyWagePercent !== undefined
                      ? data.companyWagePercent
                      : 0
                  }
                  number
                  allowZero
                />
                <TextInput
                  label="   کارمزد توسعه فروش"
                  change={(e) => setData({ ...data, salesDevelopmentFee: e })}
                  currentValue={
                    data.salesDevelopmentFee !== undefined
                      ? data.salesDevelopmentFee
                      : 0
                  }
                  number
                  price
                  allowZero
                  priceLabel="%"
                />
                <TextInput
                  label={`  سهم تسهیل گر از کارمزد ${process.env.REACT_APP_COMPANY_TITLE}  `}
                  change={(e) =>
                    setData({ ...data, facilitatorFromCompanyWagePercent: e })
                  }
                  currentValue={
                    data.facilitatorFromCompanyWagePercent !== undefined
                      ? data.facilitatorFromCompanyWagePercent
                      : 0
                  }
                  number
                  price
                  allowZero
                  priceLabel="%"
                />
                <TextInput
                  label=" درصد کارمزد بانکی  "
                  change={(e) => setData({ ...data, bankYearlyWagePercent: e })}
                  currentValue={
                    data.bankYearlyWagePercent !== undefined
                      ? data.bankYearlyWagePercent
                      : 0
                  }
                  number
                  allowZero
                />
                <TextInput
                  label="  درصد pmt"
                  change={(e) => setData({ ...data, pmtPercent: e })}
                  currentValue={
                    data.pmtPercent !== undefined ? data.pmtPercent : 0
                  }
                  number
                  disabled
                  allowZero
                />
                <Dropdown
                  value={gateWays?.find((g) => g.id === data?.gatewayId)}
                  change={(e) => setData({ ...data, gatewayId: e.id })}
                  data={gateWays}
                  title="نام درگاه تسهیلاتی تامین کننده"
                />
                <Dropdown
                  value={gateWays?.find(
                    (g) => g.id === data?.guarantorGatewayId
                  )}
                  change={(e) => setData({ ...data, guarantorGatewayId: e.id })}
                  data={gateWays}
                  title="نام درگاه تسهیلاتی تضمین کننده"
                />
                <div className="flex items-center gap-3">
                  <span>دارای فریز : </span>
                  <Switch
                    checked={data?.isProductFreeze}
                    onChange={() =>
                      setData({
                        ...data,
                        isProductFreeze: !data?.isProductFreeze,
                      })
                    }
                  />
                </div>
                <TextInput
                  disabled={!data?.isProductFreeze}
                  label=" زمان انقضا پیش فاکتور (ساعت)"
                  change={(e) => setData({ ...data, orderExpiration: e })}
                  currentValue={data.orderExpiration || ""}
                  number
                />
                <TextInput
                  label="  تعداد ماه"
                  change={(e) => setData({ ...data, refundMonthCount: e })}
                  currentValue={data.refundMonthCount || ""}
                  number
                />
                <div className="flex items-center gap-3">
                  <span>دارای پیش پرداخت : </span>
                  <Switch
                    checked={data?.hasPrePrePayment}
                    onChange={() =>
                      setData({
                        ...data,
                        hasPrePrePayment: !data?.hasPrePrePayment,
                        minPrePaymentInPercent: data?.hasPrePrePayment
                          ? 0
                          : data?.hasPrePrePayment,
                      })
                    }
                  />
                </div>
                <TextInput
                  disabled={!data?.hasPrePrePayment}
                  label=" حداقل درصد پیش پرداخت"
                  change={(e) =>
                    setData({ ...data, minPrePaymentInPercent: e })
                  }
                  currentValue={data.minPrePaymentInPercent || ""}
                  number
                  allowZero
                />
                <TextInput
                  label="  حداقل اعتبار تسهیلات"
                  change={(e) => setData({ ...data, minCredit: e })}
                  currentValue={data.minCredit || ""}
                  number
                  price
                  allowZero
                />{" "}
                <TextInput
                  label="  حداکثر اعتبار تسهیلات"
                  change={(e) => setData({ ...data, maxCredit: e })}
                  currentValue={data.maxCredit || ""}
                  number
                  price
                  allowZero
                />{" "}
                <TextInput
                  label=" بازه تغیرات قیمت روی اسلایدر"
                  change={(e) => setData({ ...data, priceChangeRange: e })}
                  currentValue={data.priceChangeRange || ""}
                  number
                  price
                  allowZero
                />
                <div className="col-span-4">
                  <TextEditor
                    value={data?.description}
                    change={(e) => setData({ ...data, description: e })}
                    hint="مشخصات "
                  />
                </div>
                {/*        <div className="col-span-2 leftInput">
          <TextInput
            label=" api key"
            change={(e) => setData({ ...data, ApiKey: e })}
            currentValue={data.ApiKey || ""}
          />
        </div> */}
                {/*  <div className="flex items-center gap-3">
          <span>دارای بیمه اجباری : </span>
          <Switch
            checked={data?.hasForceInsurance}
            onChange={() =>
              setData({ ...data, hasForceInsurance: !data?.hasForceInsurance })
            }
          />
        </div> */}{" "}
                <div className="col-span-4 grid grid-cols-3 gap-x-8 gap-y-4 my-7">
                  {" "}
                  <div className="flex items-center justify-between gap-3">
                    <span>فعال/غیر فعال کردن تسهیلات: </span>
                    <Switch
                      checked={data?.isActive}
                      onChange={() =>
                        setData({ ...data, isActive: !data?.isActive })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>نمایش در فرانت : </span>
                    <Switch
                      checked={data?.showInFront}
                      onChange={() =>
                        setData({ ...data, showInFront: !data?.showInFront })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>دارای اعتبار سنجی اولیه: </span>
                    <Switch
                      checked={data?.hasValidation}
                      onChange={() =>
                        setData({
                          ...data,
                          hasValidation: !data?.hasValidation,
                        })
                      }
                    />
                  </div>{" "}
                  <div className="flex items-center justify-between gap-3">
                    <span>نمایش جزییات در فرانت : </span>
                    <Switch
                      checked={data?.showDetailInFront}
                      onChange={() =>
                        setData({
                          ...data,
                          showDetailInFront: !data?.showDetailInFront,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>دارای هدیه: </span>
                    <Switch
                      checked={data?.hasBlock}
                      onChange={(e) => {
                        if (!e.target.checked) {
                          setData({
                            ...data,
                            hasBlock: !data?.hasBlock,
                            blockedPercent: 0,
                            blockedDays: 0,
                          });
                        } else {
                          setData({ ...data, hasBlock: !data?.hasBlock });
                        }
                      }}
                    />
                  </div>{" "}
                  <div className="flex items-center justify-between gap-3">
                    <span>فقط استفاده از کیف پول تسهیلاتی : </span>
                    <Switch
                      checked={data?.onlyCanUseFacilityWallet}
                      onChange={() =>
                        setData({
                          ...data,
                          onlyCanUseFacilityWallet:
                            !data?.onlyCanUseFacilityWallet,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span> دارای اعتبار سنجی تامین کننده: </span>
                    <Switch
                      checked={data?.hasFinancierCheckCredit}
                      onChange={() =>
                        setData({
                          ...data,
                          hasFinancierCheckCredit:
                            !data?.hasFinancierCheckCredit,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span> دارای اعتبار سنجی تضمین کننده : </span>
                    <Switch
                      checked={data?.hasGuarantorCheckCredit}
                      onChange={() =>
                        setData({
                          ...data,
                          hasGuarantorCheckCredit:
                            !data?.hasGuarantorCheckCredit,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span> دارای درخواست ثبت وام در تامین کننده : </span>
                    <Switch
                      checked={data?.hasFinancierRequestLoan}
                      onChange={() =>
                        setData({
                          ...data,
                          hasFinancierRequestLoan:
                            !data?.hasFinancierRequestLoan,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span> دارای درخواست ثبت وام در تضمین کننده : </span>
                    <Switch
                      checked={data?.hasGuarantorRequestLoan}
                      onChange={() =>
                        setData({
                          ...data,
                          hasGuarantorRequestLoan:
                            !data?.hasGuarantorRequestLoan,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span> دارای ثبت نهایی وام در تامین کننده : </span>
                    <Switch
                      checked={data?.hasFinancierSubmitLoan}
                      onChange={() =>
                        setData({
                          ...data,
                          hasFinancierSubmitLoan: !data?.hasFinancierSubmitLoan,
                        })
                      }
                    />
                  </div>{" "}
                  <div className="flex items-center justify-between gap-3">
                    <span> دارای ثبت نهایی وام در تضمین کننده : </span>
                    <Switch
                      checked={data?.hasGuarantorSubmitLoan}
                      onChange={() =>
                        setData({
                          ...data,
                          hasGuarantorSubmitLoan: !data?.hasGuarantorSubmitLoan,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span> نمایش مبلغ بازپرداخت نهایی در چک اوت : </span>
                    <Switch
                      checked={data?.showFinalRefundAmount}
                      onChange={() =>
                        setData({
                          ...data,
                          showFinalRefundAmount: !data?.showFinalRefundAmount,
                        })
                      }
                    />
                  </div>
                </div>
                <TextInput
                  label="درصد هدیه"
                  change={(e) => setData({ ...data, blockedPercent: e })}
                  currentValue={data.blockedPercent || ""}
                  number
                  disabled={!data?.hasBlock}
                />
                <TextInput
                  label=" تعداد روز هدیه"
                  change={(e) => setData({ ...data, blockedDays: e })}
                  currentValue={data.blockedDays || ""}
                  number
                  disabled={!data?.hasBlock}
                />
                <GroupsUser groups={groups} data={data} setData={setData} />
              </div>
              <UploadImage
                file={avatar}
                change={setAvatar}
                address={data.galleryId}
                selectedProductImage={selectedProductImage}
                setselectedProductImage={setselectedProductImage}
              />
              <Box
                sx={{
                  ".MuiInputBase-root": {
                    minWidth: { md: "300px" },
                  },
                }}
                className="border-t w-full mt-4 pt-4 flex gap-3 my-4 items-center"
              >
                <span>تنظیمات نماینده : </span>
                <TextInput
                  label="  حداکثر مبلغ پیش فاکتور"
                  change={(e) =>
                    setData({ ...data, maxPreInvoiceAmountForAgent: e })
                  }
                  currentValue={data.maxPreInvoiceAmountForAgent || ""}
                  number
                  price
                  allowZero
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {userPermissions?.LoanSettings?.delete && (
                  <IconButton
                    size="large"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Delete sx={{ color: "red" }} />
                  </IconButton>
                )}
                <div style={{ flexGrow: 1 }} />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitData}
                  disabled={loading}
                  sx={{ width: { xs: "50%", md: "auto" } }}
                >
                  {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
                </Button>{" "}
              </Box>
              <Confirm
                message="آیا از حذف این تسهیلات اطمینان دارید؟"
                close={() => setConfirmDelete(false)}
                submit={deleteAttr}
                open={confirmDelete}
              />
            </>
          )}
        </Paper>
      </div>
    </>
  );
};

export default FaciltyModal;
