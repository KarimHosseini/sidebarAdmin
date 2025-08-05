/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import CustomePage from "../../components/customePage";
import { GetFacilityUserWalletLockHistories } from "../../helpers/api-routes";

const FacilityUserWalletLockHistories = () => {
  const { id } = useParams();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [searchParams] = useSearchParams();

  // Define APIs for read-only operations
  const facilityHistoryApis = {
    GET_DATA: GetFacilityUserWalletLockHistories,
    // No EXPORT_DATA, CREATE_DATA, EDIT_DATA, DELETE_DATA - this is read-only
  };

  return (
    <CustomePage
      apis={facilityHistoryApis}
      title={`تاریخچه قفل کیف پول تسهیلاتی ${searchParams.get("name") || ""}`}
      canAdd={false}
      canEdit={false}
      permissionsTag="reportfacilitywalletballance"
      customeModal={false}
      feilds={[]} // No form fields for read-only page
      broadCrumb={[
        {
          title: "گزارشات",
          path: "/reports",
        },
      ]}
      defaultFilter={[
        {
          name: "userId",
          value: id,
        }
      ]}
      extraActions={[]}
      showSync={false}
      showExport={false}
    />
  );
};

export default FacilityUserWalletLockHistories;
