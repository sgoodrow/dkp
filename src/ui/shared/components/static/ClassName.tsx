"use client";

import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { useTheme } from "@mui/material";
import { FC } from "react";

export const ClassName: FC<{
  className: string;
  colorHexDark: string;
  colorHexLight: string;
}> = ({ className, colorHexDark, colorHexLight }) => {
  const theme = useTheme();
  return (
    <OverflowTooltipTypography
      color={theme.palette.mode === "dark" ? colorHexDark : colorHexLight}
    >
      {className}
    </OverflowTooltipTypography>
  );
};
