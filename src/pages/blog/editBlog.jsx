/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Divider, Paper, Tab, Tabs } from "@mui/material";
import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import CrosBlog from "../../components/blogs/crossBlog";
import Forms from "../../components/blogs/forms";
import CrosBlogTag from "../../components/blogs/relatedTags";
import { PageTitle } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  GET_RELATED_TAG,
  GET_SINGLE_BLOG,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const SingleBlog = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [value, setValue] = useState(0);

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const location = useLocation();
  const [menu, setMenu] = useState([]);
  const [crossSell, setCrossSell] = useState([]);

  useLayoutEffect(() => {
    if (location.hash === "#step2") {
      setValue(1);
    } else if (location.hash === "#step3") {
      setValue(2);
    } else if (location.hash === "#step4") {
      setValue(3);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    axiosInstance(`${baseUrl}/${GET_SINGLE_BLOG}?id=${id}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data.code === 200) {
          setProductData(data.data);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
    /*     axiosInstance(`${baseUrl}/${GET_PTODUCT_PUBLIC}?productId=${id}`, configReq(token))
      .then((res) => {
        const { data } = res;
        if (data.code === 200) {
          setPublicAttr(data.data);
        }
      })
      .catch((err) => {});
    axiosInstance(`${baseUrl}/${GET_PRODUCT_ATTR}?productId=${id}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data.code === 200) {
          setAtterbuites(data.data);
        }
      })
      .catch((err) => {}); */

    axiosInstance(
      `${baseUrl}/${GET_RELATED_TAG}?Page=1&Limit=20&filter[0][key]=blogId&filter[0][value]=${id}&filter[0][operator]=eq`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data.code === 200) {
          setCrossSell(data.data);
        }
      })
      .catch((err) => {});
  }, [id, token, refresh]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    var temp = [];
    temp.push({ name: "basic", title: "اطلاعات پایه" });
    temp.push({ name: "crosBlog", title: " بلاگ های مرتبط" });
    temp.push({ name: "productProperties", title: " تگ های بلاگ" });
    setMenu(temp);
  }, [userPermissions]);
  return (
    <>
      <PageTitle
        title={`ویرایش ${productData?.title || ""}`}
        broadCrumb={[
          {
            title: "مدیریت بلاگ",
            path: "/blog",
          },
          {
            title: "بلاگ",
            path: "/blog",
          },
        ]}
      />
      <div className="md:mx-3 mx-1">
        <Paper elevation={0} sx={{ border: "1px solid #dbdfea" }}>
          <Tabs
            variant="scrollable"
            value={value}
            onChange={handleChange}
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
            {menu.map((item, index) => (
              <Tab key={item.title} label={item.title} {...a11yProps(index)} />
            ))}
          </Tabs>
          <Divider sx={{ mb: 2 }} />
          {menu.map((item, index) => (
            <TabPanel value={value} index={index} key={item.title}>
              {item.name === "basic" ? (
                <>
                  {" "}
                  <Forms
                    data={productData}
                    refresh={() => setRefresh(!refresh)}
                    editMode={true}
                    nextStep={() => {}}
                  />{" "}
                </>
              ) : item.name === "crosBlog" ? (
                <>
                  {" "}
                  <CrosBlog
                    data={productData}
                    createdId={id}
                    refresh={() => setRefresh(!refresh)}
                  />
                </>
              ) : item.name === "productProperties" ? (
                <>
                  {" "}
                  <CrosBlogTag
                    data={crossSell || []}
                    createdId={id}
                    refresh={() => setRefresh(!refresh)}
                  />
                </>
              ) : (
                <></>
              )}
            </TabPanel>
          ))}
        </Paper>
      </div>
    </>
  );
};

const styles = {
  container: { px: "8%", direction: "rtl", pb: "50px" },
  filtersBox: { display: "flex", alignItems: "center", gap: 2 },
};

export default SingleBlog;
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
        <Box sx={{ p: { md: "20px" } }}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
