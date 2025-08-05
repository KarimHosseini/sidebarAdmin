/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Divider,
  Paper,
  Tab,
  Tabs,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { PageTitle } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import SingleProductAttrs from "../../components/single-product/Attributes";
import BasicInfo from "../../components/single-product/BasicInfo";
import CrossSells from "../../components/single-product/CrossSells";
import ForceSell from "../../components/single-product/forceSell";
import Pricing from "../../components/single-product/Pricing";
import PublicAttributes from "../../components/single-product/PublicAttributes";
import {
  baseUrl,
  GET_BULK_SELL,
  GET_CROSS_SELL,
  GET_PRODUCT_ATTR,
  GET_PTODUCT_PUBLIC,
  SINGLE_PRODUCT,
  suppliers,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const SingleProduct = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [value, setValue] = useState(0);
  const [supplierData, setSupplierData] = useState([]);
  const isMd = useMediaQuery("(min-width:900px)");

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const location = useLocation();
  const [menu, setMenu] = useState([]);
  const [publicAttr, setPublicAttr] = useState([]);
  const [atterbuites, setAtterbuites] = useState([]);
  const [price, setPrice] = useState([]);
  const [crossSell, setCrossSell] = useState([]);
  const [crossSellForce, setCrossSellForce] = useState([]);

  useLayoutEffect(() => {
    if (location.hash === "#step2") {
      setValue(1);
    } else if (location.hash === "#step3") {
      setValue(2);
    } else if (location.hash === "#step4") {
      setValue(3);
    } else if (location.hash === "#step5") {
      setValue(4);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    axiosInstance(`${baseUrl}/${SINGLE_PRODUCT}?id=${id}`, configReq(token))
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
  }, [id, token, refresh]);
  useEffect(() => {
    axiosInstance(
      `${baseUrl}/${GET_PTODUCT_PUBLIC}?productId=${id}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        if (data.code === 200) {
          setPublicAttr(data.data);
        }
      })
      .catch((err) => {});
    axiosInstance(
      `${baseUrl}/${GET_PRODUCT_ATTR}?productId=${id}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data.code === 200) {
          setAtterbuites(data.data);
        }
      })
      .catch((err) => {});
    axiosInstance(
      `${baseUrl}/${GET_BULK_SELL}?Page=1&Limit=20&filter[0][key]=productId&filter[0][value]=${id}&filter[0][operator]=eq`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data.code === 200) {
          var temp = [];
          data.data.map((item) => {
            temp.push({
              ...item,
              id: item.forcedProductPropertyId,
              title: item.forceedProduct,
            });
          });
          setCrossSellForce(temp);
        }
      })
      .catch((err) => {});
    axiosInstance(
      `${baseUrl}/${GET_CROSS_SELL}?Page=1&Limit=20&filter[0][key]=productId&filter[0][value]=${id}&filter[0][operator]=eq`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data.code === 200) {
          var temp = [];
          data.data.map((item) => {
            temp.push({ ...item, id: item.crossProductId });
          });
          setCrossSell(temp);
        }
      })
      .catch((err) => {});
  }, [id, token, refresh, value]);
  useEffect(() => {
    setLoading(true);
    axiosInstance(
      `${baseUrl}/${suppliers}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading(false);
        if (data.code === 200) {
          setSupplierData(data.data);
          /*    setSupplier(data.data[0]); */
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    var temp = [];
    temp.push({ name: "basic", title: "اطلاعات پایه" });
    if (
      userPermissions?.productPublicAttribute?.view &&
      userPermissions?.productPublicAttribute?.insert
    ) {
      temp.push({ name: "productPublicAttribute", title: "ویژگیهای عمومی" });
    }
    if (
      userPermissions?.productAttribute?.view &&
      userPermissions?.productAttribute?.update
    ) {
      temp.push({ name: "productAttribute", title: " ویژگی های مشخصاتی" });
    }
    if (
      userPermissions?.productProperties?.view &&
      userPermissions?.productProperties?.update
    ) {
      temp.push({ name: "productProperties", title: "قیمت گذاری ویژگی ها" });
    }
    if (
      userPermissions?.crossCells?.view &&
      userPermissions?.crossCells?.update
    ) {
      temp.push({ name: "crossCells", title: "فروش جانبی" });
    }
    if (
      userPermissions?.productCrossForcedSell?.view &&
      userPermissions?.productCrossForcedSell?.update
    ) {
      temp.push({ name: "crossCellForce", title: "فروش اجباری جانبی" });
    }

    setMenu(temp);
  }, [userPermissions]);

  return (
    <>
      <PageTitle
        title={`ویرایش ${productData?.title || ""}`}
        broadCrumb={[
          {
            title: "مدیریت محصولات",
            path: "/products",
          },
          {
            title: "محصولات",
            path: "/products",
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
            <>
              {" "}
              {isMd && (
                <Button
                  target={"_blank"}
                  href={
                    process.env.REACT_APP_DOMAIN_URL +
                    `/products/${id}/${productData?.slug}`
                  }
                  sx={{ position: "absolute", top: "6px", right: "12px" }}
                >
                  مشاهده محصول
                </Button>
              )}
            </>
          </Tabs>
          <Divider sx={{ mb: 2 }} />
          {menu.map((item, index) => (
            <TabPanel value={value} index={index} key={item.title}>
              {item.name === "basic" ? (
                <>
                  {" "}
                  <BasicInfo
                    data={productData}
                    supplierData={supplierData}
                    refresh={() => setRefresh(!refresh)}
                  />{" "}
                </>
              ) : item.name === "productPublicAttribute" ? (
                <>
                  {" "}
                  <PublicAttributes
                    data={publicAttr || []}
                    refresh={() => setRefresh(!refresh)}
                  />
                </>
              ) : item.name === "productAttribute" ? (
                <>
                  {" "}
                  <SingleProductAttrs
                    data={atterbuites || []}
                    refresh={() => setRefresh(!refresh)}
                  />
                </>
              ) : item.name === "productProperties" ? (
                <>
                  {" "}
                  <Pricing
                    data={price || []}
                    atterbuiteData={atterbuites || []}
                    refresh={() => setRefresh(!refresh)}
                    images={productData?.images}
                  />
                </>
              ) : item.name === "crossCells" ? (
                <>
                  {" "}
                  <CrossSells
                    data={crossSell || []}
                    refresh={() => setRefresh(!refresh)}
                  />
                </>
              ) : item.name === "crossCellForce" ? (
                <>
                  <ForceSell
                    data={crossSellForce || []}
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

export default SingleProduct;
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
