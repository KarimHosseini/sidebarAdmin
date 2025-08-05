import { Button, CircularProgress, Paper, Skeleton } from "@mui/material";
import momentJalaali from "moment-jalaali";
import React, { useEffect, useState } from "react";
import { Calendar } from "react-datepicker2";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  EDIT_PLAN_LOAN,
  MEETING_PLAN_LOAN,
  SMS_PLAN_LOAN,
} from "../../../../helpers/api-routes";
import { configReq, toIsoString } from "../../../../helpers/functions";
import Revoke from "../revoke";
import NoAccess from "../../../../components/noAccess";

const Step5 = ({ data, setData, disabled }) => {
  const [startTime, setstartTime] = useState();
  const [valueStatDate, setValueStatDate] = useState(0);
  const { token } = useSelector((state) => state.user);
  const [min, setMin] = useState(momentJalaali().add(-1, "days"));
  const [max, setMax] = useState(momentJalaali().add(-1, "days"));
  const [allTime, setAllTimes] = useState([]);
  const [rengeTime, setRengeTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [num, setNum] = useState(0);
  useEffect(() => {
    setLoading(true);
    var meetDate = data?.meetDateTime;
    axiosInstance
      .get(`${baseUrl}/${MEETING_PLAN_LOAN}`, configReq(token))
      .then((res) => {
        const { data } = res;
        setLoading(false);
        setAllTimes(data?.data);
        if (data?.data?.length > 0) {
          let string = new Date(data?.data[0]?.dateTime).toLocaleDateString(
            "en-US-u-ca-persian"
          );
          string =
            string.split("/")[2] +
            "/" +
            string.split("/")[0] +
            "/" +
            string.split("/")[1];
          setMin(momentJalaali(string, "jYYYY/jM/jD"));
          let string2 = new Date(
            data?.data[data?.data.length - 1]?.dateTime
          ).toLocaleDateString("en-US-u-ca-persian");
          string2 =
            string2.split("/")[2] +
            "/" +
            string2.split("/")[0] +
            "/" +
            string2.split("/")[1];
          setMax(momentJalaali(string2, "jYYYY/jM/jD"));
        }
        var temp = [];
        data?.data?.map((item) => {
          if (item?.holiday) {
            temp.push({
              color: "red",
              start: momentJalaali(
                reFormatDate(new Date(item?.dateTime)),
                "jYYYY/jM/jD"
              ).add(1, "days"),
              end: momentJalaali(
                reFormatDate(new Date(item?.dateTime)),
                "jYYYY/jM/jD"
              ),
              disabled: true,
            });
          } else if (item?.capacity === 0) {
            temp.push({
              color: "red",
              start: momentJalaali(
                reFormatDate(new Date(item?.dateTime)),
                "jYYYY/jM/jD"
              ).add(1, "days"),
              end: momentJalaali(
                reFormatDate(new Date(item?.dateTime)),
                "jYYYY/jM/jD"
              ),
              disabled: true,
            });
          }

          if (meetDate === item?.dateTime) {
            setNum(item?.capacity);
          }
        });
        setRengeTimes(temp);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading(false);
      });

    if (data?.meetDateTime) {
      setstartTime(
        momentJalaali(
          reFormatDate(new Date(data?.meetDateTime)),
          "jYYYY/jM/jD"
        ) /* .add(1, "days") */
      );
      setValueStatDate(new Date(data?.meetDateTime).toLocaleDateString("fa"));
    }
  }, []);
  const handleSave = () => {
    var d = { ...data };
    var plan = d.plan;
    delete d.plan;
    delete d.branchs;
    delete d.updateHistory;
    delete d.updatesHistory;
    delete d.user;
    delete d.updatedBy;
    delete d.knowType;
    delete d.createdBy;
    delete d.createdByName;
    delete d.updatedByName;
    delete d.revokeDesc;
    delete d.StepComment;
    setLoading2(true);
    axiosInstance
      .put(
        `${baseUrl}/${EDIT_PLAN_LOAN}`,
        {
          ...d,
          step: 4,
          meetDateTime: toIsoString(new Date(startTime._d)),
        },
        configReq(token)
      )
      .then((res) => {
        const { data } = res;
        setLoading2(false);
        setData({
          ...d,
          plan: plan,
          step: 4,
          meetDateTime: toIsoString(new Date(startTime._d)),
        });
        toast.success("با موفقیت ثبت شد");
      })
      .catch((err) => {
        setLoading2(false);
        toast.error(err.response?.data?.message);
      });
  };

  const handleSms = (number) => {
    axiosInstance
      .post(
        `${baseUrl}/${SMS_PLAN_LOAN}?target=${number}`,
        {
          id: data?.id,
        },
        configReq(token)
      )
      .then((res) => {
        const { data } = res;
        toast.success("با موفقیت ارسال شد");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);

        /*  setLoading(false); */
      });
  };
  const reFormatDate = (dates) => {
    let string2 = new Date(dates).toLocaleDateString("en-US-u-ca-persian");
    string2 =
      string2.split("/")[2] +
      "/" +
      string2.split("/")[0] +
      "/" +
      string2.split("/")[1];
    return string2;
  };
  const { userPermissions } = useSelector((state) => state.relationals);
  if (!userPermissions?.planLoanRequest?.step4) {
    return <NoAccess noTitle={false} />;
  }
  return (
    <div className="w-full meetDate">
      <h3 className="font-bold text-xl"> تعیین نوبت مراجعه به باجه</h3>{" "}
      <div className="flex md:grid grid-cols-3 w-full justify-between flex-wrap items-end">
        <Paper
          elevation={0}
          sx={{
            ".calendarContainer": {
              margin: "0px !important",
              boxShadow: "none !important",
              width: { md: "370px  !important", xs: "100%  !important" },
            },
          }}
          className="rounded-lg re  border-[#dbdfea] border w-fit col-span-2 py-6 md:px-5 px-2 flex flex-col gap-6 mt-2 "
        >
          <div className="flex justify-between">
            <span className="text-sm text-blue-600 ">انتخاب زمان </span>
            <span className="text-sm text-green-600 font-bold">
              زمان انتخاب شده : {valueStatDate}
            </span>
          </div>{" "}
          {loading ? (
            <Skeleton width={400} height={400} />
          ) : (
            <Calendar
              value={startTime}
              isGregorian={false}
              min={min}
              max={max}
              ranges={rengeTime}
              onChange={(value) => {
                setstartTime(value);
                setValueStatDate(value._d.toLocaleDateString("fa"));
                setNum(
                  allTime?.find(
                    (item) => item?.dateTime === toIsoString(new Date(value._d))
                  )?.capacity
                );
              }}
            />
          )}
          <div className="flex justify-center items-center gap-2">
            {" "}
            <span className="text-xs font-bold"> ظرفیت آزاد</span>
            <span className="text-xs font-bold">: {num} نفر</span>
          </div>
        </Paper>
        <div className="flex flex-col justify-between gap-3 pb-7 mt-7 md:mt-0  w-full h-full ">
          <div className="md:w-[200px] w-full mr-auto ">
            {" "}
            <Revoke data={data} setData={setData} />
          </div>
          <div className="flex flex-col items-end justify-end gap-3  ">
            {" "}
            <Button
              sx={{
                width: { md: "200px" },
                margin: { xs: "auto", md: "unset" },
              }}
              variant="contained"
              color="primary"
              onClick={handleSave}
              fullWidth
              disabled={!num || loading2 || disabled}
            >
              {loading2 ? <CircularProgress /> : <> ثبت اطلاعات</>}
            </Button>
            <Button
              disabled={!data?.meetDateTime || disabled}
              onClick={() => handleSms(20)}
              sx={{
                width: { md: "200px" },
                margin: { xs: "auto", md: "unset" },
              }}
              variant="contained"
              color="success"
              fullWidth
            >
              ارسال پیامک و ایمیل نوبت مراجعه به باجه
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5;
