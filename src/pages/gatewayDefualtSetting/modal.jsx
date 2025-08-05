import { Delete } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dropdown, Modal, TextInput } from "../../components/common";
import SearchInput2 from "../../components/common/searchInput2";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  ALL_USERS,
  baseUrl,
  CREATE_GATEWAY_DEFUALT_SETTING,
  DELETE_GATEWAY_DEFUALT_SETTING,
  EDIT_GATEWAY_DEFUALT_SETTING,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const EditDefaultGateWays = ({
  open,
  close,
  data = {},
  forEdit,
  setAllRows,
  allRows,
  shipingCompany,
  orderState,
}) => {
  const { token } = useSelector((state) => state.user);
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { userPermissions } = useSelector((state) => state.relationals);

  const [valueChanges, setvalueChanges] = useState(false);
  console.log(data, "data");

  const [value, setValue] = useState();
  // set data
  useEffect(() => {
    if (data && forEdit) {
      setAllData(data);
    } else {
      setAllData(data);
    }
  }, [data, forEdit]);

  const deleteItem = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_GATEWAY_DEFUALT_SETTING}?id=${data.id}`,
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
      ...allData,
      userId: value ? value.id : data?.userId,
    };

    setLoading(true);
    var temp = [...allRows];
    if (forEdit) {
      axiosInstance
        .put(
          `${baseUrl}/${EDIT_GATEWAY_DEFUALT_SETTING}`,
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
          setAllData({});
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading(false);
        });
    } else {
      axiosInstance
        .post(
          `${baseUrl}/${CREATE_GATEWAY_DEFUALT_SETTING}`,
          sendingData,
          configReq(token)
        )
        .then((res) => {
          temp.unshift(res.data.data);

          setAllRows(temp);
          setLoading(false);
          toast.success("با موفقیت اضافه شد");
          close();
          setAllData({});
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading(false);
        });
    }
  };
  return (
    <Modal
      open={open}
      close={close}
      title={` ${forEdit ? "ویرایش" : "افزودن"} تنظیمات پیش فرض`}
    >
      <div className="grid grid-cols-3 gap-4">
        <Dropdown
          value={shipingCompany?.find(
            (g) => g.id === allData?.shippingCompanyId
          )}
          change={(e) => setAllData({ ...allData, shippingCompanyId: e.id })}
          data={shipingCompany}
          title="  شرکت حمل و نقل"
          emptyValue={true}
        />
        <Dropdown
          value={orderState?.find((g) => g.id === allData?.defaultState)}
          change={(e) => setAllData({ ...allData, defaultState: e.id })}
          data={orderState}
          title="  وضعیت دیفالت"
          emptyValue={true}
        />
        <Dropdown
          value={PAY?.find((g) => g.id === allData?.defaultPayState)}
          change={(e) => setAllData({ ...allData, defaultPayState: e.id })}
          data={PAY}
          title="  وضعیت پرداخت دیفالت"
          emptyValue={true}
        />
        <Dropdown
          value={TYPE?.find((g) => g.id === allData?.type)}
          change={(e) => setAllData({ ...allData, type: e.id })}
          data={TYPE}
          title="  نوع"
          emptyValue={true}
        />
        <Dropdown
          value={OP?.find((g) => g.id === allData?.op)}
          change={(e) => setAllData({ ...allData, op: e.id })}
          data={OP}
          title="  عملیات"
          emptyValue={true}
        />
        <Dropdown
          value={MODE?.find((g) => g.id === allData?.mode)}
          change={(e) => setAllData({ ...allData, mode: e.id })}
          data={MODE}
          title="  مود"
          emptyValue={true}
        />
        <SearchInput2
          url={ALL_USERS}
          value={value}
          setValue={(e) => {
            setValue(e);
            setvalueChanges(true);
          }}
          label={"کاربر پیش فرض"}
          defualtValue={allData?.userName}
        />
        <TextInput
          currentValue={allData?.infrastructureCost}
          label="هزینه زیرساخت"
          change={(e) => setAllData({ ...allData, infrastructureCost: e })}
          number
          price
        />

        <TextInput
          currentValue={allData?.insuranceFee}
          label="هزینه بیمه"
          change={(e) => setAllData({ ...allData, insuranceFee: e })}
          number
          price
        />

        <TextInput
          currentValue={allData?.shippingFromDateDayIncrease}
          label="افزایش روز شروع ارسال"
          change={(e) =>
            setAllData({ ...allData, shippingFromDateDayIncrease: e })
          }
        />

        <TextInput
          currentValue={allData?.shippingToDateDayIncrease}
          label="افزایش روز پایان ارسال"
          change={(e) =>
            setAllData({ ...allData, shippingToDateDayIncrease: e })
          }
        />

        <TextInput
          currentValue={allData?.increasePricePercent}
          label="درصد افزایش قیمت"
          change={(e) => setAllData({ ...allData, increasePricePercent: e })}
          number
          price
          priceLabel="%"
        />
      </div>

      <Box sx={{ display: "flex" }}>
        {forEdit && (
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
        message="آیا از حذف این   اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

export default EditDefaultGateWays;
const PAY = [
  {
    id: 0,
    title: "پرداخت نشده",
  },
  {
    id: 1,
    title: "پرداخت شده",
  },
];
const TYPE = [
  {
    id: 0,
    title: " نقدی",
  },
  {
    id: 1,
    title: " تسهیلاتی",
  },
];
const MODE = [
  {
    id: 0,
    title: " دارای وابستگی به کالا",
  },
  {
    id: 1,
    title: " بدون وابستگی به کالا",
  },
];
const OP = [
  {
    id: 0,
    title: "پیش فاکتور",
  },
  {
    id: 1,
    title: " فاکتور",
  },
];
