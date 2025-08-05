import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Switch,
} from "@mui/material";
import "@neshan-maps-platform/react-openlayers/dist/style.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Dropdown, Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  DELETE_SHIPPING_PRICE,
  GET_PROVINCE,
  SET_SHIPPING_PRICE,
  UPDATE_SHIPPING_PRICE,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
const EditShippingCompanyCost = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
  allShippingClass,
}) => {
  const { token } = useSelector((state) => state.user);
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [avatar, setAvatar] = useState([]);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);
  const { themeColor } = useSelector((state) => state.themeColor);
  const [province, setProvince] = useState([]);
  const [cities, setCities] = useState();

  const { id } = useParams();

  useEffect(() => {
    const stateId = data.provinceId;
    axiosInstance(`${baseUrl}/${GET_PROVINCE}`, configReq(token))
      .then((res) => {
        const { data } = res;

        if (data && data.code === 200 && data.data) {
          setProvince(data.data);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  }, []);
  useEffect(() => {
    if (!cities) {
      setCities(province?.find((item) => item.id === data.provinceId)?.cities);
    }
  }, [province, data.provinceId, cities]);
  useEffect(() => {
    if (data && forEdit) {
      setAllData(data);
    } else {
      setAllData({});
    }
  }, [data, forEdit]);
  const deleteItem = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_SHIPPING_PRICE}?id=${data.id}`,
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
    var sendingData = {
      shippingCompanyId: id,
      provinceId: allData.provinceId,

      cityId: allData.cityId,
      cost: allData.cost,
      active: Boolean(allData.active),
    };
    if (forEdit) {
      sendingData = { ...sendingData, id: data?.id };
    }
    setLoading(true);
    var temp = [...allRows];
    if (forEdit) {
      axiosInstance
        .put(
          `${baseUrl}/${UPDATE_SHIPPING_PRICE}`,
          sendingData,
          configReq(token)
        )
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
        .post(`${baseUrl}/${SET_SHIPPING_PRICE}`, sendingData, configReq(token))
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
  const reset = () => {
    setCities();
  };
  return (
    <Modal
      open={open}
      close={() => {
        close();
        reset();
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  مبلغ`}
    >
      <div className="md:grid grid-cols-2 gap-5">
        {" "} 
        <Dropdown
          title=" استان"
          data={province}
          value={province?.find((item) => item.id === allData.provinceId)}
          change={(e) => {
            setCities(e?.cities);
            setAllData({ ...allData, provinceId: e?.id });
          }}
        />{" "}
        <Dropdown
          title="شهر "
          data={cities}
          value={cities?.find((item) => item.id === allData.cityId)}
          change={(e) => setAllData({ ...allData, cityId: e?.id })}
        />
        <TextInput
          label="  هزینه ارسال"
          change={(e) => setAllData({ ...allData, cost: e })}
          currentValue={allData?.cost !== undefined ? allData?.cost : ""}
          price
          number
          allowZero
        />
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center">
            <div className="flex items-center gap-4">
              <span className="text-xs"> فعال/غیرفعال : </span>
              <Switch
                onChange={() =>
                  setAllData({ ...allData, active: !allData?.active })
                }
                defaultChecked={data?.active}
              />
            </div>
          </div>{" "}
        </div>
      </div>

      <Box sx={{ display: "flex" }}>
        {userPermissions?.shippingCost?.delete && data.id && (
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
        message="آیا از حذف این مبلغ اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

export default EditShippingCompanyCost;
const TYPED = ["خیر", "بلی"];
