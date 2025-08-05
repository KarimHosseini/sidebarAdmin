import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Dropdown, Modal, TextInput } from "../../../components/common";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import Confirm from "../../../components/modals/Confirm";
import {
  ADD_USER_ADDRESS,
  baseUrl,
  EDIT_USER_ADDRESS,
  REMOVE_USER_ADDRESS,
} from "../../../helpers/api-routes";

import Map from "../../../components/common/map";
import { configReq } from "../../../helpers/functions";
import { logout } from "../../../redux/slices/user";

const AddressModal = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
  province,
  userData,
}) => {
  const { companyInfo } = useSelector((state) => state.relationals);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [cities, setCities] = useState();
  const [loading, setLoading] = useState(false);
  const [isUserReciver, setisUserReciver] = useState(false);
  const [tempAddress, setTempAddress] = useState("");
  const [step, setStep] = useState(1);
  const [data, setData] = useState(prevData || {});
  useEffect(() => {
    if (forEdit) {
      setData(prevData || {});

      if (prevData.cityId) {
        setCities(
          province.find((item) => item.id === prevData.provinceId)?.cities
        );
      }
    }
  }, [prevData, forEdit]);
  const resetData = () => {
    setData({});
  };
  const { id } = useParams();
  const submitData = () => {
    if (data.title) {
      setLoading(true);
      var temp = [...allRows];
      if (forEdit) {
        axiosInstance
          .put(
            `${baseUrl}/${EDIT_USER_ADDRESS}`,
            { ...data, userId: id },
            configReq(token)
          )
          .then((res) => {
            setLoading(false);
            toast.success("با موفقیت ویرایش شد");
            if (res.data.data?.isDefault) {
              for (var i = 0; i < temp.length; i++) {
                if (temp[i]?.id === data.id) {
                  temp[i] = res.data.data;
                } else {
                  temp[i] = { ...temp[i], isDefault: false };
                }
              }
            } else {
              var index = temp.findIndex((item) => item.id === data.id);
              temp[index] = res.data.data;
            }

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
          .post(
            `${baseUrl}/${ADD_USER_ADDRESS}`,
            { ...data, userId: id ? id : userData.id },
            configReq(token)
          )
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
      toast.error("نام شرکت را وارد کنید");
    }
  };
  const deleteAttr = () => {
    setLoading(true);
    axiosInstance
      .delete(
        `${baseUrl}/${REMOVE_USER_ADDRESS}?id=${data.id}`,
        configReq(token)
      )
      .then((res) => {
        var temp = [...allRows];
        var newData = temp.filter((item) => item.id !== data.id);
        setAllRows(newData);
        setLoading(false);
        setConfirmDelete(false);
        toast.success("با موفقیت حذف شد");
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
  };
  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title="ویرایش  نشانی "
    >
      <>
        {step === 1 && companyInfo.showMapInFront ? (
          <Map
            onLocationSelect={(e) => {
              setData({
                ...data,
                latitiude: e.latitude,
                longtitude: e.longitude,
                address: e.address,
              });

              setStep(2);
            }}
            longitude={data.longtitude}
            latitude={data.latitiude}
          />
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              {" "}
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
              <TextInput
                label="عنوان محل"
                change={(e) => setData({ ...data, title: e })}
                currentValue={data.title}
              />
              <TextInput
                label="کد پستی  "
                change={(e) => setData({ ...data, postalCode: e })}
                currentValue={data.postalCode}
              />
            </div>
            <TextInput
              label="نشانی  "
              change={(e) => setData({ ...data, address: e })}
              currentValue={data.address}
            />{" "}
            <div className="grid md:grid-cols-3 gap-4">
              {" "}
              <TextInput
                label="پلاک  "
                change={(e) => setData({ ...data, plaque: e })}
                currentValue={data.plaque}
              />
              <TextInput
                label="طبقه  "
                change={(e) => setData({ ...data, floorNo: e })}
                currentValue={data.floorNo}
              />
              <TextInput
                label="واحد  "
                change={(e) => setData({ ...data, unit: e })}
                currentValue={data.unit}
              />
            </div>
            <div className="flex gap-2 items-center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.isDefault}
                    onChange={(e) => {
                      if (!isUserReciver) {
                        setData({
                          ...data,
                          receptorFname: userData?.fname,
                          receptorLname: userData?.lname,
                          receptorMobile: userData?.mobile,
                          receptorNationalCode: userData?.nationalCode,
                        });
                      } else {
                        setData({
                          ...data,
                          receptorFname: "",
                          receptorLname: "",
                          receptorMobile: "",
                          receptorNationalCode: "",
                        });
                      }
                      setisUserReciver(!isUserReciver);
                    }}
                    size="small"
                  />
                }
                label={<span className="text-xs">گیرنده سفارش خودم هستم</span>}
              />
            </div>
            {isUserReciver ? (
              <div className="grid md:grid-cols-2 gap-4">
                <TextField
                  label="نام تحویل گیرنده  "
                  /*  change={(e) => setData({ ...data, receptorFname: e })} */
                  disabled
                  InputLabelProps={{ shrink: true }}
                  value={data.receptorFname ? data.receptorFname : " "}
                />
                <TextField
                  label="نام خانوادگی تحویل گیرنده  "
                  /*   change={(e) => setData({ ...data, receptorLname: e })} */
                  disabled
                  InputLabelProps={{ shrink: true }}
                  value={data.receptorLname ? data.receptorLname : " "}
                />
                <TextField
                  label="شماره موبایل تحویل گیرنده  "
                  /*  change={(e) => setData({ ...data, receptorMobile: e })} */
                  disabled
                  InputLabelProps={{ shrink: true }}
                  value={data.receptorMobile ? data.receptorMobile : " "}
                />
                <TextField
                  label="کد ملی تحویل گیرنده  "
                  /*  change={(e) => setData({ ...data, receptorNationalCode: e })} */
                  disabled
                  InputLabelProps={{ shrink: true }}
                  value={
                    data.receptorNationalCode ? data.receptorNationalCode : " "
                  }
                />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <TextInput
                  label="نام تحویل گیرنده  "
                  change={(e) => setData({ ...data, receptorFname: e })}
                  currentValue={data.receptorFname}
                />
                <TextInput
                  label="نام خانوادگی تحویل گیرنده  "
                  change={(e) => setData({ ...data, receptorLname: e })}
                  currentValue={data.receptorLname}
                />
                <TextInput
                  label="شماره موبایل تحویل گیرنده  "
                  change={(e) => setData({ ...data, receptorMobile: e })}
                  currentValue={data.receptorMobile}
                />
                <TextInput
                  label="کد ملی تحویل گیرنده  "
                  change={(e) => setData({ ...data, receptorNationalCode: e })}
                  currentValue={data.receptorNationalCode}
                />
              </div>
            )}
            <div className=" left-8  bottom-8">
              {data.isDefault !== undefined && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data.isDefault}
                      onChange={(e) =>
                        setData({ ...data, isDefault: e.target.checked })
                      }
                      size="small"
                    />
                  }
                  label={
                    <span className="text-xs font-semibold text-[#141414]">
                      نشانی پیش فرض
                    </span>
                  }
                />
              )}
            </div>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {forEdit && (
                <IconButton size="large" onClick={() => setConfirmDelete(true)}>
                  <Delete sx={{ color: "red" }} />
                </IconButton>
              )}
              <div style={{ flexGrow: 1 }} />
              <Button
                variant="contained"
                color="primary"
                onClick={submitData}
                disabled={loading}
                sx={{ width: { xs: "50%", md: "auto" } }}
              >
                {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
              </Button>
            </Box>
          </>
        )}
      </>

      <Confirm
        message="آیا از حذف این نشانی اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
    </Modal>
  );
};

export default AddressModal;
