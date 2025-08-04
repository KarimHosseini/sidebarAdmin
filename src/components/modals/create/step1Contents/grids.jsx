import { Box, Paper } from "@mui/material";
import React from "react";
import { NumberInput } from "../../../common";

const Grids = ({ data, setData }) => {
  return (
    <>
      {" "}
      {(data?.viewType?.id === 11 || data?.viewType?.id === 31) &&
        data?.gridType?.id === 1 && (
          <Paper
            sx={{
              border: "1px solid #dbdfea",
              mb: 1,
              padding: "25px 16px 15px 16px",
            }}
            elevation={0}
            className="col-span-12 flex flex-wrap gap-3 relative"
          >
            {" "}
            <div className="bg-[#198DFF] text-white flex justify-center items-center px-4 py-2 absolute -top-5 right-3 text-sm">
              تنظیمات عرض عناصر گراید
            </div>
            {Array.from(Array(data?.showCaseLimit).keys()).map((item, i) => (
              <Box className="w-full" sx={{ maxWidth: "70px" }} key={i}>
                <NumberInput
                  label={`عرض عنصر ${i + 1}`}
                  min={0}
                  max={data?.column}
                  change={(e) => {
                    setData({
                      ...data,
                      gridTemplateColumn: {
                        ...data?.gridTemplateColumn,
                        [i + 1]: e,
                      },
                    });
                  }}
                  value={
                    data?.gridTemplateColumn &&
                    data?.gridTemplateColumn[i + 1] !== undefined
                      ? data?.gridTemplateColumn[i + 1]
                      : 1
                  }
                />
              </Box>
            ))}
          </Paper>
        )}
    </>
  );
};

export default Grids;
