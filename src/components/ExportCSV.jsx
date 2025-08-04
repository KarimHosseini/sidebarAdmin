/* eslint-disable array-callback-return */
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Box, Button } from "@mui/material";
import * as XLSX from "xlsx";

const ExportCSV = ({ data, headers, name }) => {
  const handleExcel = () => {
    var temp = [];
    data.map((item) => {
      var d = [];
      d.push(item.id);
      d.push(item.image);
      d.push(item.title);
      d.push(item.link);
      temp.push(d);
    });
    var dh = [];
    headers.map((item) => {
      dh.push(item.label);
    });
    temp.unshift(dh);
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.aoa_to_sheet(temp);

    XLSX.utils.book_append_sheet(wb, ws, name);
    XLSX.writeFile(
      wb,
      `${name + " " + new Date().toLocaleDateString("fa-IR")}.xlsx`
    );
  };
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Button onClick={handleExcel} variant="contained" color="warning">
        <FileDownloadIcon />
        خروجی اکسل
      </Button>
    </Box>
  );
};

export default ExportCSV;
