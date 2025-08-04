import { Checkbox, Paper } from "@mui/material";
import React from "react";
import { Dropdown, TextInput } from "../../../common";
import ColorModal from "../../../common/colorModal";

const Title = ({ data, setData ,triger , TITLE_POSITION}) => {
  return (
    <Paper
      sx={{
        border: "1px solid #dbdfea",
        mb: 1,
        padding: "25px 16px 15px 16px",
        zIndex: triger[1] ? 1 : -1,
        transform: triger[1] ? "translateX(0)" : "translateX(200%)",
        transition: "all 400ms ease",
      }}
      elevation={0}
      className="md:col-span-4 relative"
    >
      <div className="bg-[#198DFF] text-white flex justify-center items-center px-4 py-2 absolute -top-5 right-3 text-sm">
        تنظیمات عنوان
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <TextInput
            label="عنوان ویترین"
            change={(e) => setData({ ...data, title: e })}
            currentValue={data?.title}
          />
        </div>
        <div className="flex items-center">
          <span className="text-xs">نمایش عنوان :</span>{" "}
          <Checkbox
            checked={data?.showTitle}
            onClick={() =>
              setData({ ...data, showTitle: !data?.showTitle })
            } /* checked={item.active} */
          />
        </div>
        <Dropdown
          value={TITLE_POSITION.find(
            (item) => item?.id === data?.titlePosition?.id
          )}
          change={(e) => setData({ ...data, titlePosition: e })}
          data={TITLE_POSITION}
          title="موقعیت عنوان"
        />
        <div className="flex items-center">
          <span className="text-xs"> جدا کننده عنوان :</span>{" "}
          <Checkbox
            checked={data?.headerDivider}
            onClick={() =>
              setData({ ...data, headerDivider: !data?.headerDivider })
            } /* checked={item.active} */
          />
        </div>
        <ColorModal
          label="رنگ عنوان"
          color={data?.titleColor || "#000"}
          setColor={(e) => setData({ ...data, titleColor: e })}
        />
      </div>
    </Paper>
  );
};

export default Title;
