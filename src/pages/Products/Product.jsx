/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { PageTitle } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import ProductForm from "./components/ProductForm";
import NoAccess from "../../components/noAccess";
import {
  baseUrl,
  SINGLE_PRODUCT,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const SingleProduct = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance(
        `${baseUrl}/${SINGLE_PRODUCT}/${id}`,
        configReq(token)
      );
      if (response.data?.data) {
        setProductData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!userPermissions?.product?.view) {
    return <NoAccess />;
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <PageTitle
        title={`ویرایش محصول: ${productData?.title || ""}`}
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
        <Paper sx={{ border: "1px solid #dbdfea", mb: 1 }} elevation={0}>
          <Box sx={{ p: 3 }}>
            <ProductForm
              mode="edit"
              productId={id}
              initialData={productData}
              onSuccess={fetchProductData}
              permissions={userPermissions}
            />
          </Box>
        </Paper>
      </div>
    </>
  );
};

export default SingleProduct;
