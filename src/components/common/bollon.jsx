import { Box } from "@mui/system";
import React from "react";
import CheckIcon from '@mui/icons-material/Check';
const Bullon = ({ data, onChange, color }) => {
  return (
    <div>
      <Box
        sx={{ background: color }}
        className="border rounded-md w-7 h-7 flex items-center justify-center cursor-pointer"
        onClick={() => onChange(color)}
      >
        {color === data && <><CheckIcon sx={{color:color === "#000" ? "#fff" : "#000"}} /></>}
      </Box>
    </div>
  );
};

export default Bullon;
