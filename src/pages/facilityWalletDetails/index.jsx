/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import CustomePage from "../../components/customePage";
import {
  All_FACILITY_WALLET_DETAILS,
  ExportWalletByFacilityId,
} from "../../helpers/api-routes";

const FacilityWalletDetails = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const facilityTitle = searchParams.get("title");

  // Define APIs for read-only operations with URL parameter
  const facilityWalletDetailsApis = {
    GET_DATA: All_FACILITY_WALLET_DETAILS,
    EXPORT_DATA: ExportWalletByFacilityId,
    // Pass the facilityId as a parameter
    initialFilter: [
      {
        name: "facilityId",
        value: id,
      }
    ]
  };

  return (
    <CustomePage
      apis={facilityWalletDetailsApis}
      title={`کیف پول تسهیلاتی ${facilityTitle}`}
      canAdd={false}
      canEdit={false}
      permissionsTag="facilityWallet"
      customeModal={false}
      feilds={[]} // No form fields for this page
      broadCrumb={[
        {
          title: "کیف پول تسهیلاتی",
          path: "/facilityWallet",
        },
      ]}
      showSync={true}
      showExport={true}
      extraDetails={{
        extraParams: { name: "facilityId", value: id }
      }}
    />
  );
};

export default FacilityWalletDetails;
