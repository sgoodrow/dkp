import type {} from "@mui/material/themeCssVarsAugmentation";
import { styled } from "@mui/material/styles";

// Enables CSS variable theming types
//  See: https://mui.com/material-ui/experimental-api/css-theme-variables/usage/#typescript
const StyledComponent = styled("button")(({ theme }) => ({
  color: theme.vars.palette.primary.main,
}));
