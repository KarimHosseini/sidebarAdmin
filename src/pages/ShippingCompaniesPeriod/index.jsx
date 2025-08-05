/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import { Button, IconButton, Switch } from "@mui/material";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_SHIPPING_CSV,
  ALL_SHIPPING_PERIOD,
  baseUrl,
  DELETE_ALL_SHIPPING_PERIOD,
  EDIT_ACTIVE_ALL_SHIPPING_PERIOD,
  EDIT_ACTIVE_SHIPPING_PERIOD,
  EXPORT_SHIPPING_PERIOD,
} from "../../helpers/api-routes";
import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { configReq } from "../../helpers/functions";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { toast } from "react-toastify";
import AddchartIcon from "@mui/icons-material/Addchart";
import EditShipingPeriodModal from "./modal";
import AddIcon from "@mui/icons-material/Add";
import Uploader from "../../components/common/uploader";
import { Modal } from "../../components/common";

const ShippingCompanyPeriod = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isUpdate, setIsUpdate] = useState(false);
  const [refreshData, setRefresh] = useState(0);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState();
  const [openEdit, setOpenEdit] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [forEdit, setForEdit] = useState(false);
  const [allRows, setAllRows] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);

  const { token } = useSelector((state) => state.user);

  const importCsv = () => {
    const formData = new FormData();

    formData.append("companyId", id);

    formData.append("files", files);
    if (isUpdate) {
      formData.append("isUpdate", isUpdate);
    }
    axiosInstance
      .post(`${baseUrl}/${ALL_SHIPPING_CSV}`, formData, configReq(token))
      .then((res) => {
        setRefresh((r) => r + 1);
        toast.success("با موفقیت اضافه شد");
        setOpen(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };
  console.log(editingData,'editingData')
  // Control modal opening after editingData is set
  useEffect(() => {
    if (editingData && Object.keys(editingData).length > 0 && forEdit) {
      setOpenEdit(true);
    }
  }, [editingData, forEdit]);

  return (
    <>
      <CustomePage
        broadCrumb={[
          {
            title: "    ارسال کالا ",
            path: "/shippingSetting",
          },
          {
            title: "شرکتهای حمل",
            path: "/shipping-companies",
          },
        ]}
        title={"   بازه ارسالی " + searchParams.get("name")}
        apis={{
          GET_DATA: ALL_SHIPPING_PERIOD,
          EXPORT_DATA: EXPORT_SHIPPING_PERIOD,
          EDIT_ACTIVE_DATA: EDIT_ACTIVE_SHIPPING_PERIOD,
          DELETE_ALL_DATA: DELETE_ALL_SHIPPING_PERIOD,
          EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_SHIPPING_PERIOD,
        }}
        canAdd={false}
        canEdit={false}
        customeModal={false}
        feilds={[]}
        permissionsTag={"shippingPeriod"}
        neededFields={["id", "title"]}
        onRowClick={(data) => {
          setEditingData(data);
          setForEdit(true);
        }}
        onDataChange={setAllRows}
        extraButtons={
          <>
            {userPermissions?.shippingPeriod?.insert && (
              <Button onClick={() => setOpenCreate(true)} variant="contained">
                <AddIcon />
                افزودن بازه ارسالی جدید
              </Button>
            )}{" "}
            {userPermissions?.shippingPeriod?.import && (
              <Button
                variant="outlined"
                onClick={() => setOpen(true)}
                color="success"
              >
                <AddchartIcon className="mx-1" />
                ورود یا آپدیت از اکسل
              </Button>
            )}
          </>
        }
        extraParams={{ name: "shippingCompanyId", value: id }}
        extraActions={
          userPermissions?.shippingPeriod?.update
            ? [
                {
                  title: "ویرایش",
                  handler: (
                    <>
                      <IconButton
                        onClick={() => {
                          setOpenEdit(true);
                        }}
                      >
                        <Edit sx={{ color: "#ff2000" }} />
                      </IconButton>
                    </>
                  ),
                },
              ]
            : false
        }
        alart={
          <>
            اپدیت از اکسل : بمعنای آپدیت اطلاعات کنونی بر اساس خروجی اکسل می
            باشد ( بدون درج ردیف جدید ) <br />
            ورود از اکسل : بمعنای ورود اطلاعات جدید در ردیف های جدید می باشد
          </>
        }
      />
      
      {/* Separate modal outside CustomePage to prevent infinite renders */}
      <EditShipingPeriodModal
        open={openEdit || openCreate}
        close={() => {
          setOpenEdit(false);
          setEditingData({});
          setForEdit(false);
          setOpenCreate(false);
        }}
        prevData={editingData}
        forEdit={forEdit}
        setAllRows={setAllRows}
        allRows={allRows}
      />{" "}
      <Modal
        open={open}
        close={() => {
          setOpen(false);
        }}
        title=" ورود  از اکسل"
        autoWidth={true}
      >
        <div className="flex flex-col items-center justify-between gap-5">
          <Uploader
            setFiles={(e) => {
              setFiles(e);
            }}
          />
          <div className="flex items-center gap-4">
            <span className="text-xs"> به روز رسانی: </span>
            <Switch
              onChange={() => setIsUpdate(!isUpdate)}
              defaultChecked={isUpdate}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => importCsv()}
            disabled={!files}
          >
            ثبت اطلاعات
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ShippingCompanyPeriod;
