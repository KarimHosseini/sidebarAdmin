import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import axiosInstance from "./dataFetch/axiosInstance";
import { CREATE_SYNCGET_SINGLE_SYNC, baseUrl } from "../helpers/api-routes";
import { configReq } from "../helpers/functions";
import { toast } from "react-toastify";


const SyncButton = ({ setting, setRefresh }) => {
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);

  const handleSync = () => {
    axiosInstance
      .post(
        `${baseUrl}/${CREATE_SYNCGET_SINGLE_SYNC}`,
        { tablename: setting?.Sync },
        configReq(token)
      )
      .then((res) => {
        toast.success("با موفقیت سینک شد");
        setRefresh(r => r + 1)
      })
      .catch((err) => {

        toast.error(err.response?.data?.message);
      })
  }
  if (!userPermissions?.Sync?.update || !setting?.Sync) {
    return <></>;
  }
  return (
    <>
      <Button variant="outlined" onClick={handleSync} color="success">سینک  آرپا</Button>

    </>
  );
};

export default SyncButton;
