/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import CustomePage from "../../components/customePage";
import { All_WALLET, EXPORT_All_WALLET } from "../../helpers/api-routes";

const Wallets = () => {
  const walletApis = {
    GET_DATA: All_WALLET,
    EXPORT_DATA: EXPORT_All_WALLET,
  };

  return (
    <CustomePage
      apis={walletApis}
      title=" گزارش کیف پول سایت"
      canAdd={false}
      canEdit={false}
      permissionsTag="wallet"
      customeModal={false}
      feilds={[]}
      broadCrumb={[
        {
          title: " کیف پول سایت",
          path: "/wallet",
        },
      ]}
      extraActions={[]}
      showSync={true}
      showExport={true}
    />
  );
};

export default Wallets;
