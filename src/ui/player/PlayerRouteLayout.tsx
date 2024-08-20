"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { uiRoutes } from "@/app/uiRoutes";
import { NestedHeaderLayout } from "@/ui/navigation/layouts/NestedHeaderLayout";
import { Summarize } from "@mui/icons-material";
import { Tab, Tabs } from "@mui/material";
import { usePathname } from "next/navigation";

export const PlayerRouteLayout: FCWithChildren<{ id: string }> = ({
  id,
  children,
}) => {
  const { data } = trpc.user.get.useQuery({ id });
  const pathname = usePathname();
  return (
    <NestedHeaderLayout
      name={data ? uiRoutes.player.name(data.displayName) : undefined}
      backHref={uiRoutes.players.href()}
    >
      <Tabs aria-label="Player tabs" value={pathname} variant="scrollable">
        <Tab
          label="Summary"
          icon={<Summarize />}
          iconPosition="start"
          href={uiRoutes.player.href(id)}
          value={uiRoutes.player.href(id)}
        />
        <Tab
          label="Attendance"
          icon={<uiRoutes.raidActivities.icon />}
          iconPosition="start"
          href={uiRoutes.playerAttendance.href(id)}
          value={uiRoutes.playerAttendance.href(id)}
        />
        <Tab
          label="Purchases"
          icon={<uiRoutes.purchases.icon />}
          iconPosition="start"
          href={uiRoutes.playerPurchases.href(id)}
          value={uiRoutes.playerPurchases.href(id)}
        />
        <Tab
          label="Adjustments"
          icon={<uiRoutes.adjustments.icon />}
          iconPosition="start"
          href={uiRoutes.playerAdjustments.href(id)}
          value={uiRoutes.playerAdjustments.href(id)}
        />
      </Tabs>
      {children}
    </NestedHeaderLayout>
  );
};
