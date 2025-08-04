import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getFilterValueFromUrl } from "../../utils/filterUtils";

const CheckBoxFilter = ({
  changeFilter,
  item,
  refresh,
  removeFilter,
  defualtValue,
}) => {
  const [checked, setChecked] = useState(null);
  
  useEffect(() => {
    if (refresh > 0) {
      setChecked(false);
    }
  }, [refresh]);
  
  useEffect(() => {
    if (checked === null) {
      // First check URL for filter value
      const urlValue = getFilterValueFromUrl(item?.name);
      if (urlValue === "true" || urlValue === true) {
        setChecked(true);
        return;
      }
      
      // Then check default filter or value from props
      if (item?.defaultFilter || defualtValue?.[item?.name] === "true") {
        setChecked(true);
      } else {
        setChecked(false);
      }
    }
  }, [item, checked, defualtValue]);
  
  return (
    <div className="relative w-full ">
      <FormControlLabel
        sx={{
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(0, 0, 0, 0.23)"
              : "1px solid rgba(55, 255, 255, 0.23)",
          borderRadius: "4px",
          height: "3.07rem",
          marginLeft: "0px !important",
          marginRight: "0px !important",
          width:  "100%" ,
        }}
        control={<Checkbox checked={checked} />}
        onChange={(e) => {
          changeFilter({
            name: item.name,
            value: !checked,
            type: "eq",
          });
          setChecked(!checked);
        }}
        label={
          <Typography
            sx={{
              color: (theme) =>
                theme.palette.mode === "light"
                  ? "rgba(0, 0, 0, 0.6)"
                  : "rgba(255, 255, 255, 0.7)",
              fontSize: { md: "0.75rem !important" },
              fontWeight: "400 !important",
            }}
          >
            {" "}
            {item.title}
          </Typography>
        }
      />
      <IconButton
        onClick={() => {
          removeFilter();
          setChecked(false);
        }}
        sx={{
          position: "absolute",
          right: "2px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <RefreshIcon
          sx={{
            color: (theme) =>
              theme.palette.mode === "light" ? "#001ee4" : "#90caf9",
          }}
        />
      </IconButton>
    </div>
  );
};

export default CheckBoxFilter;
