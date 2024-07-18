"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { uiRoutes } from "@/app/uiRoutes";
import { guild } from "@/shared/constants/guild";
import { BackButton } from "@/ui/navigation/buttons/BackButton";
import { SideBarButton } from "@/ui/navigation/buttons/SidebarButton";
import { SignOutButton } from "@/ui/navigation/buttons/SignOutButton";
import { ThemeModeButton } from "@/ui/navigation/buttons/ThemeModeButton";
import { UserButton } from "@/ui/navigation/buttons/UserButton";
import { WelcomeDialogButton } from "@/ui/navigation/buttons/WelcomeDialogButton";
import { DiscordIcon } from "@/ui/shared/components/icons/DiscordIcon";
import { GoogleDriveDocumentsIcon } from "@/ui/shared/components/icons/GoogleDriveDocumentsIcon";
import {
  MonitoringId,
  monitoringIds,
} from "@/ui/shared/constants/monitoringIds";
import { SvgIconComponent } from "@mui/icons-material";
import { Box, Divider, Drawer, Paper, Stack } from "@mui/material";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type SidebarItem = {
  href: () => string;
  name: string;
  icon: SvgIconComponent;
  dataMonitoringId: MonitoringId;
  adminOnly?: boolean;
};

const MOBILE_WIDTH = "56px";
const DESKTOP_WIDTH = "200px";

export const SidebarPane: FCWithChildren<{ isMobile: boolean }> = ({
  isMobile,
  children,
}) => {
  const pathname = usePathname();
  const { data: isAdmin } = trpc.user.isAdmin.useQuery();
  const [prevPageHref, setPrevPageHref] = useState<string>(
    uiRoutes.home.href(),
  );

  const onAdminPage = pathname.startsWith(uiRoutes.admin.href());

  const width = isMobile ? MOBILE_WIDTH : DESKTOP_WIDTH;

  const items: SidebarItem[] = onAdminPage
    ? [
        { ...uiRoutes.admin, adminOnly: true },
        { ...uiRoutes.raidTypes, adminOnly: true },
        { ...uiRoutes.unassignedCharacters, adminOnly: true },
        { ...uiRoutes.apiKeys, adminOnly: true },
      ]
    : [
        uiRoutes.home,
        uiRoutes.players,
        uiRoutes.raids,
        uiRoutes.items,
        uiRoutes.adjustments,
        uiRoutes.leaderboard,
        { ...uiRoutes.admin, adminOnly: true },
      ];

  useEffect(() => {
    if (!onAdminPage) {
      setPrevPageHref(pathname);
    }
  }, [onAdminPage, pathname]);

  return (
    <>
      <Drawer open variant="permanent">
        <Stack direction="row" height={1}>
          <Stack
            direction="column"
            spacing={1}
            p={1}
            component={Paper}
            width={width}
          >
            {onAdminPage ? (
              <BackButton
                data-monitoring-id={monitoringIds.GO_BACK}
                href={prevPageHref || ""}
                hideLabel={isMobile}
              />
            ) : (
              <UserButton hideLabel={isMobile} />
            )}
            {items.map(
              ({ href, name, icon: Icon, dataMonitoringId, adminOnly }) => {
                if (adminOnly && !isAdmin) {
                  return null;
                }
                return (
                  <SideBarButton
                    key={dataMonitoringId}
                    dataMonitoringId={dataMonitoringId}
                    href={href()}
                    name={name}
                    icon={<Icon />}
                    hideLabel={isMobile}
                  />
                );
              },
            )}
            <Box flexGrow={1} />
            <Divider />
            <WelcomeDialogButton
              hideButtonLabel={isMobile}
              fullScreenDialog={isMobile}
            />
            <ThemeModeButton hideLabel={isMobile} />
            <SideBarButton
              dataMonitoringId={monitoringIds.GOTO_RULES}
              icon={<GoogleDriveDocumentsIcon />}
              name="Rules"
              href={guild.rulesLink}
              hideLabel={isMobile}
            />
            <SideBarButton
              dataMonitoringId={monitoringIds.GOTO_DISCORD}
              icon={<DiscordIcon />}
              name="Discord"
              href={guild.discordInviteLink}
              hideLabel={isMobile}
            />
            <SignOutButton isMobile={isMobile} />
          </Stack>
        </Stack>
      </Drawer>
      <Box ml={width}>{children}</Box>
    </>
  );
};
