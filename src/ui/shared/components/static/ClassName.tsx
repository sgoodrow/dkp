"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { FC } from "react";

export const ClassName: FC<{
  className: string;
  colorHexDark: string;
  colorHexLight: string;
}> = ({ className, colorHexDark, colorHexLight }) => {
  const theme = useTheme();
  return (
    <Box display="flex" height={1} alignItems="center">
      <Typography
        color={theme.palette.mode === "dark" ? colorHexDark : colorHexLight}
      >
        {className}
      </Typography>
    </Box>
  );
};
