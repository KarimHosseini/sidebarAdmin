import { Paper } from "@mui/material";
import { Box } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import dayjs from "dayjs";
import { Calendar } from "react-datepicker2";
import momentJalaali from "moment-jalaali";
import { toIsoString, toIsoString3 } from "../../../helpers/functions";
import ColorModal from "../../common/colorModal";

const Counter = ({ data, setData }) => {
  const getDate = (currentDate) => {
    if (!currentDate) return;
    let string = new Date(currentDate).toLocaleDateString("en-US-u-ca-persian");

    string =
      string.split("/")[2] +
      "/" +
      string.split("/")[0] +
      "/" +
      string.split("/")[1] +
      ` ${String(new Date(currentDate).getHours()).padStart(2, "0")}:${String(
        new Date(currentDate).getMinutes()
      ).padStart(2, "0")}`;
    return momentJalaali(string, "jYYYY/jM/jD HH:mm");
  };
  return (
    <Paper
      sx={{
        border: "1px solid #dbdfea",
        mb: 1,
        padding: "25px 16px 15px 16px",
      }}
      elevation={0}
      className="mt-4"
    >
      <div className="lg:grid lg:grid-cols-2 flex flex-col">
        <div className="ml-2 pl-2 border-dashed  gap-3">
          <div className="w-full mb-3">
            <span className="text-sm font-semibold">تاریخ پایان</span>
          </div>
          <Box
            sx={{
              ".calendarContainer": {
                boxShadow: "none !important",
              },
            }}
            className="flex flex-wrap lg:flex-nowrap"
          >
            <Calendar
              value={getDate(data?.endDate)}
              isGregorian={false}
              min={momentJalaali().add(-1, "days")}
              onChange={(value) => {
         
                setData({ ...data, endDate: toIsoString(value._d) });
              }}
            />{" "}
            <Box sx={style}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoItem label="">
                  <StaticTimePicker
                    localeText={{ toolbarTitle: "انتخاب ساعت" }}
                    defaultValue={dayjs("2022-04-00T00:00")}
                    value={dayjs(data?.endDate)}
                    ampm={false}
                    ampmInClock={true}
                    onChange={(e) => {
                    
                      setData({
                        ...data,
                        endDate: toIsoString3(
                          data?.endDate ? new Date(data?.endDate) : new Date(),
                          e ? e.$H.toString().padStart(2, 0) : "00",
                          e ? e.$m.toString().padStart(2, 0) : "00"
                        ),
                      });
                    }}
                  />
                </DemoItem>
              </LocalizationProvider>
            </Box>{" "}
          </Box>
        </div>
        <div className="flex flex-col gap-3 lg:border-r mr-6 pr-6 border-dashed">
          <div className="flex items-end gap-2">
            <ColorModal
              label=" رنگ لیبل ها"
              color={data?.labelColor || "#fff"}
              setColor={(e) => setData({ ...data, labelColor: e })}
            />{" "}
            <ColorModal
              label=" رنگ پس زمینه لیبل ها"
              color={data?.labelBackGround || "#000"}
              setColor={(e) => setData({ ...data, labelBackGround: e })}
            />
          </div>
          <div className="flex items-end gap-2">
            <ColorModal
              label=" رنگ مقادیر"
              color={data?.valueColor || "#fff"}
              setColor={(e) => setData({ ...data, valueColor: e })}
            />{" "}
            <ColorModal
              label=" رنگ پس زمینه مقادیر "
              color={data?.valueBackground || "#000"}
              setColor={(e) => setData({ ...data, valueBackground: e })}
            />
          </div>
          <ColorModal
            label=" رنگ بوردر"
            color={data?.borderCounterColor || "#000"}
            setColor={(e) => setData({ ...data, borderCounterColor: e })}
          />
        </div>
      </div>
    </Paper>
  );
};

export default Counter;
const style = {
  ".MuiPickersToolbar-root ": {
    display: "flex !important",
    flexDirection: "row !important",
    alignItems: "flex-end",
    gap: "10px !important",
  },
  ".MuiTimePickerToolbar-hourMinuteLabel": {
    flexDirection: "row-reverse !important",
    fontSize: "13px !important",
  },
  ".MuiTimePickerToolbar-hourMinuteLabel .MuiTypography-root ": {
    fontSize: "15px !important",
  },
  ".MuiPickersArrowSwitcher-root": {
    flexDirection: "row-reverse !important",
    right: "44% !important",
    transform: "translateX(-50%)",
  },
  ".MuiPickersArrowSwitcher-root svg": {
    width: "1.5rem !important",
    height: "1.5rem !important",
  },
  ".MuiDialogActions-root ": {
    display: "none !important",
  },
  ".MuiClock-root": {
    margin: "50px 0px 10px 0px !important",
    justifyContent: "start !important",
    width: "fit-content !important",
  },
  ".MuiTimeClock-root": {
    width: "fit-content !important",
  },
  ".MuiPickersLayout-root ": {
    minWidth: "auto !important",
  },
};
