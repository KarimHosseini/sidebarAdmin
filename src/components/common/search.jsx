import SearchIcon from "@mui/icons-material/Search";
import { Box, ClickAwayListener } from "@mui/material";
import React, { useState } from "react";
const Search = ({ setSearch, search, setApplySearch }) => {
  const [clicked, setClicked] = useState(false);
  const handleSumbit = (e) => {
    e.preventDefault();
    setApplySearch(search);
  };
  const handleClickAway = () => {
    setClicked(false);
  };
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        component="form"
        className="h-[3.07rem] w-full border border-[#dbdfea] rounded-md flex items-center justify-between px-3 py-2 "
        onSubmit={handleSumbit}
        sx={{
          transition: (theme) =>
            theme.palette.mode === "light" ? "all 500ms" : "none",
          color: (theme) =>
            theme.palette.mode === "light" ? "rgba(0, 0, 0)" : "#fff",
          background: (theme) =>
            theme.palette.mode === "light"
              ? clicked
                ? "#fff"
                : "#f7f7f7"
              : "#000",
        }}
        onClick={() => setClicked(true)}
      >
        <input
          className="border-0 outline-0 w-[95%] bg-transparent md:text-base text-[15px]"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          autoFocus
          placeholder="جستجو ..."
        />
        <button
          className="bg-transparent border-0 cursor-pointer"
          type="submit"
        >
          <SearchIcon />
        </button>
      </Box>
    </ClickAwayListener>
  );
};

export default Search;
