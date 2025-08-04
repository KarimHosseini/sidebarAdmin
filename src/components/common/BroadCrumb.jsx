import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BroadCrumb = ({ links = [], current }) => {
  const navigate = useNavigate();
  return (
    <Breadcrumbs
      sx={{
        ".MuiTypography-root": {
          fontSize: { md: "0.8rem !important", xs: "1rem !important" },
        },
      }}
      separator="›"
    >
      {links.map((link) => (
        <Link
          onClick={() => navigate(link.path)}
          sx={{ cursor: "pointer" }}
          underline="hover"
          color="inherit"
          key={link.title}
        >
          {link.title}
        </Link>
      ))}
      <Typography color="text.primary">{current}</Typography>
    </Breadcrumbs>
  );
};

export default BroadCrumb;
