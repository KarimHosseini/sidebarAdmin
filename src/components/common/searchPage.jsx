import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { Box, ClickAwayListener, Paper, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import UsePermissons from "../../permissions";

const SearchPage = () => {
  const { headerMenu } = UsePermissons();
  const [open, setOpen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const isDesktop = useMediaQuery("(min-width:1090px)");

  const [search, setSearch] = useState("");
  const [allPage, setAllPage] = useState([]);
  const handleClickAway = () => {
    setSearch("");
    setOpen(false);
  };
  const searchHandler = (event) => {
    const normalizedValue = event.target.value.trim().replace(/\s+/g, ' ');
    setSearch(normalizedValue);
    var allOptions = [];
    headerMenu?.map((item) => {
      if (item?.subroutes) {
        allOptions.push(...item?.subroutes);
      } else {
        allOptions.push({ name: item.title, path: item.path });
      }

      if (item?.accordian) {
        item?.accordian?.map((it) => {
          allOptions.push(...it?.childs);
        });
      }
    });

    if (normalizedValue === "") {
      setAllPage([...allOptions]);
    } else {
      var temp = [...allOptions];

      const search = (query) =>
        temp.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
      setOpen(true);
      setAllPage(search(normalizedValue));
    }
  };
  return (
    <>
      <Box
        sx={{
          transition: (theme) =>
            theme.palette.mode === "light" ? "all 500ms" : "none",
          color: (theme) =>
            theme.palette.mode === "light" ? "rgba(0, 0, 0)" : "#fff",
          background: (theme) =>
            theme.palette.mode === "light"
              ? clicked
                ? "#fff"
                : "#fff"
              : "#000",
        }}
        className=" border-b w-full gap-6 py-2 md:px-3 px-2 relative z-50 flex items-center"
      >
        <form
          style={{ zIndex: 999 }}
          className="w-full h-9 gap-1  flex md:justify-between items-center"
        >
          <ManageSearchIcon
            sx={{
              width: { md: "1.3rem", xs: "2rem" },
              height: { md: "1.3rem", xs: "2rem" },
            }}
          />
          {/*   </IconButton> */}
          <input
            onChange={(e) => searchHandler(e)}
            value={search}
            /*  onClick={handleClick} */
            className="md:h-12 h-10  md:w-[300px] outline-none    border-0 bg-transparent md:text-[0.9rem] text-[14px]	"
            placeholder={" جستجوی امکانات"}
          />
          {/*         <IconButton sx={{ display: { md: "block", xs: "none" } }}>
          <img
            className="md:w-6 w-5"
            src="/images/icons/close.svg"
            alt="remove search"
          />
        </IconButton> */}
        </form>

        <ClickAwayListener onClickAway={handleClickAway}>
          <Box
            sx={{
              opacity: open ? 1 : 0,
              zIndex: open ? 9999 : -999999,
              display: open ? "block" : "none",
              transition: "opacity .5s ease-in-out",
              top: isDesktop ? "2.5rem" : "2rem",
            }}
            className="absolute  right-0 w-full"
          >
            <Paper className="gap-1 relative md:min-w-[250px]rounded-md  max-h-[300px] overflow-y-auto flex flex-col p-7 mt-5 ">
              {allPage?.length === 0 ? (
                <>
                  {" "}
                  <span className="text-sm font-semibold text-[#4D4D4D]">
                    هیچ آیتمی یافت نشد
                  </span>
                </>
              ) : (
                <>
                  {" "}
                  {allPage?.map((item, index) => (
                    <Link key={index} to={item?.path}>
                      {" "}
                      <div className="flex gap-6 items-center border-b py-3 border-dashed border-[#CBCBCB]">
                        <span className="text-sm font-semibold text-[#4D4D4D]">
                          {item?.name}
                        </span>
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </Paper>
          </Box>
        </ClickAwayListener>
      </Box>{" "}
      <Box
        sx={{
          position: open ? "fixed" : "absolute",
          top: "0",
          right: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.4)",
          opacity: open ? 1 : 0,
          zIndex: open ? 30 : -1,
          transition: "all .5s ease-in-out",
        }}
      >
        {" "}
      </Box>
    </>
  );
};

export default SearchPage;
