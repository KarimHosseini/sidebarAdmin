/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import PhonelinkOffIcon from "@mui/icons-material/PhonelinkOff";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Switch
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, TextInput } from "../../components/common";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import NoAccess from "../../components/noAccess";
import {
  ALL_PRODUCTS,
  baseUrl,
  disableAllProducts,
  EDIT_ACTIVE_PRODUCTS,
  EXPORT_ALL_PRODUCTS,
  SYNC_WITH_PAY
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const Products = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const navigate = useNavigate();
  const [loadingSync, setLoadingSync] = useState(false);
  const [open, setOpen] = useState(false);
  const [percent, setPercent] = useState(0);
  const [syncNumber, setSyncNumber] = useState(false);
  const [disabledModal, setdisabledModal] = useState(false);

  const disabledAll = () => {
    setdisabledModal(true);
    axiosInstance
      .put(`${baseUrl}/${disableAllProducts}`, {}, configReq(token))
      .then((res) => {
        setdisabledModal(false);
      })
      .catch((err) => {
        setdisabledModal(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const handleSync = () => {
    setLoadingSync(true);
    axiosInstance
      .get(
        `${baseUrl}/${SYNC_WITH_PAY}?priceChangePercent=${
          percent || 0
        }&syncProductCount=${syncNumber}`,
        configReq(token)
      )
      .then((res) => {
        setPercent(0);
        setLoadingSync(false);
        setOpen(false);
        toast.success("با موفقیت اعمال شد");
      })
      .catch((err) => {
        setLoadingSync(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  if (!userPermissions?.product?.view) {
    return <NoAccess />;
  }

  return (
    <>
      <CustomePage
        broadCrumb={[
          {
            title: "مدیریت محصولات",
            path: "/products",
          },
        ]}
        title="محصولات"
        apis={{
          GET_DATA: ALL_PRODUCTS,
          EXPORT_DATA: EXPORT_ALL_PRODUCTS,
          EDIT_ACTIVE_DATA:EDIT_ACTIVE_PRODUCTS
        }}
        canAdd={false}
        permissionsTag={"product"}
        neededFields={["id", "isBundle", "slug"]}
        extraButtons={
          <>
            {userPermissions?.product?.insert && (
              <Button
                onClick={() => navigate("/products/create")}
                variant="contained"
              >
                <AddIcon />
                افزودن محصول جدید
              </Button>
            )}
            {userPermissions?.product?.disableall && (
              <Button
                onClick={() => setdisabledModal(true)}
                variant="contained"
                color="error"
              >
                {" "}
                <PhonelinkOffIcon /> غیر فعال کردن کلیه محصولات
              </Button>
            )}{" "}
            {userPermissions?.product?.SyncProducts && (
              <Button
                onClick={() => setOpen(true)}
                variant="contained"
                disabled={loadingSync}
              >
                {loadingSync ? <CircularProgress /> : "سینک با سایت دوم"}
              </Button>
            )}
          </>
        }
        extraActions={
          userPermissions?.product?.update || userPermissions?.seoAssign?.view
            ? [
                {
                  title: "",
                  handler: (
                    <>
                      <IconButton
                        onClick={(event) => {
                          const target =
                            event.currentTarget.closest("[data-id]") ||
                            event.currentTarget.parentElement; 
                          const id = target.getAttribute("data-id");
                          const isBundle = target.getAttribute("data-isBundle");
                          if (isBundle === "true") {
                            toast.error(
                              "    اجازه ویرایش این محصول را در این بخش ندارید "
                            );
                          } else {
                            window.open(`/products/${id}`, "_blank");
                          }
                        }}
                      >
                        <Edit sx={{ color: "#ff2000" }} />
                      </IconButton>
                    </>
                  ),
                },
                {
                  title: "ویرایش",
                  handler: (
                    <>
                      <Button
                        onClick={(event) => {
                          const target =
                            event.currentTarget.closest("[data-id]") ||
                            event.currentTarget.parentElement;
                          const id = target.getAttribute("data-id");
                          const slug = target.getAttribute("data-slug");

                          window.open(
                            `/seoGenrator?id=${id}&name=product&slug=${slug}`
                          );
                        }}
                        variant="outlined"
                      >
                        ویرایش seo
                      </Button>
                    </>
                  ),
                },
              ]
            : []
        }
      />{" "}
      <Modal
        open={disabledModal}
        close={() => {
          setdisabledModal(false);
        }}
        title="آیا از غیر فعال کردن تمام محصولات اطمینان دارید؟"
        autoWidth={true}
      >
        <div className="flex items-center justify-between gap-5">
          <Button onClick={disabledAll} variant="contained" color="primary">
            بله
          </Button>
          <Button
            onClick={() => {
              setdisabledModal(false);
            }}
            variant="outlined"
            color="error"
          >
            انصراف
          </Button>
        </div>
      </Modal>
      <Modal
        open={open}
        close={() => {
          setOpen(false);
          setPercent(0);
        }}
        title="در صورتی که میخواهید تغییر قیمت داشته باشید درصد را وارد کنید"
        autoWidth={true}
      >
        <TextInput
          currentValue={percent}
          change={(e) => setPercent(e)}
          label="درصد تغییرات قیمت"
        />
        <div className="flex items-center my-5 gap-5">
          <Switch
            checked={syncNumber}
            onClick={() => setSyncNumber(!syncNumber)}
          />
          <span>سینک تعداد محصول</span>
        </div>
        <div className="flex items-center justify-between gap-5">
          <Button
            onClick={handleSync}
            disabled={loadingSync}
            variant="contained"
            color="primary"
          >
            {loadingSync ? <CircularProgress /> : "اعمال تغییرات"}
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              setPercent(0);
            }}
            variant="outlined"
            color="error"
          >
            انصراف
          </Button>
        </div>
        <Alert variant="outlined" severity="info">
          در صورت وارد نکردن عدد درصد ، قیمتها بدون تغییر سینک می گردد.
        </Alert>
      </Modal>
    </>
  );
};

export default Products;
