/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_SHIPPING_COMPANIES,
  EDIT_ACTIVE_SHIPPING_COMPANY,
  EXPORT_ALL_SHIPPING_COMPANIES,
} from "../../helpers/api-routes";

const ShippingComapanies = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  return (
    <>
      <CustomePage
        broadCrumb={[
          {
            title: "    ارسال کالا ",
            path: "/shippingSetting",
          },
        ]}
        title="شرکتهای حمل"
        apis={{
          GET_DATA: ALL_SHIPPING_COMPANIES,
          EXPORT_DATA: EXPORT_ALL_SHIPPING_COMPANIES,
          EDIT_ACTIVE_DATA: EDIT_ACTIVE_SHIPPING_COMPANY,
        }}
        canAdd={false}
        permissionsTag={"shippingCompany"}
        neededFields={["id", "title"]}
        extraActions={
          userPermissions?.shippingCompany?.update
            ? [
                userPermissions?.shippingCost?.view && {
                  title: "مشاهده",
                  handler: (
                    <>
                      <Button
                        variant="outlined"
                        onClick={(event) => {
                          const target =
                            event.currentTarget.closest("[data-id]") ||
                            event.currentTarget.parentElement;
                          const id = target.getAttribute("data-id");
                          const title = target.getAttribute("data-title");
                          window.open(
                            `/shipping-companies/${id}?title=${title}`
                          );
                        }}
                      >
                        مشاهده هزینه های ارسال
                      </Button>
                    </>
                  ),
                },
                userPermissions?.shippingPeriod?.view && {
                  title: "بازه ارسال",
                  handler: (
                    <>
                      <Button
                        variant="outlined"
                        disabled={!userPermissions?.shippingPeriod?.view}
                        onClick={(event) => {
                          const target =
                            event.currentTarget.closest("[data-id]") ||
                            event.currentTarget.parentElement;
                          const id = target.getAttribute("data-id");
                          const title = target.getAttribute("data-title");
                          window.open(
                            `/shipping-companies/period/${id}?name=${title}`
                          );
                        }}
                      >
                        مشاهده بازه زمانی
                      </Button>
                    </>
                  ),
                },
                userPermissions?.shippingCompanyHoliday?.view && {
                  title: "روز های تعطیلی",
                  handler: (
                    <>
                      <Button
                        variant="outlined"
                        disabled={
                          !userPermissions?.shippingCompanyHoliday?.view
                        }
                        onClick={(event) => {
                          const target =
                            event.currentTarget.closest("[data-id]") ||
                            event.currentTarget.parentElement;
                          const id = target.getAttribute("data-id");
                          const title = target.getAttribute("data-title");
                          window.open(
                            `/shippingCompanyHoliday/${id}?name=${title}`
                          );
                        }}
                      >
                        مشاهده روز های تعطیلی فعال
                      </Button>
                    </>
                  ),
                },
                {
                  title: "ویرایش",
                  handler: (
                    <>
                      <IconButton
                        onClick={(event) => {
                          const target =
                            event.currentTarget.closest("[data-id]") ||
                            event.currentTarget.parentElement;
                          const id = target.getAttribute("data-id");
                          window.open(`/shipping-companies-items/${id}`);
                        }}
                      >
                        <Edit sx={{ color: "#ff2000" }} />
                      </IconButton>
                    </>
                  ),
                },
              ].filter((it) => it)
            : false
        }
      />{" "}
    </>
  );
};

export default ShippingComapanies;
