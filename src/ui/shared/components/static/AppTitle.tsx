import { app } from "@/shared/constants/app";
import { Box, Typography } from "@mui/material";
import { FC } from "react";

export const AppTitle: FC<{ subtitle?: boolean }> = ({ subtitle = false }) => {
  return (
    <Box>
      <Typography variant="h1">
        {app.appTitle} {app.appTitleIcon}
      </Typography>
      {subtitle && (
        <Typography variant="subtitle1">{app.appDescription}</Typography>
      )}
    </Box>
  );
};
