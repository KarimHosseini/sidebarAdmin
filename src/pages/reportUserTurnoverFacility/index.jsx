/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import CustomePage from "../../components/customePage";
import {
  EXPORT_USER_FACILITY_TURN_OVER,
  GET_USER_FACILITY_TURN_OVER,
} from "../../helpers/api-routes";

const ReportUserTurnoverFacility = () => {
  const [searchParams] = useSearchParams();
  const { userPermissions } = useSelector((state) => state.relationals);
  const { id } = useParams();

  // Define APIs for user facility turnover report operations
  const reportUserTurnoverFacilityApis = {
    GET_DATA: GET_USER_FACILITY_TURN_OVER,
    EXPORT_DATA: EXPORT_USER_FACILITY_TURN_OVER,
  };

  return (
    <CustomePage
      apis={reportUserTurnoverFacilityApis}
      title={`گزارش مالی تسهیلاتی ${searchParams.get("name") || ""}`}
      canAdd={false} // Read-only page
      canEdit={false} // Read-only page
      permissionsTag="ReportFacilityUserTurnover"
      customeModal={false} // No modals needed
      feilds={[]} // No form fields
      broadCrumb={[
        {
          title: "کاربران",
          path: "/users",
        },
      ]}
      extraButtons={
        <Link to="/users">
          <Button variant="outlined">بازگشت</Button>
        </Link>
      }
      extraParams={{ name: "userId", value: id }}
      showSync={false}
      showExport={true}
    />
  );
};

export default ReportUserTurnoverFacility;
