/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, CircularProgress, Paper, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { NumberInput, PageTitle, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import NoAccess from "../../components/noAccess";
import {
  baseUrl,
  EDIT_PLAN_LOAN_SETTING,
  GET_PLAN_LOAN_SETTING,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
const PlanLoadSetting = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const { token } = useSelector((state) => state.user);
  useEffect(() => {
    axiosInstance(`${baseUrl}/${GET_PLAN_LOAN_SETTING}`, configReq(token))
      .then((res) => {
        setLoading(false);
        setData(res.data.data || {});
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  }, []);
  const submitData = () => {
    setLoading(true);
    axiosInstance
      .put(`${baseUrl}/${EDIT_PLAN_LOAN_SETTING}`, data, configReq(token))
      .then((res) => {
        setLoading(false);
        toast.success("با موفقیت ویرایش شد");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };
  if (!userPermissions?.planLoanSetting?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "  تسهیلات",
            path: "/facilites",
          },
        ]}
        title=" تنظیمات طرح"
      />
      <div className="md:mx-3 mx-1">
        <Paper
          elevation={0}
          className="rounded-lg re  border-[#dbdfea] border w-full py-6 md:px-5 px-2 flex flex-col gap-6 mt-2 mb-10"
        >
          {" "}
          <div className="grid md:grid-cols-4 gap-5">
            <TextInput
              disabled={!userPermissions?.planLoanSetting?.update}
              price={true}
              number={true}
              label=" هزینه پوشه مدارک  "
              currentValue={data?.documentPrice || ""}
              change={(e) => setData({ ...data, documentPrice: e })}
            />
            <TextInput
              disabled={!userPermissions?.planLoanSetting?.update}
              price={true}
              number={true}
              label=" هزینه اعتبار سنجی  "
              currentValue={data.validationPrice || ""}
              change={(e) => setData({ ...data, validationPrice: e })}
            />
            <NumberInput
              disabled={!userPermissions?.planLoanSetting?.update}
              label="گنجایش روزانه"
              value={data.meetCapacity || ""}
              change={(e) => setData({ ...data, meetCapacity: e })}
            />{" "}
            <NumberInput
              disabled={!userPermissions?.planLoanSetting?.update}
              label=" تعداد روز های قابل رزرو "
              value={data.meetDays || ""}
              change={(e) => setData({ ...data, meetDays: e })}
            />{" "}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                rowGap: 1,
                columnGap: 1,
              }}
            >
              <span className="text-sm "> برسی در روز های تعطیلی عمومی: </span>
              <Switch
                disabled={!userPermissions?.planLoanSetting?.update}
                checked={data?.holidayMeet}
                onChange={(e) =>
                  setData({ ...data, holidayMeet: !data?.holidayMeet })
                }
              />
            </Box>{" "}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                rowGap: 1,
                columnGap: 1,
              }}
            >
              <span className="text-sm "> برسی در روز جمعه: </span>
              <Switch
                disabled={!userPermissions?.planLoanSetting?.update}
                checked={data?.fridayMeet}
                onChange={(e) =>
                  setData({ ...data, fridayMeet: !data?.fridayMeet })
                }
              />
            </Box>
            {userPermissions?.planLoanSetting?.update && (
              <Box
                className="col-span-2 justify-end"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitData}
                  disabled={loading}
                  sx={{ width: { xs: "50%", md: "auto" } }}
                >
                  {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
                </Button>{" "}
              </Box>
            )}
          </div>
        </Paper>
      </div>
    </>
  );
};

export default PlanLoadSetting;
