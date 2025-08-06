import { Box, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../components/common";
import ProductForm from "./components/ProductForm";
import NoAccess from "../../components/noAccess";

const CreateProduct = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const navigate = useNavigate();

  const handleSuccess = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (!userPermissions?.product?.insert) {
    return <NoAccess />;
  }

  return (
    <>
      <PageTitle title="ایجاد محصول جدید" />
      <div className="md:mx-3 mx-1">
        <Paper sx={{ border: "1px solid #dbdfea", mb: 1 }} elevation={0}>
          <Box sx={{ p: 3 }}>
            <ProductForm
              mode="create"
              onSuccess={handleSuccess}
              permissions={userPermissions}
            />
          </Box>
        </Paper>
      </div>
    </>
  );
};

export default CreateProduct;
