import { Button, Paper, TextField } from "@mui/material";
import momentJalaali from "moment-jalaali";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Dropdown,
  MultipleImages,
  PageTitle,
  TextInput,
} from "../../components/common";

import DatePicker from "react-datepicker2";
import { toast } from "react-toastify";
import SearchInput2 from "../../components/common/searchInput2";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  ALL_USERS,
  baseUrl,
  CREATE_WHITE_LIST_USER,
  GET_WHITE_LIST_USER,
  INSET_IMAGE_WHITE_LIST_USER,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
const CreateOrEditWhiteListUser = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [searchParams, setSearchParams] = useSearchParams();
  const guarantorId = searchParams.get("guarantorId");
  const guarantorName = searchParams.get("guarantorName");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState();
  const [userName, setUserName] = useState();
  const [files, setFiles] = useState([]);
  const [resizing, setresizing] = useState(false);
  const [selectedProductImage, setselectedProductImage] = useState([]);
  const [valueStatDate, setValueStatDate] = useState(0);
  const startTimeCalender = useRef();

  const [startTime, setstartTime] = useState(momentJalaali());
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosInstance
        .get(`${baseUrl}/${GET_WHITE_LIST_USER}?id=${id}`, configReq(token))
        .then((res) => {
          setData(res.data.data[0]);
          setUserName(res.data.data[0].fullName);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [id]);
  const handleSumbit = () => {
    if (id) {
    } else {
      setIsLoading(true);
      axiosInstance
        .post(
          `${baseUrl}/${CREATE_WHITE_LIST_USER}`,
          {
            ...data,
            userId: value?.id || data?.userId,
            Id: 0,
            guarantorId: guarantorId,
            expirtyDate: new Date(startTime._d).toISOString(),
          },
          configReq(token)
        )
        .then(async (res) => {
          const uploadPromises = [];

          selectedProductImage.forEach((item) => {
            uploadPromises.push(
              axiosInstance.post(
                `${baseUrl}/${INSET_IMAGE_WHITE_LIST_USER}`,
                {
                  whiteListUserId: res.data.data.id,
                  fromGallery: item,
                },
                configReq(token)
              )
            );
          });

          files.forEach((item) => {
            uploadPromises.push(
              axiosInstance.post(
                `${baseUrl}/${INSET_IMAGE_WHITE_LIST_USER}`,
                {
                  whiteListUserId: res.data.data.id,
                  files: item,
                },
                configReq(token)
              )
            );
          });

          await Promise.all(uploadPromises);
          setIsLoading(false);
          toast.success("کاربر و تصاویر با موفقیت آپلود شدند");
          navigate(
            `/whiteListUser?guarantorId=${guarantorId}&guarantorName=${guarantorName}`
          );
        })
        .catch((err) => {
          setIsLoading(false);
          toast.error(err.response?.data?.message);
        });
    }
  };

  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "  تسهیلات",
            path: "/facilitySetting",
          },
          {
            title: "تضمین کننده ها",
            path: "/guarantor",
          },
          {
            title: `لیست کاربران سفید` + `برای ${guarantorName} `,
            path: `/whiteListUser?guarantorId=${guarantorId}&guarantorName=${guarantorName}`,
          },
        ]}
        title={
          id
            ? `ویرایش کاربر سفید`
            : `ایجاد کاربر سفید` + ` برای ${guarantorName} `
        }
      />
      <div className="md:mx-3 mx-1">
        {" "}
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          <div className="grid grid-cols-2 gap-4 mb-10">
            <SearchInput2
              url={ALL_USERS}
              value={value}
              setValue={setValue}
              defualtValue={userName}
              label={"انتخاب کاربر "}
            />{" "}
            <TextInput
              label="قدرت خرید"
              currentValue={data.salePower || ""}
              number
              price
              change={(e) => setData({ ...data, salePower: e })}
            />{" "}
            <TextInput
              label="توضیحات برای سابقه"
              currentValue={data.descriptionForHistory}
              change={(e) => setData({ ...data, descriptionForHistory: e })}
            />
            <div className="relative">
              <DatePicker
                timePicker={false}
                value={startTime}
                isGregorian={false}
                ref={startTimeCalender}
                min={momentJalaali()}
                onChange={(value) => {
                  setstartTime(value);

                  setValueStatDate(value._d.toLocaleDateString("fa"));
                }}
              />
              <TextField
                onMouseUp={() => startTimeCalender.current?.setOpen(true)}
                InputProps={{
                  inputProps: {
                    style: { textAlign: "right", width: "100%" },
                  },
                }}
                variant="outlined"
                value={valueStatDate ? valueStatDate : ""}
                label={" تاریخ انقضا "}
                autoComplete="off"
                fullWidth
              />
            </div>
            <Dropdown
              title=" نوع اعتبار"
              change={(e) => setData({ ...data, creditType: e?.id })}
              value={TYPE.find((item) => item.id === data?.creditType)}
              data={TYPE}
            />
          </div>
          <MultipleImages
            files={files}
            setFiles={setFiles}
            selectedProductImage={selectedProductImage}
            setselectedProductImage={setselectedProductImage}
            setResizing={setresizing}
            resizing={resizing}
          />
          <div className="flex justify-end">
            <Button onClick={handleSumbit} variant="contained" color="primary">
              ثبت اطلاعات
            </Button>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default CreateOrEditWhiteListUser;
const TYPE = [
  { id: 1, title: "اعتبار ماهانه " },
  { id: 2, title: " اعتبار کلی" },
];
