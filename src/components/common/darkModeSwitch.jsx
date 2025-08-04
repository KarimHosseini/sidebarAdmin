import NightsStayIcon from "@mui/icons-material/NightsStay";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { themeColor } from "../../redux/slices/theme";
const DarkModeSwitch = () => {
  const { themeColor: themes } = useSelector((state) => state.themeColor);
  var dark = themes === "dark";
  const dispatch = useDispatch();
  return (
    <FormGroup className="noPadding relative">
      <FormControlLabel
        onChange={() => {
          if (dark) {
            dispatch(themeColor("light"));
          } else {
            dispatch(themeColor("dark"));
          }
        }}
        control={<IOSSwitch sx={{ m: 1 }} checked={!dark} />}
      />
      <WbSunnyIcon
        sx={{
          position: "absolute",
          top: "14px",
          left: "5px",
          fontSize: "13px",
          color: "#fff",
          cursor: "pointer",
          zIndex: (theme) => (theme.palette.mode === "light" ? 0 : -1),
        }}
        onClick={() => dispatch(themeColor("dark"))}
      />
      <NightsStayIcon
        sx={{
          position: "absolute",
          top: "14px",
          right: "30px",
          fontSize: "13px",
          color: "#fff",
          cursor: "pointer",
          zIndex: (theme) => (theme.palette.mode === "light" ? -1 : 0),
        }}
        onClick={() => dispatch(themeColor("light"))}
      />
    </FormGroup>
  );
};

export default DarkModeSwitch;
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 52,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(25px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#d3be2c",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
    position: "relative",
    zIndex: 12,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));
