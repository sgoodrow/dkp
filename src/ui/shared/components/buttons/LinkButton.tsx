"use client";

import { ChevronRight } from "@mui/icons-material";
import { Button, ButtonProps } from "@mui/material";
import { FC } from "react";

export const LinkButton: FC<{
  "data-monitoring-id": string;
  href?: string;
  label: string;
  variant?: ButtonProps["variant"];
}> = ({ "data-monitoring-id": dataMonitoringId, href, label, variant }) => {
  return (
    <Button
      data-monitoring-id={dataMonitoringId}
      href={href || ""}
      endIcon={<ChevronRight />}
      size="small"
      disabled={!href}
      variant={variant}
    >
      {label}
    </Button>
  );
};
