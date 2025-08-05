/* eslint-disable react-hooks/exhaustive-deps */
import { Paper, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PageTitle } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import NoAccess from "../../components/noAccess";
import { baseUrl, EDIT_SETTINGS, GET_SETTINGS } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const ShippingSetting = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [loadingSumbit, setLoadingSumbit] = useState(false);

  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({});
  const [shipping2, setShipping2] = useState({});

  useEffect(() => {
    setLoading(true);

    axiosInstance(`${baseUrl}/${GET_SETTINGS}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data && data.code === 200 && data.data) {
          setShipping2(data.data);
        }
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
        setLoading(false);
      });
  }, [token]);
  const handleSave = () => {
    setLoading(true);
    axiosInstance
      .put(`${baseUrl}/${EDIT_SETTINGS}`, { ...shipping }, configReq(token))
      .then((res) => {
        setLoading(false);
        toast.success("با موفقیت ویرایش شد");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  const handleClick = () => {
    axiosInstance
      .put(`${baseUrl}/${EDIT_SETTINGS}`, { ...shipping2 }, configReq(token))
      .then((res) => {
        toast.success("با موفقیت ویرایش شد");
        setLoadingSumbit(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoadingSumbit(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      });
  };
  const changed = (item, name, isTime, smallerThen, biggerThen) => {
    if (isTime) {
      if (Number(item) > 24) {
        toast.error("ساعت ثبت شده نمی تواند از ۲۴ بزرگتر باشد");
      } else {
        if (smallerThen && item > smallerThen) {
          toast.error("بازه زمانی شروع نمی تواند از اتمام بیتشر باشد");
        } else if (biggerThen && item < biggerThen) {
          toast.error("بازه زمانی اتمام نمی تواند از شروع کمتر باشد");
        }
        setShipping2({ ...shipping2, [name]: item });
      }
    } else {
      setShipping2({ ...shipping2, [name]: item });
    }
  };
  if (!userPermissions?.shippingSetting?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "     ارسال کالا ",
            path: "/shippingSetting",
          },
        ]}
        title="    تنظیمات ارسال کالا "
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="text-gray-500 text-lg">
              تنظیمات ارسال کالا - صفحه در حال توسعه
            </div>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default ShippingSetting;
