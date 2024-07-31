"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { uiRoutes } from "@/app/uiRoutes";
import { guild } from "@/shared/constants/guild";
import { BackButton } from "@/ui/navigation/buttons/BackButton";
import { SideBarButton } from "@/ui/navigation/buttons/SidebarButton";
import { SignOutButton } from "@/ui/navigation/buttons/SignOutButton";
import { ThemeModeButton } from "@/ui/navigation/buttons/ThemeModeButton";
import { WelcomeDialogButton } from "@/ui/navigation/buttons/WelcomeDialogButton";
import { DiscordIcon } from "@/ui/shared/components/icons/DiscordIcon";
import { GoogleDriveDocumentsIcon } from "@/ui/shared/components/icons/GoogleDriveDocumentsIcon";
import { ProfileIcon } from "@/ui/shared/components/icons/ProfileIcon";
import { PlayerLink } from "@/ui/shared/components/links/PlayerLink";
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
  badgeCount?: number;
  badgeTooltip?: string;
};

const MOBILE_WIDTH = "56px";
const DESKTOP_WIDTH = "210px";

const PROFILE_IMAGE_SIZE = 24;

export const SidebarPane: FCWithChildren<{ isMobile: boolean }> = ({
  isMobile,
  children,
}) => {
  const pathname = usePathname();
  const { data: isAdmin } = trpc.user.isAdmin.useQuery();
  const { data: dkp } = trpc.wallet.getUserDkp.useQuery();
  const { data: unclearedTransactionsCount } =
    trpc.wallet.countUnclearedTransactions.useQuery(undefined, {
      enabled: isAdmin,
    });
  const { data: user } = trpc.user.get.useQuery();
  const [prevPageHref, setPrevPageHref] = useState<string>(
    uiRoutes.home.href(),
  );

  const onAdminPage = pathname.startsWith(uiRoutes.admin.href());

  const width = isMobile ? MOBILE_WIDTH : DESKTOP_WIDTH;

  const items: SidebarItem[] = onAdminPage
    ? [
        uiRoutes.admin,
        uiRoutes.raidActivityTypes,
        {
          ...uiRoutes.transactions,
          badgeCount: unclearedTransactionsCount,
          badgeTooltip: "Number of uncleared transactions",
        },
        uiRoutes.bots,
        uiRoutes.apiKeys,
      ]
    : [
        uiRoutes.home,
        uiRoutes.players,
        uiRoutes.raidActivities,
        uiRoutes.purchases,
        uiRoutes.adjustments,
        uiRoutes.leaderboard,
        uiRoutes.items,
        {
          ...uiRoutes.admin,
          badgeCount: unclearedTransactionsCount,
          badgeTooltip: "Number of uncleared transactions",
        },
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
              <SideBarButton
                dataMonitoringId={uiRoutes.player.dataMonitoringId}
                href={uiRoutes.player.href({ userId: user?.id || "" })}
                name={<PlayerLink user={user} />}
                icon={<ProfileIcon size={PROFILE_IMAGE_SIZE} />}
                hideLabel={isMobile}
                badge={{
                  count: dkp?.current,
                  tooltip: "Current DKP",
                  showZero: true,
                }}
              />
            )}
            {items.map(
              ({
                href,
                name,
                icon: Icon,
                dataMonitoringId,
                adminOnly,
                badgeCount,
                badgeTooltip,
              }) => {
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
                    badge={{
                      count: badgeCount,
                      tooltip: badgeTooltip,
                      showZero: false,
                    }}
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
      <Box ml={width} display="flex" flexGrow={1}>
        {children}
      </Box>
    </>
  );
};
