/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import AddchartIcon from "@mui/icons-material/Addchart";
import { Box, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dropdown, Modal } from "../../../components/common";
import Uploader from "../../../components/common/uploader";
import CustomePage from "../../../components/customePage";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import NoAccess from "../../../components/noAccess";
import {
  ALL_PRICES,
  CREATE_WORK,
  EDIT_ACTIVE_PRODUCT_PROPERTIES,
  EDIT_PRODUCT_PROPERTIES,
  EXPORT_AALL_PRICES,
  REMOVE_PRODUCT_PROPERTIES,
  baseUrl,
  disableAllProductProperties,
  importPrices,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import { logout } from "../../../redux/slices/user";
import EditPrice from "./modal";

const ProductProperties = () => {
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [percent, setPercent] = useState();
  const [disabledModal, setdisabledModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [supplierData, setSupplierData] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [files, setFiles] = useState();
  const [loadingP, setLoadingP] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [forEdit, setForEdit] = useState(false);
  const [allRows, setAllRows] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editingData && Object.keys(editingData).length > 0 && forEdit) {
      setOpenEdit(true);
    }
  }, [editingData, forEdit]);

  const productApis = {
    GET_DATA: ALL_PRICES,
    EXPORT_DATA: EXPORT_AALL_PRICES,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_PRODUCT_PROPERTIES,
    CREATE_DATA: CREATE_WORK,
    EDIT_DATA: EDIT_PRODUCT_PROPERTIES,
    DELETE_DATA: REMOVE_PRODUCT_PROPERTIES,
  };
  
  const disabledAll = () => {
    axiosInstance
      .put(`${baseUrl}/${disableAllProductProperties}`, {}, configReq(token))
      .then((res) => {
        setdisabledModal(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };

  const importCsv = () => {
    const formData = new FormData();
    formData.append("supplierId", supplier?.id);
    formData.append("files", files);
    axiosInstance
      .post(`${baseUrl}/${importPrices}`, formData, configReq(token))
      .then((res) => {
        setOpen(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };

  const customModalComponent = (
    <EditPrice
      open={openEdit}
      close={() => {
        setOpenEdit(false);
        setEditingData({});
        setForEdit(false);
      }}
      prevData={editingData}
      forEdit={forEdit}
      setAllRows={setAllRows}
      allRows={allRows}
    />
  );

  if (!userPermissions?.productProperties?.view) {
    return <NoAccess />;
  }

  return (
    <>
      <CustomePage
        apis={productApis}
        title="لیست کالاها"
        canAdd={false}
        canEdit={true}
        permissionsTag="productProperties"
        customeModal={true}
        feilds={[]}
        broadCrumb={[
          {
            title: "مدیریت محصولات",
            path: "/products",
          },
        ]}
        neededFields={["id", "isBundle", "slug"]}
        onRowClick={(data) => {
          setEditingData(data);
          setForEdit(true);
        }}
        onDataChange={setAllRows}
        customModalComponent={customModalComponent}
        extraButtons={
          <>
            {userPermissions?.productProperties?.import && (
              <Button
                variant="outlined"
                onClick={() => setOpen(true)}
                color="success"
              >
                <AddchartIcon className="mx-1" />
                ورودی از اکسل
              </Button>
            )}
            {userPermissions?.productProperties?.disableAll && (
              <Button
                onClick={() => setdisabledModal(true)}
                variant="contained"
                color="error"
              >
                غیر فعال کردن کلیه ویژگی های
              </Button>
            )}
            {userPermissions?.productProperties?.editBulkPrices && (
              <div className="flex flex-col  md:gap-1 gap-2">
                <span className="text-[#495057] text-xs font-medium mr-5 label">
                  تغییر قیمت به درصد تجمیعی -+
                </span>{" "}
                <Box
                  sx={{
                    fieldset: {
                      border: "none !important",
                    },
                  }}
                  className="flex border rounded-[30px] pr-2  h-[3rem]"
                >
                  <Box
                    component={"input"}
                    type={"number"}
                    sx={{
                      background: (theme) => theme.palette.background.paper,
                    }}
                    className="w-full h-[75%] my-[6px] p-3 border-0  md:max-w-[6rem] "
                    onChange={(e) => setPercent(e.target.value)}
                    value={percent || ""}
                  />
                  <Box
                    sx={{
                      background: (theme) => theme.palette.primary.main,
                    }}
                    onClick={() => {
                      setLoadingP(true);
                      if (percent) {
                        setOpenConfirm(true);
                      }
                    }}
                    className="flex cursor-pointer justify-center items-center h-[2.9rem] w-[4rem] rounded-l-[30px] text-white"
                  >
                    {loadingP ? (
                      <>
                        <CircularProgress size={16} />
                      </>
                    ) : (
                      <>اعمال</>
                    )}
                  </Box>
                </Box>
              </div>
            )}
          </>
        }
        extraActions={
          userPermissions?.productProperties?.update
            ? [
                {
                  title: "ویرایش",
                  handler: (
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
                  ),
                },
              ]
            : []
        }
        showSync={true}
        showExport={true}
      />{" "}
      <Modal
        open={disabledModal}
        close={() => {
          setdisabledModal(false);
        }}
        title="آیا از غیر فعال کردن تمام ویژگی های محصولات اطمینان دارید؟"
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
        }}
        title=" ورود محصول از اکسل"
        autoWidth={true}
      >
        <div className="flex flex-col items-center justify-between gap-5">
          <Dropdown
            title="  تامین کننده"
            data={supplierData}
            value={supplier}
            change={setSupplier}
            onOpen={() => {
              // TODO: Load suppliers when dropdown opens
              setSupplierData([]);
            }}
          />
          <Uploader
            setFiles={(e) => {
              setFiles(e);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => importCsv()}
            disabled={!files || !supplier}
          >
            ثبت اطلاعات
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ProductProperties;
