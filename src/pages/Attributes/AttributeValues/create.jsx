import { Box, Switch, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ActionButton,
  ColorInput,
  Loading,
  Modal,
  TextInput,
  UploadImage,
} from "../../../components/common";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import { ADD_ATTR_VALUE, baseUrl } from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import { logout } from "../../../redux/slices/user";

const CreateAttrValue = ({
  open,
  close,
  type,
  title,
  propsId = false,
  allData,
  setALlData,
}) => {
  const { id } = useParams();

  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [valueTab, setValueTab] = useState(0);
  const [selectedProductImage, setselectedProductImage] = useState();
  const [avatar, setAvatar] = useState();
  const [showInShop, setshowInShop] = useState(false);
  const [slug, setSlug] = useState("");
  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };
  useEffect(() => {
    const names = `${
      allData.name ? allData.name.trim().replace(/\s+/g, "-") + "-" : ""
    }`;

    setSlug(names);
  }, [allData]);
  const handleClose = () => {
    setName("");
    setValue("");
    setValueTab();
    setselectedProductImage();
    setAvatar();
    close();
    setSlug("");

    setshowInShop("");
  };
  const addItem = () => {
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
    var names = `${allData.name ? allData.name.trim().replace(/\s+/g, "-") + "-" : ""}`;
    if (!cleanSlug.startsWith(names)) {
      cleanSlug = names + cleanSlug;
    }
    var data = {
      attributeId: propsId ? propsId : id,
      title: name,
      showInShop: Boolean(showInShop),
      slug: cleanSlug,
    };
    if (avatar) {
      data = { ...data, files: avatar, value: id === "1" ? null : name };
    } else if (selectedProductImage) {
      data = {
        ...data,
        fromGallery: selectedProductImage,
        value: id === "1" ? null : name,
      };
    } else if (value) {
      data = { ...data, value: value };
    }
    setLoading(true);
    axiosInstance
      .post(`${baseUrl}/${ADD_ATTR_VALUE}`, data, configReq(token))
      .then((res) => {
        setLoading(false);
        var temp = allData?.values ? [...allData.values] : [];
        temp.unshift(res.data.data);
        setALlData({ ...allData, values: temp });
        toast.success("با موفقیت اضافه شد");

        handleClose();
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
    <Modal open={open} close={handleClose} title={`افزودن مقدار به ${title}`}>
      {loading && <Loading />}
      {type === 1 ? (
        <Box sx={styles.inputBox}>
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
              />{" "}
              <div className="flex justify-between items-center">
                <span>نمایش در فیلتر : </span>
                <Switch
                  checked={showInShop}
                  onChange={() => setshowInShop(!showInShop)}
                />
              </div>
              <TextInput
                ltr
                label=" اسلاگ"
                change={setSlug}
                currentValue={slug}
              />
              <ActionButton title="افزودن رنگ جدید" click={addItem} />
            </>
          </TabPanel>
          <TabPanel value={valueTab} index={1}>
            <div className="flex flex-col gap-4">
              <TextInput label="نام رنگ" change={setName} currentValue={name} />
              <TextInput
                ltr
                label=" اسلاگ"
                change={setSlug}
                currentValue={slug}
              />

              <UploadImage
                file={avatar}
                change={setAvatar}
                address={null}
                selectedProductImage={selectedProductImage}
                setselectedProductImage={setselectedProductImage}
              />
              <div className="flex justify-between items-center">
                <span>نمایش در فیلتر : </span>
                <Switch
                  checked={showInShop}
                  onChange={() => setshowInShop(!showInShop)}
                />
              </div>
              <ActionButton title="افزودن رنگ جدید" click={addItem} />
            </div>
          </TabPanel>
        </Box>
      ) : (
        <Box sx={styles.inputBox}>
          <TextInput
            label="مقدار جدید"
            change={(inputValue) => {
              setName(inputValue);
              setValue(inputValue);
            }}
          />
          <TextInput ltr label=" اسلاگ" change={setSlug} currentValue={slug} />
          <UploadImage
            file={avatar}
            change={setAvatar}
            address={null}
            selectedProductImage={selectedProductImage}
            setselectedProductImage={setselectedProductImage}
          />
          {/*     <TextInput
            label=" نام به انگلیسی"
            change={(inputValue) => {
              setValue(inputValue);
            }}
          /> */}
          <div className="flex justify-between items-center">
            <span>نمایش در فیلتر : </span>
            <Switch
              checked={showInShop}
              onChange={() => setshowInShop(!showInShop)}
            />
          </div>
          <ActionButton click={addItem} />
        </Box>
      )}
    </Modal>
  );
};

const styles = {
  inputBox: { display: "flex", flexDirection: "column", gap: 2 },
};

export default CreateAttrValue;
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
