"use client";

import { uiRoutes } from "@/app/uiRoutes";
import { SignOutIconButton } from "@/ui/auth/buttons/SignOutIconButton";
import { WelcomeDialogIconButton } from "@/ui/navigation/buttons/WelcomeDialogIconButton";
import { AppIcon } from "@/ui/shared/components/static/AppIcon";
import { MonitoringId } from "@/ui/shared/constants/monitoringIds";
import { SvgIconComponent } from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  Paper,
  Stack,
  Theme,
  ToggleButton,
  Tooltip,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { FC } from "react";

const SIDEBAR_WIDTH = "56px";

export const SidebarPane: FCWithChildren<{}> = ({ children }) => {
  return (
    <>
      <Drawer open variant="permanent">
        <Stack direction="row" height={1}>
          <Stack direction="column" spacing={1} p={1} component={Paper}>
            <AppIcon />
            <SideBarIconButton route={uiRoutes.private.home} />
            <Box flexGrow={1} />
            <SideBarIconButton route={uiRoutes.private.settings} />
            <Divider />
            <WelcomeDialogIconButton />
            <SignOutIconButton />
          </Stack>
        </Stack>
      </Drawer>
      <Box ml={SIDEBAR_WIDTH}>{children}</Box>
    </>
  );
};

const SideBarIconButton: FC<{
  route: {
    dataMonitoringId: MonitoringId;
    name: string;
    href: () => string;
    icon: SvgIconComponent;
  };
  disabled?: boolean;
}> = ({ route, disabled }) => {
  const pathname = usePathname();
  const href = route.href();
  const selected = pathname.startsWith(route.href());
  return (
    <Tooltip
      title={disabled ? `${route.name} coming soon!` : `Go to ${route.name}.`}
      placement="right"
    >
      <Box>
        <ToggleButton
          data-monitoring-id={route.dataMonitoringId}
          value="check"
          href={href}
          selected={selected}
          color={selected ? "primary" : undefined}
          disabled={disabled}
        >
          <route.icon />
        </ToggleButton>
      </Box>
    </Tooltip>
  );
};
