import { app } from "@/shared/constants/app";
import { Box, Skeleton, Typography } from "@mui/material";
import { FC } from "react";

export const AppTitle: FC<{ subtitle?: boolean }> = ({ subtitle = false }) => {
  return (
    <Box>
      <Typography variant="h1">
        {app.name || <Skeleton width="200px" />} {app.titleIcon}
      </Typography>
      {subtitle && (
        <Typography variant="subtitle1">{app.description}</Typography>
      )}
    </Box>
  );
};
