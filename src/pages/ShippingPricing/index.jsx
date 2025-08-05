/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import AddIcon from "@mui/icons-material/Add";
import { Edit } from "@mui/icons-material";
import AddchartIcon from "@mui/icons-material/Addchart";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { Modal } from "../../components/common";
import CustomePage from "../../components/customePage";
import Uploader from "../../components/common/uploader";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { toast } from "react-toastify";
import {
  baseUrl,
  COMPANY_PRICES,
  COMPANY_PRICES_IMPORT,
  DELETE_ALL_SHIPPING_PRICE,
  Export_COMPANY_PRICES,
  UPDATE_ACTIVE_ALL_SHIPPING_PRICE,
  UPDATE_ACTIVE_SHIPPING_PRICE,
  UPDATE_FROM_API_COMPANY_PRICES,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import EditShippingCompanyCost from "./modal";
const ShippingCompanyPeriod = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [isUpdate, setIsUpdate] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [forEdit, setForEdit] = useState(false);
  const [allRows, setAllRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [loadingApi, setLoadingApi] = useState(false);
  const [files, setFiles] = useState();
  const { token } = useSelector((state) => state.user);
  const [refreshData, setRefresh] = useState(0);
  // Control modal opening after editingData is set
  useEffect(() => {
    if (editingData && Object.keys(editingData).length > 0 && forEdit) {
      setOpenEdit(true);
    }
  }, [editingData, forEdit]);
  const importCsv = () => {
    const formData = new FormData();

    formData.append("companyId", id);
    if (isUpdate) {
      formData.append("isUpdate", isUpdate);
    }
    formData.append("files", files);
    axiosInstance
      .post(`${baseUrl}/${COMPANY_PRICES_IMPORT}`, formData, configReq(token))
      .then((res) => {
        setRefresh((r) => r + 1);
        toast.success("با موفقیت اضافه شد");
        setOpen(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };
  const handleUpdate = () => {
    setLoadingApi(true);
    axiosInstance
      .get(
        `${baseUrl}/${UPDATE_FROM_API_COMPANY_PRICES}?shippingCompanyId=${id}`,
        configReq(token)
      )
      .then((res) => {
        setRefresh((r) => r + 1);
        toast.success("با موفقیت آپدیت شد");
        setLoadingApi(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoadingApi(false);
      });
  };
  return (
    <>
      <CustomePage
        apis={{
          GET_DATA: COMPANY_PRICES,
          EXPORT_DATA: Export_COMPANY_PRICES,
          EDIT_ACTIVE_DATA: UPDATE_ACTIVE_SHIPPING_PRICE,
          DELETE_ALL_DATA: DELETE_ALL_SHIPPING_PRICE,
          EDIT_ACTIVE_ALL_DATA: UPDATE_ACTIVE_ALL_SHIPPING_PRICE,
        }}
        title={`قیمت ${searchParams.get("title") || ""}`}
        canAdd={false}
        canEdit={false}
        customeModal={false}
        feilds={[]}
        permissionsTag="shippingCost"
        neededFields={["id", "price"]}
        broadCrumb={[
          {
            title: "ارسال کالا",
            path: "/shippingSetting",
          },
          {
            title: "شرکتهای حمل",
            path: "/shipping-companies",
          },
        ]}
        onRowClick={(data) => {
          setEditingData(data);
          setForEdit(true);
        }}
        onDataChange={setAllRows}
        extraButtons={
          <>
            {userPermissions?.shippingCost?.insert && (
              <Button onClick={() => setOpenCreate(true)} variant="contained">
                <AddIcon />
                افزودن قیمت جدید
              </Button>
            )}
            {userPermissions?.shippingCost?.import && (
              <Button
                variant="outlined"
                onClick={() => setOpen(true)}
                color="success"
              >
                <AddchartIcon className="mx-1" />
                ورود یا آپدیت از اکسل
              </Button>
            )}
            {userPermissions?.shippingCost?.update && allRows && allRows[0]?.hasUpdateKey && (
              <Button
                disabled={loadingApi}
                onClick={handleUpdate}
                variant="outlined"
              >
                {loadingApi ? (
                  <CircularProgress size={20} />
                ) : (
                  "آپدیت و اضافه کردن شهر از api"
                )}
              </Button>
            )}
          </>
        }
        extraParams={{ name: "shippingCompanyId", value: id }}
        extraActions={
          userPermissions?.shippingCost?.update
            ? [
                {
                  title: "ویرایش",
                  handler: (
                    <IconButton
                      onClick={() => {
                        setOpenEdit(true);
                      }}
                    >
                      <Edit sx={{ color: "#ff2000" }} />
                    </IconButton>
                  ),
                },
              ]
            : []
        }
        showSync={false}
        showExport={true}
        exportParams={`&filter[0][key]=shippingCompanyId&filter[0][value]=${id}&filter[0][operator]=eq`}
      />
      
      {/* Custom modal outside CustomePage to prevent infinite renders */}
      <EditShippingCompanyCost
        open={openEdit || openCreate}
        forEdit={openEdit}
        data={editingData}
        setAllRows={setAllRows}
        allRows={allRows}
        close={() => {
          setOpenCreate(false);
          setOpenEdit(false);
          setEditingData({});
          setForEdit(false);
        }}
      />
      <Modal
        open={open}
        close={() => {
          setOpen(false);
        }}
        title=" ورود یا ویرایش قیمت   "
        autoWidth={true}
      >
        <div className="flex flex-col items-center justify-between gap-5">
          <Uploader
            setFiles={(e) => {
              setFiles(e);
            }}
          />{" "}
          <div className="flex items-center gap-4">
            <span className="text-xs"> به روز رسانی: </span>
            <Switch
              onChange={() => setIsUpdate(!isUpdate)}
              defaultChecked={isUpdate}
            />
          </div>
          <Alert variant="standard" color="info">
            اپدیت قیمت شهر از فایل اکسل : بمعنای آپدیت اطلاعات کنونی بر اساس
            خروجی اکسل می باشد .( بدون درج ردیف جدید ) - حتما دکمه بروزرسانی
            روشن گردد . هزینه حمل به تومان میباشد
            <br />
            ورود قیمت جدید شهر از فایل اکسل : بمعنای ورود اطلاعات جدید می باشد
            که فقط باید شناسه ردیف صفر و کد شهر باید طبق خروجی شهر باشد ، در
            ورود اطلاعات دقت نمایید !! هزینه حمل به تومان میباشد{" "}
          </Alert>
          <div className="flex justify-end w-full gap-3">
            <Button
              onClick={() => {
                window.location.href = `${process.env.REACT_APP_LABEL_URL}/نمونه فایل اپدیت قیمت.xlsx`;
              }}
              variant="outlined"
              size="small"
              sx={{ mx: 2 }}
            >
              دانلود فایل نمونه
            </Button>{" "}
            <Button
              variant="contained"
              color="primary"
              onClick={() => importCsv()}
              disabled={!files}
            >
              ثبت اطلاعات
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ShippingCompanyPeriod;
