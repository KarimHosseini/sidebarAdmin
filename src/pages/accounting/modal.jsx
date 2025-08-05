import { Delete } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Switch,
  TextField,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_ACCOUNTING_PAGES,
  DELETE_ACCOUNTING_PAGES,
  EDIT_ACCOUNTING_BRAND_TO_CATEGORY_PAGES,
  EDIT_ACCOUNTING_PAGES,
  GET_ACCOUNTING_PAGES,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
const AccountingModal = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
  BRAND,
  categroies,
  reRender,
}) => {
  const { token } = useSelector((state) => state.user);
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isBrand, setIsBrand] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const { userPermissions } = useSelector((state) => state.relationals);

  const { id } = useParams();

  useEffect(() => {
    if (data && forEdit) {
      setAllData(data);
    } else {
      setAllData({});
      setIsBrand(true);
    }
  }, [data, forEdit]);
  const deleteItem = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_ACCOUNTING_PAGES}?id=${data.id}`,
          configReq(token)
        )
        .then((res) => {
          var temp = [...allRows];
          var newData = temp.filter((item) => item.id !== data.id);
          setAllRows(newData);
          setLoading(false);
          toast.success("با موفقیت حذف شد");
          setOpenDelete(false);
          close();
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
          setOpenDelete(false);
        });
    }
  };

  const editItem = () => {
    var sendingData = allData.isCategory
      ? {
          categoryId: allData.categoryId,
          categoryTitle: allData.categoryTitle,
          id: allData.id,
          isSerialize: allData.isSerialize,
          isSyncActive: allData.isSyncActive,
          isService: allData.isService,
        }
      : {
          brandId: allData.brandId,
          brandName: allData.brandName,
          id: allData.id,
          isSerialize: allData.isSerialize,
          isSyncActive: allData.isSyncActive,
          isService: allData.isService,
        };
    Object.keys(sendingData).forEach((key) => {
      if (sendingData[key] === null || sendingData[key] === "") {
        delete sendingData[key];
      }
    });

    setLoading(true);
    var temp = [...allRows];
    if (forEdit) {
      axiosInstance
        .put(`${baseUrl}/${EDIT_ACCOUNTING_PAGES}`, sendingData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false);
          toast.success("با موفقیت ویرایش شد");
          var index = temp.findIndex((item) => item.id === data.id);
          temp[index] = res.data.data;
          setAllRows(temp);
          close();
          reset();
          setAllData({});
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading(false);
        });
    } else {
      axiosInstance
        .post(
          `${baseUrl}/${CREATE_ACCOUNTING_PAGES}`,
          sendingData,
          configReq(token)
        )
        .then((res) => {
          temp.unshift(res.data.data);

          setAllRows(temp);
          setLoading(false);
          toast.success("با موفقیت اضافه شد");
          close();
          reset();
          setAllData({});
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading(false);
        });
    }
  };
  const reset = () => {};
  const handleChange = () => {
    setLoadingConfirm(true);
    axiosInstance
      .put(
        `${baseUrl}/${EDIT_ACCOUNTING_BRAND_TO_CATEGORY_PAGES}`,
        { id: data.id },
        configReq(token)
      )
      .then((res) => {
        axiosInstance
          .get(
            `${baseUrl}/${GET_ACCOUNTING_PAGES}?id=${data.id}`,
            configReq(token)
          )
          .then((res) => {
            setLoadingConfirm(false);
            toast.success("با موفقیت ویرایش شد");
            setOpenConfirm(false);
            setIsBrand(false);
            setAllData(res.data.data);
            var temp = [...allRows];
            var index = temp.findIndex((item) => item.id === data.id);
            temp[index] = res.data.data;
            setAllRows(temp);
          })
          .catch((err) => {
            toast.error(err.response?.data?.message);
            setLoadingConfirm(false);
          });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoadingConfirm(false);
      });
  };
  return (
    <Modal
      open={open}
      close={() => {
        close();
        reset();
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  تنظیمات دسته بندی ارپا `}
    >
      {!allData.isSync && !allData.isCategory && (
        <div className="border-b mb-4 pb-4">
          <div className="flex gap-1 items-center">
            <span className="text-sm text-gray-700">
              آیا این برند هست ؟‌ :{" "}
            </span>
            <Switch
              disabled={!isBrand}
              checked={isBrand}
              onClick={() => setOpenConfirm(true)}
            />
          </div>
        </div>
      )}
      <div className="flex gap-3">
        <span className="font-bold text-red-700">{data.itemCategoryName}</span>
        <span className="text-sm"> وصل شود به</span>
      </div>

      {allData.isCategory ? (
        <>
          {" "}
          <Autocomplete
            options={categroies || []}
            getOptionLabel={(option) => option.title || ""}
            value={
              allData.isSync
                ? categroies.find((item) => item.id === allData?.categoryId) ||
                  null
                : null
            }
            onChange={(e, newValue) =>
              setAllData({
                ...allData,
                categoryId: newValue?.id,
                categoryTitle: newValue?.title,
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="دسته بندی"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          />
        </>
      ) : (
        <>
          {" "}
          <Autocomplete
            options={BRAND || []}
            getOptionLabel={(option) => option.title || ""}
            value={
              allData.isSync
                ? BRAND.find((item) => item.id === allData?.brandId) || null
                : null
            }
            onChange={(e, newValue) =>
              setAllData({
                ...allData,
                brandId: newValue?.id,
                brandName: newValue?.title,
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={"برند"}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          />
        </>
      )}
      <div className="flex items-center gap-3">
        <span className="text-light">دارای سریال : </span>
        <Switch
          checked={allData.isSerialize}
          onChange={() =>
            setAllData({
              ...allData,
              isSerialize: !allData?.isSerialize,
            })
          }
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-light">فعال / غیرفعال : </span>
        <Switch
          checked={allData.isSyncActive}
          onChange={() =>
            setAllData({
              ...allData,
              isSyncActive: !allData?.isSyncActive,
            })
          }
        />
      </div>
{allData.isCategory &&      <div className="flex items-center gap-3">
        <span className="text-light"> خدمات : </span>
        <Switch
          checked={allData.isService}
          onChange={() =>
            setAllData({
              ...allData,
              isService: !allData?.isService,
            })
          }
        />
      </div>}
      <Box sx={{ display: "flex" }}>
        {userPermissions?.accountingArpaCategroty?.delete && data.id && (
          <IconButton onClick={() => setOpenDelete(true)}>
            <Delete color="error" />
          </IconButton>
        )}
        <div style={{ flexGrow: 1 }} />{" "}
        <Button
          variant="contained"
          color="primary"
          onClick={editItem}
          disabled={loading}
        >
          {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
        </Button>
      </Box>
      <Confirm
        message="آیا از حذف این تنظیمات دسته بندی ارپا  اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
      <Confirm
        message="آیا از تغییر نوع مطمئن هستید؟"
        close={() => setOpenConfirm(false)}
        submit={handleChange}
        loading={loadingConfirm}
        type="info"
        open={openConfirm}
      />
    </Modal>
  );
};

export default AccountingModal;
