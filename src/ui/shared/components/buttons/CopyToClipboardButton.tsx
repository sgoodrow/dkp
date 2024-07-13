"use client";

import { MonitoringId } from "@/ui/shared/constants/monitoringIds";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { useCopyToClipboard } from "@/ui/shared/hooks/useCopyToClipboard";
import { ContentCopy } from "@mui/icons-material";
import { Button, ButtonProps } from "@mui/material";
import { FC } from "react";

export const CopyToClipboardButton: FC<{
  ["data-monitoring-id"]: MonitoringId;
  value: string | undefined;
  label: string;
  variant?: ButtonProps["variant"];
}> = ({ "data-monitoring-id": dataMonitoringId, value, label, variant }) => {
  const copyToClipboard = useCopyToClipboard();
  return (
    <Button
      data-monitoring-id={dataMonitoringId}
      endIcon={<ContentCopy />}
      onClick={() => copyToClipboard(value)}
      variant={variant}
      size="small"
      disabled={!value}
    >
      <OverflowTooltipTypography>{label}</OverflowTooltipTypography>
    </Button>
  );
};
