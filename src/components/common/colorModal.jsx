/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import ColorInput from "./ColorInput";
import Modal from "./Modal";

const ColorModal = ({ color , setColor , label , width = 20 , height = 20 }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-xs ">{label} </span>
        <Box
          sx={{ background: color, width: width + "px", height: height + "px" }}
          className="rounded-md cursor-pointer border"
          onClick={() => setOpen(true)}
        ></Box>
      </div>
      <Modal open={open} close={() => setOpen(false)} title={"انتخاب رنگ"}>
        <Box sx={styles.inputBox}>
          <ColorInput color={color} setColor={setColor} hasName={false} />
          <Button  onClick={() => setOpen(false)} variant="contained" sx={{maxWidth:"100px" , mb:2 , marginInline:"auto"}} className=" mt-3 ">تایید</Button>
        </Box>
      </Modal>
    </>
  );
};

export default ColorModal;
const styles = {
  inputBox: { display: "flex", flexDirection: "column", gap: 2 },
};
