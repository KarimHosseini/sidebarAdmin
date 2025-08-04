import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Dropdown,
  Modal,
  TextInput,
  UploadImage,
} from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_INSURANCE,
  DELETE_INSURANCE,
  EDIT_INSURANCE,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const InsuranceModal = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
  type,
  serviceType,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [data, setData] = useState({ maxPurchaseCount: 1 });
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState({});
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setData(prevData);
      setAvatar(data.avatar);
      setselectedProductImage(prevData.galleryId);
    }
  }, [prevData, forEdit]);
  const resetData = () => {
    setData({ maxPurchaseCount: 1 });

    setselectedProductImage();
  };
  const deleteBrand = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_INSURANCE}?id=${data.id}`,
          configReq(token)
        )
        .then((res) => {
          var temp = [...allRows];
          var newData = temp.filter((item) => item.id !== data.id);
          setAllRows(newData);
          setLoading(false);
          setOpenDelete(false);
          close();
          if (data.code === 200) {
            toast.success("با موفقیت حذف شد");
          }
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
          setOpenDelete(false);
          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
    }
  };

  const editItem = () => {
    var sendingData = {
      title: data.title,
      files: avatar,
      fromGallery: selectedProductImage ? selectedProductImage : "",
      active: data.active,
      description: data.description,
      code: data.code,
      maxInsurancePrice: data.maxInsurancePrice,
      minIsurancePrice: data.minIsurancePrice,
      Percent: data.percent,
      serviceTypeId: data.serviceTypeId,
      vat: data.vat,
      hasVat: data.hasVat,
      showInSite: data.showInSite,
      maxPurchaseCount: data.maxPurchaseCount,
    };
    if (forEdit) {
      sendingData = { ...sendingData, id: data.id };
    }
    if (serviceType?.find((g) => g.id === data?.serviceTypeId)?.isInsurance) {
      sendingData = { ...sendingData, type: data.type };
    }
    var temp = [...allRows];

    if (data.title) {
      setLoading(true);
      if (forEdit) {
        axiosInstance
          .put(`${baseUrl}/${EDIT_INSURANCE}`, sendingData, configReq(token))
          .then((res) => {
            setLoading(false);
            toast.success("با موفقیت ویرایش شد");
            var index = temp.findIndex((item) => item.id === data.id);
            temp[index] = res.data.data;
            setAllRows(temp);
            close();
            resetData();
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
          .post(`${baseUrl}/${CREATE_INSURANCE}`, sendingData, configReq(token))
          .then((res) => {
            temp.unshift(res.data.data);

            setAllRows(temp);
            setLoading(false);
            toast.success("با موفقیت اضافه شد");
            close();
            resetData();
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
      toast.error("نام خدمات را وارد کنید");
    }
  };
  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  خدمات`}
    >
      <TextInput
        label="نام خدمات"
        change={(e) => setData({ ...data, title: e })}
        currentValue={data.title}
      />
      <TextInput
        label="کد "
        change={(e) => setData({ ...data, code: e })}
        currentValue={data.code}
      />{" "}
      <TextInput
        label="حداکثر تعداد قابل خرید برای هر محصول در سبد"
        change={(e) => setData({ ...data, maxPurchaseCount: e })}
        currentValue={data.maxPurchaseCount}
      />
      <Dropdown
        value={serviceType?.find((g) => g.id === data?.serviceTypeId)}
        change={(e) => setData({ ...data, serviceTypeId: e.id })}
        data={serviceType}
        title="دسته بندی خدمات   "
      />
      {serviceType?.find((g) => g.id === data?.serviceTypeId)?.isInsurance && (
        <>
          {" "}
          <Dropdown
            value={type?.find((g) => g.id === data?.type)}
            change={(e) => setData({ ...data, type: e.id, inType: e.type })}
            data={type}
            label="نوع بیمه  "
          />
        </>
      )}
      <TextField
        label="توضیحات کلی خدمات"
        value={data.description}
        onChange={(e) => setData({ ...data, description: e.target.value })}
        multiline
        rows={3}
      />
      <TextInput
        label="حداقل قیمت محصول"
        change={(e) => setData({ ...data, minIsurancePrice: e })}
        currentValue={data.minIsurancePrice || ""}
        price
        number
      />
      <TextInput
        label="حداکثر قیمت محصول"
        change={(e) => setData({ ...data, maxInsurancePrice: e })}
        currentValue={data.maxInsurancePrice || ""}
        price
        number
      />
      <TextInput
        label="درصد هزینه خدمات از محصول  "
        change={(e) => setData({ ...data, percent: e })}
        currentValue={data.percent || ""}
        price
        number
        priceLabel="%"
      />{" "}
      <div className="flex items-center gap-4">
        <span className="text-xs">دارای ارزش افزوده</span>
        <Switch
          onChange={(e) => setData({ ...data, hasVat: !data.hasVat })}
          checked={data.hasVat}
          disabled={!userPermissions?.gatewaySetting?.patch}
        />{" "}
      </div>
      {data.hasVat && (
        <TextInput
          disabled={!data.hasVat}
          currentValue={data.vat}
          change={(e) => setData({ ...data, vat: e })}
          label=" درصد ارزش افزوده "
        />
      )}
      <div className="flex items-center gap-3">
        <span>فعال/غیر فعال : </span>
        <Switch
          checked={data.active}
          onChange={() => setData({ ...data, active: !data.active })}
        />
      </div>{" "}
      <div className="flex items-center gap-3">
        <span>نمایش در سایت : </span>
        <Switch
          checked={data.showInSite}
          onChange={() => setData({ ...data, showInSite: !data.showInSite })}
        />
      </div>{" "}
      <UploadImage
        file={avatar}
        change={setAvatar}
        address={data.galleryId}
        selectedProductImage={selectedProductImage}
        setselectedProductImage={setselectedProductImage}
      />
      <Box sx={{ display: "flex" }}>
        {userPermissions?.insurance?.delete && forEdit && (
          <IconButton onClick={() => setOpenDelete(true)}>
            <Delete color="error" />
          </IconButton>
        )}
        <div style={{ flexGrow: 1 }} />
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
        message="آیا از حذف این خدمات اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteBrand}
        open={openDelete}
      />
    </Modal>
  );
};

export default InsuranceModal;
