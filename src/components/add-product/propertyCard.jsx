import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Button, IconButton, Switch, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Box } from "@mui/system";
import { baseUrl, DOWNLOAD_FILE } from "../../helpers/api-routes";
const PropertyCard = ({ product, handleChange, unselect }) => {
  return (
    <Card
      sx={{
        display: "flex",
        border: "1px solid green",
        maxWidth: "400px",
        height: 120,
        position: "relative",
      }}
    >
      {product?.crossProductGalleryId ||
      product?.image ||
      product?.galleryId ? (
        <CardMedia
          component="img"
          sx={{ width: 100 }}
          src={`${baseUrl}/${DOWNLOAD_FILE}/${
            product?.crossProductGalleryId ||
            product?.image ||
            product?.galleryId
          }?size=tiny`}
          alt=""
        />
      ) : (
        <CardMedia
          component="img"
          sx={{ width: 80 }}
          src={"/images/no_image.svg"}
          alt=""
          className=" opacity-40"
        />
      )}

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography
            sx={{ fontSize: "0.8rem" }}
            component="div"
            variant="body2"
          >
            {product?.crossProduct || product?.title}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
            sx={{ fontSize: { md: "0.7rem" } }}
          >
            {product?.code}
          </Typography>{" "}
          <div className="flex w-full items-center justify-between">
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{ fontSize: { md: "0.7rem" } }}
            >
              آیدی ویژگی: {product?.id}
            </Typography>
            <Button
              size="small"
              color="primary"
              href={`${process.env.REACT_APP_DOMAIN_URL}/products/${
                product?.id
              }/${product?.slug ? product.slug : ""}`}
              target="_blank"
              rel="noreferrer"
            >
              مشاهده
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={product.activeSellIfZero}
              onChange={handleChange}
            />
            <Typography
              sx={{ fontSize: "0.8rem", fontWeight: "bold" }}
              component="div"
              variant="body2"
            >
              فروش محصول در صورت نا موجود شدن کالا
            </Typography>
          </div>
        </CardContent>
      </Box>
      <div className="absolute top-0 left-0">
        <IconButton onClick={unselect}>
          <HighlightOffIcon color="error" />
        </IconButton>
      </div>
    </Card>
  );
};

export default PropertyCard;
