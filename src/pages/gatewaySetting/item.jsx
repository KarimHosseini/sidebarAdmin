import { Delete, Edit } from "@mui/icons-material";
import ImageIcon from "@mui/icons-material/Image";
import {
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  Radio,
  Switch,
} from "@mui/material";
import ReactHtmlParse from "html-react-parser";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Dropdown,
  Modal,
  ShowImage,
  TextInput,
  UploadImage,
} from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { Confirm } from "../../components/modals";
import {
  baseUrl,
  UPDATE_SETTINGS_GAETWAYT_IMAGE,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import EditDefaultGateWays from "../gatewayDefualtSetting/modal";

const GateWayItem = ({
  data,
  setData,
  getWays,
  types,
  chageDefualt,
  deleteAttr,
  headerOption,
  chageDefualtForCharge,
  shippings,
  orderStates,
  defualtGateWay,
  defualtGateWays,
  setdDefualtGateWays,
}) => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [open, setOpen] = useState(false);
  const [openLog, setOpenLog] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [avatar, setAvatar] = useState();
  const [loadingSave, setLoadingSave] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const { token } = useSelector((state) => state.user);
  const [selectedProductImage, setselectedProductImage] = useState();
  console.log(types,'types')
  const handleUpload = () => {
    setLoadingSave(false);
    const formData = new FormData();
    if (avatar) {
      formData.append("file", avatar);
    } else if (data.galleryId || selectedProductImage) {
      formData.append(
        "FromGallery",
        selectedProductImage ? selectedProductImage : data.galleryId
      );
    }
    formData.append("id", data.id);
    axiosInstance
      .patch(
        `${baseUrl}/${UPDATE_SETTINGS_GAETWAYT_IMAGE}`,
        formData,
        configReq(token)
      )
      .then((res) => {
        setLoadingSave(false);
        setData({ ...data, galleryId: res.data.data });
        setOpenImage(false);
        toast.success("با موفقیت ثبت شد");
      })
      .catch((err) => {
        setLoadingSave(false);
      });
  };
  return (
    <div
      style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}
      className="grid  gap-4"
    >
      <ShowImage address={data.galleryId} />
      <TextInput
        disabled={!userPermissions?.gatewaySetting?.patch}
        currentValue={data.title}
        change={(e) => setData({ ...data, title: e })}
      />
      <Switch
        onChange={(e) => setData({ ...data, isActive: !data.isActive })}
        checked={data.isActive}
        disabled={!userPermissions?.gatewaySetting?.patch}
      />
      <Checkbox
        disabled={!userPermissions?.gatewaySetting?.patch}
        onChange={(e) =>
          setData({
            ...data,
            canCombinationWithWallet: !data.canCombinationWithWallet,
          })
        }
        checked={data.canCombinationWithWallet}
      />
      <Checkbox
        disabled={!userPermissions?.gatewaySetting?.patch}
        onChange={(e) =>
          setData({
            ...data,
            canChargeWallet: !data.canChargeWallet,
          })
        }
        checked={data.canChargeWallet}
      />
      <Radio
        disabled={!userPermissions?.gatewaySetting?.patch}
        onChange={(e) => {
          chageDefualt();
        }}
        checked={data.isDefault}
      />
      <Radio
        disabled={!userPermissions?.gatewaySetting?.patch}
        onChange={(e) => {
          chageDefualtForCharge();
        }}
        checked={data.isDefaultForCharge}
      />
      {/*      <Checkbox
    onChange={() => ChangedSuccess("Mellat")}
    checked={isCheckedSuccess("Mellat")}
  />
  <Checkbox
    onChange={() => ChangeFaild("Mellat")}
    checked={isCheckedFaild("Mellat")}
  /> */}
      <Dropdown
        disabled={!userPermissions?.gatewaySetting?.patch}
        data={getWays}
        value={getWays.find((it) => it.id === data.enum)}
        change={(e) => setData({ ...data, enum: e.id })}
      />
      <Dropdown
        disabled={!userPermissions?.gatewaySetting?.patch}
        data={types}
        value={types.find((it) => it.id === data.gateWayType)}
        change={(e) => setData({ ...data, gateWayType: e.id })}
      />
      <TextInput
        disabled={!userPermissions?.gatewaySetting?.patch}
        currentValue={data.reserveTime}
        change={(e) => setData({ ...data, reserveTime: e })}
      />
      <Dropdown
        disabled={!userPermissions?.gatewaySetting?.patch}
        data={headerOption}
        value={headerOption.find((it) => it.value === data.refundType)}
        change={(e) => setData({ ...data, refundType: e.value })}
      />
      {/*       <TextInput disabled currentValue={data.refundType} />{" "}
       */}{" "}
      <Switch
        onChange={(e) => setData({ ...data, hasVat: !data.hasVat })}
        checked={data.hasVat}
        disabled={!userPermissions?.gatewaySetting?.patch}
      />{" "}
      <TextInput
        disabled={!userPermissions?.gatewaySetting?.patch || !data.hasVat}
        currentValue={data.vat}
        change={(e) => setData({ ...data, vat: e })}
      />
      <Button
        disabled={!data.id}
        onClick={() => setOpenLog(true)}
        variant="outlined"
      >
        مشاهده
      </Button>{" "}
      <div className="flex gap-2 items-center">
        <IconButton
          disabled={!data.id}
          onClick={() => setOpenImage(true)}
          variant="contained"
          color="success"
        >
          <ImageIcon />
        </IconButton>{" "}
        <IconButton
          disabled={!data.id}
          onClick={() => setOpenSetting(true)}
          variant="contained"
          color="warning"
        >
          <Edit />
        </IconButton>
        {userPermissions?.gatewaySetting?.delete && (
          <IconButton
            onClick={() => setOpen(true)}
            disabled={!data.id}
            variant="outlined"
            color="error"
          >
            <Delete color="error" />
          </IconButton>
        )}
      </div>
      {/* <Checkbox
    onChange={() => ChangeWidget("Mellat")}
    checked={isCheckedWidget("Mellat")}
  /> */}
      <Confirm
        message="آیا از حذف این درگاه اطمینان دارید؟"
        close={() => setOpen(false)}
        submit={() => {
          deleteAttr();
          setOpen(false);
        }}
        open={open}
      />
      <Modal
        title={"لاگ تغیرات " + data.title}
        open={openLog}
        close={() => setOpenLog(false)}
      >
        {ReactHtmlParse(data?.changeLog || "")}
      </Modal>{" "}
      <Modal
        title={"ویرایش عکس " + data.title}
        open={openImage}
        close={() => setOpenImage(false)}
      >
        <UploadImage
          file={avatar}
          change={setAvatar}
          address={data.galleryId}
          selectedProductImage={selectedProductImage}
          setselectedProductImage={setselectedProductImage}
        />
        {userPermissions?.gatewaySetting?.patch && (
          <div className="my-4 flex justify-end">
            <Button
              disabled={loadingSave}
              onClick={handleUpload}
              variant="contained"
            >
              {loadingSave ? <CircularProgress /> : " ثبت اطلاعات"}
            </Button>
          </div>
        )}
      </Modal>
      <EditDefaultGateWays
        open={openSetting}
        forEdit={defualtGateWay.id}
        data={defualtGateWay}
        setAllRows={setdDefualtGateWays}
        allRows={defualtGateWays}
        close={() => {
          setOpenSetting(false);
        }}
        shipingCompany={shippings}
        orderState={orderStates}
      />
    </div>
  );
};

export default GateWayItem;
