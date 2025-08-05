/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  baseUrl,
  DELETE_ALL_ACCESS_PROFILE,
  EDIT_ACTIVE_ACCESS_PROFILE,
  EXPORT_GET_ACCESS_PROFILE,
  GET_ACCESS_PROFILE,
  OPEN_ALL_ACCESS_PROFILE,
} from "../../helpers/api-routes";
import { Confirm } from "../../components/modals";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { configReq } from "../../helpers/functions";
import { toast } from "react-toastify";
import { useState } from "react";

const Users = () => {
  const [openActiveAll, setOpenActiveAll] = useState(false);
  const { token } = useSelector((state) => state.user);
  const [loadingButton, setloadingButton] = useState(false);

  const [openDeleteAll, setOpenDeleteAll] = useState(false);

  const [selectedId, setSelectedId] = useState("");

  const { userPermissions } = useSelector((state) => state.relationals);
  const activeAll = () => {
    if (selectedId) {
      setloadingButton(true);
      axiosInstance
        .put(
          `${baseUrl}/${OPEN_ALL_ACCESS_PROFILE}`,
          { id: selectedId },
          configReq(token)
        )
        .then((res) => {
          setOpenActiveAll(false);
          setloadingButton(false);
          toast.success(res.data.message);
        })
        .catch((err) => {
          setloadingButton(false);
          toast.error(err.response?.data?.message);
        });
    }
  };
  const deleteItem = () => {
    if (selectedId) {
      setloadingButton(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_ALL_ACCESS_PROFILE}?id=${selectedId}`,
          configReq(token)
        )
        .then((res) => {
          setOpenDeleteAll(false);
          setloadingButton(false);
          toast.success(res.data.message);
        })
        .catch((err) => {
          setloadingButton(false);
          toast.error(err.response?.data?.message);
        });
    }
  };
  const feilds = [
    {
      name: "title",
      label: "نام",
      type: "textInput",
      required: true,
    },
    {
      name: "active",
      label: "فعال/غیرفعال",
      type: "switch",
      required: false,
      defaultValue: true,
    },
  ];
  return (
    <>
      <CustomePage
        broadCrumb={[
          {
            title: "  کاربران و نقش ها",
            path: "/users",
          },
        ]}
        createOrEditPageUsingOtherPage={true}
        title="کاربران"
        apis={{
          GET_DATA: GET_ACCESS_PROFILE,
          EXPORT_DATA: EXPORT_GET_ACCESS_PROFILE,
          EDIT_ACTIVE_DATA: EDIT_ACTIVE_ACCESS_PROFILE,
        }}
        feilds={feilds}
        neededFields={["id", "title", "lname"]}
        extraActions={[
          userPermissions?.ReportUserTurnover?.view && {
            title: "گزارش مالی",
            handler: (
              <>
                <Button
                  onClick={(event) => {
                    const target =
                      event.currentTarget.closest("[data-id]") ||
                      event.currentTarget.parentElement;
                    const id = target.getAttribute("data-id");
                    const title = target.getAttribute("data-fname");
                    window.open(`/permisions/${id}?title=${title}`, "_blank");
                  }}
                >
                  مشاهده
                </Button>
              </>
            ),
          },
          userPermissions?.accessProfile?.openAllAccess && {
            title: "فعال کردن همه دسترسی ها",
            handler: (
              <>
                <Button
                  variant="contained"
                  onClick={(event) => {
                    const target =
                      event.currentTarget.closest("[data-id]") ||
                      event.currentTarget.parentElement;
                    const id = target.getAttribute("data-id");
                    setOpenActiveAll(true);
                    setSelectedId(id);
                  }}
                >
                  فعال کردن همه دسترسی ها
                </Button>
              </>
            ),
          },
          userPermissions?.accessProfile?.deleteAllAccess && {
            title: "غیر فعال کردن همه دسترسی ها",
            handler: (
              <>
                <Button
                  variant="contained"
                  color="error"
                  onClick={(event) => {
                    const target =
                      event.currentTarget.closest("[data-id]") ||
                      event.currentTarget.parentElement;
                    const id = target.getAttribute("data-id");
                    setOpenDeleteAll(true);
                    setSelectedId(id);
                  }}
                >
                  غیر فعال کردن همه دسترسی ها
                </Button>
              </>
            ),
          },
        ].filter((it) => it)}
      />{" "}
      <Confirm
        message="آیا از   فعال کردن همه دسترسی ها اطمینان دارید؟"
        close={() => {
          setOpenActiveAll(false);
          setSelectedId();
        }}
        submit={activeAll}
        open={openActiveAll}
        loading={loadingButton}
        alart={
          " نقش فروشنده : امکان فروش محصولات بدون کم کردن موجودی انبار و قیمت دلخواه را بوجود میاورد .(BTC mode) .  نقش بازاریاب : امکان تخصیص نقش بازاریاب به کاربر برای محاسبات پورسانت فروش . این نقشها از سمت مدیر کل از منوی کاربران داده میشود ."
        }
      />{" "}
      <Confirm
        message="آیا از    غیر فعال کردن همه دسترسی ها اطمینان دارید؟"
        close={() => {
          setOpenDeleteAll(false);
          setSelectedId();
        }}
        submit={deleteItem}
        open={openDeleteAll}
        loading={loadingButton}
      />
    </>
  );
};

export default Users;
