import { createTheme } from "@mui/material";
import { indigo } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: {
      light: indigo[50],
      main: indigo[100],
      dark: indigo[800],
    },
  },
  typography: {
    fontFamily: "IRANSansfa",
  },
});
