/* eslint-disable react-hooks/exhaustive-deps */
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField, // NEW: Import TextField for the search input
  Typography,
} from "@mui/material";
import { useState } from "react";
import { ExportCSV } from ".";

const TableLayout = ({
  title,
  children,
  headers,
  search, // This prop will now be used for our search input
  rows,
  setRows,
  actions = false,
  exelHeader = false,
  length,
  name,
  addButton = false,
  handleClicked,
  maxHeight,
  extraBuuton,
  extraBuutonHandler,
  imageButton,
  imageButtonHandler,
  image,
  deleteAll,
  deleteAllHandler,
}) => {
  //sorting
  const [orderBy, setOrderBy] = useState(null);
  const [isAsc, setIsAsc] = useState(true);
  return (
    <Paper elevation={0} className=" rounded-sm border-[#dbdfea] border p-4">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: 2,
          alignItems: "center",
          flexWrap: 'wrap', // Added for better responsiveness
          gap: 2 // Added for spacing
        }}
      >
        <div className="flex items-center gap-2">
          <Typography variant="h6">{title}</Typography>
          <Typography
            sx={{ borderLeft: "1px solid #dbdfea" }}
            className="px-2 mx-2"
            variant="body2"
          >
            تعداد نتایج : {length} {name}
          </Typography>
        </div>

        {/* NEW: Search input field */}
        {search && (
            <Box sx={{flexGrow: 1, minWidth: '250px'}}>
                 <TextField
                    fullWidth
                    variant="outlined"
                    label={`جستجو در ${name}...`}
                    size="small"
                    onChange={(e) => search(e.target.value)}
                />
            </Box>
        )}


        <div className="flex gap-2 flex-wrap">
          {imageButton && (
            <Button
              onClick={imageButtonHandler}
              variant="outlined"
              color="secondary"
            >
              مشاهده / ویرایش بنر منو
            </Button>
          )}
          {deleteAll && (
            <Button
              onClick={deleteAllHandler}
              variant="contained"
              color="error"
            >
              حذف همه
            </Button>
          )}
          {extraBuuton && (
            <Button onClick={() => extraBuutonHandler()} variant="outlined">
              {extraBuuton}
            </Button>
          )}
          {addButton && (
            <Button onClick={() => handleClicked()} variant="contained">
              <AddIcon />
              افزودن {name} جدید
            </Button>
          )}

          {rows && (
            <ExportCSV
              data={rows}
              headers={exelHeader ? exelHeader : headers}
              name={
                title === "محصولات"
                  ? `لیست کالا ها  ${new Intl.DateTimeFormat(
                      "fa-IR-u-nu-latn"
                    ).format(new Date())}`
                  : title
              }
            />
          )}
        </div>
      </Box>

      <TableContainer
        sx={{ overflowX: "auto", mt: "38px", maxHeight: maxHeight }}
      >
        <Table stickyHeader sx={styles.table} size="small">
          <TableHead>
            <TableRow>
              {headers?.map((header) => (
                <TableCell key={header.label} align="center">
                  {header.sorting ? (
                    <TableSortLabel
                      active={orderBy === header.key}
                      direction={isAsc ? "asc" : "desc"}
                      onClick={() => {
                        if (orderBy === header.key) {
                          if (isAsc) {
                            setRows(header.sorting.asc(rows, header.key));
                          } else {
                            setRows(header.sorting.desc(rows, header.key));
                          }
                          setIsAsc(!isAsc);
                        } else {
                          setRows(header.sorting.desc(rows, header.key));
                          setIsAsc(true);
                        }
                        setOrderBy(header.key);
                      }}
                    >
                      {header.label}
                    </TableSortLabel>
                  ) : (
                    header.label
                  )}
                </TableCell>
              ))}
              {actions &&
                actions?.map((action) => (
                  <TableCell align="center" key={action}>
                    {action}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>{children}</TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

const styles = {
  container: { p: 2 },
  table: { minWidth: 650 },
};

export default TableLayout;