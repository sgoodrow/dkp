"use client";

import { FlagEmoji } from "@/ui/shared/components/flags/FlagEmoji";
import { Tooltip, TooltipProps, Typography } from "@mui/material";
import { FC } from "react";

export const Flag: FC<{
  tooltipTitle?: TooltipProps["title"];
  tooltipPlacement?: TooltipProps["placement"];
  value?: boolean;
  text: string;
}> = ({ tooltipTitle, tooltipPlacement, value, text }) => {
  return (
    <Tooltip title={tooltipTitle} placement={tooltipPlacement}>
      <Typography noWrap>
        <FlagEmoji value={value} />{" "}
        {value === undefined || value
          ? `${text} found`
          : `No ${text.toLowerCase()} found`}
      </Typography>
    </Tooltip>
  );
};
