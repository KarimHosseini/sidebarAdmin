import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Collapse } from "@mui/material";
import { Box } from "@mui/system";
import { FaChevronDown } from "react-icons/fa";
const NavbarCategory = ({ category }) => {
  const [hover, setHover] = useState(false);
  const [visibility, setVisibility] = useState(false);

  return (
    <>
      <div
        onMouseEnter={() => {
          if (category.subroutes?.length > 0) setVisibility(true);
        }}
        onMouseLeave={() => {
          if (category.subroutes?.length > 0) setVisibility(false);
        }}
        className="h-10  cursor-pointer relative mt-3"
      >
        <div
          onMouseEnter={() => {
            if (category.subroutes?.length > 0) setHover(true);
          }}
          onMouseLeave={() => {
            if (category.subroutes?.length > 0) setHover(false);
          }}
          className=" flex items-center gap-2"
        >
          {category.path ? (
            <Link to={category.path}>
              <a href={category.path}>
                <span className="text  text-sm text-[#141414] font-[500] hover:text-blue-500">
                  {category.title}
                </span>
              </a>
            </Link>
          ) : (
            <span className="text  text-sm text-[#141414] font-[500] hover:text-blue-500">
              {category.title}
            </span>
          )}

          {category.subroutes?.length > 0 && (
            <FaChevronDown
              style={{ transform: hover ? "rotate(180deg)" : "" }}
              className="block  transition duration-700 text-[7px] text-gray-400 hover:text-blue-500"
            />
          )}
        </div>
        {category?.subroutes && (
          <Box
            sx={{
              visibility: visibility ? "visible" : "hidden",
              opacity: hover ? 1 : 0,
              transition: "opacity 500ms ease",
            }}
            onMouseEnter={() => {
              if (category.subroutes?.length > 0) setHover(true);
            }}
            onMouseLeave={() => {
              if (category.subroutes?.length > 0) setHover(false);
            }}
            className="absolute z-50   min-w-[16rem] min-h-[2rem] space-y-4  duration-500 bg-white p-4 pt-8 py-6 top-[20px]"
          >
            {category?.subroutes?.map((child, index) => (
              <NavbarChild key={`navbar--child-category-${index}`} {...child} />
            ))}
            {category?.accordian?.map((child, index) => (
              <AccoridanChild
                key={`accordian--child-category-${index}`}
                {...child}
              />
            ))}
          </Box>
        )}
      </div>

      <Box
        sx={{
          visibility: visibility ? "visible" : "hidden",
          opacity: hover ? 1 : 0,
          transition: "all .5s ease-out",
          zIndex: 20,
        }}
        className="absolute top-[83px] right-[0] h-[100%] w-[100%] bg-[rgba(0,0,0,0.2)]"
      ></Box>
    </>
  );
};

const NavbarChild = ({ path, name, url }) => {
  return (
    <div className="border-r-2 text-sm pr-2 hover:text-blue-500 hover:border-r-blue-400">
      {path ? (
        <Link to={path}>
          <a href={path}>{name}</a>
        </Link>
      ) : (
        <>{name}</>
      )}
    </div>
  );
};

const AccoridanChild = ({ title, childs }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="">
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center bg-blue-50 py-3 px-2"
      >
        <span className="text-sm pr-2 hover:text-blue-500 hover:border-r-blue-400">
          {title}
        </span>
        <FaChevronDown
          style={{ transform: open ? "rotate(180deg)" : "" }}
          className="block  transition duration-700 text-[11px]"
        />
      </div>
      <Collapse in={open}>
        <div>
          {childs.map((item, index) => (
            <div
              key={index}
              className="border-r-2 text-sm pr-2 hover:text-blue-500 hover:border-r-blue-400 mt-4"
            >
              {item.path ? (
                <Link to={item.path}>
                  <a href={item.path}>{item.name}</a>
                </Link>
              ) : (
                <>{item.name}</>
              )}
            </div>
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default NavbarCategory;
