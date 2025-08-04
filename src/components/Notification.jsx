/* eslint-disable react-hooks/exhaustive-deps */
import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { NumberInput, ShowImage, TextInput } from "../components/common";
import Confirm from "../components/modals/Confirm";
import {
  baseUrl,
  DELETE_NOTIFICATION,
  EDIT_NOTIFICATION,
} from "../helpers/api-routes";
import { configReq } from "../helpers/functions";
import axiosInstance from "./dataFetch/axiosInstance";

const NotificationData = ({ notif, reset }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);

  const [notfData, setNotifData] = useState({ ...notif });
  const [openDelete, setOpenDelete] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const deleteNotif = () => {
    if (deletingId) {
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_NOTIFICATION}/${deletingId}`,
          configReq(token)
        )
        .then((res) => {
          setOpenDelete(false);
          toast.success("با موفقیت ویرایش شد");
          reset();
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setOpenDelete(false);
        });
    }
  };
  const setEdited = (id) => {
    if (id) {
      var edited = { ...notfData, id: id };
      delete edited.image;

      axiosInstance
        .put(`${baseUrl}/${EDIT_NOTIFICATION}`, { ...edited }, configReq(token))
        .then((res) => {
          setOpenDelete(false);
          toast.success("با موفقیت ویرایش شد");
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setOpenDelete(false);
        });
    }
  };
  return (
    <Accordion elevation={1} key={notif.id}>
      <AccordionSummary
        sx={{
          display: "flex",
          alignItems: "center",
        }}
        expandIcon={<ExpandMore />}
      >
        <ShowImage address={notif.galleryId} />
      </AccordionSummary>
      <AccordionDetails>
        <Grid
          container
          sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}
        >
          <div className="grid md:grid-cols-4 gap-3">
            <TextInput
              disabled={!userPermissions?.siteNotification?.update}
              currentValue={notif.id}
              readOnly={true}
              label="آیدی"
            />
            <TextInput
              currentValue={notfData.title ? notfData.title : notif.title}
              label="عنوان"
              disabled={!userPermissions?.siteNotification?.update}
              change={(e) => setNotifData({ ...notfData, title: e })}
            />
            <TextInput
              currentValue={notfData.link ? notfData.link : notif.link}
              label="لینک"
              ltr
              change={(e) => setNotifData({ ...notfData, link: e })}
              disabled={!userPermissions?.siteNotification?.update}
            />
            {notfData.type === 1 && (
              <div className="flex gap-3 items-center">
                <NumberInput
                  change={(e) => setNotifData({ ...notfData, viewCount: e })}
                  value={notfData.viewCount}
                  label=" تعداد دفعات نمایش "
                />
              </div>
            )}
          </div>

          <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Typography>فعال/غیرفعال:</Typography>
            <Switch
              onChange={() =>
                setNotifData({
                  ...notfData,
                  active: notfData?.active ? !notfData.active : !notif.active,
                })
              }
              disabled={!userPermissions?.siteNotification?.update}
              defaultChecked={notif.active}
            />
          </Box>
          <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Typography>مخصوص موبایل:</Typography>
            <Switch
              disabled={!userPermissions?.siteNotification?.update}
              onChange={() =>
                setNotifData({
                  ...notfData,
                  mobileView: notfData?.mobileView
                    ? !notfData.mobileView
                    : !notif.mobileView,
                })
              }
              defaultChecked={notif.mobileView}
            />
          </Box>
        </Grid>
        <div className="flex justify-end items-center gap-3">
          <Button
            sx={{ mt: 1 }}
            color="error"
            variant="contained"
            onClick={() => {
              setDeletingId(notif.id);
              setOpenDelete(true);
            }}
            disabled={!userPermissions?.siteNotification?.delete}
          >
            حذف
          </Button>
          <Button
            sx={{ mt: 1 }}
            color="warning"
            variant="contained"
            onClick={() => {
              setEdited(notif.id, {});
            }}
            disabled={!userPermissions?.siteNotification?.update}
          >
            ویرایش
          </Button>
        </div>
      </AccordionDetails>

      <Confirm
        message="آیا از حذف این نوتیفیکیشن اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteNotif}
        open={openDelete}
      />
    </Accordion>
  );
};

export default NotificationData;
