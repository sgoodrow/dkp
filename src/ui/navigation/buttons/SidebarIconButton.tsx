"use client";

import { MonitoringId } from "@/ui/shared/constants/monitoringIds";
import { SvgIconComponent } from "@mui/icons-material";
import { Box, ToggleButton, Tooltip } from "@mui/material";
import { usePathname } from "next/navigation";
import { FC } from "react";

export type SidebarItem = {
  href: () => string;
  name: string;
  icon: SvgIconComponent;
  dataMonitoringId: MonitoringId;
};

export const SideBarIconButton: FC<{
  item: SidebarItem;
  disabled?: boolean;
}> = ({ item, disabled }) => {
  const pathname = usePathname();
  const href = item.href();
  const selected = pathname.startsWith(item.href());
  return (
    <Tooltip title={`Go to ${item.name}.`} placement="right">
      <Box>
        <ToggleButton
          data-monitoring-id={item.dataMonitoringId}
          value="check"
          href={href}
          selected={selected}
          color={selected ? "primary" : undefined}
          disabled={disabled}
        >
          <item.icon />
        </ToggleButton>
      </Box>
    </Tooltip>
  );
};
