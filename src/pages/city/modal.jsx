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
import Map from "../../components/common/map";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_CITY,
  DELETE_CITY,
  EDIT_CITY,
  GET_CITY_FROM_LAT,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const CityModal = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
  province,
}) => {
  const { token } = useSelector((state) => state.user);
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loadingMap, setLoadginMap] = useState(false);
  const { userPermissions } = useSelector((state) => state.relationals);
  const { companyInfo } = useSelector((state) => state.relationals);
  const [active, setActive] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    if (data && forEdit) {
      setAllData(data);
      setActive(data.region);
    } else {
      setAllData({});
      setActive(false);
    }
  }, [data, forEdit]);
  const deleteItem = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(`${baseUrl}/${DELETE_CITY}?id=${data.id}`, configReq(token))
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
    var sendingData = { ...allData };
    Object.keys(sendingData).forEach((key) => {
      if (sendingData[key] === null || sendingData[key] === "") {
        delete sendingData[key];
      }
    });
    if (!allData.provinceId) {
      toast.error("استان را وارد کنید");
    } else if (!allData.title) {
      toast.error("نام شهر را وارد کنید");
    } else if (!allData.latitude) {
      toast.error("latitude شهر را وارد کنید");
    } else if (!allData.longitude) {
      toast.error("longitude شهر را وارد کنید");
    } else if (!allData.code) {
      toast.error("نوع شهر را وارد کنید");
    } else {
      setLoading(true);
      var temp = [...allRows];
      if (forEdit) {
        axiosInstance
          .put(`${baseUrl}/${EDIT_CITY}`, sendingData, configReq(token))
          .then((res) => {
            setLoading(false);
            toast.success("با موفقیت ویرایش شد");
            var index = temp.findIndex((item) => item.id === data.id);
            temp[index] = res.data.data;
            setAllRows(temp);
            close();
            reset();
            setAllData({});
            setActive(false);
          })
          .catch((err) => {
            toast.error(err.response?.data?.message);
            setLoading(false);
          });
      } else {
        axiosInstance
          .post(`${baseUrl}/${CREATE_CITY}`, sendingData, configReq(token))
          .then((res) => {
            temp.unshift(res.data.data);

            setAllRows(temp);
            setLoading(false);
            toast.success("با موفقیت اضافه شد");
            close();
            reset();
            setAllData({});
            setActive(false);
          })
          .catch((err) => {
            toast.error(err.response?.data?.message);
            setLoading(false);
          });
      }
    }
  };
  const reset = () => {
    setActive(false);
  };
  const handleGetCityInfo = (lat, lan) => {
    setLoadginMap(true);
    axiosInstance
      .get(
        `${baseUrl}/${GET_CITY_FROM_LAT}` + `?lat=${lat}&lng=${lan}`,
        configReq(token)
      )
      .then((res) => {
        setLoadginMap(false);

        if (forEdit) {
          const allDatas = res.data.data;
          setAllData({
            ...allData,
            provinceId: allDatas.ProvinceId,
            title: allDatas.city,
            latitude: lat,
            longitude: lan,
          });
        } else {
          setLoading(false);
          toast.success("با موفقیت اضافه شد");
          close();
          reset();
          setAllData({});
          setActive(false);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoadginMap(false);
      });
  };
  return (
    <Modal
      open={open}
      close={() => {
        close();
        reset();
      }}
      autoWidth
      title={` ${forEdit ? "ویرایش" : "افزودن"}  شهر`}
    >
      {companyInfo.showMapInFront ? (
        <Map
          onLocationSelect={(e) => {
            handleGetCityInfo(e.latitude, e.longitude);
          }}
          longitude={allData.longitude}
          setAddress={() => {}}
          latitude={allData.latitude}
          loadingMap={loadingMap}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label=" ایدی شهر  "
            change={(e) => setAllData({ ...allData, id: e })}
            currentValue={allData?.id}
            disabled
          />{" "}
          <TextInput
            label=" کد شهر  "
            change={(e) => setAllData({ ...allData, code: e })}
            currentValue={allData?.code}
            InputLabelProps={{ shrink: true }}
          />
          <Dropdown
            title=" استان"
            data={province}
            value={province?.find((item) => item.id === allData.provinceId)}
            change={(e) => {
              setAllData({ ...allData, provinceId: e?.id });
            }}
          />
          <TextInput
            label=" نام شهر "
            change={(e) => setAllData({ ...allData, title: e })}
            currentValue={allData?.title}
            InputLabelProps={{ shrink: true }}
          />
          {/*<TextInput
        label=" قیمت حمل و نقل "
        change={(e) => setAllData({ ...allData, id: e })}
        currentValue={allData?.id}
      />*/}
          <TextInput
            label=" latitude"
            change={(e) => setAllData({ ...allData, latitude: e })}
            currentValue={allData?.latitude}
            InputLabelProps={{ shrink: true }}
          />
          <TextInput
            label=" longitude"
            change={(e) => setAllData({ ...allData, longitude: e })}
            currentValue={allData?.longitude}
            InputLabelProps={{ shrink: true }}
          />{" "}
          <Dropdown
            title="نوع "
            change={(e) => setAllData({ ...allData, type: e?.id })}
            value={TYPE.find((item) => item.id === allData?.type)}
            data={TYPE}
          />
          <TextInput
            label=" بخش"
            change={(e) => setAllData({ ...allData, county: e })}
            currentValue={allData?.county}
            InputLabelProps={{ shrink: true }}
          />
          <TextInput
            label=" منطقه"
            change={(e) => setAllData({ ...allData, district: e })}
            currentValue={allData?.district}
            InputLabelProps={{ shrink: true }}
          />
          <div className="flex flex-wrap items-center gap-3">
            <span>داخل شهر: </span>
            <Switch checked={active} onChange={() => setActive(!active)} />
          </div>
          {active && (
            <TextInput
              label=" منطقه شهرداری"
              change={(e) => setAllData({ ...allData, region: e })}
              currentValue={allData?.region}
              InputLabelProps={{ shrink: true }}
            />
          )}
          <TextInput
            label=" دهستان"
            change={(e) => setAllData({ ...allData, ruralDistrict: e })}
            currentValue={allData?.ruralDistrict}
            InputLabelProps={{ shrink: true }}
          />
          <TextInput
            label=" ده"
            change={(e) => setAllData({ ...allData, village: e })}
            currentValue={allData?.village}
            InputLabelProps={{ shrink: true }}
          />
          <TextInput
            label=" ایدی تیپاکس"
            change={(e) => setAllData({ ...allData, tipaxId: e })}
            currentValue={allData?.tipaxId}
            InputLabelProps={{ shrink: true }}
          />
        </div>
      )}{" "}
      <Box sx={{ display: "flex" }}>
        {userPermissions?.city?.delete && data.id && (
          <IconButton onClick={() => setOpenDelete(true)}>
            <Delete color="error" />
          </IconButton>
        )}
        <div style={{ flexGrow: 1 }} />{" "}
        {!companyInfo.showMapInFront || forEdit ? (
          <Button
            variant="contained"
            color="primary"
            onClick={editItem}
            disabled={loading || !allData?.title}
          >
            {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
          </Button>
        ) : (
          <></>
        )}
      </Box>
      <Confirm
        message="آیا از حذف این شهر اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

export default CityModal;
const TYPE = [
  {
    id: 1,
    title: "شهر",
  },
  {
    id: 2,
    title: "محله",
  },
];
