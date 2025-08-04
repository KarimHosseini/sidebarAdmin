import { Autocomplete, Paper, Switch, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { NumberInput, TextInput } from "../../../../common";

const InitialSettings = ({ data, onUpdate, allUrls }) => {
  const handleUrlChange = (newValue) => {
    onUpdate("url", newValue);
  };

  const handleUrlInputChange = (newInputValue) => {
    onUpdate("url", newInputValue);
  };

  const handlePriorityChange = (value) => {
    onUpdate("priority", value);
  };

  const handleMoreLinkChange = (value) => {
    onUpdate("moreLink", value);
  };

  const handleActiveChange = () => {
    onUpdate("active", !data?.active);
  };

  return (
    <Paper
      sx={{
        border: "1px solid #dbdfea",
        mb: 1,
        padding: "25px 16px 15px 16px",
        position: "relative",
      }}
      elevation={0}
      className="md:col-span-4"
    >
      <div className="grid md:grid-cols-4 gap-4">
        <div className="leftInput relative col-span-3">
          <Autocomplete
            value={data.url || ""}
            onChange={(_, newValue) => handleUrlChange(newValue)}
            freeSolo
            inputValue={data.url || ""}
            onInputChange={(_, newInputValue) =>
              handleUrlInputChange(newInputValue)
            }
            options={allUrls}
            renderInput={(params) => (
              <TextField
                {...params}
                label="ایجاد یا انتخاب صفحه"
                focused
                sx={{
                  input: { paddingRight: "20px !important" },
                }}
              />
            )}
          />
          <div className="absolute left-4 top-3">/</div>
        </div>

        <NumberInput
          label="اولویت نمایش"
          change={handlePriorityChange}
          value={data?.priority}
        />

        {data?.filter?.id !== "5" && (
          <Box
            sx={{
              input: { paddingRight: "20px !important" },
            }}
            className="leftInput relative col-span-3"
          >
            <TextInput
              label="لینک مشاهده بیشتر"
              ltr
              change={handleMoreLinkChange}
              currentValue={
                data.moreLink?.slice(0, 1) === "/"
                  ? data.moreLink?.substring(1)
                  : data.moreLink
              }
            />
            <div className="absolute left-4 top-3">/</div>
          </Box>
        )}

        <Box className="flex items-center gap-2 col-span-1">
          <span className="text-xs">نمایش ویترین:</span>
          <Switch
            checked={data?.active}
            size="small"
            onChange={handleActiveChange}
          />
        </Box>
      </div>

      <div className="bg-[#198DFF] text-white flex justify-center items-center px-4 py-2 absolute -top-5 right-3 text-sm">
        تنظیمات اولیه
      </div>
    </Paper>
  );
};

export default React.memo(InitialSettings);
