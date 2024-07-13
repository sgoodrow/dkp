"use client";

import { MonitoringId } from "@/ui/shared/constants/monitoringIds";
import { useCopyToClipboard } from "@/ui/shared/hooks/useCopyToClipboard";
import { ContentCopy } from "@mui/icons-material";
import {
  Box,
  IconButton,
  IconButtonProps,
  Tooltip,
  TooltipProps,
} from "@mui/material";
import { FC } from "react";

export type CopyToClipboardIconButtonProps = {
  ["data-monitoring-id"]: MonitoringId;
  value: string | undefined;
  label: string;
  color: IconButtonProps["color"];
  tooltipPlacement?: TooltipProps["placement"];
};

export const CopyToClipboardIconButton: FC<CopyToClipboardIconButtonProps> = ({
  "data-monitoring-id": dataMonitoringId,
  value,
  label,
  color,
  tooltipPlacement,
}) => {
  const copyToClipboard = useCopyToClipboard();
  return (
    <Tooltip title={label} placement={tooltipPlacement}>
      <Box>
        <IconButton
          aria-label={label}
          data-monitoring-id={dataMonitoringId}
          onClick={() => copyToClipboard(value)}
          disabled={!value}
          color={color}
        >
          <ContentCopy fontSize="small" />
        </IconButton>
      </Box>
    </Tooltip>
  );
};
