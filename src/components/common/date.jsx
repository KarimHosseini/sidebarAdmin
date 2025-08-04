import React from "react";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import { styled } from "@mui/material/styles";
import { TimeAgo } from "../../helpers/timeago";

const getPersianDayName = (date) => {
  const dayNames = [
    "یکشنبه", 
    "دوشنبه", 
    "سه شنبه", 
    "چهارشنبه", 
    "پنجشنبه",
    "جمعه",
    "شنبه" 
  ];
  return dayNames[new Date(date).getDay()];
};

const DateDisplay = ({ date }) => {
  return (
    <>
      {date ? (
        <HtmlTooltip
          title={
            <span>
              {getPersianDayName(date)} <TimeAgo date={date} locale="en-US" />
            </span>
          }
        >
          <div className="flex items-center flex-wrap  justify-start">
           
            {String(new Date(date).getMinutes()).padStart(2, "0")} : {String(new Date(date).getHours()).padStart(2, "0")}
            <div className="mx-2">
              {new Date(date).toLocaleDateString("fa-IR")}
            </div>
          </div>
        </HtmlTooltip>
      ) : (
        <></>
      )}
    </>
  );
};

export default DateDisplay;
const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip
    TransitionProps={{ timeout: 300 }}
    TransitionComponent={Fade}
    arrow
    disableInteractive
    {...props}
    classes={{ popper: className }}
  ></Tooltip>
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    boxShadow: "0 1px 3px 2px rgba(0, 0, 0, 0.3)",
  },
}));
