import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Skeleton,
  Switch,
  Tab,
  Tabs,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PageTitle, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import NoAccess from "../../components/noAccess";
import {
  ADD_ACCOUNTIG_SETTING,
  baseUrl,
  GET_ACCOUNTIG_SETTING,
  GET_ACCOUNTIG_SETTING_STATUS,
  UPDATE_ACCOUNTIG_SETTING,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const AccountingSetting = () => {
  const [value, setValue] = useState(0);
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [loadingButton, setLoadingButton] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [data, setData] = useState({});
  const [isACtive, setisACtive] = useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    setLoading(true);
    setLoading2(true);
    axiosInstance(`${baseUrl}/${GET_ACCOUNTIG_SETTING}`, configReq(token))
      .then((res) => {
        setHasData(res.data.data);
        setData(res.data.data ? res.data.data : {});
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
        }
      });
    axiosInstance(
      `${baseUrl}/${GET_ACCOUNTIG_SETTING_STATUS}`,
      configReq(token)
    )
      .then((res) => {
        setisACtive(res.data.data);
        setLoading2(false);
      })
      .catch((err) => {
        setLoading2(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
        }
      });
  }, []);
  const handleSave = () => {
    setLoadingButton(true);
    axiosInstance
      .post(
        `${baseUrl}/${
          hasData ? UPDATE_ACCOUNTIG_SETTING : ADD_ACCOUNTIG_SETTING
        }`,
        { ...data, accountingSyncIsActive: isACtive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        toast.success("با موفقیت ویرایش شد");
        setLoadingButton(false);
      })
      .catch((err) => {
        setLoadingButton(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
        }
      });
  };
  if (!userPermissions?.accountingArpaSetting?.view) {
    return <NoAccess />;
  }
  return (
    <>
      {" "}
      <PageTitle
        broadCrumb={[
          {
            title: "    تنظیمات حسابداری",
            path: "/accountingSetting",
          },
        ]}
        title="  تنظیمات "
      />{" "}
      <div className="md:mx-3 mx-1">
        <Paper sx={{ border: "1px solid #dbdfea", mb: 1 }} elevation={0}>
          {" "}
          <Box
            sx={{ borderBottom: 1, borderColor: "divider" }}
            className="relative z-10"
          >
            <Tabs
              value={value}
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
              <Tab
                label=" 
تنظیمات سینک آرپا"
                {...a11yProps(0)}
              />
            </Tabs>
            <TabPanel value={value} index={0}>
              {loading || loading2 ? (
                <Skeleton width={"100%"} height={400} variant="rounded" />
              ) : (
                <>
                  <Box className="flex items-center mb-8">
                    <span className="text-xs">فعال/غیر فعال سینک آرپا :‌</span>
                    <Switch
                      disabled={!userPermissions?.accountingArpaSetting?.update}
                      size="small"
                      checked={isACtive}
                      onChange={() => setisACtive(!isACtive)}
                    />
                  </Box>
                  {isACtive ? (
                    <>
                      {" "}
                      <div className="flex flex-wrap items-center gap-4">
                        <TextInput
                          disabled={
                            !userPermissions?.accountingArpaSetting?.update
                          }
                          currentValue={data.userGroupId}
                          label="ایدی یوزر گروپ"
                          change={(e) => setData({ ...data, userGroupId: e })}
                        />{" "}
                        <Box className="flex items-center">
                          <span className="text-xs">
                            تغییر نام محصول در سینک محصولات به کد تجاری
                          </span>
                          <Switch
                            disabled={
                              !userPermissions?.accountingArpaSetting?.update
                            }
                            size="small"
                            checked={data.useProductCodeAsName}
                            onChange={() =>
                              setData({
                                ...data,
                                useProductCodeAsName:
                                  !data.useProductCodeAsName,
                              })
                            }
                          />
                        </Box>{" "}
                      </div>{" "}
                      <div className="flex flex-wrap mt-8 items-center gap-4">
                        {" "}
                        <Box className="flex items-center">
                          <span className="text-xs">
                            1- در زمان سینک محصولات ، قیمت از آرپا خوانده شود .
                          </span>
                          <Switch
                            disabled={
                              !userPermissions?.accountingArpaSetting?.update
                            }
                            size="small"
                            checked={data.priceSyncActive}
                            onChange={() =>
                              setData({
                                ...data,
                                priceSyncActive: !data.priceSyncActive,
                              })
                            }
                          />
                        </Box>
                        <Box className="flex items-center">
                          <span className="text-xs">
                            2- در زمان سینک محصولات موجودی از آرپا خوانده شود
                          </span>
                          <Switch
                            disabled={
                              !userPermissions?.accountingArpaSetting?.update
                            }
                            size="small"
                            checked={data.qtySyncActive}
                            onChange={() =>
                              setData({
                                ...data,
                                qtySyncActive: !data.qtySyncActive,
                              })
                            }
                          />
                        </Box>{" "}
                      </div>
                      <div className="flex flex-wrap my-8 items-center gap-4">
                        {" "}
                        <TextInput
                          disabled={
                            !userPermissions?.accountingArpaSetting?.update
                          }
                          currentValue={data.primaryStockId}
                          label="ایدی انبار رسمی"
                          change={(e) =>
                            setData({ ...data, primaryStockId: e })
                          }
                        />{" "}
                        <TextInput
                          disabled={
                            !userPermissions?.accountingArpaSetting?.update
                          }
                          currentValue={data.secondaryStockId}
                          label="ایدی انبار غیررسمی"
                          change={(e) =>
                            setData({ ...data, secondaryStockId: e })
                          }
                        />
                        <TextInput
                          disabled={
                            !userPermissions?.accountingArpaSetting?.update
                          }
                          currentValue={data.colleagueStokeId}
                          label="ایدی انبار همکار"
                          change={(e) =>
                            setData({ ...data, colleagueStokeId: Number(e) })
                          }
                        />
                        {/*      <Box className="flex items-center">
                          <span className="text-xs">
                            {" "}
                            استفاده از انبار رسمی
                          </span>
                          <Switch
                            disabled={
                              !userPermissions?.accountingArpaSetting?.update
                            }
                            size="small"
                            checked={data.usePrimaryStock}
                            onChange={() =>
                              setData({
                                ...data,
                                usePrimaryStock: !data.usePrimaryStock,
                              })
                            }
                          />
                        </Box> */}
                      </div>
                      <div className="flex flex-wrap mb-8 items-center gap-4">
                        {" "}
                        <Box className="flex items-center">
                          <span className="text-xs">
                            اجرای سینک بصورت زمانبندی شده
                          </span>
                          <Switch
                            disabled={
                              !userPermissions?.accountingArpaSetting?.update
                            }
                            size="small"
                            checked={data.isSyncJobActive}
                            onChange={() =>
                              setData({
                                ...data,
                                isSyncJobActive: !data.isSyncJobActive,
                              })
                            }
                          />
                        </Box>
                        {data.isSyncJobActive ? (
                          <TextInput
                            disabled={
                              !userPermissions?.accountingArpaSetting?.update
                            }
                            number
                            priceLabel="دقیقه"
                            price
                            currentValue={data.syncInterval || ""}
                            label="فاصله زمانی دقیقه سینک اتومات با ارپا"
                            change={(e) =>
                              setData({ ...data, syncInterval: e })
                            }
                          />
                        ) : (
                          <></>
                        )}{" "}
                      </div>
                      <div className="flex flex-wrap my-8 items-center gap-4">
                        {" "}
                        <TextInput
                          disabled={
                            !userPermissions?.accountingArpaSetting?.update
                          }
                          currentValue={data.b2cPriceId}
                          label="ایدی قیمت B2C "
                          change={(e) => setData({ ...data, b2cPriceId: e })}
                        />{" "}
                        <TextInput
                          disabled={
                            !userPermissions?.accountingArpaSetting?.update
                          }
                          currentValue={data.b2bPriceId}
                          label=" ایدی قیمت B2B "
                          change={(e) => setData({ ...data, b2bPriceId: e })}
                        />{" "}
                        <Box className="flex items-center">
                          <span className="text-xs">
                            {" "}
                            استفاده از نوع قیمت B2C :{" "}
                          </span>
                          <Switch
                            disabled={
                              !userPermissions?.accountingArpaSetting?.update
                            }
                            size="small"
                            checked={data.useB2CPriceAsDefault}
                            onChange={() =>
                              setData({
                                ...data,
                                useB2CPriceAsDefault:
                                  !data.useB2CPriceAsDefault,
                              })
                            }
                          />
                        </Box>
                      </div>{" "}
                      <div className="flex flex-wrap my-8 items-center gap-4">
                        {" "}
                        <TextInput
                          disabled={
                            !userPermissions?.accountingArpaSetting?.update
                          }
                          currentValue={data.chunkSize}
                          label="تعداد آیتم ها در هر صف"
                          change={(e) =>
                            setData({ ...data, chunkSize: Number(e) })
                          }
                        />{" "}
                        <TextInput
                          disabled={
                            !userPermissions?.accountingArpaSetting?.update
                          }
                          currentValue={data.consumerCount}
                          label=" تعداد ماشین های اجرایی"
                          change={(e) =>
                            setData({ ...data, consumerCount: Number(e) })
                          }
                        />{" "}
                      </div>
                      <Alert severity="info" variant="outlined">
                        گزینه های 1و 2 در نخستین سینک باید غیر فعال باشد
                      </Alert>
                    </>
                  ) : (
                    <></>
                  )}{" "}
                  <div className="flex mt-4 flex-wrap items-center gap-4 justify-end">
                    {" "}
                    <Button
                      variant="contained"
                      disabled={loadingButton}
                      onClick={handleSave}
                    >
                      {loadingButton ? <CircularProgress /> : " ثبت اطلاعات"}
                    </Button>{" "}
                  </div>
                </>
              )}
            </TabPanel>
          </Box>
        </Paper>
      </div>
    </>
  );
};

export default AccountingSetting;
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
        <Box sx={{ p: 3 }}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}
