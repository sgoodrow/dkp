import "ag-grid-community/styles/ag-grid.css";
import "./theme.css";
import { PaletteMode, useTheme } from "@mui/material";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";

const getThemeName = ({ mode }: { mode: PaletteMode }) => {
  switch (mode) {
    case "dark":
      return "ag-theme-alpine-dark";
    case "light":
      return "ag-theme-alpine";
    default:
      return exhaustiveSwitchCheck(mode);
  }
};

export const useGridTheme = () => {
  const theme = useTheme();
  return getThemeName({ mode: theme.palette.mode });
};
