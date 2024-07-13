import { Help } from "@mui/icons-material";
import { Tooltip, TooltipProps } from "@mui/material";
import { FC } from "react";

export const InfoIcon: FC<{
  title: TooltipProps["title"];
  placement?: TooltipProps["placement"];
}> = ({ title, placement }) => {
  return (
    <Tooltip title={title} placement={placement}>
      <Help fontSize="small" color="action" sx={{ ml: 1 }} />
    </Tooltip>
  );
};
