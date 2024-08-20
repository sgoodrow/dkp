"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { uiRoutes } from "@/app/uiRoutes";
import { NestedHeaderLayout } from "@/ui/navigation/layouts/NestedHeaderLayout";
import { Summarize } from "@mui/icons-material";
import { Tab, Tabs } from "@mui/material";
import { usePathname } from "next/navigation";

export const RaidActivityRouteLayout: FCWithChildren<{ id: number }> = ({
  id,
  children,
}) => {
  const { data } = trpc.raidActivity.get.useQuery({ id });
  const pathname = usePathname();
  return (
    <NestedHeaderLayout
      name={data ? uiRoutes.raidActivity.name(data) : undefined}
      backHref={uiRoutes.raidActivities.href()}
    >
      <Tabs
        aria-label="Raid activity tabs"
        value={pathname}
        variant="scrollable"
      >
        <Tab
          label="Summary"
          icon={<Summarize />}
          iconPosition="start"
          href={uiRoutes.raidActivity.href(id)}
          value={uiRoutes.raidActivity.href(id)}
        />
        <Tab
          label="Attendance"
          icon={<uiRoutes.raidActivities.icon />}
          iconPosition="start"
          href={uiRoutes.raidActivityAttendance.href(id)}
          value={uiRoutes.raidActivityAttendance.href(id)}
        />
        <Tab
          label="Purchases"
          icon={<uiRoutes.purchases.icon />}
          iconPosition="start"
          href={uiRoutes.raidActivityPurchases.href(id)}
          value={uiRoutes.raidActivityPurchases.href(id)}
        />
        <Tab
          label="Adjustments"
          icon={<uiRoutes.adjustments.icon />}
          iconPosition="start"
          href={uiRoutes.raidActivityAdjustments.href(id)}
          value={uiRoutes.raidActivityAdjustments.href(id)}
        />
      </Tabs>
      {children}
    </NestedHeaderLayout>
  );
};
