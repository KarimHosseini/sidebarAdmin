/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Paper, Switch, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { NumberInput, PageTitle } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import NoAccess from "../../components/noAccess";
import { baseUrl, EDIT_SETTINGS, GET_SETTINGS } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const ImportSetting = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);

  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({ validImportPricePercent: 0 });

  useEffect(() => {
    setLoading(true);
    axiosInstance(`${baseUrl}/${GET_SETTINGS}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        setShipping(data.data);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  }, [token]);

  const handleSave = () => {
    setLoading(true);
    axiosInstance
      .put(`${baseUrl}/${EDIT_SETTINGS}`, { ...shipping }, configReq(token))
      .then((res) => {
        setLoading(false);
        toast.success("با موفقیت ویرایش شد");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading(false);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  
  if (!userPermissions?.importSetting?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "   تنظیمات",
            path: "/companyInfo",
          },
        ]}
        title=" تنظیمات  ورود قیمت از اکسل"
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        >
          {" "}
          <div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap text-xs items-center gap-5">
                  درصد قیمت :
                  <div className="smallNumberInput">
                    <NumberInput
                      value={shipping?.validImportPricePercent}
                      disabled={!userPermissions?.importSetting?.update}
                      change={(e) =>
                        setShipping({ ...shipping, validImportPricePercent: e })
                      }
                    />
                  </div>
                </div>
              </div>
              <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <Typography>غیر فعال سازی درصد تغییرات قیمت:</Typography>
                <Switch
                  onChange={() =>
                    setShipping({
                      ...shipping,
                      importPricePercentActive:
                        !shipping.importPricePercentActive,
                    })
                  }
                  disabled={!userPermissions?.importSetting?.update}
                  checked={shipping.importPricePercentActive}
                />
              </Box>
            </div>

            <div className="flex items-center justify-end mt-6">
              <Button
                size="large"
                disabled={!userPermissions?.importSetting?.update}
                onClick={handleSave}
                variant="contained"
                color="primary"
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                ثبت اطلاعات
              </Button>
            </div>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default ImportSetting;
