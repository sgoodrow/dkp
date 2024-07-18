"use client";

import { OpenInNew } from "@mui/icons-material";
import { Button } from "@mui/material";
import { FC } from "react";

export const LinkToSiteButton: FC<{
  "data-monitoring-id": string;
  href?: string;
  label: string;
}> = ({ "data-monitoring-id": dataMonitoringId, href, label }) => {
  const isExternal = href?.startsWith("http");
  return (
    <Button
      data-monitoring-id={dataMonitoringId}
      href={href || ""}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener" : undefined}
      endIcon={isExternal && <OpenInNew />}
      size="small"
      disabled={!href}
    >
      {label}
    </Button>
  );
};
