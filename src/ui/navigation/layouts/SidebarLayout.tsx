"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { uiRoutes } from "@/app/uiRoutes";
import { BackButton } from "@/ui/navigation/buttons/BackButton";
import { SideBarButton } from "@/ui/navigation/buttons/SidebarButton";
import { SignOutButton } from "@/ui/navigation/buttons/SignOutButton";
import { ThemeModeButton } from "@/ui/navigation/buttons/ThemeModeButton";
import { WelcomeDialogButton } from "@/ui/navigation/buttons/WelcomeDialogButton";
import { GoogleDriveDocumentsIcon } from "@/ui/shared/components/icons/GoogleDriveDocumentsIcon";
import { ProfileIcon } from "@/ui/shared/components/icons/ProfileIcon";
import {
  MonitoringId,
  monitoringIds,
} from "@/ui/shared/constants/monitoringIds";
import { SvgIconComponent } from "@mui/icons-material";
import { Box, Divider, Drawer, Paper, Stack } from "@mui/material";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type SidebarItem = {
  href: () => string;
  name: string;
  icon: SvgIconComponent;
  dataMonitoringId: MonitoringId;
  adminOnly?: boolean;
  badgeCount?: number;
  badgeHref?: string;
  badgeTooltip?: string;
  selectedIfIncludes?: boolean;
};

const MOBILE_WIDTH = "56px";
const DESKTOP_WIDTH = "210px";

const PROFILE_IMAGE_SIZE = 24;

export const SidebarLayout: FCWithChildren<{ isMobile: boolean }> = ({
  isMobile,
  children,
}) => {
  const path = usePathname();
  const { data: guild } = trpc.guild.get.useQuery();
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

  const { onNestedRoute, items } = useMemo<{
    onNestedRoute: boolean;
    items: SidebarItem[];
  }>(() => {
    if (path.startsWith(uiRoutes.admin.href())) {
      return {
        onNestedRoute: true,
        items: [
          uiRoutes.admin,
          uiRoutes.raidActivityTypes,
          {
            ...uiRoutes.transactions,
            badgeHref: uiRoutes.transactions.href(),
            badgeCount: unclearedTransactionsCount,
            badgeTooltip: "Number of uncleared transactions",
          },
          uiRoutes.bots,
          uiRoutes.apiKeys,
        ],
      };
    }

    return {
      onNestedRoute: false,
      items: [
        uiRoutes.home,
        uiRoutes.players,
        uiRoutes.raidActivities,
        uiRoutes.purchases,
        uiRoutes.adjustments,
        uiRoutes.leaderboard,
        uiRoutes.items,
        {
          ...uiRoutes.admin,
          badgeHref: uiRoutes.transactions.href(),
          badgeCount: unclearedTransactionsCount,
          badgeTooltip: "Number of uncleared transactions",
        },
      ],
    };
  }, [path, unclearedTransactionsCount]);

  const width = isMobile ? MOBILE_WIDTH : DESKTOP_WIDTH;

  useEffect(() => {
    if (!onNestedRoute) {
      setPrevPageHref(path);
    }
  }, [onNestedRoute, path]);

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
            {onNestedRoute ? (
              <BackButton
                data-monitoring-id={monitoringIds.GO_BACK}
                href={prevPageHref || ""}
                hideLabel={isMobile}
              />
            ) : (
              <SideBarButton
                dataMonitoringId={uiRoutes.player.dataMonitoringId}
                href={uiRoutes.player.href({ userId: user?.id || "" })}
                label={user?.displayName}
                labelColor={user?.displayRole.color}
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
                badgeHref,
                badgeTooltip,
                selectedIfIncludes,
              }) => {
                if (adminOnly && !isAdmin) {
                  return null;
                }
                return (
                  <SideBarButton
                    key={dataMonitoringId}
                    dataMonitoringId={dataMonitoringId}
                    href={href()}
                    label={name}
                    icon={<Icon />}
                    hideLabel={isMobile}
                    selectedIfIncludes={selectedIfIncludes}
                    badge={{
                      count: badgeCount,
                      href: badgeHref,
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
            {guild?.rulesLink !== null && (
              <SideBarButton
                dataMonitoringId={monitoringIds.GOTO_RULES}
                icon={<GoogleDriveDocumentsIcon />}
                label="Rules"
                href={guild?.rulesLink}
                hideLabel={isMobile}
              />
            )}
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
