"use client";

import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { MonitoringId } from "@/ui/shared/constants/monitoringIds";
import { SvgIconComponent } from "@mui/icons-material";
import { Box, Link, Skeleton, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { FC } from "react";

export const Breadcrumb: FC<{
  Icon?: SvgIconComponent;
  label?: string;
  href?: string;
  dataMonitoringId?: MonitoringId;
}> = ({ label, Icon, dataMonitoringId, href }) => {
  const pathname = usePathname();
  const isClickable = href !== undefined && !href.includes(pathname);
  return (
    <Typography
      className={isClickable ? undefined : "active"}
      component={isClickable ? Link : "div"}
      href={href || ""}
      data-monitoring-id={isClickable ? dataMonitoringId : undefined}
    >
      <Box display="flex">
        {Icon ? <Icon fontSize="small" sx={{ mr: 1 }} /> : null}
        <OverflowTooltipTypography>
          {label ?? <Skeleton width="100px" />}
        </OverflowTooltipTypography>
      </Box>
    </Typography>
  );
};
