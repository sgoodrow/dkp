import { createTheme } from "@mui/material";
import { green } from "@mui/material/colors";

export const theme = createTheme({
  typography: {
    fontFamily: "Segoe UI",
  },
  palette: {
    mode: "dark",
    primary: {
      main: green[500],
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
  },
});
