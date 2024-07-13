"use client";

import { OpenInNew } from "@mui/icons-material";
import { Button } from "@mui/material";
import { FC } from "react";

export const LinkToSiteButton: FC<{
  "data-monitoring-id": string;
  href?: string;
  label: string;
}> = ({ "data-monitoring-id": dataMonitoringId, href, label }) => {
  return (
    <Button
      data-monitoring-id={dataMonitoringId}
      href={href || ""}
      target="_blank"
      endIcon={<OpenInNew />}
      size="small"
      disabled={!href}
    >
      {label}
    </Button>
  );
};
