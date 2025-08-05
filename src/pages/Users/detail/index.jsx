/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Dropdown, PageTitle } from "../../../components/common";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import NoAccess from "../../../components/noAccess";
import {
  ALL_USER_GROUP,
  baseUrl,
  EDIT_USER,
  EDIT_USER_AVATAR,
  GET_ACCESS_PROFILE,
  GET_CHILD_FACILITIES,
  GET_COMPANY,
  GET_GATEWAYS_ENUM,
  GET_PROVINCE,
  GET_USER_ADDRESS,
  GET_USER_AGENCY,
  SINGLE_USER,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import Address from "./address";
import Agency from "./agency";
import GroupsUser from "./groups";
import Legal from "./legal";
import MoreRealData from "./moreRealData";
import SellerSetting from "./sellerSetting";
import UserInfo from "./userInfo";
import UserSummery from "./userSummery";

const User = () => {
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [companies, setCompanies] = useState([]);
  const [facility, setFacility] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [userData, setUserData] = useState(null);
  const [agencyData, setAgencyData] = useState([]);
  const [gateWays, setGateWays] = useState([]);
  const [selectedProductImage, setselectedProductImage] = useState(null);
  const [avatar, setAvatar] = useState();
  const [access, setAccess] = useState([]);
  const [userAccess, setUserAccess] = useState();
  const [userAccessID, setUserAccessID] = useState();
  const [address, setAddress] = useState([]);
  const [province, setProvince] = useState([]);
  const [value, setValue] = useState(0);
  const [number, setNumber] = useState(0);
  const [groups, setGroups] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setLoading(true);
    axiosInstance(
      `${baseUrl}/${GET_GATEWAYS_ENUM}?page=${1}&Limit=${1000}&showBasicGateWay=true`,
      configReq(token)
    )
      .then((res) => {
        setGateWays(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
    axiosInstance(
      `${baseUrl}/${GET_ACCESS_PROFILE}?page=${1}&Limit=${1000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        var temp = data.data;
        temp.unshift({ id: -1, title: "هیچکدام" });

        setAccess(temp);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
    axiosInstance(`${baseUrl}/${SINGLE_USER}?id=${id}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data && data.code === 200 && data.data) {
          setUserData(data.data);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
    axiosInstance(
      `${baseUrl}/${GET_USER_AGENCY}?userId=${id}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data && data.code === 200 && data.data) {
          setAgencyData(data.data);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
    axiosInstance(
      `${baseUrl}/${GET_USER_ADDRESS}?filter[0][key]=userId&filter[0][value]=${id}&filter[0][operator]=eq`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data && data.code === 200 && data.data) {
          setAddress(data.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
    axiosInstance(`${baseUrl}/${GET_PROVINCE}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data && data.code === 200 && data.data) {
          setProvince(data.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
    axiosInstance(`${baseUrl}/${ALL_USER_GROUP}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data && data.code === 200 && data.data) {
          setGroups(data.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
    getFactory();
  }, [id, token]);
  useEffect(() => {
    setUserAccess(access.find((item) => item.id === userAccessID) || false);
  }, [access, userAccessID]);

  const handleSumbit = () => {
    setLoadingButton(true);
    var temp = { ...userData };
    for (var prop in temp) {
      if (temp[prop] === "") {
        delete temp[prop];
      }
    }
    const formData1 = new FormData();
    if (userData.userGroups) {
      userData.userGroups.map((item) => {
        formData1.append(
          "UserGroupIds",
          typeof item === "number" ? item : item.id
        );
      });
    }
    Object.keys(temp).forEach((key) => {
      if (key === "accessId" && temp[key] !== null) {
        formData1.append(key, temp[key] !== -1 ? temp[key] : null);
      } else if (temp[key]) {
        formData1.append(key, temp[key]);
      }
    });
    axiosInstance
      .put(`${baseUrl}/${EDIT_USER}`, formData1, configReq(token))
      .then((res) => {
        toast.success("با موفقیت ویرایش شد");
        setLoadingButton(false);
      })
      .catch((err) => {
        setLoadingButton(false);
        toast.error(err.response?.data?.message);
      });
    if (userData?.galleryId !== selectedProductImage || avatar) {
      const formData = new FormData();
      formData.append("id", userData.id);
      if (avatar) formData.append("files", avatar);
      if (selectedProductImage)
        formData.append("fromGallery", selectedProductImage);
      axiosInstance
        .put(`${baseUrl}/${EDIT_USER_AVATAR}`, formData, configReq(token))
        .then((res) => {
          setUserData(res?.data.data);
          setLoadingButton(false);
        })
        .catch((err) => {
          setLoadingButton(false);
          toast.error(err.response?.data?.message);
        });
    }
  };
  const getFactory = () => {
    axiosInstance(
      `${baseUrl}/${GET_COMPANY}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading(false);

        setCompanies(data?.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    axiosInstance
      .get(`${baseUrl}/${GET_CHILD_FACILITIES}`, configReq(token))
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
              temp.push({ title: ch.title, id: ch.id });
            });
          });
        setFacility(temp);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  }, []);

  if (!userPermissions?.user?.view) {
    return <NoAccess />;
  }

  return (
    <>
      <PageTitle
        title="جزییات کاربر"
        broadCrumb={[
          {
            title: "  کاربران و نقش ها",
            path: "/users",
          },
          {
            title: "کاربران",
            path: "/users",
          },
        ]}
      />
      <div className="md:mx-3 mx-1">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <Typography
              component="div"
              className="flex items-center gap-2"
              variant="h6"
            >
              اطلاعات
              <div className="text-[#13318f] mx-1">
                {userData?.fname} {userData?.lname}
              </div>
            </Typography>
            {/*     <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Typography
                  variant="body2"
                  sx={{ color: "#8094ae !important" }}
                >
                  آیدی کاربر :
                </Typography>
                <Typography variant="body2">{id}</Typography>
              </div>
              <div className="flex items-center gap-1">
                <Typography
                  variant="body2"
                  sx={{ color: "#8094ae !important" }}
                >
                  آخرین ورود :
                </Typography>
                <Typography variant="body2">
                  <DateDisplay date={userData?.lastLogin} />
                </Typography>
              </div>
            </div> */}
          </div>
          <Link to="/users">
            <Button variant="outlined">بازگشت</Button>
          </Link>
        </div>

        <Paper sx={{ border: "1px solid #dbdfea", mt: 2 }} elevation={0}>
          <div className="grid md:grid-cols-4 grid-cols-1 ">
            <UserSummery
              avatar={avatar}
              setAvatar={setAvatar}
              /*  address={userData.galleryId} */
              selectedProductImage={selectedProductImage}
              setselectedProductImage={setselectedProductImage}
              userData={userData}
              setUserData={setUserData}
            />
            <div className="md:col-span-3 md:border-r relative">
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
                  <Tab label=" اطلاعات حقیقی" {...a11yProps(0)} />
                  <Tab label=" اطلاعات حقیقی (تکمیلی)" {...a11yProps(1)} />

                  <Tab label=" اطلاعات حقوقی" {...a11yProps(2)} />

                  <Tab label="  نشانی ها" {...a11yProps(3)} />
                  <Tab label="    طرح و تخفیف" {...a11yProps(4)} />

                  <Tab label="  گروه ها" {...a11yProps(5)} />
                  <Tab label="  تنظیمات فروشنده" {...a11yProps(6)} />
                  {userPermissions?.AgentSetting?.view && (
                    <Tab label=" تنظیمات نماینده" {...a11yProps(7)} />
                  )}
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <>
                  {userData && (
                    <>
                      <UserInfo
                        userData={userData}
                        setUserData={setUserData}
                        id={id}
                        access={access}
                      />{" "}
                    </>
                  )}

                  <div className="flex items-end justify-end w-full h-full md:absolute md:bottom-6  mt-6 md:mt-0 bottom-0 left-5 z-0">
                    <Button variant="outlined" onClick={handleSumbit}>
                      {loadingButton ? <CircularProgress /> : "  ثبت تغییرات"}
                    </Button>
                  </div>
                </>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <>
                  {province.length > 0 && (
                    <MoreRealData
                      userData={userData}
                      setUserData={setUserData}
                      allProvinces={province}
                    />
                  )}
                  {userPermissions?.user?.update && (
                    <div className="flex items-end justify-end w-full h-full md:absolute md:bottom-6 mt-6 md:mt-0 left-5 z-0">
                      <Button variant="outlined" onClick={handleSumbit}>
                        {loadingButton ? <CircularProgress /> : "  ثبت تغییرات"}
                      </Button>
                    </div>
                  )}
                </>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <>
                  {province.length > 0 && (
                    <Legal
                      userData={userData}
                      setUserData={setUserData}
                      allProvinces={province}
                    />
                  )}
                  {userPermissions?.user?.update && (
                    <div className="flex items-end justify-end w-full h-full md:absolute md:bottom-6 mt-6 md:mt-0 left-5 z-0">
                      <Button variant="outlined" onClick={handleSumbit}>
                        {loadingButton ? <CircularProgress /> : "  ثبت تغییرات"}
                      </Button>
                    </div>
                  )}
                </>
              </TabPanel>
              <TabPanel value={value} index={3}>
                <Address
                  adrs={address}
                  province={province}
                  userData={userData}
                />{" "}
              </TabPanel>
              <TabPanel value={value} index={4}>
                <div>
                  <div className="grid md:grid-cols-4 relative z-50">
                    <Dropdown
                      title=" عضویت سازمان   "
                      data={companies}
                      value={companies?.find(
                        (item) => item.id === userData?.companyId
                      )}
                      change={(e) =>
                        setUserData({ ...userData, companyId: e?.id })
                      }
                    />{" "}
                  </div>

                  {userPermissions?.user?.update && (
                    <div className="flex items-end justify-end w-full h-full md:absolute md:bottom-6 mt-6 md:mt-0 left-5 z-0">
                      <Button variant="outlined" onClick={handleSumbit}>
                        {loadingButton ? <CircularProgress /> : "  ثبت تغییرات"}
                      </Button>
                    </div>
                  )}
                </div>
              </TabPanel>{" "}
              <TabPanel value={value} index={5}>
                <div>
                  <GroupsUser
                    groups={groups}
                    data={userData}
                    setData={setUserData}
                  />
                  <div className="w-full flex items-start justify-end">
                    <Button variant="contained" onClick={handleSumbit}>
                      {loadingButton ? <CircularProgress /> : "  ثبت تغییرات"}
                    </Button>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value={value} index={6}>
                <SellerSetting userData={userData} setUserData={setUserData} />
                <div className="w-full flex items-start justify-end">
                  <Button svariant="contained" onClick={handleSumbit}>
                    {loadingButton ? <CircularProgress /> : "  ثبت تغییرات"}
                  </Button>
                </div>
              </TabPanel>{" "}
              <TabPanel value={value} index={7}>
                <div>
                  {agencyData.map((item, index) => (
                    <div className="border-b mb-3 pb-3" key={index}>
                      {" "}
                      <Agency
                        hasDeleted={() => {
                          var temp = [...agencyData];
                          temp = temp.filter((it) => it.id !== item.id);

                          setAgencyData(temp);
                        }}
                        prevData={item}
                        editMode
                        facility={facility}
                        setAgencyData={setAgencyData}
                      />
                    </div>
                  ))}{" "}
                  {Array.from(Array(number).keys()).map((item, i) => (
                    <div className="border-b mb-3 pb-3" key={i + "new --- "}>
                      <Agency
                        setAgencyData={setAgencyData}
                        data={{}}
                        facility={facility}
                      />{" "}
                    </div>
                  ))}{" "}
                  {userPermissions?.AgentSetting?.insert && (
                    <div className="flex justify-end">
                      <Button
                        onClick={() => setNumber((n) => n + 1)}
                        variant="contained"
                        color="primary"
                      >
                        افزودن تنظیمات جدید
                      </Button>
                    </div>
                  )}
                  {/*     */}
                </div>
              </TabPanel>
            </div>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default User;

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
