import { Paper } from "@mui/material";
import React from "react";
import { Dropdown, NumberInput } from "../../../common";

const Contents = ({
  data,
  setData,
  triger,
  ALL_FILTER,
  editMode,
  CATEGORY_VIEW,
  BRAND_VIEW,
  PRODUCT_VIEW,
  CONTENT_VIEW2,
  CONTENT_VIEW,
  GRID_TYPE,
}) => {
  return (
    <Paper
      sx={{
        border: "1px solid #dbdfea",
        mb: 1,
        padding: "25px 16px 15px 16px",
        zIndex: triger[2] ? 1 : -1,
        transform: triger[2] ? "translateX(0)" : "translateX(100%)",
        transition: "all 400ms ease",
      }}
      elevation={0}
      className="md:col-span-4 relative"
    >
      <div className="bg-[#198DFF] text-white flex justify-center items-center px-4 py-2 absolute -top-5 right-3 text-sm">
        انتخاب نوع محتوا و مدل نمایشی
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {ALL_FILTER && (
          <Dropdown
            value={data?.filter}
            change={(e) => setData({ ...data, filter: e, viewType: null })}
            data={ALL_FILTER || []}
            title=" نوع محتوا"
            disabled={editMode}
          />
        )}
        {data?.filter?.id !== "5" && data?.filter?.id !== "8" && (
          <Dropdown
            disabled={editMode}
            value={
              data?.filter?.id === "0" ||
              data?.filter?.id === "6" ||
              data?.filter?.id === "7"
                ? CATEGORY_VIEW.find((item) => item?.id === data?.viewType?.id)
                : data?.filter?.id === "1"
                ? BRAND_VIEW.find((item) => item?.id === data?.viewType?.id)
                : data?.filter?.id === "2"
                ? PRODUCT_VIEW.find((item) => item?.id === data?.viewType?.id)
                : data?.filter?.id === "4"
                ? CONTENT_VIEW2.find((item) => item?.id === data?.viewType?.id)
                : CONTENT_VIEW.find((item) => item?.id === data?.viewType?.id)
            }
            change={(e) => setData({ ...data, viewType: e })}
            data={
              data?.filter?.id === "0" ||
              data?.filter?.id === "6" ||
              data?.filter?.id === "7"
                ? CATEGORY_VIEW
                : data?.filter?.id === "1"
                ? BRAND_VIEW
                : data?.filter?.id === "2"
                ? PRODUCT_VIEW
                : data?.filter?.id === "4"
                ? CONTENT_VIEW2
                : CONTENT_VIEW
            }
            title=" مدل نمایش"
          />
        )}
        {(data?.viewType?.id === 11 || data?.viewType?.id === 31) && (
          <Dropdown
            value={GRID_TYPE.find((item) => item?.id === data?.gridType?.id)}
            change={(e) => setData({ ...data, gridType: e })}
            data={GRID_TYPE}
            title="  نوع گرید"
          />
        )}
        {data?.viewType?.id === 57 && (
          <>
            <NumberInput
              label="  تعداد  استوری		"
              change={(e) => setData({ ...data, storyLength: e })}
              value={data?.storyLength}
              disabled={editMode}
            />
          </>
        )}
      </div>
    </Paper>
  );
};

export default Contents;
