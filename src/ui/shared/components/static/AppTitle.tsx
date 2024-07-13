import {
  APP_DESCRIPTION,
  APP_TITLE,
  APP_TITLE_ICON,
} from "@/ui/shared/components/static/copy";
import { Box, Typography } from "@mui/material";
import { FC } from "react";

export const AppTitle: FC<{ subtitle?: boolean }> = ({ subtitle = false }) => {
  return (
    <Box>
      <Typography variant="h1">
        {APP_TITLE} {APP_TITLE_ICON}
      </Typography>
      {subtitle && (
        <Typography variant="subtitle1">{APP_DESCRIPTION}</Typography>
      )}
    </Box>
  );
};
