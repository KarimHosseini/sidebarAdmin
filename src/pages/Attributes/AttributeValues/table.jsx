/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import { Box, IconButton, Skeleton, TableCell, TableRow } from "@mui/material";
import { useState, useMemo } from "react"; // NEW: Import useMemo
import { useSelector } from "react-redux";
import { TableLayout } from "../../../components";
import { ShowImage } from "../../../components/common";
import {
  attributeValuesHeadCells,
  attributeValuesHeadCells2,
} from "../../../helpers/constants";

const AttributeValuesTable = ({
  editItem,
  data,
  loading,
  total,
  handleClicked,
}) => {
  const { values = [], title, type } = data;
  const [searchingWord, setSearchingWord] = useState("");
  const { userPermissions } = useSelector((state) => state.relationals);

  // NEW: Memoized filtering logic
  const filteredValues = useMemo(() => {
    const lowercasedFilter = searchingWord.toLowerCase().trim();
    if (lowercasedFilter === "") {
      return values;
    }

    return values.filter((item) => {
      // Check against all relevant fields for a match
      return Object.values(item).some((val) =>
        String(val).toLowerCase().includes(lowercasedFilter)
      );
    });
  }, [values, searchingWord]);


  return (
    <TableLayout
      title={`مقادیر ${title}`}
      headers={
        type === 1 ? attributeValuesHeadCells : attributeValuesHeadCells2
      }
      // MODIFIED: Pass the state setter to the search prop in TableLayout
      search={setSearchingWord}
      // MODIFIED: Pass the filteredValues to be used by the table and export
      rows={filteredValues} 
      // NOTE: `setRows` is not needed if sorting locally, but kept for compatibility
      // setRows={() => {}} // You might want to remove or adjust based on sorting needs
      actions={userPermissions?.attributes?.update ? ["ویرایش"] : false}
      length={filteredValues.length} // MODIFIED: Length should reflect the filtered count
      name={`مقادیر ${title}`}
      addButton={userPermissions?.attributes?.insert}
      handleClicked={handleClicked}
      maxHeight="79.5vh"
    >
      {/* MODIFIED: Map over the filtered list of values */}
      {filteredValues.map((row) => {
        const { title, id, value, galleryId, showInShop, slug } = row;
        return (
          <TableRow hover key={id}>
            <TableCell sx={{ color: "#001ee4" }} align="center">
              {id}
            </TableCell>
            {type !== 1 && (
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                <ShowImage address={galleryId} />
              </TableCell>
            )}
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              {title}
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              {showInShop ? "بلی" : "خیر"}
            </TableCell>
            <TableCell align="center">
              {type === 1 ? (
                <Box sx={styles.avatarBox}>
                  {galleryId ? (
                    <>
                      {" "}
                      <ShowImage address={galleryId} />
                    </>
                  ) : (
                    <>
                      {" "}
                      <div
                        style={{
                          background: value,
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                      ></div>
                      {value}
                    </>
                  )}
                </Box>
              ) : (
                <>
                  <>{value}</>
                </>
              )}
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" , color:"red" }} align="center">
              {slug}
            </TableCell>
            {userPermissions?.attributes?.update && (
              <TableCell align="center">
                <IconButton onClick={() => editItem(row)}>
                  <Edit color="warning" />
                </IconButton>
              </TableCell>
            )}
          </TableRow>
        );
      })}
      {loading && (
        <>
          {Array.from(Array(2).keys()).map((item, i) => (
            <TableRow key={i + "csadca"}>
              {Array.from(Array(4).keys()).map((item, i) => (
                <TableCell key={i + "fgioerf"}>
                  <Skeleton />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </>
      )}
    </TableLayout>
  );
};

const styles = {
  avatarBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 1,
  },
};

export default AttributeValuesTable;