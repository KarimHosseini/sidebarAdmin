import { Delete } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
// import * as XLSX from "xlsx";
import { snackMaker } from "../helpers/functions";
import { addSnack } from "../redux/slices/snacks";

const ImportCSV = ({ keysArray, merge }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [file, setFile] = useState({});

  // process CSV data
  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );
    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length === headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] === '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] === '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }
        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }
    // prepare columns list from headers

    // CURRENTLY WE DON'T NEED HEADERS
    // const columns = headers.map((c) => ({
    //   name: c,
    //   selector: c,
    // }));
    changePersianKeys(list);
  };

  // handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      // const bstr = evt.target.result;
      // const wb = XLSX.read(bstr, { type: "binary" });
      // const wsname = wb.SheetNames[0];
      // const ws = wb.Sheets[wsname];
      // const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  const changePersianKeys = (data) => {
    const dataArray = data.map((row) => {
      return Object.values(row);
    });
    if (dataArray[0].length === keysArray.length) {
      let result = [];
      dataArray.forEach((dataRow) => {
        let rowResult = {};
        keysArray.forEach((key, index) => {
          rowResult[key] = dataRow[index];
        });
        rowResult.fromDB = false;
        result.push(rowResult);
      });
      setData(result);
    } else {
      dispatch(
        addSnack(
          snackMaker(
            "warning",
            "تعداد ستون های فایل وارد شده با جدول همخوانی ندارد"
          )
        )
      );
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      {!file || !file.name || data.length === 0 ? (
        <Button
          variant="contained"
          sx={{ boxShadow: "none", width: "120px" }}
          component="label"
          color="warning"
        >
          <input
            hidden
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => {
              setFile(e.target.files[0]);
              handleFileUpload(e);
            }}
          />
          وارد کردن CSV
        </Button>
      ) : (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography>{file && file.name}</Typography>
          <IconButton
            onClick={() => {
              setFile({});
              setData([]);
            }}
          >
            <Delete color="error" />
          </IconButton>
          <Button
            variant="contained"
            sx={{ boxShadow: "none", width: "120px" }}
            color="success"
            onClick={() => {
              merge(data);
              setData([]);
              setFile({});
            }}
          >
            ادغام با جدول
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ImportCSV;
