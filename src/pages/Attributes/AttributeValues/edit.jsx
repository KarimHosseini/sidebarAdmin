/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Delete } from "@mui/icons-material";
import { Box, IconButton, Switch, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ActionButton,
  ColorInput,
  Modal,
  TextInput,
  UploadImage,
} from "../../../components/common";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import Confirm from "../../../components/modals/Confirm";
import {
  baseUrl,
  EDIT_ATTR_VALUE,
  REMOVE_ATTR_VALUE,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import { logout } from "../../../redux/slices/user";

const EditAttributeValues = ({
  open,
  close,
  type,
  propsData,
  allData,
  setALlData,
}) => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [showInShop, setshowInShop] = useState(false);

  const dispatch = useDispatch();
  const [selectedProductImage, setselectedProductImage] = useState();
  const [valueTab, setValueTab] = useState(0);
  const [slug, setSlug] = useState("");

  const [avatar, setAvatar] = useState();
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const resetData = () => {
    setName("");
    setValue("");
    setselectedProductImage();
    setValueTab(0);
    setshowInShop("");
    setSlug("");
  };
  useEffect(() => {
    if (open) {
      setValue(propsData.value);
      setName(propsData.title);
      setshowInShop(propsData.showInShop);
      setselectedProductImage(propsData.galleryId);
      setSlug(propsData.slug);
      if (propsData.galleryId) {
        setValueTab(1);
      }
    }
  }, [propsData, open]);
  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };
  const deleteItem = () => {
    if (propsData) {
      axiosInstance
        .delete(
          `${baseUrl}/${REMOVE_ATTR_VALUE}?id=${propsData.id}`,
          configReq(token)
        )
        .then((res) => {
          var temp = allData?.values ? [...allData.values] : [];
          var newData = temp.filter((item) => item.id !== propsData.id);
          setALlData({ ...allData, values: newData });
          setLoading(false);
          toast.success("با موفقیت حذف شد");
          close();
          setOpenDelete(false);
        })
        .catch((err) => {
          setLoading(false);

          toast.error(err.response?.data?.message);
          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
    }
  };

  const editItem = () => {
    if (!slug) {
      toast.error("اسلاگ را وارد کنید");
      return;
    }
    let cleanSlug = slug.replace(/^\/+/, "").trim().replace(/\s+/g, "-");

    const englishSlugRegex = /^[a-zA-Z0-9\-_]+$/;
    if (!englishSlugRegex.test(cleanSlug)) {
      toast.error("اسلاگ باید فقط شامل حروف انگلیسی، اعداد یا - و _ باشد");
      return;
    }

    const data = {
      id: propsData.id,
      attributeId: parseInt(id),
      title: name,
      value: value,
      fromGallery: selectedProductImage,
      files: avatar,
      showInShop: Boolean(showInShop),
      slug: cleanSlug,
    };

    setLoading(true);
    axiosInstance
      .put(`${baseUrl}/${EDIT_ATTR_VALUE}`, data, configReq(token))
      .then((res) => {
        setLoading(false);
        var temp = allData?.values ? [...allData.values] : [];
        var index = temp.findIndex((item) => item.id === data.id);
        temp[index] = res.data.data;
        setALlData({ ...allData, values: temp });
        toast.success("با موفقیت ویرایش شد");
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
      title={`ویرایش مقدار: ${propsData.title}`}
    >
      <Box sx={styles.inputBox}>
        {type === 1 ? (
          <>
            {" "}
            <Tabs
              value={valueTab}
              onChange={handleChange}
              aria-label="basic tabs example"
              sx={{
                flexGrow: 1,
                height: "3.07rem",
                minHeight: "40px !important",
                ".MuiTab-root": {
                  minHeight: "40px !important",
                },
                background: (theme) =>
                  theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.04) !important"
                    : "rgba(0,0,0,0.7)  !important",
              }}
            >
              <Tab label="  رنگ " {...a11yProps(0)} />
              <Tab label=" عکس " {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={valueTab} index={0}>
              <>
                <ColorInput
                  color={value}
                  setColor={setValue}
                  changeName={setName}
                  name={name}
                />
                <TextInput
                  label=" اسلاگ"
                  ltr
                  change={setSlug}
                  currentValue={slug}
                />
              </>
            </TabPanel>
            <TabPanel value={valueTab} index={1}>
              <div className="flex flex-col gap-4">
                <TextInput
                  label="نام رنگ"
                  change={setName}
                  currentValue={name}
                />
                <UploadImage
                  file={avatar}
                  change={setAvatar}
                  address={propsData.galleryId}
                  selectedProductImage={selectedProductImage}
                  setselectedProductImage={setselectedProductImage}
                />{" "}
                <TextInput
                  label=" اسلاگ"
                  ltr
                  change={setSlug}
                  currentValue={slug}
                />
              </div>
            </TabPanel>
          </>
        ) : (
          <>
            {" "}
            <TextInput
              currentValue={name}
              label="مقدار جدید"
              change={(inputValue) => {
                setName(inputValue);
                setValue(inputValue);
              }}
            />
            <TextInput ltr label=" اسلاگ" change={setSlug} currentValue={slug} />
            {/*       <TextInput
              currentValue={value}
              label=" نام به انگلیسی"
              change={(inputValue) => {
                setValue(inputValue);
              }}
            /> */}{" "}
            <UploadImage
              file={avatar}
              change={setAvatar}
              address={propsData.galleryId}
              selectedProductImage={selectedProductImage}
              setselectedProductImage={setselectedProductImage}
            />
          </>
        )}
        <div className="flex justify-between items-center">
          <span>نمایش در فیلتر : </span>
          <Switch
            checked={showInShop}
            onChange={() => setshowInShop(!showInShop)}
          />
        </div>
        <Box sx={{ display: "flex" }}>
          {userPermissions?.attributes?.delete && (
            <IconButton onClick={() => setOpenDelete(true)}>
              <Delete color="error" />
            </IconButton>
          )}{" "}
          <div style={{ flexGrow: 1 }} />
          <ActionButton click={editItem} />
        </Box>
      </Box>
      <Confirm
        message="آیا از حذف این مقدار اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

const styles = {
  inputBox: { display: "flex", flexDirection: "column", gap: 2 },
};

export default EditAttributeValues;
function a11yProps(index) {
  return {
    id: `company-tab-${index}`,
    "aria-controls": `company-tabpanel-${index}`,
  };
}
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
          <>{children}</>
        </>
      )}
    </div>
  );
}
