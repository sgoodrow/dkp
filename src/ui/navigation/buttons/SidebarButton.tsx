"use client";

import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { MonitoringId } from "@/ui/shared/constants/monitoringIds";
import { OpenInNew } from "@mui/icons-material";
import {
  Badge,
  Box,
  Popper,
  ToggleButton,
  ToggleButtonProps,
  Tooltip,
  useTheme,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { FC, ReactNode, useState } from "react";

export const SideBarButton: FC<{
  dataMonitoringId: MonitoringId;
  name: ReactNode;
  icon: ReactNode;
  href?: string;
  selected?: boolean;
  selectedIfIncludes?: boolean;
  onClick?: ToggleButtonProps["onClick"];
  hideLabel?: boolean;
  badge?: {
    count?: number;
    tooltip?: string;
    showZero?: boolean;
  };
}> = ({
  name,
  dataMonitoringId,
  href,
  selected,
  selectedIfIncludes,
  onClick,
  icon,
  hideLabel = false,
  badge,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLAnchorElement>();
  const pathname = usePathname();
  const theme = useTheme();
  const isExternal = href?.startsWith("http");
  const pathBasedSelection = selectedIfIncludes
    ? pathname.includes(href || "")
    : pathname === href;
  const isSelected = !!selected || (!!href && pathBasedSelection);

  return (
    <>
      <ToggleButton
        ref={(r: HTMLAnchorElement) => setAnchorEl(r)}
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
      <Tooltip title={badge?.tooltip}>
        <Popper
          open={!!anchorEl}
          anchorEl={anchorEl}
          placement="right-start"
          sx={{
            zIndex: theme.zIndex.drawer,
          }}
        >
          <Badge
            badgeContent={badge?.count}
            color="error"
            showZero={badge?.showZero}
            max={badge?.count}
          />
        </Popper>
      </Tooltip>
    </>
  );
};
