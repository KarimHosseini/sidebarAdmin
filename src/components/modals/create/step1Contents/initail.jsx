import { Autocomplete, Paper, Switch, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { NumberInput, TextInput } from "../../../common";

const Initail = ({ data, setData, allUrl }) => {
  return (
    <Paper
      sx={{
        border: "1px solid #dbdfea",
        mb: 1,
        padding: "25px 16px 15px 16px",
      }}
      elevation={0}
      className="md:col-span-4 relative "
    >
      <div className="grid md:grid-cols-4 gap-4">
        <div className="leftInput relative col-span-3">
          <Autocomplete
            value={data?.url || null}
            onChange={(event, newValue) => {
              setData({ ...data, url: newValue || "" });
            }}
            freeSolo
            inputValue={data?.url || ""}
            onInputChange={(event, newInputValue) => {
              setData({
                ...data,
                url: newInputValue || "",
              });
            }}
            getOptionLabel={(option) => option || ""}
            id="controllable-states-demo"
            options={allUrl || []}
            renderInput={(params) => (
              <TextField
                focused
                {...params}
                sx={{
                  input: {
                    paddingRight: "20px !important",
                  },
                }}
                label={" ایجاد یا انتخاب صفحه"}
              />
            )}
          />
          <div className="absolute left-4 top-3">/</div>
        </div>
        <NumberInput
          label="اولویت نمایش"
          change={(e) => setData({ ...data, priority: e })}
          value={data?.priority || 0}
        />
        {data?.filter?.id !== "5" && (
          <>
            <Box
              sx={{
                input: {
                  paddingRight: "20px !important",
                },
              }}
              className="leftInput relative col-span-3"
            >
              <TextInput
                label=" لینک مشاهده بیشتر"
                ltr
                change={(e) => setData({ ...data, moreLink: e })}
                currentValue={
                  data.moreLink?.slice(0, 1) === "/"
                    ? data.moreLink?.substring(1)
                    : data.moreLink
                }
              />
              <div className="absolute left-4 top-3">/</div>
            </Box>
          </>
        )}
        <Box className="flex items-center gap-2 col-span-1">
          <span className="text-xs">نمایش ویترین:</span>
          <Switch
            checked={data?.active || false}
            size="small"
            onChange={() => setData({ ...data, active: !data?.active })}
          />
        </Box>
      </div>
      <div className="bg-[#198DFF] text-white flex justify-center items-center px-4 py-2 absolute -top-5 right-3 text-sm">
        تنظیمات اولیه
      </div>
    </Paper>
  );
};

export default Initail;
