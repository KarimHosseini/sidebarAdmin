/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import CustomePage from "../../components/customePage";
import {
  ALL_USERS,
  EDIT_ACTIVE_USER,
  EXPORT_ALL_USERS,
} from "../../helpers/api-routes";

const Users = () => {
  const { userPermissions } = useSelector((state) => state.relationals);

  return (
    <>
      <CustomePage
        broadCrumb={[
          {
            title: "  کاربران و نقش ها",
            path: "/users",
          },
        ]}
        createOrEditPageUsingOtherPage={true}
        title="کاربران"
        apis={{
          GET_DATA: ALL_USERS,
          EXPORT_DATA: EXPORT_ALL_USERS,
          EDIT_ACTIVE_DATA: EDIT_ACTIVE_USER,
        }}
        canAdd={true}
        addLink={"/createUser"}
        permissionsTag={"user"}
        neededFields={["id", "fname", "lname"]}
        extraActions={[
          userPermissions?.ReportUserTurnover?.view && {
            title: "گزارش مالی",
            handler: (
              <>
                <Button
                  onClick={(event) => {
                    const target =
                      event.currentTarget.closest("[data-id]") ||
                      event.currentTarget.parentElement;
                    const id = target.getAttribute("data-id");
                    const fname = target.getAttribute("data-fname");
                    const lname = target.getAttribute("data-lname");
                    window.open(
                      `/reportUserTurnover/${id}?name=${fname} ${lname}`,
                      "_blank"
                    );
                  }}
                >
                  مشاهده
                </Button>
              </>
            ),
          },
          userPermissions?.ReportFacilityUserTurnover?.view && {
            title: "گزارش مالی تسهیلاتی",
            handler: (
              <>
                <Button
                  onClick={(event) => {
                    const target =
                      event.currentTarget.closest("[data-id]") ||
                      event.currentTarget.parentElement;
                    const id = target.getAttribute("data-id");
                    const fname = target.getAttribute("data-fname");
                    const lname = target.getAttribute("data-lname");
                    window.open(
                      `/reportUserTurnoverFacility/${id}?name=${fname} ${lname}`,
                      "_blank"
                    );
                  }}
                  disabled={!userPermissions?.ReportFacilityUserTurnover?.view}
                  color="secondary"
                  size="small"
                >
                  مشاهده
                </Button>
              </>
            ),
          },
          userPermissions?.user?.update && {
            title: "ویرایش",
            handler: (
              <>
                <IconButton
                  onClick={(event) => {
                    const target =
                      event.currentTarget.closest("[data-id]") ||
                      event.currentTarget.parentElement;
                    const id = target.getAttribute("data-id");
                    const fname = target.getAttribute("data-fname");
                    const lname = target.getAttribute("data-lname");
                    window.open(
                      `/users/${id}?name=${fname} ${lname}`,
                      "_blank"
                    );
                  }}
                  disabled={!userPermissions?.user?.update}
                >
                  <Edit sx={{ color: "#ff2000" }} />
                </IconButton>
              </>
            ),
          },
        ].filter((it) => it)}
      />{" "}
    </>
  );
};

export default Users;
