import {
  Checkbox,
  Paper,
  Radio,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Dropdown,
  NumberInput,
  TextInput,
  UploadImage,
} from "../../../components/common";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import {
  ALL_SHIPPING_COMPANIES,
  baseUrl,
  GET_PROVINCE,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";

const Step1Company = ({ data, setData, editMode }) => {
  const { token } = useSelector((state) => state.user);
  const [province, setProvince] = useState([]);
  const [cities, setCities] = useState();

  useEffect(() => {
    var stateId = data?.provinceId;
    axiosInstance(`${baseUrl}/${GET_PROVINCE}`, configReq(token))
      .then((res) => {
        const { data } = res;

        if (data && data.code === 200 && data.data) {
          setProvince(data.data);
          if (editMode) {
            setCities(data.data?.find((item) => item.id === stateId)?.cities);
          }
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  }, []);
  return (
    <>
      <div className="text-xs mb-5 p-2">
        <p className="text-sm font-bold">اطلاعات سازمان جدید را تکمیل نمایید</p>
      </div>
      <div className="grid  grid-cols-1 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-5 lg:grid-cols-5 gap-3">
        <TextInput
          label="نام سازمان  / شرکت"
          currentValue={data?.title}
          change={(e) => setData({ ...data, title: e })}
        />
        <TextInput
          currentValue={data?.tel}
          change={(e) => setData({ ...data, tel: e })}
          label="شماره تلفن"
        />
        <TextInput
          currentValue={data?.contactMobile}
          change={(e) => setData({ ...data, contactMobile: e })}
          label="شماره همراه نماینده"
        />
        <TextInput
          currentValue={data?.regNumber}
          change={(e) => setData({ ...data, regNumber: e })}
          label="شناسه ثبت"
        />
        <TextInput
          currentValue={data?.economicCode}
          change={(e) => setData({ ...data, economicCode: e })}
          label="  کد اقتصادی "
        />
        <div className="xl:col-span-3 lg:col-span-3 md:col-span-1 sm:col-span-1 col-span-1">
          <TextInput
            currentValue={data?.address}
            change={(e) => setData({ ...data, address: e })}
            label="  نشانی  "
          />
        </div>
        <Dropdown
          title=" استان"
          data={province}
          value={province?.find((item) => item.id === data.provinceId)}
          change={(e) => {
            setCities(e?.cities);
            setData({ ...data, provinceId: e?.id });
          }}
        />
        <Dropdown
          title="شهر "
          data={cities}
          value={cities?.find((item) => item.id === data.cityId)}
          change={(e) => setData({ ...data, cityId: e?.id })}
        />
      </div>
      <div className="mt-8 p-5">
        <div className="flex items-center gap-3">
          <UploadImage
            file={data?.files}
            change={(e) => setData({ ...data, files: e })}
            address={data.galleryId}
            selectedProductImage={data?.fromGallery}
            setselectedProductImage={(e) =>
              setData({ ...data, fromGallery: e })
            }
          />
          <div className="flex items-center">
            <Typography sx={{ fontSize: "13px" }}>فعال / غیر فعال</Typography>
            <Switch
              onClick={(e) => setData({ ...data, active: !data?.active })}
              checked={data?.active}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-5">
          <TextField
            value={data?.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            multiline
            rows={2}
            label="توضیحات سازمان / شرکت"
            variant="outlined"
          />
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-5 h-fit">
            <TextInput
              currentValue={data?.contact1}
              change={(e) => setData({ ...data, contact1: e })}
              label="ایدی / شماره تلگرام "
            />
            <TextInput
              currentValue={data?.email}
              change={(e) => setData({ ...data, email: e })}
              label="ایمیل "
            />
            <TextInput
              currentValue={data?.contact2}
              change={(e) => setData({ ...data, contact2: e })}
              label=" ایدی / شماره واتساپ "
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Step1Company;
