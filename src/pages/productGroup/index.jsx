/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomePage from "../../components/customePage";
import { GET_BUNDLE_PRODUCT, EXPORT_BUNDLE_PRODUCT, EDIT_ACTIVE_BUNDLE_PRODUCT } from "../../helpers/api-routes";

const Products = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const navigate = useNavigate();

  return (
    <>
      <CustomePage
        broadCrumb={[
          {
            title: "مدیریت محصولات",
            path: "/products",
          },
        ]}
        title="   محصولات تجمیعی"
        apis={{
          GET_DATA: GET_BUNDLE_PRODUCT,
          EXPORT_DATA: EXPORT_BUNDLE_PRODUCT,
          EDIT_ACTIVE_DATA:EDIT_ACTIVE_BUNDLE_PRODUCT
        }}
        canAdd={false}
        permissionsTag={"bundle"}
        neededFields={["id", "isBundle", "slug"]}
        extraButtons={
          <>
            {userPermissions?.bundle?.insert && (
              <Button
                onClick={() => navigate("/groupProduct/create")}
                variant="contained"
              >
                <AddIcon />
                افزودن محصول تجمیعی جدید
              </Button>
            )}
          </>
        }
        extraActions={
          userPermissions?.product?.update || userPermissions?.seoAssign?.view
            ? [
                {
                  title: "",
                  handler: (
                    <>
                      <IconButton
                        onClick={(event) => {
                          const target =
                            event.currentTarget.closest("[data-id]") ||
                            event.currentTarget.parentElement;
                          const id = target.getAttribute("data-id");
                          const isBundle = target.getAttribute("data-isBundle");
                          if (isBundle === "true") {
                            toast.error(
                              "    اجازه ویرایش این محصول را در این بخش ندارید "
                            );
                          } else {
                            window.open(`/groupProduct/${id}`, "_blank");
                          }
                        }}
                      >
                        <Edit sx={{ color: "#ff2000" }} />
                      </IconButton>
                    </>
                  ),
                },
                {
                  title: "ویرایش",
                  handler: (
                    <>
                      <Button
                        onClick={(event) => {
                          const target =
                            event.currentTarget.closest("[data-id]") ||
                            event.currentTarget.parentElement;
                          const id = target.getAttribute("data-id");
                          const slug = target.getAttribute("data-slug");

                          window.open(
                            `/seoGenrator?id=${id}&name=product&slug=${slug}`
                          );
                        }}
                        variant="outlined"
                      >
                        ویرایش seo
                      </Button>
                    </>
                  ),
                },
              ]
            : []
        }
      />{" "}
    </>
  );
};

export default Products;
