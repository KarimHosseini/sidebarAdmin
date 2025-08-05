import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dropdown, Modal, TextInput } from "../../components/common";
import SearchInput2 from "../../components/common/searchInput2";
import Uploader from "../../components/common/uploader";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  ADD_FACILITY_WALLET_PAYMENT,
  ALL_USERS,
  baseUrl,
  DELETE_FACILITY_WALLET_PAYMENT,
  EDIT_FACILITY_WALLET_PAYMENT,
  GET_CHILD_FACILITIES,
} from "../../helpers/api-routes";

import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
const WalletFacilityWithrawModal = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
  gateWays,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [value, setValue] = useState();
  const [price, setPrice] = useState("");
  const [gateWay, setgateWay] = useState("");
  const [facility, setFacility] = useState([]);
  const [remvalue, setRemvalue] = useState();

  const [facilityId, setFaciilityId] = useState("");

  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    /*     if (forEdit) {
      setData(prevData || {});
    } */
  }, [prevData, forEdit]);
  const resetData = () => {
    setValue();
    setPrice("");
    setFaciilityId();
    setgateWay();
    setDesc("");
    setRemvalue("");
  };

  const submitData = () => {
    if (!value) {
      toast.error("نام کاربر را وارد کنید");
    } else if (!price) {
      setErrors({ price: true });
      toast.error("مبلغ مورد نظر را وارد کنید");
    } else if (!desc) {
      setErrors({ desc: true });
      toast.error("شرح در خواست را وارد کنید");
    } else if (!files) {
      setErrors({ files: true });
      toast.error("سند مدرک را بارگذاری کنید");
    } else {
      setLoading(true);
      var temp = [...allRows];
      var data = {
        op: 3,
        userId: value.id,
        value: price,
        files,
        description: desc,
        gateway: gateWay,
        FacilityId: facilityId,
      };
      if (forEdit) {
        axiosInstance
          .put(
            `${baseUrl}/${EDIT_FACILITY_WALLET_PAYMENT}`,
            data,
            configReq(token)
          )
          .then((res) => {
            setLoading(false);
            toast.success("با موفقیت ویرایش شد");
            var index = temp.findIndex((item) => item.id === prevData.id);
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
          .post(
            `${baseUrl}/${ADD_FACILITY_WALLET_PAYMENT}`,
            data,
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
    }
  };

  const deleteAttr = () => {
    setLoading(true);
    axiosInstance
      .delete(
        `${baseUrl}/${DELETE_FACILITY_WALLET_PAYMENT}?id=${prevData.id}`,
        configReq(token)
      )
      .then((res) => {
        var temp = [...allRows];
        var newData = temp.filter((item) => item.id !== prevData.id);
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
  useEffect(() => {
    if (gateWay && value?.id) {
      axiosInstance
        .get(
          `${baseUrl}/${GET_CHILD_FACILITIES}?gatewayId=${gateWay}&userId=${value.id}`,
          configReq(token)
        )
        .then((res) => {
          var temp = [];

          res.data.data
            .filter((item) => item.children?.length > 0)
            .map((item) => {
              temp.push({
                title: `↓ - ${item.title} - ↓ `,
                id: -1,
                disabled: true,
              });
              item.children.map((ch) => {
                temp.push({
                  title: ch.title,
                  id: ch.id,
                  remValue: ch.remValue,
                });
              });
            });
          setFacility(temp);
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
        });
    }
  }, [gateWay]);
  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title="  درخواست جدید  عودت به کیف  پول تسهیلاتی"
    >
      <SearchInput2
        url={ALL_USERS}
        value={value}
        setValue={setValue}
        label={"جست و جو کاربر"}
      />
      <TextInput
        currentValue={value ? value.mobile : ""}
        label="شماره همراه "
        disabled
      />
      <Dropdown
        value={gateWays?.find((g) => g.id === gateWay)}
        change={(e) => setgateWay(e.id)}
        data={gateWays}
        title="نام درگاه  "
      />{" "}
      <Dropdown
        value={facility?.find((g) => g.id === facilityId)}
        change={(e) => {
          setFaciilityId(e.id);
          setRemvalue(e.remValue);
        }}
        data={facility}
        title="نام تسهیلات  "
      />{" "}
      <TextInput
        currentValue={remvalue ? remvalue.toLocaleString() : ""}
        label="  موجودی کیف پول کاربر "
        disabled
      />{" "}
      <TextInput
        currentValue={price}
        label="  مبلغ در خواست"
        change={setPrice}
        number={true}
        /*   errors={"قیمت بعد تخفیف باید از قیمت اصلی کوچیک تر باشد"} */
        allowZero={true}
        err={errors.price}
        price={true}
      />{" "}
      <TextField
        label="شرح درخواست  "
        rows={2}
        multiline
        onChange={(e) => setDesc(e.target.value)}
        value={desc}
        error={errors.desc}
      />
      <Uploader
        setFiles={(e) => {
          setFiles(e);
        }}
        check="image"
      />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {userPermissions?.walletPaymentRefund?.view && forEdit && (
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
        </Button>{" "}
      </Box>
      <Confirm
        message="آیا از حذف این شغل اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
    </Modal>
  );
};

export default WalletFacilityWithrawModal;
