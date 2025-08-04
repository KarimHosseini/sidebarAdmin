import { TextField } from "@mui/material";
import React from "react";

const Step4 = ({ data, setData }) => {
  return (
    <div className="mb-5 leftTextArea">
      <TextField
        rows={6}
        multiline={true}
        value={data?.css}
        onChange={(e) => setData({ ...data, css: e.target.value })}
        label="css code"
        fullWidth
        focused
      />
    </div>
  );
};

export default Step4;
