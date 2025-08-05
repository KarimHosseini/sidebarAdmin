/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Switch,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PageTitle, TextInput } from "../../components/common";
import SearchInput2 from "../../components/common/searchInput2";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import NoAccess from "../../components/noAccess";
import {
  ALL_USERS,
  baseUrl,
  CHECK_FINNO_TECH_FOR_FRONT,
  CHECK_FINNO_TECH_FOR_USER,
  CHECK_FINNOTECH_ACTIVE,
  CHECK_FINNOTECH_ACTIVE_FOR_USER,
  CHECK_PERSOANL_DETAILS,
  CHECK_PERSOANL_DETAILS_FRONT,
  CHECK_PERSOANL_DETAILS_FRONT_USER,
  CHECK_PERSOANL_DETAILS_Update,
  CHECK_PERSOANL_DETAILS_Update_USER,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";
import Finnotech from "./finnotech";

const PersonalDetailMatch = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [valueChanged, setvalueChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingActive, setLoadingActive] = useState(false);

  const [loadingActive2, setLoadingActive2] = useState(false);
  const [isFinnoTechAlive, setIsFinnoTechAlive] = useState(false);
  const [isFinnoTechAliveForUser, setIsFinnoTechAliveForUser] = useState(false);
  const [data, setData] = useState({});
  const [value, setValue] = useState(0);
  const [value2, setValue2] = useState(0);

  const [isActive, setIsActive] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [isActiveFino, setIsActiveFino] = useState(false);
  const [isActive2Fino, setIsActive2Fino] = useState(false);
  const [user, setUser] = useState();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChange2 = (event, newValue) => {
    setValue2(newValue);
  };

  const handleSave = () => {
    setLoading(true);
    var sd =
      value === 1
        ? { NationalCode: user?.nationalCode, PhoneNumber: user?.mobile }
        : { ...data };
    axiosInstance
      .post(`${baseUrl}/${CHECK_PERSOANL_DETAILS}`, { ...sd }, configReq(token))
      .then((res) => {
        setLoading(false);
        if (res.data.data) {
          toast.success("  احراز هویت صحیح می باشد. ");
        } else {
          toast.error("  احراز هویت دارای مغایرت می باشد.");
        }
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
    setLoadingActive(true);
    axiosInstance
      .get(`${baseUrl}/${CHECK_PERSOANL_DETAILS_FRONT}`, configReq(token))
      .then((res) => {
        setLoadingActive(false);
        setIsActive(res.data.data);
      })
      .catch((err) => {
        setLoadingActive(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
    axiosInstance
      .get(`${baseUrl}/${CHECK_PERSOANL_DETAILS_FRONT_USER}`, configReq(token))
      .then((res) => {
        setLoadingActive(false);
        setIsActive2(res.data.data);
      })
      .catch((err) => {
        setLoadingActive(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  }, []);

  const handleToggle = () => {
    setLoadingActive(true);

    axiosInstance
      .patch(
        `${baseUrl}/${CHECK_PERSOANL_DETAILS_Update}`,
        {},
        configReq(token)
      )
      .then((res) => {
        setLoadingActive(false);
        if (isActive) {
          setIsActive2(false);
        }
        setIsActive(!isActive);
        toast.success("با موفقیت ویرایش شد");
      })
      .catch((err) => {
        setLoadingActive(false);

        toast.error(err.response?.data?.message);
      });
  };
  const handleToggle2 = () => {
    setLoadingActive2(true);

    axiosInstance
      .patch(
        `${baseUrl}/${CHECK_PERSOANL_DETAILS_Update_USER}`,
        {},
        configReq(token)
      )
      .then((res) => {
        setLoadingActive2(false);

        setIsActive2(!isActive2);
        toast.success("با موفقیت ویرایش شد");
      })
      .catch((err) => {
        setLoadingActive2(false);

        toast.error(err.response?.data?.message);
      });
  };
  useEffect(() => {
    checkFinnoTech();
    checkFinnoTechForUser();
    axiosInstance
      .get(`${baseUrl}/${CHECK_FINNO_TECH_FOR_USER}`, configReq(token))
      .then((res) => {
        setLoadingActive(false);
        setIsActiveFino(res.data.data);
      })
      .catch((err) => {
        setLoadingActive(false);
        toast.error(err.response?.data?.message);
      });
    axiosInstance
      .get(`${baseUrl}/${CHECK_FINNO_TECH_FOR_FRONT}`, configReq(token))
      .then((res) => {
        setLoadingActive(false);
        setIsActive2Fino(res.data.data);
      })
      .catch((err) => {
        setLoadingActive(false);
        toast.error(err.response?.data?.message);
      });
  }, []);

  const checkFinnoTech = () => {
    axiosInstance(`${baseUrl}/${CHECK_FINNOTECH_ACTIVE}`, configReq(token))
      .then((res) => {
        setIsFinnoTechAlive(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };

  const checkFinnoTechForUser = () => {
    axiosInstance(
      `${baseUrl}/${CHECK_FINNOTECH_ACTIVE_FOR_USER}`,
      configReq(token)
    )
      .then((res) => {
        setIsFinnoTechAliveForUser(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };
  if (!userPermissions?.PersonalDetailMatch?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle title="اعتبار سنجی  " />

      <div className="md:mx-3 mx-1">
        {" "}
        <Tabs
          value={value2}
          onChange={handleChange2}
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
          {" "}
          <Tab label=" جیبیت" {...a11yProps(0)} />
          {userPermissions?.finnotech?.view && (
            <Tab label=" فینوتک" {...a11yProps(1)} />
          )}
        </Tabs>
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          <TabPanel value={value2} index={0}>
            <>
              {" "}
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
                {" "}
                <Tab
                  label=" اعتبار سنجی موبایل با شماره ملی"
                  {...a11yProps(0)}
                />
                {isActive && (
                  <>
                    {" "}
                    <Tab label=" جست و جو بر اساس کاربران" {...a11yProps(1)} />
                  </>
                )}
              </Tabs>{" "}
              <TabPanel value={value} index={0}>
                {" "}
                <div>
                  <div className="grid md:grid-cols-5 gap-4">
                    {isActive && (
                      <>
                        {" "}
                        <TextInput
                          label=" کد ملی"
                          change={(e) => setData({ ...data, NationalCode: e })}
                          currentValue={data.NationalCode}
                        />
                        <TextInput
                          label=" شماره همراه"
                          change={(e) => setData({ ...data, PhoneNumber: e })}
                          currentValue={data.PhoneNumber}
                        />
                        <Button
                          disabled={loading}
                          size="large"
                          onClick={handleSave}
                          variant="contained"
                          color="primary"
                        >
                          {loading ? <CircularProgress /> : <> ثبت اطلاعات</>}
                        </Button>
                      </>
                    )}

                    <div className="flex gap-3 items-center">
                      <span>
                        {" "}
                        {!isActive
                          ? " اعتبار سنجی کلی غیرفعال   "
                          : " اعتبار سنجی کلی فعال "}
                      </span>
                      <Switch
                        checked={isActive}
                        onClick={handleToggle}
                        disabled={loadingActive}
                      />
                    </div>
                    <div className="flex gap-3 items-center">
                      <span>
                        {" "}
                        {!isActive2
                          ? " اعتبار سنجی پنل کاربر غیرفعال   "
                          : " اعتبار سنجی پنل کاربر فعال "}
                      </span>
                      <Switch
                        checked={isActive2}
                        onClick={handleToggle2}
                        disabled={loadingActive2 || isActive === false}
                      />
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <div className="grid md:grid-cols-4 gap-4">
                  <SearchInput2
                    url={ALL_USERS}
                    value={user}
                    setValue={(e) => {
                      setUser(e);
                      setvalueChanges(true);
                    }}
                    label={"جست و جو کاربر"}
                  />{" "}
                  {valueChanged && user?.mobile ? (
                    <>
                      <TextField
                        InputLabelProps={{ shrink: true }}
                        value={user?.nationalCode || ""}
                        label="  کدملی"
                        disabled
                      />
                      <TextField
                        InputLabelProps={{ shrink: true }}
                        value={user?.mobile || ""}
                        label=" شماره همراه"
                        disabled
                      />
                      <div className="flex col-span-4 justify-end">
                        {user && (
                          <Button
                            onClick={handleSave}
                            variant="contained"
                            color="primary"
                          >
                            {loading ? <CircularProgress /> : <> ثبت اطلاعات</>}
                          </Button>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <TextField
                        /* value={value?.nationalCode} */ value=""
                        label="  کدملی"
                        disabled
                      />
                      <TextInput
                        /*  currentValue={prevData?.mobile} */
                        label=" شماره همراه"
                        disabled
                      />{" "}
                    </>
                  )}
                </div>
              </TabPanel>
            </>
          </TabPanel>{" "}
          <TabPanel value={value2} index={1}>
            <Finnotech
              isActive={isActiveFino}
              setIsActive={setIsActiveFino}
              isActive2={isActive2Fino}
              setIsActive2={setIsActive2Fino}
              isFinnoTechAliveForUser={isFinnoTechAliveForUser}
              setIsFinnoTechAliveForUser={setIsFinnoTechAliveForUser}
              setIsFinnoTechAlive={setIsFinnoTechAlive}
              isFinnoTechAlive={isFinnoTechAlive}
            />
          </TabPanel>
        </Paper>
      </div>
    </>
  );
};

export default PersonalDetailMatch;

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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
