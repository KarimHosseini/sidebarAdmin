import { Box, Switch, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ADD_ATTR_VALUE, baseUrl } from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import { logout } from "../../../redux/slices/user";
import {
  ActionButton,
  ColorInput,
  Loading,
  Modal,
  TextInput,
  UploadImage,
} from "../../common";
import axiosInstance from "../../dataFetch/axiosInstance";

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

  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };

  const resetData = () => {
    setName("");
    setValue("");
    setValueTab(0);
    setselectedProductImage();
    setAvatar();
    setshowInShop(false);
  };

  const addItem = () => {
    var data = {
      attributeId: propsId ? propsId : id,
      title: name,
      showInShop: Boolean(showInShop),
    };
    
    if (avatar) {
      data = { ...data, files: avatar, value: type === 1 ? null : name };
    } else if (selectedProductImage) {
      data = {
        ...data,
        fromGallery: selectedProductImage,
        value: type === 1 ? null : name,
      };
    } else if (value) {
      data = { ...data, value: value };
    }
    
    setLoading(true);
    axiosInstance
      .post(`${baseUrl}/${ADD_ATTR_VALUE}`, data, configReq(token))
      .then((res) => {
        setLoading(false);
        if (setALlData && allData) {
          var temp = allData?.values ? [...allData.values] : [];
          temp.unshift(res.data.data);
          setALlData({ ...allData, values: temp });
        }
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
  };

  return (
    <Modal 
      open={open} 
      close={() => {
        close();
        resetData();
      }} 
      title={`افزودن مقدار به ${title}`}
    >
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
                name={name}
              />
            </>
          </TabPanel>
          <TabPanel value={valueTab} index={1}>
            <div className="flex flex-col gap-4">
              <TextInput label="نام رنگ" change={setName} currentValue={name} />
              <UploadImage
                file={avatar}
                change={setAvatar}
                address={null}
                selectedProductImage={selectedProductImage}
                setselectedProductImage={setselectedProductImage}
              />
            </div>
          </TabPanel>
          <div className="flex justify-between items-center">
            <span>نمایش در فیلتر : </span>
            <Switch
              checked={showInShop}
              onChange={() => setshowInShop(!showInShop)}
            />
          </div>
          <ActionButton title="افزودن رنگ جدید" click={addItem} />
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
          <ActionButton click={addItem} />
        </Box>
      )}
      {type !== 1 && type !== 2 && (
        <Typography>نوع مقدار ویژگی مشخص نشده است.</Typography>
      )}
    </Modal>
  );
};

const styles = {
  inputBox: { display: "flex", flexDirection: "column", gap: 2 },
};

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

export default CreateAttrValue;
