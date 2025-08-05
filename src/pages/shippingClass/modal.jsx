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
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, UploadImage } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_SHIPPINGCLASS,
  DELETE_SHIPPINGCLASS,
  EDIT_SHIPPINGCLASS,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const EditShipingClassModal = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
}) => {
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);

  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [avatar, setAvatar] = useState([]);
  const [selectedProductImage, setselectedProductImage] = useState();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data && forEdit) {
      setAllData(data);
    } else {
      setAllData({});
    }
  }, [data, forEdit]);

  const validate = () => {
    const e = {};
    const pairs = [
      ["maxLength", "minLength"],
      ["maxWidth", "minWidth"],
      ["maxHeight", "minHeight"],
      ["maxWeight", "minWeight"],
      ["maxFinancialCommitment", "minFinancialCommitment"],
    ];
    for (const [max, min] of pairs) {
      const maxVal = Number(allData[max] || 0);
      const minVal = Number(allData[min] || 0);
      if (maxVal < minVal) {
        e[max] = `مقدار حداکثر نباید کوچکتر از حداقل باشد`;
        e[min] = `مقدار حداقل نباید بزرگتر از حداکثر باشد`;
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const deleteItem = () => {
    setLoading(true);
    axiosInstance
      .delete(
        `${baseUrl}/${DELETE_SHIPPINGCLASS}?id=${data.id}`,
        configReq(token)
      )
      .then(() => {
        setAllRows(allRows.filter((item) => item.id !== data.id));
        setLoading(false);
        toast.success("با موفقیت حذف شد");
        setOpenDelete(false);
        close();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "خطا در حذف");
        setLoading(false);
        setOpenDelete(false);
      });
  };

  const editItem = () => {
    if (!validate()) {
      toast.error("لطفاً خطاهای فرم را برطرف کنید");
      return;
    }

    let sendingData = {
      name: allData.name,
      files: avatar,
      maxLength: allData.maxLength || 0,
      maxWidth: allData.maxWidth || 0,
      maxHeight: allData.maxHeight || 0,
      maxWeight: allData.maxWeight || 0,
      maxFinancialCommitment: allData.maxFinancialCommitment || 0,
      minLength: allData.minLength || 0,
      minWidth: allData.minWidth || 0,
      minHeight: allData.minHeight || 0,
      minWeight: allData.minWeight || 0,
      minFinancialCommitment: allData.minFinancialCommitment || 0,
      active: !!allData.active,
      description: allData.description,
    };

    if (forEdit) sendingData.id = data.id;
    if (selectedProductImage) sendingData.fromGallery = selectedProductImage;

    setLoading(true);
    const temp = [...allRows];

    const req = forEdit
      ? axiosInstance.put(
          `${baseUrl}/${EDIT_SHIPPINGCLASS}`,
          sendingData,
          configReq(token)
        )
      : axiosInstance.post(
          `${baseUrl}/${CREATE_SHIPPINGCLASS}`,
          sendingData,
          configReq(token)
        );

    req
      .then((res) => {
        const resData = res.data.data;
        if (forEdit) {
          const index = temp.findIndex((item) => item.id === data.id);
          temp[index] = resData;
        } else {
          temp.unshift(resData);
        }
        setAllRows(temp);
        toast.success(`با موفقیت ${forEdit ? "ویرایش" : "افزوده"} شد`);
        close();
        setAllData({});
        setAvatar([]);
        setErrors({});
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "خطا در ارسال اطلاعات");
        setLoading(false);
      });
  };

  const handleChange = (field, value) => {
    setAllData({ ...allData, [field]: value });
    setTimeout(validate, 100);
  };

  const renderNumberField = (field, label, unit) => (
    <TextField
      label={label + " " + (unit || "")}
      value={allData?.[field] || ""}
      onChange={(e) => handleChange(field, e.target.value)}
      type="number"
      fullWidth
      error={!!errors[field]}
      helperText={errors[field]}
      size="small"
      variant="outlined"
    />
  );

  return (
    <Modal
      open={open}
      close={close}
      title={`${forEdit ? "ویرایش" : "افزودن"} کلاس ارسال کالا`}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="نام"
          value={allData.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          fullWidth
          required
        />

        <Box fontSize="small" color="text.secondary">
          حداکثر ابعاد (سانتی‌متر)
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
          {renderNumberField("maxLength", "حداکثر طول")}
          {renderNumberField("maxWidth", "حداکثر عرض")}
          {renderNumberField("maxHeight", "حداکثر ارتفاع")}
        </Box>

        {renderNumberField("maxWeight", "حداکثر وزن", "گرم")}
        {renderNumberField(
          "maxFinancialCommitment",
          "حداکثر تعهد مالی",
          "تومان"
        )}

        <Box fontSize="small" color="text.secondary">
          حداقل ابعاد (سانتی‌متر)
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
          {renderNumberField("minLength", "حداقل طول")}
          {renderNumberField("minWidth", "حداقل عرض")}
          {renderNumberField("minHeight", "حداقل ارتفاع")}
        </Box>

        {renderNumberField("minWeight", "حداقل وزن", "گرم")}
        {renderNumberField(
          "minFinancialCommitment",
          "حداقل تعهد مالی",
          "تومان"
        )}

        <TextField
          label="توضیحات"
          value={allData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          fullWidth
          multiline
          rows={3}
        />

        <Box display="flex" alignItems="center" gap={2}>
          <span className="text-sm">فعال/غیرفعال:</span>
          <Switch
            checked={!!allData.active}
            onChange={() => handleChange("active", !allData.active)}
          />
        </Box>

        <UploadImage
          file={avatar}
          change={setAvatar}
          address={data?.galleryId}
          selectedProductImage={selectedProductImage}
          setselectedProductImage={setselectedProductImage}
        />

        <Box display="flex" alignItems="center" mt={2}>
          {userPermissions?.shippingClass?.delete && forEdit && (
            <IconButton onClick={() => setOpenDelete(true)}>
              <Delete color="error" />
            </IconButton>
          )}
          <Box flexGrow={1} />
          <Button
            variant="contained"
            color="primary"
            onClick={editItem}
            disabled={loading || !allData.name}
          >
            {loading ? <CircularProgress size={24} /> : "ثبت اطلاعات"}
          </Button>
        </Box>
      </Box>

      <Confirm
        message="آیا از حذف این کلاس اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

export default EditShipingClassModal;
