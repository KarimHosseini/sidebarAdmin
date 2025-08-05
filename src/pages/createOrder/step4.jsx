import { Radio } from "@mui/material";
import moment from "jalali-moment";
import { Fragment, useEffect, useState } from "react";

const OrderSend = ({
  setSelectedIndex,
  deliverTime,
  setDeliverTime,
  sendeddeliverTime,
  setSelectedDay,
  selectedDay,
  setDateType,
  selectedIndex,
}) => {
  const [dateSelect, setDate] = useState([]);

  useEffect(() => {
    var temp = [];
    if (!deliverTime) return;

    setDate(temp);
  }, [deliverTime]);
  useEffect(() => {
    if (!deliverTime) return;
    if (!selectedDay) {
      setSelectedDay(0);
    }
  }, [sendeddeliverTime, deliverTime, selectedIndex]);

  const areObjectsEqual = (obj1, obj2) => {
    if (!obj1 || !obj2) return false;
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  };
  /*   useEffect(() => {
    if (deliverTime && Array.isArray(deliverTime)) {
      deliverTime[selectedIndex];
      var counter = 0;
      const currentDate = new Date();
      for (var i = 0; i <= deliverTime[selectedIndex].length; i++) {
        if (deliverTime[selectedIndex][i]) {
          const fromDate = new Date(
            deliverTime[selectedIndex][i].shippingTimes?.fromDate
          );
          if (
            deliverTime[selectedIndex][i].shippingTimes.capacity !== 0 &&
            fromDate > currentDate
          ) {
            setDeliverTime(deliverTime[selectedIndex][i]);
            setDateType(i);
            break;
          } else {
            counter = counter + 1;
          }
        }
      }
      if (counter === deliverTime[selectedIndex].length) {
        setDeliverTime(null);
      }
    }
  }, [selectedIndex, deliverTime]); */
  const isDisabled = (item) => {
    const currentDate = new Date();
    const toDate = new Date(item.shippingTimes.toDate);

    return toDate < currentDate || item.shippingTimes.capacity === 0; // Returns true if fromDate has passed
  };
  return (
    <>
      <div className="md:flex hidden items-center justify-between gap-8 mt-6 px-3">
        <h1 className="font-semibold text-sm text-light-primary-text">
          زمان ارسال و تحویل
        </h1>
        <div className="w-[70%] h-[1px] bg-light-primary-line"></div>
      </div>
      <div className="bg-white rounded-[16px] p-4 border mt-4">
        <div className="mb-3 text-sm text-light-primary-text">
          انتخاب زمان تحویل
        </div>

        <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-3 items-center flex-wrap">
          {Array.isArray(deliverTime) &&
            deliverTime?.map((item, index) => (
              <div
                onClick={() => setSelectedIndex(index)}
                key={index}
                className={`flex cursor-pointer w-full text-xs gap-1 py-3 items-center px-3 rounded-[12px] transition-all duration-300 border ${
                  index !== selectedIndex
                    ? " text-light-primary-text"
                    : "border-light-info-status text-light-info-status  bg-blue-50"
                }`}
              >
                <Radio checked={index === selectedIndex} />
                <p className="text-xs">
                  {" "}
                  {moment(new Date(item[0].date), "YYYY-MM-DD HH:mm:ss")
                    .locale("fa")
                    .format("dddd")}
                </p>
                <p>
                  {" "}
                  {new Intl.DateTimeFormat("fa-IR", {
                    day: "numeric",
                  }).format(new Date(item[0].date))}
                </p>
                <p>
                  {" "}
                  {new Intl.DateTimeFormat("fa-IR", {
                    month: "short",
                  }).format(new Date(item[0].date))}
                </p>
              </div>
            ))}
        </div>

        <div className="mb-3 mt-6 text-sm text-light-primary-text">
          زمان تحویل به شما
        </div>
        {Array.isArray(deliverTime) &&
          deliverTime?.map((item, index) => (
            <Fragment key={index}>
              <TabPanel value={selectedIndex} index={index}>
                <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-3 items-center flex-wrap">
                  {item?.map((date, i) => (
                    <div
                      style={{
                        opacity: isDisabled(date) ? 0.5 : 1,

                        cursor: isDisabled(date) ? "unset" : "pointer",
                      }}
                      onClick={() => {
                        if (!isDisabled(date)) {
                          setDeliverTime(date);
                          setDateType(i);
                        }
                      }}
                      className={`flex cursor-pointer w-full text-xs gap-1 py-3 items-center px-3 rounded-[12px] transition-all duration-300 border ${
                        !areObjectsEqual(date, sendeddeliverTime)
                          ? " text-light-primary-text"
                          : "border-light-info-status text-light-info-status bg-blue-50"
                      }`}
                      key={date.date + index + i}
                    >
                      <Radio
                        checked={areObjectsEqual(date, sendeddeliverTime)}
                      />
                      <span>ساعت</span>
                      <div className="flex gap-1 items-center">
                        <span>
                          {new Date(date.shippingTimes.fromDate).getHours()}
                        </span>
                        <span>تا</span>
                        <span>
                          {new Date(date.shippingTimes.toDate).getHours()}
                        </span>
                        {date.shippingTimes.capacity === 0 && (
                          <span>تکمیل</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabPanel>
            </Fragment>
          ))}
      </div>
    </>
  );
};

export default OrderSend;
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      className="mt-3"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
          <>{children}</>
        </>
      )}
    </div>
  );
}
