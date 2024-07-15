"use client";

import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { MonitoringId } from "@/ui/shared/constants/monitoringIds";
import { Box, ToggleButton, ToggleButtonProps } from "@mui/material";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";

type Props = {
  dataMonitoringId: MonitoringId;
  name: ReactNode;
  icon: ReactNode;
  href?: string;
  selected?: boolean;
  onClick?: ToggleButtonProps["onClick"];
  isMobile?: boolean;
};

export const SideBarButton: FC<Props> = ({
  name,
  dataMonitoringId,
  href,
  selected,
  onClick,
  icon,
  isMobile = false,
}) => {
  const pathname = usePathname();
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
      {isMobile ? null : (
        <>
          <Box ml={1} />
          <OverflowTooltipTypography textAlign="left" flexGrow={1}>
            {name}
          </OverflowTooltipTypography>
        </>
      )}
    </ToggleButton>
  );
};
