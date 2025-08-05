import { Switch } from "@mui/material";
import React from "react";
import { TextInput } from "../../components/common";

const SyncSetting = ({ data, setData }) => {
  const handleChange = (name, e) => {
    setData({
      ...data,

      syncProductSetting: {
        ...data.syncProductSetting,
        [name]: e,
      },
    });
  };
  const currentValue = (name) => {
    return data?.syncProductSetting && data?.syncProductSetting[name];
  };
  return (
    <div className="grid md:grid-cols-4 flex-wrap items-center gap-5">
      <div className="flex items-center gap-3">
        <span className="text-sm"> فعال و غیرفعال سینک اتوماتیک : ‌ </span>
        <Switch
          onClick={() => handleChange("active", !currentValue("active"))}
          checked={currentValue("active")}
        />
      </div>

      <TextInput
        label="فاصله زمان سینک ها باهم"
        currentValue={currentValue("durationInMinutes") || ""}
        change={(e) => handleChange("durationInMinutes", e)}
        number
        priceLabel="دقیقه"
        price
      />
      <div className="flex  items-center gap-3">
        <span className="text-sm"> فعال و غیرفعال سینک تعداد : ‌ </span>
        <Switch
          onClick={() => handleChange("qtySync", !currentValue("qtySync"))}
          checked={currentValue("qtySync")}
        />
      </div>
      <TextInput
        label="درصد افزایش"
        currentValue={currentValue("increasePercent")|| ""}
        change={(e) => handleChange("increasePercent", e)}
        number
        priceLabel="%"
        price
      />
    </div>
  );
};

export default SyncSetting;
