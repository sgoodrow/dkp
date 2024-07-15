"use client";

import { uiRoutes } from "@/app/uiRoutes";
import { BackButton } from "@/ui/navigation/buttons/BackButton";
import { SideBarButton } from "@/ui/navigation/buttons/SidebarButton";
import { SignOutButton } from "@/ui/navigation/buttons/SignOutButton";
import { ThemeModeButton } from "@/ui/navigation/buttons/ThemeModeButton";
import { UserButton } from "@/ui/navigation/buttons/UserButton";
import { WelcomeDialogButton } from "@/ui/navigation/buttons/WelcomeDialogButton";
import { AppIcon } from "@/ui/shared/components/static/AppIcon";
import { MonitoringId } from "@/ui/shared/constants/monitoringIds";
import { SvgIconComponent } from "@mui/icons-material";
import { Box, Divider, Drawer, Paper, Stack } from "@mui/material";
import { usePathname } from "next/navigation";

export const SidebarPane: FCWithChildren<{ isMobile: boolean }> = ({
  isMobile,
  children,
}) => {
  const sidebarWidth = isMobile ? `${56}px` : `${200}px`;
  const pathname = usePathname();
  const nestedRoute = pathname.startsWith(uiRoutes.admin.href())
    ? uiRoutes.admin
    : null;
  const isAdmin = true;
  const items: {
    href: () => string;
    name: string;
    icon: SvgIconComponent;
    dataMonitoringId: MonitoringId;
  }[] = [
    uiRoutes.home,
    uiRoutes.players,
    uiRoutes.raids,
    uiRoutes.items,
    uiRoutes.adjustments,
    uiRoutes.leaderboard,
  ];
  if (isAdmin) {
    items.push(uiRoutes.admin);
  }
  return (
    <>
      <Drawer
        open
        variant="permanent"
        PaperProps={{
          sx: {
            overflow: "unset",
          },
        }}
      >
        <Stack direction="row" height={1}>
          <Stack
            direction="column"
            spacing={1}
            p={1}
            component={Paper}
            width={sidebarWidth}
          >
            {nestedRoute ? (
              <BackButton
                data-monitoring-id={nestedRoute.dataMonitoringId}
                href={nestedRoute.href()}
                isMobile={isMobile}
              />
            ) : (
              <AppIcon isMobile={isMobile} />
            )}
            <UserButton isMobile={isMobile} />
            {items.map((i) => (
              <SideBarButton
                key={i.dataMonitoringId}
                dataMonitoringId={i.dataMonitoringId}
                href={i.href()}
                name={i.name}
                icon={<i.icon />}
                isMobile={isMobile}
              />
            ))}
            <Box flexGrow={1} />
            <Divider />
            <WelcomeDialogButton isMobile={isMobile} />
            <ThemeModeButton isMobile={isMobile} />
            <SignOutButton isMobile={isMobile} />
          </Stack>
        </Stack>
      </Drawer>
      <Box ml={sidebarWidth}>{children}</Box>
    </>
  );
};
