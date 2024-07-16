"use client";

import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { MonitoringId } from "@/ui/shared/constants/monitoringIds";
import { OpenInNew } from "@mui/icons-material";
import { Box, ToggleButton, ToggleButtonProps } from "@mui/material";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";

export const SideBarButton: FC<{
  dataMonitoringId: MonitoringId;
  name: ReactNode;
  icon: ReactNode;
  href?: string;
  selected?: boolean;
  onClick?: ToggleButtonProps["onClick"];
  hideLabel?: boolean;
}> = ({
  name,
  dataMonitoringId,
  href,
  selected,
  onClick,
  icon,
  hideLabel = false,
}) => {
  const pathname = usePathname();
  const isExternal = href?.startsWith("http");
  const isSelected = !!selected || (!!href && pathname.startsWith(href));
  return (
    <ToggleButton
      data-monitoring-id={dataMonitoringId}
      value="check"
      size="small"
      href={href || ""}
      selected={isSelected}
      onClick={onClick}
      color={isSelected ? "primary" : undefined}
      fullWidth
      sx={{ textTransform: "none" }}
    >
      {icon}
      {hideLabel ? null : (
        <>
          <Box ml={1} />
          <OverflowTooltipTypography
            textAlign="left"
            flexGrow={1}
            placement="right"
          >
            {name}
          </OverflowTooltipTypography>
          {isExternal && <OpenInNew fontSize="small" />}
        </>
      )}
    </ToggleButton>
  );
};
